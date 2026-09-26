export const siteSettings = {
  brandName: 'Miguel Pinedo',
  terminalUser: 'root',
  terminalHost: 'miguel',
  cvUrl: '/assets/CV_Miguel_Pinedo_moderno.pdf',
  footerCredit: 'diseñado & construido manualmente',
  navigation: [
    { label: 'sobre mí', href: '/sobre-mi' },
    { label: 'proyectos', href: '/proyectos' },
    { label: 'estudios', href: '/estudios' },
    { label: 'contacto', href: '/contacto' },
  ],
  seo: { metaTitle: 'Miguel Pinedo - Cybersecurity', metaDescription: '' },
};

export const homeContent = {
  prefix: '// SECURITY RESEARCHER & DEVELOPER',
  firstName: 'Miguel',
  lastName: 'Pinedo',
  tagline: 'Encuentro vulnerabilidades antes de que las encuentren otros.',
  terminalTitle: 'scan.sh - bash',
  terminalLines: [
    { delayMs: 0, type: 'cmd', text: 'whoami' },
    { delayMs: 600, type: 'out', text: 'miguel.pinedo - security researcher' },
    { delayMs: 1100, type: 'cmd', text: 'cat skills.txt' },
    { delayMs: 1700, type: 'ok', text: '[OK] Web Pentesting    - activo' },
    { delayMs: 2100, type: 'ok', text: '[OK] Network Analysis  - activo' },
    { delayMs: 2500, type: 'ok', text: '[OK] Linux Hardening   - activo' },
    { delayMs: 2900, type: 'ok', text: '[OK] Python scripting  - activo' },
    { delayMs: 3300, type: 'warn', text: '[~]  Red Team ops      - en progreso' },
    { delayMs: 3800, type: 'cmd', text: 'echo "open to work"' },
    { delayMs: 4400, type: 'out', text: 'open to work' },
    { delayMs: 4900, type: 'cursor', text: '' },
  ],
  primaryCta: { label: 'ver proyectos', href: '/proyectos' },
  secondaryCta: { label: 'contactar', href: '/contacto' },
  introTitle: 'perfil operativo',
  introBody: 'Ciberseguridad defensiva y ofensiva, administración de sistemas y desarrollo web.',
  seo: { metaTitle: 'Miguel Pinedo - Cybersecurity', metaDescription: '' },
};

export const aboutContent = {
  sectionLabel: '// 01 - sobre mí',
  sectionTitle: 'Perfil',
  bio: [
    'Especializado en ciberseguridad defensiva y ofensiva, con experiencia en análisis de vulnerabilidades, pentesting web y hardening de sistemas Linux.',
    'Combino mentalidad de atacante con disciplina de defensor. Cada sistema que analizo lo estudio con el objetivo de entenderlo desde dentro.',
    'Actualmente busco proyectos donde la seguridad no sea un añadido de última hora, sino parte del diseño.',
  ],
  skills: [
    { name: 'Pentesting Web', detail: 'OWASP / Burp Suite' },
    { name: 'Network Security', detail: 'Wireshark / Nmap' },
    { name: 'Linux / Bash', detail: 'Hardening / Scripts' },
    { name: 'CTF / Red Team', detail: 'HackTheBox / THM' },
    { name: 'Python', detail: 'Automatización / PoC' },
    { name: 'Forense', detail: 'Análisis de logs' },
  ],
  seo: { metaTitle: 'Sobre mí - Miguel Pinedo', metaDescription: '' },
};

export const capabilities = [
  { node: 'SYS-01', sector: 'identity_control', iconKey: 'windows-server', title: 'Windows Server', description: 'Creación, configuración y gestión de servidores Windows: roles, usuarios, permisos, políticas y hardening base.', tags: ['AD', 'GPO', 'Roles', 'Hardening'] },
  { node: 'SYS-02', sector: 'linux_defense', iconKey: 'linux-server', title: 'Servidores Linux', description: 'Despliegue, administración y gestión de servicios Linux: permisos, SSH, automatización con Bash y bastionado.', tags: ['Bash', 'SSH', 'Servicios', 'Seguridad'] },
  { node: 'AUD-03', sector: 'system_audit', iconKey: 'systems-audit', title: 'Auditoría de sistemas', description: 'Revisión de configuraciones, exposición, logs, permisos, vulnerabilidades y buenas prácticas de seguridad.', tags: ['Logs', 'Config', 'Riesgo', 'Defensa'] },
  { node: 'NET-04', sector: 'network_analysis', iconKey: 'network-audit', title: 'Auditoría de redes', description: 'Análisis de topología, puertos, servicios, tráfico, segmentación y superficie expuesta en redes.', tags: ['Nmap', 'Wireshark', 'Puertos', 'Tráfico'] },
  { node: 'SQL-05', sector: 'database_security', iconKey: 'sql-audit', title: 'Auditoría SQL', description: 'Revisión de permisos, configuración, exposición, consultas inseguras y riesgos comunes en bases de datos SQL.', tags: ['Permisos', 'Queries', 'Exposición', 'Riesgo'] },
];

