/*
 * Motor físico del hero.
 *
 * - Mueve la ventana de terminal (arrastre, inercia, rebote, inclinación y acoplado).
 * - Trata cada letra del hero y cada botón como un cuerpo con muelle: la terminal
 *   genera un campo de repulsión alrededor, empuja con su velocidad y "descifra"
 *   el texto que queda bajo el cristal.
 * - Expone efectos que usan los comandos de la terminal: scan, grep, encrypt,
 *   decrypt y colapso por gravedad.
 *
 * Todo se escribe directamente en el DOM dentro de un único requestAnimationFrame
 * para no provocar renders de React por fotograma. El bucle se duerme cuando
 * todo está en reposo.
 */

const CIPHER = '01<>/\\{}[]#$%&*+=?!ABCDEF0123456789';
const randomGlyph = () => CIPHER[Math.floor(Math.random() * CIPHER.length)];
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const between = (min, max) => min + Math.random() * (max - min);

const FIELD_RADIUS = 110; // alcance del campo alrededor de la terminal (px)
const GLYPH_FORCE = 5200; // aceleración máxima sobre una letra en el borde
const BLOCK_FORCE = 3000; // aceleración máxima sobre un botón
const KICK = 7.5; // transferencia de la velocidad de la terminal
const SPRING = 120;
const DAMPING = 13;
const EDGE = 8; // margen de la ventana con el borde de la pantalla

export const normalizeWord = (value = '') => value
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]/g, '');

export class HeroField {
  constructor({ reducedMotion = false } = {}) {
    this.reducedMotion = reducedMotion;
    this.bodies = [];
    this.byElement = new WeakMap();
    this.root = null;
    this.raf = 0;
    this.last = 0;
    this.dirty = true;
    this.gravity = null;
    this.scanState = null;
    this.cipherAll = false;
    this.dockEl = null;
    this.onDocked = null;
    this.maximized = false;
    this.terminal = {
      el: null, x: 0, y: 0, vx: 0, vy: 0, w: 0, h: 0, tilt: 0,
      floating: false, mode: 'idle', grabX: 0, grabY: 0, lastT: 0, lastX: 0, lastY: 0,
    };
    this.tick = this.tick.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.wake = this.wake.bind(this);
    this.handleHover = this.handleHover.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
  }

  /* ---------- ciclo de vida ---------- */

  attach(root) {
    this.root = root;
    this.dirty = true;
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('scroll', this.wake, { passive: true });
    root.addEventListener('pointerover', this.handleHover);
    document.fonts?.ready.then(() => { this.dirty = true; });
  }

  detach() {
    window.cancelAnimationFrame(this.raf);
    this.raf = 0;
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('scroll', this.wake);
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('pointerup', this.handlePointerUp);
    window.removeEventListener('pointercancel', this.handlePointerUp);
    this.root?.removeEventListener('pointerover', this.handleHover);
    this.scanState?.line.remove();
    this.bodies.forEach((body) => this.resetBody(body));
    this.bodies = [];
  }

  refresh() {
    this.dirty = true;
    this.wake();
  }

  handleResize() {
    this.dirty = true;
    const t = this.terminal;
    if (t.floating && t.el) {
      t.w = t.el.offsetWidth;
      t.h = t.el.offsetHeight;
      const b = this.bounds();
      t.x = clamp(t.x, b.minX, b.maxX);
      t.y = clamp(t.y, b.minY, b.maxY);
      this.applyTerminal();
    }
    this.wake();
  }

  wake() {
    if (this.raf) return;
    this.last = performance.now();
    this.raf = window.requestAnimationFrame(this.tick);
  }

  /* ---------- cuerpos ---------- */

