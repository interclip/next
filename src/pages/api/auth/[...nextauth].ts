import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { DemoProvider, Web3Provider } from '@utils/api/auth/providers';
import { IS_PROD } from '@utils/constants';
import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import GitlabProvider from 'next-auth/providers/gitlab';

const prisma = new PrismaClient();

const providers = [
  Web3Provider,
  process.env.DISCORD_CLIENT_ID &&
    process.env.DISCORD_CLIENT_SECRET &&
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      /* Todo(ft): we need to prevent Discord from signing in when the user's email is not verified
    profile(profile: DiscordProfile) {
      if (profile.avatar === null) {
        const defaultAvatarNumber = parseInt(profile.discriminator) % 5;
        profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
      } else {
        const format = profile.avatar.startsWith('a_') ? 'gif' : 'png';
        profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
      }
      return {
        id: profile.id,
        name: profile.username,
        email: profile.email,
        image: profile.image_url,
        verified: profile.verified,
      };
    },
    */
    }),
  process.env.GITLAB_CLIENT_ID &&
    process.env.GITLAB_CLIENT_SECRET &&
    GitlabProvider({
      clientId: process.env.GITLAB_CLIENT_ID,
      clientSecret: process.env.GITLAB_CLIENT_SECRET,
    }),
];

if (!IS_PROD) {
  providers.push(DemoProvider as any);
}

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
  },
  providers: providers as any,
});
