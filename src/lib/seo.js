const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  || (vercelProductionUrl ? `https://${vercelProductionUrl}` : 'http://localhost:3000');

export const siteName = 'Miguel Pinedo · Ciberseguridad';

export const ogImage = {
  url: '/og-image.png',
  width: 1200,
  height: 630,
  type: 'image/png',
  alt: 'Miguel Pinedo · Security Researcher & Developer. Laboratorio SOC con Wazuh, informes de incidentes y pentesting web.',
};

// Next.js sustituye el objeto openGraph completo en cada página, así que se repiten aquí los valores comunes.
export function pageMetadata({ title, description, path = '/' }) {
  return {
    title,
    ...(description ? { description } : {}),
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: 'es_ES',
      siteName,
      url: path,
      title,
      ...(description ? { description } : {}),
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      ...(description ? { description } : {}),
      images: [ogImage],
    },
  };
}
