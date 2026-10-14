import { defaultLocale, localePath, locales, ogLocales } from '@/i18n/config';
import { t } from '@/i18n/ui';

const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  || (vercelProductionUrl ? `https://${vercelProductionUrl}` : 'http://localhost:3000');

export const siteName = t(defaultLocale).seo.siteName;

export const ogImage = {
  url: '/og-image.png',
  width: 1200,
  height: 630,
  type: 'image/png',
  alt: t(defaultLocale).seo.ogAlt,
};

// Next.js sustituye el objeto openGraph completo en cada página, así que se repiten aquí los valores comunes.
// `path` es la ruta sin idioma (/proyectos); la canónica y las alternativas se calculan para cada idioma.
export function pageMetadata({ title, description, path = '/', lang = defaultLocale }) {
  const url = localePath(lang, path);
  const image = { ...ogImage, alt: t(lang).seo.ogAlt };
  return {
    title,
    ...(description ? { description } : {}),
    alternates: {
      canonical: url,
      languages: { ...Object.fromEntries(locales.map((code) => [code, localePath(code, path)])), 'x-default': localePath(defaultLocale, path) },
    },
    openGraph: {
      type: 'website',
      locale: ogLocales[lang] || ogLocales[defaultLocale],
      alternateLocale: locales.filter((code) => code !== lang).map((code) => ogLocales[code]),
      siteName: t(lang).seo.siteName,
      url,
      title,
      ...(description ? { description } : {}),
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      ...(description ? { description } : {}),
      images: [image],
    },
  };
}
