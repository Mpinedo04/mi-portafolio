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
  return <>
    <div className={styles.track} aria-hidden="true"><span style={{ transform: `scaleX(${progress / 100})` }}/></div>
    <div className={`${styles.frame} ${isComplete ? styles.frameVisible : ''}`} aria-hidden="true">
      <span className={`${styles.edge} ${styles.edgeRight}`}/>
      <span className={`${styles.edge} ${styles.edgeBottom}`}/>
      <span className={`${styles.edge} ${styles.edgeLeft}`}/>
      <span className={`${styles.corner} ${styles.cornerTopLeft}`}/>
      <span className={`${styles.corner} ${styles.cornerTopRight}`}/>
      <span className={`${styles.corner} ${styles.cornerBottomRight}`}/>
      <span className={`${styles.corner} ${styles.cornerBottomLeft}`}/>
      <span className={styles.endLabel}><i/> SCROLL COMPLETE · 100%</span>
    </div>
  </>;
}
