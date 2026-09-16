# PROMPT PARA CLAUDE CODE — Formulario de Jara (v3 · versión final)

> Este archivo **reemplaza por completo** al v2. Ignora cualquier prompt anterior.
> Ponlo en la raíz del repo y ejecuta:
> `Lee PROMPT_FORMULARIO_JARA_V3.md y ejecútalo completo.`

---

## 1. QUÉ HAY QUE HACER

El formulario conversacional del sitio de **Jara** (fotógrafo y cineasta en Venezuela) ya está construido y funciona, pero quedó **demasiado largo**: algunas rutas superan las 35 pantallas y el usuario abandona.

**No lo reconstruyas desde cero.** El motor declarativo de preguntas (el array `PREGUNTAS[]` con `showIf`, el avance automático, la barra de progreso, el botón atrás, el resumen final y el armado del mensaje de WhatsApp) **ya existe y funciona bien**. Tu tarea es:

1. **Reemplazar el contenido del array `PREGUNTAS[]`** por las 20 entradas que se definen abajo.
2. **Eliminar del código toda pregunta que ya no aparece en esta lista**, incluyendo sus ramas condicionales huérfanas y cualquier CSS o JS que quede sin uso.
3. **Ajustar el armado del mensaje de WhatsApp** al formato de la sección 5.
4. **Verificar** que ninguna ruta posible supere las **17 pantallas**.

Conserva intactos: el diseño visual, las animaciones tipo chat, el botón atrás, la validación, la pantalla de resumen y el número de WhatsApp que ya está en el código.

---

## 2. CRITERIO DE RECORTE

Se elimina, sin excepción, toda pregunta que caiga en alguna de estas categorías:

| Categoría | Ejemplos que salen |
|---|---|
| El cliente no sabe responderla | archivos RAW, relación de aspecto, nivel de retoque, teleprompter, permisos de locación |
| Es trabajo del fotógrafo, no del cliente | duración de la sesión, utilería, dirección de arte, condiciones de luz, cantidad de vestuarios |
| Solo importa con el trato ya cerrado | modalidad de pago, quién aprueba, viáticos y traslado, gestión de permisos |
| **Espanta al cliente en este mercado** | **cualquier pregunta sobre presupuesto o rango de precios** |
| Dato de marketing que cuesta conversión | cómo llegó al sitio, horario de contacto, experiencia previa, tamaño de comunidad |
| Drill-down de tercer nivel | qué fotografiar por rubro, cuántas piezas, cómo llega el producto, perfil del modelo, guion, edición detallada |

**Nota importante sobre el presupuesto:** en este mercado preguntar por rangos de precio hace que la gente abandone el formulario; prefieren preguntarle el precio directamente al fotógrafo. Por eso **no debe existir ninguna pregunta de presupuesto**. Su función de filtro la cumple el BLOQUE 5 (Alcance), que pregunta por modalidad de servicio en vez de por dinero.

**Regla de oro para cualquier duda futura:** si Jara puede resolverlo en una sola frase de WhatsApp una vez que el lead ya está caliente, no va en el formulario.

---

## 3. EL ARRAY COMPLETO: 20 ENTRADAS

---

### BLOQUE 1 — Contacto (3 campos, UNA sola pantalla)

Se mantiene como está hoy: los tres campos juntos en una pantalla, no uno por pantalla.

| id | tipo | pregunta | etiquetaWA |
|---|---|---|---|
| `nombre` | text | ¿Cómo te llamas? | Nombre |
| `telefono` | tel | ¿Tu teléfono? *(selector de país, VE +58 por defecto)* | Teléfono |
| `correo` | email | ¿Tu correo? | Correo |

---

### BLOQUE 2 — Quién eres (5 definidas · el usuario ve 2 a 4)

**2.1 · `perfil_tipo`** — select, requerida, siempre visible
*¿Cómo te describes?*
`Persona natural` · `Empresa o negocio` · `Marca personal` · `Influencer o creador` · `Modelo`
→ etiquetaWA: `Perfil`

