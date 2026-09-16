# PROMPT PARA CLAUDE CODE — Formulario de Jara (v4 · versión final)

> Este archivo **reemplaza por completo** a cualquier versión anterior (v2, v3). Ignora prompts previos.
> Ponlo en la raíz del repo y ejecuta:
> `Lee PROMPT_FORMULARIO_JARA_V4.md y ejecútalo completo.`

---

## 1. QUÉ HAY QUE HACER

El formulario conversacional del sitio de **Jara** (fotógrafo y cineasta en Venezuela) ya está construido: el motor declarativo de preguntas (array `PREGUNTAS[]` con `showIf`, avance automático, barra de progreso, botón atrás, resumen final y armado del mensaje de WhatsApp) **ya existe y funciona bien**.

Esta versión **simplifica aún más** la anterior: fusiona pantallas, elimina un bloque completo y ajusta textos para que se sientan naturales según quién responde. Tu tarea es:

1. **Reemplazar el contenido del array `PREGUNTAS[]`** por las entradas definidas en la sección 3.
2. **Eliminar** el bloque de Alcance completo (modalidad, apoyo_equipo) y todo rastro de una pregunta de "por dónde prefieres que te contactemos".
3. **Implementar los textos dinámicos** descritos (la pregunta de redes sociales y la de cantidad cambian de enunciado según respuestas previas).
4. **Ajustar el mensaje de WhatsApp** al formato de la sección 5.
5. **Actualizar el texto de introducción** del formulario según la sección 6.

Conserva intactos: el diseño visual, las animaciones tipo chat, el botón atrás, la validación, la pantalla de resumen y el número de WhatsApp que ya está en el código.

---

## 2. CAMBIOS RESPECTO A LA VERSIÓN ANTERIOR (resumen para ti, no lo copies al código)

| # | Cambio |
|---|---|
| 1 | Se elimina la pregunta de preferencia de contacto (WhatsApp/Llamada/Correo), si quedó en el código. |
| 2 | En "quién eres", se fusionan las opciones `Marca personal` e `Influencer o creador` en una sola: `Marca personal o creador de contenido`. |
| 3 | Se elimina el bloque 5 (Alcance) por completo. Después del bloque 4 va directo al resumen y envío. |
| 4 | La ciudad tiene `Caracas` como valor por defecto. |
| 5 | Si el perfil es `Modelo`, no se pregunta nombre de marca/empresa (ya se sabe su nombre real del bloque de contacto). Solo se le pide su usuario de redes. |
| 6 | Las opciones de ocasión para `Persona natural` cambian a: Boda, Embarazo, Graduación, 15 años, Sesión fotográfica, Otro. |
| 7 | La pregunta de Instagram/TikTok cambia de enunciado según si es la cuenta personal del cliente o la de su empresa. |
| 8 | Nombre de marca/empresa y usuario de redes se agrupan en una sola pantalla. |
| 9 | La opción `Empresa o negocio` pasa a llamarse `Empresa o Agencia`. |
| 10 | Formato (fotos/video/ambos) y cantidad se fusionan en una sola pantalla: "¿cuántas fotografías y cuántos videos necesitas?", con un selector de cantidad para cada uno. |
| 11 | El bloque de logística (antes bloque 4) se agrupa al máximo y se elimina la pregunta de qué tan flexible es la fecha. |
| 12 | La pantalla de introducción le dice al cliente que le harán 15 preguntas para preparar su cotización. |

---

## 3. EL ARRAY COMPLETO

---

### BLOQUE 1 — Contacto (3 campos, UNA sola pantalla)

| id | tipo | pregunta | etiquetaWA |
|---|---|---|---|
| `nombre` | text | ¿Cómo te llamas? | Nombre |
| `telefono` | tel | ¿Tu teléfono? *(selector de país, VE +58 por defecto)* | Teléfono |
| `correo` | email | ¿Tu correo? | Correo |

**No debe existir ninguna pregunta de preferencia de contacto.** Si el código actual la tiene, elimínala junto con cualquier lógica asociada.

---

### BLOQUE 2 — Quién eres

**2.1 · `perfil_tipo`** — select, requerida, siempre visible, bifurca
*¿Cómo te describes?*
`Persona natural` · `Empresa o Agencia` · `Marca personal o creador de contenido` · `Modelo`

