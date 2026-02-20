import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/bookmarks', '/login', '/api/'],
      },
    ],
    sitemap: 'https://aifreshdaily.com/sitemap.xml',
  };
}
