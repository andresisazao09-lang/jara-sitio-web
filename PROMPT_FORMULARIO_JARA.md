# PROMPT PARA CLAUDE CODE — Formulario conversacional progresivo (Jara)

> Copia este archivo completo dentro del repo del sitio y dile a Claude Code:
> `Lee PROMPT_FORMULARIO_JARA.md y ejecútalo completo.`

---

## 1. ROL Y OBJETIVO

Eres un desarrollador front-end trabajando sobre el sitio web de **Jara**, fotógrafo y cineasta en Venezuela (repo: `jara-sitio-web`).

Tu tarea es **reconstruir el formulario de cotización** que ya existe en `index.html`, convirtiéndolo en un formulario conversacional **progresivo y ramificado**: una sola pregunta a la vez, estilo chat de WhatsApp, donde **cada respuesta determina cuáles son las siguientes preguntas**, avanzando siempre de lo más general a lo más específico.

El resultado final se envía como un **mensaje de texto estructurado por WhatsApp** al número del fotógrafo, de modo que Jara reciba un brief prácticamente completo sin tener que preguntar nada por chat.

---

## 2. CONTEXTO DEL PROYECTO

- Sitio estático alojado en GitHub Pages.
- Archivos relevantes: `index.html`, `portafolio.html`, `/img/landing/`, más el CSS y JS que ya existan.
- El formulario actual ya es multipaso y ya envía por WhatsApp. **Hay que reemplazar su lógica interna, no el diseño visual.**
- Número de WhatsApp de destino: el que ya está en el código actual (`+58 412-907-1347`). **No lo cambies ni lo inventes: extráelo del código existente.**
- Idioma de toda la interfaz: español de Venezuela, tono cercano y directo, tuteo.

---

## 3. REGLAS TÉCNICAS (obligatorias)

1. **Vanilla HTML + CSS + JavaScript.** Sin React, sin frameworks, sin dependencias externas, sin build step. Debe funcionar abriendo el archivo directamente.
2. **Conserva el diseño visual actual**: tipografías, colores, espaciados, animaciones y estética general del sitio. Solo cambia la estructura y la lógica del formulario.
3. **Mobile first.** La mayoría de los usuarios entran desde Instagram o TikTok en celular. Nada de scroll horizontal, botones mínimo 44px de alto, inputs que no hagan zoom en iOS (`font-size: 16px` mínimo).
4. **Sin backend.** Todo el estado vive en memoria (un objeto JS). No uses `localStorage` ni `sessionStorage`.
5. **Accesibilidad básica:** cada input con su `<label>`, navegación con teclado funcional, `aria-live` en el contenedor de preguntas para que los lectores de pantalla anuncien la pregunta nueva.
6. Código comentado en español, con nombres de variables descriptivos.

---

## 4. ARQUITECTURA REQUERIDA: MOTOR DE PREGUNTAS DECLARATIVO

**No escribas los pasos a mano en el HTML.** Construye un motor genérico:

```js
// Cada pregunta es un objeto dentro de un array PREGUNTAS[]
{
  id: 'perfil_rubro',              // identificador único
  bloque: 'B',                     // bloque temático (para la barra de progreso)
  tipo: 'select',                  // text | tel | email | select | multi | fecha | hora | rango | textarea
  pregunta: '¿En qué rubro está tu empresa?',
  ayuda: 'Esto me ayuda a preparar referencias visuales de tu sector.',
  opciones: ['Moda o ropa', 'Gastronomía', ...],
  requerida: true,
  permiteNoSe: false,              // agrega la opción "No sé / que lo proponga Jara"
  showIf: (r) => r.perfil_tipo === 'Empresa',   // condición para mostrarla
  etiquetaWA: 'Rubro'              // cómo se llama este dato en el mensaje de WhatsApp
}
```

El motor debe:

- Recorrer `PREGUNTAS[]` y mostrar **solo la siguiente pregunta cuyo `showIf` devuelva `true`** según las respuestas acumuladas.
- Guardar todo en un objeto `respuestas = {}`.
- Recalcular la ruta **cada vez** que el usuario responde (si cambia una respuesta anterior, las preguntas hijas que ya no aplican se descartan del objeto `respuestas`).
- Permitir volver atrás con un botón "←" que restaure la pregunta anterior **con su respuesta ya cargada**.

