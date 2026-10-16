/*
 * Comandos de la terminal del hero.
 * Cada comando recibe (args, raw, api) y puede ser asíncrono. La terminal
 * bloquea la entrada mientras se ejecuta y Ctrl+C lo cancela (api.wait y api.until lanzan).
 * Los textos están en MESSAGES por idioma (api.lang); los nombres de comandos y de secciones no se traducen.
 */

import { dateLocales, localePath, locales, splitLocale } from '@/i18n/config';
import { burst } from '@/lib/fx/burst';
import { lightsAreOff, lightsOff, lightsOn } from '@/lib/fx/lights';
import { startDefend } from './defendGame';

export const line = (tone, ...parts) => ({ tone, parts });
export const run = (text, command = text) => ({ text, run: command });
export const link = (text, href) => ({ text, href });
export const mark = (text, tone = 'hl') => ({ text, tone });

const SECTION_PATHS = { 'sobre-mi': '/sobre-mi', proyectos: '/proyectos', estudios: '/estudios', contacto: '/contacto' };

const FILES = ['skills.txt', 'cv.pdf', 'readme.md'];
const HIDDEN_FILES = ['.secret', '.bash_history'];
const CURL_PATHS = ['/.well-known/security.txt', '/robots.txt', '/sitemap.xml'];

/* ---------- mini-CTF: tres flags escondidas en la web ---------- */

// Solo se guardan los SHA-256: las flags no aparecen en el código de la web.
const FLAGS = [
  { id: 1, key: 'base64', hash: 'fb2b2a15e8203876d0c2f8e960751a3970aa9835a250daf0c22a30cf6c693c91' },
  { id: 2, key: 'console', hash: '58c3b67a9b1acbf5f52977f7f2986ad190ba345324e4d86913e4749758d3e0d8' },
  { id: 3, key: 'securitytxt', hash: '60385e2a4930878bba15878ba135786841a997c531d32b2bf0dd7c04b10265ac' },
];
const SECRET = 'RkxBR3tiYXNlNjRfaXNfbm90X2VuY3J5cHRpb259';
const CTF_KEY = 'mp-ctf';

const readFound = () => {
  try { return JSON.parse(window.localStorage.getItem(CTF_KEY) || '[]').filter((id) => FLAGS.some((flag) => flag.id === id)); } catch { return []; }
};
const saveFound = (found) => {
  try { window.localStorage.setItem(CTF_KEY, JSON.stringify(found)); } catch { /* sin almacenamiento: la partida dura lo que la pestaña */ }
};
const sha256 = async (text) => {
  const digest = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
};

