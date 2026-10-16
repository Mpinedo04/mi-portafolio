# Registro de mejoras del portafolio

**Actualizado: 16 de octubre de 2026**

Este archivo recoge las mejoras incorporadas al portafolio y sirve como lista para anotar las siguientes.

## Migración y estructura

- Se trasladó el portafolio estático a **Next.js con App Router**, conservando la identidad visual oscura, tecnológica y de terminal.
- Se preparó la integración con **Sanity** para gestionar contenido, previsualizar borradores y revalidar páginas. Mientras no se configure Sanity en `.env.local`, el sitio puede usar el contenido local de respaldo.
- Se organizaron las páginas de inicio, proyectos, estudios, sobre mí, contacto y los informes de proyectos.
- Se añadieron componentes compartidos para la navegación y el pie de página, además de transiciones y efectos visuales reutilizables.
- Se conservaron redirecciones desde direcciones antiguas `.html` y los datos locales de los informes.

## Diseño y experiencia

- En **Sobre mí**, las capacidades se muestran en una lista vertical, una por fila, para facilitar su lectura.
- En **Proyectos**, las tarjetas se presentan en filas individuales en lugar de agruparse de tres en tres.
- Se personalizó la barra lateral de desplazamiento con un aspecto fino y tradicional, un degradado de color y un indicador de progreso. Al pulsarla o arrastrarla, responde al instante incluso con el desplazamiento suave global; la navegación por teclado conserva su transición suave.
- Al llegar al final, la barra superior permanece visible como borde del marco; las líneas laterales y la inferior se unen a ella para cerrar el contorno de la página.
- La ventana de terminal de la portada incorpora controles de minimizar, maximizar/restaurar y cerrar, además de poder moverse por la pantalla.
  - Al minimizarla, aparece el botón **«Abrir terminal»** y se conserva el texto escrito.
  - Al cerrarla y volver a abrirla, la animación del texto empieza de nuevo.
  - Se puede restaurar desde el modo maximizado con el control correspondiente o con `Escape`.
- La terminal sigue el cursor directamente al arrastrarla y puede empujar por la página enlaces, botones, controles y campos visibles, con un desplazamiento limitado y elástico. El contacto ilumina ambos elementos y muestra un indicador de resistencia al alcanzar el límite; al soltar, los elementos recuperan su sitio con una transición.

## Copia de seguridad

- Se guardó una copia del portafolio anterior en `mi-portafolio-antiguo-backup.zip`.

## Comprobación y publicación

- Se revisaron visualmente en `http://localhost:3000` la página de proyectos, la barra de desplazamiento y los controles de la terminal.
- Subido a GitHub el 26/09/2026 tras comprobar que `npm run lint` y `npm run build` pasan.

## Terminal interactiva y hero con física (26/09/2026)

Se rehízo por completo la interacción de la terminal de la portada.

- **Hero en dos columnas** a partir de 1100 px: el texto queda a la izquierda y la terminal a la derecha, así los botones se ven sin hacer scroll. En tablet y móvil se mantiene apilado.
- **Motor físico propio** (`src/components/hero/fieldEngine.js`), con un único `requestAnimationFrame` que se duerme cuando todo está en reposo.
  - La ventana se arrastra, se **lanza con inercia**, rebota en los bordes y se inclina según su velocidad.
  - Si se suelta cerca de su hueco original, **se acopla** sola.
  - Cada letra del prefijo, de «Miguel Pinedo» y del tagline es un cuerpo con muelle. La terminal crea un campo que las aparta y las empuja con su velocidad. Las letras que quedan bajo el cristal se ven **cifradas**.
  - Los botones del hero, el logo, el botón del CV y el menú también reaccionan.
  - Al pasar el ratón por el texto, las letras se descifran un instante.
- **Terminal escribible** con historial (↑/↓), autocompletado (Tab), `Ctrl+C`, `Ctrl+L` y botones rápidos. Los resultados de los comandos son clicables.
  - `help`, `whoami`, `ls`, `cd <sección>`, `cat skills.txt`, `nmap`, `cv`, `contacto`, `history`, `clear`, `reset`, `exit`.
  - `scan`: una línea de escaneo recorre la página, descifra el texto y lista «hallazgos» por cada bloque.
  - `grep <palabra>`: resalta la palabra en el titular y hace saltar sus letras.
  - `echo "texto" > tagline`: reescribe el lema en directo.
  - `encrypt` / `decrypt`: cifra y descifra todo el texto del hero.
  - `sudo rm -rf /`: el hero y el menú caen por gravedad y después se restauran.
