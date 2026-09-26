export const singletonIds = {
  settings: 'settings', home: 'home', about: 'about', workstation: 'workstation', studies: 'studies', contact: 'contact',
};

export const portfolioStructure = (S) => S.list().title('Miguel Pinedo · Portfolio').items([
  S.listItem().title('Ajustes globales').child(S.document().schemaType('settings').documentId('settings')),
  S.listItem().title('Inicio').child(S.document().schemaType('home').documentId('home')),
  S.listItem().title('Sobre mí').child(S.document().schemaType('about').documentId('about')),
  S.listItem().title('Capacidades operativas').child(S.document().schemaType('workstation').documentId('workstation')),
  S.listItem().title('Estudios').child(S.document().schemaType('studies').documentId('studies')),
  S.listItem().title('Contacto').child(S.document().schemaType('contact').documentId('contact')),
  S.divider(),
  S.documentTypeListItem('project').title('Proyectos').child(S.documentTypeList('project').title('Proyectos')),
  S.documentTypeListItem('report').title('Guías e informes').child(S.documentTypeList('report').title('Guías e informes')),
]);
