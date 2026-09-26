'use client';

import { useEffect, useState } from 'react';
import styles from './ScrollProgress.module.css';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };
    update(); window.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);
  const isComplete = progress >= 99.8;

  const backToTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  return <>
    <div className={styles.track} aria-hidden="true"><span style={{ transform: `scaleX(${progress / 100})` }}/></div>
    {/* Al llegar al final, la barra superior se continúa por la derecha, abajo y la izquierda hasta cerrar el marco. */}
    <div className={`${styles.frame} ${isComplete ? styles.frameVisible : ''}`}>
      <span className={`${styles.edge} ${styles.edgeRight}`} aria-hidden="true"/>
      <span className={`${styles.edge} ${styles.edgeBottom}`} aria-hidden="true"/>
      <span className={`${styles.edge} ${styles.edgeLeft}`} aria-hidden="true"/>
      <span className={`${styles.corner} ${styles.cornerTopLeft}`} aria-hidden="true"/>
      <span className={`${styles.corner} ${styles.cornerTopRight}`} aria-hidden="true"/>
      <span className={`${styles.corner} ${styles.cornerBottomRight}`} aria-hidden="true"/>
      <span className={`${styles.corner} ${styles.cornerBottomLeft}`} aria-hidden="true"/>
      <button type="button" className={styles.endLabel} onClick={backToTop} tabIndex={isComplete ? 0 : -1}>
        <i aria-hidden="true"/>
        <span className={styles.eof} aria-hidden="true">EOF</span>
        <span className={styles.sep} aria-hidden="true"/>
        <span>volver arriba</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
      </button>
    </div>
  </>;
}