Esto es lo más importante del encargo: agregar una pregunta nueva en el futuro debe ser editar el array, nunca tocar el HTML.

---

## 5. ÁRBOL COMPLETO DE PREGUNTAS

El **BLOQUE A (paso 1)** ya existe y se conserva tal cual. Lo que sigue es lo nuevo, del bloque B en adelante.

### BLOQUE A — Contacto (ya existe, solo agregar A4)

| id | tipo | pregunta | condición |
|---|---|---|---|
| `nombre` | text | ¿Cómo te llamas? | siempre |
| `telefono` | tel | ¿Cuál es tu teléfono? (con selector de país, VE +58 por defecto) | siempre |
| `correo` | email | ¿Tu correo? | siempre |
| `contacto_pref` | select | ¿Por dónde prefieres que te responda? → WhatsApp / Llamada / Correo | siempre |

---

### BLOQUE B — Perfil: ¿quién eres?

**B1 · `perfil_tipo`** (select, requerida) — *¿Cómo te describes?*
`Persona natural` · `Empresa o negocio` · `Marca personal` · `Influencer o creador de contenido` · `Modelo` · `Otro`

#### Rama B1 = Empresa o negocio
- **`empresa_nombre`** (text) — *¿Cómo se llama tu empresa?*
- **`empresa_rubro`** (select) — *¿En qué rubro está?*
  `Moda o ropa` · `Gastronomía` · `Belleza o estética` · `Salud` · `Inmobiliaria` · `Tecnología` · `Educación` · `Eventos` · `Joyería o accesorios` · `Otro`
  - si `Moda o ropa` → **`rubro_moda_que`** (multi) — *¿Qué vamos a fotografiar?* `Prendas` · `Calzado` · `Accesorios` · `Colección completa` · `Lookbook de temporada`
  - si `Gastronomía` → **`rubro_food_que`** (multi) — *¿Qué necesitas mostrar?* `Platos` · `Bebidas o cócteles` · `El local o ambiente` · `El equipo cocinando` · `Menú completo`
  - si `Belleza o estética` → **`rubro_belleza_que`** (multi) — *¿Qué vamos a mostrar?* `Resultados antes/después` · `Productos` · `El espacio` · `Procedimientos en acción`
  - si `Inmobiliaria` → **`rubro_inmo_que`** (select) — *¿Qué tipo de inmueble?* `Apartamento` · `Casa` · `Local comercial` · `Terreno` · `Varios inmuebles`
  - si `Joyería o accesorios` → **`rubro_joya_piezas`** (select) — *¿Cuántas piezas aproximadamente?* `1 a 10` · `11 a 30` · `31 a 80` · `Más de 80`
- **`empresa_marca_nivel`** (select) — *¿Qué tan definida está tu identidad visual?*
  `Tengo manual de marca completo` · `Tengo logo y colores` · `Solo tengo logo` · `Todavía nada definido`
  - si tiene manual o logo → **`empresa_marca_link`** (text, opcional) — *Pásame el enlace o dime dónde lo veo.*

#### Rama B1 = Influencer o creador de contenido
- **`influencer_nicho`** (select) — *¿Cuál es tu nicho?* `Lifestyle` · `Moda` · `Fitness` · `Gastronomía` · `Viajes` · `Belleza` · `Humor o entretenimiento` · `Educativo` · `Otro`
- **`influencer_plataforma`** (select) — *¿Cuál es tu plataforma principal?* `Instagram` · `TikTok` · `YouTube` · `Varias por igual`
- **`influencer_alcance`** (select) — *¿En qué rango está tu comunidad?* `Menos de 5K` · `5K a 20K` · `20K a 100K` · `Más de 100K`
- **`influencer_marca_deal`** (select) — *¿Este contenido es para una marca que te contrató?* `Sí, es contenido pagado` · `No, es para mi perfil`
  - si `Sí` → **`influencer_marca_nombre`** (text) — *¿Qué marca?* y **`influencer_marca_exige`** (textarea) — *¿La marca pide algo específico? (formato, duración, entregables)*

