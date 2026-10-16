import { t } from '@/i18n/ui';
import styles from './Footer.module.css';

// Commit desplegado (Vercel lo pone en el build); en local no hay.
const commit = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7);

export default function Footer({ settings, lang = 'es' }) {
  const ui = t(lang).footer;
  return <footer className={styles.footer}>
    <p>© {new Date().getFullYear()} {settings?.brandName || 'Miguel Pinedo'}</p>
    <p className={styles.status}>
      <span className={styles.dot} aria-hidden="true"/>
      {ui.status}
      {commit && <> · <a href={`https://github.com/Mpinedo04/mi-portafolio/commit/${commit}`} target="_blank" rel="noopener noreferrer" title={ui.build}>build {commit}</a></>}
    </p>
    <p>{settings?.footerCredit || 'diseñado & construido manualmente'}<span className={styles.hint}> · {ui.paletteHint} <kbd>Ctrl K</kbd></span></p>
  </footer>;
}
