# Contexto del proyecto — pegar al iniciar una conversación nueva

> Copia todo lo que hay debajo de la línea y pégalo como primer mensaje.
> Con eso la IA ya no necesita explorar nada más.

---

Trabajo en el sitio web de JARA, fotógrafo y videógrafo venezolano. Ya está
montado y publicado. Este es todo el contexto; no hace falta que explores el
repositorio para entenderlo.

## 1. Dónde está todo

| Qué | Dónde |
|---|---|
| Carpeta de trabajo | `C:\Users\ANDRES ISAZA\Downloads\JARA\SITIO WEB` |
| Landing (cabecera + portada con 2 botones + pie; chat de cotización) | `index.html` |
| Portafolio (4 colecciones) | `portafolio.html` |
| Fotos del sitio (~259 archivos, 36 MB) | `img/` |
| Documentación del sitio | `LEEME.txt`, `README.md` |
| Vista previa de color, **ya no se usa** | `portafolio-beige2.html` |
| Fotos originales (FUERA del repositorio) | `C:\Users\ANDRES ISAZA\Downloads\JARA\FOTOGRAFIAS\` |

**GitHub** — cuenta `andresisazao09-lang`
- Repositorio (público): https://github.com/andresisazao09-lang/jara-sitio-web
- Web publicada (GitHub Pages, rama `main`, raíz): https://andresisazao09-lang.github.io/jara-sitio-web/
- `gh.exe` está en `C:\Program Files\GitHub CLI\gh.exe` (no está en el PATH).
- El credential helper ya está configurado (`gh auth setup-git`): `git push` funciona sin pedir nada.

## 2. Regla principal de trabajo

**Cada cambio en estos archivos se commitea y se sube a GitHub automáticamente,
sin preguntarme.** Mensajes de commit en español. Yo reviso los avances desde la
app móvil de GitHub, y la web publicada se actualiza sola 1–2 minutos después.

## 3. Cómo quiero que me respondas

- **Respuestas lo más cortas posible. Actúa y arregla los errores sin gastar
  tokens en explicaciones largas.** Yo reviso al final si los cambios quedaron
  bien; no leo explicaciones extensas. Basta una tabla mínima de qué se hizo.
- En **español**.
- No soy técnico: explícame en palabras normales, no en jerga.
- Te doy listas numeradas de tareas; respóndeme en el mismo orden.
- **No inventes datos** (fechas, países, nombres, números). Si te faltan, pídemelos.
- Antes de dar algo por hecho, **pruébalo en el navegador**. Si algo no lo pudiste
  probar, dímelo claramente en vez de asegurar que funciona.

## 4. Cómo está hecho el sitio (arquitectura)

- Dos HTML **autocontenidos**: el CSS va en un `<style>` dentro del archivo, el JS
  en un `<script>` al final, y los logos (Jara, Instagram, TikTok) están incrustados
  como base64. No hay archivos `.css` ni `.js` sueltos. No hay framework ni servidor.
- **Punto de quiebre móvil: 760 px.** `@media (max-width:760px)` = móvil,
  `@media (min-width:761px)` = escritorio.
- **El encabezado (`.top-bar`) debe ser IDÉNTICO en los dos archivos**: un estilo
  para escritorio y otro para móvil. Si tocas uno, toca el otro igual.
- **Landing (16-09-2026):** solo `.top-bar` → `.hero` (logo + botones "Cotiza tu sesión
  fotográfica" y "Ver portafolio") → `footer`, más el botón flotante de WhatsApp y el de
  paleta. La sección de abajo ("EMPECEMOS", 2 fotos, botón verde) se quitó; la parte de
  abajo se hará más adelante.
- Estructura del portafolio, en orden:
  `.top-bar` → `.p-hero` → `.idx` (colecciones) → `.nav-rail` (barra de categorías)
  → 4 × `.col-section` → `.p-cta` → `footer` → `.to-top` → `.wa-fab` → `.lb` (visor)
- **Colecciones y subcategorías actuales:**
  - Conciertos → Maluma, Luis Miguel, Beéle, Otros artistas
  - Retratos → **Ambientados** (primero), **En Estudio**
  - Campañas → sin subcategorías (no lleva `<h3>`)
  - Films → vacía, dice "Próximamente"
- **Mosaico de fotos:** lo calcula la función `layout()` en JS. Usa la proporción
  ya conocida de cada foto (`data-ar`), coloca cada una en la columna más corta y
  reparte el sobrante con tope `STRETCH_MAX = 0.14`. No mide imagen por imagen.
- **Visor de fotos (`.lb`):** una sola `<img id="lbImg">` que cambia de `src`.
  Se navega con flechas, teclado y deslizando el dedo.

- **Cotización = chat "Agente de Jara"** en `index.html`: ventana estilo WhatsApp (`#waChat`)
  con un **motor de preguntas ramificado (16-09-2026, ajustes post-v4)**. Todo el cuestionario
  vive en el array `PREGUNTAS`: **16 entradas** repartidas en **9 a 10 pantallas**, cada objeto
  es `{id, bloque, grupo, tipo, pregunta, ayuda, opciones, showIf, etiquetaWA}`.
  **Para añadir o cambiar una pregunta se edita ese array, nunca el HTML.**
  - Las preguntas de opción única (`tipo:'select'`) se pintan como una **lista vertical de
    botones del mismo ancho** (clases `wa-opt-list`/`wa-opt`), todos alineados a la izquierda,
    en vez de los chips envueltos de antes (dejaban filas irregulares). Avanzan solas al tocar
    una opción, el resto lleva botón "Continuar".
  - **Orden de las opciones: de mayor a menor alcance/tamaño de proyecto**, siempre — es un
    criterio interno, el cliente nunca lo ve como tal, solo ve una lista prolija y consistente.
    Ejemplos ya aplicados: `perfil_tipo` → Empresa o Agencia, Marca personal o creador, Modelo,
    Persona natural. `natural_ocasion` → Boda, 15 años, Graduación, Embarazo, Sesión
    fotográfica, Otro. `cantidad_fotos`/`cantidad_videos`/`evento_horas` → de la cantidad más
    alta a la más baja, con "Ninguna/o" casi al final y "No sé, que lo proponga Jara" siempre
    de último. Si se agrega una pregunta nueva con opciones, ordenarla con el mismo criterio.
  - Bloques: A contacto (los 3 datos juntos) · B quién es · C qué necesita · D cuándo y dónde.
    **No hay bloque de alcance, de presupuesto, de preferencia de contacto ni de entorno de la
    sesión, y no deben volver:** en este mercado preguntar por precio hace abandonar el
    formulario; `modalidad`/`apoyo_equipo` y "¿en qué entorno?" se probaron y se quitaron por
    alargar de más sin aportar algo que Jara no resuelva en un mensaje de WhatsApp.
  - Ninguna ruta pasa de **10 pantallas** (empresa+evento 10, empresa 9, persona natural /
    marca personal / modelo 9, +1 si eligen evento). Si una pregunta nueva rompe ese techo, sobra.
  - Regla de oro para podar: si Jara puede resolverlo en una frase de WhatsApp con el lead ya
    caliente, no va en el formulario.
  - `brief_libre` (textarea grande, bloque C) es el corazón: sustituye a ~15 sub-preguntas de
    estilo, referencias, guion y edición. No recortarlo.
  - `grupo` junta varias entradas en una sola pantalla: `contacto` (nombre+teléfono+correo),
    `marca` (nombre de marca + redes; si el perfil es Modelo queda solo redes) y
    `cantidad` (fotos + videos). El historial guarda la clave del grupo, no la del campo, para
    que siga cuadrando aunque cambie la ruta.
  - `ubicacion` (bloque D) ya **no es un grupo**: es una sola pregunta tipo `'ubicacion'` con
    país (selector de siempre, Venezuela por defecto), ciudad y zona. **La ciudad es un campo
    de texto libre con "Caracas" precargado** (no hay botón "Elegir de la lista"): si el
    cliente quiere otra, borra y escribe la suya; al enfocar el campo se selecciona todo el
    texto para que sea un solo gesto reemplazarlo. Si cambia de país, la ciudad se vacía.
  - `pregunta` y `preguntaPantalla` pueden ser funciones de las respuestas: así el enunciado de
    marca y el de redes cambian según `perfil_tipo` (empresa vs. persona).
  - **No existe una pregunta de `formato`** (fotos/video/ambos): se deduce de `cantidad_fotos` y
    `cantidad_videos` solo para el mensaje de WhatsApp. No se puede avanzar si ambos quedan en
    "Ninguna"/"Ninguno".
  - `showIf` decide la ruta; si cambias una respuesta anterior, las preguntas hijas que ya no
    aplican —y las respuestas cuya opción desapareció— se borran solas. Barra de progreso y
    contador "Pregunta X de Y" sobre las pantallas de **tu** ruta.
  - Botón "‹" para volver y "editar" en cada línea del resumen. **Sin escape temprano:** el
    enlace "Ya quiero enviar lo que llevo" se quitó a propósito, no lo vuelvas a poner.
  - Las respuestas viven solo en memoria (objeto `respuestas`), no se guardan en el navegador.
  - **El mensaje que se envía por WhatsApp es un párrafo natural, no una lista de campos**
    (función `mensaje()`): se arma como si el cliente se lo escribiera a Jara con sus propias
    palabras — "Hola, mi nombre es X. Te escribo en representación de..., Se trata de...,
    Esto es lo que tengo en mente: "...". Para cerrar, la sesión sería el... en...". Solo entran
    frases de lo que sí se respondió, nunca una línea de precio. La pantalla de resumen
    **muestra este mismo párrafo** bajo el encabezado "Así se lo escribiré a Jara" (bloque
    `.wa-res-msg`/`.wa-res-parrafo`), además de la lista de campos con "editar" de siempre —
    el cliente ve exactamente lo que se va a enviar antes de tocar "Enviar por WhatsApp". Si el
    perfil es `Modelo`, el párrafo solo menciona su Instagram/TikTok, no una "marca".
  - La intro dice **"unas 10 preguntas rápidas para preparar tu cotización"** (frase corta,
    sin mencionar que Jara "no preguntará nada más" — sonaba brusco).
  - Tras enviar, una burbuja breve confirma que Jara responde por WhatsApp; no se pide nada más.
  Foto de perfil: logo "Jara" completo, pequeño (no recortar). Fondo del chat: dibujos
  propios estilo WhatsApp (SVG), no la imagen de WhatsApp (es de Meta). Verde del chat:
  `#075E54` (el oscuro del principio; probamos el del icono y un punto medio y no
  gustaron, no los vuelvas a proponer); el botón "Enviar por WhatsApp" y el flotante sí
  llevan el verde oficial `#25D366`. El mensaje de
  WhatsApp lleva los títulos en negrita (`*Título:*`).
  Cada tarjeta es un `<form>` de verdad con `autocomplete` (`name`, `tel-national`, `email`)
  para que Safari y Chrome puedan autorrellenar; la tecla Intro equivale a "Continuar".
