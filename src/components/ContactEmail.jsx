'use client';

import { useEffect, useRef, useState } from 'react';
import { stegaClean } from 'next-sanity';
import styles from './ContactEmail.module.css';

// Dirección limpia a partir de un enlace mailto: o de Gmail (?to=), o de la etiqueta si no hay otra.
const addressOf = (url, label) => {
  if (url.startsWith('mailto:')) return decodeURIComponent(url.slice(7).split('?')[0]);
  try { return new URL(url).searchParams.get('to') || label; } catch { return label; }
};

/*
 * Correo de contacto: el botón abre el programa de correo del visitante (mailto:) y
 * el botón de copiar sirve a quien no tiene ninguno configurado o usa el correo web.
 */
export default function ContactEmail({ link }) {
  const url = stegaClean(link.url || '');
  const address = addressOf(url, stegaClean(link.label || ''));
  const href = url.startsWith('mailto:') ? url : `mailto:${address}`;
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address);
    } catch {
      // Sin permiso para el portapapeles: se selecciona la dirección y se prueba el método clásico.
      // Si tampoco funciona, queda seleccionada para copiarla a mano.
      const range = document.createRange();
      range.selectNodeContents(document.getElementById('contact-address'));
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      if (!document.execCommand('copy')) return;
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2200);
  };

  return <div className={styles.row}>
    <a className={`btn-primary ${styles.mail}`} href={href}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18v14H3zM3 6l9 7 9-7"/></svg>
      <span id="contact-address">{address}</span>
    </a>
    <button type="button" className={`btn-ghost ${styles.copy}`} onClick={copy} data-copied={copied ? '' : undefined}>
      {copied
        ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>
        : <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></svg>}
      <span>{copied ? 'copiado' : 'copiar'}</span>
    </button>
    <span className="sr-only" role="status">{copied ? 'Dirección de correo copiada' : ''}</span>
  </div>;
}
