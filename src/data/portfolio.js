export const siteSettings = {
  brandName: 'Miguel Pinedo',
  cvUrl: '/assets/CV_Miguel_Pinedo_moderno.pdf',
  footerCredit: 'diseñado & construido manualmente',
  navigation: [
    { label: 'sobre mí', href: '/sobre-mi' },
    { label: 'proyectos', href: '/proyectos' },
    { label: 'estudios', href: '/estudios' },
    { label: 'contacto', href: '/contacto' },
  ],
  seo: { metaTitle: 'Miguel Pinedo - Cybersecurity', metaDescription: 'Portafolio de ciberseguridad de Miguel Pinedo: laboratorio SOC con Wazuh, informes de incidentes, pentesting web, hardening de Linux y desarrollo web.' },
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
  seo: { metaTitle: 'Miguel Pinedo - Cybersecurity', metaDescription: 'Portafolio de ciberseguridad de Miguel Pinedo: laboratorio SOC con Wazuh, informes de incidentes, pentesting web, hardening de Linux y desarrollo web.' },
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
  seo: { metaTitle: 'Sobre mí - Miguel Pinedo', metaDescription: 'Perfil de Miguel Pinedo: ciberseguridad defensiva y ofensiva, análisis de vulnerabilidades, pentesting web, hardening de Linux y automatización con Python.' },
};

export const capabilities = [
  { node: 'SYS-01', sector: 'identity_control', iconKey: 'windows-server', title: 'Windows Server', description: 'Creación, configuración y gestión de servidores Windows: roles, usuarios, permisos, políticas y hardening base.', tags: ['AD', 'GPO', 'Roles', 'Hardening'] },
  { node: 'SYS-02', sector: 'linux_defense', iconKey: 'linux-server', title: 'Servidores Linux', description: 'Despliegue, administración y gestión de servicios Linux: permisos, SSH, automatización con Bash y bastionado.', tags: ['Bash', 'SSH', 'Servicios', 'Seguridad'] },
  { node: 'AUD-03', sector: 'system_audit', iconKey: 'systems-audit', title: 'Auditoría de sistemas', description: 'Revisión de configuraciones, exposición, logs, permisos, vulnerabilidades y buenas prácticas de seguridad.', tags: ['Logs', 'Config', 'Riesgo', 'Defensa'] },
  { node: 'NET-04', sector: 'network_analysis', iconKey: 'network-audit', title: 'Auditoría de redes', description: 'Análisis de topología, puertos, servicios, tráfico, segmentación y superficie expuesta en redes.', tags: ['Nmap', 'Wireshark', 'Puertos', 'Tráfico'] },
  { node: 'SQL-05', sector: 'database_security', iconKey: 'sql-audit', title: 'Auditoría SQL', description: 'Revisión de permisos, configuración, exposición, consultas inseguras y riesgos comunes en bases de datos SQL.', tags: ['Permisos', 'Queries', 'Exposición', 'Riesgo'] },
];

export const studiesContent = {
  sectionLabel: '// 03 - estudios',
  title: 'Formación',
  certifications: [
    {
      name: 'Grado Superior en Administración de Sistemas Informáticos en Red (ASIX)',
      issuer: 'Formación Profesional · perfil de ciberseguridad · nota final 8,01',
      year: '2023 – 2026', orderRank: 5,
      highlights: ['Proyecto final · 10', 'Ciberseguridad y hacking ético · 9', 'Seguridad y alta disponibilidad · 9', 'Prácticas en empresa · 383 h'],
    },
  ],
  seo: { metaTitle: 'Estudios - Miguel Pinedo', metaDescription: 'Formación de Miguel Pinedo: Grado Superior en Administración de Sistemas Informáticos en Red (ASIX) con perfil de ciberseguridad.' },
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
    seo: { metaTitle: 'Laboratorio SOC con Wazuh · Miguel Pinedo', metaDescription: 'Laboratorio SOC con Wazuh, Sysmon y Wireshark: fuerza bruta SSH, PowerShell codificado, integridad de archivos, respuesta activa y una regla propia validada.' },
  },
  {
    _id: 'project-stageplot', orderRank: 15, title: 'StagePlot Studio', slug: 'stageplot-studio', subtitle: 'App de pago · código privado', category: 'aplicación', customLabel: '',
    mainImage: '/assets/stageplot-studio-preview.jpg', mainImageAlt: 'Editor de StagePlot Studio: escenario en 3D con músicos, cableado y monitores, biblioteca de instrumentos y consola de 24 canales',
    description: 'Editor de stage plots en 3D para técnicos de sonido y bandas: montas el escenario arrastrando instrumentos, monitores y sub-snakes, y Auto-Patch numera los canales en un patchbay de 24 entradas y 8 auxiliares. Genera la input list y una ficha técnica imprimible, comparte el bolo con un enlace de solo lectura y se instala como app en el móvil, también sin cobertura. Detrás hay un backend propio: base de datos PostgreSQL en Supabase con seguridad por filas, acceso con código de un solo uso por email (sin contraseñas), licencias anuales con límite de dispositivos, panel de administración de clientes y pagos, y funciones en Cloudflare que solo entregan el editor a quien tiene una licencia válida.',
    tags: ['React', 'Supabase', 'PostgreSQL', 'Cloudflare Pages', 'PWA'],
    stats: [{ value: '24/8', label: 'entradas / aux' }, { value: '8', label: 'tablas con RLS' }, { value: '28', label: 'funciones SQL' }],
    year: null, featured: false,
    externalLinks: [
      { kind: 'demo', label: 'web', url: 'https://stageplot-studio.pages.dev/' },
    ], seo: { metaTitle: 'StagePlot Studio · Miguel Pinedo', metaDescription: 'App de pago para sonido en directo: editor de stage plots en 3D con patchbay, input list y ficha técnica, y backend con Supabase, licencias y control de dispositivos.' },
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
  // ID del formulario en formspree.io (lo que va después de /f/). Vacío: no se muestra el formulario.
  formspreeId: '',
  links: [
    { label: 'mpinedo@gmail.com', url: 'mailto:mpinedo@gmail.com?subject=Contacto%20desde%20tu%20portafolio', iconKey: 'mail' },
    { label: 'github', url: 'https://github.com/mpinedo04', iconKey: 'github' },
  ],
  seo: { metaTitle: 'Contacto - Miguel Pinedo', metaDescription: 'Contacta con Miguel Pinedo para proyectos de ciberseguridad, auditorías o desarrollo web.' },
};
