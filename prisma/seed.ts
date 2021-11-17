//import 'tsconfig-paths/register';

import { PrismaClient } from '@prisma/client';
import cliProgress from 'cli-progress';
import faker from 'faker';
import fetch from 'node-fetch';
import youtubeVideo from 'random-youtube-music-video';

import { storeLinkPreviewInCache } from '../src/lib/clipPreview';
import { dateAddDays } from '../src/lib/dates';
import { getRandomID } from '../src/lib/generateID';

const db = new PrismaClient();

interface WikipediaArticle {
  pageid: number;
  ns: number;
  title: string;
  images: {
    ns: number;
    description: string;
  }[];
}

interface WikipediaResponse {
  batchcomplete: string;
  continue: {
    grncontinue: string;
    continue: string;
  };
  warnings: any;
  query: {
    pages: {
      [key: string]: WikipediaArticle;
    };
  };
}

const randomWikipediaArticle = async (amount: number) => {
  const responce = await fetch(
    `https://en.wikipedia.org/w/api.php?format=json&action=query&generator=random&grnnamespace=0&prop=revisions|images&rvprop=content&grnlimit=${amount}`,
  );
  try {
    const data: WikipediaResponse = await responce.json();
    const urls = Object.values(data.query.pages).map(
      (dp) => `https://en.wikipedia.org/wiki/${encodeURIComponent(dp.title)}`,
    );
    return urls;
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

async function main() {
  await db.clip.deleteMany();
  console.log('All clips have been deleted 🗑️');
  await db.account.deleteMany();
  console.log('All user accounts have been deleted 🗑️');
  await db.user.deleteMany();
  console.log('All users have been deleted 🗑️');

  const userIDs: any[] = [undefined];

  // Fake User
  for (let i = 0; i < 10; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const username = `${firstName}${lastName}`.toLocaleLowerCase();
    console.log(`Seeding Fake User - @${username} 👨‍🎤`);
    userIDs.push(
      (
        await db.user.create({
          data: {
            email: faker.internet.email(),
            username,
            isStaff: false,
            name: `${firstName} ${lastName}`,
            image: faker.internet.avatar(),
          },
        })
      ).id,
    );
  }

  const amountsToGenerate = {
    wikipedia: 60,
    youtube: 20,
  };

  const urls = new Set([
    ...(await randomWikipediaArticle(amountsToGenerate.wikipedia)),
  ]);

  console.log('Generating YouTube videos');
  const youtubeProgress = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic,
  );
  youtubeProgress.start(amountsToGenerate.youtube, 0, { speed: 'N/A' });

  for (let i = 0; i < amountsToGenerate.youtube; i++) {
    const youtubeURL = await youtubeVideo.getRandomMusicVideoUrl(true);
    urls.add(youtubeURL);
    youtubeProgress.update(i);
  }

  youtubeProgress.stop();

  for (const url of urls) {
    try {
      const ownerID = userIDs[Math.floor(Math.random() * userIDs.length)];
      const code = getRandomID(5);
      console.log(`Seeding fake clip - ${url} (${code} 🔑) 🌐`);
      await db.clip.create({
        data: {
          url,
          code,
          ownerID,
          expiresAt: dateAddDays(
            new Date(),
            Math.floor((Math.random() + 1) * 90),
          ),
        },
      });
      await storeLinkPreviewInCache(url);
    } catch (e) {
      console.error(e);
      continue;
    }
  }
}

console.log('Starting main');
main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    console.log('DC main');
    await db.$disconnect();
    process.exit();
  });
console.log('Finish main');
