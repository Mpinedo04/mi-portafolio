'use client';

import { useEffect, useRef } from 'react';
import styles from './ParticleBackground.module.css';

export default function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointer = { x: window.innerWidth * 0.62, y: window.innerHeight * 0.38, oldX: 0, oldY: 0, speed: 0, active: false };
    let width = 0;
    let height = 0;
    let ratio = 1;
    let particles = [];
    let nodes = [];
    let frameId = 0;
    let radarAngle = 0;

    const resize = () => {
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const particleCount = width < 720 ? 44 : 92;
      const nodeCount = width < 720 ? 16 : 28;
      particles = Array.from({ length: particleCount }, () => {
        const x = Math.random() * width;
        const y = Math.random() * height;
        return { homeX: x, homeY: y, x, y, vx: 0, vy: 0, size: Math.random() * 1.2 + 0.45 };
      });
      nodes = Array.from({ length: nodeCount }, (_, index) => {
        const column = index % 7;
        const row = Math.floor(index / 7);
        return {
          x: (column + 0.6 + Math.random() * 0.6) * (width / 7),
          y: (row + 0.7 + Math.random() * 0.5) * (height / Math.ceil(nodeCount / 7)),
        };
      });
      if (reduceMotion) draw();
    };

    const drawGrid = () => {
      const gap = 60;
      for (let x = 0; x <= width + gap; x += gap) {
        const distance = Math.abs(pointer.x - x);
        const alpha = 0.045 + Math.max(0, 1 - distance / 170) * 0.06;
        context.strokeStyle = `rgba(204, 214, 246, ${alpha})`;
        context.lineWidth = 1;
        context.beginPath(); context.moveTo(x, 0); context.lineTo(x, height); context.stroke();
      }
      for (let y = 0; y <= height + gap; y += gap) {
        const distance = Math.abs(pointer.y - y);
        const alpha = 0.045 + Math.max(0, 1 - distance / 170) * 0.06;
        context.strokeStyle = `rgba(204, 214, 246, ${alpha})`;
        context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke();
      }
      for (let x = 0; x <= width + gap; x += gap) {
        for (let y = 0; y <= height + gap; y += gap) {
          const distance = Math.hypot(pointer.x - x, pointer.y - y);
          const glow = Math.max(0, 1 - distance / 185);
          if (glow <= 0.03) continue;
          context.fillStyle = `rgba(201, 168, 106, ${0.08 + glow * 0.42})`;
          context.beginPath(); context.arc(x, y, 1.2 + glow * 2.4, 0, Math.PI * 2); context.fill();
        }
      }
    };

    const drawNetwork = () => {
      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];
        const glow = Math.max(0, 1 - Math.hypot(pointer.x - a.x, pointer.y - a.y) / 260);
        context.fillStyle = `rgba(201, 168, 106, ${0.09 + glow * 0.38})`;
        context.beginPath(); context.arc(a.x, a.y, 1.5 + glow * 1.2, 0, Math.PI * 2); context.fill();
        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j];
          if (Math.hypot(a.x - b.x, a.y - b.y) >= 215) continue;
          const midpointDistance = Math.hypot(pointer.x - (a.x + b.x) / 2, pointer.y - (a.y + b.y) / 2);
          const strength = Math.max(0, 1 - midpointDistance / 250);
          if (strength <= 0.03) continue;
          context.strokeStyle = `rgba(201, 168, 106, ${strength * 0.18})`;
          context.beginPath(); context.moveTo(a.x, a.y); context.lineTo(b.x, b.y); context.stroke();
        }
      }
    };

    const drawParticles = () => {
      particles.forEach((particle) => {
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distance = Math.max(Math.hypot(dx, dy), 1);
        if (!reduceMotion && distance < 145) {
          const force = (1 - distance / 145) * 0.42;
          particle.vx += (dx / distance) * force;
          particle.vy += (dy / distance) * force;
        }
        if (!reduceMotion) {
          particle.vx += (particle.homeX - particle.x) * 0.006;
          particle.vy += (particle.homeY - particle.y) * 0.006;
          particle.vx *= 0.9; particle.vy *= 0.9;
          particle.x += particle.vx; particle.y += particle.vy;
        }
        const pulse = Math.max(0, 1 - distance / 180);
        context.fillStyle = `rgba(204, 214, 246, ${0.12 + pulse * 0.3})`;
        context.beginPath(); context.arc(particle.x, particle.y, particle.size + pulse * 0.7, 0, Math.PI * 2); context.fill();
      });
    };

    const drawRadar = () => {
      if (!pointer.active || reduceMotion) return;
      radarAngle += 0.025;
      const radius = 185;
      const gradient = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, radius);
      gradient.addColorStop(0, 'rgba(201, 168, 106, 0.055)');
      gradient.addColorStop(0.58, 'rgba(201, 168, 106, 0.018)');
      gradient.addColorStop(1, 'rgba(201, 168, 106, 0)');
      context.fillStyle = gradient;
      context.beginPath(); context.arc(pointer.x, pointer.y, radius, 0, Math.PI * 2); context.fill();
      context.strokeStyle = 'rgba(201, 168, 106, 0.22)';
      context.beginPath(); context.moveTo(pointer.x, pointer.y); context.lineTo(pointer.x + Math.cos(radarAngle) * radius, pointer.y + Math.sin(radarAngle) * radius); context.stroke();
    };

    const drawGlitch = () => {
      if (pointer.speed < 28 || reduceMotion) return;
      const strips = Math.min(7, Math.floor(pointer.speed / 12));
      for (let index = 0; index < strips; index += 1) {
        context.fillStyle = `rgba(201, 168, 106, ${Math.min(0.22, pointer.speed / 420)})`;
        context.fillRect(pointer.x + (Math.random() - 0.5) * 120, pointer.y + (Math.random() - 0.5) * 92, 18 + Math.random() * 64, 1);
      }
    };

    function draw() {
      context.clearRect(0, 0, width, height);
      drawGrid();
      drawNetwork();
      drawParticles();
      drawRadar();
      drawGlitch();
      pointer.speed *= 0.88;
      if (!reduceMotion) frameId = window.requestAnimationFrame(draw);
    }

    const onPointerMove = (event) => {
      pointer.active = true;
      pointer.oldX = pointer.x; pointer.oldY = pointer.y;
      pointer.x = event.clientX; pointer.y = event.clientY;
      pointer.speed = Math.hypot(pointer.x - pointer.oldX, pointer.y - pointer.oldY);
    };
    const onPointerLeave = () => { pointer.active = false; };

    resize();
    if (!reduceMotion) draw();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  return <canvas ref={canvasRef} id="cyber-bg" className={styles.canvas} aria-hidden="true"/>;
}