#### Rama B1 = Marca personal
- **`personal_a_que`** (text) — *¿A qué te dedicas?*
- **`personal_vende`** (select) — *¿Qué ofreces?* `Un servicio` · `Un producto` · `Ambos` · `Todavía estoy construyendo la marca`
- **`personal_redes`** (text) — *¿Tu usuario de Instagram o TikTok?* (placeholder: `@tuusuario`)

#### Rama B1 = Modelo
- **`modelo_objetivo`** (select) — *¿Qué necesitas?* `Book nuevo desde cero` · `Actualizar mi book` · `Fotos para un casting específico` · `Material para redes`
- **`modelo_representacion`** (select) — *¿Trabajas con agencia?* `Sí` · `No, soy independiente`
- **`modelo_experiencia`** (select) — *¿Has hecho sesiones antes?* `Es mi primera vez` · `He hecho algunas` · `Trabajo en esto seguido`

#### Rama B1 = Persona natural
- **`natural_ocasion`** (select) — *¿Cuál es la ocasión?* `Cumpleaños` · `Aniversario o pareja` · `Embarazo` · `Graduación` · `Familia` · `Solo porque quiero buenas fotos` · `Otra`
- **`natural_para_quien`** (select) — *¿Es para ti o para alguien más?* `Para mí` · `Para regalar` · `Para un grupo o familia`

#### Rama B1 = Otro
- **`perfil_otro_detalle`** (textarea) — *Cuéntame en una línea quién eres.*

---

### BLOQUE C — Objetivo: ¿qué necesitas y para qué?

**C1 · `produccion_tipo`** (select, requerida) — *¿Qué tipo de producción buscas?*
`Contenido comercial o publicitario` · `Evento, curso o lanzamiento` · `Retrato personal o video de presentación` · `Contenido orgánico para reels o TikToks` · `Otro`

#### Rama C1 = Contenido comercial o publicitario
- **`comercial_uso`** (multi) — *¿Dónde vas a usar este material?* `Redes sociales` · `Pauta publicitaria` · `Página web o tienda online` · `Catálogo` · `Material impreso` · `Presentaciones o propuestas`
  - si incluye `Pauta publicitaria` → **`comercial_pauta_plataforma`** (multi) — *¿En qué plataformas pautas?* `Meta (IG/FB)` · `TikTok` · `Google/YouTube` · `Otra`
  - si incluye `Página web o tienda online` → **`comercial_ecommerce`** (select) — *¿Necesitas fondo blanco tipo catálogo?* `Sí, fondo blanco` · `No, fotos de ambiente` · `Ambas cosas`
- **`comercial_sujeto`** (select) — *¿Qué protagoniza las imágenes?* `Solo el producto` · `Producto con modelo` · `Solo personas` · `El espacio o local` · `Mezcla de todo`
  - si incluye modelo o personas → **`modelo_quien`** (select) — *¿Quién va a posar?* `Yo` · `Alguien de mi equipo` · `Ya tengo modelo contratado` · `Necesito que Jara consiga modelo`
    - si `Necesito que Jara consiga modelo` → **`modelo_perfil`** (textarea) — *¿Qué perfil de modelo buscas? (edad, género, estilo)* y **`modelo_cantidad`** (select) `1` · `2` · `3 o más`
- **`comercial_logistica_producto`** (select, solo si el sujeto incluye producto) — *¿Cómo llega el producto a la sesión?* `Lo llevo yo` · `Lo envío antes` · `Se fotografía en mi local` · `Es un servicio, no hay producto físico`

