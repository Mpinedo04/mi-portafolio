// Textos de la interfaz (botones, etiquetas, avisos) en cada idioma.
// El contenido (biografía, proyectos, formación…) está en src/data/content.

const es = {
  seo: {
    siteName: 'Miguel Pinedo · Ciberseguridad y sistemas',
    ogAlt: 'Miguel Pinedo · Técnico en ciberseguridad y sistemas. Laboratorio SOC con Wazuh, informes de incidentes y desarrollo web seguro.',
  },
  header: { home: 'Ir al inicio', cv: 'Descargar o ver el CV de Miguel Pinedo en PDF', language: 'Idioma' },
  transition: { '/': 'Inicio', '/sobre-mi': 'Sobre mí', '/proyectos': 'Proyectos', '/estudios': 'Formación', '/contacto': 'Contacto', caseStudy: 'Caso de estudio', project: 'Proyecto' },
  card: { caseStudy: 'caso de estudio', viewDemo: 'ver demo', demo: 'demo', code: 'código', opensDemo: '(abre la demo en una pestaña nueva)', results: 'Resultados de' },
  featured: { label: '// 01 - proyecto destacado', all: 'todos los proyectos →', openCase: 'abrir caso de estudio →', reports: 'informes publicados', viewCase: 'ver caso de estudio', alsoBuilt: 'también he construido', project: 'proyecto', newTab: '(se abre en una pestaña nueva)' },
  scroll: { backToTop: 'volver arriba', rail: 'Control lateral de desplazamiento', thumb: 'Desplazamiento de página', ofPage: 'de la página' },
  form: {
    subject: 'Contacto desde tu portafolio', name: 'Nombre', email: 'Correo', extra: 'Empresa o teléfono', optional: '(opcional)', message: 'Mensaje',
    send: 'enviar mensaje', sending: 'enviando…',
    sent: '¡Mensaje enviado! Te responderé lo antes posible.', error: 'No se pudo enviar. Prueba de nuevo o escríbeme directamente al correo.',
  },
  report: {
    evidence: 'Evidencia del informe', download: 'Descargar archivo', print: 'imprimir / guardar PDF', label: '// caso de estudio · ',
    breadcrumbs: 'Ruta de navegación', projects: 'proyectos', reports: 'informes', back: '← volver al proyecto', backToList: '← volver a casos de estudio',
    notFound: 'Informe no encontrado · Miguel Pinedo', spanishOnly: '',
  },
  reportsIndex: {
    label: '// documentación técnica', title: 'Casos de estudio', open: 'Abrir documentación técnica',
    intro: (title) => `${title} · guías, informes y casos de estudio.`,
    metaTitle: (title) => `Casos de estudio · ${title} · Miguel Pinedo`,
    metaDescription: (title) => `Documentación técnica del proyecto ${title}: guías, informes y casos de estudio con evidencias.`,
    empty: 'Todavía no hay documentación publicada para este proyecto.', back: '← volver al proyecto', notFound: 'Proyecto no encontrado · Miguel Pinedo',
  },
  home: { profileLabel: '// 02 - perfil', seeProfile: 'ver perfil y experiencia →' },
  projects: {
    metaTitle: 'Proyectos - Miguel Pinedo',
    metaDescription: 'Proyectos de Miguel Pinedo: laboratorio SOC con Wazuh con tres informes de incidentes, StagePlot Studio (app de pago con backend seguro) y webs desplegadas en Vercel.',
    label: '// 02 - proyectos', title: 'Trabajo seleccionado',
  },
  project: { label: '// proyecto seleccionado', openCase: 'abrir caso de estudio →', back: '← volver a proyectos', notFound: 'Proyecto no encontrado · Miguel Pinedo' },
  about: { capabilitiesLabel: '// capacidades', capabilitiesTitle: 'Qué sé hacer', illustration: 'Ilustración de', opsAria: 'capacidades' },
  contact: { orWrite: 'o escríbeme directamente' },
  notFound: {
    label: '// ERROR 404 · PÁGINA NO ENCONTRADA',
    description: 'La página que buscas no existe o ha cambiado de dirección.',
    back: 'Volver al inicio →',
  },
  hero: {
    terminal: 'Terminal interactiva', close: 'Cerrar terminal', closeTitle: 'Cerrar', minimize: 'Minimizar terminal', minimizeTitle: 'Minimizar',
    maximize: 'Maximizar terminal', maximizeTitle: 'Maximizar', restoreSize: 'Restaurar tamaño de terminal', restoreTitle: 'Restaurar',
    input: 'Escribe un comando (prueba help)', placeholder: 'escribe help…', skip: 'saltar ›', try: 'prueba',
    restore: 'Restaurar terminal', open: 'Abrir terminal', drop: '⌂ suelta la terminal aquí para acoplarla', restoreWindow: 'Restaurar ventana de terminal',
    hintStart: 'arrastra la barra y ', hintThrow: 'lánzala', hintEnd: ' contra el texto · escribe ', hintClosed: 'la terminal sigue aquí cuando la necesites',
    click: 'clic →', grepWord: 'sistemas',
  },
};

