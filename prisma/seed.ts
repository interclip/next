//import 'tsconfig-paths/register';

import { PrismaClient } from '@prisma/client';
import cliProgress from 'cli-progress';
import faker from 'faker';
import fetch from 'node-fetch';
import { Octokit } from 'octokit';
import youtubeVideo from 'random-youtube-music-video';

import { storeLinkPreviewInCache } from '../src/lib/clipPreview';
import { dateAddDays } from '../src/lib/dates';
import { getClipHash } from '../src/lib/generateID';
import { randomNumber } from '../src/lib/random';

const db = new PrismaClient();
const octokit = new Octokit({});

const getGitHubRepos = async (amount: number): Promise<string[]> => {
  const octoResp = await octokit.rest.search.repos({
    q: 'language:typescript',
    sort: 'stars',
    per_page: amount,
  });
  return octoResp.data.items.map((item) => item.html_url);
};

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
  } catch (error) {
    console.error(error);
    return ['https://www.wikipedia.org/'];
  }
};

async function main() {
  await db.clip.deleteMany();
  console.log('All clips have been deleted 🗑️');
  await db.account.deleteMany();
  console.log('All user accounts have been deleted 🗑️');
  await db.user.deleteMany();
  console.log('All users have been deleted 🗑️');

  const userIDs: Array<string | undefined> = [undefined];

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
            image: `https://avatars.dicebear.com/api/human/${username}.svg`,
          },
        })
      ).id,
    );
  }

  const amountsToGenerate = {
    wikipedia: 60,
    youtube: 10,
    github: 30,
  };

  const urls = new Set([
    ...(await randomWikipediaArticle(amountsToGenerate.wikipedia)),
    ...(await getGitHubRepos(amountsToGenerate.github)),
  ]);

  console.log('Generating YouTube videos');
  const youtubeProgress = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic,
  );
  youtubeProgress.start(amountsToGenerate.youtube, 0, { speed: 'N/A' });

  for (let i = 0; i < amountsToGenerate.youtube; i++) {
    const youtubeURL = await youtubeVideo.getRandomMusicVideoUrl(true);
    if (youtubeURL) urls.add(youtubeURL);
    youtubeProgress.update(i);
  }

  youtubeProgress.stop();

  for (const url of urls.values()) {
    try {
      const ownerID = userIDs[Math.floor(Math.random() * userIDs.length)];
      const code = getClipHash(url);
      const expiresAt = dateAddDays(new Date(), randomNumber(-20, 200));
      console.log(`Seeding fake clip - ${url} (${code.slice(0, 5)} 🔑) 🌐 `);
      await db.clip.create({
        data: {
          url,
          code,
          ownerID,
          expiresAt,
        },
      });
      await storeLinkPreviewInCache(url);
    } catch (error) {
      console.error(error);
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