**2.2 · `marca_nombre`** — text, `showIf: perfil_tipo !== 'Persona natural'`
*¿Cómo se llama tu marca o empresa?*
→ etiquetaWA: `Marca`

**2.3 · `redes`** — text, opcional, `showIf: perfil_tipo !== 'Persona natural'`
*¿Tu usuario de Instagram o TikTok?*
placeholder: `@tuusuario`
ayuda: *Ver tu perfil me ahorra media conversación entendiendo tu estilo.*
→ etiquetaWA: `Redes`

**2.4 · `empresa_rubro`** — select, `showIf: perfil_tipo === 'Empresa o negocio'`
*¿En qué rubro estás?*
`Moda o ropa` · `Gastronomía` · `Belleza o estética` · `Joyería o accesorios` · `Inmobiliaria` · `Salud` · `Tecnología` · `Educación` · `Eventos` · `Otro`
→ etiquetaWA: `Rubro`

**2.5 · `natural_ocasion`** — select, `showIf: perfil_tipo === 'Persona natural'`
*¿Cuál es la ocasión?*
`Cumpleaños` · `Pareja o aniversario` · `Embarazo` · `Graduación` · `Familia` · `Solo quiero buenas fotos` · `Otra`
→ etiquetaWA: `Ocasión`

> Las ramas `Marca personal`, `Influencer o creador` y `Modelo` **no llevan sub-pregunta propia**. Con el nombre de la marca y el perfil de redes, Jara ya tiene lo que necesita.

---

### BLOQUE 3 — Qué necesitas (5 definidas · el usuario ve 4 o 5)

**3.1 · `produccion_tipo`** — select, requerida, siempre visible
*¿Qué tipo de producción buscas?*
`Contenido comercial o publicitario` · `Evento, curso o lanzamiento` · `Retrato personal o video de presentación` · `Contenido para reels o TikToks` · `Otro`
→ etiquetaWA: `Producción`

**3.2 · `formato`** — select, requerida, siempre visible
*¿Necesitas fotos, video o ambos?*
`Solo fotos` · `Solo video` · `Fotos y video`
→ etiquetaWA: `Formato`

**3.3 · `cantidad`** — select, requerida, siempre visible, con enunciado y opciones **dinámicos según `formato`**:
- si `Solo fotos` → *¿Cuántas fotos editadas necesitas?* → `5 a 10` · `11 a 25` · `26 a 50` · `Más de 50` · `No sé, que lo proponga Jara`
- si `Solo video` → *¿Cuántas piezas de video?* → `1` · `2 a 3` · `4 a 6` · `Más de 6` · `No sé, que lo proponga Jara`
- si `Fotos y video` → *¿Qué volumen calculas?* → `Poco (pocas fotos y 1 video)` · `Medio (20-30 fotos y 2-3 videos)` · `Alto (50+ fotos y varios videos)` · `No sé, que lo proponga Jara`
→ etiquetaWA: `Volumen`

**3.4 · `evento_horas`** — select, `showIf: produccion_tipo === 'Evento, curso o lanzamiento'`
*¿Cuántas horas de cobertura necesitas?*
`1 a 2 horas` · `3 a 4 horas` · `5 a 8 horas` · `Más de 8 horas` · `Varios días`
→ etiquetaWA: `Cobertura`

**3.5 · `brief_libre`** — textarea, requerida, siempre visible ← **la pregunta más importante del formulario**
*Cuéntame con tus palabras qué tienes en mente.*
placeholder: `Ej: quiero fotos para lanzar mi colección de verano, estilo natural y luminoso. Si tienes referencias, pega el enlace aquí.`
ayuda: *Mientras más me cuentes aquí, menos te voy a preguntar después.*
→ etiquetaWA: `Lo que tiene en mente`

