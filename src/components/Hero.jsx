'use client';

import Link from 'next/link';
import { stegaClean } from 'next-sanity';
import { usePathname } from 'next/navigation';
import { createPortal } from 'react-dom';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Glyphs from './hero/Glyphs';
import { HeroField } from './hero/fieldEngine';
import { complete, execute, line } from './hero/commands';
import styles from './Hero.module.css';

const QUICK_COMMANDS = [
  ['help', 'help'],
  ['scan', 'scan'],
  ['grep', 'grep vulnerabilidades'],
  ['rm -rf /', 'sudo rm -rf /'],
];

const TEXT_ACTIONS = {
  prefix: 'cat skills.txt',
  name: 'whoami',
  tagline: 'scan',
};

let lineSeed = 0;
const nextId = () => { lineSeed += 1; return `l${lineSeed}`; };

class Aborted extends Error {}

function Prompt() {
  return <span className={styles.prompt} aria-hidden="true"><span className={styles.promptUser}>root@miguel</span><span className={styles.promptPath}>:~$</span> </span>;
}

function LineParts({ parts, onRun }) {
  return parts.map((part, index) => {
    if (typeof part === 'string') return <span key={index}>{part}</span>;
    if (part.run) {
      return <button type="button" className={styles.runLink} key={index} onClick={(event) => { event.stopPropagation(); onRun(part.run); }}>{part.text}</button>;
    }
    if (part.href) {
      const external = /^https?:/.test(part.href) || part.href.endsWith('.pdf');
      return <a className={styles.runLink} key={index} href={part.href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} onClick={(event) => event.stopPropagation()}>{part.text}</a>;
    }
    return <span key={index} className={styles[part.tone] || ''}>{part.text}</span>;
  });
}