- **El texto también controla la terminal**: al hacer clic en el nombre se ejecuta `whoami`, en el prefijo `cat skills.txt` y en el tagline `scan`.
- Se corrigió que las líneas `[OK] …` perdieran la alineación (se colapsaban los espacios).
- Se eliminaron el empuje global de cualquier elemento interactivo de la página, el «puente» de colisión y la etiqueta de resistencia.
- Accesibilidad: el texto real se mantiene para lectores de pantalla (las letras sueltas son `aria-hidden`), la salida es un `role="log"` y con `prefers-reduced-motion` no hay física ni animaciones.

## Mantenimiento (26/09/2026)

- `npm run lint` fallaba: ESLint 10 no es compatible todavía con `eslint-config-next`. Se bajó a ESLint 9 y se pasó `eslint.config.mjs` a la configuración plana nativa. Ahora el lint pasa sin errores.
- Se corrigieron los textos `// …` sueltos en JSX, el `<a href="/">` del 404 global y un `setState` dentro de un efecto en `PageTransition`.
- **Tras actualizar hay que ejecutar `npm install`** para que se instale ESLint 9.

## Segunda ronda de mejoras (26/09/2026)

- **Vercel Analytics** vuelve a funcionar: la migración lo había perdido. Se usa `@vercel/analytics` en el layout del sitio y en el 404 global, y no se carga en modo borrador.
- **Portada**: tras el hero aparece el laboratorio SOC como proyecto destacado, con sus cifras, los cuatro informes enlazados y la descarga de la regla XML. Debajo va una fila con el resto de proyectos y el perfil operativo enlaza a «Sobre mí».
- **Nueva portada oscura del laboratorio** (`public/assets/lab-soc/portada-soc-wazuh.jpg`). Sustituye la captura clara de Kibana y se compone con evidencias reales: la alerta 5712 resaltada, el log de `firewall-drop` y la regla 100100.
- **Tarjetas de proyecto**:
  - Ya no hay un `role="link"` que envuelva otros enlaces.
  - El título es el enlace principal y se estira sobre toda la tarjeta: lleva al caso de estudio si existe y, si no, a la demo en una pestaña nueva.
  - «demo ↗», «código ↗» y las descargas son enlaces visibles e independientes.
- **Transición entre páginas**: se mantiene la misma duración, pero el panel ahora simula el comando `cd` a la ruta de destino, tres comprobaciones y una barra con porcentaje. La terminal del hero también navega con esta transición.
- **Barra lateral en móvil**: pasa a ser un indicador fino pegado al borde que no tapa el contenido ni recibe toques.
- **Tildes** corregidas en todo el contenido local de respaldo (`src/data/portfolio.js`).
- **Informes**: la conversión desde HTML había pegado títulos y subtítulos («Resumen ejecutivoQué ocurrió…»), dejado números sueltos y convertido las cifras en párrafos. Ahora:
  - Cada sección tiene su título numerado y su subtítulo.
  - Las cifras están en una tabla y los pies de foto están separados.
  - En las descargas ya no se duplica la flecha.
- **Bug corregido**: la regla global `nav { position: fixed }` también afectaba a la miga de pan de los informes y la colocaba encima del menú. Ahora solo se aplica a `header nav`.
- Nuevo script `npm run seed:informes`: sube a Sanity solo las guías e informes, sin sobrescribir el resto del contenido.
- **Limpieza**: el README ya no apunta a los HTML antiguos, `*.zip` está en `.gitignore` y los restos de la versión estática se pueden borrar (la lista está en la respuesta de Claude).

## Comparación con la versión HTML antigua (26/09/2026)

Se comparó el backup `mi-portafolio-antiguo-backup.zip` con la web nueva, página por página, texto a texto, más imágenes, enlaces, tablas, bloques de código y títulos.

