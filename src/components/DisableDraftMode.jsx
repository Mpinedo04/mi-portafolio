'use client';

import { useIsPresentationTool } from 'next-sanity/hooks';
import styles from './DisableDraftMode.module.css';

export default function DisableDraftMode() {
  const inPresentation = useIsPresentationTool();
  if (inPresentation) return null;
  // Navegación completa a propósito: la ruta de la API borra la cookie de vista previa y redirige.
  // eslint-disable-next-line @next/next/no-html-link-for-pages
  return <a className={styles.button} href="/api/draft/disable">Salir de la vista previa</a>;
}
