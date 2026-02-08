/** @type {import('next').NextConfig} */
module.exports = {
  turbopack: {},
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { hostname: 'avatar.tobi.sh' },
      { hostname: 'avatars.githubusercontent.com' },
      { hostname: 'images.weserv.nl' },
      { hostname: 'cdn.discordapp.com' },
    ],
  },
  env: {
    BASE_URL: process.env.BASE_URL,
  },
};
