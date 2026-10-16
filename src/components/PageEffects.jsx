'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { t } from '@/i18n/ui';
import { useLang } from '@/i18n/useLang';
import { matrixRain } from '@/lib/fx/matrixRain';
import { toast } from '@/lib/fx/toast';

/*
 * Detalles de toda la web que no tienen interfaz propia:
 * - los títulos y etiquetas de sección se "descifran" la primera vez que aparecen;
 * - las tarjetas tienen una luz que sigue al puntero;
 * - saludo en la consola del navegador (con una de las flags del mini-CTF);
 * - el título de la pestaña cambia cuando te vas a otra;
 * - código Konami → lluvia Matrix por toda la página.
 */

const GLYPHS = '!<>-_/[]{}=+*^?#01ABCDEFX$%';
const SCRAMBLE_TARGETS = 'main .section-label, main h1, main h2';
const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
let greeted = false;

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Revela el texto de izquierda a derecha a partir de caracteres al azar. Solo toca nodos de texto
// y los deja exactamente como estaban al terminar (o al cancelar).
function scramble(element) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) if (walker.currentNode.nodeValue.trim()) nodes.push(walker.currentNode);
  if (!nodes.length) return () => {};
  const originals = nodes.map((node) => node.nodeValue);
  const total = originals.reduce((sum, text) => sum + text.length, 0);
  const duration = Math.min(950, 320 + total * 16);
  const start = performance.now();
  let raf = 0;
  let done = false;
  element.setAttribute('data-scrambling', '');

  const restore = () => {
    if (done) return;
    done = true;
    window.cancelAnimationFrame(raf);
    nodes.forEach((node, index) => { if (node.nodeValue !== originals[index]) node.nodeValue = originals[index]; });
    element.removeAttribute('data-scrambling');
  };

  const frame = (now) => {
    const progress = Math.min(1, (now - start) / duration);
    const revealed = Math.floor(total * (1 - (1 - progress) ** 2));
    let offset = 0;
    nodes.forEach((node, index) => {
      const text = originals[index];
      let out = '';
      for (let i = 0; i < text.length; i += 1) {
        const char = text[i];
        out += offset + i < revealed || /\s/.test(char) ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      offset += text.length;
      node.nodeValue = out;
    });
    if (progress >= 1) restore();
    else raf = window.requestAnimationFrame(frame);
  };
  raf = window.requestAnimationFrame(frame);
  return restore;
}

export default function PageEffects() {
  const pathname = usePathname();
  const lang = useLang();

  // Títulos que se descifran al entrar en pantalla.
  useEffect(() => {
    if (reducedMotion() || !('IntersectionObserver' in window)) return undefined;
    const cancels = new Set();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        const cancel = scramble(entry.target);
        cancels.add(cancel);
      });
    }, { threshold: 0.6 });
    // Se espera a que acabe la cortina de la transición.
    const timer = window.setTimeout(() => {
      document.querySelectorAll(SCRAMBLE_TARGETS).forEach((element) => {
        if (!element.closest('#hero')) observer.observe(element);
      });
    }, 60);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
      cancels.forEach((cancel) => cancel());
    };
  }, [pathname]);

  // Luz que sigue al puntero dentro de las tarjetas.
  useEffect(() => {
    let current = null;
    let raf = 0;
    let lastEvent = null;
    const clear = (card) => { card?.style.removeProperty('--mx'); card?.style.removeProperty('--my'); };
    const paint = () => {
      raf = 0;
      const event = lastEvent;
      const card = event.target.closest?.('.project-card, .capability-card') || null;
      if (card !== current) { clear(current); current = card; }
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      card.style.setProperty('--my', `${event.clientY - rect.top}px`);
    };
    const onMove = (event) => {
      if (event.pointerType !== 'mouse') return;
      lastEvent = event;
      if (!raf) raf = window.requestAnimationFrame(paint);
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.cancelAnimationFrame(raf);
      document.removeEventListener('pointermove', onMove);
      clear(current);
    };
  }, []);

  // Saludo en la consola, título de la pestaña y código Konami.
  useEffect(() => {
    const ui = t(lang).effects;
    if (!greeted) {
      greeted = true;
      console.log('%c MIGUEL PINEDO ', 'background:#c9a86a;color:#0a0e16;font:600 13px monospace;padding:6px 12px;border-radius:4px;letter-spacing:4px');
      console.log(`%c${ui.consoleHello}`, 'color:#e2c893;font:12px monospace;line-height:1.6');
      console.log(`%cflag 02 → ${window.atob('RkxBR3t0aGVfY29uc29sZV90YWxrc30=')}`, 'color:#85bda1;font:12px monospace');
    }

    let savedTitle = null;
    const onVisibility = () => {
      if (document.hidden) {
        savedTitle = document.title;
        document.title = ui.away;
      } else if (savedTitle !== null) {
        document.title = savedTitle;
        savedTitle = null;
      }
    };

    let step = 0;
    let rain = null;
    const onKey = (event) => {
      if (event.target.closest?.('input, textarea, select, [contenteditable="true"]')) return;
      const key = event.key.toLowerCase();
      step = key === KONAMI[step] ? step + 1 : key === KONAMI[0] ? 1 : 0;
      if (step < KONAMI.length) return;
      step = 0;
      toast(ui.konami);
      if (reducedMotion() || rain) return;
      rain = matrixRain({ duration: 6500 });
      rain.promise.then(() => { rain = null; });
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('keydown', onKey);
      if (savedTitle !== null) document.title = savedTitle;
    };
  }, [lang]);

  return null;
}
