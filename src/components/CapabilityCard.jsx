'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { stegaClean } from 'next-sanity';
import styles from './CapabilityCard.module.css';

export default function CapabilityCard({ item }) {
  const cardRef = useRef(null);
  const iconKey = stegaClean(item.iconKey || '');
  useEffect(() => {
    const card = cardRef.current;
    const section = card?.closest('.capabilities-section');
    if (!card || !section) return undefined;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      card.classList.add('is-visible');
      return undefined;
    }
    section.classList.add('capabilities-motion-ready');
    const observer = new IntersectionObserver(([entry]) => {
      card.classList.toggle('is-active', entry.isIntersecting);
      if (entry.isIntersecting) card.classList.add('is-visible');
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.16 });
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return <article ref={cardRef} className={`capability-card ${styles.card}`} data-node={item.node} data-sector={item.sector}>
    <div className="capability-visual">
      <Image src={`/assets/${iconKey}.svg`} alt={`Ilustración de ${item.title}`} width={190} height={150}/>
      <div className="capability-motion" aria-hidden="true"><span className="motion-scan"/><span className="motion-orbit"/><span className="motion-packet packet-one"/><span className="motion-packet packet-two"/><span className="motion-packet packet-three"/><span className="motion-bars"><i/><i/><i/><i/><i/></span></div>
    </div>
    <div className="capability-content"><p className="project-num">[ {item.node} ]</p><h3>{item.title}</h3><p>{item.description}</p><div className="tag-list">{(item.tags || []).map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div></div>
  </article>;
}
