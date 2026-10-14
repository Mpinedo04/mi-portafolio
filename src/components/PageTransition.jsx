'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { splitLocale } from '@/i18n/config';
import { t } from '@/i18n/ui';
import styles from './PageTransition.module.css';

// Nombre de la página de destino, en el idioma de la ruta.
const describe = (pathname) => {
  const { lang, path } = splitLocale(pathname);
  const labels = t(lang).transition;
  if (labels[path]) return labels[path];
  if (path.includes('/informe')) return labels.caseStudy;
  if (path.startsWith('/proyectos/')) return labels.project;
  return labels['/'];
};

// Lo que tarda la cortina en cubrir la pantalla antes de cambiar de página.
const LEAVE_MS = 220;

export const TRANSITION_EVENT = 'portfolio:navigate';

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [destination, setDestination] = useState(null);
  const [panel, setPanel] = useState(null);
  const [currentPath, setCurrentPath] = useState(pathname);
  if (currentPath !== pathname) { setCurrentPath(pathname); setDestination(null); }

  useEffect(() => { document.body.classList.remove('page-is-leaving'); }, [pathname]);

  const go = useCallback((url) => {
    const target = new URL(url, window.location.href);
    if (target.origin !== window.location.origin) { window.location.assign(target.href); return; }
    if (target.pathname === window.location.pathname) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setDestination(target.pathname);
    setPanel((current) => ({ path: target.pathname, id: (current?.id || 0) + 1 }));
    document.body.classList.add('page-is-leaving');
    window.setTimeout(() => router.push(`${target.pathname}${target.search}${target.hash}`), reduced ? 0 : LEAVE_MS);
  }, [router]);

  useEffect(() => {
    const onClick = (event) => {
      const link = event.target.closest('a');
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (link.target === '_blank' || link.hasAttribute('download') || link.hasAttribute('data-no-transition')) return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      const target = new URL(link.href, window.location.href);
      if (target.origin !== window.location.origin || target.pathname === window.location.pathname) return;
      event.preventDefault();
      go(link.href);
    };
    // La terminal del hero navega con este evento para usar la misma transición.
    const onNavigate = (event) => go(event.detail);
    document.addEventListener('click', onClick, true);
    window.addEventListener(TRANSITION_EVENT, onNavigate);
    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener(TRANSITION_EVENT, onNavigate);
    };
  }, [go]);

  return <div className={styles.root}>
    <div className={`page-transition ${destination ? 'is-active' : ''}`} aria-hidden="true">
      {panel && <div className="transition-panel" key={panel.id}>
        <p className="transition-label">{describe(panel.path)}</p>
        <span className="transition-line"/>
      </div>}
    </div>
    {children}
  </div>;
}