> Esta pregunta reemplaza a unas 15 sub-preguntas eliminadas (estilo visual, referencias, colores de marca, uso del material, locación específica, guion, detalles de edición). Dale espacio visual generoso: textarea de al menos 5 líneas.

---

### BLOQUE 4 — Dónde y cuándo (5 · el usuario ve las 5)

Este bloque se conserva completo. Es el que permite a Jara confirmar disponibilidad sin escribir una sola pregunta.

**4.1 · `fecha_estimada`** — fecha, requerida
*¿Qué fecha tienes en mente?*
*(conserva el selector de calendario que ya existe)*
→ etiquetaWA: `Fecha`

**4.2 · `fecha_flexibilidad`** — select, requerida
*¿Qué tan fija es esa fecha?*
`Es fija, no se mueve` · `Tengo margen de unos días` · `Soy flexible` · `Lo antes posible`
→ etiquetaWA: `Flexibilidad`

**4.3 · `ubicacion`** — compuesta, UNA sola pantalla con los tres campos juntos, requerida
*¿Dónde sería la sesión?*
- `ubicacion_pais` (select, Venezuela por defecto)
- `ubicacion_ciudad` (select o text)
- `ubicacion_lugar` (text, opcional) — placeholder: `Zona, urbanización o nombre del lugar`
→ etiquetaWA: `Lugar`

**4.4 · `entorno`** — select, requerida
*¿Dónde imaginas la sesión?*
`Estudio` · `Exteriores` · `En mi local o casa` · `No sé, que lo proponga Jara`
→ etiquetaWA: `Entorno`

**4.5 · `deadline_entrega`** — select, requerida
*¿Para cuándo necesitas el material listo?*
`Mismo día` · `En 48 horas` · `En una semana` · `En dos semanas` · `Sin apuro`
→ etiquetaWA: `Entrega`

---

### BLOQUE 5 — Alcance (2 · el usuario ve las 2) — **BLOQUE NUEVO**

Este bloque sustituye al antiguo bloque de presupuesto. Cumple la misma función de filtro, pero preguntando **qué quiere recibir el cliente** en vez de **cuánto puede pagar**. El cliente elige de un menú de servicios; Jara lee el rango implícito.

**5.1 · `modalidad`** — select, requerida
*¿Qué modalidad se ajusta más a lo que buscas?*
- `Algo sencillo y rápido — una sesión corta con entrega básica`
- `Una producción completa — sesión con preparación, varias tomas y edición cuidada`
- `Una producción grande — equipo, locación, varios días o muchas piezas`
- `No sé, quiero que Jara me oriente`
ayuda: *Esto me ayuda a armarte una propuesta del tamaño correcto desde el primer mensaje.*
→ etiquetaWA: `Modalidad`

**5.2 · `apoyo_equipo`** — multi-select, requerida
*¿Necesitas que Jara se encargue de algo más?*
- `Maquillaje y peinado`
- `Conseguir el estudio o la locación`
- `Conseguir modelo`
- `Ideas y concepto del contenido`
- `Solo fotografía o video, yo veo el resto` ← **opción exclusiva**
- `No sé qué hace falta` ← **opción exclusiva**
ayuda: *Marca todo lo que aplique.*
→ etiquetaWA: `Necesita apoyo con`

> **Implementación de las opciones exclusivas:** al marcar `Solo fotografía o video, yo veo el resto` o `No sé qué hace falta`, se deben desmarcar automáticamente todas las demás; y al marcar cualquier otra, se desmarcan esas dos.

---

## 4. RUTAS RESULTANTES (verifica estos conteos)

| Perfil del usuario | Pantallas que ve |
|---|---|
| Empresa + comercial | 1 + 4 + 4 + 5 + 2 = **16** |
| Empresa + evento | 1 + 4 + 5 + 5 + 2 = **17** |
| Persona natural + retrato | 1 + 2 + 4 + 5 + 2 = **14** |
| Influencer + reels | 1 + 3 + 4 + 5 + 2 = **15** |
| Modelo + retrato | 1 + 3 + 4 + 5 + 2 = **15** |

