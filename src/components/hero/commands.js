/*
 * Comandos de la terminal del hero.
 * Cada comando recibe (args, raw, api) y puede ser asíncrono. La terminal
 * bloquea la entrada mientras se ejecuta y Ctrl+C lo cancela (api.wait lanza).
 * Los textos están en MESSAGES por idioma (api.lang); los nombres de comandos y de secciones no se traducen.
 */

import { dateLocales } from '@/i18n/config';

export const line = (tone, ...parts) => ({ tone, parts });
export const run = (text, command = text) => ({ text, run: command });
export const link = (text, href) => ({ text, href });
export const mark = (text, tone = 'hl') => ({ text, tone });

const SECTION_PATHS = { 'sobre-mi': '/sobre-mi', proyectos: '/proyectos', estudios: '/estudios', contacto: '/contacto' };

const FILES = ['skills.txt', 'cv.pdf', 'readme.md'];

const MESSAGES = {
  es: {
    sections: { 'sobre-mi': 'perfil, experiencia y capacidades', proyectos: 'laboratorios, apps y casos de estudio', estudios: 'formación', contacto: 'email y redes' },
    help: [
      ['help', 'lista de comandos', 'help'],
      ['whoami', 'quién soy', 'whoami'],
      ['ls', 'secciones y archivos', 'ls'],
      ['cd <sección>', 'navega: cd proyectos', 'cd proyectos'],
      ['cat skills.txt', 'habilidades', 'cat skills.txt'],
      ['scan', 'analiza esta página', 'scan'],
      ['grep <palabra>', 'resalta una palabra del texto', 'grep sistemas'],
      ['nmap', 'puertos abiertos del portafolio', 'nmap'],
      ['echo "…" > tagline', 'reescribe el lema', 'echo "hackeando el lema en directo" > tagline'],
      ['encrypt / decrypt', 'cifra y descifra el texto', 'encrypt'],
      ['sudo rm -rf /', 'mejor no…', 'sudo rm -rf /'],
      ['cv', 'abre el CV en PDF', 'cv'],
      ['contacto', 'cómo hablar conmigo', 'contacto'],
      ['clear · reset · exit', 'limpiar, restaurar, cerrar', 'clear'],
    ],
    helpTitle: 'comandos disponibles (haz clic o escríbelos):',
    helpTip: 'tip: arrastra la ventana por la barra y lánzala contra el texto. ↑/↓ historial, Tab autocompleta.',
    whoami: ['miguel.pinedo — técnico superior en ASIX · ciberseguridad y sistemas', 'blue team · SIEM con Wazuh · administración Windows/Linux · desarrollo web seguro'],
    uname: 'MiguelOS 26.10 x86_64 · next.js · sanity · café',
    lsNoAccess: (target) => `ls: no se puede acceder a '${target}': No existe el archivo o el directorio`,
    cdMissing: (command, target) => `${command}: ${target}: No existe el directorio`,
    tryLs: 'prueba con ',
    alreadyHere: (label) => `ya estás en ${label}`,
    going: (label) => `[OK] accediendo a ~/${label} …`,
    readme: ['# Miguel Pinedo', 'Técnico Superior en ASIX con perfil de ciberseguridad. Busco mi primer puesto en un SOC o en administración de sistemas.'],
    readmeFeatured: 'Proyecto destacado: ',
    catMissing: (file) => `cat: ${file}: No existe el archivo`,
    cvOpening: '[OK] abriendo CV_Miguel_Pinedo.pdf', cvFallback: 'si no se abre: ', cvDownload: 'descargar CV',
    goTo: 'o ve a ',
    reset: '[OK] texto, posición y ventana restaurados',
    hack: 'hack: prueba algo más concreto: ', or: ' o ',
    scanStart: '[*] analizando la página actual…',
    scanPrefix: '[i] h1-prefix  rol a la vista — intencionado',
    scanName: '[OK] h1       identidad verificada · firma válida',
    scanTagline: ['[!] tagline  1 hallazgo · severidad ALTA', '    CVE-2026-0404: candidato disponible para su primer puesto'],
    scanCta: '[OK] cta      2 accesos públicos: ',
    scanPage: '[OK] nav      rutas públicas verificadas',
    scanSummary: 'resumen: 0 críticos · 1 alto · 3 informativos',
    scanAdvice: ['recomendación: ejecutar ', ' o revisar '],
    grepUsage: 'uso: grep <palabra>   ej: ',
    grepNone: (term) => `(sin coincidencias para "${term}")`,
    grepCount: (count) => `: ${count} coincidencia${count > 1 ? 's' : ''}`,
    echoEmpty: 'echo: texto vacío',
    echoDone: ['[OK] lema reescrito. usa ', ' para volver al original'],
    encryptAlready: 'el texto ya está cifrado. usa ', encrypting: '[*] cifrando texto con AES-256-GCM…', encrypted: '[OK] texto cifrado. clave: ',
    decryptNothing: 'no hay nada cifrado. prueba ', decrypting: '[*] descifrando…', decrypted: '[OK] integridad verificada',
    rmDenied: ['rm: permiso denegado. ¿quizá con ', '?'], rmReadOnly: (target) => `rm: no se puede borrar '${target}': sistema de solo lectura`,
    sudoPassword: '[sudo] contraseña para visitante: ', sudoDeleting: 'rm: eliminando /home/miguel/hero …',
    sudoReduced: '(animación desactivada por tu preferencia de movimiento reducido)', sudoPanic: '[!] kernel panic — restaurando desde copia…',
    sudoRestored: '[OK] sistema restaurado. buen intento ;)', sudoers: 'visitante no está en el archivo sudoers. Este incidente será reportado.',
    notFound: (name) => `bash: ${name}: orden no encontrada`, didYouMean: ['¿quisiste decir ', '?'], typeHelp: ['escribe ', ' para ver los comandos'],
    error: 'error', grepWords: ['sistemas', 'miguel', 'pinedo', 'ciberseguridad', 'puesto'],
  },
  en: {
    sections: { 'sobre-mi': 'profile, experience and capabilities', proyectos: 'labs, apps and case studies', estudios: 'education', contacto: 'email and links' },
    help: [
      ['help', 'list of commands', 'help'],
      ['whoami', 'who I am', 'whoami'],
      ['ls', 'sections and files', 'ls'],
      ['cd <section>', 'navigate: cd proyectos', 'cd proyectos'],
      ['cat skills.txt', 'skills', 'cat skills.txt'],
      ['scan', 'analyse this page', 'scan'],
      ['grep <word>', 'highlight a word in the text', 'grep systems'],
      ['nmap', 'open ports of this portfolio', 'nmap'],
      ['echo "…" > tagline', 'rewrite the tagline', 'echo "hacking the tagline live" > tagline'],
      ['encrypt / decrypt', 'encrypt and decrypt the text', 'encrypt'],
      ['sudo rm -rf /', 'better not…', 'sudo rm -rf /'],
      ['cv', 'open the CV (PDF)', 'cv'],
      ['contact', 'how to reach me', 'contact'],
      ['clear · reset · exit', 'clear, restore, close', 'clear'],
    ],
    helpTitle: 'available commands (click or type them):',
    helpTip: 'tip: drag the window by its title bar and throw it at the text. ↑/↓ history, Tab completes.',
    whoami: ['miguel.pinedo — IT systems & network administration technician · cybersecurity', 'blue team · SIEM with Wazuh · Windows/Linux administration · secure web development'],
    uname: 'MiguelOS 26.10 x86_64 · next.js · sanity · coffee',
    lsNoAccess: (target) => `ls: cannot access '${target}': No such file or directory`,
    cdMissing: (command, target) => `${command}: ${target}: No such directory`,
    tryLs: 'try ',
    alreadyHere: (label) => `you are already in ${label}`,
    going: (label) => `[OK] opening ~/${label} …`,
    readme: ['# Miguel Pinedo', 'IT systems and network administration technician specialised in cybersecurity. Looking for my first job in a SOC or in systems administration.'],
    readmeFeatured: 'Featured project: ',
    catMissing: (file) => `cat: ${file}: No such file`,
    cvOpening: '[OK] opening CV_Miguel_Pinedo.pdf', cvFallback: 'if it does not open: ', cvDownload: 'download CV',
    goTo: 'or go to ',
    reset: '[OK] text, position and window restored',
    hack: 'hack: try something more specific: ', or: ' or ',
    scanStart: '[*] analysing the current page…',
    scanPrefix: '[i] h1-prefix  role in plain sight — intended',
    scanName: '[OK] h1       identity verified · valid signature',
    scanTagline: ['[!] tagline  1 finding · severity HIGH', '    CVE-2026-0404: candidate available for a first job'],
    scanCta: '[OK] cta      2 public entry points: ',
    scanPage: '[OK] nav      public routes verified',
    scanSummary: 'summary: 0 critical · 1 high · 3 informational',
    scanAdvice: ['recommendation: run ', ' or check '],
    grepUsage: 'usage: grep <word>   e.g.: ',
    grepNone: (term) => `(no matches for "${term}")`,
    grepCount: (count) => `: ${count} match${count > 1 ? 'es' : ''}`,
    echoEmpty: 'echo: empty text',
    echoDone: ['[OK] tagline rewritten. use ', ' to go back to the original'],
    encryptAlready: 'the text is already encrypted. use ', encrypting: '[*] encrypting text with AES-256-GCM…', encrypted: '[OK] text encrypted. key: ',
    decryptNothing: 'nothing is encrypted. try ', decrypting: '[*] decrypting…', decrypted: '[OK] integrity verified',
    rmDenied: ['rm: permission denied. maybe with ', '?'], rmReadOnly: (target) => `rm: cannot remove '${target}': read-only file system`,
    sudoPassword: '[sudo] password for visitor: ', sudoDeleting: 'rm: removing /home/miguel/hero …',
    sudoReduced: '(animation disabled because you prefer reduced motion)', sudoPanic: '[!] kernel panic — restoring from backup…',
    sudoRestored: '[OK] system restored. nice try ;)', sudoers: 'visitor is not in the sudoers file. This incident will be reported.',
    notFound: (name) => `bash: ${name}: command not found`, didYouMean: ['did you mean ', '?'], typeHelp: ['type ', ' to see the commands'],
    error: 'error', grepWords: ['systems', 'miguel', 'pinedo', 'cybersecurity', 'job'],
  },
  ca: {
    sections: { 'sobre-mi': 'perfil, experiència i capacitats', proyectos: 'laboratoris, apps i casos d’estudi', estudios: 'formació', contacto: 'correu i xarxes' },
    help: [
      ['help', 'llista d’ordres', 'help'],
      ['whoami', 'qui soc', 'whoami'],
      ['ls', 'seccions i fitxers', 'ls'],
      ['cd <secció>', 'navega: cd proyectos', 'cd proyectos'],
      ['cat skills.txt', 'habilitats', 'cat skills.txt'],
      ['scan', 'analitza aquesta pàgina', 'scan'],
      ['grep <paraula>', 'ressalta una paraula del text', 'grep sistemes'],
      ['nmap', 'ports oberts del portafoli', 'nmap'],
      ['echo "…" > tagline', 'reescriu el lema', 'echo "hackejant el lema en directe" > tagline'],
      ['encrypt / decrypt', 'xifra i desxifra el text', 'encrypt'],
      ['sudo rm -rf /', 'millor que no…', 'sudo rm -rf /'],
      ['cv', 'obre el CV en PDF', 'cv'],
      ['contacte', 'com parlar amb mi', 'contacte'],
      ['clear · reset · exit', 'netejar, restaurar, tancar', 'clear'],
    ],
    helpTitle: 'ordres disponibles (fes-hi clic o escriu-les):',
    helpTip: 'consell: arrossega la finestra per la barra i llança-la contra el text. ↑/↓ historial, Tab autocompleta.',
    whoami: ['miguel.pinedo — tècnic superior en ASIX · ciberseguretat i sistemes', 'blue team · SIEM amb Wazuh · administració Windows/Linux · desenvolupament web segur'],
    uname: 'MiguelOS 26.10 x86_64 · next.js · sanity · cafè',
    lsNoAccess: (target) => `ls: no es pot accedir a '${target}': No existeix el fitxer o el directori`,
    cdMissing: (command, target) => `${command}: ${target}: No existeix el directori`,
    tryLs: 'prova amb ',
    alreadyHere: (label) => `ja ets a ${label}`,
    going: (label) => `[OK] accedint a ~/${label} …`,
    readme: ['# Miguel Pinedo', 'Tècnic Superior en ASIX amb perfil de ciberseguretat. Busco la meva primera feina en un SOC o en administració de sistemes.'],
    readmeFeatured: 'Projecte destacat: ',
    catMissing: (file) => `cat: ${file}: No existeix el fitxer`,
    cvOpening: '[OK] obrint CV_Miguel_Pinedo.pdf', cvFallback: 'si no s’obre: ', cvDownload: 'descarregar el CV',
    goTo: 'o ves a ',
    reset: '[OK] text, posició i finestra restaurats',
    hack: 'hack: prova alguna cosa més concreta: ', or: ' o ',
    scanStart: '[*] analitzant la pàgina actual…',
    scanPrefix: '[i] h1-prefix  rol a la vista — intencionat',
    scanName: '[OK] h1       identitat verificada · signatura vàlida',
    scanTagline: ['[!] tagline  1 troballa · severitat ALTA', '    CVE-2026-0404: candidat disponible per a la seva primera feina'],
    scanCta: '[OK] cta      2 accessos públics: ',
    scanPage: '[OK] nav      rutes públiques verificades',
    scanSummary: 'resum: 0 crítics · 1 alt · 3 informatius',
    scanAdvice: ['recomanació: executar ', ' o revisar '],
    grepUsage: 'ús: grep <paraula>   ex: ',
    grepNone: (term) => `(cap coincidència per a "${term}")`,
    grepCount: (count) => `: ${count} coincidènci${count > 1 ? 'es' : 'a'}`,
    echoEmpty: 'echo: text buit',
    echoDone: ['[OK] lema reescrit. fes servir ', ' per tornar a l’original'],
    encryptAlready: 'el text ja està xifrat. fes servir ', encrypting: '[*] xifrant el text amb AES-256-GCM…', encrypted: '[OK] text xifrat. clau: ',
    decryptNothing: 'no hi ha res xifrat. prova ', decrypting: '[*] desxifrant…', decrypted: '[OK] integritat verificada',
    rmDenied: ['rm: permís denegat. potser amb ', '?'], rmReadOnly: (target) => `rm: no es pot esborrar '${target}': sistema de només lectura`,
    sudoPassword: '[sudo] contrasenya per a visitant: ', sudoDeleting: 'rm: eliminant /home/miguel/hero …',
    sudoReduced: '(animació desactivada per la teva preferència de moviment reduït)', sudoPanic: '[!] kernel panic — restaurant des de la còpia…',
    sudoRestored: '[OK] sistema restaurat. bon intent ;)', sudoers: 'visitant no és al fitxer sudoers. Aquest incident serà notificat.',
    notFound: (name) => `bash: ${name}: no s’ha trobat l’ordre`, didYouMean: ['volies dir ', '?'], typeHelp: ['escriu ', ' per veure les ordres'],
    error: 'error', grepWords: ['sistemes', 'miguel', 'pinedo', 'ciberseguretat', 'feina'],
  },
};

