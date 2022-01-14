import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { createUser } from '@utils/api/createUser';
import { IS_PROD } from '@utils/constants';
import { db } from '@utils/prisma';
import { utils } from 'ethers';
import { name } from 'faker';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import DiscordProvider from 'next-auth/providers/discord';
import GitlabProvider from 'next-auth/providers/gitlab';
import isEmail from 'validator/lib/isEmail';

const prisma = new PrismaClient();

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
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
        id: 'devlogin',
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
              return await createUser({
                email: credentials.email,
                name: name.firstName(),
                isStaff: true,
              });
            }
          }

          // Return null if user data could not be retrieved
          return null;
        },
      }),
    CredentialsProvider({
      name: 'Web3',
      id: 'web3',
      authorize: async (credentials) => {
        if (
          !(credentials?.address && credentials.nonce && credentials.signature)
        ) {
          return null;
        }
        const address = utils.verifyMessage(
          credentials.nonce,
          credentials.signature,
        );

        if (address.toLowerCase() !== credentials.address.toLowerCase()) {
          console.error(
            `Adresses don't match: ${address} vs ${credentials.address}`,
          );
          return null;
        }
        const existingUser = await db.user.findUnique({
          where: {
            email: credentials.address,
          },
        });
        if (existingUser) {
          return existingUser;
        } else {
          const newUser = await createUser({
            email: credentials.address,
            name: name.firstName(),
            isStaff: true,
          });
          return newUser;
        }
      },
      type: 'credentials',
      credentials: {
        address: {
          label: 'Web3 address',
          type: 'text',
        },
        nonce: {
          type: 'text',
        },
        signature: {
          type: 'text',
        },
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
