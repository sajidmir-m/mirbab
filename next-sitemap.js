/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://www.mirbabatourtravels.in', // aapka live domain
    generateRobotsTxt: true, // robots.txt bhi generate hoga
    sitemapSize: 5000, // large sites ke liye
    changefreq: 'weekly', // Google ko batata hai pages kitni frequently change hote hain
    priority: 0.8, // default priority for pages
    exclude: ['/admin/*', '/login'], // agar koi pages Google ko index nahi karne hain
    transform: async (config, path) => {
      // har page ka final sitemap entry
      return {
        loc: path, // page ka URL
        changefreq: 'weekly',
        priority: path === '/' ? 1.0 : 0.8,
        lastmod: new Date().toISOString(),
      }
    },
  }
  