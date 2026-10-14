'use client';

export default function PrintButton({ className = '', label = 'imprimir / guardar PDF' }) {
  return <button type="button" className={className} onClick={() => window.print()}>{label}</button>;
}