  collect() {
    if (!this.root) return;
    const previous = this.bodies;
    previous.forEach((body) => this.resetBody(body));

    const fixedCache = new Map();
    const isFixed = (element) => {
      let node = element.parentElement;
      const path = [];
      while (node && node !== document.body) {
        if (fixedCache.has(node)) { const cached = fixedCache.get(node); path.forEach((n) => fixedCache.set(n, cached)); return cached; }
        path.push(node);
        const position = window.getComputedStyle(node).position;
        if (position === 'fixed' || position === 'sticky') { path.forEach((n) => fixedCache.set(n, true)); return true; }
        node = node.parentElement;
      }
      path.forEach((n) => fixedCache.set(n, false));
      return false;
    };

    const glyphs = [...this.root.querySelectorAll('[data-glyph]')];
    const blocks = [
      ...this.root.querySelectorAll('[data-field-block]'),
      ...document.querySelectorAll('header nav ul a, header .nav-cv, header .nav-logo'),
    ];

    this.bodies = [...glyphs.map((el) => ({ el, kind: 'glyph' })), ...blocks.map((el) => ({ el, kind: 'block' }))]
      .map(({ el, kind }, index) => ({
        el, kind, index,
        group: el.closest('[data-group]')?.getAttribute('data-group') || 'page',
        fixed: isFixed(el),
        x: 0, y: 0, vx: 0, vy: 0, rot: 0, spin: 0,
        home: null,
        mode: 'spring', releaseAt: 0,
        cipher: false, nextSwap: 0, restoreAt: 0, flashUntil: 0, hoverUntil: 0, locked: false,
        hot: false, scanned: false, written: '', recovering: false,
      }));
    this.byElement = new WeakMap();
    this.bodies.forEach((body) => this.byElement.set(body.el, body));
    this.measure();
    this.dirty = false;
  }

  measure() {
    // Se leen todas las posiciones con los desplazamientos anulados.
    this.bodies.forEach((body) => { body.el.style.translate = ''; body.el.style.rotate = ''; });
    const sx = window.scrollX;
    const sy = window.scrollY;
    this.bodies.forEach((body) => {
      const rect = body.el.getBoundingClientRect();
      body.home = { left: rect.left, top: rect.top, w: rect.width, h: rect.height, sx, sy };
      body.written = '';
    });
  }

  resetBody(body) {
    body.el.style.translate = '';
    body.el.style.rotate = '';
    body.el.removeAttribute('data-hot');
    body.el.removeAttribute('data-cipher');
    body.el.removeAttribute('data-scan');
  }

  viewportRect(body) {
    const h = body.home;
    const dx = body.fixed ? 0 : window.scrollX - h.sx;
    const dy = body.fixed ? 0 : window.scrollY - h.sy;
    const left = h.left - dx + body.x;
    const top = h.top - dy + body.y;
    return { left, top, right: left + h.w, bottom: top + h.h, cx: left + h.w / 2, cy: top + h.h / 2 };
  }

  setCipher(body, on, now) {
    if (body.kind !== 'glyph') return;
    // El carácter real nunca se toca (React sigue siendo dueño del texto):
    // el cifrado se pinta con ::after a partir de data-cipher.
    if (!on) {
      if (body.cipher) { body.cipher = false; body.el.removeAttribute('data-cipher'); }
      return;
    }
    body.cipher = true;
    if (now >= body.nextSwap) {
      body.el.setAttribute('data-cipher', randomGlyph());
      body.nextSwap = now + (body.locked ? between(380, 900) : between(55, 120));
    }
  }

  /* ---------- terminal ---------- */

  setTerminalEl(el) {
    const t = this.terminal;
    t.el = el;
    if (!el) return;
    t.w = el.offsetWidth;
    t.h = el.offsetHeight;
    this.applyTerminal();
  }

  setDock(el, onDocked) {
    this.dockEl = el;
    this.onDocked = onDocked;
  }

  setMaximized(value) {
    this.maximized = value;
    if (value) {
      this.terminal.mode = 'idle';
      this.terminal.vx = 0;
      this.terminal.vy = 0;
    }
    this.applyTerminal();
    this.wake();
  }

