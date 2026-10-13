const navLink = {
  type: 'object', name: 'navigationLink', title: 'Enlace de navegación',
  fields: [
    { name: 'label', title: 'Texto', type: 'string', validation: (rule) => rule.required() },
    { name: 'href', title: 'Ruta', type: 'string', validation: (rule) => rule.required() },
  ],
  preview: { select: { title: 'label', subtitle: 'href' } },
};

export default {
  name: 'settings', title: 'Ajustes globales', type: 'document',
  fields: [
    { name: 'brandName', title: 'Nombre de marca', type: 'string', validation: (rule) => rule.required() },
    { name: 'navigation', title: 'Navegación', type: 'array', of: [navLink] },
    { name: 'cvUrl', title: 'Ruta del CV', type: 'string' },
    { name: 'footerCredit', title: 'Crédito del pie', type: 'string' },
    { name: 'seo', title: 'SEO global', type: 'object', fields: [
      { name: 'metaTitle', title: 'Título SEO global', type: 'string' },
      { name: 'metaDescription', title: 'Descripción SEO global', type: 'text', rows: 3 },
    ] },
  ],
};
