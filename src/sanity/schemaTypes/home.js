const cta = {
  type: 'object', fields: [
    { name: 'label', title: 'Texto', type: 'string' },
    { name: 'href', title: 'Enlace', type: 'string' },
  ],
};

export default {
  name: 'home', title: 'Inicio', type: 'document',
  fields: [
    { name: 'prefix', title: 'Prefijo', type: 'string' },
    { name: 'firstName', title: 'Nombre', type: 'string' },
    { name: 'lastName', title: 'Apellido', type: 'string' },
    { name: 'tagline', title: 'Tagline', type: 'string' },
    { name: 'terminalTitle', title: 'Título de terminal', type: 'string' },
    { name: 'terminalLines', title: 'Líneas animadas', type: 'array', of: [{ type: 'object', name: 'terminalLine', fields: [
      { name: 'delayMs', title: 'Retardo (ms)', type: 'number' },
      { name: 'type', title: 'Tipo', type: 'string', options: { list: ['cmd', 'out', 'ok', 'warn', 'cursor'] } },
      { name: 'text', title: 'Texto', type: 'string' },
    ] }] },
    { name: 'primaryCta', title: 'Acción principal', ...cta },
    { name: 'secondaryCta', title: 'Acción secundaria', ...cta },
    { name: 'introTitle', title: 'Título de introducción', type: 'string' },
    { name: 'introBody', title: 'Texto de introducción', type: 'text', rows: 4 },
    { name: 'seo', title: 'SEO de inicio', type: 'object', fields: [
      { name: 'metaTitle', title: 'Título SEO', type: 'string' },
      { name: 'metaDescription', title: 'Descripción SEO', type: 'text', rows: 3 },
    ] },
  ],
};
