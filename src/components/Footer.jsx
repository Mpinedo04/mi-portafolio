import styles from './Footer.module.css';

export default function Footer({ settings }) {
  return <footer className={styles.footer}>
    <p>© {new Date().getFullYear()} {settings?.brandName || 'Miguel Pinedo'}</p>
    <p>{settings?.footerCredit || 'diseñado & construido manualmente'}</p>
  </footer>;
}
