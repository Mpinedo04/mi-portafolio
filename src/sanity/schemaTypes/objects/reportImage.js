export default {
  name: 'reportImage',
  title: 'Imagen de evidencia',
  type: 'object',
  fields: [
    { name: 'image', title: 'Imagen en Sanity', type: 'image', options: { hotspot: true } },
    { name: 'url', title: 'Ruta pública de imagen existente', type: 'string', description: 'Se usa para evidencias que se conservan en public/assets.' },
    { name: 'alt', title: 'Texto alternativo', type: 'string' },
    { name: 'caption', title: 'Pie de imagen', type: 'string' },
  ],
  preview: { select: { title: 'caption', media: 'image' }, prepare: ({ title, media }) => ({ title: title || 'Evidencia', media }) },
};
