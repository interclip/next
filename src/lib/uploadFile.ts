import formatBytes from '@utils/formatBytes';
import { ChangeEvent } from 'react';
import { convertXML } from 'simple-xml-to-json';

import { IS_PROD } from './constants';
import { getRandomID } from './generateID';

const uploadFile = async (
  filesEndpoint: string,
  e: any | ChangeEvent<HTMLInputElement>,
): Promise<string> => {
  if (!IS_PROD) {
    return `https://files.interclip.app/${getRandomID(5)}`;
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
        console.log(erorrMsg);
        throw new Error('Upload failed.');
    }
  }
};

export default uploadFile;
