// netlify/functions/send-whatsapp-campaign.js
//
// Envía la plantilla "primer_contacto_constracost" a cada empresa de la lista.
// Requiere las variables de entorno en Netlify:
//   WHATSAPP_TOKEN     -> token permanente del usuario del sistema
//   WHATSAPP_PHONE_ID  -> Phone Number ID de la app de Meta
//
// IMPORTANTE: la plantilla debe estar en estado "Aprobada" en WhatsApp Manager
// antes de ejecutar este script, o la API devolverá error 132001 (template not found).

const LEADS = [
  // --- Roquetas de Mar / El Parador ---
  { nombre: "Construcciones y Reformas Balas SL", telefono: "34654952399", zona: "Roquetas de Mar" },
  { nombre: "PRESELECT Reforma y Construye", telefono: "34658220198", zona: "Roquetas de Mar" },
  { nombre: "Obras Acocasa", telefono: "34950178071", zona: "Roquetas de Mar" },
  { nombre: "Antomar Multiservicios", telefono: "34622648790", zona: "Roquetas de Mar" },
  { nombre: "Fontaneria Multiservicios NH", telefono: "34642038204", zona: "Roquetas de Mar" },
  { nombre: "Multiservicios Torre Azul", telefono: "34652414720", zona: "Roquetas de Mar" },
  { nombre: "Semar Reformas banos y cocinas", telefono: "34647062160", zona: "Roquetas de Mar" },
  { nombre: "VERDEMAR ROQUETAS SL", telefono: "34950320743", zona: "Roquetas de Mar" },
  { nombre: "Reformas HNT", telefono: "34632104118", zona: "Roquetas de Mar" },
  { nombre: "Pavimentos Impresos y Pulidos Ferre", telefono: "34641197793", zona: "Roquetas de Mar" },
  { nombre: "CRS-Andalucia", telefono: "34655764679", zona: "Roquetas de Mar" },
  { nombre: "Reformas Integrales Pirolizar SL", telefono: "34672711671", zona: "Roquetas de Mar" },
  { nombre: "Estructuras y Construcciones Moya", telefono: "34950715877", zona: "El Parador (Roquetas)" },
  { nombre: "Construcciones Blanque", telefono: "34950349441", zona: "El Parador (Roquetas)" },
  { nombre: "Mendoza Valles Pintores", telefono: "34686846056", zona: "Roquetas de Mar" },

  // --- Aguadulce ---
  { nombre: "SITEC Andalucia", telefono: "34950967999", zona: "Aguadulce" },
  { nombre: "DECO Construcciones", telefono: "34950109735", zona: "Aguadulce" },
  { nombre: "Proyectokasa", telefono: "34647354792", zona: "Aguadulce" },
  { nombre: "Arkitecnia Construcciones", telefono: "34950550343", zona: "Aguadulce" },
  { nombre: "RDR - Reformas de Rojas", telefono: "34692679323", zona: "Aguadulce" },
  { nombre: "Proyectos y Reformas D&L", telefono: "34641851175", zona: "Aguadulce" },
  { nombre: "Construcciones Bordalas SL", telefono: "34615986876", zona: "Aguadulce / El Parador" },

  // --- Vicar / La Gangosa / La Mojonera ---
  { nombre: "Grupo Contrasa Construccion y Decoracion", telefono: "34678472999", zona: "La Gangosa" },
  { nombre: "Construcciones Sebastian Ayala", telefono: "34607915621", zona: "La Mojonera" },
  { nombre: "Construcciones Rodriguez Conejo", telefono: "34670273817", zona: "La Mojonera" },
  { nombre: "Consyr Salmeron y Ruiz SL", telefono: "34950326612", zona: "La Mojonera" },

  // --- El Ejido / Almerimar / Balerma ---
  { nombre: "Construcciones Edifica Poniente SL", telefono: "34622708118", zona: "El Ejido" },
  { nombre: "Const. y Prom. Gabriel Fuentes SL", telefono: "34607498674", zona: "El Ejido" },
  { nombre: "Arsan Servicios Integrales SLU", telefono: "34634093805", zona: "El Ejido" },
  { nombre: "Paco El Zaballo SL", telefono: "34609545247", zona: "Balerma (El Ejido)" },
  { nombre: "Pintura y Decoracion Cesar", telefono: "34666348654", zona: "El Ejido" },
  { nombre: "Ejidoconst 2007", telefono: "34610208876", zona: "El Ejido" },
  { nombre: "Suarez Obras", telefono: "34626481697", zona: "El Ejido" },
  { nombre: "Javi Escobar Interiorismo", telefono: "34628814226", zona: "El Ejido" },
  { nombre: "Aljoga Construcciones y Promociones", telefono: "34950482003", zona: "El Ejido" },
  { nombre: "Construmar", telefono: "34950573071", zona: "El Ejido" },
  { nombre: "IndalVertical", telefono: "34692138155", zona: "El Ejido" },

  // --- Almeria capital ---
  { nombre: "Reformas DUNA", telefono: "34950715920", zona: "Almeria capital" },
  { nombre: "Almeria Reforms - Garfusa", telefono: "34950083726", zona: "Almeria capital" },
  { nombre: "Reformas Farol", telefono: "34665881178", zona: "Almeria capital" },
  { nombre: "Construcciones Rivaro", telefono: "34950255671", zona: "Almeria capital" },
  { nombre: "Reformas Rafael Viedma Martinez", telefono: "34667384103", zona: "Almeria capital" },
  { nombre: "Vimoal Proyectos y Construcciones", telefono: "34850980439", zona: "Almeria capital" },
  { nombre: "Herogo Rehabilitacion y Construccion", telefono: "34663876086", zona: "Almeria capital" },
  { nombre: "Danoa Habitat Reformas", telefono: "34625648017", zona: "Almeria capital" },
  { nombre: "Construcciones JJ Fernandez Ojeda", telefono: "34624024846", zona: "Almeria capital" },
  { nombre: "Multiservicios Sanchez Rodriguez", telefono: "34697333147", zona: "Almeria capital" },
  { nombre: "Reformas Almeria", telefono: "34950083516", zona: "Almeria capital" },
  { nombre: "JOFEPE SL", telefono: "34950266964", zona: "Almeria capital" },
  { nombre: "Albanil Juan Farol", telefono: "34688970507", zona: "Almeria capital" },
  { nombre: "Reformas Arsindal", telefono: "34950266994", zona: "Almeria capital" },
  { nombre: "H.A. Gonzalez Reparaciones", telefono: "34679342369", zona: "Almeria capital" },
  { nombre: "Viviendas y Reformas Almeria SL", telefono: "34656678145", zona: "Almeria capital" },
  { nombre: "Obras Fylcon SL", telefono: "34950343569", zona: "Almeria capital" },
  { nombre: "Anpi Construcciones y Rehabilitaciones SL", telefono: "34950306515", zona: "Viator (Almeria)" },
  { nombre: "Construcam", telefono: "34687937182", zona: "Almeria capital" },
  { nombre: "Construcciones del Sur Arquibel", telefono: "34950228566", zona: "Almeria capital" },
  { nombre: "Vertical Arez SL", telefono: "34676089937", zona: "Almeria capital" },
  { nombre: "Namar Rehabilitaciones y Construcciones SL", telefono: "34639568455", zona: "Almeria capital" },
  { nombre: "Coccolarvi Reformas", telefono: "34635960132", zona: "Almeria capital" },
  { nombre: "Refor Hogar Almeria", telefono: "34643628434", zona: "Almeria capital" },
  { nombre: "Reformas en General", telefono: "34625267011", zona: "Almeria capital" },
  { nombre: "Ros Reformas", telefono: "34677344173", zona: "Almeria capital" },
  { nombre: "Pintores Almeria - Pinturas Caballero", telefono: "34633709504", zona: "Almeria capital" },
  { nombre: "Decomor Pintura y Decoracion", telefono: "34646597023", zona: "Almeria capital" },

  // --- Retamar / Huercal de Almeria / Viator ---
  { nombre: "Construcciones Altemar", telefono: "34628008076", zona: "Retamar" },
  { nombre: "Construcciones y Reformas Martin", telefono: "34696279901", zona: "Retamar" },
  { nombre: "FG Multiservicios", telefono: "34650276506", zona: "Retamar" },
  { nombre: "Hormigon Impreso Pavipascu", telefono: "34642820341", zona: "Retamar" },
  { nombre: "Multiservicios y Reformas BONORA", telefono: "34648475081", zona: "Retamar" },
  { nombre: "Rehabitec Almeria SL", telefono: "34950145260", zona: "Huercal de Almeria" },
  { nombre: "Reformas en Almeria - Huarpe", telefono: "34695584040", zona: "Huercal de Almeria" },
  { nombre: "Construcciones Viator Almeria", telefono: "34950304944", zona: "Viator" },
  { nombre: "PROA Construcciones y Reformas", telefono: "34950653939", zona: "Viator" },
  { nombre: "Capro Multiservicios", telefono: "34644304233", zona: "Huercal de Almeria" },
  { nombre: "Multiservicios Kira SL", telefono: "34643565770", zona: "Huercal de Almeria" },
  { nombre: "Reforcasa Almeria SL", telefono: "34950308530", zona: "Huercal de Almeria" },
  { nombre: "Pinturas Decorainex", telefono: "34609625343", zona: "Huercal de Almeria" },
];