#### Rama C1 = Evento, curso o lanzamiento
- **`evento_tipo`** (select) — *¿Qué tipo de evento es?* `Lanzamiento de producto o marca` · `Curso, taller o conferencia` · `Fiesta o celebración` · `Boda` · `Evento corporativo` · `Concierto o show` · `Otro`
- **`evento_nombre`** (text) — *¿Cómo se llama el evento?*
- **`evento_duracion`** (select) — *¿Cuántas horas necesitas cobertura?* `1 a 2 horas` · `3 a 4 horas` · `5 a 8 horas` · `Más de 8 horas` · `Varios días`
- **`evento_asistentes`** (select) — *¿Cuánta gente asiste aproximadamente?* `Menos de 20` · `20 a 50` · `50 a 150` · `Más de 150`
- **`evento_cobertura`** (select) — *¿Qué alcance necesitas?* `Cobertura completa del evento` · `Solo momentos clave` · `Solo el montaje y detalles` · `Retratos a los asistentes`
- **`evento_entrega_rapida`** (select) — *¿Necesitas material el mismo día?* `Sí, para publicar en vivo` · `No, puedo esperar la entrega normal`
- **`evento_speakers`** (select, solo si es curso/conferencia/corporativo) — *¿Hay ponentes que requieran retrato aparte?* `Sí` · `No`

#### Rama C1 = Retrato personal o video de presentación
- **`retrato_formato`** (select) — *¿Qué necesitas?* `Solo fotos` · `Solo video` · `Fotos y video`
- **`retrato_uso`** (multi) — *¿Para qué lo vas a usar?* `LinkedIn o perfil profesional` · `Web personal` · `Prensa o medios` · `Redes sociales` · `Uso personal`
- **`retrato_vestuarios`** (select) — *¿Cuántos cambios de vestuario tienes en mente?* `1` · `2` · `3` · `4 o más` · `No sé, que me orienten`
- **`retrato_video_tipo`** (select, solo si incluye video) — *¿Qué tipo de video?* `Hablando a cámara` · `Video de estilo documental` · `Solo imágenes con música` · `Entrevista`
  - si `Hablando a cámara` o `Entrevista` → **`retrato_guion`** (select) — *¿Tienes el guion listo?* `Sí, ya lo tengo` · `Tengo las ideas, falta ordenarlas` · `Necesito ayuda para escribirlo`
  - si `Hablando a cámara` o `Entrevista` → **`retrato_teleprompter`** (select) — *¿Necesitas teleprompter?* `Sí` · `No` · `No sé qué es`

#### Rama C1 = Contenido orgánico para reels o TikToks
- **`organico_cantidad`** (select) — *¿Cuántas piezas necesitas?* `1 a 3` · `4 a 8` · `9 a 15` · `Más de 15`
- **`organico_frecuencia`** (select) — *¿Es algo puntual o recurrente?* `Una sola vez` · `Mensual` · `Quincenal` · `Semanal`
  - si es recurrente → **`organico_meses`** (select) — *¿Por cuántos meses?* `1 a 3` · `4 a 6` · `Más de 6` · `Indefinido`
- **`organico_idea`** (select) — *¿Ya tienes las ideas de los videos?* `Sí, tengo el guion o concepto` · `Tengo ideas sueltas` · `Necesito que me propongan el concepto`
- **`organico_edicion`** (multi) — *¿Qué necesitas en la edición?* `Cortes dinámicos` · `Subtítulos` · `Música` · `Efectos o transiciones` · `Texto en pantalla` · `Solo el material crudo`

#### Rama C1 = Otro
- **`produccion_otro`** (textarea) — *Descríbeme qué necesitas.*

**C-final · `objetivo_negocio`** (select, siempre) — *¿Qué quieres lograr con este material?*
`Vender más` · `Posicionar la marca` · `Lanzar algo nuevo` · `Crecer en redes` · `Tener material profesional guardado` · `Uso personal`

---

### BLOQUE D — Entregables

