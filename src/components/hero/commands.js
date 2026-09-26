/*
 * Comandos de la terminal del hero.
 * Cada comando recibe (args, raw, api) y puede ser asíncrono. La terminal
 * bloquea la entrada mientras se ejecuta y Ctrl+C lo cancela (api.wait lanza).
 */

export const line = (tone, ...parts) => ({ tone, parts });
export const run = (text, command = text) => ({ text, run: command });
export const link = (text, href) => ({ text, href });
export const mark = (text, tone = 'hl') => ({ text, tone });

const SECTIONS = {
  'sobre-mi': { href: '/sobre-mi', label: 'perfil, habilidades y capacidades' },
  proyectos: { href: '/proyectos', label: 'laboratorios, webs y casos de estudio' },
  estudios: { href: '/estudios', label: 'formación y certificaciones' },
  contacto: { href: '/contacto', label: 'email y redes' },
};

const FILES = ['skills.txt', 'cv.pdf', 'readme.md'];

export const COMMANDS = [
  ['help', 'lista de comandos', 'help'],
  ['whoami', 'quién soy', 'whoami'],
  ['ls', 'secciones y archivos', 'ls'],
  ['cd <sección>', 'navega: cd proyectos', 'cd proyectos'],
  ['cat skills.txt', 'habilidades', 'cat skills.txt'],
  ['scan', 'busca vulnerabilidades en esta página', 'scan'],
  ['grep <palabra>', 'resalta una palabra del texto', 'grep vulnerabilidades'],
  ['nmap', 'puertos abiertos del portafolio', 'nmap'],
  ['echo "…" > tagline', 'reescribe el lema', 'echo "hackeando el lema en directo" > tagline'],
  ['encrypt / decrypt', 'cifra y descifra el texto', 'encrypt'],
  ['sudo rm -rf /', 'mejor no…', 'sudo rm -rf /'],
  ['cv', 'abre el CV en PDF', 'cv'],
  ['contacto', 'cómo hablar conmigo', 'contacto'],
  ['clear · reset · exit', 'limpiar, restaurar, cerrar', 'clear'],
];

const commandNames = ['help', 'ayuda', 'whoami', 'ls', 'cd', 'open', 'cat', 'scan', 'grep', 'nmap', 'echo', 'encrypt', 'decrypt', 'sudo', 'rm', 'cv', 'contacto', 'contact', 'mail', 'hire', 'contratar', 'skills', 'history', 'clear', 'cls', 'reset', 'date', 'exit', 'pwd', 'uname', 'ping', 'hack'];

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

