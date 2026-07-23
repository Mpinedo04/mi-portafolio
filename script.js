const terminalLines = [
  { delay: 0, type: "cmd", text: "whoami" },
  { delay: 600, type: "out", text: "miguel.pinedo - security researcher" },
  { delay: 1100, type: "cmd", text: "cat skills.txt" },
  { delay: 1700, type: "ok", text: "[OK] Web Pentesting    - activo" },
  { delay: 2100, type: "ok", text: "[OK] Network Analysis  - activo" },
  { delay: 2500, type: "ok", text: "[OK] Linux Hardening   - activo" },
  { delay: 2900, type: "ok", text: "[OK] Python scripting  - activo" },
  { delay: 3300, type: "warn", text: "[~]  Red Team ops      - en progreso" },
  { delay: 3800, type: "cmd", text: "echo \"open to work\"" },
  { delay: 4400, type: "out", text: "open to work" },
  { delay: 4900, type: "cursor" }
];

const terminalBody = document.getElementById("term-body");

if (terminalBody) {
  terminalLines.forEach((line) => {
    setTimeout(() => {
      const row = document.createElement("span");
      row.className = "t-line";

      if (line.type === "cursor") {
        row.innerHTML = '<span class="t-prompt">&gt; </span><span class="cursor"></span>';
      } else if (line.type === "cmd") {
        row.innerHTML = `<span class="t-prompt">&gt; </span><span class="t-cmd">${line.text}</span>`;
      } else if (line.type === "ok") {
        row.innerHTML = `<span class="t-ok">${line.text}</span>`;
      } else if (line.type === "warn") {
        row.innerHTML = `<span class="t-warn">${line.text}</span>`;
      } else {
        row.innerHTML = `<span class="t-out">${line.text}</span>`;
      }

      terminalBody.appendChild(row);
    }, line.delay);
  });
}

const transitionLayer = document.createElement("div");
transitionLayer.className = "page-transition";
transitionLayer.innerHTML = `
  <div class="transition-panel">
    accessing node
    <span>secure route established</span>
    <div class="transition-bar"></div>
  </div>
`;
document.body.appendChild(transitionLayer);

function goWithTransition(url) {
  if (reduceMotion) {
    window.location.href = url;
    return;
  }

  document.body.classList.add("page-is-leaving");
  transitionLayer.classList.add("is-active");

  window.setTimeout(() => {
    window.location.href = url;
  }, 620);
}

document.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link) return;

  const href = link.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:")) return;
  if (link.href.includes("github.com")) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;

  event.preventDefault();
  goWithTransition(link.href);
});

document.querySelectorAll(".project-card[data-demo-url]").forEach((card) => {
  card.addEventListener("click", (event) => {
    if (event.target.closest("a")) return;

    goWithTransition(card.dataset.demoUrl);
  });
});

function resetTransition() {
  document.body.classList.remove("page-is-leaving");
  transitionLayer.classList.remove("is-active");
}

window.addEventListener("pageshow", resetTransition);
window.addEventListener("focus", resetTransition);

const canvas = document.getElementById("cyber-bg");
const ctx = canvas.getContext("2d");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const pointer = {
  x: window.innerWidth * 0.62,
  y: window.innerHeight * 0.38,
  px: window.innerWidth * 0.62,
  py: window.innerHeight * 0.38,
  speed: 0,
  active: false
};

let width = 0;
let height = 0;
let dpr = 1;
let particles = [];
let networkNodes = [];
let radarAngle = 0;
let frameId = 0;

function resizeCanvas() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  createBackgroundPoints();
}

function createBackgroundPoints() {
  const particleCount = width < 720 ? 44 : 92;
  const nodeCount = width < 720 ? 16 : 28;

  particles = Array.from({ length: particleCount }, () => {
    const x = Math.random() * width;
    const y = Math.random() * height;

    return {
      homeX: x,
      homeY: y,
      x,
      y,
      vx: 0,
      vy: 0,
      size: Math.random() * 1.2 + 0.45
    };
  });

  networkNodes = Array.from({ length: nodeCount }, (_, index) => {
    const column = index % 7;
    const row = Math.floor(index / 7);

    return {
      x: (column + 0.6 + Math.random() * 0.6) * (width / 7),
      y: (row + 0.7 + Math.random() * 0.5) * (height / Math.ceil(nodeCount / 7))
    };
  });
}

