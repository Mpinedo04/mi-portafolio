'use client';

import { useIsPresentationTool } from 'next-sanity/hooks';
import styles from './DisableDraftMode.module.css';

export default function DisableDraftMode() {
  const inPresentation = useIsPresentationTool();
  if (inPresentation) return null;
  return <a className={styles.button} href="/api/draft/disable">Salir de la vista previa</a>;
}