  bounds() {
    const t = this.terminal;
    const maxX = Math.max(EDGE, window.innerWidth - t.w - EDGE);
    const maxY = t.h + EDGE * 2 > window.innerHeight ? Math.max(EDGE, window.innerHeight - 64) : window.innerHeight - t.h - EDGE;
    return { minX: EDGE, minY: EDGE, maxX, maxY };
  }

  applyTerminal() {
    const t = this.terminal;
    if (!t.el) return;
    if (!t.floating || this.maximized) {
      t.el.style.transform = '';
      return;
    }
    t.el.style.transform = `translate3d(${t.x.toFixed(2)}px, ${t.y.toFixed(2)}px, 0) rotate(${t.tilt.toFixed(3)}deg)`;
  }

  beginDrag(event, rect) {
    const t = this.terminal;
    if (!t.floating) {
      t.x = rect.left;
      t.y = rect.top;
      t.floating = true;
    }
    t.w = rect.width;
    t.h = rect.height;
    t.mode = 'drag';
    t.grabX = event.clientX - t.x;
    t.grabY = event.clientY - t.y;
    t.lastT = performance.now();
    t.lastX = event.clientX;
    t.lastY = event.clientY;
    t.vx = 0;
    t.vy = 0;
    t.pointerId = event.pointerId;
    this.dirty = this.dirty || !this.bodies.length;
    // Re-medimos al empezar para partir de posiciones exactas.
    if (!this.dirty) this.measure();
    window.addEventListener('pointermove', this.handlePointerMove);
    window.addEventListener('pointerup', this.handlePointerUp);
    window.addEventListener('pointercancel', this.handlePointerUp);
    this.wake();
  }

  handlePointerMove(event) {
    const t = this.terminal;
    if (t.mode !== 'drag' || event.pointerId !== t.pointerId) return;
    const now = performance.now();
    const dt = Math.max(1, now - t.lastT) / 1000;
    const instantVx = (event.clientX - t.lastX) / dt;
    const instantVy = (event.clientY - t.lastY) / dt;
    t.vx = t.vx * 0.55 + instantVx * 0.45;
    t.vy = t.vy * 0.55 + instantVy * 0.45;
    t.lastT = now;
    t.lastX = event.clientX;
    t.lastY = event.clientY;
    const b = this.bounds();
    t.x = clamp(event.clientX - t.grabX, b.minX, b.maxX);
    t.y = clamp(event.clientY - t.grabY, b.minY, b.maxY);
    this.wake();
  }

  handlePointerUp(event) {
    const t = this.terminal;
    if (t.mode !== 'drag' || event.pointerId !== t.pointerId) return;
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('pointerup', this.handlePointerUp);
    window.removeEventListener('pointercancel', this.handlePointerUp);
    // Si el puntero lleva quieto un rato, no hay lanzamiento.
    if (performance.now() - t.lastT > 90) { t.vx = 0; t.vy = 0; }
    const speed = Math.hypot(t.vx, t.vy);
    const dock = this.dockTarget();
    if (dock && Math.hypot(dock.x - t.x, dock.y - t.y) < 80 && speed < 1200) {
      t.mode = 'dock';
    } else if (!this.reducedMotion && speed > 60) {
      const limit = 4200;
      if (speed > limit) { t.vx *= limit / speed; t.vy *= limit / speed; }
      t.mode = 'glide';
    } else {
      t.mode = 'idle';
      t.vx = 0;
      t.vy = 0;
    }
    this.dockEl?.removeAttribute('data-near');
    this.onDragEnd?.();
    this.wake();
  }

  dockTarget() {
    if (!this.dockEl) return null;
    const rect = this.dockEl.getBoundingClientRect();
    return { x: rect.left, y: rect.top };
  }

  dock() {
    if (!this.terminal.floating) return;
    this.terminal.mode = 'dock';
    this.wake();
  }

  resetTerminal() {
    const t = this.terminal;
    Object.assign(t, { floating: false, mode: 'idle', vx: 0, vy: 0, tilt: 0 });
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('pointerup', this.handlePointerUp);
    window.removeEventListener('pointercancel', this.handlePointerUp);
    this.applyTerminal();
    this.wake();
  }