Ninguna ruta debe superar **17 pantallas**. Si alguna las supera al terminar, avísame antes de entregar.

---

## 5. MENSAJE DE WHATSAPP

Mismo mecanismo que ya existe (`https://wa.me/<numero>?text=<encodeURIComponent(mensaje)>`), con este formato compacto. **Solo incluye campos respondidos**, sin líneas vacías ni "N/A".

```
*NUEVA SOLICITUD — vía web*

*Contacto*
María Pérez · +58 412 555 1234
maria@correo.com

*Quién es*
Empresa: Studio Lina (Moda o ropa)
Redes: @studiolina

*Qué necesita*
Contenido comercial · Fotos y video
Volumen: medio (20-30 fotos y 2-3 videos)

"Quiero fotos para lanzar mi colección de verano,
estilo natural y luminoso. Referencias:
pinterest.com/xxxx"

*Cuándo y dónde*
20/10/2026 — flexible unos días
Caracas, Venezuela — Los Palos Grandes
Entorno: estudio
Entrega: en una semana

*Alcance*
Modalidad: producción completa
Necesita apoyo con: maquillaje y peinado, conseguir modelo
```

Reglas:
- El `brief_libre` va **entre comillas y en su propio párrafo**, separado del resto. Es lo primero que Jara debe leer.
- Encabezados de bloque en negrita de WhatsApp (`*Texto*`).
- Datos cortos del mismo bloque se juntan en una línea con `·` para que el mensaje no quede kilométrico.
- Las respuestas de selección múltiple se unen con coma.
- **No debe aparecer ninguna línea de presupuesto ni de precio.**

---

## 6. AJUSTES DE INTERFAZ

1. **Barra de progreso**: muéstrala como texto además de la barra — `Pregunta 6 de 15`. Ver un número bajo y concreto reduce el abandono. La `Y` se calcula sobre la ruta real del usuario, no sobre las 20 entradas del array.
2. **Sin escape temprano**: elimina el enlace "Ya quiero enviar lo que llevo" si existe. Con 15 pantallas ya no hace falta y ensucia la interfaz.
3. **Opción "No sé, que lo proponga Jara"**: consérvala solo en `cantidad`, `entorno` y `modalidad`. En el resto, fuera.
4. **La pantalla del `brief_libre`** debe sentirse distinta: textarea grande, sin prisa, con el texto de ayuda visible. Es el corazón del formulario.
5. **Resumen final**: se mantiene, con botón editar por campo.
6. **Cierre**: después de enviar, muestra un mensaje breve confirmando que Jara responde por WhatsApp. No pidas ningún dato adicional en esa pantalla.

---

## 7. CRITERIOS DE ACEPTACIÓN

- [ ] El array `PREGUNTAS[]` tiene exactamente 20 entradas y ninguna pregunta eliminada quedó viva en el código.
- [ ] **No existe ninguna pregunta de presupuesto, precio o rango de inversión en ninguna parte del formulario.**
- [ ] Ninguna ruta posible supera 17 pantallas (verifica las 5 de la tabla).
- [ ] El contador dice "Pregunta X de Y" y la Y es correcta para la ruta actual.
- [ ] Las opciones exclusivas de `apoyo_equipo` se comportan como se describe.
- [ ] El enunciado y las opciones de `cantidad` cambian correctamente según `formato`.
- [ ] El `brief_libre` aparece destacado y entre comillas en el mensaje de WhatsApp.
- [ ] El mensaje no contiene ninguna línea de campo sin responder.
- [ ] Diseño visual sin cambios respecto al actual.
- [ ] Funciona en Chrome móvil y Safari iOS, sin errores en consola, sin dependencias externas.

## 8. ENTREGA

Devuelve los archivos modificados **completos**, no fragmentos ni instrucciones de edición manual, más un resumen breve de qué cambiaste en cada archivo y el listado de preguntas que eliminaste.
