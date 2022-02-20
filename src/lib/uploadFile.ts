import formatBytes from '@utils/formatBytes';
import { ChangeEvent } from 'react';
import { convertXML } from 'simple-xml-to-json';
import { Web3Storage } from 'web3.storage';

import { IS_PROD, web3StorageToken } from './constants';
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

const uploadFile = async (
  filesEndpoint: string,
  e: any | ChangeEvent<HTMLInputElement>,
): Promise<string> => {
  if (!IS_PROD) {
    return `${filesEndpoint}/${getClipHash(filesEndpoint).slice(0, 5)}`;
  }

  const file = e?.dataTransfer?.files[0] || e.target?.files[0];
  if (!file) {
    throw new Error('No file provided.');
  }
  const filename = encodeURIComponent(file.name);
  const fileType = encodeURIComponent(file.type);

  const res = await fetch(
    `/api/uploadURL?file=${filename}&fileType=${fileType}`,
  );
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('API Endpoint not fond');
    }
    throw new Error(await res.text());
  }
  const { url, fields } = await res.json();
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
        throw new Error(`File too large (${formatBytes(fileSize)})`);
      default:
        throw new Error('Upload failed.');
    }
  }
};

export default uploadFile;