  stepTerminal(dt) {
    const t = this.terminal;
    if (!t.floating || this.maximized || !t.el) return false;
    const b = this.bounds();
    let moving = t.mode === 'drag';

    if (t.mode === 'glide') {
      const friction = Math.exp(-dt * 3.1);
      t.vx *= friction;
      t.vy *= friction;
      t.x += t.vx * dt;
      t.y += t.vy * dt;
      if (t.x < b.minX) { t.x = b.minX; t.vx = Math.abs(t.vx) * 0.55; }
      if (t.x > b.maxX) { t.x = b.maxX; t.vx = -Math.abs(t.vx) * 0.55; }
      if (t.y < b.minY) { t.y = b.minY; t.vy = Math.abs(t.vy) * 0.55; }
      if (t.y > b.maxY) { t.y = b.maxY; t.vy = -Math.abs(t.vy) * 0.55; }
      if (Math.hypot(t.vx, t.vy) < 14) { t.mode = 'idle'; t.vx = 0; t.vy = 0; }
      moving = true;
    } else if (t.mode === 'dock') {
      const target = this.dockTarget();
      if (!target) { t.mode = 'idle'; } else {
        const ax = (target.x - t.x) * 240 - t.vx * 30;
        const ay = (target.y - t.y) * 240 - t.vy * 30;
        t.vx += ax * dt;
        t.vy += ay * dt;
        t.x += t.vx * dt;
        t.y += t.vy * dt;
        moving = true;
        if (Math.hypot(target.x - t.x, target.y - t.y) < 0.8 && Math.hypot(t.vx, t.vy) < 20) {
          Object.assign(t, { mode: 'idle', floating: false, vx: 0, vy: 0, tilt: 0 });
          this.applyTerminal();
          this.onDocked?.();
          return true;
        }
      }
    } else if (t.mode === 'drag' && this.dockEl) {
      const target = this.dockTarget();
      const near = target && Math.hypot(target.x - t.x, target.y - t.y) < 80;
      if (near !== this.dockEl.hasAttribute('data-near')) {
        if (near) this.dockEl.setAttribute('data-near', ''); else this.dockEl.removeAttribute('data-near');
      }
    }

    if (t.mode === 'drag' && performance.now() - t.lastT > 60) {
      // Puntero quieto: la velocidad se disipa para que la inclinación vuelva.
      t.vx *= Math.exp(-dt * 14);
      t.vy *= Math.exp(-dt * 14);
    }

    const tiltTarget = this.reducedMotion || t.mode === 'dock' ? 0 : clamp(t.vx / 190, -5, 5);
    t.tilt += (tiltTarget - t.tilt) * Math.min(1, dt * 10);
    if (Math.abs(t.tilt) > 0.02) moving = true;
    this.applyTerminal();
    return moving;
  }

  terminalRect() {
    const t = this.terminal;
    if (!t.floating || this.maximized || !t.el) return null;
    return { left: t.x, top: t.y, right: t.x + t.w, bottom: t.y + t.h, cx: t.x + t.w / 2, cy: t.y + t.h / 2, vx: t.vx, vy: t.vy };
  }

  /* ---------- bucle ---------- */