> Nota: antes eran 5 opciones con `Marca personal` e `Influencer o creador` separadas. Ahora son **4 opciones**, fusionadas en `Marca personal o creador de contenido`.

→ etiquetaWA: `Perfil`

**2.2 · `marca_nombre`** — text, `showIf: perfil_tipo === 'Empresa o Agencia' || perfil_tipo === 'Marca personal o creador de contenido'`
Enunciado dinámico según `perfil_tipo`:
- si `Empresa o Agencia` → *¿Cómo se llama tu empresa o agencia?*
- si `Marca personal o creador de contenido` → *¿Cómo se llama tu marca? (o tu nombre, si trabajas bajo tu propio nombre)*

**No se muestra si el perfil es `Modelo`** — ya se conoce su nombre real por el bloque de contacto, y una modelo no necesariamente tiene marca o empresa.
**No se muestra si el perfil es `Persona natural`.**

→ etiquetaWA: `Marca`

**2.3 · `redes`** — text, opcional, `showIf: perfil_tipo !== 'Persona natural'`
Enunciado dinámico según `perfil_tipo`:
- si `Empresa o Agencia` → *¿Cuál es el Instagram o TikTok de tu empresa?*
- si `Marca personal o creador de contenido` → *¿Cuál es tu Instagram o TikTok?*
- si `Modelo` → *¿Cuál es tu Instagram o TikTok?*

placeholder: `@tuusuario`
ayuda: *Ver el perfil me ahorra media conversación entendiendo tu estilo.*
→ etiquetaWA: `Redes`

**Implementación de pantalla:** `marca_nombre` y `redes` se muestran **juntos en una sola pantalla** cuando ambos aplican (Empresa o Agencia / Marca personal o creador). Cuando el perfil es `Modelo`, esa misma pantalla contiene únicamente el campo de redes.

**2.4 · `empresa_rubro`** — select, `showIf: perfil_tipo === 'Empresa o Agencia'`
*¿En qué rubro estás?*
`Moda o ropa` · `Gastronomía` · `Belleza o estética` · `Joyería o accesorios` · `Inmobiliaria` · `Salud` · `Tecnología` · `Educación` · `Eventos` · `Otro`
→ etiquetaWA: `Rubro`

**2.5 · `natural_ocasion`** — select, `showIf: perfil_tipo === 'Persona natural'`
*¿Cuál es la ocasión?*
`Boda` · `Embarazo` · `Graduación` · `15 años` · `Sesión fotográfica` · `Otro`
→ etiquetaWA: `Ocasión`

**Rutas de pantallas del bloque 2:**
- `Persona natural` → 2.1 + 2.5 = **2 pantallas**
- `Empresa o Agencia` → 2.1 + (2.2+2.3 juntos) + 2.4 = **3 pantallas**
- `Marca personal o creador de contenido` → 2.1 + (2.2+2.3 juntos) = **2 pantallas**
- `Modelo` → 2.1 + (solo 2.3) = **2 pantallas**

---

### BLOQUE 3 — Qué necesitas

**3.1 · `produccion_tipo`** — select, requerida, siempre visible, bifurca
*¿Qué tipo de producción buscas?*
`Contenido comercial o publicitario` · `Evento, curso o lanzamiento` · `Retrato personal o video de presentación` · `Contenido para reels o TikToks` · `Otro`
→ etiquetaWA: `Producción`

**3.2 · `cantidad_fotos` + `cantidad_videos`** — dos selectores, requeridos, **en una sola pantalla**
*¿Cuántas fotografías y cuántos videos necesitas?*

Selector de fotografías:
`Ninguna` · `5 a 10` · `11 a 25` · `26 a 50` · `Más de 50` · `No sé, que lo proponga Jara`

Selector de videos:
`Ninguno` · `1` · `2 a 3` · `4 a 6` · `Más de 6` · `No sé, que lo proponga Jara`

**Validación:** no se puede enviar la pantalla si ambos selectores quedan en `Ninguna` / `Ninguno` al mismo tiempo. Mostrar un aviso breve pidiendo elegir al menos uno.

> Esta pantalla **reemplaza** a las antiguas preguntas separadas de "formato" (fotos/video/ambos) y "cantidad". Ya no existe un campo `formato` independiente: derívalo internamente a partir de estas dos respuestas solo para armar el mensaje de WhatsApp (ver sección 5).

