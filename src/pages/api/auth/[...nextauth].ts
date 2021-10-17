import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

import DiscordProvider from 'next-auth/providers/discord';
import GitlabProvider from 'next-auth/providers/gitlab';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@utils/prisma';
const IS_PROD = process.env.NODE_ENV === 'production';

import isEmail from 'validator/lib/isEmail';

const prisma = new PrismaClient();

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  theme: {
    logo: 'https://raw.githubusercontent.com/interclip/interclip/main/img/logo.svg',
    colorScheme: 'auto',
  },
  session: {
    jwt: true,
  },
  providers: [
    !IS_PROD &&
      CredentialsProvider({
        name: 'a demo account',
        credentials: {
          email: {
            label: 'Email address',
            type: 'text',
            placeholder: 'admin@example.org',
          },
        },
        async authorize(credentials: { email: string }) {
          if (credentials.email && isEmail(credentials.email)) {
            const existingUser = await db.user.findUnique({
              where: {
                email: credentials.email,
              },
            });
            if (existingUser) {
              return existingUser;
            } else {
              const newUser = await db.user.create({
                data: {
                  email: credentials.email,
                },
              });
              return newUser;
            }
          }

          // Return null if user data could not be retrieved
          return null;
        },
      }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
    GitlabProvider({
      clientId: process.env.GITLAB_CLIENT_ID,
      clientSecret: process.env.GITLAB_CLIENT_SECRET,
    }),
  ],
});
