'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { stegaClean } from 'next-sanity';
import { languageNames, localePath, locales, splitLocale } from '@/i18n/config';
import { t } from '@/i18n/ui';
import styles from './Header.module.css';

export default function Header({ settings, lang = 'es' }) {
  const { path } = splitLocale(usePathname() || '/');
  const ui = t(lang);
  const brand = settings?.brandName || 'Miguel Pinedo';
  const links = settings?.navigation || [];
  return <header className={styles.wrap}>
    <nav>
      <div className="nav-left">
        <Link className="nav-logo" href={localePath(lang, '/')} aria-label={`${ui.header.home} - ${brand}`}>
          <span className="logo-name">{brand}</span>
        </Link>
        <span className="nav-divider" aria-hidden="true" />
        <div className="nav-actions">
          <a className="nav-cv" href={settings?.cvUrl || '/assets/CV_Miguel_Pinedo_moderno.pdf'} target="_blank" rel="noopener noreferrer" aria-label={ui.header.cv}>
            <svg className="cv-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <g className="cv-arrow"><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></g>
            </svg>
            <span className="cv-text">CV</span>
            <span className="cv-badge">PDF</span>
          </a>
          {/* Selector de idioma: lleva a la misma página en el otro idioma */}
          <div className="nav-lang" role="group" aria-label={ui.header.language}>
            {locales.map((code) => <Link
              key={code}
              href={localePath(code, path)}
              hrefLang={code}
              lang={code}
              className={code === lang ? 'active' : ''}
              aria-current={code === lang ? 'true' : undefined}
              title={languageNames[code]}
              data-no-transition
            >{code.toUpperCase()}</Link>)}
          </div>
          {/* Abre la paleta de búsqueda (también con Ctrl+K o /) */}
          <button type="button" className="nav-search" onClick={() => window.dispatchEvent(new CustomEvent('portfolio:palette'))} aria-label={ui.header.search} title={`${ui.header.search} · Ctrl K`}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/></svg>
            <kbd className="nav-search-key">Ctrl K</kbd>
          </button>
        </div>
      </div>
      <ul>{links.map((item) => {
        const href = stegaClean(item.href || '/');
        const current = path === href || (href !== '/' && path.startsWith(`${href}/`));
        return <li key={href}><Link className={current ? 'active' : ''} href={localePath(lang, href)} aria-current={current ? 'page' : undefined}>{item.label}</Link></li>;
      })}</ul>
    </nav>
  </header>;
}