- **No se ha perdido texto** en ninguna página ni informe. Las únicas diferencias son las tildes corregidas y el prompt de la terminal.
- Las 10 imágenes de la guía y las de cada informe siguen presentes, igual que las tablas, el bloque de código y los enlaces a MITRE ATT&CK y a la documentación oficial.
- **Reparado**: el informe SSH había perdido las tres descargas CSV del manifiesto SHA-256 (las celdas conservaban el texto pero no el enlace). Se han añadido como enlaces de descarga debajo de la tabla.
- **Reparado**: 35 títulos de la guía (tarjetas, endpoints, hitos de la bitácora, detecciones) y varios de los informes se habían convertido en párrafos. Vuelven a ser títulos y la guía tiene los mismos 51 que antes.
- **Recuperado**: el botón **Imprimir / Guardar PDF** de los informes, con estilos de impresión en blanco y sin menú, fondo animado ni terminal.
- Queda como diferencia de diseño, no de contenido: la guía antigua tenía menú lateral, barra de progreso y visor de imágenes ampliadas. Ahora las imágenes se abren a tamaño completo en otra pestaña.
- El enlace de LinkedIn de la página de contacto ya apuntaba a `#` en la versión antigua; ahora no se muestra hasta que tenga una URL real.

## Limpieza de la versión antigua (26/09/2026)

- Se borraron del repositorio los restos de la web estática: los HTML de la raíz, `script.js`, `styles.css` y las carpetas `assets/` y `config/`, que eran copias idénticas de las de `public/`.
- También se quitó `scripts/convert-reports.py`, que solo servía para convertir una vez los HTML antiguos a JSON.
- Todo sigue disponible en el historial de git y en el backup local `mi-portafolio-antiguo-backup.zip`.

## Vista previa al compartir el enlace (26/09/2026)

- Cada página tiene ahora una descripción propia y las etiquetas Open Graph y de X que usan LinkedIn, WhatsApp, Slack o el correo para generar la tarjeta de vista previa.
- Nueva imagen de vista previa de 1200×630 (`/og-image.png`) con el estilo de la web: nombre, lema, las tres credenciales del laboratorio SOC y las etiquetas principales. Se genera en el build desde `src/app/og-image.png/route.jsx`.
- La URL pública se toma de `NEXT_PUBLIC_SITE_URL` o, si no está definida, de la URL de producción que da Vercel. Si algún día usas un dominio propio, ponlo en `NEXT_PUBLIC_SITE_URL`.
- Las descripciones están en `src/data/portfolio.js` (campo `seo.metaDescription`) y se pueden cambiar también desde Sanity.

## Corrección: parpadeo al acoplar la terminal (26/09/2026)

- Al soltar la terminal sobre su hueco, aparecía un instante en la esquina superior izquierda. La ventana flotante está anclada en (0, 0) y se coloca con `transform`; el motor quitaba ese `transform` un fotograma antes de que React la devolviera a su sitio. Ahora se deja exactamente sobre el hueco hasta que React la mueve.

## Logo de terminal y botón del CV (26/09/2026)

- El prompt del logo muestra la sección actual (`root@miguel:~/proyectos$`). Al cambiar de página borra la ruta anterior hasta la parte común y escribe la nueva, como un `cd`. En rutas profundas se abrevia (`~/proyectos/…`).
- Cursor de bloque que parpadea en reposo y se queda fijo mientras escribe o al pasar el ratón; barrido de luz tipo CRT al pasar el ratón; colores de prompt de bash (usuario dorado, ruta verde).
- Botón del CV: un destello recorre el borde en bucle (sustituye al brillo anterior), la flecha de descarga «cae» en la bandeja al pasar el ratón y la etiqueta PDF es una píldora.
- Logo y botón miden lo mismo (32 px; 28 px en móvil) y tienen foco visible con teclado. Con movimiento reducido no hay animaciones.
- Cabecera en anchos intermedios: menos margen por debajo de 1100 px y cabecera en dos filas entre 769 y 940 px, para que el menú no choque con el logo.

## Limpieza final de restos (26/09/2026)

- Se borró `public/assets/lavanderia-miguel-preview.png`, la captura antigua de la Lavandería que ya no usaba ninguna página (se usa la versión `-rework.jpg`).
- Se quitaron de `globals.css` la clase `.t-ok` y las animaciones `capabilityVisualDrift` y `telemetryOrbit`, que venían del `styles.css` antiguo y no usaba nada.
- Se quitó la dependencia `@sanity/ui`: el código no la importa y ya viene incluida con Sanity.

## Marco de fin de página y README (26/09/2026)