  tick(now) {
    this.raf = 0;
    const dt = Math.min(0.034, Math.max(0.001, (now - this.last) / 1000));
    this.last = now;
    if (this.dirty) this.collect();

    let active = this.stepTerminal(dt);
    const T = this.terminalRect();
    // En reposo el campo es más suave; al moverse la terminal empuja con fuerza.
    const fieldScale = T ? 0.5 + 0.5 * Math.min(1, Math.hypot(T.vx, T.vy) / 500) : 0;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scan = this.scanState;
    if (scan) {
      const progress = clamp((now - scan.start) / scan.duration, 0, 1);
      const eased = progress < 0.5 ? 2 * progress * progress : 1 - (-2 * progress + 2) ** 2 / 2;
      scan.x = scan.from + (scan.to - scan.from) * eased;
      scan.line.style.transform = `translate3d(${scan.x.toFixed(1)}px, 0, 0)`;
      active = true;
    }

    for (const body of this.bodies) {
      if (!body.home) continue;
      const rect = this.viewportRect(body);
      const onScreen = rect.bottom > -200 && rect.top < vh + 200;
      let ax = 0;
      let ay = 0;
      let hot = false;
      let inside = false;

      if (body.mode === 'fall') {
        ay = 2600;
        body.vx *= Math.exp(-dt * 0.6);
      } else {
        if (body.mode === 'return' && now >= body.releaseAt) body.mode = 'spring';
        const k = body.mode === 'return' ? 0 : SPRING;
        ax = -k * body.x - DAMPING * body.vx;
        ay = -k * body.y - DAMPING * body.vy;
        if (body.mode === 'return') { ax = -DAMPING * 0.4 * body.vx; ay = -DAMPING * 0.4 * body.vy; }

        if (T && onScreen && !this.reducedMotion) {
          let gx;
          let gy;
          if (body.kind === 'glyph') {
            gx = rect.cx > T.right ? rect.cx - T.right : rect.cx < T.left ? rect.cx - T.left : 0;
            gy = rect.cy > T.bottom ? rect.cy - T.bottom : rect.cy < T.top ? rect.cy - T.top : 0;
          } else {
            gx = rect.left > T.right ? rect.left - T.right : rect.right < T.left ? rect.right - T.left : 0;
            gy = rect.top > T.bottom ? rect.top - T.bottom : rect.bottom < T.top ? rect.bottom - T.top : 0;
          }
          const d = Math.hypot(gx, gy);
          if (d === 0) {
            inside = true;
            if (body.kind === 'block') {
              const cx = rect.cx - T.cx;
              const cy = rect.cy - T.cy;
              const len = Math.hypot(cx, cy) || 1;
              ax += (cx / len) * BLOCK_FORCE * 1.4;
              ay += (cy / len) * BLOCK_FORCE * 1.4;
            }
          } else if (d < FIELD_RADIUS) {
            const nx = gx / d;
            const ny = gy / d;
            const falloff = (1 - d / FIELD_RADIUS) ** 2;
            const force = (body.kind === 'glyph' ? GLYPH_FORCE : BLOCK_FORCE) * fieldScale;
            ax += nx * force * falloff;
            ay += ny * force * falloff;
            const approach = T.vx * nx + T.vy * ny;
            if (approach > 0) {
              ax += nx * approach * KICK * falloff * (body.kind === 'glyph' ? 1 : 0.6);
              ay += ny * approach * KICK * falloff * (body.kind === 'glyph' ? 1 : 0.6);
            }
            hot = d < FIELD_RADIUS * 0.72;
          }
        }
      }

      body.vx += ax * dt;
      body.vy += ay * dt;
      body.x += body.vx * dt;
      body.y += body.vy * dt;

      if (body.mode === 'fall') {
        const baseTop = rect.top - body.y;
        const baseLeft = rect.left - body.x;
        const floor = vh - 6 - (baseTop + body.home.h);
        if (body.y > floor) {
          body.y = floor;
          body.vy = -Math.abs(body.vy) * 0.34;
          body.vx *= 0.82;
          body.spin *= 0.6;
          if (Math.abs(body.vy) < 40) body.vy = 0;
        }
        const minX = 4 - baseLeft;
        const maxX = vw - 4 - (baseLeft + body.home.w);
        if (body.x < minX) { body.x = minX; body.vx = Math.abs(body.vx) * 0.5; }
        if (body.x > maxX) { body.x = maxX; body.vx = -Math.abs(body.vx) * 0.5; }
        body.rot += body.spin * dt;
      } else {
        const limit = body.kind === 'glyph' ? 90 : 56;
        if (body.recovering && Math.abs(body.x) < limit && Math.abs(body.y) < limit) body.recovering = false;
        if (body.mode === 'spring' && !body.recovering) {
          body.x = clamp(body.x, -limit, limit);
          body.y = clamp(body.y, -limit, limit);
        }
        const rotTarget = body.kind === 'glyph' ? clamp(body.x * 0.32 + body.vx * 0.01, -28, 28) : clamp(body.x * 0.06, -5, 5);
        body.rot += (rotTarget - body.rot) * Math.min(1, dt * (body.mode === 'return' ? 4 : 12));
      }

      // Escaneo: la línea barre el texto y lo descifra al pasar.
      if (scan && !body.scanned && rect.cx <= scan.x) {
        body.scanned = true;
        body.flashUntil = now + 260;
        if (body.kind === 'block') body.el.setAttribute('data-scan', '');
        if (body.kind === 'glyph') body.vy -= 90;
      }
      if (body.kind === 'block' && body.flashUntil && now > body.flashUntil + 500) {
        body.flashUntil = 0;
        body.el.removeAttribute('data-scan');
      }

      // Estado cifrado de la letra.
      if (body.kind === 'glyph') {
        const wantsCipher = body.locked || inside || now < body.flashUntil || now < body.hoverUntil;
        if (wantsCipher) {
          body.restoreAt = now + (inside ? between(90, 320) : 0);
          this.setCipher(body, true, now);
          active = true;
        } else if (body.cipher && now >= body.restoreAt) {
          this.setCipher(body, false, now);
        } else if (body.cipher) {
          this.setCipher(body, true, now);
          active = true;
        }
        if (body.locked) active = true;
      }

      if (hot !== body.hot) {
        body.hot = hot;
        if (hot) body.el.setAttribute('data-hot', ''); else body.el.removeAttribute('data-hot');
      }

      const translate = Math.abs(body.x) < 0.05 && Math.abs(body.y) < 0.05 ? '' : `${body.x.toFixed(2)}px ${body.y.toFixed(2)}px`;
      const rotate = Math.abs(body.rot) < 0.05 ? '' : `${body.rot.toFixed(2)}deg`;
      const key = `${translate}|${rotate}`;
      if (key !== body.written) {
        body.written = key;
        body.el.style.translate = translate;
        body.el.style.rotate = rotate;
      }

      if (
        body.mode !== 'spring'
        || Math.abs(body.x) > 0.05 || Math.abs(body.y) > 0.05
        || Math.abs(body.vx) > 0.5 || Math.abs(body.vy) > 0.5
        || Math.abs(body.rot) > 0.05 || (T && hot)
      ) active = true;
    }

    if (scan) {
      scan.ends.forEach((end, group) => {
        if (scan.x >= end + 12 && !scan.groups.has(group)) { scan.groups.add(group); scan.onGroup?.(group); }
      });
    }

    if (scan && now >= scan.start + scan.duration) {
      scan.ends.forEach((_, group) => {
        if (!scan.groups.has(group)) { scan.groups.add(group); scan.onGroup?.(group); }
      });
      scan.line.remove();
      this.scanState = null;
      this.bodies.forEach((body) => { body.scanned = false; });
      window.setTimeout(() => {
        this.bodies.forEach((body) => { if (body.kind === 'block') { body.flashUntil = 0; body.el.removeAttribute('data-scan'); } });
      }, 700);
      scan.resolve();
    }

    if (this.gravity && now >= this.gravity.until) {
      const falling = this.bodies.filter((body) => body.mode === 'fall');
      falling.forEach((body, i) => {
        body.mode = 'return';
        body.recovering = true;
        body.releaseAt = now + i * 7;
        body.vx *= 0.2;
        body.vy = 0;
      });
      const resolve = this.gravity.resolve;
      this.gravity = null;
      resolve();
    }

    if (active || this.gravity || this.scanState || this.terminal.mode === 'drag') this.wake();
  }

