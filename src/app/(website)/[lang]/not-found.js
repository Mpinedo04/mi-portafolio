'use client';

import Link from 'next/link';
import { localePath } from '@/i18n/config';
import { t } from '@/i18n/ui';
import { useLang } from '@/i18n/useLang';
import RouteTrace from '@/components/RouteTrace';
import styles from './not-found.module.css';

// not-found no recibe params: el idioma se saca de la URL.
export default function NotFound() {
  const lang = useLang();
  const ui = t(lang).notFound;
  return <main className={styles.wrap}>
    <section className={styles.section}>
      <p className="section-label">{ui.label}</p>
      <h1 className={styles.code}>4<span>0</span>4</h1>
      <p className={styles.description}>{ui.description}</p>
      <RouteTrace lang={lang}/>
      <Link className="btn-primary" href={localePath(lang, '/')}>{ui.back}</Link>
    </section>
  </main>;
}
