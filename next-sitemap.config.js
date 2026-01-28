/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://www.mirbabatourtravels.in',
    generateRobotsTxt: true,
    generateIndexSitemap: false, // Important: You only have 11 URLs, no need for sitemap index
    exclude: ['/api/*', '/admin/*', '/_next/*', '/static/*'],
    
    // Robots.txt options
    robotsTxtOptions: {
      policies: [
        {
          userAgent: '*',
          allow: '/',
        },
      ],
      additionalSitemaps: [
        'https://www.mirbabatourtravels.in/sitemap.xml',
      ],
    },
  
    // Transform function to customize each URL
    transform: async (config, path) => {
      // Custom priorities and changefreq based on path
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