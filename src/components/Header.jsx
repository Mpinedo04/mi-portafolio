'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { stegaClean } from 'next-sanity';
import styles from './Header.module.css';

export default function Header({ settings }) {
  const pathname = usePathname();
  const links = settings?.navigation || [];
  return <header className={styles.wrap}>
    <nav>
      <div className="nav-left">
        <Link className="nav-logo" href="/" aria-label={`Ir al inicio - ${settings?.brandName || 'Miguel Pinedo'}`}>
          <span className="nav-status-dot" aria-hidden="true" />
          <span className="logo-user">{settings?.terminalUser || 'root'}</span><span className="logo-at">@</span><span className="logo-host">{settings?.terminalHost || 'miguel'}</span><span className="logo-prompt">:~$</span><span className="nav-cursor" aria-hidden="true">_</span>
        </Link>
        <span className="nav-divider" aria-hidden="true" />
        <a className="nav-cv" href={settings?.cvUrl || '/assets/CV_Miguel_Pinedo_moderno.pdf'} target="_blank" rel="noopener noreferrer" aria-label="Descargar o ver CV de Miguel Pinedo en PDF">
          <svg className="cv-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <span className="cv-text">CV</span>
          <span className="cv-badge">PDF</span>
        </a>
      </div>
      <ul>{links.map((item) => {
        const href = stegaClean(item.href || '/');
        const active = pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));
        return <li key={href}><Link className={active ? 'active' : ''} href={href} aria-current={active ? 'page' : undefined}>{item.label}</Link></li>;
      })}</ul>
    </nav>
  </header>;
}
