'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { localePath, splitLocale } from '@/i18n/config';
import { t } from '@/i18n/ui';
import { closestRoute } from '@/lib/closestRoute';
import styles from './RouteTrace.module.css';

// Terminal de la página 404: un traceroute que se pierde y, si la hay, la página más parecida a la que buscabas.
export default function RouteTrace({ lang = 'es' }) {
  // El enlace sugerido conserva el idioma de la URL aunque la página se muestre en español (404 global).
  const { lang: urlLang, path } = splitLocale(usePathname() || '/');
  const ui = t(lang).notFound;
  const suggestion = closestRoute(path);
  const shown = path.length > 42 ? `${path.slice(0, 41)}…` : path;
  return <div className={`terminal ${styles.trace}`}>
    <div className="terminal-bar"><span className="dot dot-r"/><span className="dot dot-y"/><span className="dot dot-g"/><span className="terminal-title">traceroute - bash</span></div>
    <div className={`terminal-body ${styles.body}`}>
      <p className={styles.row} style={{ '--i': 0 }}><span className={styles.prompt}>$ </span><span className={styles.cmd}>traceroute {shown}</span></p>
      <p className={`${styles.row} ${styles.dim}`} style={{ '--i': 1 }}> 1  gateway              0.4 ms</p>
      <p className={`${styles.row} ${styles.dim}`} style={{ '--i': 2 }}> 2  edge.vercel          3.1 ms</p>
      <p className={`${styles.row} ${styles.warn}`} style={{ '--i': 3 }}> 3  * * *                {ui.lost}</p>
      <p className={`${styles.row} ${styles.err}`} style={{ '--i': 4 }}>[!] {ui.unreachable}: {shown}</p>
      {suggestion
        ? <p className={`${styles.row} ${styles.ok}`} style={{ '--i': 5 }}>[i] {ui.closest} <Link href={localePath(urlLang, suggestion)}>{suggestion}</Link></p>
        : <p className={`${styles.row} ${styles.dim}`} style={{ '--i': 5 }}>[i] {ui.tryPalette} <kbd>Ctrl K</kbd></p>}
    </div>
  </div>;
}