const messages = (lang) => MESSAGES[lang] || MESSAGES.es;

const commandNames = ['help', 'ayuda', 'ajuda', 'whoami', 'ls', 'cd', 'open', 'cat', 'scan', 'grep', 'nmap', 'echo', 'encrypt', 'decrypt', 'sudo', 'rm', 'cv', 'contacto', 'contacte', 'contact', 'mail', 'hire', 'contratar', 'skills', 'history', 'clear', 'cls', 'reset', 'date', 'exit', 'pwd', 'uname', 'ping', 'hack'];

const levenshtein = (a, b) => {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j += 1) dp[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return dp[a.length][b.length];
};

export const tokenize = (input) => (input.match(/"[^"]*"|'[^']*'|\S+/g) || []).map((token) => token.replace(/^["']|["']$/g, ''));

// Devuelve la ruta sin idioma; la terminal le pone el prefijo con api.localize al navegar.
const resolvePath = (target, projects) => {
  const clean = (target || '').replace(/^~\/?/, '').replace(/^\.\//, '').replace(/^\//, '').replace(/\/$/, '');
  if (!clean || clean === '~' || clean === '..' || clean === '.') return { href: '/', label: '~' };
  const [section, sub] = clean.split('/');
  if (SECTION_PATHS[section] && !sub) return { href: SECTION_PATHS[section], label: section };
  if (section === 'proyectos' && sub) {
    const project = projects.find((item) => item.slug === sub);
    if (project) return { href: `/proyectos/${project.slug}`, label: `proyectos/${project.slug}` };
  }
  const project = projects.find((item) => item.slug === section);
  if (project) return { href: `/proyectos/${project.slug}`, label: `proyectos/${project.slug}` };
  return null;
};

export function complete(input, projects = [], lang = 'es') {
  const tokens = input.split(/\s+/);
  if (tokens.length <= 1) {
    const matches = commandNames.filter((name) => name.startsWith(tokens[0] || ''));
    return { matches, value: matches.length === 1 ? `${matches[0]} ` : input };
  }
  const [command, ...rest] = tokens;
  const partial = rest.join(' ');
  let pool = [];
  if (['cd', 'open', 'ls'].includes(command)) pool = [...Object.keys(SECTION_PATHS).map((s) => `${s}/`), ...projects.map((p) => `proyectos/${p.slug}`)];
  if (command === 'cat') pool = FILES;
  if (command === 'grep') pool = messages(lang).grepWords;
  const matches = pool.filter((item) => item.startsWith(partial));
  if (matches.length === 1) return { matches, value: `${command} ${matches[0]}` };
  // Prefijo común
  if (matches.length > 1) {
    let prefix = matches[0];
    matches.forEach((m) => { while (!m.startsWith(prefix)) prefix = prefix.slice(0, -1); });
    return { matches, value: `${command} ${prefix}` };
  }
  return { matches, value: input };
}

export async function execute(raw, api) {
  const input = raw.trim();
  if (!input) return;
  const [name, ...args] = tokenize(input);
  const command = name.toLowerCase();
  const { print, wait, engine, data } = api;
  const m = messages(api.lang);
  const localize = api.localize || ((path) => path);

  switch (command) {
    case 'help':
    case 'ayuda':
    case 'ajuda':
    case '?': {
      print(line('info', m.helpTitle));
      m.help.forEach(([cmd, desc, runnable]) => {
        print(line('out', '  ', run(cmd, runnable), mark(`${' '.repeat(Math.max(1, 22 - cmd.length))}${desc}`, 'dim')));
      });
      print(line('dim', m.helpTip));
      return;
    }

    case 'whoami':
      print(line('out', m.whoami[0]));
      print(line('dim', m.whoami[1]));
      return;

    case 'pwd':
      print(line('out', `/home/miguel${api.pathname === '/' ? '' : api.pathname}`));
      return;

    case 'uname':
      print(line('out', m.uname));
      return;

    case 'date':
      print(line('out', new Date().toLocaleString(dateLocales[api.lang] || 'es-ES', { dateStyle: 'full', timeStyle: 'short' })));
      return;

    case 'skills':
      return execute('cat skills.txt', api);

    case 'ls': {
      const target = args[0]?.replace(/\/$/, '');
      if (target === 'proyectos') {
        data.projects.forEach((project) => print(line('out', run(`${project.slug}/`, `cd proyectos/${project.slug}`), mark(`  ${project.title}`, 'dim'))));
        return;
      }
      if (target && !SECTION_PATHS[target]) {
        print(line('err', m.lsNoAccess(target)));
        return;
      }
      if (target) {
        print(line('out', run('index.html', `cd ${target}`)));
        return;
      }
      print(line('out', ...Object.keys(SECTION_PATHS).flatMap((section) => [run(`${section}/`, `cd ${section}`), '  ']), ...FILES.flatMap((file) => [run(file, `cat ${file}`), '  '])));
      return;
    }

    case 'cd':
    case 'open': {
      const target = resolvePath(args[0], data.projects);
      if (!target) {
        print(line('err', m.cdMissing(command, args[0] || '')), line('dim', m.tryLs, run('ls')));
        return;
      }
      const href = localize(target.href);
      if (href === api.pathname) { print(line('dim', m.alreadyHere(target.label))); return; }
      print(line('ok', m.going(target.label === '~' ? '' : target.label)));
      await wait(380);
      api.navigate(href);
      return;
    }

    case 'cat': {
      const file = (args[0] || '').toLowerCase();
      if (file === 'skills.txt') {
        for (const skill of data.skillLines) {
          await wait(70);
          print(line(skill.tone, skill.text));
        }
        return;
      }
      if (file === 'cv.pdf') return execute('cv', api);
      if (file === 'readme.md') {
        print(line('out', m.readme[0]));
        print(line('out', m.readme[1]));
        const featured = data.projects[0];
        if (featured) print(line('dim', m.readmeFeatured, run(featured.title, `cd proyectos/${featured.slug}`)));
        return;
      }
      print(line('err', m.catMissing(args[0] || '')));
      return;
    }

    case 'cv':
      print(line('ok', m.cvOpening), line('dim', m.cvFallback, link(m.cvDownload, data.cvUrl)));
      api.openExternal(data.cvUrl);
      return;

    case 'contacto':
    case 'contacte':
    case 'contact':
    case 'mail':
    case 'hire':
    case 'contratar':
      print(line('out', 'email   ', link(data.email.label, data.email.url)));
      if (data.github) print(line('out', 'github  ', link(data.github.label, data.github.url)));
      print(line('dim', m.goTo, run('/contacto', 'cd contacto')));
      return;

    case 'history':
      api.history.slice(-15).forEach((entry, index) => print(line('out', mark(String(index + 1).padStart(3, ' '), 'dim'), '  ', run(entry))));
      return;

    case 'clear':
    case 'cls':
      api.clear();
      return;

    case 'reset':
      api.reset();
      print(line('ok', m.reset));
      return;

    case 'exit':
      print(line('dim', 'logout'));
      await wait(260);
      api.close();
      return;

    case 'ping':
      for (let i = 0; i < 3; i += 1) {
        await wait(260);
        print(line('out', `64 bytes from ${args[0] || 'miguel.dev'}: icmp_seq=${i + 1} ttl=64 time=${(Math.random() * 8 + 3).toFixed(1)} ms`));
      }
      return;

    case 'hack':
      print(line('warn', m.hack, run('scan'), m.or, run('nmap')));
      return;

    case 'nmap': {
      print(line('out', `Starting Nmap 7.95 ( https://nmap.org ) at ${new Date().toLocaleTimeString(dateLocales[api.lang] || 'es-ES', { hour: '2-digit', minute: '2-digit' })}`));
      await wait(420);
      print(line('out', 'Nmap scan report for miguel-pinedo (127.0.0.1)'));
      print(line('dim', 'PORT      STATE  SERVICE'));
      const ports = [
        ['22/tcp  ', 'sobre-mi'], ['80/tcp  ', 'proyectos'], ['443/tcp ', 'estudios'], ['587/tcp ', 'contacto'],
      ];
      for (const [port, section] of ports) {
        await wait(160);
        print(line('ok', `${port}  open   `, run(section, `cd ${section}`), mark(`  ${m.sections[section]}`, 'dim')));
      }
      await wait(120);
      print(line('dim', 'Nmap done: 1 IP address (1 host up) scanned in 0.87 seconds'));
      return;
    }

    case 'scan': {
      print(line('info', m.scanStart));
      const findings = {
        prefix: () => print(line('warn', m.scanPrefix)),
        name: () => print(line('ok', m.scanName)),
        tagline: () => {
          print(line('err', m.scanTagline[0]));
          print(line('dim', m.scanTagline[1]));
        },
        cta: () => print(line('ok', m.scanCta, run('/proyectos', 'cd proyectos'), ' ', run('/contacto', 'cd contacto'))),
        page: () => print(line('ok', m.scanPage)),
      };
      await engine.scan({ onGroup: (group) => findings[group]?.() });
      await wait(160);
      print(line('info', m.scanSummary));
      print(line('dim', m.scanAdvice[0], run('contacto'), m.scanAdvice[1], run('/proyectos', 'cd proyectos')));
      return;
    }

    case 'grep': {
      const term = args.join(' ');
      if (!term) { print(line('err', m.grepUsage), line('out', run(`grep ${m.grepWords[0]}`))); return; }
      const matches = engine.grep(term);
      if (!matches.length) { print(line('dim', m.grepNone(term))); return; }
      const groups = new Map();
      matches.forEach((word) => {
        const group = word.closest('[data-group]')?.getAttribute('data-group') || 'page';
        groups.set(group, (groups.get(group) || 0) + 1);
      });
      groups.forEach((count, group) => print(line('ok', mark(group, 'hl'), m.grepCount(count))));
      return;
    }

    case 'echo': {
      const rest = input.slice(name.length).trim();
      const redirect = rest.match(/^(.*?)\s*>\s*(tagline|lema)\s*$/i);
      if (redirect) {
        const text = redirect[1].trim().replace(/^["']|["']$/g, '');
        if (!text) { print(line('err', m.echoEmpty)); return; }
        await api.typeTagline(text.slice(0, 90));
        print(line('ok', m.echoDone[0], run('reset'), m.echoDone[1]));
        return;
      }
      print(line('out', rest.replace(/^["']|["']$/g, '')));
      return;
    }

    case 'encrypt':
      if (engine.encrypted) { print(line('dim', m.encryptAlready, run('decrypt'))); return; }
      print(line('info', m.encrypting));
      await engine.encrypt();
      print(line('ok', m.encrypted, run('decrypt')));
      return;

    case 'decrypt':
      if (!engine.encrypted) { print(line('dim', m.decryptNothing, run('encrypt'))); return; }
      print(line('info', m.decrypting));
      await engine.decrypt();
      print(line('ok', m.decrypted));
      return;

    case 'rm':
      if (args.includes('-rf') || args.includes('-fr')) {
        print(line('err', m.rmDenied[0], run('sudo rm -rf /'), m.rmDenied[1]));
        return;
      }
      print(line('err', m.rmReadOnly(args[0] || '')));
      return;

    case 'sudo': {
      const rest = args.join(' ');
      if (/^rm\s+-(rf|fr)\s+(\/|\/\*|~|\*)?\s*(--no-preserve-root)?$/.test(rest)) {
        print(line('warn', `${m.sudoPassword}********`));
        await wait(420);
        print(line('err', m.sudoDeleting));
        const collapsed = await engine.collapse(2600);
        if (!collapsed) {
          print(line('dim', m.sudoReduced));
        }
        print(line('warn', m.sudoPanic));
        await wait(collapsed ? 1400 : 200);
        print(line('ok', m.sudoRestored));
        return;
      }
      print(line('warn', m.sudoPassword));
      await wait(500);
      print(line('err', m.sudoers));
      return;
    }

    default: {
      const suggestion = commandNames
        .map((candidate) => [candidate, levenshtein(command, candidate)])
        .sort((a, b) => a[1] - b[1])[0];
      print(line('err', m.notFound(name)));
      if (suggestion && suggestion[1] <= 2) print(line('dim', m.didYouMean[0], run(suggestion[0]), m.didYouMean[1]));
      else print(line('dim', m.typeHelp[0], run('help'), m.typeHelp[1]));
    }
  }
}