→ etiquetaWA: `Fotografías` y `Videos` (dos líneas o una combinada, ver sección 5)

**3.3 · `evento_horas`** — select, `showIf: produccion_tipo === 'Evento, curso o lanzamiento'`
*¿Cuántas horas de cobertura necesitas?*
`1 a 2 horas` · `3 a 4 horas` · `5 a 8 horas` · `Más de 8 horas` · `Varios días`
→ etiquetaWA: `Cobertura`

**3.4 · `brief_libre`** — textarea, requerida, siempre visible ← **la pregunta más importante del formulario**
*Cuéntame con tus palabras qué tienes en mente.*
placeholder: `Ej: quiero fotos para lanzar mi colección de verano, estilo natural y luminoso. Si tienes referencias, pega el enlace aquí.`
ayuda: *Mientras más me cuentes aquí, menos te voy a preguntar después.*
→ etiquetaWA: `Lo que tiene en mente`

**Rutas de pantallas del bloque 3:**
- Sin evento → 3.1 + 3.2 + 3.4 = **3 pantallas**
- Con evento → 3.1 + 3.2 + 3.3 + 3.4 = **4 pantallas**

---

### BLOQUE 4 — Dónde y cuándo (agrupado al máximo)

Bloque simplificado: de 5 pantallas pasa a **3**. Se elimina `fecha_flexibilidad` por innecesaria (la urgencia real ya la captura la entrega).

**4.1 · `fecha_estimada`** — fecha, requerida
*¿Qué fecha tienes en mente?*
*(conserva el selector de calendario que ya existe)*
→ etiquetaWA: `Fecha`

**4.2 · `ubicacion` + `entorno`** — pantalla compuesta, requerida, TODO en una sola pantalla
*¿Dónde sería la sesión?*
- `ubicacion_pais` (select, **Venezuela** por defecto)
- `ubicacion_ciudad` (select o text, **Caracas** por defecto)
- `ubicacion_lugar` (text, opcional) — placeholder: `Zona o nombre del lugar`
- `entorno` (select, en la misma pantalla) — *¿En qué entorno?* → `Estudio` · `Exteriores` · `En mi local o casa` · `No sé, que lo proponga Jara`
→ etiquetaWA: `Lugar` y `Entorno`

**4.3 · `deadline_entrega`** — select, requerida
*¿Para cuándo necesitas el material listo?*
`Mismo día` · `En 48 horas` · `En una semana` · `En dos semanas` · `Sin apuro`
→ etiquetaWA: `Entrega`

**Después de 4.3, el formulario pasa directo a la pantalla de resumen y envío.** No hay bloque 5.

---

## 4. RUTAS RESULTANTES (verifica estos conteos)

| Perfil | B1 | B2 | B3 (sin evento) | B3 (con evento) | B4 | Total mínimo | Total máximo |
|---|---|---|---|---|---|---|---|
| Persona natural | 1 | 2 | 3 | 4 | 3 | **9** | 10 |
| Empresa o Agencia | 1 | 3 | 3 | 4 | 3 | **10** | 11 |
| Marca personal / creador | 1 | 2 | 3 | 4 | 3 | **9** | 10 |
| Modelo | 1 | 2 | 3 | 4 | 3 | **9** | 10 |

Ninguna ruta debe superar **11 pantallas**. Si alguna las supera al terminar, avísame antes de entregar.

---

## 5. MENSAJE DE WHATSAPP

Mismo mecanismo que ya existe (`https://wa.me/<numero>?text=<encodeURIComponent(mensaje)>`). **Solo incluye campos respondidos**, sin líneas vacías ni "N/A".

**Derivación del formato para el mensaje:** a partir de `cantidad_fotos` y `cantidad_videos`, arma internamente una línea de "Formato": si `cantidad_fotos !== 'Ninguna'` y `cantidad_videos === 'Ninguno'` → "Solo fotos"; si es al revés → "Solo video"; si ambos tienen valor → "Fotos y video".

```
*NUEVA SOLICITUD — vía web*

*Contacto*
María Pérez · +58 412 555 1234
maria@correo.com

*Quién es*
Empresa o Agencia: Studio Lina (Moda o ropa)
Instagram/TikTok de la empresa: @studiolina

*Qué necesita*
Contenido comercial · Fotos y video
Fotografías: 26 a 50 · Videos: 2 a 3

"Quiero fotos para lanzar mi colección de verano,
estilo natural y luminoso. Referencias:
pinterest.com/xxxx"

*Cuándo y dónde*
20/10/2026
Caracas, Venezuela — Los Palos Grandes
Entorno: estudio
Entrega: en una semana
```

