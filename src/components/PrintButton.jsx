'use client';

export default function PrintButton({ className = '' }) {
  return <button type="button" className={className} onClick={() => window.print()}>imprimir / guardar PDF</button>;
}
