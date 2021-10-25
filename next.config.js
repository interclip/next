/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa');

module.exports = withPWA({
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
  },
  reactStrictMode: true,
  images: {
    domains: [
      'avatar.tobi.sh',
      'avatars.githubusercontent.com',
      'thispersondoesnotexist.com',
      'images.weserv.nl',
      'cdn.fakercloud.com',
    ],
  },
});