const resolvePath = (target, projects) => {
  const clean = (target || '').replace(/^~\/?/, '').replace(/^\.\//, '').replace(/^\//, '').replace(/\/$/, '');
  if (!clean || clean === '~' || clean === '..' || clean === '.') return { href: '/', label: '~' };
  const [section, sub] = clean.split('/');
  if (SECTIONS[section] && !sub) return { href: SECTIONS[section].href, label: section };
  if (section === 'proyectos' && sub) {
    const project = projects.find((item) => item.slug === sub);
    if (project) return { href: `/proyectos/${project.slug}`, label: `proyectos/${project.slug}` };
  }
  const project = projects.find((item) => item.slug === section);
  if (project) return { href: `/proyectos/${project.slug}`, label: `proyectos/${project.slug}` };
  return null;
};

export function complete(input, projects = []) {
  const tokens = input.split(/\s+/);
  if (tokens.length <= 1) {
    const matches = commandNames.filter((name) => name.startsWith(tokens[0] || ''));
    return { matches, value: matches.length === 1 ? `${matches[0]} ` : input };
  }
  const [command, ...rest] = tokens;
  const partial = rest.join(' ');
  let pool = [];
  if (['cd', 'open', 'ls'].includes(command)) pool = [...Object.keys(SECTIONS).map((s) => `${s}/`), ...projects.map((p) => `proyectos/${p.slug}`)];
  if (command === 'cat') pool = FILES;
  if (command === 'grep') pool = ['vulnerabilidades', 'miguel', 'pinedo', 'security', 'otros'];
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

  switch (command) {
    case 'help':
    case 'ayuda':
    case '?': {
      print(line('info', 'comandos disponibles (haz clic o escríbelos):'));
      COMMANDS.forEach(([cmd, desc, runnable]) => {
        print(line('out', '  ', run(cmd, runnable), mark(`${' '.repeat(Math.max(1, 22 - cmd.length))}${desc}`, 'dim')));
      });
      print(line('dim', 'tip: arrastra la ventana por la barra y lánzala contra el texto. ↑/↓ historial, Tab autocompleta.'));
      return;
    }

    case 'whoami':
      print(line('out', 'miguel.pinedo — security researcher & developer'));
      print(line('dim', 'blue team · pentesting web · hardening linux · desarrollo web'));
      return;

    case 'pwd':
      print(line('out', `/home/miguel${api.pathname === '/' ? '' : api.pathname}`));
      return;

    case 'uname':
      print(line('out', 'MiguelOS 26.09 x86_64 · next.js · sanity · café'));
      return;

    case 'date':
      print(line('out', new Date().toLocaleString('es-ES', { dateStyle: 'full', timeStyle: 'short' })));
      return;

    case 'skills':
      return execute('cat skills.txt', api);

    case 'ls': {
      const target = args[0]?.replace(/\/$/, '');
      if (target === 'proyectos') {
        data.projects.forEach((project) => print(line('out', run(`${project.slug}/`, `cd proyectos/${project.slug}`), mark(`  ${project.title}`, 'dim'))));
        return;
      }
      if (target && !SECTIONS[target]) {
        print(line('err', `ls: no se puede acceder a '${target}': No existe el archivo o el directorio`));
        return;
      }
      if (target) {
        print(line('out', run('index.html', `cd ${target}`)));
        return;
      }
      print(line('out', ...Object.keys(SECTIONS).flatMap((section) => [run(`${section}/`, `cd ${section}`), '  ']), ...FILES.flatMap((file) => [run(file, `cat ${file}`), '  '])));
      return;
    }

    case 'cd':
    case 'open': {
      const target = resolvePath(args[0], data.projects);
      if (!target) {
        print(line('err', `${command}: ${args[0] || ''}: No existe el directorio`), line('dim', 'prueba con ', run('ls')));
        return;
      }
      if (target.href === api.pathname) { print(line('dim', `ya estás en ${target.label}`)); return; }
      print(line('ok', `[OK] accediendo a ~/${target.label === '~' ? '' : target.label} …`));
      await wait(380);
      api.navigate(target.href);
      return;
    }

    case 'cat': {
      const file = (args[0] || '').toLowerCase();
      if (file === 'skills.txt') {
        const skills = data.skillLines.length ? data.skillLines : [{ tone: 'ok', text: '[OK] Web Pentesting - activo' }];
        for (const skill of skills) {
          await wait(70);
          print(line(skill.tone, skill.text));
        }
        return;
      }
      if (file === 'cv.pdf') return execute('cv', api);
      if (file === 'readme.md') {
        print(line('out', '# Miguel Pinedo'));
        print(line('out', 'Ciberseguridad defensiva y ofensiva, administración de sistemas y desarrollo web.'));
        print(line('dim', 'Proyecto destacado: ', run('Laboratorio SOC con Wazuh', 'cd proyectos/laboratorio-soc-wazuh')));
        return;
      }
      print(line('err', `cat: ${args[0] || ''}: No existe el archivo`));
      return;
    }

    case 'cv':
      print(line('ok', '[OK] abriendo CV_Miguel_Pinedo.pdf'), line('dim', 'si no se abre: ', link('descargar CV', data.cvUrl)));
      api.openExternal(data.cvUrl);
      return;

    case 'contacto':
    case 'contact':
    case 'mail':
    case 'hire':
    case 'contratar':
      print(line('out', 'email   ', link(data.email.label, data.email.url)));
      if (data.github) print(line('out', 'github  ', link(data.github.label, data.github.url)));
      print(line('dim', 'o ve a ', run('/contacto', 'cd contacto')));
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
      print(line('ok', '[OK] texto, posición y ventana restaurados'));
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
      print(line('warn', 'hack: prueba algo más concreto: ', run('scan'), ' o ', run('nmap')));
      return;

    case 'nmap': {
      print(line('out', `Starting Nmap 7.95 ( https://nmap.org ) at ${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`));
      await wait(420);
      print(line('out', 'Nmap scan report for miguel-pinedo (127.0.0.1)'));
      print(line('dim', 'PORT      STATE  SERVICE'));
      const ports = [
        ['22/tcp  ', 'sobre-mi'], ['80/tcp  ', 'proyectos'], ['443/tcp ', 'estudios'], ['587/tcp ', 'contacto'],
      ];
      for (const [port, section] of ports) {
        await wait(160);
        print(line('ok', `${port}  open   `, run(section, `cd ${section}`), mark(`  ${SECTIONS[section].label}`, 'dim')));
      }
      await wait(120);
      print(line('dim', 'Nmap done: 1 IP address (1 host up) scanned in 0.87 seconds'));
      return;
    }

    case 'scan': {
      print(line('info', '[*] iniciando scan de la página actual…'));
      const findings = {
        prefix: () => print(line('warn', '[i] h1-prefix  rol expuesto públicamente — intencionado')),
        name: () => print(line('ok', '[OK] h1       identidad verificada · firma válida')),
        tagline: () => {
          print(line('err', '[!] tagline  1 hallazgo · severidad ALTA'));
          print(line('dim', '    CVE-2026-0404: candidato disponible y sin parchear'));
        },
        cta: () => print(line('ok', '[OK] cta      2 endpoints expuestos: ', run('/proyectos', 'cd proyectos'), ' ', run('/contacto', 'cd contacto'))),
        page: () => print(line('ok', '[OK] nav      rutas públicas verificadas')),
      };
      await engine.scan({ onGroup: (group) => findings[group]?.() });
      await wait(160);
      print(line('info', 'resumen: 0 críticos · 1 alto · 3 informativos'));
      print(line('dim', 'recomendación: ejecutar ', run('contacto'), ' o revisar ', run('/proyectos', 'cd proyectos')));
      return;
    }

    case 'grep': {
      const term = args.join(' ');
      if (!term) { print(line('err', 'uso: grep <palabra>   ej: '), line('out', run('grep vulnerabilidades'))); return; }
      const matches = engine.grep(term);
      if (!matches.length) { print(line('dim', `(sin coincidencias para "${term}")`)); return; }
      const groups = new Map();
      matches.forEach((word) => {
        const group = word.closest('[data-group]')?.getAttribute('data-group') || 'page';
        groups.set(group, (groups.get(group) || 0) + 1);
      });
      groups.forEach((count, group) => print(line('ok', mark(group, 'hl'), `: ${count} coincidencia${count > 1 ? 's' : ''}`)));
      return;
    }

    case 'echo': {
      const rest = input.slice(name.length).trim();
      const redirect = rest.match(/^(.*?)\s*>\s*(tagline|lema)\s*$/i);
      if (redirect) {
        const text = redirect[1].trim().replace(/^["']|["']$/g, '');
        if (!text) { print(line('err', 'echo: texto vacío')); return; }
        await api.typeTagline(text.slice(0, 90));
        print(line('ok', '[OK] tagline reescrito. usa ', run('reset'), ' para volver al original'));
        return;
      }
      print(line('out', rest.replace(/^["']|["']$/g, '')));
      return;
    }

    case 'encrypt':
      if (engine.encrypted) { print(line('dim', 'el texto ya está cifrado. usa ', run('decrypt'))); return; }
      print(line('info', '[*] cifrando texto con AES-256-GCM…'));
      await engine.encrypt();
      print(line('ok', '[OK] texto cifrado. clave: ', run('decrypt')));
      return;

    case 'decrypt':
      if (!engine.encrypted) { print(line('dim', 'no hay nada cifrado. prueba ', run('encrypt'))); return; }
      print(line('info', '[*] descifrando…'));
      await engine.decrypt();
      print(line('ok', '[OK] integridad verificada'));
      return;

    case 'rm':
      if (args.includes('-rf') || args.includes('-fr')) {
        print(line('err', 'rm: permiso denegado. ¿quizá con ', run('sudo rm -rf /'), '?'));
        return;
      }
      print(line('err', `rm: no se puede borrar '${args[0] || ''}': sistema de solo lectura`));
      return;

    case 'sudo': {
      const rest = args.join(' ');
      if (/^rm\s+-(rf|fr)\s+(\/|\/\*|~|\*)?\s*(--no-preserve-root)?$/.test(rest)) {
        print(line('warn', '[sudo] contraseña para visitante: ********'));
        await wait(420);
        print(line('err', 'rm: eliminando /home/miguel/hero …'));
        const collapsed = await engine.collapse(2600);
        if (!collapsed) {
          print(line('dim', '(animación desactivada por tu preferencia de movimiento reducido)'));
        }
        print(line('warn', '[!] kernel panic — restaurando desde backup…'));
        await wait(collapsed ? 1400 : 200);
        print(line('ok', '[OK] sistema restaurado. buen intento ;)'));
        return;
      }
      print(line('warn', '[sudo] contraseña para visitante: '));
      await wait(500);
      print(line('err', 'visitante no está en el archivo sudoers. Este incidente será reportado.'));
      return;
    }

    default: {
      const suggestion = commandNames
        .map((candidate) => [candidate, levenshtein(command, candidate)])
        .sort((a, b) => a[1] - b[1])[0];
      print(line('err', `bash: ${name}: orden no encontrada`));
      if (suggestion && suggestion[1] <= 2) print(line('dim', '¿quisiste decir ', run(suggestion[0]), '?'));
      else print(line('dim', 'escribe ', run('help'), ' para ver los comandos'));
    }
  }
}