const decodeBase64 = (value) => {
  const bytes = Uint8Array.from(window.atob(value.replace(/\s+/g, '')), (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};
const encodeBase64 = (value) => window.btoa(String.fromCharCode(...new TextEncoder().encode(value)));

/* ---------- textos ---------- */

const MESSAGES = {
  es: {
    sections: { 'sobre-mi': 'perfil, experiencia y capacidades', proyectos: 'laboratorios, apps y casos de estudio', estudios: 'formación', contacto: 'email y redes' },
    help: [
      ['explorar', [['whoami'], ['neofetch'], ['ls'], ['cd proyectos'], ['cv'], ['contacto'], ['lang en']]],
      ['efectos', [['matrix'], ['glitch'], ['scan'], ['grep sistemas'], ['encrypt'], ['lights off'], ['echo "…" > tagline', 'echo "hackeando el lema en directo" > tagline']]],
      ['seguridad', [['nmap'], ['logs'], ['htop'], ['ping']]],
      ['juegos', [['defend'], ['ctf'], ['sudo rm -rf /']]],
      ['otros', [['hire'], ['cowsay'], ['coffee'], ['history'], ['clear'], ['reset'], ['exit']]],
    ],
    helpTitle: 'comandos (haz clic o escríbelos):',
    helpTip: 'tip: lanza la ventana contra el texto y tira de las letras con el ratón. ↑/↓ historial · Tab completa · → acepta la sugerencia · Ctrl+C corta.',
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
    reset: '[OK] texto, posición, ventana y luces restaurados',
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
    reduced: '(efecto desactivado por tu preferencia de movimiento reducido)',
    matrixStart: '[*] entrando en la matrix… (Ctrl+C para salir)', matrixEnd: '[OK] de vuelta a la realidad',
    glitchStart: '[!] interferencia en la señal…', glitchEnd: '[OK] señal estabilizada',
    lightsOff: '[OK] luces apagadas · mueve el ratón para alumbrar · Esc para encender', lightsOn: '[OK] luces encendidas',
    lightsAlreadyOn: 'las luces ya están encendidas. prueba ', lightsHint: 'encender luz · Esc', lightsUsage: 'uso: lights on | lights off',
    hireStart: '[*] iniciando proceso de selección…',
    hireSteps: ['revisando CV', 'verificando proyectos', 'comprobando actitud', 'negociando el café'],
    hireDone: '[OK] candidato apto. incorporación: inmediata',
    hireNext: '     siguiente paso → ',
    defendIntro: ['[*] cortafuegos en modo manual: llegan paquetes maliciosos hacia el nombre.', '    haz clic en ellos para bloquearlos · 25 s · 3 vidas · Ctrl+C para salir'],
    defendGo: '¡adelante!',
    defendLabels: { integrity: 'integridad', blocked: 'bloqueados', block: 'Bloquear' },
    defendBlock: (packet) => `[BLOCK] ${packet.label} · ${packet.ip}`,
    defendBreach: (packet, left) => `[ALERTA] ${packet.label} ha llegado al objetivo · integridad ${left}%`,
    defendSummary: (stats) => `resultado: ${stats.blocked} bloqueados · ${stats.breaches} brechas`,
    defendRank: (rank) => `rango: ${rank}`,
    defendRanks: { hunter: 'Threat Hunter', n3: 'Analista SOC N3', n2: 'Analista SOC N2', n1: 'Analista SOC N1', lost: 'becario en prácticas (la próxima vez sale)' },
    defendAgain: 'otra partida: ',
    logsHeader: '==> /var/ossec/logs/alerts/alerts.log <==',
    logsEvents: [
      { lvl: 3, text: 'PAM: inicio de sesión correcto de miguel', tone: 'dim' },
      { lvl: 5, text: 'sshd: intento con usuario inexistente «admin»', ip: true, tone: 'out' },
      { lvl: 5, text: 'sshd: intento con usuario inexistente «oracle»', ip: true, tone: 'out' },
      { lvl: 10, text: 'sshd: fuerza bruta (8 fallos en 60 s)', ip: true, mitre: 'T1110', tone: 'err' },
      { ar: true, text: 'respuesta activa: firewall-drop → IP bloqueada 10 min', tone: 'ok' },
      { lvl: 12, text: 'Sysmon: PowerShell con -EncodedCommand', mitre: 'T1059.001', tone: 'err' },
      { lvl: 7, text: 'FIM: checksum cambiado en /etc/hosts', tone: 'warn' },
      { lvl: 12, text: 'regla propia 100100: cambio en carpeta crítica', mitre: 'T1565', tone: 'err' },
      { lvl: 3, text: 'syscheck: análisis de integridad terminado', tone: 'dim' },
    ],
    logsEnd: 'fin de la demo · así son las alertas que provoqué y analicé en mi laboratorio → ',
    htopProcs: ['wazuh-manager --rules custom', 'curiosidad --sin-limite', 'aprender --linux --windows --redes', 'sysmon64 -accepteula', 'stageplot-studio --backend supabase', 'cafe --dosis doble', 'sudo rm -rf / [bloqueado]'],
    htopUptime: 'activo desde 2020', htopEnd: '(htop cerrado · Ctrl+C también sale)',
    neofetch: {
      rows: [['OS', 'ASIX · perfil ciberseguridad'], ['Host', 'miguelpinedo.vercel.app'], ['Kernel', 'blue-team 8.01'], ['Uptime', 'en IT desde 2020'], ['Shell', 'bash · powershell'], ['SIEM', 'Wazuh + Sysmon'], ['Stack', 'Linux · Windows Server · Next.js'], ['Idiomas', 'español · català · english B1'], ['Estado', '● disponible para trabajar']],
    },
    cowsayDefault: 'contrata a Miguel, muuu',
    coffeeDone: '[OK] cafeína al 100 % · productividad +42 %',
    langUsage: 'uso: lang es | lang en | lang ca', langSame: (code) => `ya estás en ${code}`, langGoing: (name) => `[OK] cambiando a ${name} …`,
    secret: ['# nota mental: nada de secretos en texto plano. lo he «cifrado» por si acaso:', 'pista: eso no es cifrado… prueba con '],
    bashHistory: ['sudo apt install cafe', 'nmap -sV 127.0.0.1', 'git commit -m "arreglado (ahora sí)"', 'wazuh-logtest', 'ssh miguel@primer-trabajo', 'history -c   # ups'],
    base64Usage: 'uso: base64 <texto>  ·  base64 -d <base64>', base64Invalid: 'base64: entrada no válida',
    curlUsage: 'uso: curl <ruta>   ej: ', curlForeign: 'curl: desde aquí solo puedo consultar este dominio', curlFail: (status) => `curl: el servidor respondió ${status}`,
    curlMore: (count) => `… (${count} líneas más)`,
    ctfTitle: 'mini-CTF · hay 3 flags escondidas en esta web',
    ctfFlags: { base64: ['base64', 'algo «cifrado» en un archivo oculto (ls -a)'], console: ['consola', 'los desarrolladores tienen una consola: F12'], securitytxt: ['security.txt', 'las webs serias explican cómo reportar fallos (RFC 9116) → curl'] },
    ctfSubmit: 'envía una flag con: ', ctfDone: '¡CTF completado! Si te ha gustado, hablemos → ',
    submitUsage: 'uso: submit FLAG{…}', submitBad: '[x] flag incorrecta. sigue buscando', submitRepeat: (id) => `ya tenías la flag ${id}`,
    submitOk: (id, count) => `[OK] flag ${id} correcta (${count}/3)`, submitNoCrypto: 'submit: tu navegador no permite comprobar la flag aquí',
  },
  en: {
    sections: { 'sobre-mi': 'profile, experience and capabilities', proyectos: 'labs, apps and case studies', estudios: 'education', contacto: 'email and links' },
    help: [
      ['explore', [['whoami'], ['neofetch'], ['ls'], ['cd proyectos'], ['cv'], ['contact'], ['lang es']]],
      ['effects', [['matrix'], ['glitch'], ['scan'], ['grep systems'], ['encrypt'], ['lights off'], ['echo "…" > tagline', 'echo "hacking the tagline live" > tagline']]],
      ['security', [['nmap'], ['logs'], ['htop'], ['ping']]],
      ['games', [['defend'], ['ctf'], ['sudo rm -rf /']]],
      ['misc', [['hire'], ['cowsay'], ['coffee'], ['history'], ['clear'], ['reset'], ['exit']]],
    ],
    helpTitle: 'commands (click or type them):',
    helpTip: 'tip: throw the window at the text and pull the letters with your mouse. ↑/↓ history · Tab completes · → accepts the suggestion · Ctrl+C stops.',
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
    reset: '[OK] text, position, window and lights restored',
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
    reduced: '(effect disabled because you prefer reduced motion)',
    matrixStart: '[*] entering the matrix… (Ctrl+C to leave)', matrixEnd: '[OK] back to reality',
    glitchStart: '[!] signal interference…', glitchEnd: '[OK] signal stabilised',
    lightsOff: '[OK] lights off · move your mouse to light the way · Esc to switch them on', lightsOn: '[OK] lights on',
    lightsAlreadyOn: 'the lights are already on. try ', lightsHint: 'lights on · Esc', lightsUsage: 'usage: lights on | lights off',
    hireStart: '[*] starting the hiring process…',
    hireSteps: ['reviewing CV', 'checking projects', 'checking attitude', 'negotiating coffee'],
    hireDone: '[OK] candidate approved. start date: immediately',
    hireNext: '     next step → ',
    defendIntro: ['[*] firewall in manual mode: malicious packets are heading for the name.', '    click them to block them · 25 s · 3 lives · Ctrl+C to quit'],
    defendGo: 'go!',
    defendLabels: { integrity: 'integrity', blocked: 'blocked', block: 'Block' },
    defendBlock: (packet) => `[BLOCK] ${packet.label} · ${packet.ip}`,
    defendBreach: (packet, left) => `[ALERT] ${packet.label} reached the target · integrity ${left}%`,
    defendSummary: (stats) => `result: ${stats.blocked} blocked · ${stats.breaches} breaches`,
    defendRank: (rank) => `rank: ${rank}`,
    defendRanks: { hunter: 'Threat Hunter', n3: 'SOC Analyst L3', n2: 'SOC Analyst L2', n1: 'SOC Analyst L1', lost: 'intern (you will get it next time)' },
    defendAgain: 'play again: ',
    logsHeader: '==> /var/ossec/logs/alerts/alerts.log <==',
    logsEvents: [
      { lvl: 3, text: 'PAM: successful login for miguel', tone: 'dim' },
      { lvl: 5, text: 'sshd: attempt with non-existent user "admin"', ip: true, tone: 'out' },
      { lvl: 5, text: 'sshd: attempt with non-existent user "oracle"', ip: true, tone: 'out' },
      { lvl: 10, text: 'sshd: brute force (8 failures in 60 s)', ip: true, mitre: 'T1110', tone: 'err' },
      { ar: true, text: 'active response: firewall-drop → IP blocked for 10 min', tone: 'ok' },
      { lvl: 12, text: 'Sysmon: PowerShell with -EncodedCommand', mitre: 'T1059.001', tone: 'err' },
      { lvl: 7, text: 'FIM: checksum changed in /etc/hosts', tone: 'warn' },
      { lvl: 12, text: 'custom rule 100100: change in a critical folder', mitre: 'T1565', tone: 'err' },
      { lvl: 3, text: 'syscheck: integrity scan finished', tone: 'dim' },
    ],
    logsEnd: 'end of demo · these are the alerts I triggered and analysed in my lab → ',
    htopProcs: ['wazuh-manager --rules custom', 'curiosity --no-limit', 'learn --linux --windows --networks', 'sysmon64 -accepteula', 'stageplot-studio --backend supabase', 'coffee --double-shot', 'sudo rm -rf / [blocked]'],
    htopUptime: 'running since 2020', htopEnd: '(htop closed · Ctrl+C also quits)',
    neofetch: {
      rows: [['OS', 'ASIX · cybersecurity profile'], ['Host', 'miguelpinedo.vercel.app'], ['Kernel', 'blue-team 8.01'], ['Uptime', 'in IT since 2020'], ['Shell', 'bash · powershell'], ['SIEM', 'Wazuh + Sysmon'], ['Stack', 'Linux · Windows Server · Next.js'], ['Languages', 'español · català · english B1'], ['Status', '● open to work']],
    },
    cowsayDefault: 'hire Miguel, moo',
    coffeeDone: '[OK] caffeine at 100 % · productivity +42 %',
    langUsage: 'usage: lang es | lang en | lang ca', langSame: (code) => `you are already in ${code}`, langGoing: (name) => `[OK] switching to ${name} …`,
    secret: ['# note to self: no secrets in plain text. I "encrypted" it just in case:', 'hint: that is not encryption… try '],
    bashHistory: ['sudo apt install coffee', 'nmap -sV 127.0.0.1', 'git commit -m "fixed (for real this time)"', 'wazuh-logtest', 'ssh miguel@first-job', 'history -c   # oops'],
    base64Usage: 'usage: base64 <text>  ·  base64 -d <base64>', base64Invalid: 'base64: invalid input',
    curlUsage: 'usage: curl <path>   e.g.: ', curlForeign: 'curl: from here I can only query this domain', curlFail: (status) => `curl: the server answered ${status}`,
    curlMore: (count) => `… (${count} more lines)`,
    ctfTitle: 'mini-CTF · there are 3 flags hidden on this site',
    ctfFlags: { base64: ['base64', 'something "encrypted" in a hidden file (ls -a)'], console: ['console', 'developers have a console: F12'], securitytxt: ['security.txt', 'serious sites explain how to report bugs (RFC 9116) → curl'] },
    ctfSubmit: 'submit a flag with: ', ctfDone: 'CTF complete! If you enjoyed it, let’s talk → ',
    submitUsage: 'usage: submit FLAG{…}', submitBad: '[x] wrong flag. keep looking', submitRepeat: (id) => `you already had flag ${id}`,
    submitOk: (id, count) => `[OK] flag ${id} is correct (${count}/3)`, submitNoCrypto: 'submit: your browser cannot check the flag here',
  },
  ca: {
    sections: { 'sobre-mi': 'perfil, experiència i capacitats', proyectos: 'laboratoris, apps i casos d’estudi', estudios: 'formació', contacto: 'correu i xarxes' },
    help: [
      ['explorar', [['whoami'], ['neofetch'], ['ls'], ['cd proyectos'], ['cv'], ['contacte'], ['lang en']]],
      ['efectes', [['matrix'], ['glitch'], ['scan'], ['grep sistemes'], ['encrypt'], ['lights off'], ['echo "…" > tagline', 'echo "hackejant el lema en directe" > tagline']]],
      ['seguretat', [['nmap'], ['logs'], ['htop'], ['ping']]],
      ['jocs', [['defend'], ['ctf'], ['sudo rm -rf /']]],
      ['altres', [['hire'], ['cowsay'], ['coffee'], ['history'], ['clear'], ['reset'], ['exit']]],
    ],
    helpTitle: 'ordres (fes-hi clic o escriu-les):',
    helpTip: 'consell: llança la finestra contra el text i estira les lletres amb el ratolí. ↑/↓ historial · Tab completa · → accepta el suggeriment · Ctrl+C talla.',
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
    reset: '[OK] text, posició, finestra i llums restaurats',
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
    reduced: '(efecte desactivat per la teva preferència de moviment reduït)',
    matrixStart: '[*] entrant a la matrix… (Ctrl+C per sortir)', matrixEnd: '[OK] de tornada a la realitat',
    glitchStart: '[!] interferència en el senyal…', glitchEnd: '[OK] senyal estabilitzat',
    lightsOff: '[OK] llums apagats · mou el ratolí per il·luminar · Esc per encendre', lightsOn: '[OK] llums encesos',
    lightsAlreadyOn: 'els llums ja estan encesos. prova ', lightsHint: 'encendre el llum · Esc', lightsUsage: 'ús: lights on | lights off',
    hireStart: '[*] iniciant el procés de selecció…',
    hireSteps: ['revisant el CV', 'verificant projectes', 'comprovant l’actitud', 'negociant el cafè'],
    hireDone: '[OK] candidat apte. incorporació: immediata',
    hireNext: '     següent pas → ',
    defendIntro: ['[*] tallafoc en mode manual: arriben paquets maliciosos cap al nom.', '    fes-hi clic per bloquejar-los · 25 s · 3 vides · Ctrl+C per sortir'],
    defendGo: 'som-hi!',
    defendLabels: { integrity: 'integritat', blocked: 'bloquejats', block: 'Bloquejar' },
    defendBlock: (packet) => `[BLOCK] ${packet.label} · ${packet.ip}`,
    defendBreach: (packet, left) => `[ALERTA] ${packet.label} ha arribat a l’objectiu · integritat ${left}%`,
    defendSummary: (stats) => `resultat: ${stats.blocked} bloquejats · ${stats.breaches} bretxes`,
    defendRank: (rank) => `rang: ${rank}`,
    defendRanks: { hunter: 'Threat Hunter', n3: 'Analista SOC N3', n2: 'Analista SOC N2', n1: 'Analista SOC N1', lost: 'becari en pràctiques (la propera vegada surt)' },
    defendAgain: 'una altra partida: ',
    logsHeader: '==> /var/ossec/logs/alerts/alerts.log <==',
    logsEvents: [
      { lvl: 3, text: 'PAM: inici de sessió correcte de miguel', tone: 'dim' },
      { lvl: 5, text: 'sshd: intent amb usuari inexistent «admin»', ip: true, tone: 'out' },
      { lvl: 5, text: 'sshd: intent amb usuari inexistent «oracle»', ip: true, tone: 'out' },
      { lvl: 10, text: 'sshd: força bruta (8 errors en 60 s)', ip: true, mitre: 'T1110', tone: 'err' },
      { ar: true, text: 'resposta activa: firewall-drop → IP bloquejada 10 min', tone: 'ok' },
      { lvl: 12, text: 'Sysmon: PowerShell amb -EncodedCommand', mitre: 'T1059.001', tone: 'err' },
      { lvl: 7, text: 'FIM: checksum canviat a /etc/hosts', tone: 'warn' },
      { lvl: 12, text: 'regla pròpia 100100: canvi en una carpeta crítica', mitre: 'T1565', tone: 'err' },
      { lvl: 3, text: 'syscheck: anàlisi d’integritat acabada', tone: 'dim' },
    ],
    logsEnd: 'fi de la demo · així són les alertes que vaig provocar i analitzar al meu laboratori → ',
    htopProcs: ['wazuh-manager --rules custom', 'curiositat --sense-limit', 'aprendre --linux --windows --xarxes', 'sysmon64 -accepteula', 'stageplot-studio --backend supabase', 'cafe --dosi-doble', 'sudo rm -rf / [bloquejat]'],
    htopUptime: 'actiu des del 2020', htopEnd: '(htop tancat · Ctrl+C també surt)',
    neofetch: {
      rows: [['OS', 'ASIX · perfil ciberseguretat'], ['Host', 'miguelpinedo.vercel.app'], ['Kernel', 'blue-team 8.01'], ['Uptime', 'a la informàtica des del 2020'], ['Shell', 'bash · powershell'], ['SIEM', 'Wazuh + Sysmon'], ['Stack', 'Linux · Windows Server · Next.js'], ['Idiomes', 'español · català · english B1'], ['Estat', '● disponible per treballar']],
    },
    cowsayDefault: 'contracta en Miguel, muuu',
    coffeeDone: '[OK] cafeïna al 100 % · productivitat +42 %',
    langUsage: 'ús: lang es | lang en | lang ca', langSame: (code) => `ja ets a ${code}`, langGoing: (name) => `[OK] canviant a ${name} …`,
    secret: ['# nota mental: res de secrets en text pla. ho he «xifrat» per si de cas:', 'pista: això no és xifrat… prova amb '],
    bashHistory: ['sudo apt install cafe', 'nmap -sV 127.0.0.1', 'git commit -m "arreglat (ara sí)"', 'wazuh-logtest', 'ssh miguel@primera-feina', 'history -c   # ups'],
    base64Usage: 'ús: base64 <text>  ·  base64 -d <base64>', base64Invalid: 'base64: entrada no vàlida',
    curlUsage: 'ús: curl <ruta>   ex: ', curlForeign: 'curl: des d’aquí només puc consultar aquest domini', curlFail: (status) => `curl: el servidor ha respost ${status}`,
    curlMore: (count) => `… (${count} línies més)`,
    ctfTitle: 'mini-CTF · hi ha 3 flags amagades en aquesta web',
    ctfFlags: { base64: ['base64', 'alguna cosa «xifrada» en un fitxer ocult (ls -a)'], console: ['consola', 'els desenvolupadors tenen una consola: F12'], securitytxt: ['security.txt', 'les webs serioses expliquen com informar d’errors (RFC 9116) → curl'] },
    ctfSubmit: 'envia una flag amb: ', ctfDone: 'CTF completat! Si t’ha agradat, parlem-ne → ',
    submitUsage: 'ús: submit FLAG{…}', submitBad: '[x] flag incorrecta. continua buscant', submitRepeat: (id) => `ja tenies la flag ${id}`,
    submitOk: (id, count) => `[OK] flag ${id} correcta (${count}/3)`, submitNoCrypto: 'submit: el teu navegador no permet comprovar la flag aquí',
  },
};

const messages = (lang) => MESSAGES[lang] || MESSAGES.es;

const commandNames = [
  'help', 'ayuda', 'ajuda', 'whoami', 'ls', 'cd', 'open', 'cat', 'scan', 'grep', 'nmap', 'echo', 'encrypt', 'decrypt', 'sudo', 'rm',
  'cv', 'contacto', 'contacte', 'contact', 'mail', 'hire', 'contratar', 'skills', 'history', 'clear', 'cls', 'reset', 'date', 'exit',
  'pwd', 'uname', 'ping', 'hack', 'matrix', 'glitch', 'lights', 'defend', 'firewall', 'logs', 'tail', 'neofetch', 'htop', 'top',
  'cowsay', 'coffee', 'lang', 'base64', 'curl', 'ctf', 'submit',
];

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

const argumentPool = (command, projects, lang) => {
  if (['cd', 'open'].includes(command)) return [...Object.keys(SECTION_PATHS).map((s) => `${s}/`), ...projects.map((p) => `proyectos/${p.slug}`)];
  if (command === 'ls') return ['-a', ...Object.keys(SECTION_PATHS).map((s) => `${s}/`)];
  if (command === 'cat') return [...FILES, ...HIDDEN_FILES];
  if (command === 'grep') return messages(lang).grepWords;
  if (command === 'lang') return locales;
  if (command === 'lights') return ['off', 'on'];
  if (command === 'curl') return CURL_PATHS;
  if (command === 'base64') return ['-d'];
  return [];
};

export function complete(input, projects = [], lang = 'es') {
  const tokens = input.split(/\s+/);
  if (tokens.length <= 1) {
    const matches = commandNames.filter((name) => name.startsWith(tokens[0] || ''));
    return { matches, value: matches.length === 1 ? `${matches[0]} ` : input };
  }
  const [command, ...rest] = tokens;
  const partial = rest.join(' ');
  const pool = argumentPool(command, projects, lang);
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

// Sugerencia en gris al estilo de fish: primero el historial, luego el autocompletado.
export function suggest(input, history = [], projects = [], lang = 'es') {
  if (!input.trim()) return '';
  for (let i = history.length - 1; i >= 0; i -= 1) {
    if (history[i].startsWith(input) && history[i] !== input) return history[i];
  }
  const { matches, value } = complete(input, projects, lang);
  return matches.length === 1 && value.trimEnd().length > input.length ? value.trimEnd() : '';
}

/* ---------- utilidades de salida ---------- */

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const bar = (fraction, width = 20) => `${'#'.repeat(Math.round(fraction * width))}${'-'.repeat(width - Math.round(fraction * width))}`;
const clock = (lang) => new Date().toLocaleTimeString(dateLocales[lang] || 'es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
// Rango reservado para documentación (RFC 5737): nunca es la IP de nadie.
const fakeIp = () => `203.0.113.${Math.floor(2 + Math.random() * 250)}`;

const NEOFETCH_ART = [
  ' .---------. ',
  ' |  .---.  | ',
  ' |  |   |  | ',
  ' | .-----. | ',
  ' | |  o  | | ',
  ' | |  |  | | ',
  " | '-----' | ",
  '  \\       /  ',
  "   '.   .'   ",
  "     '-'     ",
];

const wrap = (text, width) => {
  const rows = [];
  let current = '';
  text.split(/\s+/).forEach((word) => {
    if (`${current} ${word}`.trim().length > width) {
      if (current) rows.push(current);
      current = word.slice(0, width);
    } else {
      current = `${current} ${word}`.trim();
    }
  });
  if (current) rows.push(current);
  return rows;
};

// Lanza un efecto de sonar en el fondo desde el centro de la terminal.
const sonar = (api) => {
  const point = api.terminalCenter?.();
  if (point) window.dispatchEvent(new CustomEvent('portfolio:ping', { detail: point }));
};

/* ---------- ejecución ---------- */

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
      m.help.forEach(([group, items]) => {
        const parts = [mark(`  ${group.padEnd(10, ' ')}`, 'dim')];
        items.forEach(([label, runnable], index) => {
          if (index) parts.push(mark(' · ', 'dim'));
          parts.push(run(label, runnable || label));
        });
        print(line('group', ...parts));
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
      const flags = args.filter((arg) => arg.startsWith('-'));
      const target = args.find((arg) => !arg.startsWith('-'))?.replace(/\/$/, '');
      const all = flags.some((flag) => flag.includes('a'));
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
      const hidden = all ? [mark('.  ..  ', 'dim'), ...HIDDEN_FILES.flatMap((file) => [run(file, `cat ${file}`), '  '])] : [];
      print(line('out', ...hidden, ...Object.keys(SECTION_PATHS).flatMap((section) => [run(`${section}/`, `cd ${section}`), '  ']), ...FILES.flatMap((file) => [run(file, `cat ${file}`), '  '])));
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
      if (file === '.secret') {
        print(line('dim', m.secret[0]));
        print(line('warn', SECRET));
        print(line('dim', m.secret[1], run('base64 -d', `base64 -d ${SECRET}`)));
        return;
      }
      if (file === '.bash_history') {
        m.bashHistory.forEach((entry, index) => print(line('out', mark(String(index + 1).padStart(4, ' '), 'dim'), `  ${entry}`)));
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
      print(line('out', 'email   ', link(data.email.label, data.email.url)));
      if (data.github) print(line('out', 'github  ', link(data.github.label, data.github.url)));
      print(line('dim', m.goTo, run('/contacto', 'cd contacto')));
      return;

    case 'hire':
    case 'contratar': {
      print(line('info', m.hireStart));
      const [id] = print(line('ok', `[${bar(0)}]   0%`));
      for (let step = 0; step < m.hireSteps.length; step += 1) {
        for (let tick = 1; tick <= 5; tick += 1) {
          await wait(70);
          const fraction = (step * 5 + tick) / (m.hireSteps.length * 5);
          api.update(id, line('ok', `[${bar(fraction)}] ${String(Math.round(fraction * 100)).padStart(3, ' ')}%  `, mark(m.hireSteps[step], 'dim')));
        }
      }
      api.update(id, line('ok', `[${bar(1)}] 100%  ✓`));
      await wait(200);
      print(line('ok', m.hireDone));
      print(line('out', m.hireNext, link(data.email.label, data.email.url), mark(' · ', 'dim'), run('cd contacto')));
      engine.celebrate();
      return;
    }

    case 'history':
      api.history.slice(-15).forEach((entry, index) => print(line('out', mark(String(index + 1).padStart(3, ' '), 'dim'), '  ', run(entry))));
      return;

    case 'clear':
    case 'cls':
      api.clear();
      return;

    case 'reset':
      api.reset();
      lightsOn();
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
        sonar(api);
        print(line('out', `64 bytes from ${args[0] || 'miguel.dev'}: icmp_seq=${i + 1} ttl=64 time=${(Math.random() * 8 + 3).toFixed(1)} ms`));
      }
      return;

    case 'hack':
      print(line('warn', m.hack, run('scan'), m.or, run('defend')));
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
        sonar(api);
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
      const piped = rest.match(/^(.*?)\s*\|\s*base64(\s+-d)?\s*$/i);
      if (piped) return execute(`base64${piped[2] || ''} ${piped[1]}`, api);
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
      if (/^(hire|contratar)$/.test(rest)) return execute('hire', api);
      print(line('warn', m.sudoPassword));
      await wait(500);
      print(line('err', m.sudoers));
      return;
    }

    /* ---------- efectos ---------- */

    case 'matrix': {
      if (reducedMotion()) { print(line('dim', m.reduced)); return; }
      print(line('ok', m.matrixStart));
      const effect = engine.matrix(7000);
      await api.until(effect.promise, effect.stop);
      print(line('ok', m.matrixEnd));
      return;
    }

    case 'glitch': {
      if (reducedMotion()) { print(line('dim', m.reduced)); return; }
      print(line('err', m.glitchStart));
      await engine.glitch(1600);
      print(line('ok', m.glitchEnd));
      return;
    }

    case 'lights':
    case 'luces':
    case 'llums': {
      const mode = (args[0] || '').toLowerCase();
      if (mode && !['on', 'off'].includes(mode)) { print(line('err', m.lightsUsage)); return; }
      const wantOff = mode === 'off' || (!mode && !lightsAreOff());
      if (wantOff) {
        lightsOff({ ...(api.terminalCenter?.() || {}), hint: m.lightsHint });
        print(line('ok', m.lightsOff));
        return;
      }
      if (!lightsOn()) { print(line('dim', m.lightsAlreadyOn, run('lights off'))); return; }
      print(line('ok', m.lightsOn));
      return;
    }

    /* ---------- seguridad ---------- */

    case 'logs':
    case 'alerts':
    case 'wazuh':
    case 'tail': {
      print(line('dim', m.logsHeader));
      const attacker = fakeIp();
      for (const event of m.logsEvents) {
        await wait(event.ar ? 380 : 420 + Math.random() * 520);
        const level = event.ar ? mark(' AR   ', 'ok') : mark(`lvl ${String(event.lvl).padStart(2, ' ')}`, event.lvl >= 10 ? 'err' : event.lvl >= 7 ? 'warn' : 'dim');
        print({ ...line(event.tone, mark(`${clock(api.lang)} `, 'dim'), level, `  ${event.text}`, event.ip ? mark(` · ${attacker}`, 'dim') : '', event.mitre ? mark(` [${event.mitre}]`, 'hl') : ''), indent: 17 });
      }
      await wait(300);
      print(line('dim', m.logsEnd, run('cd proyectos/laboratorio-soc-wazuh')));
      return;
    }

    case 'htop':
    case 'top': {
      const lastPid = 100 + m.htopProcs.length;
      const procs = m.htopProcs.map((cmd, index) => ({ pid: 101 + index, cmd, cpu: index === m.htopProcs.length - 1 ? 0.1 : 40 / (index + 1) }));
      const ids = print(
        line('ok', ''), line('ok', ''),
        line('dim', '  PID  USER    CPU%  COMMAND'),
        ...procs.map(() => line('out', '')),
      );
      for (let frame = 0; frame < 12; frame += 1) {
        procs.forEach((proc) => {
          if (proc.pid !== lastPid) proc.cpu = Math.max(0.3, Math.min(97, proc.cpu + (Math.random() - 0.5) * 14));
        });
        const total = Math.min(99, procs.reduce((sum, proc) => sum + proc.cpu, 0) / 2.2);
        const load = [0.4 + Math.random() * 0.8, 0.5 + Math.random() * 0.4, 0.6 + Math.random() * 0.2].map((value) => value.toFixed(2)).join(' ');
        api.update(ids[0], line('ok', `  CPU [${'|'.repeat(Math.round(total / 6.25)).padEnd(16, ' ')}] ${total.toFixed(1).padStart(5, ' ')}%`, mark(`   load ${load}`, 'dim')));
        api.update(ids[1], line('ok', `  MEM [${'|'.repeat(9).padEnd(16, ' ')}] 3.1G/8G`, mark(`   ${m.htopUptime}`, 'dim')));
        [...procs].sort((a, b) => b.cpu - a.cpu).forEach((proc, index) => {
          const tone = proc.pid === lastPid ? 'err' : index === 0 ? 'ok' : 'out';
          api.update(ids[3 + index], line(tone, `  ${proc.pid}  ${proc.pid === lastPid ? 'root  ' : 'miguel'}  ${proc.cpu.toFixed(1).padStart(4, ' ')}  `, proc.cmd));
        });
        await wait(650);
      }
      print(line('dim', m.htopEnd));
      return;
    }

    case 'defend':
    case 'firewall':
    case 'play':
    case 'jugar': {
      if (reducedMotion()) { print(line('dim', m.reduced)); return; }
      m.defendIntro.forEach((text, index) => print(line(index ? 'dim' : 'info', text)));
      if (window.scrollY > 120) window.scrollTo({ top: 0, behavior: 'smooth' });
      const [countId] = print(line('warn', '3…'));
      for (const step of ['2…', '1…']) { await wait(600); api.update(countId, line('warn', step)); }
      await wait(600);
      api.update(countId, line('ok', m.defendGo));
      const lives = 3;
      let breaches = 0;
      const game = startDefend({
        getTarget: () => engine.targetPoint(),
        labels: m.defendLabels,
        lives,
        onBlock: (packet) => print(line('ok', m.defendBlock(packet))),
        onBreach: (packet, x, y) => {
          breaches += 1;
          engine.impact(x, y, 240, 1100);
          print(line('err', m.defendBreach(packet, Math.round(((lives - breaches) / lives) * 100))));
        },
      });
      const stats = await api.until(game.promise, game.stop);
      print(line('info', m.defendSummary(stats)));
      const rank = !stats.won ? 'lost' : stats.breaches === 0 ? (stats.blocked >= 22 ? 'hunter' : 'n3') : stats.breaches === 1 ? 'n2' : 'n1';
      print(line(stats.won ? 'ok' : 'err', m.defendRank(m.defendRanks[rank])));
      print(line('dim', m.defendAgain, run('defend')));
      if (stats.won && stats.breaches === 0) engine.celebrate();
      return;
    }

    /* ---------- otros ---------- */

    case 'neofetch':
    case 'fetch':
      print({ tone: 'out', parts: [{ block: 'neofetch', data: { art: NEOFETCH_ART, title: 'miguel@pinedo', rows: m.neofetch.rows } }] });
      return;

    case 'cowsay': {
      const text = (args.join(' ') || m.cowsayDefault).slice(0, 120);
      const rows = wrap(text, 32);
      const width = Math.max(...rows.map((row) => row.length));
      print(line('out', ` ${'_'.repeat(width + 2)}`));
      rows.forEach((row, index) => {
        const [open, close] = rows.length === 1 ? ['<', '>'] : index === 0 ? ['/', '\\'] : index === rows.length - 1 ? ['\\', '/'] : ['|', '|'];
        print(line('out', `${open} ${row.padEnd(width, ' ')} ${close}`));
      });
      print(line('out', ` ${'-'.repeat(width + 2)}`));
      ['        \\   ^__^', '         \\  (oo)\\_______', '            (__)\\       )\\/\\', '                ||----w |', '                ||     ||'].forEach((row) => print(line('ok', row)));
      return;
    }

    case 'coffee':
    case 'cafe':
    case 'café':
    case 'cafè': {
      const steam = [['   (  )  ', '    )  ( '], ['    )  ( ', '   (  )  ']];
      const ids = print(line('dim', steam[0][0]), line('dim', steam[0][1]), line('ok', '  .------.'), line('ok', '  |      |]'), line('ok', '  \\      /'), line('ok', "   `----'"));
      for (let frame = 1; frame <= 6; frame += 1) {
        await wait(260);
        const [a, b] = steam[frame % 2];
        api.update(ids[0], line('dim', a));
        api.update(ids[1], line('dim', b));
      }
      print(line('ok', m.coffeeDone));
      return;
    }

    case 'lang':
    case 'idioma': {
      const code = (args[0] || '').toLowerCase();
      if (!locales.includes(code)) { print(line('err', m.langUsage)); return; }
      if (code === api.lang) { print(line('dim', m.langSame(code))); return; }
      const names = { es: 'español', en: 'english', ca: 'català' };
      print(line('ok', m.langGoing(names[code])));
      await wait(300);
      api.navigate(localePath(code, splitLocale(api.pathname).path));
      return;
    }

    case 'base64': {
      const decode = args[0] === '-d' || args[0] === '--decode';
      const value = (decode ? args.slice(1) : args).join(' ');
      if (!value) { print(line('err', m.base64Usage)); return; }
      try {
        print(line(decode ? 'ok' : 'out', decode ? decodeBase64(value) : encodeBase64(value)));
      } catch {
        print(line('err', m.base64Invalid));
      }
      return;
    }

    case 'curl':
    case 'wget': {
      const target = args.find((arg) => !arg.startsWith('-'));
      if (!target) { print(line('err', m.curlUsage), line('out', run(`curl ${CURL_PATHS[0]}`))); return; }
      let url;
      try { url = new URL(target, window.location.origin); } catch { print(line('err', m.curlFail('400'))); return; }
      if (url.origin !== window.location.origin) { print(line('err', m.curlForeign)); return; }
      const response = await api.until(fetch(url.href, { headers: { Accept: 'text/plain, application/xml, */*' } }));
      if (!response.ok) { print(line('err', m.curlFail(`${response.status} ${response.statusText}`))); return; }
      const text = await api.until(response.text());
      if ((response.headers.get('content-type') || '').includes('text/html')) {
        print(line('dim', `<!doctype html> … (${text.length} bytes)`));
        return;
      }
      const rows = text.replace(/\r/g, '').trimEnd().split('\n');
      rows.slice(0, 24).forEach((row) => print(line(row.startsWith('#') ? 'dim' : 'out', row)));
      if (rows.length > 24) print(line('dim', m.curlMore(rows.length - 24)));
      return;
    }

    case 'ctf': {
      const found = readFound();
      print(line('info', m.ctfTitle));
      FLAGS.forEach((flag) => {
        const [label, hint] = m.ctfFlags[flag.key];
        const done = found.includes(flag.id);
        print(line(done ? 'ok' : 'out', `  [${done ? '✓' : ' '}] 0${flag.id} ${label.padEnd(13, ' ')}`, done ? '' : mark(hint, 'dim')));
      });
      if (found.length === FLAGS.length) print(line('ok', m.ctfDone, link(data.email.label, data.email.url)));
      else print(line('dim', m.ctfSubmit, run('submit FLAG{…}', 'submit')));
      return;
    }

    case 'submit':
    case 'flag': {
      const value = args.join(' ').trim();
      if (!value || value === 'FLAG{…}') { print(line('err', m.submitUsage)); return; }
      if (!window.crypto?.subtle) { print(line('err', m.submitNoCrypto)); return; }
      const hash = await api.until(sha256(value));
      const flag = FLAGS.find((item) => item.hash === hash);
      if (!flag) { print(line('err', m.submitBad)); return; }
      const found = readFound();
      if (found.includes(flag.id)) { print(line('dim', m.submitRepeat(flag.id))); return; }
      const next = [...found, flag.id].sort();
      saveFound(next);
      print(line('ok', m.submitOk(flag.id, next.length)));
      if (next.length === FLAGS.length) {
        print(line('ok', m.ctfDone, link(data.email.label, data.email.url)));
        engine.celebrate();
      } else {
        const point = api.terminalCenter?.();
        if (point) burst({ x: point.x, y: point.y, count: 50, spread: 0.6, reducedMotion: reducedMotion() });
        print(line('dim', run('ctf')));
      }
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
