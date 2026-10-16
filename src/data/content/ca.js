// Textos en català. Només els camps traduïbles: la resta (imatges, enllaços, ordre…) surt de src/data/portfolio.js.
const ca = {
  siteSettings: {
    footerCredit: 'dissenyat i construït a mà',
    navigation: [{ label: 'sobre mi' }, { label: 'projectes' }, { label: 'estudis' }, { label: 'contacte' }],
    seo: { metaTitle: 'Miguel Pinedo · Ciberseguretat i sistemes', metaDescription: 'Portafoli de Miguel Pinedo, Tècnic Superior en ASIX amb perfil de ciberseguretat: laboratori SOC amb Wazuh, informes d’incidents, administració de sistemes i desenvolupament web segur.' },
  },
  homeContent: {
    prefix: '// TÈCNIC EN CIBERSEGURETAT I SISTEMES',
    tagline: 'A punt per defensar sistemes i xarxes des de la meva primera feina.',
    terminalLines: [
      {},
      { text: 'miguel.pinedo - tècnic superior ASIX' },
      {},
      { text: '[OK] Hacking ètic       - nota 9' },
      { text: '[OK] Seguretat i HA     - nota 9' },
      { text: '[OK] SIEM amb Wazuh     - lab propi' },
      { text: '[OK] Windows i Linux    - administració' },
      { text: '[~]  Red Team           - aprenent' },
      {},
      {},
      {},
    ],
    stats: [
      { label: 'nota final de l’ASIX' },
      { label: 'de pràctiques a l’empresa' },
      { label: 'informes d’incidents' },
      { label: 'idiomes · es · ca · en B1' },
    ],
    primaryCta: { label: 'veure projectes' },
    secondaryCta: { label: 'contactar' },
    introTitle: 'Tècnic en ciberseguretat i sistemes',
    introBody: 'Tècnic Superior en ASIX amb perfil de ciberseguretat (nota final 8,01). Administro sistemes Windows i Linux, munto entorns de detecció amb Wazuh i desenvolupo aplicacions web amb la seguretat en el disseny. Busco la meva primera feina en un SOC o en administració de sistemes.',
    seo: { metaTitle: 'Miguel Pinedo · Ciberseguretat i sistemes', metaDescription: 'Portafoli de Miguel Pinedo, Tècnic Superior en ASIX amb perfil de ciberseguretat: laboratori SOC amb Wazuh, informes d’incidents, administració de sistemes i desenvolupament web segur.' },
  },
  aboutContent: {
    sectionLabel: '// 01 - sobre mi',
    sectionTitle: 'Perfil',
    bio: [
      'Soc Tècnic Superior en Administració de Sistemes Informàtics en Xarxa (ASIX) amb perfil de ciberseguretat, amb una nota final de 8,01. Abans vaig cursar el Grau Mitjà de Sistemes Microinformàtics i Xarxes.',
      'Aprenc construint: he muntat un laboratori SOC amb Wazuh on provoco, detecto i documento atacs, i he desenvolupat StagePlot Studio, una aplicació de pagament amb el seu propi sistema de comptes, llicències i seguretat per capes.',
      'Busco la meva primera feina en ciberseguretat (SOC, blue team) o en administració de sistemes, en un equip on continuar aprenent i aportar des del primer dia.',
    ],
    skills: [
      { name: 'Seguretat defensiva', detail: 'Wazuh / Sysmon / SIEM' },
      { name: 'Hacking ètic', detail: 'Pentesting web / OWASP' },
      { name: 'Xarxes', detail: 'Wireshark / Nmap / Tallafocs' },
      { name: 'Sistemes', detail: 'Windows Server / Linux' },
      { name: 'Scripting', detail: 'Bash / Python' },
      { name: 'Desenvolupament web', detail: 'React / Next.js / Supabase' },
    ],
    seo: { metaTitle: 'Sobre mi - Miguel Pinedo', metaDescription: 'Perfil de Miguel Pinedo: Tècnic Superior en ASIX amb perfil de ciberseguretat, pràctiques en empresa, laboratori SOC propi i desenvolupament web segur.' },
  },
  experienceContent: {
    sectionLabel: '// experiència',
    title: 'Experiència',
    items: [
      { role: 'Pràctiques del Grau Superior ASIX', detail: 'Formació en centre de treball (FCT) del cicle d’Administració de Sistemes Informàtics en Xarxa · 383 hores.' },
      { role: 'Informàtic en pràctiques', period: '9 mesos', detail: 'Pràctiques del Grau Mitjà de Sistemes Microinformàtics i Xarxes.' },
    ],
    others: 'Altres feines: cambrer a La Bastilla (9 mesos) i Interim Group (6 mesos).',
  },
  capabilities: [
    { title: 'Windows Server', description: 'Creació, configuració i gestió de servidors Windows: rols, usuaris, permisos, polítiques i bastionament bàsic.', tags: ['AD', 'GPO', 'Rols', 'Bastionament'] },
    { title: 'Servidors Linux', description: 'Desplegament, administració i gestió de serveis Linux: permisos, SSH, automatització amb Bash i bastionament.', tags: ['Bash', 'SSH', 'Serveis', 'Seguretat'] },
    { title: 'Auditoria de sistemes', description: 'Revisió de configuracions, exposició, registres, permisos, vulnerabilitats i bones pràctiques de seguretat.', tags: ['Registres', 'Config', 'Risc', 'Defensa'] },
    { title: 'Auditoria de xarxes', description: 'Anàlisi de topologia, ports, serveis, trànsit, segmentació i superfície exposada a les xarxes.', tags: ['Nmap', 'Wireshark', 'Ports', 'Trànsit'] },
    { title: 'Auditoria SQL', description: 'Revisió de permisos, configuració, exposició, consultes insegures i riscos habituals en bases de dades SQL.', tags: ['Permisos', 'Consultes', 'Exposició', 'Risc'] },
  ],
  studiesContent: {
    sectionLabel: '// 03 - estudis',
    title: 'Formació',
    certifications: [
      {
        name: 'Grau Superior en Administració de Sistemes Informàtics en Xarxa (ASIX)',
        issuer: 'Formació Professional · perfil de ciberseguretat · nota final 8,01',
        highlights: ['Projecte final · 10', 'Ciberseguretat i hacking ètic · 9', 'Seguretat i alta disponibilitat · 9', 'Pràctiques a Simón Coll · 383 h'],
      },
      {
        name: 'Grau Mitjà en Sistemes Microinformàtics i Xarxes (SMX)',
        issuer: 'Formació Professional · pràctiques a Finques Pardas',
      },
    ],
    seo: { metaTitle: 'Estudis - Miguel Pinedo', metaDescription: 'Formació de Miguel Pinedo: Grau Superior en Administració de Sistemes Informàtics en Xarxa (ASIX) amb perfil de ciberseguretat i Grau Mitjà en Sistemes Microinformàtics i Xarxes (SMX).' },
  },
  projects: {
    'laboratorio-soc-wazuh': {
      title: 'Laboratori SOC amb Wazuh', subtitle: 'Projecte principal', category: 'laboratori', customLabel: '001 · PROJECTE PRINCIPAL',
      mainImageAlt: 'Collage del laboratori SOC: alertes de força bruta a Wazuh, resposta activa firewall-drop i regla personalitzada 100100',
      description: 'Entorn defensiu amb Windows, Linux, Sysmon i Wazuh. Inclou força bruta SSH, PowerShell codificat, integritat de fitxers, resposta activa i Wireshark, amb tres informes professionals i una regla pròpia validada sense falsos positius.',
      stats: [{ label: 'escenaris' }, { label: 'informes' }, { label: 'regla pròpia' }],
      externalLinks: [{ label: 'regla XML ↓' }],
      seo: { metaTitle: 'Laboratori SOC amb Wazuh · Miguel Pinedo', metaDescription: 'Laboratori SOC amb Wazuh, Sysmon i Wireshark: força bruta SSH, PowerShell codificat, integritat de fitxers, resposta activa i una regla pròpia validada.' },
    },
    'stageplot-studio': {
      subtitle: 'App de pagament · codi privat', category: 'aplicació',
      mainImageAlt: 'Editor de StagePlot Studio: escenari en 3D amb músics, cablejat i monitors, biblioteca d’instruments i consola de 24 canals',
      description: 'Editor de stage plots en 3D per a tècnics de so i bandes: muntes l’escenari arrossegant instruments, monitors i sub-snakes, i Auto-Patch numera els canals en un patchbay de 24 entrades i 8 auxiliars. Genera la input list i una fitxa tècnica imprimible, comparteix el bolo amb un enllaç de només lectura i s’instal·la com a app al mòbil, també sense cobertura. Al darrere hi ha un backend propi: base de dades PostgreSQL a Supabase amb seguretat per files, accés amb codi d’un sol ús per correu (sense contrasenyes), llicències anuals amb límit de dispositius, tauler d’administració de clients i pagaments, i funcions a Cloudflare que només lliuren l’editor a qui té una llicència vàlida.',
      stats: [{ label: 'entrades / aux' }, { label: 'taules amb RLS' }, { label: 'funcions SQL' }],
      seo: { metaTitle: 'StagePlot Studio · Miguel Pinedo', metaDescription: 'App de pagament per al so en directe: editor de stage plots en 3D amb patchbay, input list i fitxa tècnica, i backend amb Supabase, llicències i control de dispositius.' },
    },
    'lavanderia-miguel': {
      mainImageAlt: 'Nova portada del projecte Lavandería Miguel - Rayo Washing',
      description: 'Lloc web per a una bugaderia d’autoservei, enfocat a presentar serveis, ubicació, contacte i una imatge professional per a un negoci local.',
      externalLinks: [{ label: 'demo' }, { label: 'codi' }],
    },
    'portafolio-raul': {
      title: 'Portafoli Raúl', mainImageAlt: 'Previsualització del projecte Portafoli Raúl',
      description: 'Portafoli audiovisual per al filmmaker Raúl García: perfil, projectes, equip i contacte en una pàgina professional publicada a Vercel.',
      externalLinks: [{ label: 'demo' }, { label: 'codi' }],
    },
    'videoballs-analytics': {
      category: 'aplicació', mainImageAlt: 'Previsualització del projecte VideoBalls Analytics',
      description: 'Projecte web d’analítica per visualitzar informació, estadístiques i dades relacionades amb VideoBalls en una interfície clara, publicat a Vercel.',
      externalLinks: [{ label: 'demo' }, { label: 'codi' }],
    },
  },
  contactContent: {
    sectionLabel: '// 04 - contacte', title: 'Parlem',
    subtitle: 'Si busques algú per al teu equip de ciberseguretat o sistemes, o vols comentar-me un projecte, escriu-me i et respondré aviat.',
    seo: { metaTitle: 'Contacte - Miguel Pinedo', metaDescription: 'Contacta amb Miguel Pinedo: tècnic en ciberseguretat i sistemes que busca la seva primera feina en un SOC o en administració de sistemes.' },
  },
};

export default ca;