const en = {
  seo: {
    siteName: 'Miguel Pinedo · Cybersecurity & Systems',
    ogAlt: 'Miguel Pinedo · Cybersecurity and systems technician. SOC lab with Wazuh, incident reports and secure web development.',
  },
  header: { home: 'Go to home page', cv: "Download or view Miguel Pinedo's CV (PDF)", language: 'Language' },
  transition: { '/': 'Home', '/sobre-mi': 'About me', '/proyectos': 'Projects', '/estudios': 'Education', '/contacto': 'Contact', caseStudy: 'Case study', project: 'Project' },
  card: { caseStudy: 'case study', viewDemo: 'view demo', demo: 'demo', code: 'code', opensDemo: '(opens the demo in a new tab)', results: 'Results of' },
  featured: { label: '// 01 - featured project', all: 'all projects →', openCase: 'open case study →', reports: 'published reports', viewCase: 'view case study', alsoBuilt: 'I have also built', project: 'project', newTab: '(opens in a new tab)' },
  scroll: { backToTop: 'back to top', rail: 'Side scroll control', thumb: 'Page scroll', ofPage: 'of the page' },
  form: {
    subject: 'Contact from your portfolio', name: 'Name', email: 'Email', extra: 'Company or phone', optional: '(optional)', message: 'Message',
    send: 'send message', sending: 'sending…',
    sent: 'Message sent! I will get back to you as soon as possible.', error: 'It could not be sent. Try again or email me directly.',
  },
  report: {
    evidence: 'Report evidence', download: 'Download file', print: 'print / save as PDF', label: '// case study · ',
    breadcrumbs: 'Breadcrumb', projects: 'projects', reports: 'reports', back: '← back to the project', backToList: '← back to case studies',
    notFound: 'Report not found · Miguel Pinedo', spanishOnly: 'This document is only available in Spanish.',
  },
  reportsIndex: {
    label: '// technical documentation', title: 'Case studies', open: 'Open technical documentation',
    intro: (title) => `${title} · guides, reports and case studies (in Spanish).`,
    metaTitle: (title) => `Case studies · ${title} · Miguel Pinedo`,
    metaDescription: (title) => `Technical documentation for ${title}: guides, reports and case studies with evidence (in Spanish).`,
    empty: 'There is no documentation for this project yet.', back: '← back to the project', notFound: 'Project not found · Miguel Pinedo',
  },
  home: { profileLabel: '// 02 - profile', seeProfile: 'see profile and experience →' },
  projects: {
    metaTitle: 'Projects - Miguel Pinedo',
    metaDescription: 'Projects by Miguel Pinedo: a Wazuh SOC lab with three incident reports, StagePlot Studio (a paid app with a secure backend) and websites deployed on Vercel.',
    label: '// 02 - projects', title: 'Selected work',
  },
  project: { label: '// selected project', openCase: 'open case study →', back: '← back to projects', notFound: 'Project not found · Miguel Pinedo' },
  about: { capabilitiesLabel: '// capabilities', capabilitiesTitle: 'What I can do', illustration: 'Illustration of', opsAria: 'capabilities' },
  contact: { orWrite: 'or email me directly' },
  notFound: {
    label: '// ERROR 404 · PAGE NOT FOUND',
    description: 'The page you are looking for does not exist or has moved.',
    back: 'Back to the home page →',
  },
  hero: {
    terminal: 'Interactive terminal', close: 'Close terminal', closeTitle: 'Close', minimize: 'Minimise terminal', minimizeTitle: 'Minimise',
    maximize: 'Maximise terminal', maximizeTitle: 'Maximise', restoreSize: 'Restore terminal size', restoreTitle: 'Restore',
    input: 'Type a command (try help)', placeholder: 'type help…', skip: 'skip ›', try: 'try',
    restore: 'Restore terminal', open: 'Open terminal', drop: '⌂ drop the terminal here to dock it', restoreWindow: 'Restore terminal window',
    hintStart: 'drag the title bar and ', hintThrow: 'throw it', hintEnd: ' at the text · type ', hintClosed: 'the terminal is still here when you need it',
    click: 'click →', grepWord: 'systems',
  },
};

