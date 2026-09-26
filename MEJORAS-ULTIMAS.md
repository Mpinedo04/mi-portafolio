# Registro de mejoras del portafolio

**Actualizado: 26 de septiembre de 2026**

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

## Limpieza final de restos (26/09/2026)

- Se borró `public/assets/lavanderia-miguel-preview.png`, la captura antigua de la Lavandería que ya no usaba ninguna página (se usa la versión `-rework.jpg`).
- Se quitaron de `globals.css` la clase `.t-ok` y las animaciones `capabilityVisualDrift` y `telemetryOrbit`, que venían del `styles.css` antiguo y no usaba nada.
- Se quitó la dependencia `@sanity/ui`: el código no la importa y ya viene incluida con Sanity.

## Próximas mejoras

- Añadir aquí cada nuevo cambio con su fecha y una descripción breve.
