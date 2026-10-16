'use client';

import { useEffect, useRef } from 'react';
import { dateLocales } from '@/i18n/config';
import styles from './StatsStrip.module.css';

/*
 * Franja de cifras clave (nota, horas de prácticas…). Los números cuentan desde cero
 * la primera vez que la franja entra en pantalla. El HTML ya trae el valor final,
 * así que sin JavaScript o con movimiento reducido se ve tal cual.
 */
export default function StatsStrip({ items = [], lang = 'es', label }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return undefined;
    const numbers = [...root.querySelectorAll('[data-count]')];
    const timeouts = [];
    const frames = [];
    const restores = [];
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      numbers.forEach((element, index) => {
        // Se cambia el nodo de texto (no textContent) para no quitarle a React el nodo que controla.
        const node = element.firstChild;
        if (!node) return;
        const target = Number(element.dataset.count);
        const decimals = Number(element.dataset.decimals || 0);
        const format = new Intl.NumberFormat(dateLocales[lang] || 'es-ES', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
        const final = node.nodeValue;
        restores.push(() => { node.nodeValue = final; });
        const duration = 1300;
        const delay = index * 110;
        let start = 0;
        const frame = (now) => {
          if (!start) start = now;
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - (1 - progress) ** 4;
          node.nodeValue = progress >= 1 ? final : format.format(target * eased);
          if (progress < 1) frames.push(window.requestAnimationFrame(frame));
        };
        node.nodeValue = format.format(0);
        timeouts.push(window.setTimeout(() => frames.push(window.requestAnimationFrame(frame)), delay));
      });
      root.classList.add(styles.live);
    }, { threshold: 0.5 });
    observer.observe(root);
    return () => {
      observer.disconnect();
      timeouts.forEach((id) => window.clearTimeout(id));
      frames.forEach((id) => window.cancelAnimationFrame(id));
      restores.forEach((restore) => restore());
    };
  }, [lang]);

  if (!items.length) return null;
  const format = (item) => new Intl.NumberFormat(dateLocales[lang] || 'es-ES', { minimumFractionDigits: item.decimals || 0, maximumFractionDigits: item.decimals || 0 }).format(item.value);

  return <section className={styles.strip} aria-label={label}>
    <ul className={styles.list} ref={rootRef}>
      {items.map((item) => <li className={styles.item} key={item.label}>
        <p className={styles.value}>
          {item.prefix && <span className={styles.affix}>{item.prefix}</span>}
          <span data-count={item.value} data-decimals={item.decimals || 0}>{format(item)}</span>
          {item.suffix && <span className={styles.affix}>{item.suffix}</span>}
        </p>
        <p className={styles.label}>{item.label}</p>
      </li>)}
    </ul>
  </section>;
}
