//import 'tsconfig-paths/register';

import { PrismaClient } from '@prisma/client';
import { dateAddDays } from '../src/lib/dates';
import faker from 'faker';

const getRandomID = (length = 5) => {
  return Math.random().toString(36).substr(2, length);
};

const db = new PrismaClient();

async function main() {
  await db.clip.deleteMany();
  console.log('All clips have been deleted 🗑️');
  await db.account.deleteMany();
  console.log('All user accounts have been deleted 🗑️');
  await db.user.deleteMany();
  console.log('All users have been deleted 🗑️');

  const userIDs: any[] = [undefined];

  // Fake User
  for (let i = 0; i < 50; i++) {
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
          },
        })
      ).id,
    );
  }
  for (let i = 0; i < 250; i++) {
    const ownerID = userIDs[Math.floor(Math.random() * userIDs.length)];
    const url = `${faker.internet.url()}/${faker.lorem
      .words(3)
      .split(' ')
      .join('-')}`;
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
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
