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
| Landing (portada + encuesta a WhatsApp) | `index.html` |
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
7. **Botón flotante de WhatsApp** (`.wa-fab`) con el logo oficial, lleva a
   `index.html#form`. La landing recoloca el salto al terminar de cargar las fotos.

## 7. Cosas que ya probamos y NO quiero repetir

- ✅ **Paletas de muestra para el cliente** (reactivadas el 15-09-2026, solo en
  `portafolio.html`): al entrar pregunta "¿Cómo prefieres verlo?" con 3 opciones —
  **Oscuro** (predeterminado), **Beige** (870 V MADERA) y **Blanco** (cabecera oscura
  de siempre + fondo blanco). Se recuerda en el navegador (`localStorage` `jara-paleta`)
  y se cambia con el botón redondo **encima del de WhatsApp**, del mismo tamaño.
  Safari tiñe sus barras con el fondo de `html`/`body`: en **los dos archivos** `html` es `#111110`, `body` transparente y el fondo va en `body::before`. No lo cambies.
  El fundido de la portada del portafolio hacia el fondo es `.p-hero::after` (curva suave, sin línea).
- ❌ **Menú desplegable de subcategorías en la barra de categorías** (al pasar el
  cursor o al tocar) → no me gustó, se revirtió.
- ✅ **Los títulos grandes de cada categoría** (CONCIERTOS, RETRATOS…) **se quedan.**
  Una vez los quitamos y los volví a pedir.

## 8. Pendientes / a tener en cuenta

- El número de WhatsApp de la encuesta está en `index.html`, variable
  `WHATSAPP_NUMBER = "584129071347"`. Falta que yo lo confirme.
- `portafolio-beige2.html` ya no sirve (era la prueba del modo claro). Se puede borrar.
- "Otros artistas" no lleva fecha ni bandera, a propósito.
- Las fotos de Campañas todavía tienen "Estudio" por dentro
  (`data-ser="Campañas · Estudio"` y en los textos `alt`), aunque el título ya no se muestra.
- En `FOTOGRAFIAS/Jara - Retratos(limpio)/` las carpetas ya se llaman
  `AMBIENTADOS` y `EN ESTUDIO`. Esa carpeta está fuera del repositorio y no sube a GitHub.
