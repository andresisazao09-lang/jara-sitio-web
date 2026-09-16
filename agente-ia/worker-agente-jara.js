/* =====================================================================
   Agente de Jara — servidor intermediario para la IA (Cloudflare Worker)
   =====================================================================

   QUE ES ESTO
   -----------
   El sitio de Jara es paginas estaticas (GitHub Pages): no tiene servidor
   propio, y todo su codigo lo puede ver cualquiera con "Ver codigo fuente".
   Por eso la llave de la IA de Google (Gemini) NUNCA puede vivir en
   index.html — cualquiera podria copiarla y usarla a nombre de Jara.

   Este archivo es un "Worker" de Cloudflare: un programita pequeño que corre
   en los servidores de Cloudflare (gratis), guarda la llave de forma
   privada, y es el UNICO que le habla a Google. El navegador del cliente le
   habla a este Worker (nunca a Google directamente), y el Worker le
   responde solo una frase corta ya lista para mostrar en el chat.

   Este archivo NO se sube ni se ejecuta solo: hay que copiar su contenido
   y pegarlo en el panel de Cloudflare (ver los pasos en CONTEXTO-IA.md,
   seccion "Agente con IA"). Vive aqui en el repositorio solo como respaldo
   y para que quede el historial de cambios.

   QUE HACE EXACTAMENTE
   ---------------------
   Recibe la pregunta que se le hizo al cliente y lo que el cliente
   respondio, y le pide a Gemini UNA frase corta y calida que demuestre que
   esa respuesta fue leida y entendida (por ejemplo: si el cliente escribio
   "Studio Lina" como nombre de su marca, la IA podria responder
   "¡Studio Lina, qué buen nombre!"). Esa frase se le devuelve al sitio, que
   la muestra como un mensaje mas del "Agente de Jara" antes de la siguiente
   pregunta. El arbol de preguntas, el orden, las validaciones y el mensaje
   final de WhatsApp los sigue decidiendo el sitio — la IA nunca elige ni
   inventa preguntas, solo reacciona a la respuesta que ya se dio. */

/* Cambia esto si el sitio se muda a un dominio propio o cambia de URL de
   GitHub Pages. Sirve para que solo el sitio de Jara pueda usar este
   Worker desde un navegador (no evita que alguien lo llame directo con
   curl, pero sí evita que otras paginas lo usen desde el navegador). */
const ORIGEN_PERMITIDO = 'https://andresisazao09-lang.github.io';

/* Modelo economico y rapido de Gemini: de sobra para una frase de una
   linea. Si mas adelante Google saca un modelo mejor o mas barato, solo
   hay que cambiar este texto. */
const MODELO = 'gemini-2.5-flash-lite';

function encabezadosCORS(origen){
  return {
    'Access-Control-Allow-Origin': origen === ORIGEN_PERMITIDO ? origen : ORIGEN_PERMITIDO,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}

function respuestaJSON(objeto, estado, extra){
  var cabeceras = Object.assign({ 'Content-Type': 'application/json' }, extra || {});
  return new Response(JSON.stringify(objeto), { status: estado || 200, headers: cabeceras });
}

export default {
  async fetch(request, env){
    var cors = encabezadosCORS(request.headers.get('Origin') || '');

    if (request.method === 'OPTIONS'){
      return new Response(null, { headers: cors });
    }
    if (request.method !== 'POST'){
      return respuestaJSON({ error: 'Método no permitido' }, 405, cors);
    }

    var datos;
    try { datos = await request.json(); }
    catch (e) { return respuestaJSON({ reconocimiento: '' }, 400, cors); }

    var nombre = typeof datos.nombre === 'string' ? datos.nombre.slice(0, 40) : '';
    var preguntaAnteriorTexto = typeof datos.preguntaAnteriorTexto === 'string' ? datos.preguntaAnteriorTexto.slice(0, 200) : '';
    var respuestaCliente = typeof datos.respuestaCliente === 'string' ? datos.respuestaCliente.slice(0, 600) : '';
    var contexto = Array.isArray(datos.contexto) ? datos.contexto.slice(0, 8) : [];

    /* sin pregunta o sin respuesta no hay nada que reconocer */
    if (!preguntaAnteriorTexto || !respuestaCliente){
      return respuestaJSON({ reconocimiento: '' }, 200, cors);
    }

    var lineasContexto = contexto
      .filter(function(f){ return f && f.etiqueta && f.valor; })
      .map(function(f){ return f.etiqueta + ': ' + String(f.valor).slice(0, 120); })
      .join('\n');

    var instrucciones = [
      'Eres el "Agente de Jara", el asistente de un fotógrafo y cineasta en Venezuela, dentro',
      'de un chat de cotización en su sitio web. Tu único trabajo es escribir UNA frase muy',
      'breve (máximo 18 palabras) en español venezolano, cálido y profesional, que demuestre',
      'que acabas de leer y entender lo que el cliente respondió.',
      '',
      'Reglas estrictas:',
      '- No hagas preguntas ni adelantes la siguiente pregunta: eso lo muestra el sitio aparte.',
      '- No repitas el dato tal cual, como si fueras un robot leyendo un formulario.',
      '- Nunca menciones precio, presupuesto, dinero ni cotización en esta frase.',
      '- Usa como máximo un emoji, o ninguno. Nada de signos de exclamación en exceso.',
      '- No digas que eres una inteligencia artificial ni que estás "procesando" nada.',
      '- Si la respuesta del cliente es rara, muy corta o no aporta nada especial, escribe algo',
      '  breve y neutro tipo "¡Perfecto, gracias!" — nunca inventes datos que el cliente no dio.'
    ].join('\n');

    var prompt = instrucciones + '\n\n' +
      'Datos que ya conoces de este cliente:\n' + (lineasContexto || '(ninguno todavía)') + '\n\n' +
      'Pregunta que se le hizo: "' + preguntaAnteriorTexto + '"\n' +
      'Su nombre es: ' + (nombre || '(no lo sabes aún)') + '\n' +
      'Lo que respondió: "' + respuestaCliente + '"';

    try {
      var url = 'https://generativelanguage.googleapis.com/v1beta/models/' + MODELO + ':generateContent?key=' + env.GEMINI_API_KEY;
      var solicitud = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 80,
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'OBJECT',
              properties: { reconocimiento: { type: 'STRING' } },
              required: ['reconocimiento']
            }
          }
        })
      });

      if (!solicitud.ok){
        /* cuota agotada, llave invalida, etc.: se responde vacio, nunca un error */
        return respuestaJSON({ reconocimiento: '' }, 200, cors);
      }

      var cuerpo = await solicitud.json();
      var texto = cuerpo && cuerpo.candidates && cuerpo.candidates[0]
        && cuerpo.candidates[0].content && cuerpo.candidates[0].content.parts
        && cuerpo.candidates[0].content.parts[0] && cuerpo.candidates[0].content.parts[0].text;

      var reconocimiento = '';
      if (texto){
        try { reconocimiento = JSON.parse(texto).reconocimiento || ''; }
        catch (e){
          /* por si el modelo no devolvio JSON perfecto: se rescata a mano */
          var coincide = String(texto).match(/\{[\s\S]*\}/);
          if (coincide){ try { reconocimiento = JSON.parse(coincide[0]).reconocimiento || ''; } catch (e2){} }
        }
      }

      return respuestaJSON({ reconocimiento: String(reconocimiento || '').slice(0, 160) }, 200, cors);
    } catch (error){
      /* cualquier falla de red o de la API: el sitio sigue sin la frase, nunca se cae */
      return respuestaJSON({ reconocimiento: '' }, 200, cors);
    }
  }
};