- El marco que aparece al llegar al final continúa la barra superior en el sentido de las agujas del reloj (derecha, abajo, izquierda) con un trazo seguido y colores que coinciden en cada esquina. Al subir se recoge rápido en lugar de desaparecer de golpe.
- Las esquinas son refuerzos tipo visor en lugar de rombos que quedaban medio fuera de la pantalla.
- La pastilla final («EOF · volver arriba») es un botón que sube al inicio. En móvil, el pie deja sitio para que no tape el texto.
- README reescrito: enlace a la web publicada, informes enlazados, otros proyectos, funciones de la web, scripts, variables de entorno, despliegue y estructura actualizada.

## Nuevo proyecto: StagePlot Studio (13/10/2026)

- Se añadió StagePlot Studio a los proyectos, justo después del laboratorio SOC, con una captura del editor (ahora en `public/assets/stageplot/stageplot-editor-3d.jpg`).
- La ficha explica que es una app de pago con backend propio (Supabase con seguridad por filas, licencias, control de dispositivos y funciones en Cloudflare) e incluye tres datos: 24/8 entradas y auxiliares, 8 tablas con RLS y 28 funciones SQL.
- El enlace lleva a la web publicada en Cloudflare Pages. No hay enlace al código porque es una app de pago con el código privado.

## Logo de la cabecera más cercano (13/10/2026)

- El logo ya no es un prompt de terminal (`root@miguel:~$`). Ahora es el nombre «MIGUEL PINEDO» en mayúsculas espaciadas (Fraunces), para que cualquier visitante, por ejemplo de recursos humanos, lo entienda a la primera.
- En reposo, la píldora del nombre lleva el mismo borde con un destello que gira que el botón del CV, a contrafase para que no se muevan a la vez.
- Al pasar el ratón se rellena de dorado y las letras se vuelven oscuras.
- Descartados por el camino: una frase que rotaba junto al nombre y un monograma «MP».
- Logo y botón del CV miden lo mismo: 36 px (32 px en móvil). Con movimiento reducido el destello no gira.
- Los campos «Usuario del prompt» y «Host del prompt» se quitaron de Sanity porque ya no se usan.
- La imagen de vista previa al compartir el enlace (`/og-image.png`) cambia la píldora `root@miguel:~$` por «MIGUEL PINEDO», a juego con la cabecera.

## CV corregido (13/10/2026)

- En el PDF del CV, el Grado Superior ASIX pasa de «2023 - 2025» a «2023 - 2026», según el expediente académico, y el correo pasa a `mpinedo@gmail.com`.
- Se editó el PDF original cambiando solo esos dos textos, con la misma fuente, tamaño, color y posición. El resto del documento no cambia.
- Siguiendo una revisión del CV, se quitaron la dirección completa (queda el municipio en «Ubicación»), la fecha de nacimiento, la nacionalidad y el DNI. La sección «Datos personales» desaparece e «Idiomas» y «Competencias» suben para no dejar hueco. Los datos se borraron del PDF, no solo se taparon.

## Grado Superior ASIX en Estudios (13/10/2026)