// Nombre y ejemplo de saludo usados en la plantilla aprobada en Meta.
const TEMPLATE_NAME = "primer_contacto_constracost";
const TEMPLATE_LANG = "es";
const SALUDO = "buenas";

// Pausa entre envíos para no saturar la API (ms).
const DELAY_MS = 1200;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendTemplate(lead) {
  const url = `https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_ID}/messages`;

  const body = {
    messaging_product: "whatsapp",
    to: lead.telefono,
    type: "template",
    template: {
      name: TEMPLATE_NAME,
      language: { code: TEMPLATE_LANG },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: SALUDO },
            { type: "text", text: lead.nombre },
          ],
        },
      ],
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  return {
    nombre: lead.nombre,
    telefono: lead.telefono,
    zona: lead.zona,
    status: res.status,
    ok: res.ok,
    error: res.ok ? null : data,
    messageId: data?.messages?.[0]?.id ?? null,
  };
}

export async function handler(event) {
  // Protección mínima: solo permite ejecutar vía POST, y con un secreto simple
  // pasado por query string, para que no cualquiera pueda disparar la campaña
  // visitando la URL en el navegador.
  const secret = event.queryStringParameters?.secret;
  if (secret !== process.env.CAMPAIGN_SECRET) {
    return { statusCode: 401, body: "No autorizado" };
  }

  const results = [];

  for (const lead of LEADS) {
    try {
      const result = await sendTemplate(lead);
      results.push(result);
      console.log(
        `${result.ok ? "OK" : "FALLO"} - ${lead.nombre} (${lead.telefono})`
      );
    } catch (err) {
      results.push({
        nombre: lead.nombre,
        telefono: lead.telefono,
        ok: false,
        error: String(err),
      });
    }
    await sleep(DELAY_MS);
  }

  const enviados = results.filter((r) => r.ok).length;
  const fallidos = results.filter((r) => !r.ok);

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      {
        total: LEADS.length,
        enviados,
        fallidos: fallidos.length,
        detalleFallidos: fallidos,
        resultados: results,
      },
      null,
      2
    ),
  };
}
