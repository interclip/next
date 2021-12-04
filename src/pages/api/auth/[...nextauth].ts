import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { IS_PROD } from '@utils/constants';
import { db } from '@utils/prisma';
import { internet, name } from 'faker';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import DiscordProvider from 'next-auth/providers/discord';
import GitlabProvider from 'next-auth/providers/gitlab';
import isEmail from 'validator/lib/isEmail';

const prisma = new PrismaClient();

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'database',
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
  },
  secret: process.env.AUTH_SECRET,
  jwt: {
    secret: process.env.JWT_SECRET,
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
        async authorize(credentials) {
          if (credentials?.email && isEmail(credentials.email)) {
            const existingUser = await db.user.findUnique({
              where: {
                email: credentials.email,
              },
            });
            if (existingUser) {
              return existingUser;
            } else {
              return await db.user.create({
                data: {
                  email: credentials.email,
                  name: name.firstName(),
                  isStaff: true,
                  image: internet.avatar(),
                },
              });
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
