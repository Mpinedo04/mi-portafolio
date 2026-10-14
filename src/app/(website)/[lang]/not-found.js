'use client';

import Link from 'next/link';
import { localePath } from '@/i18n/config';
import { t } from '@/i18n/ui';
import { useLang } from '@/i18n/useLang';
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
      <div className="terminal" style={{ margin: '0 auto 2.5rem' }}>
        <div className="terminal-bar"><span className="dot dot-r"/><span className="dot dot-y"/><span className="dot dot-g"/><span className="terminal-title">route_error.log - bash</span></div>
        <div className="terminal-body" style={{ minHeight: 110, textAlign: 'left' }}>
          <span className="t-line"><span className="t-prompt">&gt; </span><span className="t-cmd">traceroute target_node</span></span>
          <span className="t-line"><span className="t-warn">[!] Destination unreachable: 404_NOT_FOUND</span></span>
          <span className="t-line"><span className="t-prompt">&gt; </span><span className="t-out">initiating secure fallback protocol...</span></span>
        </div>
      </div>
      <Link className="btn-primary" href={localePath(lang, '/')}>{ui.back}</Link>
    </section>
  </main>;
}
