export default {
  name: 'workstation', title: 'Capacidades operativas', type: 'document',
  fields: [
    { name: 'capabilities', title: 'Capacidades', type: 'array', of: [{ type: 'object', name: 'capability', fields: [
      { name: 'node', title: 'Nodo', type: 'string' },
      { name: 'sector', title: 'Sector', type: 'string' },
      { name: 'iconKey', title: 'SVG local', type: 'string', options: { list: ['windows-server', 'linux-server', 'systems-audit', 'network-audit', 'sql-audit'] } },
      { name: 'title', title: 'Título', type: 'string', validation: (rule) => rule.required() },
      { name: 'description', title: 'Descripción', type: 'text', rows: 4 },
      { name: 'tags', title: 'Etiquetas', type: 'array', of: [{ type: 'string' }] },
      { name: 'orderRank', title: 'Orden', type: 'number' },
    ], preview: { select: { title: 'title', subtitle: 'node' } } }] },
  ],
};
