import formatBytes from '@utils/formatBytes';
import type { S3 } from 'aws-sdk';
import toast from 'react-hot-toast';
import { convertXML } from 'simple-xml-to-json';

import { APIError, requestClip } from './api/client/requestClip';
import {
  ipfsGateway,
  IS_PROD,
  maxIPFSUploadSizeInfura as maxIPFSUploadSize,
} from './constants';
import { getClipHash } from './generateID';

interface InfuraResponse {
  Hash: string;
  Name: string;
  Size: string;
}

export const ipfsUpload = (
  setProgress: React.Dispatch<React.SetStateAction<number>>,
  setFileURL: React.Dispatch<React.SetStateAction<string | null>>,
  setCode: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  return async (files: File[]) => {
    if (!files || files.length === 0) {
      toast.error('Please select a file');
      return;
    }

    const filesOverLimit = [...files].filter(
      (file) => file.size > maxIPFSUploadSize,
    );

    if (filesOverLimit.length > 0) {
      for (const file of filesOverLimit) {
        toast.error(`${file.name} is too large, aborting upload`);
      }
      return;
    }

    const formData = new FormData();
    for (const file of files) {
      formData.append('file', file);
    }

    const infuraResponse = await fetch(
      `https://ipfs.infura.io:5001/api/v0/add?wrap-with-directory=${files.length > 1 ? 'true' : 'false'
      }`,
      {
        method: 'post',
        body: formData,
      },
    ).catch(() => {});

    if (!infuraResponse || !infuraResponse.ok) {
      toast.error(
        `File${
          files.length > 1 ? 's' : ''
        } failed to upload (problem with IPFS host)`,
      );
      return;
    }

    const infuraDataFiles: string = await infuraResponse.text();

    const uploadedFiles: InfuraResponse[] = infuraDataFiles
      .split(/\r\n|\n\r|\n|\r/)
      .map((dataLine) => {
        if (dataLine) return JSON.parse(dataLine);
      })
      .filter((item) => item !== undefined);

    if (uploadedFiles === undefined || uploadedFiles.length === 0) {
      toast.error(`File${files.length > 1 ? 's' : ''} failed to upload`);
      return;
    }

    const rootCID =
      files.length > 1
        ? uploadedFiles.find((file) => file.Name === '')?.Hash
        : uploadedFiles[0].Hash;

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
      toast.error(`An error has occurred: ${clipResponse.result}`);
      return;
    }

    setCode(clipResponse.result.code.slice(0, clipResponse.result.hashLength));
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
    const errorMsg = jsonResponse.Error.children[0].Code.content;

    switch (errorMsg) {
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