- **`entregable_formato`** (select, salta si ya se definió en C) — *¿Necesitas foto, video o ambos?* `Solo fotos` · `Solo video` · `Fotos y video`
- **`entregable_fotos_cant`** (select, solo si hay fotos) — *¿Cuántas fotos editadas necesitas?* `5 a 10` · `11 a 25` · `26 a 50` · `Más de 50` · `No sé, que lo proponga Jara`
- **`entregable_video_duracion`** (select, solo si hay video) — *¿De qué duración es el video final?* `Menos de 30 seg` · `30 a 60 seg` · `1 a 3 min` · `3 a 10 min` · `Más de 10 min`
- **`entregable_video_piezas`** (select, solo si hay video) — *¿Cuántas piezas de video?* `1` · `2 a 3` · `4 a 6` · `Más de 6`
- **`entregable_relaciones`** (multi, solo si hay video) — *¿En qué formato lo necesitas?* `Vertical 9:16 (reels/TikTok)` · `Horizontal 16:9 (YouTube/web)` · `Cuadrado 1:1` · `No sé, que lo decida Jara`
- **`entregable_retoque`** (select, solo si hay fotos) — *¿Qué nivel de retoque necesitas?* `Básico (color y luz)` · `Medio (piel y detalles)` · `Alto (retoque editorial)` · `No sé`
- **`entregable_raw`** (select) — *¿Necesitas los archivos originales sin editar?* `Sí` · `No` · `No sé qué significa eso`
- **`entregable_extras`** (multi, opcional) — *¿Algo adicional?* `Miniaturas para YouTube` · `Versiones para historias` · `Diseño de piezas para feed` · `Nada más`

---

### BLOQUE E — Producción

- **`entorno`** (select) — *¿Dónde imaginas la sesión?* `Estudio` · `Exteriores` · `Mi local o casa` · `Ambos` · `No sé, que lo proponga Jara`
  - si `Estudio` → **`estudio_disponible`** (select) — *¿Tienes estudio o hace falta conseguirlo?* `Ya tengo estudio` · `Necesito que Jara lo consiga`
  - si `Exteriores` → **`exterior_locacion`** (select) — *¿Tienes la locación en mente?* `Sí, ya sé dónde` · `Tengo una idea pero acepto sugerencias` · `Necesito propuesta completa`
    - si `Sí, ya sé dónde` → **`exterior_cual`** (text) — *¿Cuál es?*
  - si `Mi local o casa` → **`local_condiciones`** (select) — *¿Cómo es la luz del lugar?* `Muy iluminado` · `Luz media` · `Oscuro, hace falta iluminación` · `No sé`
- **`personas_camara`** (select) — *¿Cuántas personas aparecerán frente a cámara?* `Ninguna, solo producto o espacio` · `1` · `2 a 4` · `5 a 10` · `Más de 10`
- **`maquillaje`** (select, solo si hay personas) — *¿Necesitas maquillaje y peinado?* `Sí, que lo incluya Jara` · `Ya tengo maquillador` · `No hace falta` · `No sé`
- **`styling`** (select, solo si hay personas) — *¿Necesitas asesoría de vestuario o dirección de arte?* `Sí` · `No, ya tengo todo resuelto` · `No sé`
- **`utileria`** (select) — *¿Hace falta utilería, escenografía o ambientación?* `Sí, lo necesito` · `Ya tengo lo mío` · `No hace falta` · `No sé`
- **`dron`** (select) — *¿Necesitas tomas aéreas con dron?* `Sí` · `No` · `No sé si aplica`
- **`permisos`** (select, solo si entorno es Exteriores) — *¿El lugar requiere permiso para grabar?* `Sí y ya lo tengo` · `Sí pero falta gestionarlo` · `No requiere` · `No sé`

---

### BLOQUE F — Estilo y referencias

- **`estilo_visual`** (multi) — *¿Qué estilo te gusta más?* `Natural y luminoso` · `Editorial de moda` · `Cinematográfico y oscuro` · `Minimalista y limpio` · `Colorido y pop` · `Vintage o analógico` · `No sé, confío en la propuesta de Jara`
- **`referencias_tiene`** (select) — *¿Tienes referencias visuales?* `Sí, tengo enlaces` · `Tengo ideas pero no imágenes` · `No, quiero que Jara proponga`
  - si `Sí, tengo enlaces` → **`referencias_link`** (textarea) — *Pega los enlaces (Pinterest, Instagram, Drive…)*
  - si `Tengo ideas pero no imágenes` → **`referencias_texto`** (textarea) — *Descríbeme lo que tienes en la cabeza.*
- **`colores_obligatorios`** (select) — *¿Hay colores o elementos de marca que deban aparecer sí o sí?* `Sí` · `No`
  - si `Sí` → **`colores_detalle`** (textarea) — *¿Cuáles?*
