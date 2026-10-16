import { siteUrl } from '@/lib/seo';

// /robots.txt: todo público salvo el panel de Sanity y las API.
export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] }],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