- **El chat solo se abre al pulsar un botón** (nunca solo al abrir el link): botón del hero,
  botón flotante `.wa-fab` y botones "Cotiza" del portafolio. Estos llevan
  `href="index.html" data-abrir-chat` y dejan un aviso de una vez en `sessionStorage`
  (`jara-abrir-chat`) que la portada consume. No volver a usar `index.html#form`.
  Al volver con "atrás" el chat se cierra.
- **El `<form id="briefForm">` sigue en la página, oculto (`<div hidden>`)**: ya no guarda las
  respuestas, pero el chat **usa sus selectores** (calendario `#fechaTrigger`, listas de país y
  ciudad con `abrirSheet`, prefijo `#prefijoPais`). No lo borres.

### 4.1 Agente con IA (opcional, añadido 16-09-2026)

El dueño quiere que el chat "se sienta vivo": que tras cada respuesta, el Agente de Jara
demuestre que la leyó y la entendió antes de pasar a la siguiente pregunta — sin que la IA
invente ni reordene preguntas, eso lo sigue decidiendo por completo el árbol `PREGUNTAS[]`.

**Por qué no es tan simple como llamar a Gemini desde `index.html`:** el sitio es HTML estático
en GitHub Pages, sin servidor propio. Cualquiera puede ver el código fuente, así que una llave
de API puesta ahí quedaría pública y cualquiera podría gastarla a nombre de Jara. La solución es
un pequeño servidor intermediario (gratis) que guarda la llave en privado: el navegador le
habla a ese servidor, nunca a Google directamente.

