// Idiomas de la web. El español va sin prefijo (/proyectos); inglés y catalán, con él (/en/proyectos, /ca/proyectos).
export const locales = ['es', 'en', 'ca'];
export const defaultLocale = 'es';

export const languageNames = { es: 'Español', en: 'English', ca: 'Català' };
export const ogLocales = { es: 'es_ES', en: 'en_GB', ca: 'ca_ES' };
export const dateLocales = { es: 'es-ES', en: 'en-GB', ca: 'ca-ES' };

export const isLocale = (value) => locales.includes(value);

// Ruta de una página en un idioma: localePath('en', '/proyectos') → '/en/proyectos'.
export function localePath(lang, path = '/') {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (!isLocale(lang) || lang === defaultLocale) return clean;
  return clean === '/' ? `/${lang}` : `/${lang}${clean}`;
}

// Separa el idioma de la ruta: '/en/proyectos' → { lang: 'en', path: '/proyectos' }.
export function splitLocale(pathname = '/') {
  const [, first, ...rest] = pathname.split('/');
  if (isLocale(first)) return { lang: first, path: `/${rest.join('/')}`.replace(/(.)\/$/, '$1') };
  return { lang: defaultLocale, path: pathname || '/' };
}
