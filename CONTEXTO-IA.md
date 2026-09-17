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
- **Landing (16-09-2026):** solo `.top-bar` → `.hero` (logo + botones "Cotiza por WhatsApp"
  y "Ver portafolio") → `footer`, más el botón flotante de WhatsApp y el de
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
  con un **motor de preguntas ramificado (17-09-2026)**. Todo el cuestionario vive en el array
  `PREGUNTAS`, cada objeto es `{id, bloque, grupo, tipo, pregunta, ayuda, opciones, showIf, etiquetaWA}`.
  **Para añadir o cambiar una pregunta se edita ese array, nunca el HTML.**
  - **REGLA DE ORO DEL ÁRBOL (la más importante, se aprendió rompiéndola):** después de cada
    respuesta, pregúntate *qué preguntaría una persona de verdad justo después de oír eso*.
    Si la respuesta es categórica ("Agencia", "Empresa", "Marca personal"), lo natural es
    **primero saber de qué tipo es y después pedirle el nombre** — nunca al revés. Esto falló
    dos veces: primero con "Empresa o Agencia" fusionadas (la pregunta de rubro no le calzaba a
    una agencia), y después porque tras elegir "Agencia" se le pedía el nombre sin haber
    preguntado qué tipo de agencia era. Antes de dar por buena una rama, recórrela en voz alta
    como si fueras el cliente.
  - Las preguntas de opción única (`tipo:'select'`) se pintan como una **lista vertical de
    botones del mismo ancho** (clases `wa-opt-list`/`wa-opt`), todos alineados a la izquierda,
    en vez de los chips envueltos de antes (dejaban filas irregulares). Avanzan solas al tocar
    una opción, el resto lleva botón "Continuar".
  - **Orden de las opciones: de mayor a menor alcance/tamaño de proyecto**, siempre — es un
    criterio interno, el cliente nunca lo ve como tal, solo ve una lista prolija y consistente.
    Ejemplos ya aplicados: `perfil_tipo` → Agencia, Empresa, Marca personal o creador, Modelo,
    Persona natural. `natural_ocasion` → Boda, 15 años, Graduación, Embarazo, Sesión
    fotográfica, Otro. `evento_horas` → de la cantidad más alta a la más baja, con "No sé, que
    lo proponga Jara" siempre de último. Si se agrega una pregunta nueva con opciones, ordenarla
    con el mismo criterio.
  - **Dos preguntas de seguimiento agregadas el 17-09-2026 (bloque C):** `comercial_finalidad`
    ("¿Para qué necesitas ese contenido?", solo si `produccion_tipo` es "Contenido comercial o
    publicitario" — las demás opciones ya dicen su finalidad solas) y `material_formato`
    ("¿En qué formato necesitas el material?": redes sociales / impresión / ambos, siempre sale).
    Se agregaron porque el mensaje final sonaba incompleto sin saber para qué es el contenido
    comercial y en qué formato se entrega. Sus frases van en `COMERCIAL_FINALIDAD_FRASE` y
    `FORMATO_FRASE`.
  - **18-09-2026: se quitaron `cantidad_fotos`/`cantidad_videos` (pedían un número exacto de
    fotos y videos).** El dueño pidió ser flexible en entregables: comprometer al cliente a una
    cifra antes de hablar con Jara era demasiado rígido y casi nunca la sabe de antemano.
    `material_formato` ya cumplía el papel de "objetivo/uso del contenido" sin pedir un número,
    así que ahora es el conector directo tras `produccion_tipo`/`comercial_finalidad`. Las
    constantes `SIN_FOTOS`/`SIN_VIDEOS` y los mapas `FOTOS_FRASE`/`VIDEOS_FRASE` se borraron con
    ellas — no las vuelvas a crear sin que el dueño pida cantidades de nuevo.
  - Bloques: A contacto (los 3 datos juntos) · B quién es · C qué necesita · D cuándo y dónde.
    **No hay bloque de alcance, de presupuesto, de preferencia de contacto ni de entorno de la
    sesión, y no deben volver:** en este mercado preguntar por precio hace abandonar el
    formulario; `modalidad`/`apoyo_equipo` y "¿en qué entorno?" se probaron y se quitaron por
    alargar de más sin aportar algo que Jara no resuelva en un mensaje de WhatsApp.
  - **Cada rama de `perfil_tipo` tiene su pregunta de categoría, y va ANTES del nombre:**
    `agencia_tipo` (marketing/publicidad, inmobiliaria, automotriz, viajes, modelaje, eventos,
    otra) · `empresa_rubro` · `marca_dedica` (a qué se dedica) · `natural_ocasion`. Modelo es la
    única sin pregunta de categoría, a propósito: lo que Jara necesita saber de un modelo es qué
    produccción busca, y eso lo pregunta el bloque C justo después (con la opción **"Book o
    portafolio de modelo"**, que solo aparece para ese perfil).
  - **A una persona natural no se le pregunta `produccion_tipo`**: su ocasión ya dice qué es, y
    ofrecerle "contenido comercial o publicitario" suena fuera de lugar. Por eso `evento_horas`
    tiene una condición doble: sale por `produccion_tipo === 'Evento, curso o lanzamiento'` **o**
    porque la ocasión está en `OCASIONES_EVENTO` (boda, 15 años, graduación) — una boda también
    es un evento que hay que cubrir por horas.
  - Rutas: **7 a 10 pantallas**. Agencia/Empresa/Marca 9 (10 si es comercial o si hay evento),
    Modelo 8 (9 si es comercial), persona natural 7 (8 si su ocasión es un evento). Si una
    pregunta nueva pasa de 10, sobra.
  - Regla de oro para podar: si Jara puede resolverlo en una frase de WhatsApp con el lead ya
    caliente, no va en el formulario.
  - `brief_libre` (textarea grande, bloque C) es el corazón: sustituye a ~15 sub-preguntas de
    estilo, referencias, guion y edición. No recortarlo.
  - `grupo` junta varias entradas en una sola pantalla: `contacto` (nombre+teléfono+correo) y
    `marca` (nombre de marca + redes; si el perfil es Modelo queda solo redes). El historial
    guarda la clave del grupo, no la del campo, para que siga cuadrando aunque cambie la ruta.
  - `ubicacion` (bloque D) ya **no es un grupo**: es una sola pregunta tipo `'ubicacion'` con
    país (selector de siempre, Venezuela por defecto) y ciudad. **La ciudad es un campo
    de texto libre con "Caracas" precargado** (no hay botón "Elegir de la lista"): si el
    cliente quiere otra, borra y escribe la suya; al enfocar el campo se selecciona todo el
    texto para que sea un solo gesto reemplazarlo. Si cambia de país, la ciudad se vacía.
    **18-09-2026: se quitó el campo de zona/lugar específico** ("¿en qué zona de la ciudad?")
    — el dueño pidió variables más generales, esa precisión se conversa por WhatsApp. La
    pregunta ahora se llama "¿Cuál es tu ciudad base?" y la respuesta guarda solo
    `ubicacion_pais`/`ubicacion_ciudad` (`ubicacion_lugar` ya no existe).
  - `pregunta`, `preguntaPantalla` y `opciones` pueden ser funciones de las respuestas: así el
    enunciado de marca/redes cambia según `perfil_tipo` (agencia / empresa / marca) y las
    opciones de `produccion_tipo` cambian para el perfil Modelo.
  - **18-09-2026: `fecha_estimada` (calendario exacto) se reemplazó por `mes_estimado`**, un
    `tipo:'select'` cuyas `opciones` son una función que calcula los próximos 6 meses desde
    `new Date()` más "Todavía no tengo fecha en mente" al final. El dueño pidió no pedir fecha
    exacta — se afina por WhatsApp. Esto también dejó sin uso el calendario del `<form
    id="briefForm">` (`#fechaTrigger`/`#fechaValor`/`#dpDone`): ese código sigue ahí, inerte, no
    hace falta borrarlo.
  - **18-09-2026: se quitó `deadline_entrega`** ("¿para cuándo necesitas el material listo?",
    con `ENTREGA_FRASE`) — pedir un plazo de entrega exigido antes de hablar con Jara era
    demasiado rígido, se acuerda por WhatsApp. No la vuelvas a agregar sin que el dueño la pida.
  - `showIf` decide la ruta; si cambias una respuesta anterior, las preguntas hijas que ya no
    aplican —y las respuestas cuya opción desapareció— se borran solas. Barra de progreso y
    contador "Pregunta X de Y" sobre las pantallas de **tu** ruta.
  - Botón "‹" para volver, disponible solo **durante** las preguntas (en la pantalla final se
    oculta, ver más abajo). **Sin escape temprano:** el enlace "Ya quiero enviar lo que llevo"
    se quitó a propósito, no lo vuelvas a poner.
  - Las respuestas viven solo en memoria (objeto `respuestas`), no se guardan en el navegador.
  - **El mensaje que se envía por WhatsApp es un párrafo natural, no una lista de campos**
    (función `mensaje()`): se arma como si el cliente se lo escribiera a Jara con sus propias
    palabras — "Hola, mi nombre es X. Te escribo en representación de..., Estoy buscando...,
    Esto es lo que tengo en mente: "...". Para cerrar, la sesión sería en... en...". Solo entran
    frases de lo que sí se respondió, nunca una línea de precio. Si el perfil es `Modelo`, el
    párrafo solo menciona su Instagram/TikTok, no una "marca".
    **18-09-2026: ya no dice "Se trata de..."** — el dueño pidió que sonara más natural y en
    primera persona, ahora siempre dice **"Estoy buscando..."**, para cualquier `produccion_tipo`
    (antes solo para el comercial). Sigue mejorando esta redacción si algo suena impostado.
  - **El párrafo se escribe como hablaría una persona, no pegando valores crudos del
    formulario.** Hay mapas de redacción para eso: `AGENCIA_FRASE` ("agencia inmobiliaria", no
    "agencia de inmobiliaria"), `PRODUCCION_FRASE` ("estoy buscando **cobertura para un**
    evento", no "estoy buscando un evento" — sonaba a que busca ir a uno), `OCASION_FRASE`,
    `COMERCIAL_FINALIDAD_FRASE` y `FORMATO_FRASE`. **Si agregas una opción nueva a cualquiera de
    esas preguntas, agrégale su frase al mapa correspondiente** o saldrá el texto crudo en medio
    de la oración.
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
  respuestas. El chat sigue usando su prefijo `#prefijoPais` (código de país del teléfono) y la
  función `abrirSheet`/`PAISES` (lista de países del `ubicacion`). **18-09-2026: el calendario
  del form (`#fechaTrigger`/`#fechaValor`/`#dpDone`) ya NO lo usa el chat** — `fecha_estimada` se
  reemplazó por `mes_estimado` (un `select` normal). No borres el `<form>` de todos modos, por si
  hace falta algo más de sus selectores.

### 4.1 Agente con IA (en producción desde el 17-09-2026)

El dueño quiere que el chat "se sienta vivo": que tras CADA respuesta, sin excepción, el Agente
de Jara demuestre que la leyó y la entendió antes de pasar a la siguiente pregunta — sin que la
IA invente ni reordene preguntas, eso lo sigue decidiendo por completo el árbol `PREGUNTAS[]`.
**Ya está desplegado y funcionando en el sitio real**, no es opcional/apagado por defecto.

**Por qué no es tan simple como llamar a Gemini desde `index.html`:** el sitio es HTML estático
en GitHub Pages, sin servidor propio. Cualquiera puede ver el código fuente, así que una llave
de API puesta ahí quedaría pública y cualquiera podría gastarla a nombre de Jara. La solución es
un pequeño servidor intermediario (gratis) que guarda la llave en privado: el navegador le
habla a ese servidor, nunca a Google directamente.

**Piezas del sistema:**
- **`agente-ia/worker-agente-jara.js`** — el código del servidor intermediario, desplegado como
  Cloudflare Worker en `https://agente-jara.andresisazao09.workers.dev` (cuenta del dueño).
  Recibe `{nombre, contexto, preguntaAnteriorTexto, respuestaCliente}`, le pide a Gemini
  (**`gemini-3.5-flash-lite`** — `gemini-2.5-flash-lite` fue retirado por Google para cuentas
  nuevas el mismo 17-09-2026, el propio error de la API recomendó este reemplazo) una frase
  corta y cálida, y devuelve `{reconocimiento: "..."}`. Si algo falla (llave inválida, cuota
  agotada, error de red, modelo retirado otra vez) responde `{reconocimiento: ""}` — nunca un
  error — para que el sitio jamás se rompa por esto. La llave vive como *Secret* en
  Settings → Variables and Secrets del Worker, nunca en el repositorio.
- **`index.html`, constante `AI_ENDPOINT`** (junto a `WHATSAPP_NUMBER`, script de la cabecera) —
  ya apunta a la URL de arriba. Si algún día hay que apagar el sistema sin tocar nada más,
  basta con vaciarla (`""`) y el chat vuelve a funcionar exactamente igual que sin IA.
- **`index.html`, funciones `reconocer()` / `fraseGenerica()` / `preguntar()` / `avanzar()`**
  (motor del chat) — el saludo cálido y la pregunta se muestran **como un solo mensaje del bot**
  (una sola animación de "escribiendo…"), nunca como dos burbujas separadas. El límite es 2.5s:
  - Justo después del bloque de contacto: no se llama a la IA (no le mandamos teléfono ni
    correo); se usa un saludo con su nombre ("¡Mucho gusto, María!"), instantáneo, sin red.
  - En cualquier otra pregunta: se llama al Worker. Si responde a tiempo, se usa su frase. Si
    `AI_ENDPOINT` está vacío, la llamada falla o tarda más de 2.5s, se usa una frase genérica al
    azar de `FRASES_GENERICAS` ("¡Perfecto!", "Anotado.", etc.) — **nunca queda una pregunta
    pelada, sin saludo**, y el formulario nunca se traba esperando a la IA.
- **Privacidad:** `contextoParaIA()` solo manda un puñado de campos ya no sensibles (perfil,
  marca, rubro, ocasión, tipo de producción) y el primer nombre — nunca teléfono ni correo.

**Redeploy del Worker (cuentas del dueño — Claude no puede tocarlas ni ver la llave):**
1. Llave gratis de Gemini en <https://aistudio.google.com/apikey>.
2. Panel en <https://dash.cloudflare.com> → **Compute → Workers & Pages** (ojo: NO es "AI →
   Workers AI", eso es otro producto) → entrar al Worker `agente-jara` → **Edit code** (desde la
   página de Overview, no desde "Deployments" — esa vista queda de solo lectura).
3. Pegar el contenido de `agente-ia/worker-agente-jara.js` → **Deploy**.
4. La llave ya está puesta en Settings → Variables and Secrets → `GEMINI_API_KEY` (tipo Secret);
   no hace falta volver a ponerla salvo que se pierda o se rote.

**Si el sitio cambia de dominio o de URL de GitHub Pages**, hay que actualizar también
`ORIGEN_PERMITIDO` dentro de `worker-agente-jara.js` (y volver a pegar/desplegar), o el Worker
rechazará las llamadas del navegador por CORS.

**Límite conocido:** restringir por origen (CORS) evita que otras páginas usen el Worker desde
un navegador, pero no evita que alguien lo llame directo (con `curl`, por ejemplo) si averigua la
URL. El límite real de gasto lo pone la cuenta de Google: mientras se use el nivel gratis de
Gemini no hay cobro, pero si algún día se pasa a un plan de pago vale la pena poner una alerta de
presupuesto baja en Google Cloud como red de seguridad.

**Nota de depuración (17-09-2026):** el panel de navegador que usa Claude para probar el sitio no
logra conectarse a subdominios `*.workers.dev` recién creados (falla incluso sin CORS de por
medio), mientras que `curl` desde la terminal y los navegadores reales de los clientes sí
funcionan bien. Si en el futuro una prueba en ese panel muestra "Failed to fetch" hacia el
Worker, no es necesariamente un bug real — hay que confirmar con `curl` y/o pidiéndole al dueño
que pruebe en su propio navegador antes de asumir que algo se rompió. Ver [[jara-site-constraints]].

**Pantalla final (17-09-2026):** ya no se muestra la lista de campos con botones "editar" antes
de enviar — el dueño pidió quitarla porque le daba al cliente la oportunidad de quedarse
revisando/dudando justo antes de enviar, lo que le hacía perder clientes al fotógrafo. Ahora el
resumen muestra **directo** el mensaje en párrafo (función `mensaje()`) y los dos botones
(Enviar / Empezar de nuevo). El botón "‹" de volver también se oculta en esa pantalla — solo
sirve durante las preguntas, no al final.

**Las dos correcciones del árbol del 17-09-2026 (léelas antes de tocar `PREGUNTAS`):**

1. **"Empresa o Agencia" estaba fusionado en una sola opción.** Eso hacía que la pregunta de
   rubro (`empresa_rubro`, que solo tiene sentido para una empresa con un rubro propio)
   apareciera también para una agencia, que representa clientes de rubros distintos. Se
   separaron en `Agencia` y `Empresa`, y `empresa_rubro` ahora solo aplica a `Empresa`.
   *Regla:* antes de fusionar dos opciones, verificar que ninguna pregunta posterior dependa de
   una lectura específica de esa opción.
2. **Faltaba la pregunta obvia de seguimiento.** Tras responder "Agencia", el formulario pedía
   directamente el nombre y las redes — una conversación real primero pregunta *qué tipo* de
   agencia. Se agregó `agencia_tipo`, y por el mismo motivo `marca_dedica` para marca personal
   o creador; además se reordenó el bloque B para que la pregunta de categoría de cada rama vaya
   **antes** del nombre. En la misma revisión salieron: que a una persona natural no tenía
   sentido preguntarle `produccion_tipo` (su ocasión ya lo dice), que a un modelo no le existía
   la opción "Book o portafolio", y que las horas de cobertura no salían para una boda.
   *Regla (la de oro, arriba):* recorrer cada rama en voz alta como cliente antes de darla por
   buena. Quitar una pregunta que estorba no basta si lo que falta es **agregar** la que un
   humano haría.

## 5. Limitaciones del entorno (esto te ahorra tiempo)

- Windows 11. Hay **PowerShell** y **Git Bash**. **Python 3.12 está instalado** (en el PATH
  como `python`) — confirmado 17/18-09-2026. **Node/npm siguen sin instalar.**
- Para ver el sitio en local: `python -m http.server 8765` desde la carpeta del proyecto sirve
  el sitio bien (confirmado). Si por algo no está Python disponible, un script de PowerShell con
  `System.Net.HttpListener` en el mismo puerto es el respaldo.
- **La herramienta Read falla con `index.html` y `portafolio.html`** porque tienen
  líneas gigantes de base64. Para leer tramos usa Grep para ubicar la línea y luego Read con
  `offset`/`limit` acotado (evita el rango donde esté el base64), o
  `[System.IO.File]::ReadAllLines($ruta)` desde PowerShell.
- El panel del navegador de Claude por defecto no es de ancho fijo — con la herramienta de
  redimensionar (preset "mobile" 375×812, "desktop" o un tamaño a medida) sí se puede probar
  tanto móvil como escritorio visualmente (confirmado 18-09-2026). Si una sesión anterior dijo
  que solo se podía ver móvil, ya no es así — probar primero antes de asumir la limitación.
- En ese navegador de pruebas **el scroll por JavaScript no funciona**
  (`scrollIntoView`, `scrollTo`) ni se animan los scroll suaves. Solo se mueve con
  scroll real. Si un scroll no se mueve en la prueba, **no es un fallo del código**:
  no pierdas tiempo depurándolo, avísame para que lo compruebe en mi teléfono.

## 6. Arreglos ya hechos — NO los rompas

1. **Visor en iPhone:** `.lb` usa `height:100svh` + `overflow:hidden`. Sin eso, la
   barra de Safari empujaba la foto fuera de la pantalla y las imágenes se solapaban.
2. **Zoom raro al hacer scroll en Chrome de Android**, corregido por varias vías:
   - `.hero` de la landing y `.p-hero` del portafolio usan `min-height:100svh` (con `100vh`
     el collage se re-recortaba).
   - El hover que amplía las fotos está limitado a ratón:
     `@media (hover:hover) and (pointer:fine)`. En Android el dedo apoyado lo activaba.
   - `layout()` solo se recalcula cuando cambia el **ancho** de la ventana, no cuando
     Chrome esconde/muestra su barra.
   - **18-09-2026: el mismo zoom seguía pasando dentro de la app de Google** (su barra
     inferior propia no siempre respeta `svh`/`dvh`). Se agregó la variable `--vh-fija`,
     fijada por JS una sola vez al cargar con `window.innerHeight` y solo vuelta a fijar si
     cambia el **ancho** real (mismo criterio que `layout()`, nunca por alto). `.hero` y
     `.p-hero` la usan como último valor de `min-height` (con `100svh` de respaldo si el JS
     no llegó a correr). Mismo bloque de JS en los dos archivos, cerca del principio del
     `<script>` principal.
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
14. **Cabecera bajada ~20% (18-09-2026):** el logo y el texto de debajo quedaban muy pegados
    arriba y con mucho aire abajo. `.top-bar` pasó de `padding:16px 5vw` (escritorio) /
    `padding:12px 3vw 11px` (móvil) a `padding:21px 5vw 12px` / `padding:17px 3vw 6px` — mismo
    alto total de barra, solo se corrió el reparto arriba/abajo. Mismo valor en los dos
    archivos (en `portafolio.html` hay una segunda regla `.top-bar{padding:...}` dentro de
    `@media (max-width:760px)` más abajo en el archivo que también hay que tocar, o gana ella
    por venir después en la cascada).

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

- **Botón verde "Cotiza tu sesión por WhatsApp"** (`.chat-cta-btn`): ya está puesto en el
  `.p-cta` del portafolio (sustituyó a "¿Trabajamos juntos?" y a "Cotiza Ya Su Sesión"; queda
  ese botón y "Página principal"). Su CSS está en los dos archivos y en la portada sigue
  guardado por si lo pido en otro sitio. **No es el mismo botón que el de abajo.**
- **Botón "Cotiza por WhatsApp" sobre las fotos** (`.wa-cta-btn`, 18-09-2026): reemplazó el
  texto del botón principal del hero en `index.html` (antes "Cotiza Tu Sesión Fotográfica") y
  se agregó también en `portafolio.html` justo debajo del título "Portafolio". Dice "Cotiza
  por" + el logo de WhatsApp (el bocadillo monocromo, `fill="currentColor"`, no el oficial a
  color). **Blanco con letras/logo negro en la paleta Oscura (por defecto), negro con
  letras/logo blanco en Blanco/Negro y Blanco total** — mismo criterio de color que ya usaba
  `.btn-primary` en el resto del sitio (`background:var(--text)`), pero `.wa-cta-btn` no
  puede usar esa variable porque `.hero` la fija en oscuro a propósito (la zona de fotos no
  cambia con la paleta); en su lugar usa colores fijos con el selector `[data-theme]`
  directamente. **El dueño pidió NO usar verde por ahora** — no se lo vuelvas a poner sin que
  lo pida. Mismo CSS y mismo SVG en los dos archivos. Abre el chat igual que siempre
  (`#scrollToForm`/`abrirChat()` en la portada, `data-abrir-chat` en el portafolio).
- La parte de abajo de la portada (antes "EMPECEMOS") está pendiente de rehacer.
- El número de WhatsApp de la encuesta está en `index.html`, variable
  `WHATSAPP_NUMBER = "584129071347"`. Falta que yo lo confirme.
- `portafolio-beige2.html` ya no sirve (era la prueba del modo claro). Se puede borrar.
- "Otros artistas" no lleva fecha ni bandera, a propósito.
- Las fotos de Campañas todavía tienen "Estudio" por dentro
  (`data-ser="Campañas · Estudio"` y en los textos `alt`), aunque el título ya no se muestra.
- En `FOTOGRAFIAS/Jara - Retratos(limpio)/` las carpetas ya se llaman
  `AMBIENTADOS` y `EN ESTUDIO`. Esa carpeta está fuera del repositorio y no sube a GitHub.
