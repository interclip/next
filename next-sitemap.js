/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: process.env.BASE_URL,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  generateRobotsTxt: true,
  exclude: ['/auth/*', '/500', '/admin'],
  outDir: 'public',
};