  /* ---------- efectos ---------- */

  handleHover(event) {
    if (event.pointerType !== 'mouse' || this.reducedMotion) return;
    const body = this.byElement.get(event.target.closest?.('[data-glyph]'));
    if (!body || body.locked) return;
    body.hoverUntil = performance.now() + 240;
    body.vy -= 70;
    this.wake();
  }

  scan({ onGroup } = {}) {
    if (this.dirty) this.collect();
    if (this.scanState) return this.scanState.promise;
    const rect = this.root.getBoundingClientRect();
    const line = document.createElement('div');
    line.className = 'hero-scanline';
    line.setAttribute('aria-hidden', 'true');
    Object.assign(line.style, {
      top: `${Math.max(0, rect.top)}px`,
      height: `${Math.min(window.innerHeight, rect.bottom) - Math.max(0, rect.top)}px`,
    });
    document.body.appendChild(line);
    let resolve;
    const promise = new Promise((r) => { resolve = r; });
    const duration = this.reducedMotion ? 10 : 2100;
    const ends = new Map();
    this.bodies.forEach((body) => {
      if (!body.home) return;
      const { right } = this.viewportRect(body);
      ends.set(body.group, Math.max(ends.get(body.group) ?? -Infinity, right));
    });
    this.scanState = {
      line, promise, resolve, onGroup, duration, ends, groups: new Set(),
      start: performance.now(), from: rect.left - 40, to: rect.right + 40, x: rect.left - 40,
    };
    this.wake();
    return promise;
  }