export const studiesContent = {
  sectionLabel: '// 03 - formación y certificaciones',
  title: 'Credenciales',
  certifications: [
    { name: 'Certified Ethical Hacker (CEH)', issuer: 'EC-Council', year: '2024', orderRank: 10 },
    { name: 'CompTIA Security+', issuer: 'CompTIA', year: '2023', orderRank: 20 },
    { name: 'Grado en Ciberseguridad', issuer: 'Universidad / España', year: '2022', orderRank: 30 },
    { name: 'TryHackMe - Top 1%', issuer: 'TryHackMe', year: 'activo', orderRank: 40 },
  ],
  seo: { metaTitle: 'Estudios - Miguel Pinedo', metaDescription: '' },
};

const projectContent = [
  {
    _id: 'project-wazuh', orderRank: 10, title: 'Laboratorio SOC con Wazuh', slug: 'laboratorio-soc-wazuh',
    subtitle: 'Proyecto principal', category: 'laboratorio', customLabel: '001 · PROYECTO PRINCIPAL',
    mainImage: '/assets/lab-soc/portada-soc-wazuh.jpg',
    mainImageAlt: 'Collage del laboratorio SOC: alertas de fuerza bruta en Wazuh, respuesta activa firewall-drop y regla personalizada 100100',
    description: 'Entorno defensivo con Windows, Linux, Sysmon y Wazuh. Incluye fuerza bruta SSH, PowerShell codificado, FIM, respuesta activa, Wireshark, tres informes profesionales y una regla propia validada sin falsos positivos.',
    tags: ['Wazuh', 'Sysmon', 'Blue Team', 'MITRE ATT&CK', 'Wireshark'],
    stats: [{ value: '4/4', label: 'escenarios' }, { value: '3', label: 'informes' }, { value: '1', label: 'regla propia' }],
    year: null, featured: true,
    externalLinks: [{ kind: 'download', label: 'regla XML ↓', url: '/config/fim_soc_lab.xml' }],
    seo: { metaTitle: 'Laboratorio SOC con Wazuh · Miguel Pinedo', metaDescription: 'Caso de estudio del laboratorio SOC con Wazuh.' },
  },
  {
    _id: 'project-lavanderia', orderRank: 20, title: 'Lavandería Miguel', slug: 'lavanderia-miguel', subtitle: '', category: 'web', customLabel: '',
    mainImage: '/assets/lavanderia-miguel-preview-rework.jpg', mainImageAlt: 'Nueva portada del proyecto Lavandería Miguel - Rayo Washing',
    description: 'Sitio web para una lavandería de autoservicio, enfocado en presentar servicios, ubicación, contacto y una imagen profesional para un negocio local.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Vercel'], stats: [], year: null, featured: false,
    externalLinks: [
      { kind: 'demo', label: 'demo', url: 'https://lavanderia-miguel.vercel.app/' },
      { kind: 'repository', label: 'código', url: 'https://github.com/mpinedo04/lavanderia-miguel' },
    ], seo: { metaTitle: 'Lavandería Miguel · Miguel Pinedo', metaDescription: '' },
  },
  {
    _id: 'project-raul', orderRank: 30, title: 'Portafolio Raúl', slug: 'portafolio-raul', subtitle: '', category: 'web', customLabel: '',
    mainImage: '/assets/portafolio-raul-preview.png', mainImageAlt: 'Vista previa del proyecto Portafolio Raúl',
    description: 'Portafolio audiovisual para el filmmaker Raúl García: perfil, proyectos, equipo y contacto en una página profesional desplegada en Vercel.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Portfolio'], stats: [], year: null, featured: false,
    externalLinks: [
      { kind: 'demo', label: 'demo', url: 'https://portafolio-raul-sigma.vercel.app/' },
      { kind: 'repository', label: 'código', url: 'https://github.com/mpinedo04/portafolio-raul' },
    ], seo: { metaTitle: 'Portafolio Raúl · Miguel Pinedo', metaDescription: '' },
  },
  {
    _id: 'project-videoballs', orderRank: 40, title: 'VideoBalls Analytics', slug: 'videoballs-analytics', subtitle: '', category: 'aplicación', customLabel: '',
    mainImage: '/assets/videoballs-preview.png', mainImageAlt: 'Vista previa del proyecto VideoBalls Analytics',
    description: 'Proyecto web de analítica para visualizar información, estadísticas y datos relacionados con VideoBalls en una interfaz clara, desplegada en Vercel.',
    tags: ['Analytics', 'Web', 'JavaScript', 'Vercel'], stats: [], year: null, featured: false,
    externalLinks: [
      { kind: 'demo', label: 'demo', url: 'https://videoballs-analyticsraulmiguel2.vercel.app/' },
      { kind: 'repository', label: 'código', url: 'https://github.com/mpinedo04/videoballs-analytics' },
    ], seo: { metaTitle: 'VideoBalls Analytics · Miguel Pinedo', metaDescription: '' },
  },
];

export const projects = projectContent;

export const contactContent = {
  sectionLabel: '// 04 - contacto', title: 'Hablemos',
  subtitle: 'Si tienes un proyecto, una auditoría pendiente o simplemente quieres conectar, mi bandeja está abierta.',
  links: [
    { label: 'mpinedo@gmail.com', url: 'https://mail.google.com/mail/?view=cm&fs=1&to=mpinedo%40gmail.com&su=Contacto%20desde%20tu%20portafolio', iconKey: 'mail' },
    { label: 'github', url: 'https://github.com/mpinedo04', iconKey: 'github' },
  ],
  seo: { metaTitle: 'Contacto - Miguel Pinedo', metaDescription: '' },
};
