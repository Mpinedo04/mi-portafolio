/*
 * Lluvia de caracteres (estilo Matrix) en dorado, pintada en un canvas fijo detrás del contenido.
 * Devuelve { promise, stop, heads, size }:
 * - heads[col] es la altura (px de la ventana) de la cabeza de la gota de cada columna, o -1 si no hay;
 *   el hero lo usa para hacer parpadear las letras que toca la lluvia.
 * - stop() deja de crear gotas y apaga el canvas con un fundido.
 */

const CHARS = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ0123456789ABCDEF<>/{}[]#$%&*+=';
const pick = () => CHARS[Math.floor(Math.random() * CHARS.length)];
const between = (min, max) => min + Math.random() * (max - min);

export function matrixRain({ duration = 6500, zIndex = 0, reducedMotion = false } = {}) {
  if (reducedMotion || typeof document === 'undefined') {
    return { promise: Promise.resolve(false), stop() {}, heads: new Float32Array(0), size: 16 };
  }

  const canvas = document.createElement('canvas');
  canvas.className = 'fx-canvas fx-matrix';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.zIndex = String(zIndex);
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let width = 0;
  let height = 0;
  let size = 16;
  let drops = [];
  const state = { heads: new Float32Array(0), size };

  const newDrop = (initial) => ({
    y: initial ? -between(0, height) : -between(0, height * 0.25),
    speed: between(260, 640),
    cell: -1,
    sage: Math.random() < 0.14,
    alive: true,
  });

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    size = width < 720 ? 14 : 16;
    const columns = Math.ceil(width / size);
    drops = Array.from({ length: columns }, (_, i) => drops[i] || newDrop(true));
    state.heads = new Float32Array(columns).fill(-1);
    state.size = size;
  };
  resize();
  window.addEventListener('resize', resize);

  const start = performance.now();
  let spawning = true;
  let finished = false;
  let raf = 0;
  let last = start;
  let resolve;
  const promise = new Promise((r) => { resolve = r; });

  const finish = () => {
    if (finished) return;
    finished = true;
    window.cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
    state.heads.fill(-1);
    canvas.style.opacity = '0';
    window.setTimeout(() => { canvas.remove(); resolve(true); }, 650);
  };

  const frame = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (spawning && now - start > duration) spawning = false;

    // Las estelas se desvanecen hacia transparente (no hacia negro) para no tapar el fondo.
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.055)';
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';
    ctx.font = `${size - 2}px ui-monospace, "Cascadia Code", Consolas, monospace`;
    ctx.textBaseline = 'top';

    let alive = 0;
    drops.forEach((drop, col) => {
      if (!drop.alive) { state.heads[col] = -1; return; }
      // Al principio la lluvia entra poco a poco.
      if (now - start < 900 && Math.random() > (now - start) / 900) { state.heads[col] = -1; alive += 1; return; }
      drop.y += drop.speed * dt;
      const cell = Math.floor(drop.y / size);
      if (cell !== drop.cell) {
        const x = col * size;
        if (drop.cell >= 0) {
          ctx.fillStyle = drop.sage ? 'rgba(133, 189, 161, 0.75)' : 'rgba(201, 168, 106, 0.78)';
          ctx.fillText(pick(), x, drop.cell * size);
        }
        if (cell >= 0) {
          ctx.fillStyle = '#fbeac4';
          ctx.shadowColor = 'rgba(226, 200, 147, 0.9)';
          ctx.shadowBlur = 8;
          ctx.fillText(pick(), x, cell * size);
          ctx.shadowBlur = 0;
        }
        drop.cell = cell;
      }
      state.heads[col] = drop.y >= 0 ? drop.y : -1;
      if (drop.y > height + size * 4) {
        if (spawning) drops[col] = newDrop(false);
        else { drop.alive = false; state.heads[col] = -1; return; }
      }
      alive += 1;
    });

    if (!spawning && alive === 0) { finish(); return; }
    raf = window.requestAnimationFrame(frame);
  };
  raf = window.requestAnimationFrame(frame);

  return {
    promise,
    get heads() { return state.heads; },
    get size() { return state.size; },
    // Corta la lluvia ya: fundido y fuera.
    stop: finish,
    // Deja de crear gotas; las que caen terminan su recorrido.
    drain() { spawning = false; },
  };
}
