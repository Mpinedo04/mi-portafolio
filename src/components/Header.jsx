'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { stegaClean } from 'next-sanity';
import styles from './Header.module.css';

// Ruta que muestra el prompt: "~", "~/proyectos" o, en rutas profundas, "~/proyectos/…".
const promptPath = (pathname = '/') => {
  const [first, ...rest] = pathname.split('/').filter(Boolean);
  if (!first) return '~';
  return `~/${first}${rest.length ? '/…' : ''}`;
};

// Al cambiar de página, borra la ruta anterior hasta la parte común y escribe la nueva, como un `cd`.
function useTypedPath(pathname) {
  const target = promptPath(pathname);
  const [shown, setShown] = useState(target);
  const shownRef = useRef(target);

  useEffect(() => {
    if (shownRef.current === target) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let current = shownRef.current;
    let common = 0;
    while (common < current.length && current[common] === target[common]) common += 1;
    let erasing = current.length > common;
    const timer = window.setInterval(() => {
      if (reduced) current = target;
      else if (erasing) {
        current = current.slice(0, -1);
        erasing = current.length > common;
      } else current = target.slice(0, current.length + 1);
      shownRef.current = current;
      setShown(current);
      if (current === target) window.clearInterval(timer);
    }, 34);
    return () => window.clearInterval(timer);
  }, [target]);

  return { shown, typing: shown !== target };
}

export default function Header({ settings }) {
  const pathname = usePathname();
  const { shown: path, typing } = useTypedPath(pathname);
  const links = settings?.navigation || [];
  return <header className={styles.wrap}>
    <nav>
      <div className="nav-left">
        <Link className="nav-logo" href="/" data-typing={typing ? '' : undefined} aria-label={`Ir al inicio - ${settings?.brandName || 'Miguel Pinedo'}`}>
          <span className="nav-status-dot" aria-hidden="true" />
          <span className="logo-user">{settings?.terminalUser || 'root'}</span><span className="logo-at">@</span><span className="logo-host">{settings?.terminalHost || 'miguel'}</span><span className="logo-colon">:</span><span className="logo-path">{path}</span><span className="logo-prompt">$</span><span className="nav-cursor" aria-hidden="true" />
        </Link>
        <span className="nav-divider" aria-hidden="true" />
        <a className="nav-cv" href={settings?.cvUrl || '/assets/CV_Miguel_Pinedo_moderno.pdf'} target="_blank" rel="noopener noreferrer" aria-label="Descargar o ver CV de Miguel Pinedo en PDF">
          <svg className="cv-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <g className="cv-arrow"><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></g>
          </svg>
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
