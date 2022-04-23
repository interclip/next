import { Prisma } from '@prisma/client';
import fs from 'fs/promises';

import { db } from '../src/lib/prisma';

export interface MigrationData {
  type: string;
  version?: string;
  comment?: string;
  name?: string;
  database?: string;
  data?: OldClip[];
}

export interface OldClip {
  id: string;
  usr: string;
  url: string;
  date: string;
  expires?: string;
}

(async function () {
  const data: MigrationData[] = JSON.parse(
    await fs.readFile('db.json', 'utf-8'),
  );
  const dataObject = data.find((object) => object.database);
  if (dataObject && dataObject.data) {
    for (const clip of dataObject.data) {
      console.log(`Creating ${clip.usr}`);
      await db.clip
        .create({
          data: {
            url: clip.url,
            code: clip.usr,
            expiresAt: clip.expires ? new Date(clip.expires) : undefined,
            createdAt: new Date(clip.date),
          },
        })
        .catch((error) => {
          if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
              // Duplicates are ok
              return;
            }
            throw error;
          }
        });
    }
  }
})();
