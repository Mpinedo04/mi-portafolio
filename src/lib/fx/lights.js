/*
 * Modo linterna: apaga la web y deja un círculo de luz que sigue al puntero.
 * Vive fuera de React (una capa en <body>) para que siga activa al cambiar de página.
 * Se enciende de nuevo con Esc, con el botón de la esquina o con la orden `lights on`.
 */

let layer = null;
let cleanup = null;

export const lightsAreOff = () => Boolean(layer);

export function lightsOn() {
  if (!layer) return false;
  const current = layer;
  layer = null;
  cleanup?.();
  cleanup = null;
  current.classList.add('is-leaving');
  window.setTimeout(() => current.remove(), 420);
  return true;
}

export function lightsOff({ x, y, hint = 'Esc' } = {}) {
  if (layer || typeof document === 'undefined') return false;
  layer = document.createElement('div');
  layer.className = 'fx-lights';
  const startX = x ?? window.innerWidth / 2;
  const startY = y ?? window.innerHeight / 2;
  layer.style.setProperty('--lx', `${startX}px`);
  layer.style.setProperty('--ly', `${startY}px`);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'fx-lights-switch';
  button.textContent = hint;
  button.addEventListener('click', lightsOn);
  layer.appendChild(button);
  document.body.appendChild(layer);

  let raf = 0;
  let px = startX;
  let py = startY;
  const move = (event) => {
    px = event.clientX;
    py = event.clientY;
    if (raf) return;
    raf = window.requestAnimationFrame(() => {
      raf = 0;
      layer?.style.setProperty('--lx', `${px}px`);
      layer?.style.setProperty('--ly', `${py}px`);
    });
  };
  const key = (event) => { if (event.key === 'Escape') lightsOn(); };
  window.addEventListener('pointermove', move, { passive: true });
  window.addEventListener('pointerdown', move, { passive: true });
  window.addEventListener('keydown', key);
  cleanup = () => {
    window.cancelAnimationFrame(raf);
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerdown', move);
    window.removeEventListener('keydown', key);
  };
  return true;
}
