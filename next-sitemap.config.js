/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.mirbabatourtravels.in', // ✅ Double-check this line!
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/api/*', '/admin/*', '/_next/*', '/static/*'],
  
  // Explicitly define robots.txt content
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
    ],
    additionalSitemaps: [
      'https://www.mirbabatourtravels.in/sitemap.xml', // ✅ Correct domain with www
    ],
  },

  transform: async (config, path) => {
    let priority = 0.8;
    let changefreq = 'weekly';

    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (path === '/packages') {
      priority = 0.9;
      changefreq = 'daily';
    } else if (path.startsWith('/packages/')) {
      priority = 0.8;
      changefreq = 'weekly';
    } else if (path === '/about' || path === '/contact') {
      priority = 0.7;
      changefreq = 'monthly';
    } else if (path === '/terms') {
      priority = 0.5;
      changefreq = 'yearly';
    }

    return {
      loc: path,
      changefreq: changefreq,
      priority: priority,
      lastmod: new Date().toISOString(),
    };
  },
};