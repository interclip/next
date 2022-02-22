/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa');

module.exports = withPWA({
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    skipWaiting: true,
    buildExcludes: [/middleware-manifest\.json$/],
  },
  swcMinify: true,
  optimizeCss: true,
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: [
      'avatar.tobi.sh',
      'avatars.githubusercontent.com',
      'images.weserv.nl',
      'cdn.discordapp.com',
    ],
  },
  env: {
    WEB3_TOKEN: process.env.WEB3_TOKEN,
  },
});