function trackPointer(event) {
  pointer.active = true;
  pointer.px = pointer.x;
  pointer.py = pointer.y;
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  pointer.speed = Math.hypot(pointer.x - pointer.px, pointer.y - pointer.py);
}

function drawGrid() {
  const gap = 60;
  const influence = 170;

  ctx.lineWidth = 1;

  for (let x = 0; x <= width + gap; x += gap) {
    const distance = Math.abs(pointer.x - x);
    const alpha = 0.045 + Math.max(0, 1 - distance / influence) * 0.06;
    ctx.strokeStyle = `rgba(204, 214, 246, ${alpha})`;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 0; y <= height + gap; y += gap) {
    const distance = Math.abs(pointer.y - y);
    const alpha = 0.045 + Math.max(0, 1 - distance / influence) * 0.06;
    ctx.strokeStyle = `rgba(204, 214, 246, ${alpha})`;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  for (let x = 0; x <= width + gap; x += gap) {
    for (let y = 0; y <= height + gap; y += gap) {
      const dist = Math.hypot(pointer.x - x, pointer.y - y);
      const glow = Math.max(0, 1 - dist / 185);

      if (glow > 0.03) {
        ctx.fillStyle = `rgba(0, 255, 136, ${0.08 + glow * 0.42})`;
        ctx.beginPath();
        ctx.arc(x, y, 1.2 + glow * 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

function updateParticles() {
  particles.forEach((particle) => {
    const dx = particle.x - pointer.x;
    const dy = particle.y - pointer.y;
    const distance = Math.max(Math.hypot(dx, dy), 1);

    if (distance < 145) {
      const force = (1 - distance / 145) * 0.42;
      particle.vx += (dx / distance) * force;
      particle.vy += (dy / distance) * force;
    }

    particle.vx += (particle.homeX - particle.x) * 0.006;
    particle.vy += (particle.homeY - particle.y) * 0.006;
    particle.vx *= 0.9;
    particle.vy *= 0.9;
    particle.x += particle.vx;
    particle.y += particle.vy;

    const pulse = Math.max(0, 1 - distance / 180);
    ctx.fillStyle = `rgba(204, 214, 246, ${0.12 + pulse * 0.3})`;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size + pulse * 0.7, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawNetwork() {
  for (let i = 0; i < networkNodes.length; i += 1) {
    const a = networkNodes[i];
    const mouseA = Math.max(0, 1 - Math.hypot(pointer.x - a.x, pointer.y - a.y) / 260);

    ctx.fillStyle = `rgba(0, 255, 136, ${0.09 + mouseA * 0.38})`;
    ctx.beginPath();
    ctx.arc(a.x, a.y, 1.5 + mouseA * 1.2, 0, Math.PI * 2);
    ctx.fill();

    for (let j = i + 1; j < networkNodes.length; j += 1) {
      const b = networkNodes[j];
      const nodeDistance = Math.hypot(a.x - b.x, a.y - b.y);
      const midpointX = (a.x + b.x) / 2;
      const midpointY = (a.y + b.y) / 2;
      const cursorDistance = Math.hypot(pointer.x - midpointX, pointer.y - midpointY);
      const strength = Math.max(0, 1 - cursorDistance / 250);

      if (nodeDistance < 215 && strength > 0.03) {
        ctx.strokeStyle = `rgba(0, 255, 136, ${strength * 0.18})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }
}

function drawRadar() {
  if (!pointer.active) return;

  radarAngle += 0.025;
  const radius = 185;
  const endX = pointer.x + Math.cos(radarAngle) * radius;
  const endY = pointer.y + Math.sin(radarAngle) * radius;
  const gradient = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, radius);

  gradient.addColorStop(0, "rgba(0, 255, 136, 0.055)");
  gradient.addColorStop(0.58, "rgba(0, 255, 136, 0.018)");
  gradient.addColorStop(1, "rgba(0, 255, 136, 0)");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(pointer.x, pointer.y, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(0, 255, 136, 0.22)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pointer.x, pointer.y);
  ctx.lineTo(endX, endY);
  ctx.stroke();
}

function drawMicroGlitch() {
  if (pointer.speed < 28) return;

  const strips = Math.min(7, Math.floor(pointer.speed / 12));

  for (let i = 0; i < strips; i += 1) {
    const y = pointer.y + (Math.random() - 0.5) * 92;
    const x = pointer.x + (Math.random() - 0.5) * 120;
    const length = 18 + Math.random() * 64;
    const alpha = Math.min(0.22, pointer.speed / 420);

    ctx.fillStyle = `rgba(0, 255, 136, ${alpha})`;
    ctx.fillRect(x, y, length, 1);
  }
}

function render() {
  ctx.clearRect(0, 0, width, height);
  drawGrid();
  drawNetwork();
  updateParticles();
  drawRadar();
  drawMicroGlitch();

  pointer.speed *= 0.88;
  frameId = requestAnimationFrame(render);
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("pointermove", trackPointer, { passive: true });
window.addEventListener("pointerleave", () => {
  pointer.active = false;
});

resizeCanvas();

if (reduceMotion) {
  drawGrid();
  drawNetwork();
  updateParticles();
} else {
  frameId = requestAnimationFrame(render);
}

const capabilitiesSection = document.querySelector(".capabilities-section");
const capabilityCards = [...document.querySelectorAll(".capability-card")];
const precisePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (capabilitiesSection && capabilityCards.length) {
  capabilityCards.forEach((card, index) => {
    card.style.setProperty("--card-index", index);
  });

  if (!reduceMotion) {
    capabilitiesSection.classList.add("capabilities-motion-ready");

    if ("IntersectionObserver" in window) {
      const capabilityObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      }, {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.16
      });

      capabilityCards.forEach((card) => capabilityObserver.observe(card));
    } else {
      capabilityCards.forEach((card) => card.classList.add("is-visible"));
    }
  } else {
    capabilityCards.forEach((card) => card.classList.add("is-visible"));
  }

  if (!reduceMotion && precisePointer) {
    let sectionFrame = 0;

    capabilitiesSection.addEventListener("pointermove", (event) => {
      if (sectionFrame) return;

      sectionFrame = window.requestAnimationFrame(() => {
        const bounds = capabilitiesSection.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width) * 100;
        const y = ((event.clientY - bounds.top) / bounds.height) * 100;

        capabilitiesSection.style.setProperty("--ops-x", `${x.toFixed(2)}%`);
        capabilitiesSection.style.setProperty("--ops-y", `${y.toFixed(2)}%`);
        sectionFrame = 0;
      });
    }, { passive: true });

    capabilityCards.forEach((card) => {
      let cardFrame = 0;

      card.addEventListener("pointermove", (event) => {
        if (cardFrame) return;

        cardFrame = window.requestAnimationFrame(() => {
          const bounds = card.getBoundingClientRect();
          const x = (event.clientX - bounds.left) / bounds.width;
          const y = (event.clientY - bounds.top) / bounds.height;
          const normalizedX = x - 0.5;
          const normalizedY = y - 0.5;

          card.classList.add("is-tracking");
          card.style.setProperty("--rotate-x", `${(-normalizedY * 7).toFixed(2)}deg`);
          card.style.setProperty("--rotate-y", `${(normalizedX * 9).toFixed(2)}deg`);
          card.style.setProperty("--glow-x", `${(x * 100).toFixed(2)}%`);
          card.style.setProperty("--glow-y", `${(y * 100).toFixed(2)}%`);
          card.style.setProperty("--image-x", `${(-normalizedX * 7).toFixed(2)}px`);
          card.style.setProperty("--image-y", `${(-normalizedY * 5).toFixed(2)}px`);
          cardFrame = 0;
        });
      }, { passive: true });

      card.addEventListener("pointerleave", () => {
        if (cardFrame) {
          window.cancelAnimationFrame(cardFrame);
          cardFrame = 0;
        }

        card.classList.remove("is-tracking");
        card.style.setProperty("--rotate-x", "0deg");
        card.style.setProperty("--rotate-y", "0deg");
        card.style.setProperty("--glow-x", "50%");
        card.style.setProperty("--glow-y", "50%");
        card.style.setProperty("--image-x", "0px");
        card.style.setProperty("--image-y", "0px");
      });
    });
  }
}
