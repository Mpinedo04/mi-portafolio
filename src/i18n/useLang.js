'use client';

import { usePathname } from 'next/navigation';
import { splitLocale } from './config';

// Idioma actual en componentes cliente, sacado de la URL del navegador.
export function useLang() {
  return splitLocale(usePathname() || '/').lang;
}