const ca = {
  seo: {
    siteName: 'Miguel Pinedo · Ciberseguretat i sistemes',
    ogAlt: 'Miguel Pinedo · Tècnic en ciberseguretat i sistemes. Laboratori SOC amb Wazuh, informes d’incidents i desenvolupament web segur.',
  },
  header: { home: 'Anar a l’inici', cv: 'Descarregar o veure el CV de Miguel Pinedo en PDF', language: 'Idioma' },
  transition: { '/': 'Inici', '/sobre-mi': 'Sobre mi', '/proyectos': 'Projectes', '/estudios': 'Formació', '/contacto': 'Contacte', caseStudy: 'Cas d’estudi', project: 'Projecte' },
  card: { caseStudy: 'cas d’estudi', viewDemo: 'veure demo', demo: 'demo', code: 'codi', opensDemo: '(obre la demo en una pestanya nova)', results: 'Resultats de' },
  featured: { label: '// 01 - projecte destacat', all: 'tots els projectes →', openCase: 'obrir cas d’estudi →', reports: 'informes publicats', viewCase: 'veure cas d’estudi', alsoBuilt: 'també he construït', project: 'projecte', newTab: '(s’obre en una pestanya nova)' },
  scroll: { backToTop: 'tornar amunt', rail: 'Control lateral de desplaçament', thumb: 'Desplaçament de pàgina', ofPage: 'de la pàgina' },
  form: {
    subject: 'Contacte des del teu portafoli', name: 'Nom', email: 'Correu', extra: 'Empresa o telèfon', optional: '(opcional)', message: 'Missatge',
    send: 'enviar missatge', sending: 'enviant…',
    sent: 'Missatge enviat! Et respondré tan aviat com pugui.', error: 'No s’ha pogut enviar. Torna-ho a provar o escriu-me directament al correu.',
  },
  report: {
    evidence: 'Evidència de l’informe', download: 'Descarregar fitxer', print: 'imprimir / desar en PDF', label: '// cas d’estudi · ',
    breadcrumbs: 'Ruta de navegació', projects: 'projectes', reports: 'informes', back: '← tornar al projecte', backToList: '← tornar als casos d’estudi',
    notFound: 'Informe no trobat · Miguel Pinedo', spanishOnly: 'Aquest document només està disponible en castellà.',
  },
  reportsIndex: {
    label: '// documentació tècnica', title: 'Casos d’estudi', open: 'Obrir documentació tècnica',
    intro: (title) => `${title} · guies, informes i casos d’estudi (en castellà).`,
    metaTitle: (title) => `Casos d’estudi · ${title} · Miguel Pinedo`,
    metaDescription: (title) => `Documentació tècnica del projecte ${title}: guies, informes i casos d’estudi amb evidències (en castellà).`,
    empty: 'Encara no hi ha documentació publicada per a aquest projecte.', back: '← tornar al projecte', notFound: 'Projecte no trobat · Miguel Pinedo',
  },
  home: { profileLabel: '// 02 - perfil', seeProfile: 'veure perfil i experiència →' },
  projects: {
    metaTitle: 'Projectes - Miguel Pinedo',
    metaDescription: 'Projectes de Miguel Pinedo: laboratori SOC amb Wazuh amb tres informes d’incidents, StagePlot Studio (app de pagament amb backend segur) i webs publicades a Vercel.',
    label: '// 02 - projectes', title: 'Treball seleccionat',
  },
  project: { label: '// projecte seleccionat', openCase: 'obrir cas d’estudi →', back: '← tornar als projectes', notFound: 'Projecte no trobat · Miguel Pinedo' },
  about: { capabilitiesLabel: '// capacitats', capabilitiesTitle: 'Què sé fer', illustration: 'Il·lustració de', opsAria: 'capacitats' },
  contact: { orWrite: 'o escriu-me directament' },
  notFound: {
    label: '// ERROR 404 · PÀGINA NO TROBADA',
    description: 'La pàgina que busques no existeix o ha canviat d’adreça.',
    back: 'Tornar a l’inici →',
  },
  hero: {
    terminal: 'Terminal interactiu', close: 'Tancar el terminal', closeTitle: 'Tancar', minimize: 'Minimitzar el terminal', minimizeTitle: 'Minimitzar',
    maximize: 'Maximitzar el terminal', maximizeTitle: 'Maximitzar', restoreSize: 'Restaurar la mida del terminal', restoreTitle: 'Restaurar',
    input: 'Escriu una ordre (prova help)', placeholder: 'escriu help…', skip: 'saltar ›', try: 'prova',
    restore: 'Restaurar el terminal', open: 'Obrir el terminal', drop: '⌂ deixa anar el terminal aquí per acoblar-lo', restoreWindow: 'Restaurar la finestra del terminal',
    hintStart: 'arrossega la barra i ', hintThrow: 'llança’l', hintEnd: ' contra el text · escriu ', hintClosed: 'el terminal continua aquí quan el necessitis',
    click: 'clic →', grepWord: 'sistemes',
  },
};

export const ui = { es, en, ca };

export const t = (lang) => ui[lang] || ui.es;