- **`restricciones`** (textarea, opcional) — *¿Hay algo que definitivamente NO quieres que aparezca o se vea?*

---

### BLOQUE G — Logística

- **`fecha_estimada`** (fecha) — *¿Qué fecha tienes en mente?* (ya existe el selector, consérvalo)
- **`fecha_flexibilidad`** (select) — *¿Qué tan fija es esa fecha?* `Es fija, no se mueve` · `Tengo margen de unos días` · `Soy flexible` · `Lo antes posible`
- **`hora_preferida`** (select) — *¿Qué horario prefieres?* `Mañana` · `Mediodía` · `Tarde` · `Atardecer (golden hour)` · `Noche` · `Me da igual`
- **`duracion_sesion`** (select) — *¿Cuánto tiempo calculas que dure la sesión?* `1 a 2 horas` · `Medio día` · `Día completo` · `Varios días` · `No sé, que lo estime Jara`
- **`ubicacion_pais` / `ubicacion_ciudad` / `ubicacion_lugar`** — ya existen, consérvalos
- **`traslado`** (select, solo si la ciudad es distinta a la base de Jara) — *¿La sesión requiere que Jara se traslade fuera de la ciudad?* `Sí` · `No`
  - si `Sí` → **`traslado_gastos`** (select) — *¿Cómo manejamos traslado y hospedaje?* `Lo cubro yo` · `Inclúyelo en la cotización` · `Conversémoslo`
- **`deadline_entrega`** (select) — *¿Para cuándo necesitas el material listo?* `Mismo día` · `En 48 horas` · `En una semana` · `En dos semanas` · `Sin apuro`

---

### BLOQUE H — Presupuesto y decisión

- **`presupuesto_rango`** (select, requerida) — *¿Cuál es tu presupuesto estimado para este proyecto? (USD)*
  `Menos de $100` · `$100 a $300` · `$300 a $600` · `$600 a $1.200` · `Más de $1.200` · `Prefiero que me coticen primero`
  - Texto de ayuda: *Ser honesto aquí hace que la propuesta te llegue ajustada a lo que puedes invertir, sin vueltas.*
- **`etapa_decision`** (select) — *¿En qué etapa estás?* `Estoy comparando opciones` · `Ya decidí, solo falta cuadrar fecha` · `Estoy explorando para más adelante`
- **`quien_decide`** (select, solo si `perfil_tipo` = Empresa) — *¿Quién aprueba la contratación?* `Yo mismo` · `Mi socio o jefe` · `El área de marketing` · `Un comité`
- **`pago_modalidad`** (select, opcional) — *¿Cómo te queda mejor pagar?* `Transferencia` · `Efectivo` · `Pago móvil` · `Zelle o internacional` · `Lo conversamos`

---

### BLOQUE I — Cierre

- **`comentario_libre`** (textarea, opcional) — *¿Algo más que Jara deba saber antes de armarte la propuesta?*
- **`como_llego`** (select) — *Última cosa: ¿cómo llegaste hasta aquí?* `Instagram` · `TikTok` · `Me lo recomendaron` · `Google` · `Ya conocía a Jara` · `Otro`
- **`horario_contacto`** (select) — *¿En qué horario te escribo?* `Mañana` · `Tarde` · `Noche` · `Cualquier hora`

---

## 6. REGLAS DE COMPORTAMIENTO DEL FORMULARIO

