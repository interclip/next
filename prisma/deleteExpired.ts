//import 'tsconfig-paths/register';

import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  const allExpiryCandidates = await db.clip.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
  console.log(`Deleted ${allExpiryCandidates.count} expired clips`);
}

console.log('Starting cleanup');
main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
    process.exit();
  });
console.log('Finish main');
