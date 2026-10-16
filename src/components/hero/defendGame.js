/*
 * Minijuego «defend»: llegan paquetes maliciosos desde los bordes de la pantalla hacia el nombre
 * del hero y hay que pararlos con un clic (o un toque) antes de que lleguen.
 * Termina al acabar el tiempo o al perder toda la integridad. Devuelve { promise, stop }.
 */

const THREATS = ['SQLi', 'XSS', 'brute-force', 'phishing', 'ransomware', 'DDoS', 'C2 beacon', 'keylogger', 'RCE', '0-day', 'cred-stuffing', 'malware.exe'];
const between = (min, max) => min + Math.random() * (max - min);
// Direcciones de los rangos reservados para documentación (RFC 5737): nunca son de nadie.
const fakeIp = () => `${['203.0.113', '198.51.100', '192.0.2'][Math.floor(Math.random() * 3)]}.${Math.floor(between(2, 254))}`;

export function startDefend({ getTarget, onBlock, onBreach, labels, duration = 25000, lives = 3 }) {
  const layer = document.createElement('div');
  layer.className = 'fx-defend';
  const hud = document.createElement('div');
  hud.className = 'fx-defend-hud';
  hud.setAttribute('role', 'status');
  layer.appendChild(hud);
  document.body.appendChild(layer);

  const packets = new Set();
  const stats = { blocked: 0, breaches: 0, spawned: 0, lives, won: false };
  const start = performance.now();
  let nextSpawn = start + 450;
  let last = start;
  let raf = 0;
  let done = false;
  let hudKey = '';
  let resolve;
  const promise = new Promise((r) => { resolve = r; });

  const renderHud = (now) => {
    const left = Math.max(0, Math.ceil((duration - (now - start)) / 1000));
    const key = `${stats.breaches}|${stats.blocked}|${left}`;
    if (key === hudKey) return;
    hudKey = key;
    const bars = Array.from({ length: lives }, (_, i) => `<i class="${i < lives - stats.breaches ? 'on' : ''}"></i>`).join('');
    hud.innerHTML = `<span class="fx-defend-label">${labels.integrity}</span><span class="fx-defend-bars">${bars}</span>`
      + `<span class="fx-defend-sep">·</span><span class="fx-defend-label">${labels.blocked}</span><strong>${stats.blocked}</strong>`
      + `<span class="fx-defend-sep">·</span><strong>0:${String(left).padStart(2, '0')}</strong>`;
  };

  const remove = (packet, className, delay) => {
    packet.dead = true;
    packets.delete(packet);
    packet.el.classList.add(className);
    packet.el.disabled = true;
    window.setTimeout(() => packet.el.remove(), delay);
  };

  const block = (packet) => {
    if (packet.dead || done) return;
    stats.blocked += 1;
    remove(packet, 'is-blocked', 520);
    onBlock?.(packet);
  };

  const spawn = () => {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'fx-packet';
    const label = THREATS[Math.floor(Math.random() * THREATS.length)];
    el.textContent = label;
    el.setAttribute('aria-label', `${labels.block} ${label}`);
    layer.appendChild(el);
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const side = Math.floor(Math.random() * 4);
    const x = side === 0 ? -w : side === 1 ? vw + w : between(0, vw);
    const y = side === 2 ? -h : side === 3 ? vh + h : between(0, vh);
    const packet = { el, label, ip: fakeIp(), x, y, w, h, speed: between(75, 115), phase: between(0, Math.PI * 2), dead: false };
    el.addEventListener('pointerdown', (event) => { event.preventDefault(); event.stopPropagation(); block(packet); });
    el.addEventListener('click', () => block(packet));
    packets.add(packet);
    stats.spawned += 1;
  };

  const finish = (won) => {
    if (done) return;
    done = true;
    stats.won = won;
    window.cancelAnimationFrame(raf);
    packets.forEach((packet) => remove(packet, 'is-expired', 360));
    layer.classList.add('is-over');
    window.setTimeout(() => { layer.remove(); }, 420);
    resolve(stats);
  };

  const frame = (now) => {
    const dt = Math.min(0.04, (now - last) / 1000);
    last = now;
    const elapsed = now - start;
    const level = Math.min(1, elapsed / duration);

    if (elapsed < duration && now >= nextSpawn) {
      spawn();
      if (level > 0.6 && Math.random() < 0.2) spawn();
      nextSpawn = now + 1100 - level * 450;
    }

    const target = getTarget();
    packets.forEach((packet) => {
      if (target) {
        const dx = target.x - packet.x;
        const dy = target.y - packet.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < 28) {
          stats.breaches += 1;
          remove(packet, 'is-breach', 460);
          layer.classList.remove('is-hit');
          void layer.offsetWidth;
          layer.classList.add('is-hit');
          onBreach?.(packet, packet.x, packet.y);
          return;
        }
        const speed = packet.speed * (1 + level * 0.6);
        // Un pequeño zigzag perpendicular para que no vengan en línea recta.
        const wobble = Math.sin(elapsed / 260 + packet.phase) * 38;
        packet.x += ((dx / dist) * speed + (-dy / dist) * wobble) * dt;
        packet.y += ((dy / dist) * speed + (dx / dist) * wobble) * dt;
      }
      packet.el.style.transform = `translate3d(${(packet.x - packet.w / 2).toFixed(1)}px, ${(packet.y - packet.h / 2).toFixed(1)}px, 0)`;
    });

    renderHud(now);
    if (stats.breaches >= lives) { finish(false); return; }
    if (elapsed >= duration && !packets.size) { finish(true); return; }
    if (elapsed >= duration + 6000) { finish(true); return; }
    raf = window.requestAnimationFrame(frame);
  };
  renderHud(start);
  raf = window.requestAnimationFrame(frame);

  return { promise, stop: () => finish(stats.breaches < lives) };
}
