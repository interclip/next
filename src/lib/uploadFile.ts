import formatBytes from '@utils/formatBytes';
import type { S3 } from 'aws-sdk';
import toast from 'react-hot-toast';
import { convertXML } from 'simple-xml-to-json';
import { Web3Storage } from 'web3.storage';

import { APIError, requestClip } from './api/client/requestClip';
import {
  ipfsGateway,
  IS_PROD,
  maxIPFSUploadSize,
  web3StorageToken,
} from './constants';
import { getClipHash } from './generateID';

function makeStorageClient() {
  if (!web3StorageToken) {
    throw new Error('Missing Web3.storage token');
  }
  return new Web3Storage({ token: web3StorageToken });
}

/**
 * Checks whether a specified CID already exists on IPFS
 */
export const ipfsCheckCID = async (cid: string): Promise<boolean> => {
  const client = makeStorageClient();
  const res = await client.get(cid);
  return !res || !res.ok ? false : true;
};

export const ipfsUpload = (
  setProgress: React.Dispatch<React.SetStateAction<number>>,
  setFileURL: React.Dispatch<React.SetStateAction<string | null>>,
  setCode: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  return async (files: File[]) => {
    if (web3StorageToken) {
      const Web3Storage = (await import('web3.storage')).Web3Storage;
      const client = new Web3Storage({ token: web3StorageToken });

      if (!files || files.length === 0) {
        toast.error('Please select a file');
        return;
      }

      // show the root cid as soon as it's ready
      const onRootCidReady = async (cid: string) => {
        if (await ipfsCheckCID(cid)) {
          // Todo(ft): handle files already on IPFS, maybe by pinning them
          //throw new DuplicateError('Already on IPFS');
        }
      };

      // when each chunk is stored, update the percentage complete and display
      const totalSize = [...files]
        .map((f) => f.size)
        .reduce((a, b) => a + b, 0);
      let uploaded = 0;

      const onStoredChunk = (size: number) => {
        uploaded += size;
        const pct = uploaded / totalSize;
        setProgress(pct * 100);
      };

      const filesOverLimit = [...files].filter(
        (file) => file.size > maxIPFSUploadSize,
      );

      if (filesOverLimit.length > 0) {
        for (const file of filesOverLimit) {
          toast.error(`${file.name} is too large, aborting upload`);
        }
        return;
      }

      const rootCID = await client.put(files, {
        maxRetries: 3,
        wrapWithDirectory: files.length > 1,
        onRootCidReady,
        onStoredChunk,
      });

      setProgress(0);

      const isVideo = files[0].type.match(new RegExp('video/.{1,10}'));
      let url;
      if (files.length > 1) {
        url = `https://ipfs.io/ipfs/${rootCID}`;
      } else {
        url = isVideo
          ? `https://ipfs.io/ipfs/${rootCID}?filename=${files![0]?.name}`
          : `${ipfsGateway}/ipfs/${rootCID}?filename=${files![0]?.name}`;
      }
      setFileURL(url);
      const clipResponse = await requestClip(url);

      if (clipResponse.status === 'error') {
        toast.error(`An error has occured: ${clipResponse.result}`);
        return;
      }

      setCode(
        clipResponse.result.code.slice(0, clipResponse.result.hashLength),
      );
    } else {
      toast.error('Web3.storage token not provided');
    }
  };
};

const uploadFile = async (
  filesEndpoint: string,
  files: File[],
): Promise<string> => {
  if (files.length > 1) {
    toast(
      'Uploading multiple files at once to our storage server is not yet supported. Only the first file will be uploaded.',
    );
  }

  if (!IS_PROD) {
    return `${filesEndpoint}/${getClipHash(filesEndpoint).slice(0, 5)}`;
  }

  const file = files[0];

  const filename = encodeURIComponent(file.name);
  const fileType = encodeURIComponent(file.type);

  const res = await fetch(`/api/uploadFile?name=${filename}&type=${fileType}`);
  if (!res.ok) {
    switch (res.status) {
      case 404:
        throw new APIError('API Endpoint not found');
      case 500:
        throw new APIError('Generic fail');
      case 503:
        throw new APIError((await res.json()).result);
    }

    throw new APIError(await res.text());
  }
  const { url, fields }: S3.PresignedPost = await res.json();
  const formData = new FormData();
  // eslint-disable-next-line unicorn/no-array-for-each
  Object.entries({ ...fields, file }).forEach(
    ([key, value]: [key: string, value: any]) => {
      formData.append(key, value);
    },
  );
  const upload = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (upload.ok) {
    return `${filesEndpoint}/${fields.key}`;
  } else {
    const plainText = await upload.text();
    const jsonResponse = convertXML(plainText);
    const erorrMsg = jsonResponse.Error.children[0].Code.content;

    switch (erorrMsg) {
      case 'EntityTooLarge':
        const fileSize = jsonResponse.Error.children[2].ProposedSize.content;
        throw new APIError(`File too large (${formatBytes(fileSize)})`);
      case 'AccessDenied':
        throw new APIError('Access Denied to the bucket');
      default:
        throw new APIError('Upload failed.');
    }
  }
};

export default uploadFile;