  grep(term) {
    const needle = normalizeWord(term);
    if (!needle || !this.root) return [];
    const matches = [];
    this.root.querySelectorAll('[data-word]').forEach((word) => {
      if (!normalizeWord(word.getAttribute('data-word')).includes(needle)) return;
      matches.push(word);
      word.setAttribute('data-match', '');
      window.setTimeout(() => word.removeAttribute('data-match'), 4200);
      if (this.reducedMotion) return;
      word.querySelectorAll('[data-glyph]').forEach((el, i) => {
        const body = this.byElement.get(el);
        if (!body) return;
        body.vy -= 420 + i * 12;
        body.flashUntil = performance.now() + 180 + i * 30;
      });
    });
    this.wake();
    return matches;
  }

  encrypt() {
    if (this.dirty) this.collect();
    const glyphs = this.bodies.filter((body) => body.kind === 'glyph');
    glyphs.forEach((body, i) => {
      window.setTimeout(() => { body.locked = true; body.vy -= 40; this.wake(); }, this.reducedMotion ? 0 : i * 9);
    });
    this.cipherAll = true;
    this.wake();
    return new Promise((r) => window.setTimeout(r, this.reducedMotion ? 0 : glyphs.length * 9 + 200));
  }

  decrypt() {
    const glyphs = this.bodies.filter((body) => body.kind === 'glyph');
    glyphs.forEach((body, i) => {
      window.setTimeout(() => { body.locked = false; body.flashUntil = performance.now() + 120; this.wake(); }, this.reducedMotion ? 0 : i * 14);
    });
    this.cipherAll = false;
    this.wake();
    return new Promise((r) => window.setTimeout(r, this.reducedMotion ? 0 : glyphs.length * 14 + 260));
  }

  collapse(duration = 2600) {
    if (this.reducedMotion) return Promise.resolve(false);
    if (this.dirty) this.collect();
    if (this.gravity) return this.gravity.promise;
    const vh = window.innerHeight;
    this.bodies.forEach((body) => {
      const rect = this.viewportRect(body);
      if (rect.bottom < 0 || rect.top > vh) return;
      body.mode = 'fall';
      body.vx += between(-160, 160);
      body.vy += between(-420, -60);
      body.spin = between(-420, 420);
    });
    let resolve;
    const promise = new Promise((r) => { resolve = r; });
    this.gravity = { until: performance.now() + duration, resolve, promise };
    this.wake();
    return promise.then(() => true);
  }

  get encrypted() {
    return this.cipherAll;
  }
}
