'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './SideScrollRail.module.css';

const clamp = (value, minimum = 0, maximum = 1) => Math.min(maximum, Math.max(minimum, value));
const initialMetrics = { maxScroll: 0, progress: 0, thumbRatio: 1, visible: false };

export default function SideScrollRail() {
  const railRef = useRef(null);
  const dragRef = useRef(null);
  const [metrics, setMetrics] = useState(initialMetrics);

  useEffect(() => {
    let frame = 0;
    const readMetrics = () => {
      frame = 0;
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
      const thumbRatio = maxScroll > 0 ? clamp(window.innerHeight / document.documentElement.scrollHeight, 0.07, 0.42) : 1;
      setMetrics({
        maxScroll,
        progress: maxScroll > 0 ? clamp(window.scrollY / maxScroll) : 0,
        thumbRatio,
        visible: maxScroll > 2,
      });
    };
    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(readMetrics);
    };
    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(scheduleUpdate);

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    resizeObserver?.observe(document.documentElement);
    if (document.body) resizeObserver?.observe(document.body);
    document.fonts?.ready.then(scheduleUpdate);
    scheduleUpdate();

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      resizeObserver?.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const scrollToProgress = (progress) => {
    window.scrollTo({
      top: clamp(progress) * metrics.maxScroll,
      behavior: 'instant',
    });
  };

  const handleTrackPointerDown = (event) => {
    if (event.target.closest('[data-scroll-thumb]')) return;
    const bounds = railRef.current?.getBoundingClientRect();
    if (!bounds || metrics.maxScroll <= 0) return;
    const usableTrack = 1 - metrics.thumbRatio;
    const pointerProgress = (event.clientY - bounds.top) / bounds.height;
    scrollToProgress((pointerProgress - metrics.thumbRatio / 2) / usableTrack);
  };

  const handleThumbPointerDown = (event) => {
    event.preventDefault();
    const thumbBounds = event.currentTarget.getBoundingClientRect();
    dragRef.current = { pointerId: event.pointerId, offset: event.clientY - thumbBounds.top };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleThumbPointerMove = (event) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    const bounds = railRef.current?.getBoundingClientRect();
    if (!bounds || metrics.maxScroll <= 0) return;
    const usableTrack = 1 - metrics.thumbRatio;
    const thumbTop = (event.clientY - bounds.top - dragRef.current.offset) / bounds.height;
    scrollToProgress(thumbTop / usableTrack);
  };

  const handleThumbPointerEnd = () => {
    dragRef.current = null;
  };

  const handleThumbKeyDown = (event) => {
    const step = Math.max(window.innerHeight * 0.12, 80);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior = reducedMotion ? 'auto' : 'smooth';
    if (event.key === 'ArrowDown' || event.key === 'PageDown') {
      event.preventDefault();
      window.scrollBy({ top: step, behavior });
    } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
      event.preventDefault();
      window.scrollBy({ top: -step, behavior });
    } else if (event.key === 'Home') {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior });
    } else if (event.key === 'End') {
      event.preventDefault();
      window.scrollTo({ top: metrics.maxScroll, behavior });
    }
  };

  if (!metrics.visible) return null;

  const value = Math.round(metrics.progress * 100);
  const thumbSize = metrics.thumbRatio * 100;
  const thumbTop = metrics.progress * (100 - thumbSize);

  return <div className={styles.widget} aria-label="Control lateral de desplazamiento">
    <div className={styles.rail} ref={railRef} onPointerDown={handleTrackPointerDown}>
      <span className={styles.railLine} aria-hidden="true"/>
      <span className={`${styles.marker} ${styles.markerTop}`} aria-hidden="true"/>
      <span className={`${styles.marker} ${styles.markerBottom}`} aria-hidden="true"/>
      <button
        type="button"
        role="slider"
        className={styles.thumb}
        data-scroll-thumb
        aria-label="Desplazamiento de página"
        aria-orientation="vertical"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-valuetext={`${value}% de la página`}
        style={{ height: `${thumbSize}%`, top: `${thumbTop}%` }}
        onKeyDown={handleThumbKeyDown}
        onPointerDown={handleThumbPointerDown}
        onPointerMove={handleThumbPointerMove}
        onPointerUp={handleThumbPointerEnd}
        onPointerCancel={handleThumbPointerEnd}
        onLostPointerCapture={handleThumbPointerEnd}
      >
        <span className={styles.thumbFace} aria-hidden="true">
          <span className={styles.thumbCore}/>
        </span>
        <span className={styles.thumbValue} aria-hidden="true">{String(value).padStart(2, '0')}%</span>
      </button>
    </div>
  </div>;
}
