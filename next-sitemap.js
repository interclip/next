// https://github.com/iamvishnusankar/next-sitemap/blob/master/README.md

module.exports = {
  siteUrl: process.env.BASE_URL,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  generateRobotsTxt: true,
  exclude: [],
  outDir: 'public',
};