**Piezas del sistema:**
- **`agente-ia/worker-agente-jara.js`** — el código del servidor intermediario, para pegar en un
  Cloudflare Worker (Cloudflare tiene panel web, no hace falta Node ni ninguna terminal — ver
  [[jara-site-constraints]], esta máquina no tiene Node instalado). Recibe
  `{nombre, contexto, preguntaAnteriorTexto, respuestaCliente}`, le pide a Gemini
  (`gemini-2.5-flash-lite`, barato y rápido) una frase corta y cálida, y devuelve
  `{reconocimiento: "..."}`. Si algo falla (llave inválida, cuota agotada, error de red) responde
  `{reconocimiento: ""}` — nunca un error — para que el sitio jamás se rompa por esto.
- **`index.html`, constante `AI_ENDPOINT`** (junto a `WHATSAPP_NUMBER`, script de la cabecera) —
  la URL del Worker ya desplegado. **Mientras esté vacía (`""`), el chat funciona exactamente
  igual que sin IA**: cero llamadas de red, cero costo, cero riesgo. Esa es la palanca para
  apagar todo el sistema sin tocar nada más: basta con vaciar esta constante.
- **`index.html`, funciones `reconocer()` / `contextoParaIA()`** (dentro del motor del chat,
  junto a `avanzar()`) — arman la solicitud y aplican un límite de 2.5s: si el Worker no
  responde a tiempo, o falla, o `AI_ENDPOINT` está vacío, sencillamente no hay frase y se pasa a
  la siguiente pregunta como si la IA no existiera. La frase de la IA se muestra como un mensaje
  más del bot (misma animación "escribiendo…" de siempre) **antes** de la burbuja de la
  siguiente pregunta. No se pide reconocimiento justo después del bloque de contacto.
