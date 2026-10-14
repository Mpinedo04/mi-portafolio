// English text. Only the translatable fields: the rest (images, links, order…) comes from src/data/portfolio.js.
const en = {
  siteSettings: {
    footerCredit: 'designed & built by hand',
    navigation: [{ label: 'about me' }, { label: 'projects' }, { label: 'education' }, { label: 'contact' }],
    seo: { metaTitle: 'Miguel Pinedo · Cybersecurity & Systems', metaDescription: 'Portfolio of Miguel Pinedo, IT systems and network administration technician (ASIX, Spain) specialised in cybersecurity: Wazuh SOC lab, incident reports, systems administration and secure web development.' },
  },
  homeContent: {
    prefix: '// CYBERSECURITY & SYSTEMS TECHNICIAN',
    tagline: 'Ready to defend systems and networks from my very first job.',
    terminalLines: [
      {},
      { text: 'miguel.pinedo - ASIX systems technician' },
      {},
      { text: '[OK] Ethical hacking    - grade 9' },
      { text: '[OK] Security & HA      - grade 9' },
      { text: '[OK] SIEM with Wazuh    - own lab' },
      { text: '[OK] Windows & Linux    - administration' },
      { text: '[~]  Red Team           - learning' },
      {},
      {},
      {},
    ],
    primaryCta: { label: 'view projects' },
    secondaryCta: { label: 'get in touch' },
    introTitle: 'Cybersecurity and systems technician',
    introBody: 'Higher Technician in IT Systems and Network Administration (ASIX) specialised in cybersecurity, with a final grade of 8.01/10. I administer Windows and Linux systems, build detection environments with Wazuh and develop web applications with security built into the design. I am looking for my first job in a SOC or in systems administration.',
    seo: { metaTitle: 'Miguel Pinedo · Cybersecurity & Systems', metaDescription: 'Portfolio of Miguel Pinedo, IT systems and network administration technician specialised in cybersecurity: Wazuh SOC lab, incident reports, systems administration and secure web development.' },
  },
  aboutContent: {
    sectionLabel: '// 01 - about me',
    sectionTitle: 'Profile',
    bio: [
      'I hold a Higher Technician diploma in IT Systems and Network Administration (ASIX, Spanish vocational higher education) specialised in cybersecurity, with a final grade of 8.01/10. Before that, I completed the intermediate diploma in Microcomputer Systems and Networks.',
      'I learn by building: I set up a SOC lab with Wazuh where I launch, detect and document attacks, and I developed StagePlot Studio, a paid application with its own accounts, licences and layered security.',
      'I am looking for my first job in cybersecurity (SOC, blue team) or systems administration, in a team where I can keep learning and contribute from day one.',
    ],
    skills: [
      { name: 'Defensive security', detail: 'Wazuh / Sysmon / SIEM' },
      { name: 'Ethical hacking', detail: 'Web pentesting / OWASP' },
      { name: 'Networking', detail: 'Wireshark / Nmap / Firewalls' },
      { name: 'Systems', detail: 'Windows Server / Linux' },
      { name: 'Scripting', detail: 'Bash / Python' },
      { name: 'Web development', detail: 'React / Next.js / Supabase' },
    ],
    seo: { metaTitle: 'About me - Miguel Pinedo', metaDescription: 'Profile of Miguel Pinedo: IT systems and network administration technician specialised in cybersecurity, work placements, his own SOC lab and secure web development.' },
  },
  experienceContent: {
    sectionLabel: '// experience',
    title: 'Experience',
    items: [
      { role: 'ASIX work placement', detail: 'On-the-job training (FCT) for the IT Systems and Network Administration diploma · 383 hours.' },
      { role: 'IT intern', period: '9 months', detail: 'Work placement for the Microcomputer Systems and Networks diploma.' },
    ],
    others: 'Other jobs: waiter at La Bastilla (9 months) and Interim Group (6 months).',
  },
  capabilities: [
    { title: 'Windows Server', description: 'Setting up, configuring and managing Windows servers: roles, users, permissions, policies and baseline hardening.', tags: ['AD', 'GPO', 'Roles', 'Hardening'] },
    { title: 'Linux servers', description: 'Deploying, administering and managing Linux services: permissions, SSH, Bash automation and hardening.', tags: ['Bash', 'SSH', 'Services', 'Security'] },
    { title: 'Systems auditing', description: 'Reviewing configurations, exposure, logs, permissions, vulnerabilities and security best practices.', tags: ['Logs', 'Config', 'Risk', 'Defence'] },
    { title: 'Network auditing', description: 'Analysing topology, ports, services, traffic, segmentation and the exposed attack surface of networks.', tags: ['Nmap', 'Wireshark', 'Ports', 'Traffic'] },
    { title: 'SQL auditing', description: 'Reviewing permissions, configuration, exposure, unsafe queries and common risks in SQL databases.', tags: ['Permissions', 'Queries', 'Exposure', 'Risk'] },
  ],
  studiesContent: {
    sectionLabel: '// 03 - education',
    title: 'Education',
    certifications: [
      {
        name: 'Higher Technician in IT Systems and Network Administration (ASIX)',
        issuer: 'Spanish vocational higher education · cybersecurity profile · final grade 8.01/10',
        highlights: ['Final project · 10', 'Cybersecurity & ethical hacking · 9', 'Security & high availability · 9', 'Placement at Simón Coll · 383 h'],
      },
      {
        name: 'Technician in Microcomputer Systems and Networks (SMX)',
        issuer: 'Spanish vocational education · placement at Finques Pardas',
      },
    ],
    seo: { metaTitle: 'Education - Miguel Pinedo', metaDescription: 'Education of Miguel Pinedo: Higher Technician in IT Systems and Network Administration (ASIX) specialised in cybersecurity, and Technician in Microcomputer Systems and Networks (SMX).' },
  },
  projects: {
    'laboratorio-soc-wazuh': {
      title: 'SOC lab with Wazuh', subtitle: 'Main project', category: 'lab', customLabel: '001 · MAIN PROJECT',
      mainImageAlt: 'SOC lab collage: brute-force alerts in Wazuh, firewall-drop active response and custom rule 100100',
      description: 'A defensive environment with Windows, Linux, Sysmon and Wazuh. It covers SSH brute force, encoded PowerShell, file integrity monitoring, active response and Wireshark, with three professional reports and a custom rule validated with no false positives.',
      stats: [{ label: 'scenarios' }, { label: 'reports' }, { label: 'custom rule' }],
      externalLinks: [{ label: 'XML rule ↓' }],
      seo: { metaTitle: 'SOC lab with Wazuh · Miguel Pinedo', metaDescription: 'SOC lab with Wazuh, Sysmon and Wireshark: SSH brute force, encoded PowerShell, file integrity, active response and a validated custom rule.' },
    },
    'stageplot-studio': {
      subtitle: 'Paid app · private code', category: 'application',
      mainImageAlt: 'StagePlot Studio editor: 3D stage with musicians, cabling and monitors, instrument library and a 24-channel console',
      description: 'A 3D stage plot editor for sound engineers and bands: you build the stage by dragging instruments, monitors and sub-snakes, and Auto-Patch numbers the channels on a 24-input, 8-aux patchbay. It generates the input list and a printable tech rider, shares the gig through a read-only link and installs as an app on your phone, even without coverage. Behind it there is a custom backend: a PostgreSQL database on Supabase with row-level security, passwordless one-time email codes, yearly licences with device limits, an admin panel for customers and payments, and Cloudflare functions that only deliver the editor to users with a valid licence.',
      stats: [{ label: 'inputs / aux' }, { label: 'tables with RLS' }, { label: 'SQL functions' }],
      seo: { metaTitle: 'StagePlot Studio · Miguel Pinedo', metaDescription: 'A paid app for live sound: 3D stage plot editor with patchbay, input list and tech rider, and a backend with Supabase, licences and device control.' },
    },
    'lavanderia-miguel': {
      category: 'website', mainImageAlt: 'New homepage of the Lavandería Miguel project - Rayo Washing',
      description: 'Website for a self-service laundrette, focused on presenting its services, location and contact details with a professional image for a local business.',
      externalLinks: [{ label: 'demo' }, { label: 'code' }],
    },
    'portafolio-raul': {
      title: 'Raúl’s portfolio', category: 'website', mainImageAlt: 'Preview of Raúl’s portfolio project',
      description: 'Audiovisual portfolio for filmmaker Raúl García: profile, projects, gear and contact on a professional page deployed on Vercel.',
      externalLinks: [{ label: 'demo' }, { label: 'code' }],
    },
    'videoballs-analytics': {
      category: 'application', mainImageAlt: 'Preview of the VideoBalls Analytics project',
      description: 'An analytics web project to display information, statistics and data about VideoBalls in a clear interface, deployed on Vercel.',
      externalLinks: [{ label: 'demo' }, { label: 'code' }],
    },
  },
  contactContent: {
    sectionLabel: '// 04 - contact', title: 'Let’s talk',
    subtitle: 'If you are looking for someone to join your cybersecurity or systems team, or want to tell me about a project, write to me and I will get back to you soon.',
    seo: { metaTitle: 'Contact - Miguel Pinedo', metaDescription: 'Contact Miguel Pinedo, a cybersecurity and systems technician looking for his first job in a SOC or in systems administration.' },
  },
};

export default en;
