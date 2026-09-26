export default {
  name: 'contact', title: 'Contacto', type: 'document',
  fields: [
    { name: 'sectionLabel', title: 'Etiqueta de sección', type: 'string' },
    { name: 'title', title: 'Título', type: 'string' },
    { name: 'subtitle', title: 'Texto', type: 'text', rows: 3 },
    { name: 'links', title: 'Enlaces de contacto', type: 'array', of: [{ type: 'object', name: 'contactLink', fields: [
      { name: 'label', title: 'Texto visible', type: 'string' },
      { name: 'url', title: 'URL', type: 'string' },
      { name: 'iconKey', title: 'Icono', type: 'string', options: { list: ['mail', 'github', 'linkedin', 'external'] } },
    ], preview: { select: { title: 'label', subtitle: 'url' } } }] },
    { name: 'seo', title: 'SEO de Contacto', type: 'object', fields: [
      { name: 'metaTitle', title: 'Título SEO', type: 'string' },
      { name: 'metaDescription', title: 'Descripción SEO', type: 'text', rows: 3 },
    ] },
  ],
};