- **Privacidad:** `contextoParaIA()` solo manda un puñado de campos ya no sensibles (perfil,
  marca, rubro, ocasión, tipo de producción) y el primer nombre — nunca teléfono ni correo.

**Para desplegar el Worker (lo hace el dueño, son cuentas suyas — Claude no puede crearlas):**
1. Conseguir una llave gratis de Gemini en <https://aistudio.google.com/apikey> (cuenta de
   Google, un clic en "Create API key").
2. Crear una cuenta gratis en <https://dash.cloudflare.com> si no tiene una.
3. Ahí: **Workers & Pages → Create → Workers** (dale un nombre, ej. `agente-jara`) → se abre un
   editor de código → borrar el ejemplo y pegar el contenido completo de
   `agente-ia/worker-agente-jara.js` → **Deploy**.
4. **Settings → Variables and Secrets → Add** → tipo **Secret**, nombre `GEMINI_API_KEY`, valor
   la llave del paso 1 → guardar (esto vuelve a desplegar el Worker con la llave ya dentro, sin
   que quede visible en el panel).
5. Copiar la URL que Cloudflare le asigna al Worker (algo como
   `https://agente-jara.<usuario>.workers.dev`) y pegarla como valor de `AI_ENDPOINT` en
   `index.html`. Listo — no hace falta tocar nada más.

**Si el sitio cambia de dominio o de URL de GitHub Pages**, hay que actualizar también
`ORIGEN_PERMITIDO` dentro de `worker-agente-jara.js` (y volver a pegar/desplegar), o el Worker
rechazará las llamadas del navegador por CORS.

