export default {
  name: 'downloadLink',
  title: 'Enlace de descarga',
  type: 'object',
  fields: [
    { name: 'label', title: 'Texto visible', type: 'string', validation: (rule) => rule.required() },
    { name: 'url', title: 'URL o ruta pública', type: 'string', validation: (rule) => rule.required() },
  ],
  preview: { select: { title: 'label', subtitle: 'url' } },
};
