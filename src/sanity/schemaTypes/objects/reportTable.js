export default {
  name: 'reportTable',
  title: 'Tabla de informe',
  type: 'object',
  fields: [
    {
      name: 'rows', title: 'Filas', type: 'array',
      of: [{ type: 'object', name: 'reportTableRow', fields: [
        { name: 'cells', title: 'Celdas', type: 'array', of: [{ type: 'string' }] },
      ] }],
    },
  ],
  preview: { prepare: () => ({ title: 'Tabla del informe' }) },
};