export default function Hero({ content, projects = [], contact = null, cvUrl = '/assets/CV_Miguel_Pinedo_moderno.pdf' }) {
  const pathname = usePathname();
  const heroRef = useRef(null);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const engineRef = useRef(null);
  const abortRef = useRef(null);
  const typingRef = useRef(false);

  const [windowState, setWindowState] = useState('open');
  const [maximized, setMaximized] = useState(false);
  const [floating, setFloating] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [placeholderSize, setPlaceholderSize] = useState(null);
  const [lines, setLines] = useState([]);
  const [introDone, setIntroDone] = useState(false);
  const [introRun, setIntroRun] = useState(0);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [tagline, setTagline] = useState(null);

  const prefix = stegaClean(content?.prefix || '');
  const firstName = stegaClean(content?.firstName || '');
  const lastName = stegaClean(content?.lastName || '');
  const originalTagline = stegaClean(content?.tagline || '');
  const shownTagline = tagline ?? originalTagline;

  const introLines = useMemo(() => (content?.terminalLines || [])
    .filter((item) => item?.type !== 'cursor')
    .map((item, index) => ({
      id: `intro-${index}`,
      tone: item.type === 'cmd' ? 'cmd' : (item.type || 'out'),
      text: stegaClean(item.text || ''),
      delayMs: Number(item.delayMs),
    })), [content?.terminalLines]);

  const commandData = useMemo(() => {
    const links = contact?.links || [];
    const mail = links.find((item) => stegaClean(item.iconKey || '') === 'mail');
    const github = links.find((item) => stegaClean(item.iconKey || '') === 'github');
    return {
      projects: projects.map((project) => ({ title: stegaClean(project.title || ''), slug: stegaClean(project.slug || '') })).filter((project) => project.slug),
      cvUrl: stegaClean(cvUrl),
      email: mail ? { label: stegaClean(mail.label || ''), url: stegaClean(mail.url || '') } : { label: 'contacto', url: '/contacto' },
      github: github ? { label: stegaClean(github.url || '').replace(/^https?:\/\//, ''), url: stegaClean(github.url || '') } : null,
      skillLines: introLines.filter((item) => item.tone === 'ok' || item.tone === 'warn').map((item) => ({ tone: item.tone, text: item.text })),
    };
  }, [contact, cvUrl, introLines, projects]);

  const getEngine = useCallback(() => {
    if (!engineRef.current && typeof window !== 'undefined') {
      engineRef.current = new HeroField({ reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches });
    }
    return engineRef.current;
  }, []);

  /* ---------- montaje ---------- */

  useEffect(() => {
    const engine = getEngine();
    engine.attach(heroRef.current);
    engine.onDragEnd = () => setDragging(false);
    return () => engine.detach();
  }, [getEngine]);

  useEffect(() => { getEngine()?.setMaximized(maximized); }, [getEngine, maximized]);

  useEffect(() => {
    if (!maximized) return undefined;
    const restoreOnEscape = (event) => { if (event.key === 'Escape') setMaximized(false); };
    window.addEventListener('keydown', restoreOnEscape);
    return () => window.removeEventListener('keydown', restoreOnEscape);
  }, [maximized]);

  /* ---------- animación de arranque ---------- */

  const finishIntro = useCallback(() => {
    setLines((current) => [
      ...introLines.map((item) => ({ id: item.id, tone: item.tone, text: item.text, parts: [item.text] })),
      ...current.filter((item) => !item.id.startsWith('intro-')),
    ]);
    setIntroDone(true);
  }, [introLines]);

  useEffect(() => {
    if (windowState !== 'open' || introDone) return undefined;
    const timers = [];
    const at = (ms, fn) => timers.push(window.setTimeout(fn, ms));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      at(0, finishIntro);
      return () => timers.forEach(window.clearTimeout);
    }
    at(0, () => setLines([]));
    let t = 200;
    introLines.forEach((item) => {
      const requested = Number.isFinite(item.delayMs) ? item.delayMs : 0;
      if (item.tone === 'cmd') {
        t = Math.max(t + 220, requested);
        at(t, () => setLines((current) => [...current, { id: item.id, tone: 'cmd', text: '', typing: true }]));
        [...item.text].forEach((_, index) => {
          t += 34 + Math.random() * 38;
          const text = item.text.slice(0, index + 1);
          at(t, () => setLines((current) => current.map((entry) => (entry.id === item.id ? { ...entry, text } : entry))));
        });
        t += 160;
        at(t, () => setLines((current) => current.map((entry) => (entry.id === item.id ? { ...entry, typing: false } : entry))));
      } else {
        t = Math.max(t + 90, requested);
        at(t, () => setLines((current) => [...current, { id: item.id, tone: item.tone, parts: [item.text] }]));
      }
    });
    at(t + 250, () => setIntroDone(true));
    return () => timers.forEach(window.clearTimeout);
  }, [finishIntro, introDone, introLines, introRun, windowState]);

  useLayoutEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [lines, busy, windowState, floating, maximized]);

  /* ---------- ejecución de comandos ---------- */

  const print = useCallback((...entries) => {
    setLines((current) => [...current, ...entries.map((entry) => ({ id: nextId(), ...entry }))].slice(-220));
  }, []);

  const wait = useCallback((ms) => new Promise((resolve, reject) => {
    const token = abortRef.current;
    if (token?.aborted) { reject(new Aborted()); return; }
    const timer = window.setTimeout(() => (token?.aborted ? reject(new Aborted()) : resolve()), ms);
    token?.cancels.push(() => { window.clearTimeout(timer); reject(new Aborted()); });
  }), []);

  const typeTagline = useCallback(async (text) => {
    const engine = getEngine();
    const reduced = engine?.reducedMotion;
    const current = tagline ?? originalTagline;
    if (reduced) { setTagline(text); engine?.refresh(); return; }
    for (let i = current.length; i >= 0; i -= Math.max(1, Math.ceil(current.length / 28))) {
      setTagline(current.slice(0, i));
      await wait(16);
    }
    setTagline('');
    for (let i = 1; i <= text.length; i += 1) {
      setTagline(text.slice(0, i));
      await wait(30 + Math.random() * 30);
    }
    engine?.refresh();
  }, [getEngine, originalTagline, tagline, wait]);

  const resetAll = useCallback(() => {
    const engine = getEngine();
    setTagline(null);
    if (engine?.encrypted) engine.decrypt();
    setMaximized(false);
    if (engine?.terminal.floating) engine.dock();
    window.setTimeout(() => engine?.refresh(), 30);
  }, [getEngine]);

  const closeTerminal = useCallback(() => {
    abortRef.current?.cancels.forEach((cancel) => cancel());
    getEngine()?.resetTerminal();
    setDragging(false);
    setMaximized(false);
    setFloating(false);
    setLines([]);
    setIntroDone(false);
    setBusy(false);
    setInput('');
    setWindowState('closed');
  }, [getEngine]);

  const runCommand = useCallback(async (raw, { animate = false } = {}) => {
    const command = raw.trim();
    if (!command || typingRef.current) return;
    if (!introDone) finishIntro();
    if (busy) return;

    if (animate && !getEngine()?.reducedMotion) {
      typingRef.current = true;
      for (let i = 1; i <= command.length; i += 1) {
        setInput(command.slice(0, i));
        await new Promise((resolve) => { window.setTimeout(resolve, 22 + Math.random() * 26); });
      }
      await new Promise((resolve) => { window.setTimeout(resolve, 120); });
      typingRef.current = false;
    }

    setInput('');
    setHistory((current) => (current[current.length - 1] === command ? current : [...current, command].slice(-50)));
    setHistoryIndex(-1);
    print({ tone: 'cmd', text: command });
    const token = { aborted: false, cancels: [] };
    abortRef.current = token;
    setBusy(true);
    try {
      await execute(command, {
        print,
        wait,
        engine: getEngine(),
        data: commandData,
        history: [...history, command],
        pathname,
        clear: () => setLines([]),
        navigate: (href) => window.dispatchEvent(new CustomEvent('portfolio:navigate', { detail: href })),
        openExternal: (url) => window.open(url, '_blank', 'noopener,noreferrer'),
        typeTagline,
        reset: resetAll,
        close: closeTerminal,
      });
    } catch (error) {
      if (!(error instanceof Aborted)) print(line('err', `error: ${error.message}`));
    } finally {
      if (abortRef.current === token) abortRef.current = null;
      setBusy(false);
      window.requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
    }
  }, [busy, closeTerminal, commandData, finishIntro, getEngine, history, introDone, pathname, print, resetAll, typeTagline, wait]);

  const openTerminal = useCallback(() => {
    if (windowState === 'closed') {
      setIntroDone(false);
      setIntroRun((value) => value + 1);
    }
    setWindowState('open');
  }, [windowState]);

  const runFromText = (group) => {
    const command = TEXT_ACTIONS[group];
    if (!command) return;
    if (window.getSelection?.()?.toString()) return;
    if (windowState !== 'open') {
      setWindowState('open');
      finishIntro();
    }
    window.setTimeout(() => runCommand(command, { animate: true }), windowState === 'open' ? 0 : 120);
  };

  const minimizeTerminal = () => {
    if (!introDone) finishIntro();
    setMaximized(false);
    setWindowState('minimized');
  };

  const handleKeyDown = (event) => {
    if (event.ctrlKey && event.key.toLowerCase() === 'c') {
      if (abortRef.current) {
        event.preventDefault();
        abortRef.current.aborted = true;
        abortRef.current.cancels.forEach((cancel) => cancel());
        print({ tone: 'dim', parts: ['^C'] });
      } else if (input) {
        event.preventDefault();
        print({ tone: 'cmd', text: `${input}^C` });
        setInput('');
      }
      return;
    }
    if (event.ctrlKey && event.key.toLowerCase() === 'l') {
      event.preventDefault();
      setLines([]);
      return;
    }
    if (event.key === 'Tab') {
      event.preventDefault();
      const { matches, value } = complete(input, commandData.projects);
      if (matches.length > 1 && value === input) print({ tone: 'cmd', text: input }, { tone: 'dim', parts: [matches.join('  ')] });
      setInput(value);
      return;
    }
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      if (!history.length) return;
      event.preventDefault();
      const direction = event.key === 'ArrowUp' ? -1 : 1;
      const start = historyIndex === -1 ? history.length : historyIndex;
      const next = Math.min(history.length, Math.max(0, start + direction));
      setHistoryIndex(next === history.length ? -1 : next);
      setInput(next === history.length ? '' : history[next]);
    }
  };

  /* ---------- arrastre ---------- */

  const terminalRef = useCallback((element) => { getEngine()?.setTerminalEl(element); }, [getEngine]);
  const dockRef = useCallback((element) => {
    getEngine()?.setDock(element, () => setFloating(false));
  }, [getEngine]);

  const startDragging = (event) => {
    if (event.button !== 0 || maximized || event.target.closest('button')) return;
    event.preventDefault();
    const windowElement = event.currentTarget.closest('[data-terminal-window]');
    const rect = windowElement.getBoundingClientRect();
    const engine = getEngine();
    if (!engine.terminal.floating) setPlaceholderSize({ width: rect.width, height: rect.height });
    engine.beginDrag(event, engine.terminal.floating ? { left: engine.terminal.x, top: engine.terminal.y, width: rect.width, height: rect.height } : rect);
    setFloating(true);
    setDragging(true);
  };

  /* ---------- render ---------- */

  const terminalClassName = [
    'terminal',
    styles.terminalWindow,
    floating && !maximized && styles.floating,
    maximized && styles.maximized,
    dragging && styles.dragging,
  ].filter(Boolean).join(' ');

  const terminalNode = windowState === 'open' ? <div
    ref={terminalRef}
    className={terminalClassName}
    style={floating && placeholderSize ? { width: `${placeholderSize.width}px` } : undefined}
    data-terminal-window
    role="region"
    aria-label="Terminal interactiva"
  >
    <div
      className={`terminal-bar ${styles.terminalBar}`}
      onPointerDown={startDragging}
      onDoubleClick={(event) => { if (!event.target.closest('button')) setMaximized((value) => !value); }}
    >
      <div className={styles.windowControls}>
        <button type="button" className={styles.windowControl} aria-label="Cerrar terminal" title="Cerrar" onClick={closeTerminal}>
          <span className={`${styles.controlDot} ${styles.closeDot}`}><span>×</span></span>
        </button>
        <button type="button" className={styles.windowControl} aria-label="Minimizar terminal" title="Minimizar" onClick={minimizeTerminal}>
          <span className={`${styles.controlDot} ${styles.minimizeDot}`}><span>−</span></span>
        </button>
        <button type="button" className={styles.windowControl} aria-label={maximized ? 'Restaurar tamaño de terminal' : 'Maximizar terminal'} title={maximized ? 'Restaurar' : 'Maximizar'} onClick={() => setMaximized((value) => !value)}>
          <span className={`${styles.controlDot} ${styles.maximizeDot}`}><span>{maximized ? '⤡' : '⤢'}</span></span>
        </button>
      </div>
      <span className={`terminal-title ${styles.terminalTitle}`}>{content?.terminalTitle || 'scan.sh - bash'}</span>
      <span className={styles.grip} aria-hidden="true"><i/><i/><i/></span>
    </div>

    <div
      ref={bodyRef}
      className={`terminal-body ${styles.terminalBody}`}
      onClick={(event) => {
        if (event.target.closest('button, a') || window.getSelection?.()?.toString()) return;
        if (!introDone) finishIntro();
        inputRef.current?.focus({ preventScroll: true });
      }}
    >
      <div role="log" aria-live="polite" aria-relevant="additions">
        {lines.map((item) => <div className={`${styles.line} ${styles[item.tone] || ''}`} key={item.id}>
          {item.tone === 'cmd'
            ? <><Prompt/><span className={styles.cmdText}>{item.text}</span>{item.typing && <span className={styles.blockCursor} aria-hidden="true"/>}</>
            : <LineParts parts={item.parts || []} onRun={(command) => runCommand(command)}/>}
        </div>)}
      </div>
      {introDone && <form
        className={`${styles.line} ${styles.inputRow} ${busy ? styles.inputBusy : ''}`}
        onSubmit={(event) => { event.preventDefault(); runCommand(input); }}
      >
        <Prompt/>
        <input
          ref={inputRef}
          className={styles.input}
          value={input}
          onChange={(event) => { setInput(event.target.value); setHistoryIndex(-1); }}
          onKeyDown={handleKeyDown}
          aria-label="Escribe un comando (prueba help)"
          placeholder={lines.length <= introLines.length + 1 && !busy ? 'escribe help…' : ''}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="send"
          readOnly={busy}
        />
      </form>}
      {!introDone && <button type="button" className={styles.skip} onClick={finishIntro}>saltar ›</button>}
    </div>

    <div className={styles.quickBar}>
      <span className={styles.quickLabel} aria-hidden="true">prueba</span>
      {QUICK_COMMANDS.map(([label, command]) => <button type="button" key={label} className={styles.quick} disabled={busy} onClick={() => runCommand(command, { animate: true })}>{label}</button>)}
    </div>
  </div> : null;

  const inPortal = windowState === 'open' && (floating || maximized);
  const slotContent = windowState !== 'open'
    ? <button type="button" className={styles.openTerminal} onClick={openTerminal}>
        <span className={styles.openTerminalIcon} aria-hidden="true">›_</span>
        <span>{windowState === 'minimized' ? 'Restaurar terminal' : 'Abrir terminal'}</span>
      </button>
    : inPortal
      ? <div
          ref={floating ? dockRef : undefined}
          className={`${styles.dock} ${floating ? styles.dockActive : ''}`}
          style={placeholderSize ? { height: `${placeholderSize.height}px` } : undefined}
          aria-hidden="true"
        >
          {floating && <span className={styles.dockLabel}>⌂ suelta la terminal aquí para acoplarla</span>}
        </div>
      : terminalNode;

  const portal = inPortal && typeof document !== 'undefined' ? createPortal(<>
    {maximized && <button type="button" className={styles.maximizedBackdrop} aria-label="Restaurar ventana de terminal" onClick={() => setMaximized(false)}/>}
    {terminalNode}
  </>, document.body) : null;

  const textProps = (group) => ({
    'data-group': group,
    className: styles.interactiveText,
    onClick: () => runFromText(group),
    title: `clic → ${TEXT_ACTIONS[group]}`,
  });

  return <>
    <section id="hero" className={styles.hero} ref={heroRef}>
      <div className={styles.copy}>
        <p {...textProps('prefix')} className={`hero-prefix ${styles.interactiveText}`}>
          <span className="sr-only">{content?.prefix}</span>
          <span aria-hidden="true"><Glyphs text={prefix}/></span>
        </p>
        <h1 {...textProps('name')}>
          <span className="sr-only">{content?.firstName} {content?.lastName}</span>
          <span aria-hidden="true"><Glyphs text={firstName}/><br/><strong><Glyphs text={lastName}/></strong></span>
        </h1>
        <p {...textProps('tagline')} className={`hero-tagline ${styles.tagline} ${styles.interactiveText}`}>
          <span className="sr-only">{tagline ?? content?.tagline}</span>
          <span aria-hidden="true"><Glyphs text={shownTagline}/>{tagline !== null && <span className={styles.taglineCaret}/>}</span>
        </p>
        <div className="hero-cta" data-group="cta">
          <Link className="btn-primary" data-field-block href={stegaClean(content?.primaryCta?.href || '/proyectos')}>{content?.primaryCta?.label || 'ver proyectos'}</Link>
          <Link className="btn-ghost" data-field-block href={stegaClean(content?.secondaryCta?.href || '/contacto')}>{content?.secondaryCta?.label || 'contactar'}</Link>
        </div>
      </div>

      <div className={styles.stage}>
        {slotContent}
        <p className={styles.hint} aria-hidden="true">
          {windowState === 'open'
            ? <>arrastra la barra y <em>lánzala</em> contra el texto · escribe <button type="button" tabIndex={-1} onClick={() => runCommand('help', { animate: true })}>help</button></>
            : <>la terminal sigue aquí cuando la necesites</>}
        </p>
      </div>
    </section>
    {portal}
  </>;
}

