'use client';

import { useEffect, useEffectEvent, useId, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { languageNames, localePath, locales, splitLocale } from '@/i18n/config';
import { t } from '@/i18n/ui';
import { lightsAreOff, lightsOff, lightsOn } from '@/lib/fx/lights';
import styles from './CommandPalette.module.css';

/*
 * Paleta de búsqueda (Ctrl+K / ⌘K o la tecla /): salta a cualquier página, proyecto o caso de estudio,
 * descarga el CV, escribe un correo, cambia de idioma… escribiendo dos letras.
 */

export const PALETTE_EVENT = 'portfolio:palette';

const normalize = (value = '') => value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// Puntuación sencilla: empieza por > contiene > letras en orden.
function score(item, query) {
  if (!query) return 1;
  const haystack = normalize(`${item.label} ${item.keywords || ''}`);
  const label = normalize(item.label);
  if (label.startsWith(query)) return 4;
  if (label.includes(query)) return 3;
  if (haystack.includes(query)) return 2;
  let index = 0;
  for (const char of haystack) {
    if (char === query[index]) index += 1;
    if (index === query.length) return 1;
  }
  return 0;
}

const navigate = (href) => window.dispatchEvent(new CustomEvent('portfolio:navigate', { detail: href }));

export default function CommandPalette({ lang = 'es', projects = [], cvUrl, email }) {
  const ui = t(lang);
  const labels = ui.palette;
  const pathname = usePathname() || '/';
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const returnFocus = useRef(null);
  const listId = useId();

  const show = () => {
    returnFocus.current = document.activeElement;
    setQuery('');
    setActive(0);
    setOpen(true);
  };

  const hide = () => {
    setOpen(false);
    window.setTimeout(() => returnFocus.current?.focus?.({ preventScroll: true }), 0);
  };

  // Atajos globales: Ctrl+K / ⌘K abre y cierra; / abre si no estás escribiendo en un campo.
  const onShortcut = useEffectEvent((event) => {
    const typing = event.target.closest?.('input, textarea, select, [contenteditable="true"]');
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (open) hide(); else show();
    } else if (event.key === '/' && !typing && !open) {
      event.preventDefault();
      show();
    }
  });
  const onOpenRequest = useEffectEvent(() => { if (!open) show(); });

  useEffect(() => {
    const onKey = (event) => onShortcut(event);
    const onRequest = () => onOpenRequest();
    window.addEventListener('keydown', onKey);
    window.addEventListener(PALETTE_EVENT, onRequest);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener(PALETTE_EVENT, onRequest);
    };
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Sin memo: solo se calcula con la paleta abierta y así lee el estado actual de las luces.
  const buildItems = () => {
    const { path } = splitLocale(pathname);
    const page = (href, label, keywords) => ({ group: labels.pages, label, hint: href, keywords, run: () => navigate(localePath(lang, href)) });
    return [
      page('/', ui.transition['/'], 'home inicio inici'),
      page('/sobre-mi', ui.transition['/sobre-mi'], 'about perfil experiencia experience'),
      page('/proyectos', ui.transition['/proyectos'], 'projects proyectos projectes trabajo work'),
      page('/estudios', ui.transition['/estudios'], 'estudios education formacion asix smx'),
      page('/contacto', ui.transition['/contacto'], 'contact contacto email correo'),
      ...projects.flatMap((project) => [
        { group: labels.projects, label: project.title, hint: labels.project, keywords: project.slug, run: () => navigate(localePath(lang, `/proyectos/${project.slug}`)) },
        ...(project.casePath ? [{ group: labels.projects, label: `${labels.caseStudy} · ${project.title}`, hint: labels.caseStudyHint, keywords: `informe report case ${project.slug}`, run: () => navigate(localePath(lang, project.casePath)) }] : []),
      ]),
      { group: labels.actions, label: labels.cv, hint: 'PDF ↗', keywords: 'cv curriculum resume pdf descargar download', run: () => window.open(cvUrl, '_blank', 'noopener,noreferrer') },
      ...(email ? [{ group: labels.actions, label: labels.email, hint: email.replace(/^mailto:/, '').split('?')[0], keywords: 'email correo mail gmail escribir', run: () => { window.location.href = email; } }] : []),
      { group: labels.actions, label: labels.terminal, hint: '›_', keywords: 'terminal consola bash comandos commands', run: () => { if (path === '/') window.dispatchEvent(new CustomEvent('portfolio:terminal')); else navigate(localePath(lang, '/')); } },
      { group: labels.actions, label: lightsAreOff() ? labels.lightsOn : labels.lightsOff, hint: '◐', keywords: 'lights luces llums linterna torch dark', run: () => { if (!lightsOn()) lightsOff({ hint: labels.lightsHint }); } },
      { group: labels.actions, label: labels.top, hint: '↑', keywords: 'top arriba amunt inicio', run: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
      ...locales.filter((code) => code !== lang).map((code) => ({ group: labels.language, label: languageNames[code], hint: code.toUpperCase(), keywords: `idioma language ${code}`, run: () => navigate(localePath(code, path)) })),
    ];
  };

  const q = normalize(query.trim());
  const results = open ? buildItems()
    .map((item, index) => ({ item, index, score: score(item, q) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((entry) => entry.item) : [];

  const current = Math.min(active, Math.max(0, results.length - 1));

  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [current, open]);

  const choose = (item) => {
    if (!item) return;
    setOpen(false);
    item.run();
  };

  const onKeyDown = (event) => {
    if (event.key === 'Escape') { event.preventDefault(); hide(); return; }
    if (event.key === 'ArrowDown') { event.preventDefault(); setActive((current + 1) % Math.max(1, results.length)); return; }
    if (event.key === 'ArrowUp') { event.preventDefault(); setActive((current - 1 + results.length) % Math.max(1, results.length)); return; }
    if (event.key === 'Enter') { event.preventDefault(); choose(results[current]); }
    if (event.key === 'Tab') event.preventDefault();
  };

  if (!open) return null;

  return <div className={styles.root}>
    <button type="button" className={styles.backdrop} aria-label={labels.close} onClick={hide} tabIndex={-1}/>
    <div className={styles.dialog} role="dialog" aria-modal="true" aria-label={labels.title}>
      <div className={styles.inputRow}>
        <span className={styles.prompt} aria-hidden="true">›</span>
        <input
          ref={inputRef}
          className={styles.input}
          value={query}
          onChange={(event) => { setQuery(event.target.value); setActive(0); }}
          onKeyDown={onKeyDown}
          placeholder={labels.placeholder}
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-activedescendant={results.length ? `${listId}-${current}` : undefined}
          aria-autocomplete="list"
          autoComplete="off"
          spellCheck={false}
        />
        <kbd className={styles.esc}>esc</kbd>
      </div>
      <ul className={styles.list} id={listId} role="listbox" ref={listRef} aria-label={labels.title}>
        {results.length === 0 && <li className={styles.empty}>{labels.empty}</li>}
        {results.map((item, index) => {
          const heading = index === 0 || results[index - 1].group !== item.group ? item.group : null;
          return <li key={`${item.group}-${item.label}`} role="presentation">
            {heading && <p className={styles.group} aria-hidden="true">{heading}</p>}
            <div
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === current}
              className={`${styles.item} ${index === current ? styles.active : ''}`}
              onPointerMove={() => { if (index !== current) setActive(index); }}
              onClick={() => choose(item)}
            >
              <span className={styles.label}>{item.label}</span>
              <span className={styles.hint}>{item.hint}</span>
            </div>
          </li>;
        })}
      </ul>
      <p className={styles.footer} aria-hidden="true"><span><kbd>↑</kbd><kbd>↓</kbd> {labels.move}</span><span><kbd>↵</kbd> {labels.open}</span><span><kbd>esc</kbd> {labels.closeKey}</span></p>
    </div>
  </div>;
}