1. **Una pregunta por pantalla.** Excepción: el bloque A (nombre, teléfono, correo) puede mantenerse agrupado como está hoy.
2. **Animación de entrada tipo chat**: la pregunta aparece como burbuja del lado de Jara; la respuesta seleccionada queda visible como burbuja del lado del usuario, arriba. El historial de la conversación se mantiene visible haciendo scroll hacia arriba.
3. **Avance automático** al seleccionar en preguntas de tipo `select` (sin botón "siguiente"). En `text`, `textarea` y `multi`, sí hay botón.
4. **Barra de progreso dinámica**: calcula el porcentaje sobre las preguntas que realmente aplican a la ruta actual del usuario, no sobre el total del array. Debe recalcularse cuando la ruta cambia.
5. **Botón "No sé / Que lo proponga Jara"** disponible en toda pregunta con `permiteNoSe: true`. Se registra como respuesta válida, no como vacío.
6. **Escape temprano:** a partir del bloque E, muestra de forma discreta un enlace "Ya quiero enviar lo que llevo". Al pulsarlo, arma el mensaje con lo respondido hasta ese punto y abre WhatsApp. No debe ser un botón prominente, pero tiene que existir.
7. **Botón atrás** siempre visible, que restaura la pregunta anterior con su valor cargado.
8. **Validación suave:** correo y teléfono validados con regex; si algo falla, mensaje amable en la misma burbuja, sin alertas del navegador.
9. **Pantalla de resumen antes de enviar:** lista todas las respuestas agrupadas por bloque, cada una con un botón "editar" que devuelve a esa pregunta específica. Debajo, el botón "Enviar por WhatsApp".

---

## 7. MENSAJE DE WHATSAPP

Al enviar, construye un mensaje de texto plano y ábrelo con `https://wa.me/<numero>?text=<encodeURIComponent(mensaje)>`.

Reglas del mensaje:

- **Solo incluye campos respondidos.** Nada de "N/A", "no especificado" ni líneas vacías.
- Agrupa por bloque con encabezados en negrita de WhatsApp (`*Texto*`).
- Usa el campo `etiquetaWA` de cada pregunta como nombre del dato, no el `id`.
- Separa bloques con una línea en blanco.
- Las respuestas múltiples se unen con coma.

Formato objetivo:

```
*NUEVA SOLICITUD DE COTIZACIÓN*

*Contacto*
Nombre: María Pérez
Teléfono: +58 412 555 1234
Correo: maria@correo.com
Prefiere: WhatsApp (tarde)

*Perfil*
Tipo: Empresa · Rubro: Moda o ropa
Empresa: Studio Lina
A fotografiar: Prendas, Accesorios
Identidad visual: Tengo logo y colores

*Proyecto*
Producción: Contenido comercial
Uso: Redes sociales, Tienda online
Protagonista: Producto con modelo
Modelo: Necesita que Jara consiga (1, femenina 20-25, estilo urbano)
Objetivo: Vender más

*Entregables*
Formato: Fotos y video
Fotos: 26 a 50 · Retoque: Medio
Video: 30-60 seg, 2 piezas, vertical 9:16
Archivos RAW: No

*Producción*
Entorno: Estudio (necesita que Jara lo consiga)
Personas frente a cámara: 1
Maquillaje: Sí, que lo incluya Jara
Dron: No

*Estilo*
Estilo: Editorial de moda, Minimalista
Referencias: pinterest.com/xxxx
Colores obligatorios: negro y dorado

*Logística*
Fecha: 20/10/2026 (flexible) · Atardecer
Duración: Medio día
Lugar: Venezuela, Caracas — Los Palos Grandes
Entrega: En una semana

*Presupuesto y decisión*
Presupuesto: $300 a $600
Etapa: Ya decidió, falta cuadrar fecha
Aprueba: Yo mismo

*Notas*
"Es para el lanzamiento de la colección de verano."
Llegó por: Instagram
```

---

## 8. CRITERIOS DE ACEPTACIÓN

Antes de dar la tarea por terminada, verifica:

- [ ] Agregar una pregunta nueva solo requiere añadir un objeto al array `PREGUNTAS[]`.
- [ ] Responder "Empresa" y responder "Modelo" producen rutas visiblemente distintas.
- [ ] Cambiar una respuesta hacia atrás elimina del objeto `respuestas` las preguntas hijas que ya no aplican.
- [ ] La barra de progreso nunca retrocede de forma ilógica ni pasa de 100%.
- [ ] El mensaje de WhatsApp no contiene ninguna línea de un campo sin responder.
- [ ] Todo funciona en Chrome móvil y Safari iOS sin scroll horizontal.
- [ ] El diseño visual es indistinguible del sitio actual.
- [ ] No hay dependencias externas ni errores en consola.

## 9. ENTREGA

Devuelve los archivos modificados completos (no fragmentos ni instrucciones de edición manual) y un resumen breve de qué cambiaste en cada uno.