- En Estudios aparece primero el Grado Superior en Administración de Sistemas Informáticos en Red (ASIX), perfil de ciberseguridad, 2023 – 2026, con nota final 8,01. Sustituye a la entrada provisional «Grado en Ciberseguridad · Universidad / España · 2022».
- Las credenciales admiten ahora «datos destacados» (también en Sanity). El ASIX muestra: Proyecto final · 10, Ciberseguridad y hacking ético · 9, Seguridad y alta disponibilidad · 9 y Prácticas en empresa · 383 h. Datos sacados del expediente académico.
- El punto y el año de cada credencial se alinean con la primera línea del nombre.
- El expediente no se publica en la web porque contiene datos personales (NIF).
- Se quitaron CEH, CompTIA Security+ y TryHackMe Top 1%. La sección pasa a llamarse «Formación» (etiqueta «// 03 - estudios»).

## Botón de correo de contacto (13/10/2026)

- La dirección de contacto es `mpinedo@gmail.com`, el correo principal de Miguel.
- El botón ya no abre la página de redactar de Gmail, que solo sirve a quien usa Gmail en el navegador y se cerraba sola. Ahora usa `mailto:` (abre el programa de correo de cada visitante, con el asunto ya escrito).
- Se probó un botón «copiar» al lado y se quitó: el botón vuelve a ser la píldora dorada con la dirección en mayúsculas.

## Formulario de contacto con Formspree (13/10/2026)

- Contacto tiene un formulario como el de Portafolio Raúl, con el servicio Formspree (formspree.io). Pide nombre, correo, empresa o teléfono (opcional) y mensaje. El correo de quien escribe queda como dirección de respuesta.
- Mejoras respecto al de Raúl: no hay «modo prueba» que diga «enviado» sin enviar nada, y una trampa invisible (`_gotcha`) frena a los bots.
- Solo aparece si hay un ID de formulario en `contactContent.formspreeId`, en Sanity («ID de Formspree») o en la variable `NEXT_PUBLIC_FORMSPREE_ID`. Mientras no lo haya, la página sigue igual que antes.

## Perfil real, experiencia, caso de StagePlot, tres idiomas y transición rápida (14/10/2026)

**Mensaje alineado con el perfil real.** La web dejaba de encajar con el CV («Security Researcher & Developer», «Encuentro vulnerabilidades antes de que las encuentren otros»). Ahora:
- Portada: «// Técnico en ciberseguridad y sistemas» y el lema «Listo para defender sistemas y redes desde mi primer puesto».
- Terminal (`whoami`, `skills.txt`): datos reales del ASIX, como hacking ético · 9, seguridad y alta disponibilidad · 9, SIEM con Wazuh (laboratorio propio) y administración Windows/Linux.
- «Sobre mí»: la biografía y las habilidades salen de lo demostrable; se quitó «CTF / Red Team / HackTheBox / THM».
- Títulos, descripciones SEO y la imagen al compartir el enlace dicen lo mismo.

**Experiencia y formación.**
- Sección «Experiencia» en «Sobre mí» (`ExperienceTimeline`):
  - prácticas del Grado Superior en Simón Coll (FCT, 383 h, 2025 – 2026);
  - informático en prácticas en Finques Pardas (Grado Medio);
  - una línea con otros trabajos.
- También en Sanity (campo «Experiencia» de «Sobre mí»).
- En «Formación» se añadió el Grado Medio SMX (2020 – 2023).

**Caso de estudio de StagePlot Studio** (`src/data/reports/caso-stageplot-studio.json`, solo en español).
- Resumen, problema, funciones, arquitectura (Cloudflare Pages + Supabase), siete capas de seguridad, casos de abuso, privacidad y aprendizajes.
- Tres capturas reales: editor 3D, input list y ficha técnica.
- No incluye código, claves, URL de la base de datos ni precios.
- `src/data/reports.js` admite varios proyectos con documentación.
- Con un solo documento, las tarjetas enlazan directamente a él (`caseStudyPath`).

**Español, inglés y catalán.**
- Rutas: el español sigue sin prefijo (`/proyectos`); el inglés y el catalán van en `/en/…` y `/ca/…`. Las páginas viven en `src/app/(website)/[lang]/` y `src/proxy.js` reescribe por dentro las rutas sin prefijo a `/es`. `/es/…` redirige a la versión sin prefijo.
- Selector ES · EN · CA en la cabecera, que conserva la página actual. En móvil estrecho se oculta la etiqueta «PDF» del botón del CV para que todo quepa.
- Textos de interfaz en `src/i18n/ui.js` y contenido traducido en `src/data/content/en.js` y `ca.js`.
- Cada página indica su idioma (`<html lang>`), su canónica y sus versiones en los otros idiomas (`hreflang`).
- La terminal de la portada responde en el idioma de la página.
- Los informes y casos de estudio siguen en español; en inglés y catalán muestran un aviso. Sanity solo alimenta la versión en español.

**Transición entre páginas.**
- Pasa de unos 0,7 s a unos 0,25 s.
- Ya no muestra la terminal `root@miguel… cd /proyectos`, sino el nombre de la página de destino en el idioma de la web.

## Detalles interactivos: terminal, efectos y búsqueda (16/10/2026)

**Terminal de la portada.** Comandos nuevos (`help` los agrupa por temas), en los tres idiomas:
- `matrix`: lluvia de caracteres dorados detrás del texto; las letras del nombre parpadean cuando las toca una gota.
- `glitch`: interferencia con desplazamiento de colores sobre el titular.
- `lights off` / `lights on`: apaga la web y deja una linterna que sigue al ratón (Esc o el botón de abajo la encienden). Sigue activa al cambiar de página.
- `defend`: minijuego de 25 s; llegan paquetes maliciosos (SQLi, phishing, ransomware…) hacia el nombre y hay que pararlos con un clic. Al final da un rango, de «becario» a «Threat Hunter».
- `logs`: simulación de alertas de Wazuh como las del laboratorio (fuerza bruta, respuesta activa, PowerShell codificado, FIM, regla propia) con su técnica MITRE.
- `htop` en directo, `neofetch` con un escudo en ASCII y ficha personal, `hire` (barra de «selección» y confeti), `cowsay`, `coffee`, `lang en|es|ca`, `curl`, `base64`.
- `ping` y `nmap` lanzan ondas de sonar en el fondo.
- Sugerencia en gris mientras escribes (se acepta con →), a partir del historial y del autocompletado.
- El usuario del prompt pasa a ser `visitante@miguel` (antes `root`), coherente con `sudo`.

**Mini-CTF.** Tres flags escondidas en la web (un archivo oculto de la terminal, la consola del navegador y `/.well-known/security.txt`). `ctf` muestra el progreso y las pistas, y `submit FLAG{…}` las comprueba (solo se guarda su SHA-256). Con las tres sale confeti y el correo.

**Letras del nombre.** Con el ratón se pueden coger y estirar: arrastran a sus vecinas de palabra como una goma y vuelven a su sitio al soltarlas. En móvil no se activa, para no estorbar al scroll.

**En toda la web.**
- Búsqueda con **Ctrl+K** (o `/`, o la lupa de la cabecera): páginas, proyectos, casos de estudio, CV, correo, idioma, linterna…
- Títulos y etiquetas de sección que se «descifran» al aparecer.
- Luz que sigue al puntero dentro de las tarjetas de proyectos y capacidades.
- Fondo: paquetes de datos que viajan por la red de nodos y un sonar al hacer clic en una zona vacía.
- Franja de cifras en la portada (8,01 · 383 h · 3 informes · 3 idiomas) que cuenta desde cero.
- Pie de página con piloto «todos los sistemas operativos», el commit desplegado (enlace a GitHub) y el atajo Ctrl K.
- Página 404 con un `traceroute` que sugiere la página más parecida a la dirección mal escrita (`/proyecto` → `/proyectos`, `/about` → `/sobre-mi`…).
- Saludo en la consola del navegador para quien curiosee el código, título de la pestaña «sesión en pausa» al cambiar de pestaña y código Konami (↑↑↓↓←→←→BA).
- `robots.txt`, `sitemap.xml` (las páginas en los tres idiomas) y `security.txt` (RFC 9116).

Todo respeta el movimiento reducido: sin lluvia, glitch, minijuego ni animaciones de texto.

## Próximas mejoras

- Añadir aquí cada nuevo cambio con su fecha y una descripción breve.

### Pendiente

- [ ] **Activar el formulario de contacto (Formspree).** El código ya está publicado, pero el formulario no se ve hasta tener un ID.
  1. Entrar en [formspree.io](https://formspree.io) → **New form** → nombre «Portafolio Miguel», que envíe a `mpinedo@gmail.com`.
  2. Copiar la parte final de la dirección que da (`https://formspree.io/f/XXXXXXXX` → `XXXXXXXX`).
  3. Ponerla en `formspreeId` dentro de `contactContent` (`src/data/portfolio.js`), o en Sanity → Contacto → «ID de Formspree».
  4. Subir y enviar un mensaje de prueba desde `/contacto`. El primer envío puede pedir confirmar el formulario por email.
- [ ] **Poner la dirección miguelpinedo.vercel.app** (lo hace Miguel en Vercel): Project → Settings → Domains → *Add* `miguelpinedo.vercel.app`, y en la dirección antigua (`mi-portafolio-sepia-xi.vercel.app`) elegir *Redirect to* la nueva (308). El README ya usa la dirección nueva.
- [ ] **Fechas de la experiencia en el CV y en la web.** En la web, se cambian en `experienceContent` (`src/data/portfolio.js`) y en las traducciones de `src/data/content/`. Cambiar «9 meses», «6 meses»… por mes y año de inicio y fin de cada trabajo, indicando si era de fines de semana (p. ej. `01/2026 – 06/2026 (fines de semana)`): La Bastilla, Finques Pardas, Simón Coll e Interim Group.