**Límite conocido:** restringir por origen (CORS) evita que otras páginas usen el Worker desde
un navegador, pero no evita que alguien lo llame directo (con `curl`, por ejemplo) si averigua la
URL. El límite real de gasto lo pone la cuenta de Google: mientras se use el nivel gratis de
Gemini no hay cobro, pero si algún día se pasa a un plan de pago vale la pena poner una alerta de
presupuesto baja en Google Cloud como red de seguridad.

## 5. Limitaciones del entorno (esto te ahorra tiempo)

- Windows 11. Hay **PowerShell** y **Git Bash**. **No hay Python ni Node/npm.**
- Para ver el sitio en local hay que levantar un servidor con un script de
  PowerShell (`System.Net.HttpListener`) en el puerto 8765. No uses `python -m http.server`.
- **La herramienta Read falla con `index.html` y `portafolio.html`** porque tienen
  líneas gigantes de base64. Para leer tramos usa
  `[System.IO.File]::ReadAllLines($ruta)` desde PowerShell, o la herramienta Grep.
- El panel del navegador siempre mide ~360–375 px de ancho: **no se puede
  comprobar visualmente el diseño de escritorio**, solo el móvil.
- En ese navegador de pruebas **el scroll por JavaScript no funciona**
  (`scrollIntoView`, `scrollTo`) ni se animan los scroll suaves. Solo se mueve con
  scroll real. Si un scroll no se mueve en la prueba, **no es un fallo del código**:
  no pierdas tiempo depurándolo, avísame para que lo compruebe en mi teléfono.

## 6. Arreglos ya hechos — NO los rompas

1. **Visor en iPhone:** `.lb` usa `height:100svh` + `overflow:hidden`. Sin eso, la
   barra de Safari empujaba la foto fuera de la pantalla y las imágenes se solapaban.
2. **Zoom raro al hacer scroll en Chrome de Android**, corregido por tres vías:
   - `.hero` de la landing usa `min-height:100svh` (con `100vh` el collage se re-recortaba).
   - El hover que amplía las fotos está limitado a ratón:
     `@media (hover:hover) and (pointer:fine)`. En Android el dedo apoyado lo activaba.
   - `layout()` solo se recalcula cuando cambia el **ancho** de la ventana, no cuando
     Chrome esconde/muestra su barra.
3. **Cabecera en móvil:** sin "Based in Venezuela" (`.top-bar-loc{display:none}`),
   logo a `height:27px`, `.top-bar` en `position:static`, padding lateral `3vw`.
4. **Cabecera en escritorio:** `.top-bar-text{text-align:center}` para que el texto
   quede centrado.
5. **Botones del hero en móvil:** `.btn-hero{padding:13px 20px}` y
   `.hero-actions a.btn-hero` más fino que el botón principal.
6. **Bandera de Venezuela:** es un **SVG incrustado** (data URI) en `.series-flag`,
   no un emoji. Los emoji de bandera no se dibujan en Windows. Las 8 estrellas
   forman un arco **hacia arriba** (∩). Hace de separador:
   `Maluma [bandera] 2024`, sin puntos.
7. **Botón flotante de WhatsApp** (`.wa-fab`): logo oficial (bocadillo verde en degradado
   con borde blanco y sombra), sin círculo verde de fondo. En los dos archivos.
8. **Logo de TikTok** (cabecera y pie, los dos archivos): SVG redondo incrustado en base64
   (círculo negro + nota blanca con sombras cian/rosa). No usar el PNG cuadrado.
9. **Barras de Safari:** Safari las tiñe con el fondo de `html`/`body`. En los dos archivos
   `html` es `#111110` (blanco en Blanco total), `body` transparente y el fondo va en
   `body::before`. No lo cambies.
10. **Portada del portafolio:** el fundido hacia el fondo es `.p-hero::after` (curva suave, sin línea).
11. **Portada de la landing:** el collage se funde con `.hero::after` y el pie va **sin** `border-top`:
    ese borde era la línea negra que se veía al final del degradado.
