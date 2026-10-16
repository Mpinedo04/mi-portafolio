/*
 * Explosión de confeti dorado (cuadraditos y caracteres) desde un punto de la pantalla.
 * Se pinta en un canvas fijo por encima de todo y se borra solo al terminar.
 */

const COLORS = ['#e2c893', '#c9a86a', '#f6e2b4', '#85bda1', '#e9eaf0'];
const GLYPHS = ['1', '0', '✓', '{', '}', '#', '★'];
const between = (min, max) => min + Math.random() * (max - min);

export function burst({ x, y, count = 110, spread = 1, reducedMotion = false } = {}) {
  if (reducedMotion || typeof document === 'undefined') return Promise.resolve(false);
  const canvas = document.createElement('canvas');
  canvas.className = 'fx-canvas fx-burst';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const pieces = Array.from({ length: count }, () => {
    const angle = between(-Math.PI * 0.95, -Math.PI * 0.05);
    const speed = between(320, 980) * spread;
    return {
      x, y,
      vx: Math.cos(angle) * speed + between(-60, 60),
      vy: Math.sin(angle) * speed,
      rot: between(0, Math.PI * 2),
      spin: between(-9, 9),
      size: between(4, 8),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      glyph: Math.random() < 0.28 ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)] : null,
      life: between(1.6, 2.6),
      age: 0,
      wobble: between(0, Math.PI * 2),
    };
  });

  return new Promise((resolve) => {
    let last = performance.now();
    const frame = (now) => {
      const dt = Math.min(0.04, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, width, height);
      let alive = 0;
      pieces.forEach((p) => {
        p.age += dt;
        if (p.age >= p.life) return;
        alive += 1;
        p.vy += 1100 * dt;
        p.vx *= Math.exp(-dt * 1.6);
        p.vy *= Math.exp(-dt * 0.9);
        p.x += (p.vx + Math.sin(p.age * 6 + p.wobble) * 30) * dt;
        p.y += p.vy * dt;
        p.rot += p.spin * dt;
        const fade = Math.min(1, (p.life - p.age) / 0.6);
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.glyph) {
          ctx.font = `600 ${p.size * 2.2}px ui-monospace, Consolas, monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.glyph, 0, 0);
        } else {
          // Un rectángulo que "gira" sobre sí mismo como el papel.
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, (p.size / 2) * Math.abs(Math.cos(p.age * 8 + p.wobble)) + 1);
        }
        ctx.restore();
      });
      if (alive) window.requestAnimationFrame(frame);
      else { canvas.remove(); resolve(true); }
    };
    window.requestAnimationFrame(frame);
  });
}