Reglas:
- El `brief_libre` va **entre comillas y en su propio párrafo**, separado del resto. Es lo primero que Jara debe leer después del nombre.
- Encabezados de bloque en negrita de WhatsApp (`*Texto*`).
- Si el perfil es `Modelo`, el bloque "Quién es" solo muestra la línea de Instagram/TikTok (no hay línea de marca).
- Datos cortos del mismo bloque se juntan en una línea con `·`.
- No debe aparecer ninguna línea de presupuesto, precio, ni de las preguntas eliminadas (alcance, preferencia de contacto, flexibilidad de fecha).

---

## 6. PANTALLA DE INTRODUCCIÓN

Antes de la primera pregunta, el formulario debe mostrar un mensaje breve indicando que se harán **15 preguntas** para preparar la cotización. Ejemplo de tono (ajústalo al estilo del sitio):

> *Voy a hacerte unas 15 preguntas rápidas para armarte una propuesta a la medida. Así Jara no tiene que preguntarte nada más por WhatsApp — solo confirmar y cotizar.*

Mantén el mismo estilo visual y tono cercano del resto del formulario.

---

## 7. AJUSTES DE INTERFAZ

1. **Barra de progreso**: muéstrala como texto además de la barra — `Pregunta X de Y`. La `Y` se calcula sobre la ruta real del usuario.
2. **Opción "No sé, que lo proponga Jara"**: consérvala en `cantidad_fotos`, `cantidad_videos` y `entorno`. En el resto, fuera.
3. **La pantalla del `brief_libre`** debe sentirse distinta: textarea grande, sin prisa, con el texto de ayuda visible.
4. **Resumen final**: se mantiene, con botón editar por campo. Debe reflejar la nueva estructura (sin bloque de alcance, con las preguntas fusionadas).
5. **Cierre**: después de enviar, muestra un mensaje breve confirmando que Jara responde por WhatsApp.

---

## 8. CRITERIOS DE ACEPTACIÓN

- [ ] No existe ninguna pregunta de preferencia de contacto en ninguna parte del código.
- [ ] `perfil_tipo` tiene exactamente 4 opciones (Persona natural, Empresa o Agencia, Marca personal o creador de contenido, Modelo).
- [ ] No existe el bloque de Alcance (`modalidad`, `apoyo_equipo`) en ninguna parte del código.
- [ ] `ubicacion_ciudad` tiene `Caracas` precargado por defecto.
- [ ] Si `perfil_tipo === 'Modelo'`, la pantalla de marca/redes muestra únicamente el campo de redes, con el enunciado personal.
- [ ] `natural_ocasion` tiene exactamente estas 6 opciones: Boda, Embarazo, Graduación, 15 años, Sesión fotográfica, Otro.
- [ ] El enunciado de la pregunta de redes cambia correctamente según `perfil_tipo`.
- [ ] `marca_nombre` y `redes` aparecen en una sola pantalla cuando ambos aplican.
- [ ] `cantidad_fotos` y `cantidad_videos` aparecen juntos en una sola pantalla, y no se puede avanzar si ambos quedan en "Ninguna"/"Ninguno".
- [ ] El bloque 4 tiene exactamente 3 pantallas para todos los usuarios (fecha, ubicación+entorno, entrega), sin pregunta de flexibilidad de fecha.
- [ ] Después del bloque 4 se pasa directo al resumen — no hay una quinta sección de preguntas.
- [ ] La pantalla de introducción menciona 15 preguntas.
- [ ] Ninguna ruta posible supera 11 pantallas (verifica la tabla de la sección 4).
- [ ] El mensaje de WhatsApp no contiene ninguna línea de campo sin responder ni de las preguntas eliminadas.
- [ ] Diseño visual sin cambios respecto al actual. Funciona en Chrome móvil y Safari iOS, sin errores en consola, sin dependencias externas.

## 9. ENTREGA

Devuelve los archivos modificados **completos**, no fragmentos ni instrucciones de edición manual, más un resumen breve de qué cambiaste en cada archivo.
