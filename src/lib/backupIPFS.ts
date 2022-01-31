import { db } from '@utils/prisma';
import Blob from 'fetch-blob';
import File from 'fetch-blob/file.js';
import { Web3Storage } from 'web3.storage';

import { web3StorageToken } from './constants';

/**
 * Upload a post to ipfs
 * @param id - Id of the post to be uploaded to IPFS
 */
export const uploadToIPFS = async (id: number) => {
  new Promise(async (reject, resolve) => {
    const clip = await db.clip.findUnique({
      where: { id },
      select: {
        createdAt: true,
        url: true,
        code: true,
        ownerID: true,
      },
    });

    if (!web3StorageToken) {
      reject('Missing web3.storage token');
      return;
    }

    const client = new Web3Storage({ token: web3StorageToken });
    const jsonToUpload = JSON.stringify(clip);
    const rootCID = await client.put(
      [
        new File(
          [new Blob([jsonToUpload], { type: 'application/json' })],
          'clip.json',
        ),
      ],
      {
        maxRetries: 3,
        wrapWithDirectory: false,
      },
    );

    await db.clip.update({
      where: { id },
      data: { ipfsHash: rootCID },
    });
    resolve(rootCID);
  });
};