12. **Chat y el autorrelleno de Safari:** `ajustar()` nunca usa un alto menor de 260 px, las
    medidas se recolocan al entrar y salir de cada campo (`focusin`/`focusout`, `resize`,
    `orientationchange`) y una tarjeta ya terminada ignora nuevos envíos. Sin esto, al
    autorrellenar, el chat se quedaba a medias.
13. **Interruptor de la hora:** en las paletas claras la regla gris solo se aplica cuando
    está apagado (`:not([aria-checked="true"])`), para que al activarlo se ponga verde.

## 7. Cosas que ya probamos y NO quiero repetir

- ✅ **Paletas** en **las dos páginas y sincronizadas** (misma elección en portada y
  portafolio: `localStorage` `jara-paleta`, se repasa con los eventos `storage` y
  `pageshow`): **Oscuro** (predeterminado), **Blanco/Negro** (fondo blanco, cabecera
  oscura) y **Blanco total** (`data-theme="total"`: todo blanco, logo invertido a negro).
  **Predeterminado temporal: Blanco total** mientras el cliente prueba (cuando no hay nada
  guardado). En la portada la zona de fotos conserva sus colores; la cabecera y el pie
  cambian. El calendario y las listas de país/ciudad también siguen la paleta.
  Botones flotantes abajo a la derecha (subirlos a media pantalla no gustó), **WhatsApp
  arriba y el de paleta debajo**, del mismo tamaño: portada 80 y 16 px; portafolio 128 y
  66 px, encima del de "volver arriba".
- ❌ **Pregunta "¿Cómo prefieres verlo?"** al entrar → quitada dos veces (última 16-09-2026).
- ❌ **Paleta Beige** y **modo Transparente** (cabecera sobre las fotos) → quitados.
- ❌ **Menú desplegable de subcategorías en la barra de categorías** (al pasar el
  cursor o al tocar) → no me gustó, se revirtió.
- ✅ **Los títulos grandes de cada categoría** (CONCIERTOS, RETRATOS…) **se quedan.**
  Una vez los quitamos y los volví a pedir.

## 8. Pendientes / a tener en cuenta

- **Punto de retorno (16-09-2026):** el formulario largo por bloques A–I
  (`PROMPT_FORMULARIO_JARA.md`, guardado en el repo) se construyó sobre el commit `7a586ae`.
  Quedó demasiado largo (rutas de 35+ pantallas). Se recortó a 20 preguntas / 17 pantallas con
  `PROMPT_FORMULARIO_JARA_V3.md` y después a las **9-11 pantallas actuales** con
  `PROMPT_FORMULARIO_JARA_V4.md` (los tres prompts están guardados en el repo). Si hiciera
  falta volver atrás, cada uno describe entera su versión.
- El formulario ya no pregunta la ciudad base de Jara ni el traslado: si la sesión es fuera de
  su ciudad, se ve en `ubicacion` y se conversa por WhatsApp.

- **Botón verde "Cotiza tu sesión por WhatsApp"**: ya está puesto en el `.p-cta` del
  portafolio (sustituyó a "¿Trabajamos juntos?" y a "Cotiza Ya Su Sesión"; queda ese botón
  y "Página principal"). Su CSS `.chat-cta-btn` está en los dos archivos y en la portada
  sigue guardado por si lo pido en otro sitio.
- La parte de abajo de la portada (antes "EMPECEMOS") está pendiente de rehacer.
- El número de WhatsApp de la encuesta está en `index.html`, variable
  `WHATSAPP_NUMBER = "584129071347"`. Falta que yo lo confirme.
- `portafolio-beige2.html` ya no sirve (era la prueba del modo claro). Se puede borrar.
- "Otros artistas" no lleva fecha ni bandera, a propósito.
- Las fotos de Campañas todavía tienen "Estudio" por dentro
  (`data-ser="Campañas · Estudio"` y en los textos `alt`), aunque el título ya no se muestra.
- En `FOTOGRAFIAS/Jara - Retratos(limpio)/` las carpetas ya se llaman
  `AMBIENTADOS` y `EN ESTUDIO`. Esa carpeta está fuera del repositorio y no sube a GitHub.
