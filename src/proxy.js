import { NextResponse } from 'next/server';
import { defaultLocale, isLocale } from './i18n/config';

/*
 * Idiomas en la URL:
 * - /en/… y /ca/… pasan tal cual a app/(website)/[lang];
 * - /es/… redirige a la misma ruta sin prefijo, que es la dirección pública del español;
 * - cualquier otra ruta se reescribe por dentro a /es/…, sin cambiar lo que ve el visitante.
 */
export function proxy(request) {
  const { pathname } = request.nextUrl;
  const first = pathname.split('/')[1];

  if (first === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || '/';
    return NextResponse.redirect(url, 308);
  }
  if (isLocale(first)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Fuera quedan el panel de Sanity, las API, los archivos internos de Next y cualquier archivo con extensión.
  matcher: ['/((?!api|admin|_next|_vercel|og-image\\.png|assets|config|.*\\..*).*)'],
};
