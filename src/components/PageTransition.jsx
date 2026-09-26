'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import styles from './PageTransition.module.css';

const LABELS = {
  '/': 'inicio',
  '/sobre-mi': 'perfil',
  '/proyectos': 'proyectos',
  '/estudios': 'credenciales',
  '/contacto': 'contacto',
};

const describe = (pathname) => {
  if (LABELS[pathname]) return LABELS[pathname];
  if (pathname.includes('/informe')) return 'informe técnico';
  if (pathname.startsWith('/proyectos/')) return 'caso de estudio';
  return pathname.split('/').filter(Boolean).at(-1) || 'inicio';
};

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
    window.setTimeout(() => router.push(`${target.pathname}${target.search}${target.hash}`), reduced ? 0 : 620);
  }, [router]);

  useEffect(() => {
    const onClick = (event) => {
      const link = event.target.closest('a');
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (link.target === '_blank' || link.hasAttribute('download')) return;
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
        <div className="transition-head"><i/><i/><i/><span>secure-route.sh</span></div>
        <div className="transition-body">
          <p className="transition-cmd"><b>root@miguel<span>:~$</span></b> cd {panel.path}</p>
          <ul className="transition-log">
            <li style={{ '--d': 0 }}><b>[OK]</b> resolviendo ruta<em>{panel.path}</em></li>
            <li style={{ '--d': 1 }}><b>[OK]</b> handshake TLS 1.3<em>verificado</em></li>
            <li style={{ '--d': 2 }}><b>[OK]</b> cargando módulo<em>{describe(panel.path)}</em></li>
          </ul>
          <div className="transition-progress"><span/><strong/></div>
        </div>
      </div>}
    </div>
    {children}
  </div>;
}
