import { IS_PROD } from '@utils/constants';
import formatBytes from '@utils/formatBytes';
import { getClipHash } from '@utils/generateID';
import { S3 } from 'aws-sdk';
import { convertXML } from 'simple-xml-to-json';

export class APIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'APIError';
  }
}

export const hello = () => {
  return 'bruh';
};
const uploadFile = async (
  filesEndpoint: string,
  files: File[],
): Promise<string> => {
  if (files.length > 1) {
    //
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
