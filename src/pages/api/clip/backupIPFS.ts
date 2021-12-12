import { db } from '@utils/prisma';
import { create } from 'ipfs-http-client';

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
});

/**
 * Upload a post to ipfs
 * @param id - Id of the post to be uploaded to IPFS
 */
export const uploadToIPFS = async (id: number) => {
  new Promise(async (resolve) => {
    const clip = await db.clip.findUnique({
      where: { id },
      select: {
        id: true,
        createdAt: true,
        url: true,
        code: true,
        ownerID: true,
      },
    });
    const { path } = await client.add(
      JSON.stringify({
        post: clip,
      }),
    );

    await db.clip.update({
      where: { id: clip?.id },
      data: { ipfsHash: path },
    });
    resolve(path);
  });
};
