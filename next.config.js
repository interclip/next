/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa');

module.exports = withPWA({
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
  },
  swcMinify: true,
  experimental: {
    concurrentFeatures: true,
    serverComponents: true,
  },
  optimizeCss: true,
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: [
      'avatar.tobi.sh',
      'avatars.githubusercontent.com',
      'thispersondoesnotexist.com',
      'images.weserv.nl',
      'cdn.fakercloud.com',
    ],
  },
});
