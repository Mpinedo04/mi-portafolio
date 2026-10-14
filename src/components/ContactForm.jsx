'use client';

import { useState } from 'react';
import { t } from '@/i18n/ui';
import styles from './ContactForm.module.css';

/*
 * Formulario de contacto con Formspree (como en Portafolio Raúl): el mensaje llega por
 * email y el campo «email» queda como dirección de respuesta. Solo se muestra si hay
 * un ID de formulario, para no aparentar que se envía algo que nunca llega.
 */
export default function ContactForm({ formId, lang = 'es' }) {
  const ui = t(lang).form;
  const [status, setStatus] = useState('idle');

  const submit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus('sending');
    try {
      const response = await fetch(`https://formspree.io/f/${formId}`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      if (!response.ok) throw new Error(`Formspree respondió ${response.status}`);
      form.reset();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  return <form className={styles.form} onSubmit={submit}>
    <input type="hidden" name="_subject" value={ui.subject}/>
    {/* Trampa para bots: los humanos no ven este campo y Formspree descarta lo que lo rellena */}
    <input type="text" name="_gotcha" className={styles.trap} tabIndex={-1} autoComplete="off" aria-hidden="true"/>
    <div className={styles.row}>
      <label className={styles.field}>
        <span>{ui.name}</span>
        <input type="text" name="nombre" autoComplete="name" required/>
      </label>
      <label className={styles.field}>
        <span>{ui.email}</span>
        <input type="email" name="email" autoComplete="email" required/>
      </label>
    </div>
    <label className={styles.field}>
      <span>{ui.extra} <em>{ui.optional}</em></span>
      <input type="text" name="empresa_o_telefono" autoComplete="organization"/>
    </label>
    <label className={styles.field}>
      <span>{ui.message}</span>
      <textarea name="mensaje" rows={5} required/>
    </label>
    <div className={styles.actions}>
      <button type="submit" className="btn-primary" disabled={status === 'sending'}>
        {status === 'sending' ? ui.sending : ui.send}
      </button>
      <p className={styles.status} role="status" data-status={status}>{status === 'idle' || status === 'sending' ? '' : ui[status]}</p>
    </div>
  </form>;
}
