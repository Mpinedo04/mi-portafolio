// Aviso flotante breve abajo en el centro. Se borra solo.
export function toast(text, ms = 3300) {
  if (typeof document === 'undefined') return;
  document.querySelectorAll('.fx-toast').forEach((node) => node.remove());
  const node = document.createElement('div');
  node.className = 'fx-toast';
  node.setAttribute('role', 'status');
  node.textContent = text;
  document.body.appendChild(node);
  window.setTimeout(() => node.remove(), ms);
}
