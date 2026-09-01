import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// ── Supabase client ──
const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
export const supabase = (SUPABASE_URL && SUPABASE_ANON)
  ? createClient(SUPABASE_URL, SUPABASE_ANON, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } })
  : null;

/* ═══════════════════════════════════════════════
   properties. — Sector Inmobiliario
   Refined: Fraunces (serif) + Inter (sans)
   Palette: Matte copper · Warm ivory · Warm charcoal
   ═══════════════════════════════════════════════ */

// ── Palette · UNIFICADA con C2C shell (dark + gold champagne) ──
// Antes era light/espresso (estilo Airbnb). Ahora dark editorial nocturno
// para matchear shell + ia-prop + greatdeal-app. Si necesitas iterar, todos
// los componentes leen estos tokens — no toques colores hardcoded fuera de acá.
const C = {
  // GOLD — accent principal (antes brand espresso, ahora gold champagne)
  brand:      "#c9a86a",   // gold champagne (acento principal)
  brandSoft:  "#d4b876",   // gold bright (hover/highlight)
  brandWash:  "rgba(201, 168, 106, 0.12)",  // wash dorado sutil

  // TEXT (invertido — ahora claro sobre fondo oscuro, mayor contraste)
  ink:        "#ffffff",   // texto primario (blanco puro para títulos)
  inkMuted:   "#f0ebe0",   // texto primario suave
  text:       "#e0d9c8",   // texto body (muy legible sobre dark)
  muted:      "#b8b3a7",   // texto secundario
  subtle:     "#8a8579",   // placeholder / terciario

  // LINES (bordes con más contraste sobre dark)
  line:       "rgba(245, 240, 230, 0.15)",   // hairline más visible
  lineSoft:   "rgba(245, 240, 230, 0.08)",   // soft divider

  // BACKGROUNDS (dark editorial)
  bg:         "#0a0a0b",   // fondo principal (charcoal)
  surface:    "#131316",   // cards / superficies elevadas
  surface2:   "#1c1c20",   // surface hover/active

  // ACCENTS (mapeados a la paleta dark)
  forest:     "#6ec48a",   // success → verde brillante
  sage:       "#6ec48a",   // success alt
  mintWash:   "rgba(110, 196, 138, 0.10)",
  terracotta: "#e57676",   // error / like → rojo coral
};
// Fuentes unificadas con el shell C2C
const Fs = "'Cormorant Garamond', 'Playfair Display', Georgia, serif";
const Fb = "'Inter', system-ui, -apple-system, sans-serif";

// ── Data — 3 propiedades de Valentina Sanchez ──
const SELLER = { name:"Valentina Sanchez", avatar:"VS", wa:"+56986420055" };

// Helper: build a clean wa.me URL (strips "+" and non-digits, which wa.me requires)
const waUrl = (num, msg) => `https://wa.me/${String(num||"").replace(/\D/g,"")}${msg?`?text=${encodeURIComponent(msg)}`:""}`;

const PROPS = [
  { id:1,type:"Casa",operacion:"venta",price:8500,cur:"UF",loc:"La Reina, Santiago",comuna:"La Reina",lat:-33.4506,lng:-70.5345,beds:4,baths:3,parks:2,area:180,areaTerreno:280,nuevo:false,amenities:["piscina","quincho","jardin","terraza","condominio","dorm_servicio","calefaccion","cerco_electrico","orient_norte"],title:"Casa mediterránea con piscina y quincho",desc:"Amplia casa familiar. Living comedor con salida a terraza, jardín con piscina, quincho y bodega. Barrio residencial consolidado.",img:"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",user:SELLER.name,avatar:SELLER.avatar,liked:false,saved:false,wa:SELLER.wa,tags:["Piscina","Jardín","Quincho"],photos:12,hasVideo:true },
  { id:2,type:"Departamento",operacion:"venta",price:4900,cur:"UF",loc:"Ñuñoa, Santiago",comuna:"Ñuñoa",lat:-33.4570,lng:-70.5970,beds:3,baths:2,parks:2,area:78,areaTotal:92,nuevo:true,amenities:["terraza","gimnasio","bodega","calefaccion","conserje_24","piscina_edif","orient_norte"],title:"Depto esquina con doble terraza panorámica",desc:"Último piso, vista despejada a la cordillera. Cocina equipada Bosch, 2 estacionamientos. Entrega inmediata.",img:"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",user:SELLER.name,avatar:SELLER.avatar,liked:false,saved:false,wa:SELLER.wa,tags:["Último piso","Entrega inmediata","Cordillera"],photos:10,hasVideo:true },
  { id:3,type:"Parcela",operacion:"venta",price:1500,cur:"UF",loc:"Melipilla, RM",comuna:"Melipilla",lat:-33.6864,lng:-71.2147,beds:0,baths:0,parks:0,area:5000,hectareas:0.5,nuevo:false,amenities:["jardin","derechos_agua","frutal"],usoSitio:"agricola",title:"Parcela 5.000m² — camino a la costa",desc:"Parcela con árboles frutales, pozo profundo y electricidad trifásica. A 30 min de Santiago por autopista.",img:"https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop",user:SELLER.name,avatar:SELLER.avatar,liked:false,saved:false,wa:SELLER.wa,tags:["5.000m²","Pozo","Frutales"],photos:9,hasVideo:true },
];

const REELS = [
  { id:1,propId:1,views:"15.2K",caption:"Recorrido casa La Reina — piscina y quincho",likes:842 },
  { id:2,propId:2,views:"9.8K",caption:"Doble terraza Ñuñoa — último piso con vista",likes:456 },
  { id:3,propId:3,views:"6.3K",caption:"Parcela en Melipilla — tu escape de Santiago",likes:312 },
];

const CONVOS = [
  { id:1,name:"Camila Rojas",   av:"CR",propId:1,prop:"Casa La Reina",       last:"Perfecto, agendemos la visita",     time:"1h",  unread:2,sched:true,  days:["Lun","Mié","Vie"],hrs:"10:00-18:00" },
  { id:2,name:"Pedro Hernández",av:"PH",propId:2,prop:"Depto Ñuñoa",         last:"¿Está disponible este sábado?",      time:"Ayer",unread:0,sched:false, days:["Sáb","Dom"],       hrs:"10:00-14:00" },
  { id:3,name:"Andrés Soto",    av:"AS",propId:3,prop:"Parcela Melipilla",   last:"Me interesa, ¿hay agua y luz?",      time:"3d",  unread:0,sched:false, days:["Lun-Vie"],         hrs:"09:00-17:00" },
];

const NOTIFS = [
  { id:1, t:"Camila R. te envió un mensaje",         d:"Casa La Reina",            time:"1h",  icon:"chat", unread:true },
  { id:2, t:"Pedro H. quiere agendar una visita",    d:"Depto Ñuñoa · sábado 10AM",time:"3h",  icon:"calendar", unread:true },
  { id:3, t:"Tu publicación tiene 234 vistas nuevas",d:"Parcela Melipilla",        time:"1d",  icon:"eye",  unread:false },
  { id:4, t:"Andrés S. guardó tu propiedad",          d:"Parcela Melipilla",        time:"2d",  icon:"bookmark", unread:false },
];

const PHOTO_GUIDE = [
  { s:1,l:"Fachada / Entrada",r:true,t:"Foto frontal con buena luz",
    tips:["Párate frente a la entrada","Celular VERTICAL — formato reels","Estabiliza con las dos manos","Toma con luz de día — evita contraluz","Incluye toda la fachada si es posible"],
    avoid:["No tomar contra el sol","No torcer la cámara"]
  },
  { s:2,l:"Living / Estar",r:true,t:"Desde la esquina, muestra amplitud",
    tips:["Párate en una esquina del living","Celular VERTICAL a la altura del pecho","Estabiliza con las dos manos","Enciende todas las luces","Despeja objetos personales antes"],
    avoid:["No tomar muy cerca","Evita reflejos en ventanas"]
  },
  { s:3,l:"Cocina",r:true,t:"Luces encendidas, mesones despejados",
    tips:["Despeja todos los mesones","Celular VERTICAL — estabiliza con las dos manos","Enciende las luces sobre la encimera","Si hay isla, fotografíala como protagonista"],
    avoid:["No mostrar platos sucios","Evita objetos personales visibles"]
  },
  { s:4,l:"Dormitorio principal",r:true,t:"Cama hecha, cortinas abiertas",
    tips:["Haz la cama prolijamente","Abre las cortinas — luz natural","Celular VERTICAL desde la puerta — estabiliza","Quita ropa o cargadores de la mesa de noche"],
    avoid:["No tomar la cama deshecha","Evita ropa colgada"]
  },
  { s:5,l:"Baño principal",r:false,t:"Limpio y ordenado",
    tips:["Limpia espejo y grifería","Saca toallas y artículos personales","Celular VERTICAL desde la puerta — estabiliza","Cierra la tapa del WC"],
    avoid:["No mostrar productos personales","Sin toallas colgadas"]
  },
  { s:6,l:"Vista / Terraza",r:false,t:"Desde adentro hacia afuera",
    tips:["Párate dentro y apunta hacia la vista","Celular VERTICAL — estabiliza firme","Mejor con luz de día","Si hay terraza, muéstrala con mobiliario"],
    avoid:["No tomar en horario nocturno","Evita reflejos"]
  },
  { s:7,l:"Segundo dormitorio",r:false,t:"Mismo estilo que el principal",
    tips:["Mismo encuadre que dormitorio principal","Celular VERTICAL — estabiliza con las dos manos","Cama hecha, cortinas abiertas","Toma desde la puerta"],
    avoid:["Evita inconsistencia con el principal"]
  },
  { s:8,l:"Estacionamiento / Bodega",r:false,t:"Muestra el espacio disponible",
    tips:["Celular VERTICAL — estabiliza firme","Si es subterráneo, asegura buena luz","Si es exterior, evita contraluz"],
    avoid:["No tomar con autos al medio"]
  },
];

const VID_GUIDE = [
  { n:1,t:"Gran angular — Entrada",d:"Paneo lento mostrando fachada y entrada.",icon:"aperture",dur:"8-12s",
    tips:["Celular VERTICAL — formato reels","Estabiliza firme con las dos manos","Empieza apuntando a la calle, gira lento hacia la entrada (de izquierda a derecha)","Camina hacia adelante muy despacio","Buena luz de día"],
    avoid:["No moverse rápido","Evita zoom digital","No tomar de noche","No grabar horizontal"]
  },
  { n:2,t:"Interior principal",d:"Camina por el living. Mantén estable.",icon:"house",dur:"10-15s",
    tips:["Celular VERTICAL, sostenlo con las dos manos firme","Camina lento — usa los pies, no las manos","Estabiliza el celular pegado al cuerpo","Empieza desde la entrada y avanza al fondo","Todas las luces encendidas"],
    avoid:["No correr","No agitar el celular","No grabar horizontal"]
  },
  { n:3,t:"Espacio secundario",d:"Dormitorio, cocina o segundo piso.",icon:"door",dur:"8-12s",
    tips:["Elige el espacio que más destaque","Celular VERTICAL — estabiliza con las dos manos","Camina desde la puerta hacia adentro","Foco en lo más atractivo"],
    avoid:["No grabar áreas desordenadas","No grabar horizontal"]
  },
  { n:4,t:"Exterior y entorno",d:"Jardín, calle. Plano abierto final.",icon:"tree",dur:"10-15s",
    tips:["Sal al jardín o terraza","Celular VERTICAL — estabiliza firme","Paneo lento de izquierda a derecha","Cierre con vista panorámica del entorno"],
    avoid:["No grabar contra el sol","Evita ruido fuerte de tráfico","No grabar horizontal"]
  },
];

// UF rate for CLP conversion (mock — production should pull from API)
const UF_TO_CLP = 40000;

// ─── Music library for reel editor (royalty-free, would be Pixabay tracks in production) ───
// In production these URLs point to actual MP3s in /public/audio/ or a CDN.
// For demo, we use the audio attribute null so the player plays without sound (silent fallback).
const MUSIC_LIBRARY = [
  // Cálido / Hogar
  { k:"sunset_drive",     l:"Sunset Drive",     vibe:"Cálido / Acústico",       cat:"Cálido",        bpm:92,  defaultFor:["Casa"],                  url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { k:"warm_hearth",      l:"Warm Hearth",      vibe:"Hogar / Folk suave",      cat:"Cálido",        bpm:84,  defaultFor:["Casa"],                  url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { k:"golden_hour",      l:"Golden Hour",      vibe:"Atardecer / Indie",       cat:"Cálido",        bpm:96,  defaultFor:[],                        url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3" },
  // Urbano / Departamento
  { k:"urban_dawn",       l:"Urban Dawn",       vibe:"Minimal Electrónico",     cat:"Urbano",        bpm:110, defaultFor:["Departamento"],          url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { k:"city_lights",      l:"City Lights",      vibe:"Lo-fi Urbano",            cat:"Urbano",        bpm:98,  defaultFor:["Departamento"],          url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
  { k:"midnight_loft",    l:"Midnight Loft",    vibe:"Synth Chill",             cat:"Urbano",        bpm:104, defaultFor:[],                        url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3" },
  // Cinematográfico / Lujoso
  { k:"mediterranean",    l:"Mediterranean",    vibe:"Cinematográfico",         cat:"Lujoso",        bpm:80,  defaultFor:["Casa Premium"],          url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" },
  { k:"velvet_estate",    l:"Velvet Estate",    vibe:"Premium / Orquestal",     cat:"Lujoso",        bpm:75,  defaultFor:[],                        url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3" },
  { k:"penthouse_jazz",   l:"Penthouse Jazz",   vibe:"Jazz Suave",              cat:"Lujoso",        bpm:88,  defaultFor:[],                        url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3" },
  // Natural / Campo
  { k:"country_road",     l:"Country Road",     vibe:"Folk Relajado",           cat:"Natural",       bpm:88,  defaultFor:["Parcela","Sitio"],       url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3" },
  { k:"open_fields",      l:"Open Fields",      vibe:"Naturaleza / Aire libre", cat:"Natural",       bpm:82,  defaultFor:["Parcela","Sitio"],       url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3" },
  // Corporativo
  { k:"corporate_smooth", l:"Corporate Smooth", vibe:"Corporativo Suave",       cat:"Corporativo",   bpm:105, defaultFor:["Oficina","Industrial"],  url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
  { k:"executive_flow",   l:"Executive Flow",   vibe:"Profesional / Limpio",    cat:"Corporativo",   bpm:102, defaultFor:["Oficina","Industrial"],  url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
  // Joven / Energético
  { k:"bright_young",     l:"Bright Young",     vibe:"Brillante / Joven",       cat:"Energético",    bpm:120, defaultFor:[],                        url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
  { k:"summer_pop",       l:"Summer Pop",       vibe:"Pop Veraniego",           cat:"Energético",    bpm:124, defaultFor:[],                        url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
  { k:"festival_vibes",   l:"Festival Vibes",   vibe:"Dance / Festival",        cat:"Energético",    bpm:128, defaultFor:[],                        url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3" },
];

// Auto-suggest music based on property type
const suggestMusic = (type) => {
  const match = MUSIC_LIBRARY.find(m => m.defaultFor.includes(type));
  return match ? match.k : "sunset_drive";
};

// ─── Reel title overlay styles ───
const TITLE_STYLES = [
  { k:"editorial",   l:"Editorial",    desc:"Serif blanco sobre fondo translúcido" },
  { k:"luxury",      l:"Lujo",         desc:"Letra dorada, sombra fuerte" },
  { k:"young",       l:"Joven / TikTok",desc:"Bold sans, fondo cobre sólido" },
  { k:"minimal",     l:"Minimalista",  desc:"Solo texto blanco, sin fondo" },
];

// Comunas de Chile (principales + Región Metropolitana completa)
const COMUNAS = [
  // RM
  ["Las Condes","Región Metropolitana"],["Vitacura","Región Metropolitana"],["Lo Barnechea","Región Metropolitana"],["Providencia","Región Metropolitana"],
  ["Ñuñoa","Región Metropolitana"],["La Reina","Región Metropolitana"],["Macul","Región Metropolitana"],["Peñalolén","Región Metropolitana"],
  ["Santiago","Región Metropolitana"],["Estación Central","Región Metropolitana"],["Independencia","Región Metropolitana"],["Recoleta","Región Metropolitana"],
  ["Huechuraba","Región Metropolitana"],["Conchalí","Región Metropolitana"],["Renca","Región Metropolitana"],["Quilicura","Región Metropolitana"],
  ["La Florida","Región Metropolitana"],["Maipú","Región Metropolitana"],["Pudahuel","Región Metropolitana"],["San Miguel","Región Metropolitana"],
  ["San Joaquín","Región Metropolitana"],["La Cisterna","Región Metropolitana"],["El Bosque","Región Metropolitana"],["San Ramón","Región Metropolitana"],
  ["La Granja","Región Metropolitana"],["La Pintana","Región Metropolitana"],["San Bernardo","Región Metropolitana"],["Puente Alto","Región Metropolitana"],
  ["Pirque","Región Metropolitana"],["Buin","Región Metropolitana"],["Paine","Región Metropolitana"],["Calera de Tango","Región Metropolitana"],
  ["Padre Hurtado","Región Metropolitana"],["Peñaflor","Región Metropolitana"],["Talagante","Región Metropolitana"],["Isla de Maipo","Región Metropolitana"],
  ["El Monte","Región Metropolitana"],["Melipilla","Región Metropolitana"],["Curacaví","Región Metropolitana"],["María Pinto","Región Metropolitana"],
  ["Colina","Región Metropolitana"],["Chicureo","Región Metropolitana"],["Lampa","Región Metropolitana"],["Tiltil","Región Metropolitana"],
  ["Cerrillos","Región Metropolitana"],["Cerro Navia","Región Metropolitana"],["Lo Prado","Región Metropolitana"],["Quinta Normal","Región Metropolitana"],
  // Valparaíso
  ["Viña del Mar","Valparaíso"],["Valparaíso","Valparaíso"],["Concón","Valparaíso"],["Reñaca","Valparaíso"],["Quilpué","Valparaíso"],["Villa Alemana","Valparaíso"],
  ["Quintero","Valparaíso"],["Quillota","Valparaíso"],["Limache","Valparaíso"],["La Calera","Valparaíso"],["Olmué","Valparaíso"],["Algarrobo","Valparaíso"],
  ["El Quisco","Valparaíso"],["Cartagena","Valparaíso"],["San Antonio","Valparaíso"],
  // Otras regiones
  ["La Serena","Coquimbo"],["Coquimbo","Coquimbo"],["Ovalle","Coquimbo"],
  ["Antofagasta","Antofagasta"],["Iquique","Tarapacá"],["Arica","Arica y Parinacota"],
  ["Concepción","Biobío"],["Talcahuano","Biobío"],["Chiguayante","Biobío"],["San Pedro de la Paz","Biobío"],["Hualpén","Biobío"],
  ["Temuco","Araucanía"],["Pucón","Araucanía"],["Villarrica","Araucanía"],
  ["Valdivia","Los Ríos"],["Puerto Montt","Los Lagos"],["Puerto Varas","Los Lagos"],["Frutillar","Los Lagos"],
  ["Rancagua","O'Higgins"],["Talca","Maule"],["Chillán","Ñuble"],
];

const PROP_TYPES = [
  { t:"Casa",          icon:"house" },
  { t:"Departamento",  icon:"building" },
  { t:"Sitio",         icon:"land" },
  { t:"Parcela",       icon:"mountain" },
  { t:"Oficina",       icon:"briefcase" },
  { t:"Industrial",    icon:"storage" },
];

const OPERACIONES = [
  { k:"venta",    l:"Venta"    },
  { k:"arriendo", l:"Arriendo" },
];

// Dynamic filter catalogs per property type — each catalog has the amenities valid for that type
const FILTER_CATALOGS = {
  Casa: {
    amenities: [
      { k:"piscina",          l:"Piscina",            icon:"pool" },
      { k:"quincho",          l:"Quincho",            icon:"grill" },
      { k:"jardin",           l:"Jardín",             icon:"tree" },
      { k:"sala_estar",       l:"Sala de estar",      icon:"house" },
      { k:"condominio",       l:"En condominio",      icon:"house" },
      { k:"dorm_servicio",    l:"Dorm. servicio",     icon:"bed" },
      { k:"calefaccion",      l:"Calefacción central",icon:"sparkle" },
      { k:"cerco_electrico",  l:"Cerco eléctrico",    icon:"sparkle" },
      { k:"guardia",          l:"Guardia",            icon:"user" },
      { k:"amoblada",         l:"Amoblada",           icon:"sparkle" },
      { k:"termopanel",       l:"Ventanas termopanel",icon:"sparkle" },
      // Orientación
      { k:"orient_norte",     l:"Orientación Norte",  icon:"sparkle", group:"orientacion" },
      { k:"orient_sur",       l:"Orientación Sur",    icon:"sparkle", group:"orientacion" },
      { k:"orient_oriente",   l:"Orientación Oriente", icon:"sparkle", group:"orientacion" },
      { k:"orient_poniente",  l:"Orientación Poniente",icon:"sparkle", group:"orientacion" },
    ],
    showBeds: true, showBaths: true, showParks: false, showArea: true, showTerreno: true,
  },
  Departamento: {
    amenities: [
      { k:"terraza",          l:"Terraza",            icon:"terrace" },
      { k:"jardin",           l:"Jardín",             icon:"tree" },
      { k:"dorm_servicio",    l:"Dorm. servicio",     icon:"bed" },
      { k:"calefaccion",      l:"Calefacción central",icon:"sparkle" },
      { k:"bodega",           l:"Bodega",             icon:"storage" },
      { k:"conserje_24",      l:"Conserje 24h",       icon:"user" },
      { k:"piscina_edif",     l:"Piscina edificio",   icon:"pool" },
      { k:"quincho_edif",     l:"Quincho edificio",   icon:"grill" },
      { k:"gimnasio",         l:"Gimnasio",           icon:"gym" },
      { k:"salon_eventos",    l:"Salón de eventos",   icon:"sparkle" },
      { k:"amoblado",         l:"Amoblado",           icon:"sparkle" },
      { k:"termopanel",       l:"Ventanas termopanel",icon:"sparkle" },
      // Orientación
      { k:"orient_norte",     l:"Orientación Norte",  icon:"sparkle", group:"orientacion" },
      { k:"orient_sur",       l:"Orientación Sur",    icon:"sparkle", group:"orientacion" },
      { k:"orient_oriente",   l:"Orientación Oriente", icon:"sparkle", group:"orientacion" },
      { k:"orient_poniente",  l:"Orientación Poniente",icon:"sparkle", group:"orientacion" },
    ],
    showBeds: true, showBaths: true, showParks: true, showArea: true, showTotal: true,
  },
  Sitio: {
    amenities: [
      { k:"urbanizado",       l:"Urbanizado",         icon:"checkCircle" },
      { k:"plano",            l:"Plano",              icon:"ruler" },
      { k:"uso_habitacional", l:"Uso habitacional",   icon:"house" },
      { k:"uso_industrial",   l:"Uso industrial",     icon:"storage" },
      { k:"uso_comercial",    l:"Uso comercial",      icon:"shop" },
      { k:"uso_agricola",     l:"Uso agrícola",       icon:"tree" },
      { k:"construc_altura",  l:"Construcción altura",icon:"building" },
    ],
    showBeds: false, showBaths: false, showParks: false, showArea: true, showUrbano: true,
  },
  Parcela: {
    amenities: [
      { k:"ganadero",         l:"Ganadero",           icon:"tree" },
      { k:"forestal",         l:"Forestal",           icon:"tree" },
      { k:"agricola",         l:"Agrícola",           icon:"tree" },
      { k:"conservacion",     l:"Conservación",       icon:"leaf" },
      { k:"derechos_agua",    l:"Derechos de agua",   icon:"pool" },
      { k:"frutal",           l:"Frutales",           icon:"tree" },
    ],
    showBeds: false, showBaths: false, showParks: false, showHectareas: true,
  },
  Oficina: {
    amenities: [
      { k:"planta_libre",     l:"Planta libre",       icon:"grid" },
      { k:"amoblada_ofi",     l:"Amoblada",           icon:"sparkle" },
      { k:"conserje_24",      l:"Conserje 24h",       icon:"user" },
      { k:"cocina",           l:"Cocina",             icon:"sparkle" },
      { k:"terraza",          l:"Terraza",            icon:"terrace" },
      { k:"jardin",           l:"Jardín",             icon:"tree" },
      { k:"bodega",           l:"Bodega",             icon:"storage" },
      { k:"termopanel",       l:"Ventanas termopanel",icon:"sparkle" },
    ],
    showBeds: false, showBaths: true, showParks: true, showArea: true, showPrivados: true,
  },
  Industrial: {
    amenities: [
      { k:"conserje_24",      l:"Conserje 24h",       icon:"user" },
      { k:"bodega",           l:"Bodegas",            icon:"storage" },
      { k:"oficinas_ind",     l:"Oficinas",           icon:"briefcase" },
    ],
    showBeds: false, showBaths: false, showParks: false, showArea: true, showTotal: true,
  },
};

// Universal/base amenities (when no type selected)
const AMENITIES = [
  { k:"terraza",  l:"Terraza",  icon:"terrace" },
  { k:"piscina",  l:"Piscina",  icon:"pool" },
  { k:"quincho",  l:"Quincho",  icon:"grill" },
  { k:"jardin",   l:"Jardín",   icon:"tree" },
  { k:"bodega",   l:"Bodega",   icon:"storage" },
  { k:"gimnasio", l:"Gimnasio", icon:"gym" },
];

// Format precios — siempre número completo con puntos (no más "25K")
const fmt = n => (n||0).toLocaleString("es-CL");

// ── Privacidad de ubicación ──
// El formulario de publicación le promete al vendedor que la dirección exacta
// no se publica. `p.loc` (calle + número), `p.street`, `p.number` y el par
// lat/lng exacto son datos del dueño: NUNCA se muestran en vistas públicas
// (tarjetas, ficha, reels, mapa). Lo público es el "vanityLocation" que el
// vendedor eligió y, si no puso ninguno, la comuna a secas.
function publicLocation(p) {
  if (!p) return "";
  const vanity = String(p.vanityLocation || "").trim();
  if (vanity) return vanity;
  const comuna = String(p.comuna || "").trim();
  if (comuna) return comuna;
  // Sin comuna guardada: `loc` viene como "Calle 123, Comuna" — nos quedamos
  // solo con el último tramo. Si no hay coma no arriesgamos y no mostramos nada.
  const parts = String(p.loc || "").split(",").map(s => s.trim()).filter(Boolean);
  return parts.length > 1 ? parts[parts.length - 1] : "";
}

// Icono de fallback según el tipo de propiedad.
function typeIcon(type) {
  if (type === "Departamento") return "building";
  if (type === "Parcela") return "mountain";
  if (type === "Oficina") return "briefcase";
  if (type === "Sitio") return "land";
  return "house";
}

// Fuente de video de un aviso, en el mismo orden de prioridad que usa el
// reproductor de reels: video publicado > blob local > primer take del borrador.
function propVideoSrc(p) {
  if (!p) return null;
  if (p.video_url) return p.video_url;
  if (p.videoFile) return p.videoFile;
  const takes = p.videoTakeFiles;
  if (takes) return takes[1] || Object.values(takes).find(Boolean) || null;
  return null;
}

// Radio (m) del círculo aproximado que reemplaza al pin exacto en mapas públicos.
const APPROX_RADIUS_M = 500;

// Centro aproximado para el mapa público: desplaza el punto real una distancia
// fija en un ángulo derivado del id (determinístico — el mismo aviso siempre cae
// en el mismo lugar) para que el centro del círculo no delate la dirección.
function approxLatLng(p, radiusM = APPROX_RADIUS_M) {
  if (!p || typeof p.lat !== "number" || typeof p.lng !== "number") return null;
  const seed = String(p.id ?? "");
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  const angle = (h % 360) * Math.PI / 180;
  const dist = radiusM * 0.5;
  const cosLat = Math.cos(p.lat * Math.PI / 180) || 1;
  return {
    lat: p.lat + (dist * Math.cos(angle)) / 111320,
    lng: p.lng + (dist * Math.sin(angle)) / (111320 * cosLat),
  };
}

// ── Brand Logo (refined) ──
const Logo = ({size=24,color=C.brand}) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <path d="M20 5L5 17.5v15h30v-15L20 5z" stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round" strokeLinecap="round"/>
    <path d="M20 15a4 4 0 00-4 4c0 3.8 4 7.5 4 7.5s4-3.7 4-7.5a4 4 0 00-4-4z" fill={color} opacity="0.95"/>
    <circle cx="20" cy="19" r="1.4" fill={C.surface}/>
  </svg>
);

// ── Icon set (elegant line illustrations) ──
const Icon = ({ name, size = 18, color = "currentColor", stroke = 1.5, fill = "none" }) => {
  const s = { width: size, height: size, viewBox: "0 0 24 24", fill, stroke: color, strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    pin: <><path d="M12 21s-7-7.5-7-12a7 7 0 1114 0c0 4.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></>,
    camera: <><path d="M4 7h3l2-2h6l2 2h3a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1z"/><circle cx="12" cy="13" r="3.5"/></>,
    video: <><rect x="3" y="6" width="13" height="12" rx="1.5"/><path d="M16 10l5-3v10l-5-3z"/></>,
    play: <polygon points="6,4 20,12 6,20" fill={color} stroke="none"/>,
    search: <><circle cx="11" cy="11" r="6"/><path d="M21 21l-4.3-4.3"/></>,
    house: <><path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1v-9z"/></>,
    building: <><rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M11 21v-3h2v3"/></>,
    land: <><path d="M3 18l5-6 4 5 3-3 6 4"/><path d="M3 20h18"/><circle cx="7" cy="8" r="1.5"/></>,
    mountain: <><path d="M3 20l5-10 4 6 3-4 6 8z"/><circle cx="17" cy="6" r="1.5"/></>,
    shop: <><path d="M4 8l1.5-3h13L20 8"/><path d="M4 8v12a1 1 0 001 1h14a1 1 0 001-1V8"/><path d="M4 8h16M10 21v-5h4v5"/></>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="1.5"/><path d="M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M3 13h18"/></>,
    aperture: <><circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v8.5L20 17M12 20.5V12L4 17M3.5 10.5L12 12l7-5"/></>,
    door: <><rect x="6" y="3" width="12" height="18" rx="1"/><circle cx="14.5" cy="12" r="0.7" fill={color} stroke="none"/></>,
    tree: <><path d="M12 3c-3 0-5 2.5-5 5 0 2 1 3 1 3s-2 0-2 2.5c0 2.5 3 3 6 3s6-0.5 6-3c0-2.5-2-2.5-2-2.5s1-1 1-3c0-2.5-2-5-5-5z"/><path d="M12 16.5V21M10 21h4"/></>,
    leaf: <><path d="M21 3c-10 0-16 5-16 12 0 3 2 5 4 6M21 3c0 9-5 14-12 14"/></>,
    sparkle: <><path d="M12 3l1.5 5L19 10l-5.5 2L12 17l-1.5-5L5 10l5.5-2z"/><path d="M19 3.5l0.5 1.5L21 5.5l-1.5 0.5L19 7.5l-0.5-1.5L17 5.5l1.5-0.5z"/></>,
    send: <><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></>,
    checkCircle: <><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></>,
    check: <path d="M5 12l5 5L20 7"/>,
    heart: <path d="M12 20.5s-7.5-4.8-7.5-10A4.5 4.5 0 0112 6a4.5 4.5 0 017.5 4.5c0 5.2-7.5 10-7.5 10z"/>,
    bookmark: <path d="M6 3h12a1 1 0 011 1v17l-7-4-7 4V4a1 1 0 011-1z"/>,
    chat: <path d="M21 14a2 2 0 01-2 2H8l-4 4V5a2 2 0 012-2h13a2 2 0 012 2v9z"/>,
    whatsapp: <><path d="M20.52 3.48A11.95 11.95 0 0 0 12.04 0C5.46 0 .14 5.32.14 11.9c0 2.1.55 4.15 1.6 5.96L0 24l6.31-1.66a11.93 11.93 0 0 0 5.73 1.46h.01c6.58 0 11.9-5.32 11.9-11.9 0-3.18-1.24-6.17-3.43-8.42z" fill={color} strokeWidth="0"/><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.41-1.49-.89-.79-1.5-1.77-1.67-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.21-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.87 1.21 3.07.15.2 2.09 3.19 5.06 4.47.71.31 1.26.49 1.69.62.71.23 1.35.2 1.86.12.57-.08 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z" fill="#FFFFFF" strokeWidth="0"/></>,
    eye: <><path d="M1.5 12S5 5 12 5s10.5 7 10.5 7S19 19 12 19 1.5 12 1.5 12z"/><circle cx="12" cy="12" r="3"/></>,
    bell: <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></>,
    gear: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82 1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"/></>,
    chart: <><path d="M3 3v18h18"/><path d="M7 14l4-4 4 3 5-6"/></>,
    card: <><rect x="3" y="6" width="18" height="12" rx="1.5"/><path d="M3 10h18M7 15h3"/></>,
    help: <><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 3.5"/><circle cx="12" cy="17" r="0.6" fill={color} stroke="none"/></>,
    logout: <><path d="M9 21H5a1 1 0 01-1-1V4a1 1 0 011-1h4"/><path d="M16 17l5-5-5-5M21 12H9"/></>,
    calendar: <><rect x="3.5" y="5" width="17" height="16" rx="1.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/></>,
    brain: <><path d="M8 5a3 3 0 00-3 3 3 3 0 00-1 5 3 3 0 002 4 3 3 0 005 0V5.5A3 3 0 008 5z"/><path d="M16 5a3 3 0 013 3 3 3 0 011 5 3 3 0 01-2 4 3 3 0 01-5 0V5.5A3 3 0 0116 5z"/></>,
    arrowLeft: <><path d="M20 12H4M10 18l-6-6 6-6"/></>,
    arrowRight: <><path d="M4 12h16M14 6l6 6-6 6"/></>,
    chevronLeft: <path d="M15 18l-6-6 6-6"/>,
    chevronUp: <path d="M18 15l-6-6-6 6"/>,
    chevronDown: <path d="M6 9l6 6 6-6"/>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    reels: <><rect x="6" y="3" width="12" height="18" rx="2"/><polygon points="10,9 16,12 10,15" fill={color} stroke={color}/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 10-16 0"/></>,
    ruler: <><rect x="2" y="9" width="20" height="6" rx="1"/><path d="M6 9v3M10 9v4M14 9v3M18 9v4"/></>,
    bed: <><path d="M3 18V8M3 12h18v6M21 14V10a2 2 0 00-2-2h-6v4"/><circle cx="7" cy="11" r="1.5"/></>,
    bath: <><path d="M4 10V7a2 2 0 014 0v1M3 10h18v3a5 5 0 01-5 5H8a5 5 0 01-5-5v-3zM6 18l-1 3M18 18l1 3"/></>,
    car: <><path d="M5 17h14M3 13l2-5a2 2 0 012-2h10a2 2 0 012 2l2 5v4a1 1 0 01-1 1h-2a1 1 0 01-1-1v-1H7v1a1 1 0 01-1 1H4a1 1 0 01-1-1v-4z"/><circle cx="7.5" cy="16.5" r="1.2" fill={color} stroke="none"/><circle cx="16.5" cy="16.5" r="1.2" fill={color} stroke="none"/></>,
    sliders: <><path d="M4 6h10M18 6h2M4 12h6M14 12h6M4 18h12M20 18h0"/><circle cx="16" cy="6" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="18" cy="18" r="1.8"/></>,
    close: <path d="M18 6L6 18M6 6l12 12"/>,
    terrace: <><path d="M3 21h18M5 21V12l7-5 7 5v9M9 21v-6h6v6"/><path d="M3 12l9-7 9 7"/></>,
    pool: <><path d="M3 16c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2"/><path d="M3 20c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2"/><path d="M7 13V6a2 2 0 014 0v8M13 13V6a2 2 0 014 0"/></>,
    grill: <><path d="M5 7h14l-1.5 8a3 3 0 01-3 2.5h-5a3 3 0 01-3-2.5L5 7z"/><path d="M9 4v3M12 3v4M15 4v3M10 17l-1 4M14 17l1 4"/></>,
    storage: <><rect x="4" y="6" width="16" height="14" rx="1.5"/><path d="M4 11h16M9 6V3h6v3M9 16h6"/></>,
    gym: <><path d="M6 5v14M3 9v6M18 5v14M21 9v6M6 12h12"/></>,
    new: <><path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z"/><circle cx="18" cy="18" r="3"/><path d="M16.8 18l1 1 2-2.5"/></>,
    pencil: <><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z"/></>,
    star: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>,
    volume: <><path d="M3 10v4a1 1 0 001 1h4l5 5V4l-5 5H4a1 1 0 00-1 1z"/><path d="M16 7a5 5 0 010 10M19 3a9 9 0 010 18"/></>,
    volumeOff: <><path d="M3 10v4a1 1 0 001 1h4l5 5V4l-5 5H4a1 1 0 00-1 1z"/><path d="M22 9l-5 5M22 14l-5-5"/></>,
    trash: <><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></>,
    share: <><circle cx="18" cy="5" r="2.4"/><circle cx="6" cy="12" r="2.4"/><circle cx="18" cy="19" r="2.4"/><path d="M8.2 10.8l7.6-4.1M8.2 13.2l7.6 4.1"/></>,
    dots: <><circle cx="12" cy="6" r="1.4" fill={color} stroke="none"/><circle cx="12" cy="12" r="1.4" fill={color} stroke="none"/><circle cx="12" cy="18" r="1.4" fill={color} stroke="none"/></>,
  };
  return <svg {...s} style={{display:"block",flexShrink:0}}>{paths[name]}</svg>;
};

// ── Portada de tarjeta ──
// Casi todo lo que llega del publicador trae video pero ninguna foto. En vez de
// mostrar "Sin portada", usamos el primer cuadro del propio video: el fragmento
// #t=0.5 con preload="metadata" baja solo ese frame, no el clip entero.
// El placeholder queda solo para avisos sin foto NI video.
const CoverMedia = ({ p, alt = "", iconSize = 28, labelSize = 8.5, showLabel = true }) => {
  const fit = { width:"100%", height:"100%", objectFit:"cover", display:"block" };
  if (p?.img) return <img src={p.img} alt={alt} loading="lazy" style={fit}/>;
  const video = propVideoSrc(p);
  if (video) {
    return (
      <video
        src={`${video}#t=0.5`}
        preload="metadata"
        muted
        playsInline
        tabIndex={-1}
        aria-hidden="true"
        style={{...fit, background:"#000", pointerEvents:"none"}}
      />
    );
  }
  return (
    <div style={{width:"100%",height:"100%",background:`linear-gradient(135deg, ${C.brandWash} 0%, ${C.surface} 100%)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6}}>
      <Icon name={typeIcon(p?.type)} size={iconSize} color={C.brand} stroke={1.3}/>
      {showLabel && <span style={{fontSize:labelSize,color:C.muted,fontFamily:Fb,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase"}}>Sin portada</span>}
    </div>
  );
};

// ── Google Maps loader hook + components ──
const GMAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

function useGoogleMaps() {
  const isReady = () => typeof window !== "undefined" && !!window.google?.maps?.Map && !!window.google?.maps?.places?.Autocomplete;
  const [loaded, setLoaded] = useState(isReady());
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isReady()) { setLoaded(true); return; }
    if (!GMAPS_KEY) { console.warn("VITE_GOOGLE_MAPS_API_KEY not set"); return; }
    // Poll until both Map class and Places library are fully ready (works with async loading)
    const startPolling = () => {
      const wait = setInterval(() => {
        if (isReady()) { setLoaded(true); clearInterval(wait); }
      }, 100);
      // Safety timeout 15s
      setTimeout(() => clearInterval(wait), 15000);
      return () => clearInterval(wait);
    };
    if (document.getElementById("google-maps-script")) return startPolling();
    const script = document.createElement("script");
    script.id = "google-maps-script";
    // No loading=async here — we want Map constructor available on script load
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GMAPS_KEY}&libraries=places&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onerror = () => console.error("Failed to load Google Maps");
    document.head.appendChild(script);
    return startPolling();
  }, []);
  return loaded;
}

// Custom map styling that matches our editorial brand palette
const MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#F7F3EC" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#837A70" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#F7F3EC" }] },
  { featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{ color: "#A8A096" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#837A70" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#E5EDE6" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#FFFFFF" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#F1EBE1" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#ECE5D8" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#C4D9E0" }] },
];

// `approximate`: dibuja un círculo de `radius` metros en vez del pin exacto y
// limita el zoom, para no revelar la dirección. Es el modo obligatorio en las
// vistas públicas; el pin exacto queda solo para el dueño (wizard de publicar).
function MapView({ lat, lng, zoom = 15, height = 200, address = "", approximate = false, radius = APPROX_RADIUS_M }) {
  const ref = useRef(null);
  const loaded = useGoogleMaps();
  useEffect(() => {
    if (!loaded || !ref.current || typeof lat !== "number" || typeof lng !== "number") return;
    const map = new window.google.maps.Map(ref.current, {
      center: { lat, lng },
      zoom,
      disableDefaultUI: true,
      zoomControl: true,
      styles: MAP_STYLE,
      gestureHandling: "cooperative",
      ...(approximate ? { maxZoom: 15 } : {}),
    });
    if (approximate) {
      new window.google.maps.Circle({
        map,
        center: { lat, lng },
        radius,
        fillColor: "#4A3122",
        fillOpacity: 0.16,
        strokeColor: "#4A3122",
        strokeOpacity: 0.55,
        strokeWeight: 1.5,
        clickable: false,
      });
      return;
    }
    // Custom branded pin
    new window.google.maps.Marker({
      position: { lat, lng },
      map,
      icon: {
        path: "M12 21s-7-7.5-7-12a7 7 0 1114 0c0 4.5-7 12-7 12z",
        fillColor: "#4A3122",
        fillOpacity: 1,
        strokeColor: "#FFFFFF",
        strokeWeight: 1.5,
        scale: 1.8,
        anchor: new window.google.maps.Point(12, 21),
      },
      title: address,
    });
  }, [loaded, lat, lng, zoom, address, approximate, radius]);

  if (!GMAPS_KEY) {
    return (
      <div style={{height,borderRadius:12,background:C.brandWash,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:6}}>
        <Logo size={28}/>
        <span style={{fontSize:11,color:C.muted,fontFamily:Fb,fontWeight:500}}>Mapa — {address}</span>
      </div>
    );
  }
  if (!loaded) {
    return (
      <div style={{height,borderRadius:12,background:C.brandWash,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <span style={{fontSize:11,color:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.04em"}}>Cargando mapa…</span>
      </div>
    );
  }
  return <div ref={ref} style={{width:"100%",height,borderRadius:12,overflow:"hidden"}}/>;
}

// Interactive map: user taps anywhere to drop a pin; pin is draggable to refine.
// Calls onPinPlaced({lat,lng,address,comuna}) whenever the pin moves.
function InteractiveMap({ lat, lng, height = 320, onPinPlaced, defaultCenter = {lat:-33.4489, lng:-70.6693} }) {
  const ref = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const loaded = useGoogleMaps();
  const [hasPin, setHasPin] = useState(typeof lat === "number" && typeof lng === "number");
  const [busy, setBusy] = useState(false);
  // Keep latest onPinPlaced callback accessible from closures
  const onPinPlacedRef = useRef(onPinPlaced);
  useEffect(() => { onPinPlacedRef.current = onPinPlaced; }, [onPinPlaced]);

  // Reverse-geocode helper — given lat/lng, fetch address + comuna
  const reverseGeocode = (rLat, rLng, cb) => {
    if (!window.google?.maps?.Geocoder) return cb(null);
    const g = new window.google.maps.Geocoder();
    g.geocode({ location: { lat: rLat, lng: rLng } }, (results, status) => {
      if (status !== "OK" || !results || !results[0]) return cb(null);
      const r = results[0];
      let comuna = "";
      (r.address_components || []).forEach(c => {
        if (!comuna && (c.types.includes("administrative_area_level_3") || c.types.includes("locality"))) {
          comuna = c.long_name;
        }
      });
      cb({ address: r.formatted_address, comuna });
    });
  };

  // Branded pin — uses a self-contained SVG data URL (guaranteed visible across all maps)
  const buildPinIcon = () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="52" viewBox="0 0 40 52"><defs><filter id="s" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.4"/></filter></defs><path d="M20 0C9 0 0 9 0 20c0 14 20 32 20 32s20-18 20-32C40 9 31 0 20 0z" fill="%23A65547" stroke="%23FFFFFF" stroke-width="3" filter="url(%23s)"/><circle cx="20" cy="20" r="7" fill="%23FFFFFF"/></svg>`;
    return {
      url: `data:image/svg+xml;utf8,${svg}`,
      scaledSize: new window.google.maps.Size(40, 52),
      anchor: new window.google.maps.Point(20, 52),
    };
  };

  // Drop or move the pin to latLng + notify parent
  const placeOrMovePin = (latLng) => {
    if (!mapRef.current) return;
    const newLat = typeof latLng.lat === "function" ? latLng.lat() : latLng.lat;
    const newLng = typeof latLng.lng === "function" ? latLng.lng() : latLng.lng;
    setBusy(true);
    if (markerRef.current) {
      markerRef.current.setPosition({ lat: newLat, lng: newLng });
      markerRef.current.setAnimation(window.google.maps.Animation.DROP);
    } else {
      markerRef.current = new window.google.maps.Marker({
        position: { lat: newLat, lng: newLng },
        map: mapRef.current,
        draggable: true,
        animation: window.google.maps.Animation.DROP,
        icon: buildPinIcon(),
        cursor: "grab",
      });
      markerRef.current.addListener("dragend", (ev) => {
        const ll = ev.latLng;
        setBusy(true);
        reverseGeocode(ll.lat(), ll.lng(), (info) => {
          onPinPlacedRef.current && onPinPlacedRef.current({ lat: ll.lat(), lng: ll.lng(), address: info?.address || "", comuna: info?.comuna || "" });
          setBusy(false);
        });
      });
    }
    setHasPin(true);
    reverseGeocode(newLat, newLng, (info) => {
      onPinPlacedRef.current && onPinPlacedRef.current({ lat: newLat, lng: newLng, address: info?.address || "", comuna: info?.comuna || "" });
      setBusy(false);
    });
  };

  // Use device geolocation to drop pin at current location
  const useMyLocation = () => {
    if (!navigator.geolocation) { alert("Tu navegador no soporta geolocalización"); return; }
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (mapRef.current) {
          mapRef.current.setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          mapRef.current.setZoom(17);
        }
        placeOrMovePin({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => { setBusy(false); alert("No pudimos obtener tu ubicación: " + (err.message || "permiso denegado")); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Initial map setup
  useEffect(() => {
    if (!loaded || !ref.current || mapRef.current) return;
    const hasInitial = typeof lat === "number" && typeof lng === "number";
    const center = hasInitial ? { lat, lng } : defaultCenter;
    const map = new window.google.maps.Map(ref.current, {
      center,
      zoom: hasInitial ? 17 : 12,
      disableDefaultUI: true,
      zoomControl: true,
      styles: MAP_STYLE,
      gestureHandling: "greedy",
      clickableIcons: false,
      mapTypeControl: false,
      streetViewControl: false,
    });
    mapRef.current = map;

    // Initial marker if coords provided
    if (hasInitial) {
      markerRef.current = new window.google.maps.Marker({
        position: center,
        map,
        draggable: true,
        animation: window.google.maps.Animation.DROP,
        icon: buildPinIcon(),
        cursor: "grab",
      });
      markerRef.current.addListener("dragend", (ev) => {
        const ll = ev.latLng;
        setBusy(true);
        reverseGeocode(ll.lat(), ll.lng(), (info) => {
          onPinPlacedRef.current && onPinPlacedRef.current({ lat: ll.lat(), lng: ll.lng(), address: info?.address || "", comuna: info?.comuna || "" });
          setBusy(false);
        });
      });
    }

    // Click ANYWHERE on the map to drop / move pin (works on mobile tap + desktop click)
    map.addListener("click", (ev) => placeOrMovePin(ev.latLng));
  }, [loaded]);

  // Recenter & move marker when external lat/lng change
  useEffect(() => {
    if (!loaded || !mapRef.current || typeof lat !== "number" || typeof lng !== "number") return;
    const pos = { lat, lng };
    mapRef.current.panTo(pos);
    if (markerRef.current) markerRef.current.setPosition(pos);
  }, [lat, lng, loaded]);

  if (!GMAPS_KEY) {
    return (
      <div style={{height,borderRadius:12,background:C.brandWash,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <span style={{fontSize:11,color:C.muted,fontFamily:Fb,fontWeight:500}}>Google Maps no configurado</span>
      </div>
    );
  }
  if (!loaded) {
    return (
      <div style={{height,borderRadius:12,background:C.brandWash,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <span style={{fontSize:11,color:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.04em"}}>Cargando mapa…</span>
      </div>
    );
  }
  return (
    <div style={{position:"relative",width:"100%",borderRadius:14,overflow:"hidden",border:`1px solid ${C.line}`}}>
      <div ref={ref} style={{width:"100%",height,cursor:"crosshair"}}/>

      {/* "Toca para marcar" hint — desaparece cuando hay pin */}
      {!hasPin && (
        <div style={{position:"absolute",top:14,left:14,right:14,padding:"10px 14px",borderRadius:999,background:"rgba(74,49,34,0.94)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",gap:9,boxShadow:"0 6px 18px rgba(28,26,23,0.3)",pointerEvents:"none",animation:"pulseHint 1.8s ease-in-out infinite"}}>
          <style>{`@keyframes pulseHint { 0%,100%{opacity:0.94} 50%{opacity:0.7} }`}</style>
          <Icon name="pin" size={15} color={C.surface} stroke={2}/>
          <span style={{fontSize:12,color:C.surface,fontFamily:Fb,fontWeight:500,letterSpacing:"0.01em"}}>Toca el mapa para marcar la ubicación</span>
        </div>
      )}

      {/* Status when pin is placed */}
      {hasPin && (
        <div style={{position:"absolute",top:14,left:14,right:14,padding:"9px 14px",borderRadius:999,background:"rgba(45,74,55,0.94)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",gap:9,boxShadow:"0 6px 18px rgba(28,26,23,0.25)",pointerEvents:"none"}}>
          <Icon name="checkCircle" size={14} color={C.surface} stroke={2}/>
          <span style={{fontSize:11.5,color:C.surface,fontFamily:Fb,fontWeight:500,letterSpacing:"0.01em"}}>{busy?"Buscando dirección…":"Pin colocado — arrástralo para ajustar"}</span>
        </div>
      )}

      {/* "Mi ubicación" floating button */}
      <button onClick={useMyLocation} disabled={busy} style={{position:"absolute",bottom:14,right:14,width:42,height:42,borderRadius:"50%",background:C.surface,border:`1px solid ${C.line}`,cursor:busy?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 12px rgba(28,26,23,0.2)"}} title="Usar mi ubicación actual">
        <Icon name="pin" size={18} color={C.brand} stroke={1.8}/>
      </button>
    </div>
  );
}

// Map showing multiple property pins — Airbnb-style search by location.
// Each pin shows price; clicking opens the property detail.
function PropertiesMap({ properties = [], onSelectProperty, height = 380 }) {
  const ref = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const loaded = useGoogleMaps();
  // Mapa público: cada aviso se ubica en su centro APROXIMADO, nunca en el pin real.
  const validProps = properties
    .map(p => { const c = approxLatLng(p); return c ? { ...p, lat: c.lat, lng: c.lng } : null; })
    .filter(Boolean);

  useEffect(() => {
    if (!loaded || !ref.current || mapRef.current) return;
    // Default center: Santiago. Fit bounds to all valid markers below.
    const map = new window.google.maps.Map(ref.current, {
      center: { lat: -33.4489, lng: -70.6693 },
      zoom: 11,
      disableDefaultUI: true,
      zoomControl: true,
      styles: MAP_STYLE,
      gestureHandling: "greedy",
      clickableIcons: false,
      maxZoom: 15, // sin zoom de calle: el punto es aproximado
    });
    mapRef.current = map;
  }, [loaded]);

  // Refresh markers when properties change
  useEffect(() => {
    if (!loaded || !mapRef.current) return;
    // Clear previous markers
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];
    if (validProps.length === 0) return;
    const bounds = new window.google.maps.LatLngBounds();
    validProps.forEach(p => {
      const priceLabel = `${p.cur} ${p.cur==="UF" ? Math.round(p.price).toLocaleString("es-CL") : Math.round(p.price/1000000)+"M"}`;
      // Custom DOM-like marker using Marker with custom icon (price chip)
      // For better visuals: encode a small SVG bubble
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="36" viewBox="0 0 80 36"><path d="M40 32 L34 28 H8 a6 6 0 0 1 -6 -6 V8 a6 6 0 0 1 6 -6 H72 a6 6 0 0 1 6 6 V22 a6 6 0 0 1 -6 6 H46 L40 32 Z" fill="%234A3122" stroke="%23FFFFFF" stroke-width="2"/><text x="40" y="18" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="%23FFFFFF">${priceLabel}</text></svg>`;
      const marker = new window.google.maps.Marker({
        position: { lat: p.lat, lng: p.lng },
        map: mapRef.current,
        title: p.title,
        icon: {
          url: `data:image/svg+xml;utf8,${svg}`,
          anchor: new window.google.maps.Point(40, 32),
          scaledSize: new window.google.maps.Size(80, 36),
        },
      });
      marker.addListener("click", () => onSelectProperty && onSelectProperty(p));
      markersRef.current.push(marker);
      // Halo de privacidad: comunica que la ubicación es aproximada.
      const halo = new window.google.maps.Circle({
        map: mapRef.current,
        center: { lat: p.lat, lng: p.lng },
        radius: APPROX_RADIUS_M,
        fillColor: "#4A3122",
        fillOpacity: 0.12,
        strokeColor: "#4A3122",
        strokeOpacity: 0.4,
        strokeWeight: 1,
        clickable: false,
      });
      markersRef.current.push(halo);
      bounds.extend({ lat: p.lat, lng: p.lng });
    });
    // Fit map to all markers
    if (validProps.length === 1) {
      mapRef.current.setCenter({ lat: validProps[0].lat, lng: validProps[0].lng });
      mapRef.current.setZoom(13);
    } else {
      mapRef.current.fitBounds(bounds, { top:40, left:40, right:40, bottom:40 });
    }
  }, [loaded, validProps.length, validProps.map(p=>p.id).join(",")]);

  if (!GMAPS_KEY) {
    return <div style={{height,borderRadius:14,background:C.brandWash,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:11,color:C.muted,fontFamily:Fb,fontWeight:500}}>Google Maps no configurado</span></div>;
  }
  if (!loaded) {
    return <div style={{height,borderRadius:14,background:C.brandWash,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:11,color:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.04em"}}>Cargando mapa…</span></div>;
  }
  return <div ref={ref} style={{width:"100%",height,borderRadius:14,overflow:"hidden",border:`1px solid ${C.line}`}}/>;
}

function AddressAutocomplete({ value, onChange, onSelect, placeholder, style }) {
  const inputRef = useRef(null);
  const loaded = useGoogleMaps();
  useEffect(() => {
    if (!loaded || !inputRef.current || !window.google?.maps?.places) return;
    const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "cl" },
      fields: ["address_components", "formatted_address", "geometry", "name"],
    });
    const listener = ac.addListener("place_changed", () => {
      const p = ac.getPlace();
      if (!p.geometry || !p.geometry.location) return;
      // Find comuna (administrative_area_level_3 or locality)
      let comuna = "";
      let region = "";
      (p.address_components || []).forEach(c => {
        if (c.types.includes("administrative_area_level_3") || c.types.includes("locality")) {
          if (!comuna) comuna = c.long_name;
        }
        if (c.types.includes("administrative_area_level_1")) region = c.long_name;
      });
      onSelect && onSelect({
        address: p.formatted_address || p.name,
        comuna,
        region,
        lat: p.geometry.location.lat(),
        lng: p.geometry.location.lng(),
      });
    });
    return () => { if (window.google?.maps?.event && listener) window.google.maps.event.removeListener(listener); };
  }, [loaded]);
  return (
    <input
      ref={inputRef}
      type="text"
      value={value || ""}
      onChange={e => onChange && onChange(e.target.value)}
      placeholder={placeholder || "Empieza a escribir tu dirección..."}
      style={style}
    />
  );
}

// ── Nav ──
// ── Botón flotante "Mi asistente IA" — siempre visible en properties ──
// Click → abre asistente Isidora en el shell C2C (/tasar?view=comprador)
const SHELL_URL = import.meta.env.VITE_SHELL_URL || "https://c2cprops.com";
// Botón flotante que abre el chat de Isidora inline (sin sacar de la página).
// Estilo tipo widget WhatsApp/Joinchat: pill dorada abajo derecha, click abre chat popup.
function FloatingAssistant({ onOpen }) {
  return (
    <button
      onClick={onOpen}
      title="Asesor de compra — Isidora te ayuda"
      style={{
        position: "fixed",
        bottom: 78,
        right: 18,
        height: 52,
        padding: "0 18px 0 14px",
        borderRadius: 26,
        background: `linear-gradient(135deg, ${C.brand} 0%, ${C.brandSoft} 100%)`,
        boxShadow: `0 6px 20px ${C.brand}40, 0 0 0 4px ${C.surface}`,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        gap: 9,
        cursor: "pointer",
        border: "none",
        fontFamily: "inherit",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
        e.currentTarget.style.boxShadow = `0 10px 28px ${C.brand}60, 0 0 0 4px ${C.surface}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = `0 6px 20px ${C.brand}40, 0 0 0 4px ${C.surface}`;
      }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.surface} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        <circle cx="9" cy="11.5" r="1" fill={C.surface}/>
        <circle cx="13" cy="11.5" r="1" fill={C.surface}/>
        <circle cx="17" cy="11.5" r="1" fill={C.surface}/>
      </svg>
      <span style={{
        color: C.surface,
        fontFamily: Fb,
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: "0.01em",
        whiteSpace: "nowrap",
      }}>Asesor de compra</span>
      <span style={{
        position: "absolute",
        top: -3,
        right: -3,
        width: 12,
        height: 12,
        borderRadius: "50%",
        background: C.terracotta,
        border: `2px solid ${C.surface}`,
        animation: "pulse 2s infinite",
      }}/>
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.85; }
        }
      `}</style>
    </button>
  );
}

// ─── Chat popup inline con Isidora (asesora de compra IA) ───────────────
// Estilo tipo widget WhatsApp/Joinchat: header dorado, mensajes en burbujas,
// preguntas guiadas con botones. Al terminar aplica filtros al feed o abre WhatsApp.
function IsidoraChat({ onClose, onApplyFilters }) {
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState({});
  const [msgs, setMsgs] = React.useState([
    { from: "isi", text: "¡Hola! Soy Isidora 👋 tu asesora de compra de C2C." },
    { from: "isi", text: "Contame en 30 segundos qué buscás y te muestro las mejores opciones." },
  ]);
  const listRef = React.useRef(null);
  React.useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [msgs]);

  const pushIsi  = (t) => setMsgs(m => [...m, { from: "isi", text: t }]);
  const pushUser = (t) => setMsgs(m => [...m, { from: "user", text: t }]);
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const askNext = async (userText, isiTexts, nextStep, patch = {}) => {
    pushUser(userText);
    setAnswers(a => ({ ...a, ...patch }));
    await sleep(400);
    for (const t of isiTexts) { pushIsi(t); await sleep(500); }
    setStep(nextStep);
  };

  // Preguntas guiadas
  const questions = [
    {
      key: "operacion",
      text: "¿Buscás para comprar o para arrendar?",
      options: [
        { label: "🏷️ Comprar", value: "venta" },
        { label: "🔑 Arrendar", value: "arriendo" },
      ],
    },
    {
      key: "tipo",
      text: "¿Qué tipo de propiedad?",
      options: [
        { label: "🏠 Casa", value: "Casa" },
        { label: "🏢 Departamento", value: "Departamento" },
        { label: "🌾 Parcela", value: "Parcela" },
        { label: "🏬 Sitio", value: "Sitio" },
        { label: "🤔 No lo sé aún", value: "" },
      ],
    },
    {
      key: "comuna",
      text: "¿En qué comuna te interesa?",
      type: "text",
      placeholder: "Ej: Vitacura, Las Condes",
    },
    {
      key: "presupuesto",
      text: "¿Cuál es tu presupuesto máximo?",
      options: [
        { label: "Hasta UF 3.000", value: 3000 },
        { label: "UF 3.000 – 6.000", value: 6000 },
        { label: "UF 6.000 – 10.000", value: 10000 },
        { label: "Más de UF 10.000", value: 25000 },
        { label: "Sin límite", value: 0 },
      ],
    },
    {
      key: "beds",
      text: "¿Cuántos dormitorios mínimo?",
      options: [
        { label: "Indiferente", value: 0 },
        { label: "1+", value: 1 },
        { label: "2+", value: 2 },
        { label: "3+", value: 3 },
        { label: "4+", value: 4 },
      ],
    },
  ];

  const q = questions[step];
  const isDone = step >= questions.length;

  // Cuando termina, aplicar filtros y mostrar resumen
  React.useEffect(() => {
    if (isDone && !answers._applied) {
      const a = answers;
      const summary = [
        a.tipo && `Tipo: ${a.tipo}`,
        a.comuna && `Comuna: ${a.comuna}`,
        a.presupuesto ? `Hasta UF ${a.presupuesto.toLocaleString('es-CL')}` : "Sin límite de precio",
        a.beds ? `${a.beds}+ dormitorios` : "Cualquier cantidad de dorms",
      ].filter(Boolean).join(" · ");
      setTimeout(() => {
        pushIsi(`Listo, buscando ${a.operacion === 'arriendo' ? 'para arriendo' : 'para comprar'}: ${summary}`);
        setTimeout(() => pushIsi("Filtré el feed con tus preferencias. Deslizá abajo para ver las propiedades que coinciden 👇"), 700);
      }, 300);
      setAnswers(a => ({ ...a, _applied: true }));
      // Aplicar los filtros al feed en el componente padre
      if (onApplyFilters) {
        onApplyFilters({
          operacion: a.operacion || "venta",
          tipo: a.tipo || "",
          comuna: a.comuna || "",
          presupuestoMax: a.presupuesto || 0,
          beds: a.beds || 0,
        });
      }
    }
  }, [isDone]);

  return (
    <div style={{
      position: "fixed",
      bottom: 140,
      right: 18,
      width: 380,
      maxWidth: "calc(100vw - 24px)",
      height: 540,
      maxHeight: "calc(100vh - 160px)",
      background: C.surface,
      borderRadius: 18,
      boxShadow: `0 20px 60px rgba(0,0,0,0.35), 0 0 0 1px ${C.line}`,
      zIndex: 300,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      animation: "chatSlideIn 0.25s ease",
    }}>
      <style>{`
        @keyframes chatSlideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bubbleIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${C.brand} 0%, ${C.brandSoft} 100%)`,
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: "50%",
          background: C.surface,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: Fs, fontSize: 20, fontWeight: 500, color: C.brand,
          flexShrink: 0,
        }}>I</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: Fs, fontSize: 16, fontWeight: 500, color: C.surface, letterSpacing: "-0.01em" }}>Isidora</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", fontFamily: Fb, display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }}/>
            En línea · Asesora de compra
          </div>
        </div>
        <button onClick={onClose} style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "rgba(255,255,255,0.2)",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: C.surface, fontSize: 18, fontWeight: 400,
        }}>×</button>
      </div>

      {/* Mensajes */}
      <div ref={listRef} style={{
        flex: 1,
        overflowY: "auto",
        padding: "16px 14px",
        background: C.bg,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}>
        {msgs.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.from === "isi" ? "flex-start" : "flex-end",
            maxWidth: "82%",
            padding: "9px 13px",
            borderRadius: m.from === "isi" ? "14px 14px 14px 4px" : "14px 14px 4px 14px",
            background: m.from === "isi" ? C.surface : C.brand,
            color: m.from === "isi" ? C.ink : C.surface,
            fontSize: 13.5,
            fontFamily: Fb,
            lineHeight: 1.4,
            boxShadow: `0 1px 2px rgba(0,0,0,0.06)`,
            animation: "bubbleIn 0.25s ease",
          }}>{m.text}</div>
        ))}
      </div>

      {/* Área de input / botones de pregunta */}
      <div style={{
        padding: "10px 12px",
        background: C.surface,
        borderTop: `1px solid ${C.line}`,
      }}>
        {!isDone && q && q.type !== "text" && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {q.options.map(opt => (
              <button key={String(opt.value)} onClick={() => askNext(opt.label, [], step + 1, { [q.key]: opt.value }).then(() => {
                const nq = questions[step + 1];
                if (nq) setTimeout(() => pushIsi(nq.text), 500);
              })} style={{
                padding: "8px 14px", borderRadius: 999,
                background: C.brandWash, border: `1px solid ${C.line}`,
                color: C.ink, fontSize: 12.5, fontWeight: 500,
                fontFamily: Fb, cursor: "pointer",
              }}>{opt.label}</button>
            ))}
          </div>
        )}
        {!isDone && q && q.type === "text" && (
          <ChatTextInput placeholder={q.placeholder} onSend={(val) => {
            if (!val.trim()) return;
            askNext(val, [], step + 1, { [q.key]: val.trim() }).then(() => {
              const nq = questions[step + 1];
              if (nq) setTimeout(() => pushIsi(nq.text), 500);
            });
          }} />
        )}
        {isDone && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <button onClick={onClose} style={{
              padding: "10px 14px", borderRadius: 10,
              background: C.brand, border: "none", color: C.surface,
              fontSize: 13, fontWeight: 600, fontFamily: Fb, cursor: "pointer",
            }}>Ver propiedades →</button>
            <a href={`https://wa.me/56986420055?text=${encodeURIComponent("Hola, vengo de C2C props y quiero más ayuda para buscar propiedad")}`} target="_blank" rel="noreferrer" style={{
              padding: "9px 14px", borderRadius: 10,
              background: "transparent", border: `1px solid ${C.line}`, color: C.text,
              fontSize: 12.5, fontWeight: 500, fontFamily: Fb, cursor: "pointer",
              textDecoration: "none", textAlign: "center",
            }}>💬 Prefiero hablar por WhatsApp</a>
          </div>
        )}
        <div style={{ fontSize: 9.5, color: C.muted, fontFamily: Fb, marginTop: 8, textAlign: "center", letterSpacing: "0.06em", textTransform: "uppercase" }}>Powered by C2C · Asistente IA</div>
      </div>

      {/* Trigger inicial: cuando se abre el chat, mostrar la primera pregunta */}
      <FirstQuestionTrigger step={step} q={q} pushIsi={pushIsi} msgs={msgs} />
    </div>
  );
}

// Small helper: input de texto para preguntas tipo texto
function ChatTextInput({ placeholder, onSend }) {
  const [val, setVal] = React.useState("");
  return (
    <div style={{ display: "flex", gap: 6 }}>
      <input
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") { onSend(val); setVal(""); } }}
        placeholder={placeholder || "Escribí tu respuesta…"}
        style={{
          flex: 1, padding: "10px 12px", borderRadius: 999,
          background: C.brandWash, border: `1px solid ${C.line}`,
          color: C.ink, fontSize: 13, fontFamily: Fb, outline: "none",
        }}
      />
      <button onClick={() => { onSend(val); setVal(""); }} disabled={!val.trim()} style={{
        width: 40, height: 40, borderRadius: "50%",
        background: val.trim() ? C.brand : C.line,
        border: "none", cursor: val.trim() ? "pointer" : "default",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: C.surface, fontSize: 16,
      }}>→</button>
    </div>
  );
}

// Efecto: cuando cambia el step, si es la primera vez que se pide una pregunta, mostrarla
function FirstQuestionTrigger({ step, q, pushIsi, msgs }) {
  React.useEffect(() => {
    if (!q) return;
    // Solo pushear la pregunta si aún no está en los mensajes
    const alreadyAsked = msgs.some(m => m.from === "isi" && m.text === q.text);
    if (!alreadyAsked && step === 0) {
      setTimeout(() => pushIsi(q.text), 800);
    }
  }, [step]);
  return null;
}

function Nav({active,go}) {
  // Tab 'sell' removido — la venta vive en el shell C2C (HOME → Quiero vender)
  // y arranca en greatdeal-app (fotos/videos) → tasar → publicar
  const items=[
    {id:"feed",l:"Explorar",icon:"grid"},
    {id:"reels",l:"Reels",icon:"reels"},
    {id:"saved",l:"Guardados",icon:"bookmark"},
    {id:"profile",l:"Perfil",icon:"user"},
  ];
  return (
    <nav style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,zIndex:100,background:"rgba(10,10,11,0.92)",backdropFilter:"blur(20px)",borderTop:`1px solid ${C.line}`,display:"flex",justifyContent:"space-around",alignItems:"center",padding:"6px 0 env(safe-area-inset-bottom,8px)"}}>
      {items.map(i=>i.special?(
        <button key={i.id} onClick={()=>go(i.id)} style={{width:44,height:44,borderRadius:14,background:C.ink,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 6px 18px ${C.ink}30`,marginTop:-6}}>
          <Icon name="plus" size={20} color={C.surface} stroke={1.8} />
        </button>
      ):(
        <button key={i.id} onClick={()=>go(i.id)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"8px 10px",color:active===i.id?C.ink:C.subtle,transition:"color 0.15s"}}>
          <Icon name={i.icon} size={21} color={active===i.id?C.ink:C.subtle} stroke={1.5} />
          <span style={{fontSize:9.5,fontWeight:500,fontFamily:Fb,letterSpacing:"0.02em"}}>{i.l}</span>
        </button>
      ))}
    </nav>
  );
}

// ── Header ──
function Header({sub,onNotif}) {
  const [open,setOpen]=useState(false);
  const [aiOpen,setAiOpen]=useState(false);
  const unreadCount = NOTIFS.filter(n=>n.unread).length;
  const SHELL = (typeof window !== "undefined" && (import.meta.env.VITE_SHELL_URL || "https://c2cprops.com")) || "";
  return (
    <div style={{position:"sticky",top:0,zIndex:50,background:"rgba(10,10,11,0.88)",backdropFilter:"blur(20px)",borderBottom:`1px solid ${C.line}`,padding:"12px 18px 10px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
      <a href={SHELL || "/"} style={{display:"flex",alignItems:"center",gap:8,textDecoration:"none",color:"inherit"}} title="Volver al inicio C2C">
        <div style={{display:"flex",flexDirection:"column",lineHeight:1}}>
          <span style={{fontFamily:Fs,fontSize:22,fontWeight:500,color:C.ink,letterSpacing:"-0.5px"}}>C<em style={{fontStyle:"italic",color:C.brand,fontWeight:400}}>2</em>C</span>
          <span style={{color:C.muted,fontSize:9,letterSpacing:"0.2em",marginTop:3,fontWeight:400}}>property market</span>
        </div>
      </a>
      <nav style={{display:"flex",alignItems:"center",gap:4,position:"relative"}}>
        <a href={`${SHELL}/comprar`} style={{color:C.text,padding:"6px 12px",borderRadius:999,fontSize:12,fontWeight:500,letterSpacing:"0.03em",textDecoration:"none",fontFamily:Fb}}>Comprar</a>
        <a href={`${SHELL}/vender`} style={{color:C.text,padding:"6px 12px",borderRadius:999,fontSize:12,fontWeight:500,letterSpacing:"0.03em",textDecoration:"none",fontFamily:Fb}}>Publicar</a>
        <button onClick={(e)=>{e.stopPropagation();setAiOpen(!aiOpen)}} style={{display:"inline-flex",alignItems:"center",gap:5,color:C.text,background:`rgba(74,49,34,0.04)`,border:`1px solid rgba(74,49,34,0.18)`,padding:"6px 12px",borderRadius:999,fontSize:12,fontWeight:500,letterSpacing:"0.03em",cursor:"pointer",fontFamily:Fb}}>
          <span style={{color:C.brand,fontSize:11}}>✦</span> Mi asistente IA <span style={{fontSize:9,transform:aiOpen?"rotate(180deg)":"none",transition:"transform 0.2s"}}>▾</span>
        </button>
        {aiOpen && <>
          <div onClick={()=>setAiOpen(false)} style={{position:"fixed",inset:0,zIndex:200,background:"transparent"}}/>
          <div style={{position:"absolute",top:"calc(100% + 8px)",right:0,minWidth:240,background:C.surface,border:`1px solid ${C.line}`,borderRadius:14,padding:8,boxShadow:`0 16px 40px ${C.ink}25`,zIndex:201}}>
            <a href={`${SHELL}/tasar?view=comprador`} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 12px",borderRadius:10,textDecoration:"none",color:C.text}}>
              <span style={{fontSize:18,lineHeight:1}}>🔍</span>
              <div>
                <div style={{fontFamily:Fs,fontSize:14,fontWeight:500,color:C.ink}}>Ayuda en tu compra</div>
                <div style={{fontSize:10.5,color:C.muted,fontFamily:Fb,marginTop:2}}>Isidora te asesora</div>
              </div>
            </a>
            <a href={`${SHELL}/tasar?view=vendedor`} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 12px",borderRadius:10,textDecoration:"none",color:C.text}}>
              <span style={{fontSize:18,lineHeight:1}}>🏡</span>
              <div>
                <div style={{fontFamily:Fs,fontSize:14,fontWeight:500,color:C.ink}}>Ayuda en tu venta</div>
                <div style={{fontSize:10.5,color:C.muted,fontFamily:Fb,marginTop:2}}>Valentina tasa gratis</div>
              </div>
            </a>
            <a href="https://vender.c2cprops.com/?mode=editor" style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 12px",borderRadius:10,textDecoration:"none",color:C.text}}>
              <span style={{fontSize:18,lineHeight:1}}>🎬</span>
              <div>
                <div style={{fontFamily:Fs,fontSize:14,fontWeight:500,color:C.ink}}>Editor de videos</div>
                <div style={{fontSize:10.5,color:C.muted,fontFamily:Fb,marginTop:2}}>Armá tu reel y descargalo</div>
              </div>
            </a>
          </div>
        </>}
      </nav>
      <button onClick={()=>setOpen(!open)} style={{width:36,height:36,borderRadius:"50%",background:C.surface,border:`1px solid ${C.line}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",flexShrink:0}}>
        <Icon name="bell" size={16} color={C.text} stroke={1.5} />
        {unreadCount>0 && <div style={{position:"absolute",top:6,right:6,width:7,height:7,borderRadius:"50%",background:C.terracotta,border:`2px solid ${C.surface}`}} />}
      </button>
      {open && <>
        <div onClick={()=>setOpen(false)} style={{position:"fixed",inset:0,zIndex:200,background:"transparent"}}/>
        <div style={{position:"absolute",top:56,right:14,width:300,maxWidth:"calc(100vw - 28px)",background:C.surface,borderRadius:14,border:`1px solid ${C.line}`,boxShadow:`0 12px 32px ${C.ink}18`,overflow:"hidden",zIndex:201}}>
          <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.lineSoft}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:13,fontWeight:500,color:C.ink,fontFamily:Fb}}>Notificaciones</span>
            {unreadCount>0 && <span style={{fontSize:9.5,color:C.brand,fontFamily:Fb,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase"}}>{unreadCount} nuevas</span>}
          </div>
          <div style={{maxHeight:340,overflowY:"auto"}}>
            {NOTIFS.map(n=>(
              <div key={n.id} onClick={()=>{setOpen(false); onNotif&&onNotif(n);}} style={{padding:"11px 16px",display:"flex",gap:10,borderBottom:`1px solid ${C.lineSoft}`,background:n.unread?C.brandWash+"40":"transparent",cursor:"pointer"}}>
                <div style={{width:30,height:30,borderRadius:"50%",background:n.unread?C.brandWash:C.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <Icon name={n.icon} size={14} color={n.unread?C.brand:C.muted} stroke={1.5}/>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{margin:0,fontSize:12,fontWeight:n.unread?500:400,color:C.ink,fontFamily:Fb,lineHeight:1.35}}>{n.t}</p>
                  <p style={{margin:"2px 0 0",fontSize:10.5,color:C.muted,fontFamily:Fb,fontWeight:400}}>{n.d} · {n.time}</p>
                </div>
                {n.unread && <div style={{width:6,height:6,borderRadius:"50%",background:C.terracotta,marginTop:6,flexShrink:0}}/>}
              </div>
            ))}
          </div>
          <div style={{padding:"10px 16px",textAlign:"center",borderTop:`1px solid ${C.lineSoft}`,background:C.bg}}>
            <span style={{fontSize:11,color:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.04em"}}>Ver todas las notificaciones</span>
          </div>
        </div>
      </>}
    </div>
  );
}

// ── Avatar (solid, with optional verified badge) ──
const Avatar = ({ initials, size = 36, bg = C.inkMuted, verified = false }) => {
  const badge = Math.round(size * 0.38);
  return (
    <div style={{position:"relative",width:size,height:size,flexShrink:0}}>
      <div style={{width:size,height:size,borderRadius:"50%",background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.32,fontWeight:500,color:C.surface,fontFamily:Fb,letterSpacing:"0.02em"}}>{initials}</div>
      {verified && (
        <div style={{position:"absolute",bottom:-1,right:-1,width:badge,height:badge,borderRadius:"50%",background:C.forest,border:`2px solid ${C.surface}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Icon name="check" size={Math.max(8,badge-8)} color={C.surface} stroke={2.5}/>
        </div>
      )}
    </div>
  );
};

// ─── Filter Sheet (modal drawer) ───
function FilterSheet({draft,setDraft,onApply,onClose,onClear,resultCount,fType,catalog}){
  const Section = ({title,children}) => (
    <div style={{marginBottom:22}}>
      <div style={{fontSize:10,color:C.muted,fontFamily:Fb,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:10}}>{title}</div>
      {children}
    </div>
  );
  const Chip = ({selected,onClick,children}) => (
    <button onClick={onClick} style={{padding:"8px 14px",borderRadius:999,background:selected?C.ink:C.surface,border:`1px solid ${selected?C.ink:C.line}`,color:selected?C.surface:C.text,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:Fb,letterSpacing:"0.01em",whiteSpace:"nowrap"}}>{children}</button>
  );
  const ChipRow = ({value,setValue,opts}) => (
    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
      <Chip selected={value===""} onClick={()=>setValue("")}>Indiferente</Chip>
      {opts.map(o=><Chip key={o.v} selected={value===String(o.v)} onClick={()=>setValue(String(o.v))}>{o.l}</Chip>)}
    </div>
  );
  const numInput = (val,setVal,placeholder) => (
    <input type="number" placeholder={placeholder} value={val} onChange={e=>setVal(e.target.value)} style={{flex:1,padding:"11px 12px",borderRadius:10,background:C.bg,border:`1px solid ${C.line}`,color:C.ink,fontSize:13,fontFamily:Fb,fontWeight:500,outline:"none",textAlign:"left",minWidth:0}}/>
  );
  return (
    <div style={{position:"fixed",inset:0,zIndex:300,background:"rgba(28,26,23,0.5)",display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:430,maxHeight:"92vh",background:C.bg,borderRadius:"20px 20px 0 0",display:"flex",flexDirection:"column",animation:"slideUp 0.25s ease"}}>
        <style>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 18px",borderBottom:`1px solid ${C.line}`}}>
          <button onClick={onClose} style={{width:34,height:34,borderRadius:"50%",background:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Icon name="close" size={18} color={C.ink} stroke={1.7}/>
          </button>
          <h3 style={{margin:0,fontSize:17,fontWeight:400,color:C.ink,fontFamily:Fs,letterSpacing:"-0.01em"}}>Filtros</h3>
          <button onClick={onClear} style={{padding:"6px 10px",background:"transparent",border:"none",cursor:"pointer",color:C.muted,fontSize:12,fontWeight:500,fontFamily:Fb,letterSpacing:"0.02em"}}>Limpiar</button>
        </div>

        {/* Body — scrollable */}
        <div style={{flex:1,overflowY:"auto",padding:"20px 18px 14px"}}>
          {/* Context badge — show which type we're filtering */}
          {fType && (
            <div style={{display:"inline-flex",alignItems:"center",gap:7,padding:"6px 12px",borderRadius:999,background:C.brandWash,border:`1px solid ${C.brand}40`,marginBottom:18}}>
              <Icon name={PROP_TYPES.find(x=>x.t===fType)?.icon||"house"} size={13} color={C.brand} stroke={1.6}/>
              <span style={{fontSize:11,color:C.brand,fontFamily:Fb,fontWeight:500,letterSpacing:"0.02em"}}>Filtros específicos de {fType}</span>
            </div>
          )}

          {/* PRICE — always shown */}
          <Section title="Precio">
            <div style={{display:"flex",gap:5,marginBottom:10,padding:3,background:C.surface,border:`1px solid ${C.line}`,borderRadius:999,width:"fit-content"}}>
              {["UF","CLP"].map(c=>{
                const on=draft.currency===c;
                return <button key={c} onClick={()=>setDraft({...draft,currency:c})} style={{padding:"6px 16px",borderRadius:999,border:"none",background:on?C.ink:"transparent",color:on?C.surface:C.muted,fontSize:11.5,fontWeight:500,cursor:"pointer",fontFamily:Fb,letterSpacing:"0.04em"}}>{c}</button>;
              })}
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              {numInput(draft.priceMin,v=>setDraft({...draft,priceMin:v}),`Mín ${draft.currency}`)}
              <span style={{color:C.subtle,fontSize:12}}>—</span>
              {numInput(draft.priceMax,v=>setDraft({...draft,priceMax:v}),`Máx ${draft.currency}`)}
            </div>
            {draft.currency==="CLP"&&<p style={{margin:"7px 0 0",fontSize:10,color:C.subtle,fontFamily:Fb,fontWeight:400,fontStyle:"italic"}}>1 UF ≈ ${UF_TO_CLP.toLocaleString("es-CL")} CLP</p>}
          </Section>

          {/* SUPERFICIE — Casa, Depto, Sitio, Oficina, Industrial */}
          {(!catalog || catalog.showArea) && (
            <Section title={fType==="Casa"?"Superficie construida (m²)":fType==="Departamento"?"Superficie útil (m²)":fType==="Oficina"?"Superficie útil (m²)":"Superficie (m²)"}>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                {numInput(draft.areaMin,v=>setDraft({...draft,areaMin:v}),"Mín m²")}
                <span style={{color:C.subtle,fontSize:12}}>—</span>
                {numInput(draft.areaMax,v=>setDraft({...draft,areaMax:v}),"Máx m²")}
              </div>
            </Section>
          )}

          {/* SUPERFICIE TERRENO — solo Casa */}
          {catalog?.showTerreno && (
            <Section title="Superficie terreno (m²)">
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                {numInput(draft.terrenoMin,v=>setDraft({...draft,terrenoMin:v}),"Mín m²")}
                <span style={{color:C.subtle,fontSize:12}}>—</span>
                {numInput(draft.terrenoMax,v=>setDraft({...draft,terrenoMax:v}),"Máx m²")}
              </div>
            </Section>
          )}

          {/* SUPERFICIE TOTAL — Depto, Industrial */}
          {catalog?.showTotal && (
            <Section title="Superficie total (m²)">
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                {numInput(draft.totalMin,v=>setDraft({...draft,totalMin:v}),"Mín m²")}
                <span style={{color:C.subtle,fontSize:12}}>—</span>
                {numInput(draft.totalMax,v=>setDraft({...draft,totalMax:v}),"Máx m²")}
              </div>
            </Section>
          )}

          {/* HECTÁREAS — Parcela */}
          {catalog?.showHectareas && (
            <Section title="Hectáreas">
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                {numInput(draft.hectMin,v=>setDraft({...draft,hectMin:v}),"Mín ha")}
                <span style={{color:C.subtle,fontSize:12}}>—</span>
                {numInput(draft.hectMax,v=>setDraft({...draft,hectMax:v}),"Máx ha")}
              </div>
            </Section>
          )}

          {/* URBANO / RURAL — Sitio */}
          {catalog?.showUrbano && (
            <Section title="Ubicación">
              <div style={{display:"flex",gap:6}}>
                {[{v:"",l:"Indiferente"},{v:"urbano",l:"Urbano"},{v:"rural",l:"Rural"}].map(o=>{
                  const on=draft.urbano===o.v;
                  return <button key={o.l} onClick={()=>setDraft({...draft,urbano:o.v})} style={{flex:1,padding:"10px 8px",borderRadius:10,background:on?C.ink:C.surface,border:`1px solid ${on?C.ink:C.line}`,color:on?C.surface:C.text,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:Fb,letterSpacing:"0.01em"}}>{o.l}</button>;
                })}
              </div>
            </Section>
          )}

          {/* DORMITORIOS — Casa, Depto */}
          {(!catalog || catalog.showBeds) && (
            <Section title="Dormitorios">
              <ChipRow value={draft.beds} setValue={v=>setDraft({...draft,beds:v})} opts={[{v:1,l:"1+"},{v:2,l:"2+"},{v:3,l:"3+"},{v:4,l:"4+"},{v:5,l:"5+"}]}/>
            </Section>
          )}

          {/* BAÑOS — Casa, Depto, Oficina */}
          {(!catalog || catalog.showBaths) && (
            <Section title="Baños">
              <ChipRow value={draft.baths} setValue={v=>setDraft({...draft,baths:v})} opts={[{v:1,l:"1+"},{v:2,l:"2+"},{v:3,l:"3+"},{v:4,l:"4+"}]}/>
            </Section>
          )}

          {/* ESTACIONAMIENTOS — Casa, Depto, Oficina */}
          {(!catalog || catalog.showParks) && (
            <Section title="Estacionamientos">
              <ChipRow value={draft.parks} setValue={v=>setDraft({...draft,parks:v})} opts={[{v:1,l:"1+"},{v:2,l:"2+"},{v:3,l:"3+"}]}/>
            </Section>
          )}

          {/* CARACTERÍSTICAS — dinámicas según tipo */}
          <Section title={fType==="Departamento"?"Características":fType?"Características":"Características"}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {(catalog?.amenities || AMENITIES).map(a=>{
                const on=draft.amenities.includes(a.k);
                return (
                  <button key={a.k} onClick={()=>{
                    const next = on ? draft.amenities.filter(x=>x!==a.k) : [...draft.amenities,a.k];
                    setDraft({...draft,amenities:next});
                  }} style={{padding:"11px 12px",borderRadius:12,background:on?C.brandWash:C.surface,border:`1px solid ${on?C.brand:C.line}`,cursor:"pointer",display:"flex",alignItems:"center",gap:9,textAlign:"left"}}>
                    <Icon name={a.icon} size={17} color={on?C.brand:C.muted} stroke={1.5}/>
                    <span style={{fontSize:12,fontWeight:500,color:on?C.brand:C.ink,fontFamily:Fb,lineHeight:1.2}}>{a.l}</span>
                    {on&&<div style={{marginLeft:"auto"}}><Icon name="check" size={13} color={C.brand} stroke={2.2}/></div>}
                  </button>
                );
              })}
            </div>
          </Section>

          {/* ESTADO — Casa, Depto */}
          {(!catalog || catalog.showBeds) && (
            <Section title="Estado">
              <div style={{display:"flex",gap:6}}>
                {[{v:"",l:"Indiferente"},{v:"nuevo",l:"Nuevo"},{v:"usado",l:"Usado"}].map(o=>{
                  const on=draft.nuevo===o.v;
                  return <button key={o.l} onClick={()=>setDraft({...draft,nuevo:o.v})} style={{flex:1,padding:"10px 8px",borderRadius:10,background:on?C.ink:C.surface,border:`1px solid ${on?C.ink:C.line}`,color:on?C.surface:C.text,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:Fb,letterSpacing:"0.01em"}}>{o.l}</button>;
                })}
              </div>
            </Section>
          )}
        </div>

        {/* Sticky footer */}
        <div style={{padding:"14px 18px env(safe-area-inset-bottom,16px)",borderTop:`1px solid ${C.line}`,background:C.bg}}>
          <button onClick={onApply} style={{width:"100%",padding:14,borderRadius:12,background:C.ink,border:"none",color:C.surface,fontSize:13.5,fontWeight:500,cursor:"pointer",fontFamily:Fb,letterSpacing:"0.02em"}}>
            Mostrar {resultCount} {resultCount===1?"propiedad":"propiedades"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══ EXPLORE (Instagram-style grid) ═══
const initialFilters = () => ({
  operacion:"venta", // "venta" or "arriendo"
  currency:"UF", priceMin:"", priceMax:"",
  beds:"", baths:"", parks:"",
  areaMin:"", areaMax:"",
  terrenoMin:"", terrenoMax:"",
  totalMin:"", totalMax:"",
  hectMin:"", hectMax:"",
  privadosMin:"",
  amenities:[],
  urbano:"", // "", "urbano", "rural"
  nuevo:"", // "", "nuevo", "usado"
});

function Feed({props,onTap,onOpenReel,applyPrefs,onPrefsApplied}) {
  const [q,setQ]=useState("");
  const [fType,setFType]=useState("");
  const [fOperacion,setFOperacion]=useState("venta");
  const [sheet,setSheet]=useState(false);
  const [typeMenu,setTypeMenu]=useState(false);
  const [priceMenu,setPriceMenu]=useState(false);
  const [comunaFocus,setComunaFocus]=useState(false);
  const [mapInfo,setMapInfo]=useState(false);
  const [filters,setFilters]=useState(initialFilters());
  const [draft,setDraft]=useState(initialFilters());

  // Preferencias que llegan desde el chat de Isidora. El estado de los filtros
  // vive acá adentro, así que MainApp las pasa como prop y las aplicamos con un
  // efecto (antes MainApp llamaba a estos setters directo y tiraba ReferenceError).
  useEffect(() => {
    if (!applyPrefs) return;
    if (applyPrefs.operacion) setFOperacion(applyPrefs.operacion);
    if (applyPrefs.tipo) setFType(applyPrefs.tipo);
    setFilters(f => ({
      ...f,
      priceMax: applyPrefs.presupuestoMax ? String(applyPrefs.presupuestoMax) : "",
      beds: applyPrefs.beds ? String(applyPrefs.beds) : "",
      currency: "UF",
    }));
    setQ(applyPrefs.comuna || "");
    onPrefsApplied && onPrefsApplied();
  }, [applyPrefs]);

  // Autocomplete suggestions for comuna
  const comunaSugs = q.length >= 1
    ? COMUNAS.filter(([c,r]) => c.toLowerCase().includes(q.toLowerCase()) || r.toLowerCase().includes(q.toLowerCase())).slice(0,8)
    : [];

  // Price summary for quick button display
  const priceSummary = (() => {
    if (!filters.priceMin && !filters.priceMax) return "Cualquier";
    const lo = filters.priceMin ? Number(filters.priceMin).toLocaleString("es-CL") : "0";
    const hi = filters.priceMax ? Number(filters.priceMax).toLocaleString("es-CL") : "∞";
    return `${filters.currency} ${lo}–${hi}`;
  })();

  // Open sheet → init draft from current filters
  const openSheet=()=>{setDraft({...filters,amenities:[...filters.amenities]});setSheet(true);};
  const apply=()=>{setFilters({...draft,amenities:[...draft.amenities]});setSheet(false);};
  const clearAll=()=>setDraft(initialFilters());

  // Get the catalog config for the current type (or null if no type selected)
  const catalog = fType ? FILTER_CATALOGS[fType] : null;

  // Active filter count
  const activeCount = (
    (filters.priceMin||filters.priceMax?1:0) +
    (filters.beds?1:0) + (filters.baths?1:0) + (filters.parks?1:0) +
    (filters.areaMin||filters.areaMax?1:0) +
    (filters.terrenoMin||filters.terrenoMax?1:0) +
    (filters.totalMin||filters.totalMax?1:0) +
    (filters.hectMin||filters.hectMax?1:0) +
    filters.amenities.length +
    (filters.urbano?1:0) +
    (filters.nuevo?1:0)
  );

  // Convert prop price to selected currency for comparison
  const priceIn = (p,cur) => {
    if(p.cur===cur) return p.price;
    if(p.cur==="UF" && cur==="CLP") return p.price * UF_TO_CLP;
    if(p.cur==="CLP" && cur==="UF") return p.price / UF_TO_CLP;
    return p.price;
  };

  const filtered=props.filter(p=>{
    if(fOperacion && (p.operacion||"venta")!==fOperacion) return false;
    if(fType&&p.type!==fType)return false;
    if(q){
      const s=q.toLowerCase();
      // Nunca buscamos dentro de `p.loc`: la dirección exacta no es pública.
      const hay = `${publicLocation(p)} ${p.comuna||""} ${p.region||""} ${p.vanityLocation||""} ${p.title||""}`.toLowerCase();
      if(!hay.includes(s))return false;
    }
    // Price (in selected currency)
    const pp = priceIn(p,filters.currency);
    if(filters.priceMin && pp<+filters.priceMin) return false;
    if(filters.priceMax && pp>+filters.priceMax) return false;
    // Beds, baths, parks (numeric "min" — selected number means "at least")
    if(filters.beds && p.beds<+filters.beds) return false;
    if(filters.baths && p.baths<+filters.baths) return false;
    if(filters.parks && p.parks<+filters.parks) return false;
    // Area
    if(filters.areaMin && p.area<+filters.areaMin) return false;
    if(filters.areaMax && p.area>+filters.areaMax) return false;
    // Superficie terreno (Casa)
    if(filters.terrenoMin && (p.areaTerreno||0)<+filters.terrenoMin) return false;
    if(filters.terrenoMax && (p.areaTerreno||Infinity)>+filters.terrenoMax) return false;
    // Superficie total (Depto, Industrial)
    if(filters.totalMin && (p.areaTotal||0)<+filters.totalMin) return false;
    if(filters.totalMax && (p.areaTotal||Infinity)>+filters.totalMax) return false;
    // Hectáreas (Parcela)
    if(filters.hectMin && (p.hectareas||0)<+filters.hectMin) return false;
    if(filters.hectMax && (p.hectareas||Infinity)>+filters.hectMax) return false;
    // Amenities (must include all selected)
    if(filters.amenities.length){
      const set = new Set(p.amenities||[]);
      if(!filters.amenities.every(a=>set.has(a))) return false;
    }
    // Nuevo / Usado
    if(filters.nuevo==="nuevo" && !p.nuevo) return false;
    if(filters.nuevo==="usado" && p.nuevo) return false;
    return true;
  });

  // Pattern for grid: certain indices become 2x2 "featured" cells
  const bigAt = i => (i % 7 === 3);
  const types = ["Todos","Casa","Departamento","Terreno","Parcela","Oficina"];

  // Helper to remove single active filter
  const clearOne = key => {
    if(key==="price") setFilters({...filters,priceMin:"",priceMax:""});
    else if(key==="area") setFilters({...filters,areaMin:"",areaMax:""});
    else if(key==="amenities") setFilters({...filters,amenities:[]});
    else setFilters({...filters,[key]:""});
  };

  // Build active chips
  const activeChips = [];
  if(filters.priceMin||filters.priceMax){
    const lo = filters.priceMin?Number(filters.priceMin).toLocaleString("es-CL"):"0";
    const hi = filters.priceMax?Number(filters.priceMax).toLocaleString("es-CL"):"∞";
    activeChips.push({key:"price",label:`${filters.currency} ${lo}–${hi}`});
  }
  if(filters.beds) activeChips.push({key:"beds",label:`${filters.beds}+ dorm.`});
  if(filters.baths) activeChips.push({key:"baths",label:`${filters.baths}+ baños`});
  if(filters.parks) activeChips.push({key:"parks",label:`${filters.parks}+ estac.`});
  if(filters.areaMin||filters.areaMax){
    const lo = filters.areaMin||"0"; const hi = filters.areaMax||"∞";
    activeChips.push({key:"area",label:`${lo}–${hi} m²`});
  }
  filters.amenities.forEach(a=>{
    const def = AMENITIES.find(x=>x.k===a);
    activeChips.push({key:`am_${a}`,label:def?.l||a,onClear:()=>setFilters({...filters,amenities:filters.amenities.filter(x=>x!==a)})});
  });
  if(filters.nuevo) activeChips.push({key:"nuevo",label:filters.nuevo==="nuevo"?"Nuevo":"Usado"});

  return (
    <div style={{paddingBottom:82}}>
      <style>{`
        .quick-filters-grid { display:grid; grid-template-columns: 1fr 1fr; gap:6px; margin-bottom:10px; }
        @media (min-width: 900px) {
          .quick-filters-grid { grid-template-columns: 1fr !important; gap:8px !important; }
        }
      `}</style>
      <div className="pc-explore-layout">
      <aside className="pc-filters-side">
      {/* Quick start — 4 main buttons */}
      <div style={{padding:"4px 14px 8px"}}>
        {/* Row 1 — Operación toggle (¿Qué buscas?) */}
        <div style={{marginBottom:10}}>
          <p style={{margin:"0 0 6px 4px",fontSize:9.5,color:C.muted,fontFamily:Fb,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase"}}>¿Qué buscas?</p>
          <div style={{display:"flex",gap:6,padding:3,background:C.surface,border:`1px solid ${C.line}`,borderRadius:999}}>
            {OPERACIONES.map(o=>{
              const on = fOperacion===o.k;
              return <button key={o.k} onClick={()=>setFOperacion(o.k)} style={{flex:1,padding:"10px 14px",borderRadius:999,border:"none",background:on?C.ink:"transparent",color:on?C.surface:C.muted,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:Fb,letterSpacing:"0.02em",transition:"all 0.15s"}}>{o.l}</button>;
            })}
          </div>
        </div>

        {/* Row 2 — 4 quick buttons in 2x2 grid (mobile) / 1col stack (PC sidebar) */}
        <div className="quick-filters-grid">
          {/* Tipo */}
          <button onClick={()=>setTypeMenu(true)} style={{padding:"12px 14px",borderRadius:12,background:fType?C.brandWash:C.surface,border:`1px solid ${fType?C.brand:C.line}`,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"flex-start",gap:3,fontFamily:Fb,textAlign:"left"}}>
            <span style={{fontSize:9,color:C.muted,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase"}}>Tipo de propiedad</span>
            <span style={{display:"flex",alignItems:"center",gap:6,fontSize:13.5,fontWeight:500,color:fType?C.brand:C.ink}}>
              <Icon name={fType?(PROP_TYPES.find(x=>x.t===fType)?.icon||"house"):"grid"} size={16} color={fType?C.brand:C.text} stroke={1.6}/>
              {fType||"Todos"}
            </span>
          </button>

          {/* Comuna with autocomplete */}
          <div style={{position:"relative"}}>
            <div onClick={()=>setComunaFocus(true)} style={{padding:"8px 12px",borderRadius:12,background:q?C.brandWash:C.surface,border:`1px solid ${(q||comunaFocus)?C.brand:C.line}`,fontFamily:Fb,display:"flex",flexDirection:"column",justifyContent:"center",cursor:"text",minHeight:50,boxSizing:"border-box"}}>
              <span style={{fontSize:9,color:C.muted,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:2}}>Comuna</span>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <Icon name="pin" size={14} color={q?C.brand:C.text} stroke={1.6}/>
                <input
                  value={q}
                  onChange={e=>{setQ(e.target.value);setComunaFocus(true);}}
                  onFocus={()=>setComunaFocus(true)}
                  onBlur={()=>setTimeout(()=>setComunaFocus(false),200)}
                  placeholder="Cualquiera"
                  style={{border:"none",background:"transparent",outline:"none",fontSize:13.5,fontWeight:500,color:q?C.brand:C.ink,fontFamily:Fb,padding:0,width:"100%",minWidth:0}}
                />
                {q && <button onClick={(e)=>{e.stopPropagation();setQ("");}} style={{background:"transparent",border:"none",cursor:"pointer",padding:2,display:"flex",alignItems:"center"}}>
                  <Icon name="close" size={11} color={C.muted} stroke={2}/>
                </button>}
              </div>
            </div>
            {/* Autocomplete dropdown */}
            {comunaFocus && comunaSugs.length>0 && (
              <div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,zIndex:100,background:C.surface,border:`1px solid ${C.line}`,borderRadius:12,boxShadow:`0 8px 24px ${C.ink}15`,maxHeight:280,overflowY:"auto"}}>
                {comunaSugs.map(([c,r],i)=>(
                  <button
                    key={c}
                    onMouseDown={(e)=>{e.preventDefault();setQ(c);setComunaFocus(false);}}
                    style={{width:"100%",padding:"10px 13px",border:"none",background:"transparent",cursor:"pointer",display:"flex",alignItems:"center",gap:8,textAlign:"left",borderBottom:i<comunaSugs.length-1?`1px solid ${C.lineSoft}`:"none"}}
                    onMouseEnter={e=>e.currentTarget.style.background=C.bg}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                  >
                    <Icon name="pin" size={13} color={C.muted} stroke={1.5}/>
                    <div>
                      <div style={{fontSize:12.5,fontWeight:500,color:C.ink,fontFamily:Fb}}>{c}</div>
                      <div style={{fontSize:10,color:C.muted,fontFamily:Fb,fontWeight:400,marginTop:1}}>{r}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Precio */}
          <button onClick={()=>setPriceMenu(true)} style={{padding:"12px 14px",borderRadius:12,background:(filters.priceMin||filters.priceMax)?C.brandWash:C.surface,border:`1px solid ${(filters.priceMin||filters.priceMax)?C.brand:C.line}`,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"flex-start",gap:3,fontFamily:Fb,textAlign:"left"}}>
            <span style={{fontSize:9,color:C.muted,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase"}}>Precio</span>
            <span style={{fontSize:13.5,fontWeight:500,color:(filters.priceMin||filters.priceMax)?C.brand:C.ink,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:"100%"}}>
              {priceSummary}
            </span>
          </button>

          {/* Mapa */}
          <button onClick={()=>setMapInfo(true)} style={{padding:"12px 14px",borderRadius:12,background:C.surface,border:`1px solid ${C.line}`,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"flex-start",gap:3,fontFamily:Fb,textAlign:"left"}}>
            <span style={{fontSize:9,color:C.muted,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase"}}>Mapa</span>
            <span style={{display:"flex",alignItems:"center",gap:6,fontSize:13.5,fontWeight:500,color:C.ink}}>
              <Icon name="pin" size={16} color={C.ink} stroke={1.6}/>Buscar zona
            </span>
          </button>
        </div>

        {/* Row 3 — Filtros avanzados + Active chips */}
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <button onClick={openSheet} style={{padding:"9px 14px",borderRadius:999,background:activeCount>0?C.ink:C.surface,border:`1px solid ${activeCount>0?C.ink:C.line}`,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6,color:activeCount>0?C.surface:C.text,fontSize:12,fontWeight:500,fontFamily:Fb,letterSpacing:"0.01em",flexShrink:0}}>
            <Icon name="sliders" size={14} color={activeCount>0?C.surface:C.text} stroke={1.6}/>
            Más filtros{activeCount>0?` · ${activeCount}`:""}
          </button>
          {fType && <span style={{fontSize:10.5,color:C.brand,fontFamily:Fb,fontWeight:500,letterSpacing:"0.02em"}}>Filtros de {fType}</span>}
        </div>

        {/* Active filter chips */}
        {activeChips.length>0 && (
          <div style={{display:"flex",gap:6,marginTop:9,overflowX:"auto",scrollbarWidth:"none",paddingBottom:2,flexWrap:"wrap"}}>
            {activeChips.map(c=>(
              <button key={c.key} onClick={c.onClear||(()=>clearOne(c.key))} style={{flexShrink:0,padding:"5px 10px 5px 12px",borderRadius:999,background:C.brandWash,border:`1px solid ${C.brand}30`,color:C.brand,fontSize:10.5,fontWeight:500,cursor:"pointer",fontFamily:Fb,display:"inline-flex",alignItems:"center",gap:6,whiteSpace:"nowrap"}}>
                {c.label}
                <Icon name="close" size={10} color={C.brand} stroke={2}/>
              </button>
            ))}
            <button onClick={()=>setFilters(initialFilters())} style={{flexShrink:0,padding:"5px 10px",borderRadius:999,background:"transparent",border:"none",color:C.muted,fontSize:10.5,fontWeight:500,cursor:"pointer",fontFamily:Fb,letterSpacing:"0.04em"}}>Limpiar todo</button>
          </div>
        )}
      </div>
      </aside>

      <section className="pc-results-side">

      {/* Tipo picker modal */}
      {typeMenu && (
        <div onClick={()=>setTypeMenu(false)} style={{position:"fixed",inset:0,zIndex:300,background:"rgba(28,26,23,0.5)",display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:430,background:C.bg,borderRadius:"20px 20px 0 0",padding:"18px 16px env(safe-area-inset-bottom,20px)",animation:"slideUp 0.25s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <h3 style={{margin:0,fontSize:16,fontWeight:400,color:C.ink,fontFamily:Fs}}>Tipo de propiedad</h3>
              <button onClick={()=>setTypeMenu(false)} style={{width:30,height:30,borderRadius:"50%",background:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="close" size={16} color={C.ink} stroke={1.7}/></button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <button onClick={()=>{setFType("");setTypeMenu(false);}} style={{padding:"14px 10px",borderRadius:12,background:!fType?C.brandWash:C.surface,border:`1px solid ${!fType?C.brand:C.line}`,cursor:"pointer",fontFamily:Fb}}>
                <div style={{display:"flex",justifyContent:"center",marginBottom:5}}><Icon name="grid" size={20} color={!fType?C.brand:C.text} stroke={1.5}/></div>
                <span style={{fontSize:12,fontWeight:500,color:!fType?C.brand:C.ink}}>Todos</span>
              </button>
              {PROP_TYPES.map(({t,icon})=>{
                const on = fType===t;
                return <button key={t} onClick={()=>{setFType(t);setTypeMenu(false);}} style={{padding:"14px 10px",borderRadius:12,background:on?C.brandWash:C.surface,border:`1px solid ${on?C.brand:C.line}`,cursor:"pointer",fontFamily:Fb}}>
                  <div style={{display:"flex",justifyContent:"center",marginBottom:5}}><Icon name={icon} size={20} color={on?C.brand:C.text} stroke={1.5}/></div>
                  <span style={{fontSize:12,fontWeight:500,color:on?C.brand:C.ink}}>{t}</span>
                </button>;
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mapa con pines de propiedades — Airbnb-style */}
      {mapInfo && (
        <div onClick={()=>setMapInfo(false)} style={{position:"fixed",inset:0,zIndex:300,background:"rgba(28,26,23,0.55)",display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:500,background:C.bg,borderRadius:"22px 22px 0 0",animation:"slideUp 0.28s ease",maxHeight:"92vh",display:"flex",flexDirection:"column"}}>
            <div style={{padding:"14px 18px 10px",borderBottom:`1px solid ${C.lineSoft}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <h3 style={{margin:0,fontSize:16,fontWeight:500,color:C.ink,fontFamily:Fb}}>Propiedades en el mapa</h3>
                <p style={{margin:"1px 0 0",fontSize:11,color:C.muted,fontFamily:Fb,fontWeight:400}}>{filtered.length} matching · toca un pin para ver la propiedad</p>
              </div>
              <button onClick={()=>setMapInfo(false)} style={{width:32,height:32,borderRadius:"50%",background:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="close" size={17} color={C.ink} stroke={1.7}/></button>
            </div>
            <div style={{flex:1,padding:"12px 14px env(safe-area-inset-bottom,14px)",overflowY:"auto"}}>
              <PropertiesMap properties={filtered} onSelectProperty={(p)=>{setMapInfo(false); onTap && onTap(p);}}/>
              {filtered.length === 0 && (
                <p style={{margin:"14px 0 0",fontSize:12.5,color:C.muted,fontFamily:Fb,fontWeight:400,lineHeight:1.5,textAlign:"center"}}>No hay propiedades que coincidan con tus filtros. Ajusta los filtros y vuelve a buscar.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Precio quick-filter modal */}
      {priceMenu && (() => {
        const presets = filters.currency === "UF"
          ? [{label:"Hasta UF 3.000",min:"",max:"3000"},{label:"UF 3.000 – 6.000",min:"3000",max:"6000"},{label:"UF 6.000 – 10.000",min:"6000",max:"10000"},{label:"Más de UF 10.000",min:"10000",max:""}]
          : [{label:"Hasta $120M",min:"",max:"120000000"},{label:"$120M – $250M",min:"120000000",max:"250000000"},{label:"$250M – $400M",min:"250000000",max:"400000000"},{label:"Más de $400M",min:"400000000",max:""}];
        return (
          <div onClick={()=>setPriceMenu(false)} style={{position:"fixed",inset:0,zIndex:300,background:"rgba(28,26,23,0.5)",display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
            <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:430,background:C.bg,borderRadius:"20px 20px 0 0",animation:"slideUp 0.25s ease"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 18px",borderBottom:`1px solid ${C.line}`}}>
                <button onClick={()=>setPriceMenu(false)} style={{width:34,height:34,borderRadius:"50%",background:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="close" size={18} color={C.ink} stroke={1.7}/></button>
                <h3 style={{margin:0,fontSize:17,fontWeight:400,color:C.ink,fontFamily:Fs}}>Precio</h3>
                <button onClick={()=>setFilters({...filters,priceMin:"",priceMax:""})} style={{padding:"6px 10px",background:"transparent",border:"none",cursor:"pointer",color:C.muted,fontSize:12,fontWeight:500,fontFamily:Fb}}>Limpiar</button>
              </div>
              <div style={{padding:"20px 18px env(safe-area-inset-bottom,18px)"}}>
                {/* Currency toggle */}
                <div style={{display:"flex",gap:5,marginBottom:14,padding:3,background:C.surface,border:`1px solid ${C.line}`,borderRadius:999,width:"fit-content"}}>
                  {["UF","CLP"].map(c=>{
                    const on=filters.currency===c;
                    return <button key={c} onClick={()=>setFilters({...filters,currency:c,priceMin:"",priceMax:""})} style={{padding:"6px 18px",borderRadius:999,border:"none",background:on?C.ink:"transparent",color:on?C.surface:C.muted,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:Fb,letterSpacing:"0.04em"}}>{c}</button>;
                  })}
                </div>

                {/* Presets */}
                <p style={{margin:"0 0 10px",fontSize:10,color:C.muted,fontFamily:Fb,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase"}}>Rangos sugeridos</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:18}}>
                  {presets.map(p=>{
                    const on = filters.priceMin===p.min && filters.priceMax===p.max;
                    return <button key={p.label} onClick={()=>setFilters({...filters,priceMin:p.min,priceMax:p.max})} style={{padding:"11px 10px",borderRadius:10,background:on?C.brandWash:C.surface,border:`1px solid ${on?C.brand:C.line}`,cursor:"pointer",color:on?C.brand:C.text,fontSize:11.5,fontWeight:500,fontFamily:Fb,textAlign:"center"}}>{p.label}</button>;
                  })}
                </div>

                {/* Custom range */}
                <p style={{margin:"0 0 10px",fontSize:10,color:C.muted,fontFamily:Fb,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase"}}>O define el rango</p>
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:18}}>
                  <input type="number" placeholder={`Mín ${filters.currency}`} value={filters.priceMin} onChange={e=>setFilters({...filters,priceMin:e.target.value})} style={{flex:1,padding:"11px 12px",borderRadius:10,background:C.surface,border:`1px solid ${C.line}`,color:C.ink,fontSize:13,fontFamily:Fb,fontWeight:500,outline:"none",minWidth:0}}/>
                  <span style={{color:C.subtle,fontSize:12}}>—</span>
                  <input type="number" placeholder={`Máx ${filters.currency}`} value={filters.priceMax} onChange={e=>setFilters({...filters,priceMax:e.target.value})} style={{flex:1,padding:"11px 12px",borderRadius:10,background:C.surface,border:`1px solid ${C.line}`,color:C.ink,fontSize:13,fontFamily:Fb,fontWeight:500,outline:"none",minWidth:0}}/>
                </div>

                {filters.currency==="CLP" && <p style={{margin:"0 0 14px",fontSize:10.5,color:C.subtle,fontFamily:Fb,fontWeight:400,fontStyle:"italic"}}>1 UF ≈ ${UF_TO_CLP.toLocaleString("es-CL")} CLP</p>}

                <button onClick={()=>setPriceMenu(false)} style={{width:"100%",padding:14,borderRadius:12,background:C.ink,border:"none",color:C.surface,fontSize:13.5,fontWeight:500,cursor:"pointer",fontFamily:Fb,letterSpacing:"0.02em"}}>Aplicar</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Results count */}
      <div style={{padding:"0 16px 8px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:11,color:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.02em"}}>{filtered.length} {filtered.length===1?"propiedad":"propiedades"}</span>
        <span style={{fontSize:10,color:C.subtle,fontFamily:Fb,fontWeight:500,letterSpacing:"0.08em",textTransform:"uppercase"}}>Explorar</span>
      </div>

      {/* FILTER SHEET */}
      {sheet && <FilterSheet fType={fType} catalog={catalog} draft={draft} setDraft={setDraft} onApply={apply} onClose={()=>setSheet(false)} onClear={clearAll} resultCount={
        props.filter(p=>{
          const pp = priceIn(p,draft.currency);
          if(draft.priceMin && pp<+draft.priceMin) return false;
          if(draft.priceMax && pp>+draft.priceMax) return false;
          if(draft.beds && p.beds<+draft.beds) return false;
          if(draft.baths && p.baths<+draft.baths) return false;
          if(draft.parks && p.parks<+draft.parks) return false;
          if(draft.areaMin && p.area<+draft.areaMin) return false;
          if(draft.areaMax && p.area>+draft.areaMax) return false;
          if(draft.amenities.length){
            const set = new Set(p.amenities||[]);
            if(!draft.amenities.every(a=>set.has(a))) return false;
          }
          if(draft.nuevo==="nuevo" && !p.nuevo) return false;
          if(draft.nuevo==="usado" && p.nuevo) return false;
          if(fType && p.type!==fType) return false;
          return true;
        }).length
      }/>}

      {/* Grid — Instagram Explore style */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:2,padding:"0 2px"}}>
        {filtered.map((p,i)=>{
          const big = bigAt(i);
          const style = big ? {gridColumn:"span 2",gridRow:"span 2",aspectRatio:"1/1"} : {aspectRatio:"1/1"};
          const isReel = p.hasVideo;
          return (
            <div key={p.id} onClick={()=>isReel?onOpenReel(p.id):onTap(p)} style={{...style,position:"relative",overflow:"hidden",cursor:"pointer",background:C.brandWash}}>
              <CoverMedia p={p} alt={p.title} iconSize={big?44:28} labelSize={big?10:8.5}/>

              {/* Corner indicator: reel (play) or gallery */}
              <div style={{position:"absolute",top:6,right:6,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {isReel ? (
                  <div style={{width:22,height:22,borderRadius:"50%",background:"rgba(0,0,0,0.4)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <Icon name="play" size={11} color={C.surface}/>
                  </div>
                ) : (
                  <div style={{width:22,height:22,borderRadius:"50%",background:"rgba(0,0,0,0.4)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <Icon name="camera" size={11} color={C.surface} stroke={1.6}/>
                  </div>
                )}
              </div>

              {/* Bottom overlay with price + info (editorial, minimal) */}
              <div style={{position:"absolute",bottom:0,left:0,right:0,padding:big?"14px 12px 10px":"10px 8px 7px",background:"linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,0.75) 100%)",color:C.surface}}>
                <div style={{fontSize:big?9:8,fontWeight:500,fontFamily:Fb,letterSpacing:"0.1em",textTransform:"uppercase",opacity:0.85,marginBottom:2}}>{p.type}</div>
                <div style={{fontSize:big?16:12,fontWeight:400,fontFamily:Fs,letterSpacing:"-0.01em",lineHeight:1.15}}>{p.cur} {fmt(p.price)}</div>
                <div style={{fontSize:big?10:9,fontFamily:Fb,fontWeight:400,opacity:0.85,marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{publicLocation(p)}</div>
              </div>
            </div>
          );
        })}
      </div>

      {!filtered.length&&<div style={{textAlign:"center",padding:"60px 20px",color:C.muted}}>
        <div style={{margin:"0 auto 12px",width:52,height:52,borderRadius:"50%",background:C.brandWash,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Icon name="search" size={22} color={C.brand} stroke={1.5}/>
        </div>
        <p style={{fontFamily:Fb,fontSize:13,fontWeight:400,margin:0}}>No hay resultados para tu búsqueda</p>
      </div>}

      {/* Reels strip section (like IG Explore) */}
      {filtered.filter(p=>p.hasVideo).length>0 && (
        <div style={{marginTop:24,padding:"0 14px"}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
            <Icon name="reels" size={16} color={C.ink} stroke={1.6}/>
            <span style={{fontSize:11,color:C.ink,fontFamily:Fb,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase"}}>Reels destacados</span>
          </div>
          <div style={{display:"flex",gap:8,overflowX:"auto",scrollbarWidth:"none",paddingBottom:4}}>
            {filtered.filter(p=>p.hasVideo).map(p=>(
              <div key={p.id} onClick={()=>onOpenReel(p.id)} style={{flexShrink:0,width:118,aspectRatio:"9/16",borderRadius:12,overflow:"hidden",position:"relative",cursor:"pointer",background:"#000"}}>
                <CoverMedia p={p} iconSize={26} labelSize={8}/>
                <div style={{position:"absolute",top:6,right:6,width:22,height:22,borderRadius:"50%",background:"rgba(0,0,0,0.45)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Icon name="play" size={10} color={C.surface}/>
                </div>
                <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"10px 9px 8px",background:"linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,0.8) 100%)",color:C.surface}}>
                  <div style={{fontSize:11,fontWeight:500,fontFamily:Fs,letterSpacing:"-0.01em"}}>{p.cur} {fmt(p.price)}</div>
                  <div style={{fontSize:9,fontFamily:Fb,fontWeight:400,opacity:0.85,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{publicLocation(p)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </section>
      </div>
    </div>
  );
}

// ═══ DETAIL ═══
function Detail({p,back,onLike,onSave,onShare}) {
  const uploadedVideo = p.video_url || p.videoFile || null;
  const has4Takes = p.videoTakeFiles && Object.keys(p.videoTakeFiles).length > 0;
  return (
    <div style={{paddingBottom:92,background:C.bg}}>
      <div style={{position:"relative",background:"#000",height:280,overflow:"hidden"}}>
        {uploadedVideo ? (
          <video src={uploadedVideo} controls poster={p.img||undefined} playsInline style={{width:"100%",height:"100%",objectFit:"cover",display:"block",background:"#000"}}/>
        ) : has4Takes ? (
          <ReelPlayer takeFiles={p.videoTakeFiles||{}} takeOrder={p.takeOrder||[0,1,2,3]} takeSpeeds={p.takeSpeeds||[1,2,2,1]} takeDurations={p.takeDurations||[5,5,5,5]} title={p.reelTitle||""} subtitle={p.reelSubtitle||""} titleStyle={p.titleStyle||"editorial"} musicTrack={p.musicTrack||""} autoplay={false} height={280}/>
        ) : p.img ? (
          <img src={p.img} alt="" style={{width:"100%",height:280,objectFit:"cover",display:"block"}} />
        ) : (
          <div style={{width:"100%",height:280,background:C.brandWash,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8}}>
            <Icon name={typeIcon(p.type)} size={48} color={C.brand} stroke={1.3}/>
            <span style={{fontSize:11,color:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.08em",textTransform:"uppercase"}}>Sin portada</span>
          </div>
        )}
        <button onClick={back} style={{position:"absolute",top:14,left:14,width:38,height:38,borderRadius:"50%",background:"rgba(252,251,248,0.95)",backdropFilter:"blur(10px)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10}}>
          <Icon name="chevronLeft" size={16} color={C.ink} stroke={1.8}/>
        </button>
        <div style={{position:"absolute",bottom:14,left:14,display:"flex",gap:6,zIndex:10}}>
          {p.photos>0 && <span style={{background:"rgba(28,26,23,0.5)",backdropFilter:"blur(10px)",borderRadius:999,padding:"5px 11px",fontSize:10.5,color:C.surface,fontFamily:Fb,fontWeight:500,display:"inline-flex",alignItems:"center",gap:5}}>
            <Icon name="camera" size={11} color={C.surface} stroke={1.6}/>{p.photos}
          </span>}
          {p.hasVideo&&<span style={{background:"rgba(28,26,23,0.5)",backdropFilter:"blur(10px)",borderRadius:999,padding:"5px 11px",fontSize:10.5,color:C.surface,fontFamily:Fb,fontWeight:500,display:"inline-flex",alignItems:"center",gap:5}}>
            <Icon name="video" size={11} color={C.surface} stroke={1.6}/>Video
          </span>}
        </div>
      </div>
      <div style={{padding:"20px 18px 0"}}>
        <span style={{fontSize:10,color:C.brand,fontWeight:500,fontFamily:Fb,textTransform:"uppercase",letterSpacing:"0.12em"}}>{p.type} en venta</span>
        <h2 style={{margin:"8px 0 4px",fontSize:24,fontWeight:400,color:C.ink,fontFamily:Fs,lineHeight:1.2,letterSpacing:"-0.01em"}}>{p.title}</h2>
        <div style={{fontSize:30,fontWeight:400,color:C.ink,fontFamily:Fs,margin:"10px 0 4px",letterSpacing:"-0.02em"}}>{p.cur} <span style={{fontWeight:500}}>{p.price.toLocaleString("es-CL")}</span></div>
        <div style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:12,color:C.muted,fontFamily:Fb,fontWeight:400,margin:"0 0 16px"}}>
          <Icon name="pin" size={13} color={C.muted} stroke={1.5}/>{publicLocation(p)}
        </div>
        <div style={{display:"flex",gap:6,padding:"14px 0",borderTop:`1px solid ${C.line}`,borderBottom:`1px solid ${C.line}`,marginBottom:18}}>
          {p.beds>0&&<div style={{textAlign:"center",flex:1}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:4}}><Icon name="bed" size={17} color={C.brand} stroke={1.5}/></div>
            <div style={{fontSize:18,fontWeight:400,color:C.ink,fontFamily:Fs}}>{p.beds}</div>
            <div style={{fontSize:10,color:C.muted,fontFamily:Fb,fontWeight:400,letterSpacing:"0.06em",textTransform:"uppercase"}}>Dorm.</div>
          </div>}
          {p.baths>0&&<div style={{textAlign:"center",flex:1}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:4}}><Icon name="bath" size={17} color={C.brand} stroke={1.5}/></div>
            <div style={{fontSize:18,fontWeight:400,color:C.ink,fontFamily:Fs}}>{p.baths}</div>
            <div style={{fontSize:10,color:C.muted,fontFamily:Fb,fontWeight:400,letterSpacing:"0.06em",textTransform:"uppercase"}}>Baños</div>
          </div>}
          <div style={{textAlign:"center",flex:1}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:4}}><Icon name="ruler" size={17} color={C.brand} stroke={1.5}/></div>
            <div style={{fontSize:18,fontWeight:400,color:C.ink,fontFamily:Fs}}>{p.area}</div>
            <div style={{fontSize:10,color:C.muted,fontFamily:Fb,fontWeight:400,letterSpacing:"0.06em",textTransform:"uppercase"}}>m²</div>
          </div>
        </div>
        <p style={{fontSize:13.5,color:C.text,lineHeight:1.65,fontFamily:Fb,fontWeight:400,margin:"0 0 16px"}}>{p.desc}</p>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:18}}>
          {p.tags.map(t=><span key={t} style={{fontSize:10.5,padding:"5px 12px",borderRadius:999,background:"transparent",border:`1px solid ${C.line}`,color:C.text,fontFamily:Fb,fontWeight:400}}>{t}</span>)}
        </div>
        {(() => {
          // Mapa público: círculo aproximado, nunca el pin de la dirección.
          const c = approxLatLng(p);
          if (!c) return null;
          return (
            <div style={{marginBottom:18}}>
              <div style={{borderRadius:12,overflow:"hidden",border:`1px solid ${C.line}`}}>
                <MapView lat={c.lat} lng={c.lng} address={publicLocation(p)} height={180} zoom={14} approximate/>
              </div>
              <p style={{margin:"7px 2px 0",fontSize:10.5,color:C.subtle,fontFamily:Fb,fontWeight:400,fontStyle:"italic",lineHeight:1.4}}>Ubicación aproximada — la dirección exacta se comparte al coordinar la visita.</p>
            </div>
          );
        })()}
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16,padding:14,borderRadius:12,background:C.surface,border:`1px solid ${C.line}`}}>
          <Avatar initials={p.avatar} size={42} verified/>
          <div style={{flex:1}}>
            <div style={{fontSize:13.5,fontWeight:500,color:C.ink,fontFamily:Fb,display:"flex",alignItems:"center",gap:6}}>
              {p.user}
              <span style={{display:"inline-flex",alignItems:"center",gap:3,padding:"2px 7px",borderRadius:999,background:C.mintWash,color:C.forest,fontSize:9,fontWeight:500,letterSpacing:"0.06em",textTransform:"uppercase"}}>
                <Icon name="check" size={9} color={C.forest} stroke={2.5}/>Verificado
              </span>
            </div>
            <div style={{fontSize:10.5,color:C.muted,fontFamily:Fb,fontWeight:400,letterSpacing:"0.08em",textTransform:"uppercase",marginTop:3}}>Corredor / Propietario</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>{
            if (!p.wa) { alert("Este publicador no ha configurado su WhatsApp todavía"); return; }
            window.open(waUrl(p.wa,`Hola ${p.user}, vi tu publicación "${p.title}" en properties. Me interesa coordinar una visita.`),"_blank");
          }} disabled={!p.wa} style={{flex:1,padding:14,borderRadius:12,background:p.wa?C.ink:C.line,border:"none",cursor:p.wa?"pointer":"default",fontSize:13.5,fontWeight:500,color:C.surface,fontFamily:Fb,display:"flex",alignItems:"center",justifyContent:"center",gap:8,letterSpacing:"0.01em"}}>
            <Icon name="whatsapp" size={18} color={C.surface} stroke={1.6}/>WhatsApp
          </button>
          <button onClick={()=>onShare&&onShare(p)} title="Copiar el link de esta publicación" style={{width:50,height:50,borderRadius:12,background:C.surface,border:`1px solid ${C.line}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Icon name="share" size={17} color={C.text} stroke={1.6}/>
          </button>
          <button onClick={()=>onLike(p.id)} title={p.liked?"Quitar de guardados":"Guardar propiedad"} style={{width:50,height:50,borderRadius:12,background:p.liked?C.brandWash:C.surface,border:`1px solid ${p.liked?C.brand:C.line}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Icon name="heart" size={18} color={p.liked?C.terracotta:C.text} stroke={1.6} fill={p.liked?C.terracotta:"none"}/>
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══ REELS ═══
// ─── CommentsSheet — Instagram-style public comments bottom sheet ───
const MOCK_COMMENTS = {
  1: [
    {id:1, user:"Camila R.", av:"CR", t:"Hermosa! ¿Tiene calefacción central?", time:"2h", likes:12, mine:false},
    {id:2, user:"Diego M.", av:"DM", t:"¿Acepta créditos hipotecarios?", time:"4h", likes:3, mine:false},
    {id:3, user:"Pablo S.", av:"PS", t:"La piscina se ve genial 🌊", time:"1d", likes:8, mine:false},
  ],
  2: [
    {id:1, user:"Sofía L.", av:"SL", t:"¡Qué vista! ¿Es entrega inmediata?", time:"5h", likes:6, mine:false},
    {id:2, user:"Tomás G.", av:"TG", t:"¿Cuánto son los gastos comunes?", time:"1d", likes:2, mine:false},
  ],
  3: [
    {id:1, user:"Andrés S.", av:"AS", t:"¿Tiene derechos de agua activos?", time:"3h", likes:5, mine:false},
    {id:2, user:"Marta V.", av:"MV", t:"Me encanta la vista a la montaña", time:"6h", likes:9, mine:false},
  ],
};
function CommentsSheet({propId, prop, onClose}) {
  const [comments,setComments] = useState(MOCK_COMMENTS[propId] || []);
  const [draft,setDraft] = useState("");
  const add = () => {
    if (!draft.trim()) return;
    setComments(c => [...c, {id:Date.now(), user:"Valentina S.", av:"VS", t:draft.trim(), time:"ahora", likes:0, mine:true}]);
    setDraft("");
  };
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:300,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:430,maxHeight:"75vh",background:C.bg,borderRadius:"22px 22px 0 0",animation:"slideUp 0.28s ease",display:"flex",flexDirection:"column"}}>
        <style>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
        <div style={{padding:"14px 18px 10px",borderBottom:`1px solid ${C.lineSoft}`,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:C.bg,borderRadius:"22px 22px 0 0"}}>
          <div>
            <h3 style={{margin:0,fontSize:15,fontWeight:500,color:C.ink,fontFamily:Fb}}>Comentarios</h3>
            <p style={{margin:"1px 0 0",fontSize:11,color:C.muted,fontFamily:Fb,fontWeight:400}}>{comments.length} público{comments.length===1?"":"s"} en {prop?.title}</p>
          </div>
          <button onClick={onClose} style={{width:30,height:30,borderRadius:"50%",background:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="close" size={16} color={C.ink} stroke={1.7}/></button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"6px 0 8px"}}>
          {comments.length===0 ? (
            <div style={{padding:"40px 24px",textAlign:"center"}}>
              <Icon name="chat" size={28} color={C.subtle} stroke={1.3}/>
              <p style={{margin:"10px 0 0",fontSize:13,color:C.muted,fontFamily:Fb,fontWeight:400}}>Sé el primero en comentar</p>
            </div>
          ) : comments.map(c=>(
            <div key={c.id} style={{padding:"11px 18px",display:"flex",gap:11,borderBottom:`1px solid ${C.lineSoft}`}}>
              <Avatar initials={c.av} size={32}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"baseline",gap:8,flexWrap:"wrap"}}>
                  <span style={{fontSize:12.5,fontWeight:500,color:C.ink,fontFamily:Fb}}>{c.user}</span>
                  <span style={{fontSize:10,color:C.muted,fontFamily:Fb,fontWeight:400,letterSpacing:"0.04em"}}>{c.time}</span>
                </div>
                <p style={{margin:"3px 0 0",fontSize:13,color:C.text,fontFamily:Fb,fontWeight:400,lineHeight:1.45}}>{c.t}</p>
                <div style={{display:"flex",alignItems:"center",gap:10,marginTop:6}}>
                  <button style={{display:"flex",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",padding:0,fontSize:10.5,color:C.muted,fontFamily:Fb,fontWeight:500}}>
                    <Icon name="heart" size={11} color={C.muted} stroke={1.5}/> {c.likes}
                  </button>
                  <button style={{background:"none",border:"none",cursor:"pointer",padding:0,fontSize:10.5,color:C.muted,fontFamily:Fb,fontWeight:500}}>Responder</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Composer */}
        <div style={{padding:"10px 14px env(safe-area-inset-bottom,12px)",borderTop:`1px solid ${C.lineSoft}`,background:C.bg,display:"flex",alignItems:"center",gap:9}}>
          <Avatar initials="VS" size={32}/>
          <input value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")add();}} placeholder="Agrega un comentario..." style={{flex:1,padding:"10px 13px",borderRadius:999,background:C.surface,border:`1px solid ${C.line}`,color:C.ink,fontSize:13,fontFamily:Fb,fontWeight:400,outline:"none"}}/>
          <button onClick={add} disabled={!draft.trim()} style={{padding:"8px 14px",borderRadius:999,background:draft.trim()?C.ink:C.line,border:"none",color:C.surface,fontSize:12,fontWeight:500,cursor:draft.trim()?"pointer":"default",fontFamily:Fb}}>Publicar</button>
        </div>
      </div>
    </div>
  );
}

function Reels({props,onLike,onSave,onOpen,onChat,onShare,startPropId}) {
  // Dynamic reel feed: user-published props with video first + hardcoded REELS, dedup
  const reelFeed = (() => {
    const seenPropIds = new Set();
    const out = [];
    // 1. User-published props with video (latest first)
    (props || []).forEach(p => {
      if (!p.hasVideo) return;
      if (seenPropIds.has(p.id)) return;
      seenPropIds.add(p.id);
      // Skip if it's a hardcoded REEL (will be added below with proper meta)
      if (REELS.some(r => r.propId === p.id)) return;
      out.push({
        id: `user-${p.id}`,
        propId: p.id,
        views: p.nuevo ? "Nuevo" : "0",
        caption: p.reelTitle || p.title || "Tu nueva propiedad",
        likes: 0,
      });
    });
    // 2. Hardcoded demo REELS — only if their matching prop exists in props
    REELS.forEach(r => {
      if (seenPropIds.has(r.propId)) return;
      if (!(props||[]).some(p => p.id === r.propId)) return;
      seenPropIds.add(r.propId);
      out.push(r);
    });
    return out;
  })();
  // If startPropId is provided, jump to that reel
  const startIdx = startPropId ? Math.max(0, reelFeed.findIndex(r=>r.propId===startPropId)) : 0;
  const [idx,setIdx]=useState(startIdx);
  const [muted, setMuted] = useState(true); // global mute for all reels (must start muted for autoplay)
  // Comentar removido — solo like + save + whatsapp

  // Scroll container + refs a cada slide para IntersectionObserver
  const scrollRef = useRef(null);
  const slideRefs = useRef([]);
  slideRefs.current = [];
  const registerSlide = (el, i) => { if (el) slideRefs.current[i] = el; };
  // Refs a los <video> para manejar sonido y play/pause de forma imperativa.
  const videoRefs = useRef([]);
  videoRefs.current = [];
  const registerVideo = (el, i) => { if (el) videoRefs.current[i] = el; };

  // Sonido + reproducción del slide activo.
  // Dos motivos para hacerlo a mano en vez de confiar en los atributos:
  //   - el prop `muted` de React no siempre se refleja en el elemento real;
  //   - cambiar `autoPlay` sobre un video ya cargado no lo hace arrancar, así
  //     que al deslizar a otro reel el video quedaba pausado.
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      v.muted = muted;
      if (i !== idx) { if (!v.paused) v.pause(); return; }
      const played = v.play();
      if (played && played.catch) {
        played.catch(() => {
          // El navegador bloqueó el autoplay con sonido (falta un gesto del
          // usuario). Volvemos a silencio para que al menos se reproduzca, y
          // sincronizamos el botón para que no mienta.
          if (!v.muted) { v.muted = true; setMuted(true); v.play().catch(() => {}); }
        });
      }
    });
  }, [idx, muted, reelFeed.length]);

  // Alternar sonido. iOS Safari solo permite salir de mute si play() se llama
  // sincrónicamente dentro del handler del toque; desde el efecto de abajo
  // (que corre después del re-render) lo bloquea y el botón no haría nada.
  // Por eso tocamos el <video> acá y recién después actualizamos el estado.
  const toggleSound = () => {
    const next = !muted;
    const v = videoRefs.current[idx];
    if (v) {
      v.muted = next;
      if (!next) { const played = v.play(); if (played && played.catch) played.catch(() => {}); }
    }
    setMuted(next);
  };

  // Navigation helpers — scroll suave hacia el slide destino
  const scrollToIdx = (i) => {
    const el = slideRefs.current[i];
    if (el && scrollRef.current) el.scrollIntoView({behavior:"smooth", block:"start"});
  };
  // Sin botones en pantalla: los usa el atajo de teclado (flechas arriba/abajo).
  const goNext = () => { const next = Math.min(reelFeed.length-1, idx+1); scrollToIdx(next); };
  const goPrev = () => { const prev = Math.max(0, idx-1); scrollToIdx(prev); };

  // IntersectionObserver: detecta qué slide es el más visible y actualiza idx (para autoplay del video)
  useEffect(() => {
    if (!scrollRef.current) return;
    const io = new IntersectionObserver((entries) => {
      // Ordenar por más visible primero
      const mostVisible = entries
        .filter(e => e.isIntersecting)
        .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (mostVisible) {
        const i = Number(mostVisible.target.getAttribute('data-idx'));
        if (!Number.isNaN(i)) setIdx(i);
      }
    }, { root: scrollRef.current, threshold: [0.6, 0.85, 1] });
    slideRefs.current.forEach(el => el && io.observe(el));
    return () => io.disconnect();
  }, [reelFeed.length]);

  // Al montar, si startPropId → posicionar el scroll en ese slide
  useEffect(() => {
    if (startIdx > 0) {
      const el = slideRefs.current[startIdx];
      if (el) el.scrollIntoView({behavior:"instant", block:"start"});
    }
  }, []);

  // Keyboard arrows (desktop) — deslizar entre slides
  useEffect(()=>{
    const onKey = e => {
      if (e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); goNext(); }
      if (e.key === "ArrowUp"   || e.key === "PageUp")   { e.preventDefault(); goPrev(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx]);

  const Stat = ({icon,val}) => (
    <div style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:12,color:C.text,fontFamily:Fb,fontWeight:400}}>
      <Icon name={icon} size={14} color={C.brand} stroke={1.7}/>{val}
    </div>
  );

  return (
    <div className="reels-frame" style={{height:"100vh",position:"relative",overflow:"hidden",background:"#000"}}>
      <style>{`
        @keyframes reelInfoIn { 0%{opacity:0;transform:translateY(20px)} 100%{opacity:1;transform:translateY(0)} }
        .reels-scroll::-webkit-scrollbar { display: none; }
        .reels-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* ─── Slide container: scroll-snap nativo (fluido tipo Instagram) ─── */}
      <div
        ref={scrollRef}
        className="reels-scroll"
        style={{
          height:"100%",
          overflowY:"scroll",
          scrollSnapType:"y mandatory",
          scrollBehavior:"smooth",
          overscrollBehavior:"contain",
          WebkitOverflowScrolling:"touch",
        }}
      >
        {reelFeed.map((rl, i) => {
          const prop = props.find(x=>x.id===rl.propId);
          if (!prop) return null;
          const isActive = i === idx;
          // Ventana de precarga. Sin esto los N videos del feed bajaban datos a
          // la vez (el default del browser es "metadata", y Chrome desktop llega
          // a usar "auto"). Solo el reel visible baja de verdad; sus dos vecinos
          // se quedan en metadata para que el swipe siga arrancando al toque; el
          // resto no pide nada hasta acercarse.
          const dist = Math.abs(i - idx);
          const preload = dist === 0 ? "auto" : dist === 1 ? "metadata" : "none";
          // Prioridad: video_url (Supabase Storage — reels publicados) > videoFile (blob local) > videoTakeFiles (draft)
          const reelVideoSrc = prop.video_url || prop.videoFile || (prop.videoTakeFiles && prop.videoTakeFiles[1]) || null;
          return (
            <div
              key={rl.id}
              ref={(el)=>registerSlide(el,i)}
              data-idx={i}
              style={{
                position:"relative",
                width:"100%",
                height:"100%",
                overflow:"hidden",
                background:"#000",
                display:"flex",
                flexDirection:"column",
                scrollSnapAlign:"start",
                scrollSnapStop:"always",
                flexShrink:0,
              }}
            >
              {/* ── Marco del video ──
                  object-fit: contain sobre negro: el video se ve entero, nunca
                  se recorta ni desborda la pantalla. La info de la propiedad va
                  en la franja de abajo, fuera de este marco, porque el video ya
                  trae su propio texto quemado. */}
              <div style={{position:"relative",flex:1,minHeight:0,background:"#000",overflow:"hidden"}}>
                {reelVideoSrc ? (
                  <video ref={(el)=>registerVideo(el,i)} src={reelVideoSrc} poster={prop.img||undefined} preload={preload} autoPlay={isActive} muted={muted} loop playsInline style={{width:"100%",height:"100%",objectFit:"contain",display:"block",background:"#000"}}/>
                ) : (
                  <img src={prop.img} alt="" style={{width:"100%",height:"100%",objectFit:"contain",display:"block",background:"#000"}}/>
                )}
                {/* Scrim solo arriba, para que se lean el logo y el botón de mute */}
                <div style={{position:"absolute",top:0,left:0,right:0,height:96,background:"linear-gradient(180deg,rgba(0,0,0,0.45) 0%,rgba(0,0,0,0) 100%)",pointerEvents:"none"}}/>

                {/* Tocar el video alterna el sonido (el primer toque lo activa).
                    zIndex 5 la deja debajo de la columna de acciones (zIndex 10). */}
                <button
                  onClick={toggleSound}
                  aria-label={muted?"Activar sonido":"Silenciar"}
                  style={{position:"absolute",inset:0,zIndex:5,background:"transparent",border:"none",padding:0,cursor:"pointer",WebkitTapHighlightColor:"transparent"}}
                />

                {/* Action column — sobre el marco del video, a la derecha */}
                <div style={{position:"absolute",right:12,bottom:16,display:"flex",flexDirection:"column",gap:20,alignItems:"center",zIndex:10}}>
                  <button onClick={()=>onLike(prop.id)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                    <Icon name="heart" size={30} color={prop.liked?C.terracotta:C.surface} stroke={1.6} fill={prop.liked?C.terracotta:"none"}/>
                    <span style={{fontSize:10,color:C.surface,fontFamily:Fb,fontWeight:400,textShadow:"0 1px 4px rgba(0,0,0,0.7)"}}>{prop.liked?"Guardado":"Guardar"}</span>
                  </button>
                  <button onClick={()=>{
                    if (!prop.wa) { alert("Este publicador no ha configurado su WhatsApp todavía"); return; }
                    window.open(waUrl(prop.wa,`Hola ${prop.user}, vi tu reel sobre "${prop.title}" en properties. Me interesa.`),"_blank");
                  }} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,opacity:prop.wa?1:0.5}}>
                    <Icon name="whatsapp" size={27} color={C.surface} stroke={1.6}/>
                    <span style={{fontSize:10,color:C.surface,fontFamily:Fb,fontWeight:400,textShadow:"0 1px 4px rgba(0,0,0,0.7)"}}>WhatsApp</span>
                  </button>
                  <button onClick={()=>onShare&&onShare(prop)} title="Copiar el link de esta publicación" style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                    <Icon name="share" size={27} color={C.surface} stroke={1.6}/>
                    <span style={{fontSize:10,color:C.surface,fontFamily:Fb,fontWeight:400,textShadow:"0 1px 4px rgba(0,0,0,0.7)"}}>Compartir</span>
                  </button>
                </div>
              </div>

              {/* ── Franja de info — FUERA del área del video ──
                  El padding inferior deja libre la barra de navegación fija. */}
              <div key={isActive?`info-${idx}`:`info-static-${i}`} style={{flexShrink:0,background:C.surface,borderTop:`1px solid ${C.line}`,padding:"12px 16px calc(12px + 66px + env(safe-area-inset-bottom, 0px))",animation:isActive?"reelInfoIn 0.35s ease both":"none"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <Avatar initials={prop.avatar} size={24} bg={C.surface2}/>
                  <span style={{fontSize:11.5,fontWeight:500,color:C.ink,fontFamily:Fb}}>{prop.user}</span>
                  <span style={{width:3,height:3,borderRadius:"50%",background:C.subtle}}/>
                  <span style={{fontSize:10.5,color:C.muted,fontFamily:Fb,fontWeight:400}}>{rl.views} vistas</span>
                  <span style={{marginLeft:"auto",fontSize:9,fontWeight:500,color:C.muted,fontFamily:Fb,letterSpacing:"0.1em",textTransform:"uppercase",padding:"3px 9px",borderRadius:999,border:`1px solid ${C.line}`}}>{prop.type}</span>
                </div>
                <div style={{display:"flex",alignItems:"baseline",gap:8,flexWrap:"wrap"}}>
                  <span style={{fontSize:22,fontWeight:400,color:C.ink,fontFamily:Fs,letterSpacing:"-0.01em",lineHeight:1.1}}>{prop.cur} {fmt(prop.price)}</span>
                  <span style={{fontSize:12.5,color:C.muted,fontFamily:Fb,fontWeight:400}}>{publicLocation(prop)}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:14,marginTop:8,flexWrap:"wrap"}}>
                  {prop.beds>0&&<Stat icon="bed" val={prop.beds}/>}
                  {prop.baths>0&&<Stat icon="bath" val={prop.baths}/>}
                  <Stat icon="ruler" val={`${prop.area} m² útil`}/>
                  {(prop.areaTotal || prop.areaTerreno) > 0 && <Stat icon="terrace" val={`${prop.areaTotal||prop.areaTerreno} m² tot`}/>}
                </div>
                {/* Una sola línea de texto: el video ya lleva su título quemado */}
                <p style={{fontSize:12.5,color:C.text,fontFamily:Fb,fontWeight:400,margin:"8px 0 0",lineHeight:1.4,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{prop.title || rl.caption}</p>
                <button onClick={()=>onOpen&&onOpen(prop)} style={{width:"100%",marginTop:10,padding:"12px 18px",borderRadius:12,background:C.ink,border:"none",cursor:"pointer",color:C.bg,fontSize:13,fontWeight:500,fontFamily:Fb,display:"flex",alignItems:"center",justifyContent:"center",gap:8,letterSpacing:"0.02em"}}>
                  Ver ficha completa
                  <Icon name="arrowRight" size={15} color={C.bg} stroke={1.8}/>
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {/* ─── End slide track ─── */}

      {/* Logo header — fixed, on top of slide track */}
      <div style={{position:"absolute",top:18,left:18,zIndex:20,display:"flex",alignItems:"center",gap:8,pointerEvents:"none"}}>
        <Logo size={22} color={C.surface} />
        <span style={{fontSize:17,fontWeight:400,color:C.surface,fontFamily:Fs,letterSpacing:"-0.01em"}}>C<em style={{fontStyle:"italic",color:C.brandSoft,fontWeight:400}}>2</em>C <span style={{fontFamily:Fb,fontWeight:400,opacity:0.65,fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",marginLeft:4}}>Reels</span></span>
      </div>

      {/* Altavoz (arriba a la derecha). 48px de target táctil. Mientras esté en
          silencio lleva la palabra "Sonido" al lado: sin eso nadie descubre que
          el reel tiene audio, porque el autoplay obliga a partir muteado. */}
      <button
        onClick={toggleSound}
        aria-label={muted?"Activar sonido":"Silenciar"}
        title={muted?"Activar sonido":"Silenciar"}
        style={{position:"absolute",top:14,right:14,zIndex:30,minWidth:48,height:48,padding:muted?"0 17px 0 14px":0,borderRadius:999,background:"rgba(0,0,0,0.55)",backdropFilter:"blur(10px)",border:`1px solid rgba(255,255,255,0.25)`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:7}}
      >
        <Icon name={muted?"volumeOff":"volume"} size={19} color={C.surface} stroke={1.8}/>
        {muted && <span style={{fontSize:11.5,fontWeight:500,color:C.surface,fontFamily:Fb,letterSpacing:"0.02em"}}>Sonido</span>}
      </button>

      {/* Sin controles de paginado sobre el video: la navegación es scroll /
          swipe y las flechas del teclado (ver el listener de keydown arriba). */}

    </div>
  );
}

// ═══ SELL ═══
// ─── Reel Player — plays takes in sequence with playbackRate, music, and title overlay ───
function ReelPlayer({takeFiles={}, takeOrder=[0,1,2,3], takeSpeeds=[1,2,2,1], takeDurations=[5,5,5,5], title="", subtitle="", titleStyle="editorial", musicTrack="", autoplay=false, height="auto", showOverlay=true, onPlayStateChange, muted=false}){
  const [idx,setIdx]=useState(0);
  const [playing,setPlaying]=useState(autoplay);
  const [cycleKey,setCycleKey]=useState(0); // re-trigger overlay animation on loop
  const [musicMuted,setMusicMuted]=useState(muted);
  const videoRefs = useRef([null,null,null,null]);
  const audioRef = useRef(null);
  const orderedDurations = takeOrder.map(o => takeDurations[o] || 5);

  // Lookup music URL from library
  const musicMeta = MUSIC_LIBRARY.find(m => m.k === musicTrack);
  const musicUrl = musicMeta?.url || "";

  // Play/pause audio in sync with video state
  useEffect(()=>{
    const a = audioRef.current;
    if (!a) return;
    if (playing && !musicMuted) {
      a.volume = 0.55;
      a.play().catch(()=>{ /* autoplay block — user gesture required */ });
    } else {
      a.pause();
    }
  }, [playing, musicMuted, musicUrl]);

  // Reset music when track changes
  useEffect(()=>{
    const a = audioRef.current;
    if (a) { a.currentTime = 0; }
  }, [musicUrl]);

  // Ordered list of file URLs (takeFiles is keyed by original slot 1..4)
  const orderedFiles = takeOrder.map(o => takeFiles[o+1]);
  const orderedSpeeds = takeOrder.map(o => takeSpeeds[o] || 1);
  const validCount = orderedFiles.filter(Boolean).length;

  // Apply playbackRate and play/pause when idx changes
  useEffect(()=>{
    const v = videoRefs.current[idx];
    if (!v) return;
    v.playbackRate = orderedSpeeds[idx] || 1;
    v.currentTime = 0; // reset for trim window
    if (playing) v.play().catch(()=>{});
    else v.pause();
  }, [idx, playing]);

  // Trim watcher: advance when currentTime >= trim duration
  useEffect(()=>{
    if (!playing) return;
    const v = videoRefs.current[idx];
    if (!v) return;
    const maxDur = orderedDurations[idx] || 5;
    const interval = setInterval(() => {
      if (v.currentTime >= maxDur && !v.paused) {
        if (idx < validCount - 1) setIdx(idx+1);
        else { setIdx(0); setCycleKey(k=>k+1); }
      }
    }, 100);
    return () => clearInterval(interval);
  }, [idx, playing, orderedDurations]);

  // Inform parent of play state changes
  useEffect(()=>{ onPlayStateChange && onPlayStateChange(playing); }, [playing]);

  // Pause others when idx changes
  useEffect(()=>{
    videoRefs.current.forEach((v,i)=>{
      if (v && i!==idx) { v.pause(); v.currentTime = 0; }
    });
  }, [idx]);

  const onEnded = () => {
    if (idx < validCount - 1) setIdx(idx+1);
    else { setIdx(0); setCycleKey(k=>k+1); /* loop & retrigger overlay */ }
  };

  const togglePlay = () => setPlaying(p => !p);
  const restart = () => { setIdx(0); setCycleKey(k=>k+1); setPlaying(true); };

  // Overlay styling per titleStyle
  const styleConfig = {
    editorial: {
      titleFont:Fs, titleColor:C.surface, titleBg:"rgba(28,26,23,0.45)", titleSize:26,
      subFont:Fb, subColor:"rgba(255,255,255,0.85)", subSize:13,
      position:"top", padding:"22px 18px", borderRadius:14, blur:true,
    },
    luxury: {
      titleFont:Fs, titleColor:"#E8C97A", titleBg:"transparent", titleSize:30,
      subFont:Fb, subColor:"rgba(255,255,255,0.95)", subSize:13,
      position:"center", padding:"22px", textShadow:"0 4px 20px rgba(0,0,0,0.85)", italic:true,
    },
    young: {
      titleFont:Fb, titleColor:C.surface, titleBg:C.brand, titleSize:22, titleWeight:700,
      subFont:Fb, subColor:"rgba(255,255,255,0.92)", subSize:12, subWeight:500,
      position:"top-left", padding:"10px 14px", borderRadius:8, inline:true,
    },
    minimal: {
      titleFont:Fb, titleColor:C.surface, titleBg:"transparent", titleSize:20, titleWeight:600,
      subFont:Fb, subColor:"rgba(255,255,255,0.75)", subSize:12,
      position:"bottom-left", padding:"0 18px", textShadow:"0 2px 12px rgba(0,0,0,0.85)",
    },
  };
  const s = styleConfig[titleStyle] || styleConfig.editorial;

  // Position layout
  const posStyle = (() => {
    if (s.position==="top") return {top:0,left:0,right:0,padding:s.padding};
    if (s.position==="center") return {top:"40%",left:0,right:0,padding:s.padding,textAlign:"center"};
    if (s.position==="top-left") return {top:14,left:14,padding:s.padding,background:s.titleBg,borderRadius:s.borderRadius};
    if (s.position==="bottom-left") return {bottom:80,left:0,right:0,padding:s.padding};
    return {top:0,left:0,right:0,padding:s.padding};
  })();

  return (
    <div style={{position:"relative",width:"100%",aspectRatio:"9/16",background:"#000",overflow:"hidden",borderRadius:14,height}}>
      <style>{`
        @keyframes overlayIn { 0%{opacity:0;transform:translateY(-12px)} 30%{opacity:1;transform:translateY(0)} 75%{opacity:1} 100%{opacity:0;transform:translateY(-4px)} }
      `}</style>
      {/* Video stack — only active is visible, others have opacity 0 */}
      {orderedFiles.map((url,i) => url ? (
        <video key={i} ref={el=>videoRefs.current[i]=el} src={url}
          style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:i===idx?1:0,transition:"opacity 0.25s"}}
          muted playsInline onEnded={onEnded}
        />
      ) : null)}

      {/* Placeholder when no videos */}
      {validCount===0 && (
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:C.surface,opacity:0.6}}>
          <Icon name="video" size={36} color={C.surface} stroke={1.4}/>
          <p style={{margin:"10px 0 0",fontSize:12,fontFamily:Fb}}>Sube tus 4 tomas para ver el preview</p>
        </div>
      )}

      {/* Title overlay — appears for first 4s of each cycle */}
      {showOverlay && (title || subtitle) && validCount>0 && (
        <div key={cycleKey} style={{position:"absolute",zIndex:5,animation:"overlayIn 5s ease-out forwards",pointerEvents:"none",...posStyle,background:s.position==="top-left"?s.titleBg:undefined,borderRadius:s.position==="top-left"?s.borderRadius:undefined}}>
          {!s.inline && s.position==="top" && (
            <div style={{position:"absolute",inset:0,background:s.titleBg,backdropFilter:s.blur?"blur(8px)":"none",borderRadius:0,zIndex:-1}}/>
          )}
          {title && <div style={{fontFamily:s.titleFont,color:s.titleColor,fontSize:s.titleSize,fontWeight:s.titleWeight||400,letterSpacing:"-0.01em",lineHeight:1.15,fontStyle:s.italic?"italic":"normal",textShadow:s.textShadow,marginBottom:subtitle?4:0}}>{title}</div>}
          {subtitle && <div style={{fontFamily:s.subFont,color:s.subColor,fontSize:s.subSize,fontWeight:s.subWeight||400,letterSpacing:"0.02em",textShadow:s.textShadow}}>{subtitle}</div>}
        </div>
      )}

      {/* Progress dots */}
      {validCount>0 && (
        <div style={{position:"absolute",top:10,left:14,right:14,display:"flex",gap:3,zIndex:6}}>
          {Array.from({length:validCount}).map((_,i)=>(
            <div key={i} style={{flex:1,height:2,borderRadius:1,background:i<idx?"rgba(255,255,255,0.85)":i===idx?"rgba(255,255,255,0.85)":"rgba(255,255,255,0.3)",transition:"all 0.25s"}}/>
          ))}
        </div>
      )}

      {/* Center play/pause button (visible when paused) */}
      {validCount>0 && !playing && (
        <button onClick={togglePlay} style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:60,height:60,borderRadius:"50%",background:"rgba(0,0,0,0.45)",backdropFilter:"blur(10px)",border:"1px solid rgba(255,255,255,0.2)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:7}}>
          <Icon name="play" size={26} color={C.surface}/>
        </button>
      )}
      {validCount>0 && playing && (
        <button onClick={togglePlay} style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:60,height:60,borderRadius:"50%",background:"rgba(0,0,0,0)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:7,opacity:0}} aria-label="pausa">
          <Icon name="play" size={26} color={C.surface}/>
        </button>
      )}

      {/* Audio element — plays selected music track */}
      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto"/>}

      {/* Music indicator + mute toggle (bottom-right) */}
      {musicTrack && validCount>0 && musicMeta && (
        <button onClick={(e)=>{e.stopPropagation(); setMusicMuted(m=>!m);}} style={{position:"absolute",bottom:14,right:14,zIndex:6,padding:"5px 10px",borderRadius:999,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(8px)",display:"inline-flex",alignItems:"center",gap:6,border:"none",cursor:"pointer"}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:musicMuted?"rgba(255,255,255,0.4)":C.surface,animation:musicMuted?"none":"pulseRing 1.4s ease-in-out infinite"}}/>
          <span style={{fontSize:10.5,color:C.surface,fontFamily:Fb,fontWeight:500,letterSpacing:"0.04em"}}>{musicMuted?"♪ Activar":`♪ ${musicMeta.l}`}</span>
        </button>
      )}
    </div>
  );
}

// ─── Reel Editor — UI to customize reel before publishing ───
function ReelEditor({form, setForm}){
  const [tab,setTab]=useState("text");
  const [draggedIdx,setDraggedIdx]=useState(null);
  const [musicCat,setMusicCat]=useState("Todas");

  const setTakeSpeed = (slotIdx, speed) => {
    const next = [...form.takeSpeeds];
    next[slotIdx] = speed;
    setForm({...form, takeSpeeds: next});
  };

  const reorderTakes = (fromOrderIdx, toOrderIdx) => {
    if (fromOrderIdx === toOrderIdx) return;
    const next = [...form.takeOrder];
    const [moved] = next.splice(fromOrderIdx, 1);
    next.splice(toOrderIdx, 0, moved);
    setForm({...form, takeOrder: next});
  };

  return (
    <div style={{marginTop:18,padding:16,borderRadius:14,background:C.surface,border:`1px solid ${C.line}`}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
        <Icon name="sparkle" size={16} color={C.brand} stroke={1.6}/>
        <div>
          <h4 style={{margin:0,fontSize:17,fontWeight:400,color:C.ink,fontFamily:Fs,letterSpacing:"-0.01em"}}>Edita tu reel</h4>
          <p style={{margin:"2px 0 0",fontSize:11,color:C.muted,fontFamily:Fb,fontWeight:400,letterSpacing:"0.02em"}}>Personaliza música, velocidades y texto antes de publicar</p>
        </div>
      </div>

      {/* Preview */}
      <div style={{maxWidth:280,margin:"0 auto 14px"}}>
        <ReelPlayer
          takeFiles={form.videoTakeFiles||{}}
          takeOrder={form.takeOrder}
          takeSpeeds={form.takeSpeeds}
          takeDurations={form.takeDurations||[5,5,5,5]}
          title={form.reelTitle}
          subtitle={form.reelSubtitle}
          titleStyle={form.titleStyle}
          musicTrack={form.musicTrack}
          autoplay={false}
        />
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:4,padding:3,background:C.bg,borderRadius:999,border:`1px solid ${C.line}`,marginBottom:14}}>
        {[{id:"text",l:"Texto",icon:"sparkle"},{id:"takes",l:"Tomas",icon:"video"},{id:"music",l:"Música",icon:"sparkle"}].map(t=>{
          const on = tab===t.id;
          return <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"8px 6px",borderRadius:999,border:"none",background:on?C.ink:"transparent",color:on?C.surface:C.muted,fontSize:11.5,fontWeight:500,cursor:"pointer",fontFamily:Fb,letterSpacing:"0.02em"}}>{t.l}</button>;
        })}
      </div>

      {/* TAB: TEXT */}
      {tab==="text" && (
        <div>
          <div style={{marginBottom:12}}>
            <label style={{fontSize:10,color:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase"}}>Título del reel</label>
            <input value={form.reelTitle} onChange={e=>setForm({...form,reelTitle:e.target.value})} placeholder="Ej: Depto Vitacura" style={{display:"block",width:"100%",padding:"11px 13px",borderRadius:10,background:C.bg,border:`1px solid ${C.line}`,color:C.ink,fontSize:13.5,fontFamily:Fs,fontWeight:400,outline:"none",marginTop:6,boxSizing:"border-box"}}/>
          </div>
          <div style={{marginBottom:14}}>
            <label style={{fontSize:10,color:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase"}}>Subtítulo</label>
            <input value={form.reelSubtitle} onChange={e=>setForm({...form,reelSubtitle:e.target.value})} placeholder="Ej: 3D · 2B · 60 m²" style={{display:"block",width:"100%",padding:"11px 13px",borderRadius:10,background:C.bg,border:`1px solid ${C.line}`,color:C.ink,fontSize:13,fontFamily:Fb,fontWeight:400,outline:"none",marginTop:6,boxSizing:"border-box"}}/>
          </div>
          <label style={{fontSize:10,color:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase"}}>Estilo</label>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginTop:8}}>
            {TITLE_STYLES.map(s=>{
              const on = form.titleStyle===s.k;
              return <button key={s.k} onClick={()=>setForm({...form,titleStyle:s.k})} style={{padding:"10px 11px",borderRadius:10,background:on?C.brandWash:C.bg,border:`1px solid ${on?C.brand:C.line}`,cursor:"pointer",textAlign:"left",fontFamily:Fb}}>
                <div style={{fontSize:12,fontWeight:500,color:on?C.brand:C.ink}}>{s.l}</div>
                <div style={{fontSize:10,color:C.muted,fontWeight:400,marginTop:1,lineHeight:1.3}}>{s.desc}</div>
              </button>;
            })}
          </div>
        </div>
      )}

      {/* TAB: TAKES (reorder ↑↓ + speed + trim) */}
      {tab==="takes" && (
        <div>
          <p style={{margin:"0 0 12px",fontSize:11,color:C.muted,fontFamily:Fb,fontWeight:400,fontStyle:"italic"}}>Usa las flechas para reordenar. Ajusta velocidad y recorte de cada toma.</p>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {form.takeOrder.map((origSlot, orderIdx) => {
              const speed = form.takeSpeeds[origSlot] || 1;
              const duration = (form.takeDurations || [5,5,5,5])[origSlot] ?? 5;
              const guide = VID_GUIDE.find(g => g.n === origSlot+1);
              const isFirst = orderIdx === 0;
              const isLast = orderIdx === form.takeOrder.length - 1;
              return (
                <div key={origSlot} style={{padding:"11px 12px",borderRadius:12,background:C.bg,border:`1px solid ${C.line}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    {/* Reorder buttons */}
                    <div style={{display:"flex",flexDirection:"column",gap:2,flexShrink:0}}>
                      <button onClick={()=>!isFirst&&reorderTakes(orderIdx, orderIdx-1)} disabled={isFirst} style={{width:24,height:20,borderRadius:6,background:isFirst?C.bg:C.surface,border:`1px solid ${C.line}`,cursor:isFirst?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",opacity:isFirst?0.3:1,padding:0}}>
                        <Icon name="chevronUp" size={12} color={C.text} stroke={2}/>
                      </button>
                      <button onClick={()=>!isLast&&reorderTakes(orderIdx, orderIdx+1)} disabled={isLast} style={{width:24,height:20,borderRadius:6,background:isLast?C.bg:C.surface,border:`1px solid ${C.line}`,cursor:isLast?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",opacity:isLast?0.3:1,padding:0}}>
                        <Icon name="chevronDown" size={12} color={C.text} stroke={2}/>
                      </button>
                    </div>
                    {/* Position badge */}
                    <div style={{width:28,height:28,borderRadius:8,background:C.brand,color:C.surface,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12.5,fontWeight:600,fontFamily:Fb,flexShrink:0}}>
                      {orderIdx+1}
                    </div>
                    {/* Title */}
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12.5,fontWeight:500,color:C.ink,fontFamily:Fb,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{guide?.t || `Toma ${origSlot+1}`}</div>
                      <div style={{fontSize:10,color:C.muted,fontFamily:Fb,fontWeight:400,marginTop:1}}>Original toma {origSlot+1} · {duration}s a {speed}×</div>
                    </div>
                  </div>
                  {/* Controls row */}
                  <div style={{display:"flex",alignItems:"center",gap:10,marginTop:10}}>
                    {/* Speed */}
                    <div style={{flexShrink:0}}>
                      <div style={{fontSize:9.5,color:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:4}}>Velocidad</div>
                      <div style={{display:"flex",gap:3,padding:2,background:C.surface,border:`1px solid ${C.line}`,borderRadius:999}}>
                        {[1, 1.5, 2].map(sp => {
                          const on = speed===sp;
                          return <button key={sp} onClick={()=>setTakeSpeed(origSlot, sp)} style={{padding:"4px 10px",borderRadius:999,border:"none",background:on?C.brand:"transparent",color:on?C.surface:C.muted,fontSize:10.5,fontWeight:600,cursor:"pointer",fontFamily:Fb}}>{sp}×</button>;
                        })}
                      </div>
                    </div>
                    {/* Trim duration */}
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                        <span style={{fontSize:9.5,color:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.08em",textTransform:"uppercase"}}>Recorte</span>
                        <span style={{fontSize:10.5,color:C.brand,fontFamily:Fb,fontWeight:600,letterSpacing:"0.02em"}}>{duration}s</span>
                      </div>
                      <input
                        type="range" min="1" max="10" step="1" value={duration}
                        onChange={e=>{
                          const next = [...(form.takeDurations||[5,5,5,5])];
                          next[origSlot] = parseInt(e.target.value, 10);
                          setForm({...form, takeDurations: next});
                        }}
                        style={{width:"100%",accentColor:C.brand,margin:0,height:24}}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p style={{margin:"12px 0 0",fontSize:10.5,color:C.subtle,fontFamily:Fb,fontWeight:400,fontStyle:"italic",lineHeight:1.5}}>💡 Tip: 3-4 segundos por toma se siente dinámico. Interior a 2× + exterior a 1× es la mezcla más usada.</p>
        </div>
      )}

      {/* TAB: MUSIC */}
      {tab==="music" && (() => {
        const cats = ["Todas", ...Array.from(new Set(MUSIC_LIBRARY.map(m=>m.cat)))];
        const visible = musicCat==="Todas" ? MUSIC_LIBRARY : MUSIC_LIBRARY.filter(m=>m.cat===musicCat);
        return (
        <div>
          <p style={{margin:"0 0 10px",fontSize:11,color:C.muted,fontFamily:Fb,fontWeight:400,fontStyle:"italic"}}>{MUSIC_LIBRARY.length} tracks royalty-free para tu reel.</p>
          {/* Category chips */}
          <div style={{display:"flex",gap:5,marginBottom:12,overflowX:"auto",WebkitOverflowScrolling:"touch",paddingBottom:4}}>
            {cats.map(c=>{
              const on = musicCat===c;
              return <button key={c} onClick={()=>setMusicCat(c)} style={{padding:"6px 13px",borderRadius:999,border:`1px solid ${on?C.brand:C.line}`,background:on?C.brand:C.surface,color:on?C.surface:C.muted,fontSize:11.5,fontWeight:500,cursor:"pointer",fontFamily:Fb,whiteSpace:"nowrap",letterSpacing:"0.02em",flexShrink:0}}>{c}</button>;
            })}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {visible.map(m=>{
              const on = form.musicTrack===m.k;
              const isSuggested = m.defaultFor.includes(form.type);
              return (
                <button key={m.k} onClick={()=>setForm({...form,musicTrack:m.k})} style={{padding:"11px 13px",borderRadius:10,background:on?C.brandWash:C.bg,border:`1px solid ${on?C.brand:C.line}`,cursor:"pointer",display:"flex",alignItems:"center",gap:10,textAlign:"left",fontFamily:Fb}}>
                  <div style={{width:34,height:34,borderRadius:"50%",background:on?C.brand:C.surface,border:on?"none":`1px solid ${C.line}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <Icon name={on?"play":"play"} size={14} color={on?C.surface:C.muted}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{fontSize:12.5,fontWeight:500,color:on?C.brand:C.ink}}>{m.l}</span>
                      {isSuggested && <span style={{fontSize:9,color:C.forest,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",background:C.mintWash,padding:"2px 6px",borderRadius:999}}>Sugerida</span>}
                    </div>
                    <div style={{fontSize:10.5,color:C.muted,fontWeight:400,marginTop:1}}>{m.vibe} · {m.bpm} BPM</div>
                  </div>
                  {on && <Icon name="check" size={14} color={C.brand} stroke={2.5}/>}
                </button>
              );
            })}
          </div>
        </div>
        );
      })()}
    </div>
  );
}

// ─── Media analysis (quality + moderation) ───
// Quality checks run 100% in browser via canvas pixel analysis.
// Content moderation (NSFW, violence, drugs) is mocked here — in production this
// must run server-side with Google Vision SafeSearch, AWS Rekognition, or similar.
// ─── Supabase Storage / DB helpers (Phase 2) ───

// Try to re-encode a video Blob to a smaller MP4/WebM via MediaRecorder + canvas
// (best effort — returns original if browser doesn't support or compression fails)
async function compressVideoIfNeeded(blob, maxBytes) {
  if (!blob || blob.size <= maxBytes) return blob;
  if (typeof MediaRecorder === "undefined") return blob; // unsupported browser
  try {
    const url = URL.createObjectURL(blob);
    const v = document.createElement("video");
    v.src = url; v.muted = true; v.playsInline = true;
    await new Promise((resolve, reject) => {
      v.onloadedmetadata = () => resolve();
      v.onerror = () => reject(new Error("video-load-failed"));
    });
    // Downscale to max 720px on the long side
    const ratio = v.videoWidth / v.videoHeight;
    let w = v.videoWidth, h = v.videoHeight;
    if (Math.max(w, h) > 720) {
      if (ratio > 1) { w = 720; h = Math.round(720 / ratio); }
      else { h = 720; w = Math.round(720 * ratio); }
    }
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d");
    const stream = canvas.captureStream(24);
    // Pick best supported codec
    const mime = ["video/webm;codecs=vp9","video/webm;codecs=vp8","video/webm"]
      .find(t => MediaRecorder.isTypeSupported(t)) || "";
    if (!mime) { URL.revokeObjectURL(url); return blob; }
    const chunks = [];
    const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 1_200_000 });
    rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
    const finished = new Promise(res => { rec.onstop = () => res(); });
    rec.start();
    v.play().catch(()=>{});
    const draw = () => {
      if (v.ended || v.paused) return;
      ctx.drawImage(v, 0, 0, w, h);
      requestAnimationFrame(draw);
    };
    draw();
    await new Promise(res => { v.onended = () => res(); });
    rec.stop();
    await finished;
    URL.revokeObjectURL(url);
    const out = new Blob(chunks, { type: mime });
    return (out.size > 0 && out.size < blob.size) ? out : blob;
  } catch (e) {
    console.warn("Video compression failed, using original:", e);
    return blob;
  }
}

// Upload a Blob/File to a bucket under {userId}/{ts}-{rand}.{ext}, return public URL
// Validates size — Supabase default limits 50MB per file
const MAX_UPLOAD_BYTES = 50 * 1024 * 1024; // 50 MB
async function uploadToStorage(bucket, file, userId, extHint) {
  if (!supabase) throw new Error("Supabase not configured");
  if (!userId) throw new Error("Need authenticated user to upload");
  // Auto-compress videos that exceed the limit before failing
  if (bucket === "videos" && file?.size && file.size > MAX_UPLOAD_BYTES) {
    file = await compressVideoIfNeeded(file, MAX_UPLOAD_BYTES);
  }
  // Size check
  if (file?.size && file.size > MAX_UPLOAD_BYTES) {
    const mb = (file.size / 1024 / 1024).toFixed(1);
    throw new Error(`Archivo muy grande (${mb}MB). Máximo 50MB. Probá comprimirlo con HandBrake o reducir la duración.`);
  }
  let ext = extHint || "";
  if (!ext && file?.name) ext = (file.name.split(".").pop() || "").toLowerCase();
  if (!ext && file?.type) {
    const map = { "image/jpeg":"jpg", "image/png":"png", "image/webp":"webp", "video/mp4":"mp4", "video/quicktime":"mov", "video/webm":"webm" };
    ext = map[file.type] || "bin";
  }
  const fname = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext||"bin"}`;
  const { error } = await supabase.storage.from(bucket).upload(fname, file, { upsert:false, contentType: file?.type || undefined });
  if (error) {
    console.error("Upload error:", error);
    throw new Error("Error subiendo: " + (error.message || "intenta de nuevo"));
  }
  const { data } = supabase.storage.from(bucket).getPublicUrl(fname);
  return data.publicUrl;
}

// Convert any URL (blob:, data:, https:) into a Blob via fetch
async function urlToBlob(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch blob from URL");
  return await res.blob();
}

// Map a DB row (from properties table) to the UI prop shape
function mapDbPropToUi(row) {
  const ownerName = row.owner?.name || "Usuario";
  const initials = ownerName.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase();
  return {
    id: row.id,
    type: row.type,
    operacion: row.operacion,
    price: Number(row.price) || 0,
    cur: row.currency || "UF",
    loc: row.loc || "",
    comuna: row.comuna || "",
    region: row.region || "",
    sector: row.sector || "",
    pais: row.pais || "Chile",
    rol: row.rol || "",
    street: row.street || "",
    number: row.numero || "",
    vanityLocation: row.vanity_location || "",
    lat: row.lat,
    lng: row.lng,
    beds: row.beds || 0,
    suites: row.suites || 0,
    baths: row.baths || 0,
    // Compat: nombres nuevos (parking) desde publish backend + viejos (parks) del sell interno
    parks: Number(row.parking ?? row.parks) || 0,
    area: Number(row.area) || 0,
    areaTerreno: Number(row.terreno_m2 ?? row.area_terreno) || 0,
    areaTotal: Number(row.area_total) || 0,
    hectareas: Number(row.hectareas) || 0,
    // "nuevo": ahora unificamos con `condition` (nuevo|usado) — retrocompatible con boolean `nuevo`
    nuevo: row.condition ? row.condition === "nuevo" : !!row.nuevo,
    condition: row.condition || (row.nuevo === true ? "nuevo" : row.nuevo === false ? "usado" : null),
    // Amenities/features: unificamos — publish nuevo escribe `features`, sell interno viejo `amenities`
    amenities: Array.isArray(row.features) && row.features.length ? row.features : (row.amenities || []),
    title: row.title || "",
    desc: row.description || "",
    img: row.thumbnail_url || (row.photo_urls && row.photo_urls[0]) || null,
    user: ownerName,
    avatar: initials,
    liked: false,
    saved: false,
    wa: row.contact_wa || row.owner?.wa || "",
    tags: (Array.isArray(row.features) && row.features.length ? row.features : (row.amenities || [])).slice(0,3),
    photos: (row.photo_urls || []).length,
    hasVideo: !!row.video_url || (row.video_take_urls && Object.keys(row.video_take_urls).length > 0),
    videoFile: row.video_url || null,
    videoTakeFiles: row.video_take_urls || null,
    reelTitle: row.reel_title || "",
    reelSubtitle: row.reel_subtitle || "",
    titleStyle: row.title_style || "editorial",
    musicTrack: row.music_track || "",
    takeOrder: row.take_order || [0,1,2,3],
    takeSpeeds: row.take_speeds || [1,2,2,1],
    takeDurations: row.take_durations || [5,5,5,5],
    _ownerId: row.owner_id,
  };
}

// Fetch all published properties from the database (newest first)
async function fetchProperties() {
  if (!supabase) return [];
  // Columnas explícitas SIN la dirección exacta (loc, street, numero): esas
  // columnas están revocadas para el rol anónimo a nivel de base, así que
  // pedirlas rompería la consulta. El público ve vanity_location/comuna.
  const PUBLIC_COLS = "id, owner_id, type, types, operacion, rol, pais, region, comuna, sector, vanity_location, lat, lng, price, currency, beds, suites, baths, parks, area, area_terreno, area_total, hectareas, privados, title, description, amenities, thumbnail_url, video_url, video_take_urls, photo_urls, music_track, reel_title, reel_subtitle, title_style, take_speeds, take_order, take_durations, views, likes_count, status, nuevo, created_at, updated_at, contact_wa, condition, parking, terreno_m2, features, contact_method, terraza_m2";
  const { data, error } = await supabase
    .from("properties")
    .select(PUBLIC_COLS + ", owner:profiles!properties_owner_id_fkey(name, wa, avatar_url, verified)")
    .eq("status", "published")
    .order("created_at", { ascending: false });
  // `null` (y no `[]`) para que el que llama distinga "falló la consulta" de
  // "no hay publicaciones", y pueda avisarle al usuario en vez de dejarlo
  // viendo los avisos de demo como si fueran reales.
  if (error) { console.warn("fetchProperties error", error); return null; }
  return (data || []).map(mapDbPropToUi);
}

// Capture a single frame from a video at a specific time, return as data URL (JPEG)
async function captureVideoFrame(videoUrl, atSecond = 1.0) {
  return new Promise((resolve, reject) => {
    const v = document.createElement("video");
    v.src = videoUrl; v.muted = true; v.playsInline = true; v.preload = "auto"; v.crossOrigin = "anonymous";
    let done = false;
    const finish = (data) => { if (done) return; done = true; resolve(data); };
    const fail = (e) => { if (done) return; done = true; reject(e); };
    v.onloadeddata = () => {
      const t = Math.min(Math.max(0.1, atSecond), Math.max(0.1, (v.duration || atSecond) - 0.05));
      v.currentTime = t;
    };
    v.onseeked = () => {
      try {
        const c = document.createElement("canvas");
        const maxW = 1280;
        const ratio = (v.videoWidth || 1) / (v.videoHeight || 1);
        c.width = Math.min(v.videoWidth || maxW, maxW);
        c.height = Math.round(c.width / (ratio || 1));
        c.getContext("2d").drawImage(v, 0, 0, c.width, c.height);
        finish(c.toDataURL("image/jpeg", 0.88));
      } catch(e) { fail(e); }
    };
    v.onerror = () => fail(new Error("video-load-failed"));
    setTimeout(() => fail(new Error("capture-timeout")), 10000);
  });
}

async function analyzeMedia(url, isVideo) {
  // For video, capture first frame to a canvas
  const sourceImg = await new Promise((resolve, reject) => {
    if (isVideo) {
      const v = document.createElement("video");
      v.src = url; v.muted = true; v.playsInline = true; v.preload = "auto";
      v.onloadeddata = () => { v.currentTime = Math.min(0.5, v.duration/2 || 0.5); };
      v.onseeked = () => {
        const c = document.createElement("canvas");
        c.width = v.videoWidth || 640; c.height = v.videoHeight || 480;
        c.getContext("2d").drawImage(v, 0, 0);
        resolve({src: c.toDataURL(), width: v.videoWidth, height: v.videoHeight});
      };
      v.onerror = () => reject(new Error("video-load-failed"));
    } else {
      const img = new Image();
      img.onload = () => resolve({src: url, width: img.naturalWidth, height: img.naturalHeight});
      img.onerror = () => reject(new Error("img-load-failed"));
      img.src = url;
    }
  }).catch(() => null);

  if (!sourceImg) return {status:"done", issues:[{k:"error",t:"No se pudo analizar el archivo",sev:"error"}], good:[], moderationOk:false, allowPublish:false};

  // Draw downscaled version to canvas for fast pixel analysis
  const ANALYSIS_SIZE = 200;
  const img = await new Promise((res, rej) => { const i = new Image(); i.onload=()=>res(i); i.onerror=()=>rej(); i.src = sourceImg.src; }).catch(()=>null);
  if (!img) return {status:"done", issues:[{k:"error",t:"Análisis falló",sev:"error"}], good:[], moderationOk:false, allowPublish:false};

  const c = document.createElement("canvas");
  c.width = ANALYSIS_SIZE; c.height = ANALYSIS_SIZE;
  const ctx = c.getContext("2d");
  ctx.drawImage(img, 0, 0, ANALYSIS_SIZE, ANALYSIS_SIZE);
  const data = ctx.getImageData(0,0,ANALYSIS_SIZE,ANALYSIS_SIZE).data;

  // 1. Brightness (avg luminance, 0-255)
  let totalL = 0;
  const gray = new Float32Array(ANALYSIS_SIZE*ANALYSIS_SIZE);
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    const lum = 0.299*data[i] + 0.587*data[i+1] + 0.114*data[i+2];
    totalL += lum; gray[p] = lum;
  }
  const avgBrightness = totalL / (ANALYSIS_SIZE*ANALYSIS_SIZE);

  // 2. Sharpness — Laplacian variance (higher = sharper)
  let lapSum = 0, lapSumSq = 0, count = 0;
  for (let y = 1; y < ANALYSIS_SIZE-1; y++) {
    for (let x = 1; x < ANALYSIS_SIZE-1; x++) {
      const i = y*ANALYSIS_SIZE + x;
      const lap = -4*gray[i] + gray[i-1] + gray[i+1] + gray[i-ANALYSIS_SIZE] + gray[i+ANALYSIS_SIZE];
      lapSum += lap; lapSumSq += lap*lap; count++;
    }
  }
  const lapMean = lapSum / count;
  const sharpness = lapSumSq/count - lapMean*lapMean;

  // 3. Resolution
  const minSide = Math.min(sourceImg.width || 0, sourceImg.height || 0);

  // Build feedback
  const issues = [];
  const good = [];

  // Brightness
  if (avgBrightness < 55) issues.push({k:"dark", t:"Foto muy oscura — buscá luz natural o agregá iluminación", sev:"high"});
  else if (avgBrightness < 80) issues.push({k:"dim", t:"Iluminación débil — abrí cortinas o esperá mejor luz", sev:"low"});
  else if (avgBrightness > 230) issues.push({k:"overexp", t:"Sobreexpuesta — evitá contraluz fuerte", sev:"low"});
  else good.push({k:"light", t:"Iluminación adecuada"});

  // Sharpness — variance thresholds tuned for typical phone photos
  if (sharpness < 80) issues.push({k:"blur", t:"Foto borrosa — estabilizá la cámara con ambas manos", sev:"high"});
  else if (sharpness < 200) issues.push({k:"soft", t:"Algo borrosa — esperá un segundo antes de disparar", sev:"low"});
  else good.push({k:"focus", t:"Bien enfocada y nítida"});

  // Resolution
  if (minSide && minSide < 720) issues.push({k:"low_res", t:"Resolución baja — usa la cámara principal del celular", sev:"low"});
  else if (minSide) good.push({k:"res", t:`Buena resolución (${sourceImg.width}×${sourceImg.height})`});

  // 4. Content moderation — MOCK (in production this hits a server-side AI)
  // Returns "ok" for all uploads — in Fase 2 this calls Google Vision SafeSearch API
  await new Promise(r => setTimeout(r, 600)); // simulate API latency
  const moderationOk = true; // mocked — would be: await fetch('/api/moderate', {body: imgBlob}).then(r=>r.json()).safe
  good.push({k:"safe", t:"Contenido apropiado para la plataforma"});

  // Allow publish unless there's a high-severity quality issue or moderation failed
  const hasHighIssue = issues.some(i => i.sev === "high");
  return {
    status: "done",
    issues, good,
    metrics: { brightness: Math.round(avgBrightness), sharpness: Math.round(sharpness), resolution: `${sourceImg.width}×${sourceImg.height}` },
    moderationOk,
    allowPublish: moderationOk && !hasHighIssue,
  };
}

function Sell({onPublish, goTo, draftKey="sell_draft_v1", onDraftChange, me}) {
  // Cuando el user llega desde greatdeal-app con un reel ya generado:
  //   ?videoUrl=...   → URL del reel ya generado (no necesita re-subir video)
  //   ?caption=...    → copy generado por IA (pre-rellena descripción)
  // Estos query params se consumen 1 vez al montar Sell y luego se ignoran.
  const queryReel = (() => {
    if (typeof window === "undefined") return null;
    try {
      const p = new URLSearchParams(window.location.search);
      const videoUrl = p.get("videoUrl");
      const caption  = p.get("caption");
      if (videoUrl || caption) return { videoUrl: videoUrl || "", caption: caption || "" };
    } catch(e) {}
    return null;
  })();
  // Si llega con reel de greatdeal-app, arrancamos en paso 2 (tipo de propiedad).
  // El paso 4 (video) queda auto-completado con externalReelUrl.
  const [step,setStep]=useState(queryReel?.videoUrl ? 2 : 1);
  // ─── Initial form (loads draft from localStorage if exists) ───
  const initialForm = (() => {
    try {
      const stored = typeof window !== "undefined" && window.localStorage.getItem(draftKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge con query reel si hay
        if (queryReel) {
          if (queryReel.videoUrl) parsed.externalReelUrl = queryReel.videoUrl;
          if (queryReel.caption && !parsed.desc) parsed.desc = queryReel.caption;
        }
        return parsed;
      }
    } catch(e) {}
    return {
      type:"", types:[], operacion:"venta", title:"", desc: (queryReel?.caption || ""),
      externalReelUrl: (queryReel?.videoUrl || ""),
      currency:"UF", price:"",
      // Identificación
      rol:"",
      // Ubicación jerárquica
      pais:"Chile", region:"", comuna:"", sector:"",
      // Dirección dividida
      street:"", number:"",
      // Ubicación a mostrar (nombre amigable para el público)
      vanityLocation:"",
      contactWa:"",
      // Geo
      loc:"", lat:null, lng:null,
      // Distribución
      beds:"", suites:"", baths:"", parks:"",
      area:"", areaTerreno:"", areaTotal:"", hectareas:"", privados:"",
      photos:[], photoFiles:{}, videoUp:false, videoTakes:[false,false,false,false], amenities:[],
      reelTitle:"", reelSubtitle:"", titleStyle:"editorial",
      musicTrack:"",
      takeSpeeds:[1, 2, 2, 1],
      takeOrder:[0, 1, 2, 3],
      takeDurations:[5, 5, 5, 5],
    };
  })();
  const [form,setForm]=useState(initialForm);
  // Pre-fill contact WhatsApp with the user's profile number once available
  useEffect(() => {
    if (me?.wa && !form.contactWa) {
      setForm(f => ({...f, contactWa: me.wa}));
    }
  }, [me?.wa]);
  // ─── Autosave draft on every form change ───
  useEffect(() => {
    try {
      // Skip persisting blob URLs (they don't survive reload anyway) and large fields
      const lite = {...form, photoFiles:{}, videoTakeFiles:undefined, videoFile:undefined};
      window.localStorage.setItem(draftKey, JSON.stringify(lite));
    } catch(e) {}
  }, [form, draftKey]);
  const [aiDone,setAiDone]=useState(false);
  const [uploadFor,setUploadFor]=useState(null);
  const [mapModal,setMapModal]=useState(false);
  const [locFocus,setLocFocus]=useState(false);
  const [comunaFieldFocus,setComunaFieldFocus]=useState(false);
  const [regionFieldFocus,setRegionFieldFocus]=useState(false);
  // Auto-fill region whenever comuna matches a known entry (robust catch-all)
  useEffect(() => {
    if (!form.comuna) return;
    const match = COMUNAS.find(([c]) => c.toLowerCase() === form.comuna.toLowerCase().trim());
    if (match && form.region !== match[1]) {
      setForm(f => ({...f, region: match[1]}));
    }
  }, [form.comuna]);
  const [published,setPublished]=useState(false);
  const total=6; // 1 tipo · 2 detalles · 3 video · 4 fotos · 5 descripción · 6 publicar

  // Auto-fill reel meta when all 4 takes are uploaded
  useEffect(()=>{
    const allDone = (form.videoTakes||[]).every(Boolean);
    if (allDone && (!form.reelTitle || !form.musicTrack)) {
      const comuna = (form.loc||"").split(",")[0].trim();
      const autoTitle = form.type && comuna ? `${form.type} ${comuna}` : form.type || "Mi propiedad";
      let autoSub = "";
      if (form.type==="Casa" || form.type==="Departamento") {
        autoSub = [form.beds&&`${form.beds}D`, form.baths&&`${form.baths}B`, form.area&&`${form.area} m²`].filter(Boolean).join(" · ");
      } else if (form.type==="Parcela") {
        autoSub = [form.hectareas&&`${form.hectareas} ha`, comuna].filter(Boolean).join(" · ");
      } else if (form.type==="Sitio") {
        autoSub = form.area?`${form.area} m²`:"";
      } else if (form.type==="Oficina" || form.type==="Industrial") {
        autoSub = [form.area&&`${form.area} m² útiles`, form.privados&&`${form.privados} priv.`].filter(Boolean).join(" · ");
      }
      setForm(f => ({
        ...f,
        reelTitle: f.reelTitle || autoTitle,
        reelSubtitle: f.reelSubtitle || autoSub,
        musicTrack: f.musicTrack || suggestMusic(form.type),
      }));
    }
  }, [form.videoTakes, form.type, form.loc, form.beds, form.baths, form.area, form.hectareas, form.privados]);

  const [publishing,setPublishing]=useState(false);
  const [publishStatus,setPublishStatus]=useState(""); // visible progress text
  const handlePublish = async () => {
    if (publishing) return;
    setPublishing(true);
    try {
      // 1. Resolve geocode if no coords yet
      setPublishStatus("Verificando ubicación…");
      let finalLat = form.lat, finalLng = form.lng, finalLoc = form.loc, finalComuna = form.comuna, finalRegion = form.region;
      if ((!finalLat || !finalLng) && form.loc && window.google?.maps?.Geocoder) {
        try {
          const g = new window.google.maps.Geocoder();
          const res = await new Promise((resolve) => {
            g.geocode({ address: form.loc + ", Chile", componentRestrictions:{country:"CL"} }, (results, status) => {
              if (status === "OK" && results && results[0]) resolve(results[0]); else resolve(null);
            });
          });
          if (res) {
            finalLat = res.geometry.location.lat();
            finalLng = res.geometry.location.lng();
            finalLoc = res.formatted_address || finalLoc;
            (res.address_components || []).forEach(c => {
              if (!finalComuna && (c.types.includes("administrative_area_level_3") || c.types.includes("locality"))) finalComuna = c.long_name;
              if (!finalRegion && c.types.includes("administrative_area_level_1")) finalRegion = c.long_name;
            });
          }
        } catch(e) { console.warn("Geocode failed", e); }
      }

      // 2. Upload all media to Supabase Storage (replace blob URLs with public URLs)
      const userId = me?.id;
      if (!supabase || !userId) {
        // Fallback (no auth): publish to local state only with existing blob URLs
        const localProp = buildLocalProp({ form, me, finalLat, finalLng, finalLoc, finalComuna, finalRegion });
        onPublish && onPublish(localProp);
        try { window.localStorage.removeItem(draftKey); } catch(e) {}
        setPublished(true);
        return;
      }

      // Upload photos
      let photoUrls = [];
      const photoSlots = form.photos || [];
      if (photoSlots.length > 0 && form.photoFiles) {
        setPublishStatus(`Subiendo fotos (0/${photoSlots.length})…`);
        for (let i = 0; i < photoSlots.length; i++) {
          const slot = photoSlots[i];
          const url = form.photoFiles[slot];
          if (!url) continue;
          try {
            const blob = await urlToBlob(url);
            const publicUrl = await uploadToStorage("photos", blob, userId, "jpg");
            photoUrls.push(publicUrl);
            setPublishStatus(`Subiendo fotos (${i+1}/${photoSlots.length})…`);
          } catch (e) { console.warn("photo upload failed", e); }
        }
      }

      // Upload video (single) — surfaces errors to user so they know if it failed
      let videoUrl = null;
      if (form.videoFile) {
        const blob = await urlToBlob(form.videoFile);
        const sizeMB = (blob.size / 1024 / 1024).toFixed(1);
        setPublishStatus(`Subiendo video (${sizeMB}MB)…`);
        videoUrl = await uploadToStorage("videos", blob, userId, "mp4");
      }

      // Upload 4 takes — same: surface errors
      let videoTakeUrls = {};
      if (form.videoTakeFiles && Object.keys(form.videoTakeFiles).length > 0) {
        const keys = Object.keys(form.videoTakeFiles);
        for (let i = 0; i < keys.length; i++) {
          const k = keys[i];
          const url = form.videoTakeFiles[k];
          if (!url) continue;
          const blob = await urlToBlob(url);
          const sizeMB = (blob.size / 1024 / 1024).toFixed(1);
          setPublishStatus(`Subiendo toma ${i+1} de ${keys.length} (${sizeMB}MB)…`);
          videoTakeUrls[k] = await uploadToStorage("videos", blob, userId, "mp4");
        }
      }

      // Cover image: explicit > first photo > video frame
      setPublishStatus("Generando portada…");
      let coverUrl = null;
      if (form.coverUrl) {
        try { coverUrl = await uploadToStorage("photos", await urlToBlob(form.coverUrl), userId, "jpg"); } catch(e) {}
      }
      if (!coverUrl && photoUrls.length > 0) coverUrl = photoUrls[0];
      if (!coverUrl && (videoUrl || videoTakeUrls[1])) {
        try {
          const frameDataUrl = await captureVideoFrame(videoUrl || videoTakeUrls[1] || form.videoFile || form.videoTakeFiles[1], 1.0);
          const blob = await urlToBlob(frameDataUrl);
          coverUrl = await uploadToStorage("photos", blob, userId, "jpg");
        } catch(e) { console.warn("Frame extract failed", e); }
      }

      // 3. Insert into DB
      setPublishStatus("Publicando…");
      const row = {
        owner_id: userId,
        type: form.type || "Casa",
        types: form.types || (form.type ? [form.type] : []),
        operacion: form.operacion || "venta",
        rol: form.rol || null,
        pais: form.pais || "Chile",
        region: finalRegion || form.region || null,
        comuna: finalComuna || form.comuna || null,
        sector: form.sector || null,
        street: form.street || null,
        numero: form.number || null,
        vanity_location: form.vanityLocation || null,
        loc: finalLoc || null,
        lat: typeof finalLat === "number" ? finalLat : null,
        lng: typeof finalLng === "number" ? finalLng : null,
        price: Number(form.price) || 0,
        currency: form.currency || "UF",
        beds: Number(form.beds) || 0,
        suites: Number(form.suites) || 0,
        baths: Number(form.baths) || 0,
        parks: Number(form.parks) || 0,
        area: Number(form.area) || null,
        area_terreno: Number(form.areaTerreno) || null,
        area_total: Number(form.areaTotal) || null,
        hectareas: Number(form.hectareas) || null,
        privados: Number(form.privados) || 0,
        title: form.title || `${form.type||"Propiedad"} en ${finalComuna || finalLoc || "Santiago"}`,
        description: form.desc || "",
        amenities: form.amenities || [],
        contact_wa: form.contactWa || me?.wa || null,
        thumbnail_url: coverUrl,
        video_url: videoUrl,
        video_take_urls: videoTakeUrls,
        photo_urls: photoUrls,
        music_track: form.musicTrack || null,
        reel_title: form.reelTitle || null,
        reel_subtitle: form.reelSubtitle || null,
        title_style: form.titleStyle || "editorial",
        take_speeds: form.takeSpeeds || [1,2,2,1],
        take_order: form.takeOrder || [0,1,2,3],
        take_durations: form.takeDurations || [5,5,5,5],
        status: "published",
        nuevo: true,
      };
      const { data, error } = await supabase
        .from("properties")
        .insert(row)
        .select("*, owner:profiles!properties_owner_id_fkey(name, wa, avatar_url, verified)")
        .single();
      if (error) throw error;
      const uiProp = mapDbPropToUi(data);
      onPublish && onPublish(uiProp);
      try { window.localStorage.removeItem(draftKey); } catch(e) {}
      setPublished(true);
    } catch (e) {
      console.error("Publish failed", e);
      alert("Hubo un error al publicar: " + (e?.message || "intenta de nuevo"));
    } finally {
      setPublishing(false);
      setPublishStatus("");
    }
  };

  // Build a prop using existing blob URLs (used as fallback when no Supabase)
  const buildLocalProp = ({ form, me, finalLat, finalLng, finalLoc, finalComuna, finalRegion }) => {
    let firstPhotoUrl = form.coverUrl || null;
    if (!firstPhotoUrl && form.photoFiles && form.photos?.length > 0) firstPhotoUrl = form.photoFiles[form.photos[0]];
    return {
      id: Date.now(), type: form.type || "Casa", operacion: form.operacion || "venta",
      price: Number(form.price) || 0, cur: form.currency || "UF",
      loc: finalLoc || "Mi propiedad", comuna: finalComuna || "", region: finalRegion || "",
      lat: typeof finalLat === "number" ? finalLat : null, lng: typeof finalLng === "number" ? finalLng : null,
      beds: Number(form.beds) || 0, suites: Number(form.suites) || 0,
      baths: Number(form.baths) || 0, parks: Number(form.parks) || 0,
      area: Number(form.area) || 0, areaTerreno: Number(form.areaTerreno) || 0,
      areaTotal: Number(form.areaTotal) || 0, hectareas: Number(form.hectareas) || 0,
      nuevo: true, amenities: form.amenities || [],
      title: form.title || `${form.type||"Propiedad"} en ${finalComuna || finalLoc || "Santiago"}`,
      desc: form.desc || "", img: firstPhotoUrl,
      user: me?.name || SELLER.name, avatar: me?.avatar || SELLER.avatar,
      liked: false, saved: false, wa: me?.wa || SELLER.wa,
      tags: (form.amenities||[]).slice(0,3), photos: form.photos?.length || 0,
      hasVideo: !!form.videoUp, videoFile: form.videoFile || null,
      videoTakeFiles: form.videoTakeFiles || null,
      reelTitle: form.reelTitle || "", reelSubtitle: form.reelSubtitle || "",
      titleStyle: form.titleStyle || "editorial", musicTrack: form.musicTrack || "",
      takeOrder: form.takeOrder || [0,1,2,3], takeSpeeds: form.takeSpeeds || [1,2,2,1],
      takeDurations: form.takeDurations || [5,5,5,5],
    };
  };
  const resetForm = () => {
    try { window.localStorage.removeItem(draftKey); } catch(e) {}
    setForm({
      type:"", operacion:"venta", title:"", desc:"",
      currency:"UF", price:"",
      loc:"", comuna:"", lat:null, lng:null,
      beds:"", baths:"", parks:"",
      area:"", areaTerreno:"", areaTotal:"", hectareas:"", privados:"",
      photos:[], videoUp:false, videoTakes:[false,false,false,false], amenities:[],
      reelTitle:"", reelSubtitle:"", titleStyle:"editorial",
      musicTrack:"", takeSpeeds:[1, 2, 2, 1], takeOrder:[0, 1, 2, 3], takeDurations:[5,5,5,5],
    });
    setAiDone(false);
    setStep(1);
    setPublished(false);
  };
  // Filter catalog for the current type
  const sellCatalog = form.type ? FILTER_CATALOGS[form.type] : null;
  const sellAmenities = sellCatalog?.amenities || AMENITIES;
  // Autocomplete sugs for location input
  const locSugs = form.loc.length>=1
    ? COMUNAS.filter(([c,r])=>c.toLowerCase().includes(form.loc.toLowerCase())||r.toLowerCase().includes(form.loc.toLowerCase())).slice(0,6)
    : [];
  const inp={display:"block",width:"100%",padding:"11px 13px",borderRadius:10,background:C.surface,border:`1px solid ${C.line}`,color:C.ink,fontSize:13,fontFamily:Fb,fontWeight:400,outline:"none",marginTop:6,boxSizing:"border-box"};
  const lbl={fontSize:10,color:C.muted,fontFamily:Fb,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.1em"};

  // When the user picks a file, save url to uploadFor.tempUrl and move to phase="preview"
  const onFileChosen = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file || !uploadFor) { setUploadFor(null); return; }
    const url = URL.createObjectURL(file);
    // For video completo (sustituye 4 tomas), apply immediately — no preview phase
    if (uploadFor.kind === "video") {
      setForm({...form, videoUp: true, videoFile: url, videoTakes:[true,true,true,true]});
      setUploadFor(null);
      e.target.value = "";
      return;
    }
    // For photo + video-take, move to preview phase + kick off AI analysis
    const isVideo = uploadFor.kind==="video-take";
    setUploadFor({...uploadFor, phase:"preview", tempUrl:url, tempIsVideo: isVideo, analysis:{status:"loading"}});
    e.target.value = "";
    // Run quality + moderation analysis in background
    analyzeMedia(url, isVideo).then(res => {
      setUploadFor(prev => prev ? ({...prev, analysis:res}) : prev);
    });
  };

  // User confirms the captured file
  const [uploadToast,setUploadToast]=useState(null);
  const confirmCapture = () => {
    if (!uploadFor || !uploadFor.tempUrl) return;
    let toastMsg = "";
    if (uploadFor.kind === "photo") {
      const slot = uploadFor.slot;
      const existing = form.photoFiles || {};
      const newPhotos = form.photos.includes(slot) ? form.photos : [...form.photos, slot];
      setForm({...form, photos: newPhotos, photoFiles: {...existing, [slot]: uploadFor.tempUrl}});
      toastMsg = `Foto ${slot} guardada ✓`;
    } else if (uploadFor.kind === "video-take") {
      const takes = [...(form.videoTakes || [false,false,false,false])];
      takes[uploadFor.slot - 1] = true;
      const allDone = takes.every(Boolean);
      const takeFiles = {...(form.videoTakeFiles||{}), [uploadFor.slot]: uploadFor.tempUrl};
      setForm({...form, videoTakes: takes, videoTakeFiles: takeFiles, videoUp: allDone});
      toastMsg = allDone ? `Toma ${uploadFor.slot} guardada ✓ Las 4 tomas están listas` : `Toma ${uploadFor.slot} de 4 guardada ✓`;
    }
    setUploadFor(null);
    if (toastMsg) {
      setUploadToast(toastMsg);
      setTimeout(()=>setUploadToast(null), 2400);
    }
  };

  // Detect if form has non-trivial content (used for navigation guard)
  const hasContent = !!(form.type || form.title || form.price || form.rol || form.street || form.vanityLocation || (form.photos||[]).length>0 || (form.videoTakes||[]).some(Boolean) || form.videoFile || form.desc);
  useEffect(() => { onDraftChange && onDraftChange(hasContent && !published); }, [hasContent, published, onDraftChange]);

  return (
    <div style={{padding:"0 18px",paddingBottom:92}}>
      {/* Autosave indicator */}
      {hasContent && (
        <div style={{display:"flex",alignItems:"center",gap:6,padding:"6px 10px",marginBottom:8,borderRadius:999,background:C.mintWash,border:`1px solid #CDDBCE`,width:"fit-content"}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:C.forest,animation:"pulseRing 1.6s ease-in-out infinite"}}/>
          <span style={{fontSize:10.5,color:C.forest,fontFamily:Fb,fontWeight:600,letterSpacing:"0.04em"}}>Borrador guardado automáticamente</span>
        </div>
      )}
      <div style={{display:"flex",gap:3,marginBottom:6}}>{Array.from({length:total}).map((_,i)=><div key={i} style={{flex:1,height:2,borderRadius:1,background:step>i?C.brand:C.line,transition:"all 0.3s"}} />)}</div>
      <p style={{fontSize:10,color:C.muted,fontFamily:Fb,fontWeight:500,margin:"0 0 18px",letterSpacing:"0.12em",textTransform:"uppercase"}}>Paso {step} de {total}</p>

      {step===1&&(() => {
        const types = form.types || (form.type ? [form.type] : []);
        const toggle = (t) => {
          let next;
          if (types.includes(t)) next = types.filter(x=>x!==t);
          else if (types.length < 2) next = [...types, t];
          else next = [types[0], t]; // replace second selection
          setForm({...form, types: next, type: next[0] || ""});
        };
        return (
          <div>
            <h3 style={{fontSize:22,fontWeight:400,color:C.ink,fontFamily:Fs,margin:"0 0 4px",letterSpacing:"-0.01em"}}>¿Qué vas a publicar?</h3>
            <p style={{fontSize:12,color:C.muted,fontFamily:Fb,fontWeight:400,margin:"0 0 16px"}}>Elige 1 tipo, o hasta 2 si tu propiedad mezcla categorías (ej: Casa con local comercial).</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {PROP_TYPES.map(({t,icon})=>{
                const on = types.includes(t);
                const order = types.indexOf(t)+1;
                return (
                  <button key={t} onClick={()=>toggle(t)} style={{position:"relative",padding:"20px 12px",borderRadius:12,background:on?C.brandWash:C.surface,border:`1px solid ${on?C.brand:C.line}`,cursor:"pointer",textAlign:"center"}}>
                    {on && <div style={{position:"absolute",top:8,right:8,width:22,height:22,borderRadius:"50%",background:C.brand,color:C.surface,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:600,fontFamily:Fb}}>{order}</div>}
                    <div style={{display:"flex",justifyContent:"center",marginBottom:6}}>
                      <Icon name={icon} size={26} color={on?C.brand:C.text} stroke={1.4}/>
                    </div>
                    <div style={{fontSize:12.5,fontWeight:500,color:on?C.brand:C.ink,fontFamily:Fb,letterSpacing:"0.01em"}}>{t}</div>
                  </button>
                );
              })}
            </div>
            <button onClick={()=>types.length>0 && setStep(2)} disabled={types.length===0} style={{width:"100%",marginTop:18,padding:"13px 18px",borderRadius:12,background:types.length>0?C.ink:C.line,border:"none",cursor:types.length>0?"pointer":"default",color:C.surface,fontSize:13,fontWeight:500,fontFamily:Fb,display:"flex",alignItems:"center",justifyContent:"center",gap:6,letterSpacing:"0.01em"}}>
              {types.length===0 ? "Selecciona al menos 1 tipo" : `Continuar con ${types.length} tipo${types.length>1?"s":""}`}
              {types.length>0 && <Icon name="arrowRight" size={15} color={C.surface} stroke={1.6}/>}
            </button>
          </div>
        );
      })()}

      {step===2&&<div>
        <h3 style={{fontSize:22,fontWeight:400,color:C.ink,fontFamily:Fs,margin:"0 0 4px",letterSpacing:"-0.01em"}}>Detalles de tu {form.type||"propiedad"}</h3>
        <p style={{fontSize:12,color:C.muted,fontFamily:Fb,fontWeight:400,margin:"0 0 18px"}}>Completa lo que aplique. Los campos marcados con * son obligatorios.</p>

        {/* Operación */}
        <div style={{marginBottom:14}}>
          <label style={lbl}>Operación *</label>
          <div style={{display:"flex",gap:5,marginTop:6,padding:3,background:C.surface,border:`1px solid ${C.line}`,borderRadius:999,width:"fit-content"}}>
            {OPERACIONES.map(o=>{
              const on=form.operacion===o.k;
              return <button key={o.k} onClick={()=>setForm({...form,operacion:o.k})} style={{padding:"6px 18px",borderRadius:999,border:"none",background:on?C.ink:"transparent",color:on?C.surface:C.muted,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:Fb,letterSpacing:"0.02em"}}>{o.l}</button>;
            })}
          </div>
        </div>

        {/* Título opcional */}
        <div style={{marginBottom:14}}>
          <label style={lbl}>Título <span style={{textTransform:"none",fontWeight:400,letterSpacing:"0",color:C.subtle,marginLeft:4}}>(opcional)</span></label>
          <input type="text" placeholder={`Ej: ${form.type==="Casa"?"Casa con piscina y quincho":form.type==="Departamento"?"Depto con vista a la cordillera":"Propiedad destacada"}`} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={inp}/>
          <p style={{margin:"5px 0 0",fontSize:10.5,color:C.subtle,fontFamily:Fb,fontWeight:400,fontStyle:"italic"}}>Si lo dejas en blanco, lo armamos automáticamente con la IA según los datos.</p>
        </div>

        {/* ROL del SII */}
        <div style={{marginBottom:14}}>
          <label style={lbl}>ROL del SII <span style={{textTransform:"none",fontWeight:400,letterSpacing:"0",color:C.subtle,marginLeft:4}}>(opcional)</span></label>
          <input type="text" placeholder="Ej: 1234-5" value={form.rol} onChange={e=>setForm({...form,rol:e.target.value})} style={inp}/>
          <p style={{margin:"5px 0 0",fontSize:10.5,color:C.subtle,fontFamily:Fb,fontWeight:400,fontStyle:"italic"}}>Rol de avalúo fiscal. Lo encontrás en el último pago de contribuciones.</p>
        </div>

        {/* País / Comuna / Región / Sector — comuna primero (con autocomplete), región se autocompleta */}
        <div style={{marginBottom:14}}>
          <label style={lbl}>Ubicación geográfica *</label>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:6}}>
            {/* País */}
            <input type="text" placeholder="País" value={form.pais} onChange={e=>setForm({...form,pais:e.target.value})} style={{...inp,marginTop:0}}/>

            {/* Comuna con autocomplete — cascadea región automáticamente */}
            <div style={{position:"relative"}}>
              <input type="text" placeholder="Comuna (ej: Las Condes)" value={form.comuna}
                onChange={e=>{
                  const v = e.target.value;
                  const match = COMUNAS.find(([c])=>c.toLowerCase()===v.toLowerCase());
                  setForm(f=>({...f, comuna:v, region: match ? match[1] : f.region}));
                  setComunaFieldFocus(true);
                }}
                onFocus={()=>setComunaFieldFocus(true)}
                onBlur={()=>setTimeout(()=>setComunaFieldFocus(false),200)}
                style={{...inp,marginTop:0}}/>
              {comunaFieldFocus && (() => {
                const q = (form.comuna||"").toLowerCase();
                const sugs = q.length>=1
                  ? COMUNAS.filter(([c])=>c.toLowerCase().includes(q)).slice(0,8)
                  : COMUNAS.slice(0,12); // sin búsqueda: top 12
                if (sugs.length===0) return null;
                return (
                  <div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,zIndex:100,background:C.surface,border:`1px solid ${C.line}`,borderRadius:10,boxShadow:`0 8px 24px ${C.ink}15`,maxHeight:240,overflowY:"auto"}}>
                    {sugs.map(([c,r],i)=>(
                      <button key={c} onMouseDown={(e)=>{e.preventDefault(); setForm(f=>({...f, comuna:c, region:r})); setComunaFieldFocus(false);}} style={{width:"100%",padding:"9px 11px",border:"none",background:"transparent",cursor:"pointer",display:"flex",alignItems:"center",gap:7,textAlign:"left",borderBottom:i<sugs.length-1?`1px solid ${C.lineSoft}`:"none"}}>
                        <Icon name="pin" size={11} color={C.muted} stroke={1.5}/>
                        <div>
                          <div style={{fontSize:12,fontWeight:500,color:C.ink,fontFamily:Fb}}>{c}</div>
                          <div style={{fontSize:9.5,color:C.muted,fontFamily:Fb,fontWeight:400,marginTop:1}}>{r}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Región con dropdown (selector de las regiones únicas) */}
            <div style={{position:"relative"}}>
              <input type="text" placeholder="Región" value={form.region}
                onChange={e=>{setForm(f=>({...f, region:e.target.value})); setRegionFieldFocus(true);}}
                onFocus={()=>setRegionFieldFocus(true)}
                onBlur={()=>setTimeout(()=>setRegionFieldFocus(false),200)}
                style={{...inp,marginTop:0}}/>
              {regionFieldFocus && (() => {
                const allRegions = Array.from(new Set(COMUNAS.map(([_,r])=>r)));
                const q = (form.region||"").toLowerCase();
                const sugs = q.length>=1
                  ? allRegions.filter(r=>r.toLowerCase().includes(q))
                  : allRegions;
                if (sugs.length===0) return null;
                return (
                  <div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,zIndex:100,background:C.surface,border:`1px solid ${C.line}`,borderRadius:10,boxShadow:`0 8px 24px ${C.ink}15`,maxHeight:240,overflowY:"auto"}}>
                    {sugs.map((r,i)=>(
                      <button key={r} onMouseDown={(e)=>{e.preventDefault(); setForm(f=>({...f, region:r})); setRegionFieldFocus(false);}} style={{width:"100%",padding:"9px 11px",border:"none",background:"transparent",cursor:"pointer",display:"flex",alignItems:"center",gap:7,textAlign:"left",borderBottom:i<sugs.length-1?`1px solid ${C.lineSoft}`:"none",fontSize:12,fontWeight:500,color:C.ink,fontFamily:Fb}}>
                        <Icon name="pin" size={11} color={C.muted} stroke={1.5}/>{r}
                      </button>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Sector */}
            <input type="text" placeholder="Sector (ej: San Damián)" value={form.sector} onChange={e=>setForm({...form,sector:e.target.value})} style={{...inp,marginTop:0}}/>
          </div>
        </div>

        {/* Dirección — calle y número separados */}
        <div style={{marginBottom:14}}>
          <label style={lbl}>Dirección *</label>
          <div style={{display:"flex",gap:8,marginTop:6}}>
            <input type="text" placeholder="Nombre de la calle (ej: Av. Manquehue)" value={form.street} onChange={e=>setForm({...form,street:e.target.value, loc:`${e.target.value} ${form.number}, ${form.comuna||""}`})} style={{...inp,marginTop:0,flex:2}}/>
            <input type="text" placeholder="Número" value={form.number} onChange={e=>setForm({...form,number:e.target.value, loc:`${form.street} ${e.target.value}, ${form.comuna||""}`})} style={{...inp,marginTop:0,flex:1}}/>
          </div>
        </div>

        {/* Ubicación a mostrar (vanity name visible al público) */}
        <div style={{marginBottom:14}}>
          <label style={lbl}>Ubicación a mostrar <span style={{textTransform:"none",fontWeight:400,letterSpacing:"0",color:C.subtle,marginLeft:4}}>(opcional)</span></label>
          <input type="text" placeholder="Ej: Santa María de Manquehue plano · Las Hualtatas con las Tranqueras" value={form.vanityLocation} onChange={e=>setForm({...form,vanityLocation:e.target.value})} style={inp}/>
          <p style={{margin:"5px 0 0",fontSize:10.5,color:C.subtle,fontFamily:Fb,fontWeight:400,fontStyle:"italic"}}>Nombre amigable del barrio o referencia conocida. Se muestra en el reel y en la ficha pública.</p>
        </div>

        {/* Precio con toggle UF/CLP */}
        <div style={{marginBottom:14}}>
          <label style={lbl}>Precio *</label>
          <div style={{display:"flex",gap:8,marginTop:6,alignItems:"stretch"}}>
            <div style={{display:"flex",gap:3,padding:3,background:C.surface,border:`1px solid ${C.line}`,borderRadius:10}}>
              {["UF","CLP"].map(c=>{
                const on=form.currency===c;
                return <button key={c} onClick={()=>setForm({...form,currency:c})} style={{padding:"0 14px",borderRadius:8,border:"none",background:on?C.ink:"transparent",color:on?C.surface:C.muted,fontSize:11.5,fontWeight:500,cursor:"pointer",fontFamily:Fb}}>{c}</button>;
              })}
            </div>
            <input type="number" placeholder={form.currency==="UF"?"Ej: 3.500":"Ej: 140000000"} value={form.price} onChange={e=>setForm({...form,price:e.target.value})} style={{...inp,marginTop:0,flex:1}}/>
          </div>
        </div>

        {/* Número de contacto — por default el del perfil, editable por propiedad */}
        <div style={{marginBottom:14}}>
          <label style={lbl}>Número de contacto *</label>
          <input type="tel" placeholder="+56 9 8765 4321" value={form.contactWa||""} onChange={e=>setForm({...form,contactWa:e.target.value})} style={inp}/>
          <p style={{margin:"5px 0 0",fontSize:10.5,color:C.subtle,fontFamily:Fb,fontWeight:400,fontStyle:"italic"}}>{me?.wa && form.contactWa===me.wa ? "Usando tu WhatsApp del perfil. Podés cambiarlo solo para esta propiedad." : "Los interesados van a contactarte por WhatsApp a este número."}</p>
        </div>

        {/* Superficies dinámicas por tipo */}
        {form.type==="Casa" && (
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            <div style={{flex:1}}><label style={lbl}>Sup. construida (m²) *</label><input type="number" placeholder="120" value={form.area} onChange={e=>setForm({...form,area:e.target.value})} style={inp}/></div>
            <div style={{flex:1}}><label style={lbl}>Sup. terreno (m²) *</label><input type="number" placeholder="250" value={form.areaTerreno} onChange={e=>setForm({...form,areaTerreno:e.target.value})} style={inp}/></div>
          </div>
        )}
        {form.type==="Departamento" && (
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            <div style={{flex:1}}><label style={lbl}>Sup. útil (m²) *</label><input type="number" placeholder="80" value={form.area} onChange={e=>setForm({...form,area:e.target.value})} style={inp}/></div>
            <div style={{flex:1}}><label style={lbl}>Sup. total (m²)</label><input type="number" placeholder="95" value={form.areaTotal} onChange={e=>setForm({...form,areaTotal:e.target.value})} style={inp}/></div>
          </div>
        )}
        {form.type==="Sitio" && (
          <div style={{marginBottom:14}}><label style={lbl}>Sup. total (m²) *</label><input type="number" placeholder="500" value={form.area} onChange={e=>setForm({...form,area:e.target.value})} style={inp}/></div>
        )}
        {form.type==="Parcela" && (
          <div style={{marginBottom:14}}><label style={lbl}>Hectáreas *</label><input type="number" placeholder="0.5" value={form.hectareas} onChange={e=>setForm({...form,hectareas:e.target.value})} style={inp}/></div>
        )}
        {form.type==="Oficina" && (
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            <div style={{flex:1}}><label style={lbl}>Sup. útil (m²) *</label><input type="number" placeholder="60" value={form.area} onChange={e=>setForm({...form,area:e.target.value})} style={inp}/></div>
            <div style={{flex:1}}><label style={lbl}>N° privados</label><input type="number" placeholder="3" value={form.privados} onChange={e=>setForm({...form,privados:e.target.value})} style={inp}/></div>
          </div>
        )}
        {form.type==="Industrial" && (
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            <div style={{flex:1}}><label style={lbl}>Sup. útil (m²) *</label><input type="number" placeholder="400" value={form.area} onChange={e=>setForm({...form,area:e.target.value})} style={inp}/></div>
            <div style={{flex:1}}><label style={lbl}>Sup. total (m²)</label><input type="number" placeholder="600" value={form.areaTotal} onChange={e=>setForm({...form,areaTotal:e.target.value})} style={inp}/></div>
          </div>
        )}

        {/* Dorms/Baños/Estac — solo si aplica */}
        {(sellCatalog?.showBeds || sellCatalog?.showBaths || sellCatalog?.showParks) && (
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            {sellCatalog?.showBeds && <div style={{flex:1}}><label style={lbl}>Dorms.</label><input type="number" placeholder="0" value={form.beds} onChange={e=>setForm({...form,beds:e.target.value})} style={inp}/></div>}
            {sellCatalog?.showBeds && <div style={{flex:1}}><label style={lbl}>Suites <span style={{textTransform:"none",fontWeight:400,color:C.subtle}}>(opc)</span></label><input type="number" placeholder="0" value={form.suites} onChange={e=>setForm({...form,suites:e.target.value})} style={inp}/></div>}
            {sellCatalog?.showBaths && <div style={{flex:1}}><label style={lbl}>Baños</label><input type="number" placeholder="0" value={form.baths} onChange={e=>setForm({...form,baths:e.target.value})} style={inp}/></div>}
            {sellCatalog?.showParks && <div style={{flex:1}}><label style={lbl}>Estac.</label><input type="number" placeholder="0" value={form.parks} onChange={e=>setForm({...form,parks:e.target.value})} style={inp}/></div>}
          </div>
        )}

        {/* Mapa — placeholder cuando no hay pin / preview del mapa con pin cuando hay */}
        <div style={{marginBottom:18}}>
          <label style={{...lbl,display:"flex",alignItems:"center",gap:5}}><Icon name="pin" size={11} color={C.muted} stroke={1.5}/>Ubicación en el mapa</label>
          {typeof form.lat === "number" && typeof form.lng === "number" ? (
            <div style={{marginTop:8,position:"relative",borderRadius:12,overflow:"hidden",border:`1px solid ${C.brand}`}}>
              <MapView lat={form.lat} lng={form.lng} address={form.loc} height={160} zoom={16}/>
              <button onClick={()=>setMapModal(true)} style={{position:"absolute",top:10,right:10,padding:"6px 12px",borderRadius:999,background:C.surface,border:`1px solid ${C.line}`,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6,fontSize:11,fontWeight:500,color:C.brand,fontFamily:Fb,boxShadow:`0 4px 12px ${C.ink}25`}}>
                <Icon name="pencil" size={11} color={C.brand} stroke={1.8}/>Mover pin
              </button>
              <div style={{position:"absolute",bottom:10,left:10,right:10,padding:"7px 11px",borderRadius:8,background:"rgba(45,74,55,0.94)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",gap:8,boxShadow:"0 4px 12px rgba(28,26,23,0.25)"}}>
                <Icon name="checkCircle" size={13} color={C.surface} stroke={2}/>
                <span style={{fontSize:11,color:C.surface,fontFamily:Fb,fontWeight:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>Pin colocado · {form.lat.toFixed(4)}, {form.lng.toFixed(4)}</span>
              </div>
            </div>
          ) : (
            <div onClick={()=>setMapModal(true)} style={{marginTop:8,borderRadius:12,border:`1px dashed ${C.brand}`,height:100,background:C.brandWash,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:6,cursor:"pointer"}}>
              <Logo size={26} />
              <span style={{fontSize:11,color:C.brand,fontFamily:Fb,fontWeight:500,letterSpacing:"0.04em"}}>Toca para marcar el pin exacto</span>
            </div>
          )}
        </div>

        {/* Características dinámicas según tipo */}
        {sellAmenities.length>0 && (
          <div style={{marginBottom:8}}>
            <label style={lbl}>Características especiales</label>
            <p style={{margin:"4px 0 10px",fontSize:11,color:C.subtle,fontFamily:Fb,fontWeight:400,fontStyle:"italic"}}>Marca todas las que tenga tu {form.type?.toLowerCase()||"propiedad"} — atrae más interesados.</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
              {sellAmenities.map(a=>{
                const on=form.amenities.includes(a.k);
                return (
                  <button key={a.k} onClick={()=>{
                    const next = on ? form.amenities.filter(x=>x!==a.k) : [...form.amenities,a.k];
                    setForm({...form,amenities:next});
                  }} style={{padding:"10px 11px",borderRadius:10,background:on?C.brandWash:C.surface,border:`1px solid ${on?C.brand:C.line}`,cursor:"pointer",display:"flex",alignItems:"center",gap:8,textAlign:"left",fontFamily:Fb}}>
                    <Icon name={a.icon} size={15} color={on?C.brand:C.muted} stroke={1.5}/>
                    <span style={{fontSize:11.5,fontWeight:500,color:on?C.brand:C.ink,lineHeight:1.2,flex:1}}>{a.l}</span>
                    {on&&<Icon name="check" size={12} color={C.brand} stroke={2.2}/>}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>}

      {step===3&&<div>
        <h3 style={{fontSize:22,fontWeight:400,color:C.ink,fontFamily:Fs,margin:"0 0 4px",letterSpacing:"-0.01em"}}>Tu video</h3>
        <p style={{fontSize:12,color:C.muted,fontFamily:Fb,fontWeight:400,margin:"0 0 14px"}}>Elige cómo quieres armar el reel de tu propiedad.</p>

        {/* ─── OPTION A: Video completo (most prominent) ─── */}
        <div style={{padding:"16px 14px",borderRadius:14,background:form.videoFile?C.mintWash:C.surface,border:`2px solid ${form.videoFile?C.forest:C.brand}`,marginBottom:10,position:"relative"}}>
          {form.videoFile && <div style={{position:"absolute",top:10,right:10,padding:"3px 8px",borderRadius:999,background:C.forest,fontSize:9,color:C.surface,fontWeight:600,fontFamily:Fb,letterSpacing:"0.1em",textTransform:"uppercase"}}>Listo ✓</div>}
          <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
            <div style={{width:46,height:46,borderRadius:12,background:form.videoFile?C.forest:C.brand,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Icon name="video" size={22} color={C.surface} stroke={1.5}/>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:14,fontWeight:500,color:C.ink,fontFamily:Fb}}>Sube un video completo</div>
              <p style={{margin:"3px 0 10px",fontSize:11.5,color:C.muted,fontFamily:Fb,fontWeight:400,lineHeight:1.45}}>{form.videoFile?"Video cargado. Toca para reemplazar.":"Tu reel ya editado (15-30s). Recomendado si tienes uno listo."}</p>
              <label style={{display:"inline-flex",alignItems:"center",gap:7,padding:"9px 14px",borderRadius:10,background:form.videoFile?C.surface:C.brand,border:form.videoFile?`1px solid ${C.line}`:"none",color:form.videoFile?C.brand:C.surface,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:Fb}}>
                <Icon name={form.videoFile?"pencil":"plus"} size={13} color={form.videoFile?C.brand:C.surface} stroke={1.8}/>
                {form.videoFile?"Reemplazar video":"Subir video"}
                <input type="file" accept="video/*" style={{display:"none"}} onChange={(e)=>{const f=e.target.files?.[0]; if(f){const url=URL.createObjectURL(f); setForm(prev=>({...prev,videoFile:url,videoUp:true,videoTakes:[true,true,true,true]})); e.target.value="";}}}/>
              </label>
            </div>
          </div>
          {form.videoFile && (
            <video src={form.videoFile} controls style={{width:"100%",borderRadius:10,marginTop:12,maxHeight:200,background:"#000"}}/>
          )}
        </div>

        {/* ─── Divider ─── */}
        <div style={{display:"flex",alignItems:"center",gap:10,margin:"14px 0"}}>
          <div style={{flex:1,height:1,background:C.line}}/>
          <span style={{fontSize:10,color:C.muted,fontFamily:Fb,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase"}}>o arma uno con 4 tomas</span>
          <div style={{flex:1,height:1,background:C.line}}/>
        </div>

        {/* ─── OPTION B: 4 takes (multi-select all at once + individual) ─── */}
        {/* Bulk multi-upload button */}
        <label style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",borderRadius:12,background:C.brandWash,border:`1px dashed ${C.brand}`,cursor:"pointer",marginBottom:10}}>
          <div style={{width:36,height:36,borderRadius:10,background:C.brand,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <Icon name="plus" size={18} color={C.surface} stroke={2}/>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:500,color:C.brand,fontFamily:Fb}}>Subir las 4 tomas juntas</div>
            <div style={{fontSize:10.5,color:C.muted,fontFamily:Fb,fontWeight:400,marginTop:1}}>Selecciona hasta 4 videos de tu galería al mismo tiempo</div>
          </div>
          <input type="file" accept="video/*" multiple style={{display:"none"}} onChange={(e)=>{
            const files = Array.from(e.target.files || []).slice(0, 4);
            if (files.length === 0) return;
            const newTakes = [...(form.videoTakes || [false,false,false,false])];
            const newTakeFiles = {...(form.videoTakeFiles || {})};
            files.forEach((f, i) => {
              const slot = i + 1;
              newTakes[i] = true;
              newTakeFiles[slot] = URL.createObjectURL(f);
            });
            const allDone = newTakes.every(Boolean);
            setForm({...form, videoTakes: newTakes, videoTakeFiles: newTakeFiles, videoUp: allDone});
            setUploadToast(`${files.length} toma${files.length>1?"s":""} cargada${files.length>1?"s":""} ✓`);
            setTimeout(()=>setUploadToast(null), 2400);
            e.target.value = "";
          }}/>
        </label>

        {/* Individual takes (each with its own guide) */}
        {VID_GUIDE.map(g=>{
          const isUp = (form.videoTakes||[])[g.n-1];
          return (
            <div key={g.n} style={{padding:12,borderRadius:12,background:isUp?C.brandWash:C.surface,border:`1px solid ${isUp?C.brand:C.line}`,display:"flex",gap:11,marginBottom:7,alignItems:"center"}}>
              <div style={{width:38,height:38,borderRadius:10,background:isUp?C.brand:C.brandWash,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:Fb,fontSize:13,fontWeight:600,color:isUp?C.surface:C.brand}}>
                {isUp ? <Icon name="check" size={16} color={C.surface} stroke={2.2}/> : g.n}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:500,color:C.ink,fontFamily:Fb,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{g.t} <span style={{color:C.muted,fontWeight:400,fontSize:10.5}}>· {g.dur}</span></div>
                <p style={{margin:"1px 0 0",fontSize:10.5,color:C.muted,fontFamily:Fb,fontWeight:400,lineHeight:1.35,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{isUp?"Lista ✓ — toca para cambiar":g.d}</p>
              </div>
              <button onClick={()=>setUploadFor({kind:"video-take",slot:g.n,label:`Toma ${g.n}: ${g.t}`,phase:"guide",guideData:g})} style={{padding:"7px 11px",borderRadius:8,background:isUp?C.surface:C.brand,border:isUp?`1px solid ${C.brand}`:"none",color:isUp?C.brand:C.surface,fontSize:11,fontWeight:500,cursor:"pointer",fontFamily:Fb,whiteSpace:"nowrap",flexShrink:0}}>
                {isUp?"Cambiar":"Subir"}
              </button>
            </div>
          );
        })}

        {/* Progress bar */}
        <div style={{margin:"10px 0 0",padding:"10px 12px",borderRadius:10,background:C.bg,border:`1px solid ${C.line}`,display:"flex",alignItems:"center",gap:10}}>
          <div style={{display:"flex",gap:3,flex:1}}>
            {(form.videoTakes||[false,false,false,false]).map((up,i)=>(
              <div key={i} style={{flex:1,height:4,borderRadius:2,background:up?C.forest:C.line,transition:"all 0.25s"}}/>
            ))}
          </div>
          <span style={{fontSize:11,color:(form.videoTakes||[]).every(Boolean)?C.forest:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.02em"}}>
            {(form.videoTakes||[]).filter(Boolean).length}/4 tomas
          </span>
        </div>

        <div style={{marginTop:10,padding:11,borderRadius:10,background:C.mintWash,border:`1px solid #CDDBCE`,display:"flex",alignItems:"center",gap:10}}>
          <Icon name="sparkle" size={15} color={C.forest} stroke={1.5}/>
          <p style={{margin:0,fontSize:11,color:C.text,fontFamily:Fb,fontWeight:400,lineHeight:1.4}}>La IA edita tu reel con transiciones, música y texto automáticamente.</p>
        </div>

        {/* ─── Reel Editor: appears when all 4 takes OR full video uploaded ─── */}
        {((form.videoTakes||[]).every(Boolean) && (form.videoTakeFiles||{})[1]) && (
          <ReelEditor form={form} setForm={setForm}/>
        )}
      </div>}

      {step===4&&<div>
        <h3 style={{fontSize:22,fontWeight:400,color:C.ink,fontFamily:Fs,margin:"0 0 4px",letterSpacing:"-0.01em"}}>Foto de portada</h3>
        <p style={{fontSize:12,color:C.muted,fontFamily:Fb,fontWeight:400,margin:"0 0 14px"}}>La primera imagen que ven los interesados en el feed y en el reel.</p>

        {/* Preview grande de la portada actual */}
        {form.coverUrl ? (
          <div style={{position:"relative",borderRadius:14,overflow:"hidden",border:`2px solid ${C.brand}`,marginBottom:14}}>
            <img src={form.coverUrl} alt="Portada" style={{width:"100%",aspectRatio:"16/10",objectFit:"cover",display:"block"}}/>
            <div style={{position:"absolute",top:10,left:10,padding:"4px 10px",borderRadius:999,background:"rgba(45,74,55,0.94)",display:"inline-flex",alignItems:"center",gap:5}}>
              <Icon name="checkCircle" size={11} color={C.surface} stroke={2}/>
              <span style={{fontSize:10.5,color:C.surface,fontFamily:Fb,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase"}}>Portada actual</span>
            </div>
            <button onClick={()=>setForm(f=>({...f, coverUrl: null}))} style={{position:"absolute",top:10,right:10,padding:"5px 11px",borderRadius:999,background:C.surface,border:`1px solid ${C.line}`,cursor:"pointer",fontSize:10.5,color:C.terracotta,fontWeight:500,fontFamily:Fb,display:"inline-flex",alignItems:"center",gap:4}}>
              <Icon name="close" size={10} color={C.terracotta} stroke={2}/>Quitar
            </button>
          </div>
        ) : (
          <div style={{borderRadius:14,border:`2px dashed ${C.line}`,padding:30,marginBottom:14,textAlign:"center",aspectRatio:"16/10",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,background:C.surface}}>
            <Icon name="camera" size={36} color={C.subtle} stroke={1.4}/>
            <p style={{margin:0,fontSize:13,color:C.muted,fontFamily:Fb,fontWeight:500}}>Sin portada todavía</p>
            <p style={{margin:0,fontSize:11,color:C.subtle,fontFamily:Fb,fontWeight:400,fontStyle:"italic"}}>Subí una foto o capturá un frame del video</p>
          </div>
        )}

        {/* Opción A: Subir foto */}
        <label style={{display:"flex",alignItems:"center",gap:11,padding:"14px 14px",borderRadius:12,background:C.surface,border:`1px solid ${form.coverUrl?C.line:C.brand}`,cursor:"pointer",marginBottom:10}}>
          <div style={{width:42,height:42,borderRadius:10,background:C.brand,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <Icon name="camera" size={20} color={C.surface} stroke={1.6}/>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:500,color:C.ink,fontFamily:Fb}}>{form.coverUrl?"Cambiar foto de portada":"Subir foto de portada"}</div>
            <div style={{fontSize:10.5,color:C.muted,fontFamily:Fb,fontWeight:400,marginTop:2}}>Sube una foto desde tu galería como portada</div>
          </div>
          <Icon name="arrowRight" size={15} color={C.muted} stroke={1.6}/>
          <input type="file" accept="image/*" style={{display:"none"}} onChange={(e)=>{
            const f = e.target.files?.[0];
            if (!f) return;
            const url = URL.createObjectURL(f);
            setForm(prev=>({...prev, coverUrl: url}));
            e.target.value = "";
          }}/>
        </label>

        {/* Opción B: Capturar del video (si hay video) */}
        {(form.videoFile || (form.videoTakeFiles && form.videoTakeFiles[1])) && (
          <button onClick={async ()=>{
            const src = form.videoFile || form.videoTakeFiles[1];
            try {
              const frame = await captureVideoFrame(src, 1.0);
              setForm(f=>({...f, coverUrl: frame}));
            } catch(e){ alert("No pudimos capturar el frame del video"); }
          }} style={{display:"flex",alignItems:"center",gap:11,padding:"14px 14px",borderRadius:12,background:C.surface,border:`1px solid ${C.line}`,cursor:"pointer",width:"100%",textAlign:"left"}}>
            <div style={{width:42,height:42,borderRadius:10,background:C.forest,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Icon name="video" size={20} color={C.surface} stroke={1.6}/>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:500,color:C.ink,fontFamily:Fb}}>Capturar del video</div>
              <div style={{fontSize:10.5,color:C.muted,fontFamily:Fb,fontWeight:400,marginTop:2}}>Usá un frame de tu video como portada</div>
            </div>
            <Icon name="arrowRight" size={15} color={C.muted} stroke={1.6}/>
          </button>
        )}

        <div style={{marginTop:14,padding:11,borderRadius:10,background:C.mintWash,border:`1px solid #CDDBCE`,display:"flex",alignItems:"center",gap:9}}>
          <Icon name="sparkle" size={15} color={C.forest} stroke={1.5}/>
          <p style={{margin:0,fontSize:11,color:C.text,fontFamily:Fb,fontWeight:400,lineHeight:1.45}}>Tip: el video es lo principal — la portada es la imagen que se ve en el feed antes de hacer play.</p>
        </div>
      </div>}

      {step===5&&<div>
        <h3 style={{fontSize:22,fontWeight:400,color:C.ink,fontFamily:Fs,margin:"0 0 16px",letterSpacing:"-0.01em"}}>Descripción</h3>
        <textarea placeholder="Describe tu propiedad con tus palabras..." value={form.desc} onChange={e=>{setForm({...form,desc:e.target.value});setAiDone(false);}} style={{width:"100%",minHeight:130,padding:14,borderRadius:12,background:C.surface,border:`1px solid ${C.line}`,color:C.ink,fontSize:13.5,fontFamily:Fb,fontWeight:400,outline:"none",resize:"vertical",lineHeight:1.6,boxSizing:"border-box"}} />
        <button onClick={()=>{if(form.desc){setForm({...form,desc:"Amplia propiedad con excelente ubicación y terminaciones de primer nivel. Espacios luminosos, ideal para familias. Cercana a transporte, colegios y áreas verdes."});setAiDone(true);}}} style={{width:"100%",padding:13,borderRadius:12,marginTop:10,background:aiDone?C.brandWash:C.ink,border:aiDone?`1px solid ${C.line}`:"none",cursor:"pointer",color:aiDone?C.brand:C.surface,fontSize:13,fontWeight:500,fontFamily:Fb,display:"flex",alignItems:"center",justifyContent:"center",gap:8,letterSpacing:"0.01em"}}>
          <Icon name={aiDone?"checkCircle":"sparkle"} size={17} color={aiDone?C.brand:C.surface} stroke={1.6}/>
          {aiDone?"Texto mejorado con IA":"Mejorar texto con IA"}
        </button>
      </div>}

      {step===6&&(()=>{
        // Build dynamic summary rows based on type
        const rows = [
          ["Tipo", form.type||"—"],
          ["Operación", form.operacion==="arriendo"?"Arriendo":"Venta"],
          ["Título", form.title||"(Auto IA según datos)"],
          ["Ubicación", form.loc||"—"],
          ["Precio", form.price?`${form.currency} ${Number(form.price).toLocaleString("es-CL")}`:"—"],
        ];
        if (form.type==="Casa")          rows.push(["Sup. construida", `${form.area||"—"} m²`], ["Sup. terreno", `${form.areaTerreno||"—"} m²`]);
        else if (form.type==="Departamento") rows.push(["Sup. útil", `${form.area||"—"} m²`], ["Sup. total", `${form.areaTotal||"—"} m²`]);
        else if (form.type==="Sitio")     rows.push(["Sup. total", `${form.area||"—"} m²`]);
        else if (form.type==="Parcela")   rows.push(["Hectáreas", `${form.hectareas||"—"}`]);
        else if (form.type==="Oficina")   rows.push(["Sup. útil", `${form.area||"—"} m²`], ["N° privados", form.privados||"—"]);
        else if (form.type==="Industrial")rows.push(["Sup. útil", `${form.area||"—"} m²`], ["Sup. total", `${form.areaTotal||"—"} m²`]);
        if (form.beds||form.baths||form.parks) {
          const dbp = [form.beds&&`${form.beds} dorm.`, form.baths&&`${form.baths} baños`, form.parks&&`${form.parks} estac.`].filter(Boolean).join(" · ");
          if (dbp) rows.push(["Distribución", dbp]);
        }
        rows.push(
          ["Características", form.amenities.length?`${form.amenities.length} seleccionadas`:"Ninguna"],
          ["Video", form.videoFile ? "Subido (completo) ✓" : (form.videoTakes||[]).every(Boolean) ? "Listo (4 tomas) ✓" : `${(form.videoTakes||[]).filter(Boolean).length}/4 tomas`],
          ["Texto", aiDone?"Mejorado con IA ✓":"Manual"],
        );
        // Cover URL (set in step 4)
        const currentCover = form.coverUrl || null;
        return (
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <div style={{width:68,height:68,borderRadius:"50%",margin:"0 auto 14px",background:C.mintWash,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Icon name="checkCircle" size={32} color={C.forest} stroke={1.5}/>
            </div>
            <h3 style={{fontSize:24,fontWeight:400,color:C.ink,fontFamily:Fs,margin:"0 0 6px",letterSpacing:"-0.01em"}}>Listo para publicar</h3>
            <p style={{fontSize:12,color:C.muted,fontFamily:Fb,fontWeight:400,margin:"0 0 18px"}}>Revisa el resumen antes de enviar</p>

            {/* ─── Portada (resumen — la edición está en paso 4) ─── */}
            <div style={{textAlign:"left",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                <span style={{fontSize:11,color:C.muted,fontFamily:Fb,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase"}}>Foto de portada</span>
                <button onClick={()=>setStep(4)} style={{padding:"4px 10px",borderRadius:999,background:"transparent",border:`1px solid ${C.line}`,cursor:"pointer",fontSize:10.5,color:C.brand,fontWeight:500,fontFamily:Fb,display:"inline-flex",alignItems:"center",gap:4}}>
                  <Icon name="pencil" size={10} color={C.brand} stroke={1.8}/>Cambiar
                </button>
              </div>
              {currentCover ? (
                <img src={currentCover} alt="Portada" style={{width:"100%",height:160,objectFit:"cover",borderRadius:12,border:`1px solid ${C.line}`,display:"block"}}/>
              ) : (
                <div style={{height:160,borderRadius:12,background:"#FCEEDC",border:"1px solid #E8B996",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  <Icon name="sparkle" size={15} color="#A6601C" stroke={1.7}/>
                  <span style={{fontSize:11.5,color:"#A6601C",fontFamily:Fb,fontWeight:500}}>Falta portada — volvé al paso 4</span>
                </div>
              )}
            </div>

            {/* ─── Mapa preview (si hay pin) ─── */}
            {typeof form.lat === "number" && typeof form.lng === "number" && (
              <div style={{textAlign:"left",marginBottom:14}}>
                <span style={{fontSize:11,color:C.muted,fontFamily:Fb,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:8}}>Ubicación en el mapa</span>
                <MapView lat={form.lat} lng={form.lng} address={form.loc} height={160} zoom={15}/>
                <p style={{margin:"6px 0 0",fontSize:11,color:C.muted,fontFamily:Fb,fontWeight:400,lineHeight:1.4}}>📍 {form.loc}</p>
              </div>
            )}

            <div style={{padding:14,borderRadius:12,background:C.surface,border:`1px solid ${C.line}`,textAlign:"left",margin:"0 0 18px"}}>
              {rows.map(([k,v],i)=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<rows.length-1?`1px solid ${C.lineSoft}`:"none"}}>
                  <span style={{fontSize:10.5,color:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.06em",textTransform:"uppercase",flexShrink:0}}>{k}</span>
                  <span style={{fontSize:12.5,color:C.ink,fontFamily:Fb,fontWeight:500,textAlign:"right",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v}</span>
                </div>
              ))}
            </div>
            <button onClick={handlePublish} disabled={publishing} style={{width:"100%",padding:15,borderRadius:12,background:publishing?C.brand:C.forest,border:"none",cursor:publishing?"default":"pointer",color:C.surface,fontSize:13.5,fontWeight:500,fontFamily:Fb,display:"flex",alignItems:"center",justifyContent:"center",gap:8,letterSpacing:"0.02em",boxShadow:`0 4px 14px ${publishing?C.brand:C.forest}30`}}>
              {publishing ? (
                <>
                  <div style={{width:14,height:14,borderRadius:"50%",border:`2px solid ${C.surface}`,borderTopColor:"transparent",animation:"spin 0.8s linear infinite"}}/>
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                  {publishStatus || "Publicando…"}
                </>
              ) : (
                <>Publicar propiedad<Icon name="send" size={16} color={C.surface} stroke={1.6}/></>
              )}
            </button>
          </div>
        );
      })()}

      {step>1&&step<6&&(() => {
        // Validación por step antes de avanzar
        const stepValid = () => {
          if (step===4) return !!form.coverUrl; // portada obligatoria
          return true;
        };
        const stepInvalidMsg = () => {
          if (step===4) return "Elegí una portada antes de continuar";
          return "";
        };
        const valid = stepValid();
        return (
          <div style={{marginTop:18}}>
            {!valid && (
              <div style={{padding:"8px 12px",borderRadius:9,background:"#FCEEDC",border:"1px solid #E8B996",marginBottom:8,display:"flex",alignItems:"center",gap:8}}>
                <span style={{display:"inline-flex",width:14,height:14,borderRadius:"50%",background:"#A6601C",color:C.surface,fontSize:10,fontWeight:700,alignItems:"center",justifyContent:"center"}}>!</span>
                <span style={{fontSize:11.5,color:"#A6601C",fontFamily:Fb,fontWeight:500}}>{stepInvalidMsg()}</span>
              </div>
            )}
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setStep(step-1)} style={{padding:"12px 18px",borderRadius:10,background:C.surface,border:`1px solid ${C.line}`,color:C.text,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:Fb,display:"flex",alignItems:"center",gap:6}}>
                <Icon name="arrowLeft" size={15} color={C.text} stroke={1.6}/>Atrás
              </button>
              <button onClick={()=>{if(valid) setStep(step+1);}} disabled={!valid} style={{flex:1,padding:"12px 18px",borderRadius:10,background:valid?C.ink:C.line,border:"none",color:C.surface,fontSize:13,fontWeight:500,cursor:valid?"pointer":"default",fontFamily:Fb,display:"flex",alignItems:"center",justifyContent:"center",gap:6,letterSpacing:"0.01em"}}>
                Siguiente<Icon name="arrowRight" size={15} color={C.surface} stroke={1.6}/>
              </button>
            </div>
          </div>
        );
      })()}

      {/* Upload modal — 3 phases: guide → source → preview */}
      {uploadFor && (
        <div onClick={()=>setUploadFor(null)} style={{position:"fixed",inset:0,zIndex:300,background:"rgba(28,26,23,0.6)",display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:430,background:C.bg,borderRadius:"20px 20px 0 0",maxHeight:"92vh",overflowY:"auto",animation:"slideUp 0.25s ease"}}>

            {/* PHASE 1: GUIDE — instructions before opening camera */}
            {uploadFor.phase==="guide" && uploadFor.guideData && (
              <div style={{padding:"18px 18px env(safe-area-inset-bottom,20px)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <span style={{fontSize:10,color:C.brand,fontFamily:Fb,fontWeight:600,letterSpacing:"0.14em",textTransform:"uppercase"}}>Guía MKT</span>
                  <button onClick={()=>setUploadFor(null)} style={{width:30,height:30,borderRadius:"50%",background:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="close" size={16} color={C.ink} stroke={1.7}/></button>
                </div>

                {/* Hero icon + title */}
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18,padding:"14px 16px",borderRadius:14,background:C.brandWash,border:`1px solid ${C.brand}30`}}>
                  <div style={{width:50,height:50,borderRadius:12,background:C.brand,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <Icon name={uploadFor.kind==="photo"?"camera":(uploadFor.guideData.icon||"video")} size={26} color={C.surface} stroke={1.6}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{margin:0,fontSize:9.5,color:C.brand,fontFamily:Fb,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase"}}>{uploadFor.kind==="photo"?`Foto ${uploadFor.guideData.s}`:`Toma ${uploadFor.guideData.n}`}{uploadFor.guideData.dur?` · ${uploadFor.guideData.dur}`:""}</p>
                    <h3 style={{margin:"2px 0 0",fontSize:17,fontWeight:400,color:C.ink,fontFamily:Fs,letterSpacing:"-0.01em"}}>{uploadFor.guideData.l || uploadFor.guideData.t}</h3>
                  </div>
                </div>

                {/* Tips */}
                {uploadFor.guideData.tips && uploadFor.guideData.tips.length>0 && (
                  <div style={{marginBottom:14}}>
                    <p style={{margin:"0 0 10px",fontSize:11,color:C.muted,fontFamily:Fb,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase"}}>Para que quede pro</p>
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      {uploadFor.guideData.tips.map((tip,i)=>(
                        <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                          <div style={{width:18,height:18,borderRadius:"50%",background:C.mintWash,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                            <Icon name="check" size={10} color={C.forest} stroke={2.5}/>
                          </div>
                          <span style={{fontSize:12.5,color:C.text,fontFamily:Fb,fontWeight:400,lineHeight:1.45}}>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Avoid */}
                {uploadFor.guideData.avoid && uploadFor.guideData.avoid.length>0 && (
                  <div style={{marginBottom:18,padding:"10px 12px",borderRadius:10,background:C.surface,border:`1px solid ${C.line}`}}>
                    <p style={{margin:"0 0 6px",fontSize:10.5,color:C.terracotta,fontFamily:Fb,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase"}}>Evita</p>
                    {uploadFor.guideData.avoid.map((a,i)=>(
                      <div key={i} style={{display:"flex",gap:6,fontSize:11.5,color:C.muted,fontFamily:Fb,fontWeight:400,lineHeight:1.5}}>
                        <span style={{color:C.terracotta}}>×</span>{a}
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA */}
                <button onClick={()=>setUploadFor({...uploadFor,phase:"source"})} style={{width:"100%",padding:14,borderRadius:12,background:C.ink,border:"none",color:C.surface,fontSize:13.5,fontWeight:500,cursor:"pointer",fontFamily:Fb,display:"flex",alignItems:"center",justifyContent:"center",gap:8,letterSpacing:"0.02em"}}>
                  <Icon name="checkCircle" size={17} color={C.surface} stroke={1.7}/>
                  Entendido, continuar
                </button>
              </div>
            )}

            {/* PHASE 2: SOURCE — choose camera or gallery */}
            {(uploadFor.phase==="source" || (!uploadFor.phase && uploadFor.kind==="video")) && (
              <div style={{padding:"18px 16px env(safe-area-inset-bottom,20px)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <h3 style={{margin:0,fontSize:16,fontWeight:400,color:C.ink,fontFamily:Fs}}>
                    {uploadFor.kind==="photo"?`Foto: ${uploadFor.label}`:uploadFor.kind==="video-take"?uploadFor.label:"Subir video"}
                  </h3>
                  <button onClick={()=>setUploadFor(null)} style={{width:30,height:30,borderRadius:"50%",background:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="close" size={16} color={C.ink} stroke={1.7}/></button>
                </div>
                <p style={{margin:"0 0 16px",fontSize:12.5,color:C.muted,fontFamily:Fb,fontWeight:400,lineHeight:1.5}}>¿Cómo quieres {uploadFor.kind==="photo"?"subir la foto":"subir el video"}?</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <label style={{padding:"18px 12px",borderRadius:14,background:C.surface,border:`1px solid ${C.line}`,cursor:"pointer",fontFamily:Fb,textAlign:"center",display:"block",position:"relative"}}>
                    <input type="file" accept={uploadFor.kind==="photo"?"image/*":"video/*"} capture="environment" onChange={onFileChosen} style={{position:"absolute",width:1,height:1,opacity:0,pointerEvents:"none"}}/>
                    <div style={{display:"flex",justifyContent:"center",marginBottom:8}}><Icon name={uploadFor.kind==="photo"?"camera":"video"} size={28} color={C.brand} stroke={1.5}/></div>
                    <div style={{fontSize:13.5,fontWeight:500,color:C.ink,marginBottom:2}}>Usar cámara</div>
                    <div style={{fontSize:10.5,color:C.muted,fontWeight:400}}>{uploadFor.kind==="photo"?"Toma una foto ahora":"Graba ahora"}</div>
                  </label>
                  <label style={{padding:"18px 12px",borderRadius:14,background:C.surface,border:`1px solid ${C.line}`,cursor:"pointer",fontFamily:Fb,textAlign:"center",display:"block",position:"relative"}}>
                    <input type="file" accept={uploadFor.kind==="photo"?"image/*":"video/*"} onChange={onFileChosen} style={{position:"absolute",width:1,height:1,opacity:0,pointerEvents:"none"}}/>
                    <div style={{display:"flex",justifyContent:"center",marginBottom:8}}><Icon name="grid" size={28} color={C.brand} stroke={1.5}/></div>
                    <div style={{fontSize:13.5,fontWeight:500,color:C.ink,marginBottom:2}}>Desde galería</div>
                    <div style={{fontSize:10.5,color:C.muted,fontWeight:400}}>Elige uno guardado</div>
                  </label>
                </div>
                {uploadFor.guideData && (
                  <button onClick={()=>setUploadFor({...uploadFor,phase:"guide"})} style={{marginTop:12,padding:"8px 12px",borderRadius:8,background:"transparent",border:"none",color:C.muted,fontSize:11.5,fontWeight:500,cursor:"pointer",fontFamily:Fb,width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                    <Icon name="chevronLeft" size={12} color={C.muted} stroke={1.6}/>Volver a la guía
                  </button>
                )}
              </div>
            )}

            {/* PHASE 3: PREVIEW — show captured file with feedback */}
            {uploadFor.phase==="preview" && uploadFor.tempUrl && (
              <div style={{padding:"18px 16px env(safe-area-inset-bottom,20px)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <span style={{fontSize:10,color:C.forest,fontFamily:Fb,fontWeight:600,letterSpacing:"0.14em",textTransform:"uppercase"}}>Vista previa</span>
                  <button onClick={()=>setUploadFor(null)} style={{width:30,height:30,borderRadius:"50%",background:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="close" size={16} color={C.ink} stroke={1.7}/></button>
                </div>

                {/* Media preview */}
                <div style={{position:"relative",marginBottom:14,borderRadius:14,overflow:"hidden",background:"#000",aspectRatio:uploadFor.tempIsVideo?"9/16":"4/3",maxHeight:"50vh"}}>
                  {uploadFor.tempIsVideo
                    ? <video src={uploadFor.tempUrl} controls style={{width:"100%",height:"100%",objectFit:"contain"}}/>
                    : <img src={uploadFor.tempUrl} alt="preview" style={{width:"100%",height:"100%",objectFit:"contain"}}/>
                  }
                  <div style={{position:"absolute",top:10,left:10,padding:"4px 10px",borderRadius:999,background:"rgba(47,74,55,0.92)",backdropFilter:"blur(8px)",display:"inline-flex",alignItems:"center",gap:5}}>
                    <Icon name="check" size={11} color={C.surface} stroke={2.5}/>
                    <span style={{fontSize:10,color:C.surface,fontFamily:Fb,fontWeight:600,letterSpacing:"0.06em"}}>{uploadFor.tempIsVideo?"Grabado":"Capturada"}</span>
                  </div>
                </div>

                {/* AI Analysis Panel — quality + content moderation */}
                {(() => {
                  const a = uploadFor.analysis;
                  if (!a || a.status === "loading") {
                    return (
                      <div style={{marginBottom:14,padding:"14px 14px",borderRadius:12,background:C.brandWash,border:`1px solid ${C.brand}30`}}>
                        <div style={{display:"flex",alignItems:"center",gap:9}}>
                          <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${C.brand}`,borderTopColor:"transparent",animation:"spin 0.9s linear infinite"}}/>
                          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                          <div style={{flex:1}}>
                            <p style={{margin:0,fontSize:12,color:C.brand,fontFamily:Fb,fontWeight:600,letterSpacing:"0.04em"}}>Analizando con IA…</p>
                            <p style={{margin:"1px 0 0",fontSize:10.5,color:C.muted,fontFamily:Fb,fontWeight:400}}>Calidad de imagen + revisión de contenido</p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  const cardBg = a.allowPublish ? C.mintWash : "#FCEEDC";
                  const cardBorder = a.allowPublish ? "#CDDBCE" : "#E8B996";
                  const headColor = a.allowPublish ? C.forest : "#A6601C";
                  return (
                    <div style={{marginBottom:14,padding:"12px 14px",borderRadius:12,background:cardBg,border:`1px solid ${cardBorder}`}}>
                      <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:8}}>
                        <Icon name={a.allowPublish?"checkCircle":"sparkle"} size={15} color={headColor} stroke={1.7}/>
                        <p style={{margin:0,fontSize:11.5,color:headColor,fontFamily:Fb,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase"}}>Análisis IA — {a.allowPublish?"aprobada":"con observaciones"}</p>
                      </div>
                      {/* Good signals (only when there are issues, otherwise too crowded) */}
                      {a.good && a.good.length > 0 && (
                        <div style={{marginBottom:a.issues.length>0?8:0}}>
                          {a.good.map((g,i)=>(
                            <div key={g.k} style={{display:"flex",gap:7,alignItems:"flex-start",padding:"3px 0",fontSize:11.5,color:C.text,fontFamily:Fb,fontWeight:400,lineHeight:1.4}}>
                              <Icon name="check" size={11} color={C.forest} stroke={2.5}/>{g.t}
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Issues */}
                      {a.issues && a.issues.length > 0 && a.issues.map((iss)=>(
                        <div key={iss.k} style={{display:"flex",gap:7,alignItems:"flex-start",padding:"3px 0",fontSize:11.5,color:iss.sev==="high"?"#9B3D2B":C.text,fontFamily:Fb,fontWeight:iss.sev==="high"?500:400,lineHeight:1.4}}>
                          <span style={{display:"inline-flex",width:11,height:11,borderRadius:"50%",background:iss.sev==="high"?"#9B3D2B":"#C97A30",color:C.surface,fontSize:9,fontWeight:700,alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>!</span>
                          {iss.t}
                        </div>
                      ))}
                      {/* Metrics chip row */}
                      {a.metrics && (
                        <div style={{display:"flex",gap:6,marginTop:9,flexWrap:"wrap"}}>
                          <span style={{padding:"2px 8px",borderRadius:999,background:"rgba(255,255,255,0.6)",fontSize:9.5,color:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.04em"}}>Luz {a.metrics.brightness}/255</span>
                          <span style={{padding:"2px 8px",borderRadius:999,background:"rgba(255,255,255,0.6)",fontSize:9.5,color:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.04em"}}>Nitidez {a.metrics.sharpness}</span>
                          <span style={{padding:"2px 8px",borderRadius:999,background:"rgba(255,255,255,0.6)",fontSize:9.5,color:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.04em"}}>{a.metrics.resolution}</span>
                        </div>
                      )}
                    </div>
                  );
                })()}

                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>setUploadFor({...uploadFor,phase:"source",tempUrl:null,analysis:null})} style={{flex:1,padding:13,borderRadius:12,background:C.surface,border:`1px solid ${C.line}`,color:C.text,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:Fb,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                    <Icon name={uploadFor.tempIsVideo?"video":"camera"} size={14} color={C.text} stroke={1.6}/>Tomar otra
                  </button>
                  <button onClick={confirmCapture} disabled={uploadFor.analysis?.status==="loading" || (uploadFor.analysis && !uploadFor.analysis.allowPublish)} style={{flex:1.4,padding:13,borderRadius:12,background:(uploadFor.analysis?.status==="loading"||(uploadFor.analysis&&!uploadFor.analysis.allowPublish))?C.line:C.forest,border:"none",color:C.surface,fontSize:13,fontWeight:500,cursor:(uploadFor.analysis?.status==="loading"||(uploadFor.analysis&&!uploadFor.analysis.allowPublish))?"default":"pointer",fontFamily:Fb,display:"flex",alignItems:"center",justifyContent:"center",gap:6,boxShadow:uploadFor.analysis?.allowPublish?`0 4px 14px ${C.forest}30`:"none"}}>
                    <Icon name="check" size={14} color={C.surface} stroke={2}/>
                    {uploadFor.analysis?.status==="loading" ? "Analizando…" : (uploadFor.analysis && !uploadFor.analysis.allowPublish ? "Retomar (calidad baja)" : `Usar esta ${uploadFor.tempIsVideo?"toma":"foto"}`)}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mapa modal (Vender step 2) */}
      {mapModal && (() => {
        const hasPin = typeof form.lat === "number" && typeof form.lng === "number";
        return (
          <div onClick={()=>setMapModal(false)} style={{position:"fixed",inset:0,zIndex:300,background:"rgba(28,26,23,0.5)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
            <div onClick={e=>e.stopPropagation()} style={{maxWidth:460,width:"100%",background:C.surface,borderRadius:18,padding:"20px 18px 18px",animation:"slideUp 0.25s ease",maxHeight:"92vh",overflowY:"auto"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:34,height:34,borderRadius:"50%",background:C.brandWash,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="pin" size={17} color={C.brand} stroke={1.6}/></div>
                  <div>
                    <h3 style={{margin:0,fontSize:17,fontWeight:400,color:C.ink,fontFamily:Fs,letterSpacing:"-0.01em"}}>Ubicación en el mapa</h3>
                    <p style={{margin:"1px 0 0",fontSize:10.5,color:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.04em"}}>{hasPin?"Arrastra el pin para refinar":"Toca el mapa para marcar la ubicación"}</p>
                  </div>
                </div>
                <button onClick={()=>setMapModal(false)} style={{width:30,height:30,borderRadius:"50%",background:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="close" size={16} color={C.ink} stroke={1.7}/></button>
              </div>

              <InteractiveMap
                lat={form.lat}
                lng={form.lng}
                height={320}
                onPinPlaced={({lat,lng,address,comuna})=>{
                  setForm(f=>({...f, lat, lng, loc: address || f.loc, comuna: comuna || f.comuna }));
                }}
              />

              {hasPin ? (
                <div style={{marginTop:12,padding:"10px 12px",borderRadius:10,background:C.brandWash,border:`1px solid ${C.brand}30`,display:"flex",gap:8,alignItems:"center"}}>
                  <Icon name="checkCircle" size={15} color={C.brand} stroke={1.6}/>
                  <p style={{margin:0,fontSize:12,color:C.text,fontFamily:Fb,fontWeight:400,lineHeight:1.4,flex:1}}>{form.loc || `Lat ${form.lat.toFixed(5)}, Lng ${form.lng.toFixed(5)}`}</p>
                </div>
              ) : (
                <div style={{marginTop:12,padding:"10px 12px",borderRadius:10,background:C.bg,border:`1px dashed ${C.line}`,display:"flex",gap:8,alignItems:"center"}}>
                  <Icon name="pin" size={15} color={C.muted} stroke={1.6}/>
                  <p style={{margin:0,fontSize:12,color:C.muted,fontFamily:Fb,fontWeight:400,lineHeight:1.4,flex:1}}>Haz click en el mapa donde está tu propiedad</p>
                </div>
              )}

              <div style={{display:"flex",gap:8,marginTop:14}}>
                {hasPin && (
                  <button onClick={()=>setForm(f=>({...f, lat:null, lng:null}))} style={{padding:"11px 14px",borderRadius:12,background:C.surface,border:`1px solid ${C.line}`,color:C.terracotta,fontSize:12.5,fontWeight:500,cursor:"pointer",fontFamily:Fb,display:"flex",alignItems:"center",gap:6}}>
                    <Icon name="trash" size={13} color={C.terracotta} stroke={1.6}/>Quitar
                  </button>
                )}
                <button onClick={()=>setMapModal(false)} style={{flex:1,padding:"11px 18px",borderRadius:12,background:hasPin?C.forest:C.ink,border:"none",color:C.surface,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:Fb}}>{hasPin?"Guardar ubicación":"Cerrar"}</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Upload toast (foto / toma de video confirmada) */}
      {uploadToast && (
        <div style={{position:"fixed",bottom:108,left:"50%",transform:"translateX(-50%)",zIndex:600,padding:"12px 22px 12px 18px",borderRadius:999,background:C.forest,color:C.surface,fontSize:12.5,fontFamily:Fb,fontWeight:500,boxShadow:`0 10px 30px ${C.forest}50`,display:"flex",alignItems:"center",gap:10,maxWidth:"calc(100vw - 32px)",animation:"toastIn 0.25s ease"}}>
          <div style={{width:22,height:22,borderRadius:"50%",background:"rgba(255,255,255,0.22)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <Icon name="check" size={13} color={C.surface} stroke={2.5}/>
          </div>
          <span style={{letterSpacing:"0.01em"}}>{uploadToast}</span>
        </div>
      )}

      {/* Published success overlay */}
      {published && (
        <div style={{position:"fixed",inset:0,zIndex:500,background:"rgba(28,26,23,0.6)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <style>{`
            @keyframes successIn { 0%{opacity:0;transform:scale(0.85) translateY(10px)} 100%{opacity:1;transform:scale(1) translateY(0)} }
            @keyframes pulseRing { 0%{transform:scale(0.6);opacity:0.6} 100%{transform:scale(1.6);opacity:0} }
            @keyframes checkPop { 0%{transform:scale(0)} 60%{transform:scale(1.15)} 100%{transform:scale(1)} }
          `}</style>
          <div style={{maxWidth:400,width:"100%",background:C.surface,borderRadius:22,padding:"32px 26px 26px",textAlign:"center",animation:"successIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)"}}>
            <div style={{margin:"0 auto 18px",width:84,height:84,position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{position:"absolute",inset:0,borderRadius:"50%",background:C.forest,opacity:0.15,animation:"pulseRing 1.2s ease-out infinite"}}/>
              <div style={{width:84,height:84,borderRadius:"50%",background:C.forest,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",zIndex:2,animation:"checkPop 0.5s ease-out 0.1s both"}}>
                <Icon name="check" size={44} color={C.surface} stroke={2.5}/>
              </div>
            </div>
            <h3 style={{margin:"0 0 8px",fontSize:24,fontWeight:400,color:C.ink,fontFamily:Fs,letterSpacing:"-0.01em"}}>¡Tu propiedad está publicada!</h3>
            <p style={{margin:"0 0 22px",fontSize:13.5,color:C.text,fontFamily:Fb,fontWeight:400,lineHeight:1.5}}>{form.type||"Tu propiedad"} en {form.loc||"tu zona"} ya está visible para los interesados. Te notificaremos cuando alguien te escriba.</p>
            <div style={{padding:"12px 14px",background:C.brandWash,borderRadius:12,marginBottom:18,textAlign:"left",display:"flex",alignItems:"center",gap:10}}>
              <Icon name="sparkle" size={16} color={C.brand} stroke={1.5}/>
              <p style={{margin:0,fontSize:11.5,color:C.text,fontFamily:Fb,fontWeight:400,lineHeight:1.45}}>La IA va a optimizar tu publicación durante las próximas horas para subirla en los rankings.</p>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={resetForm} style={{flex:1,padding:13,borderRadius:12,background:C.surface,border:`1px solid ${C.line}`,color:C.text,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:Fb}}>Publicar otra</button>
              <button onClick={()=>{resetForm(); goTo && goTo("profile");}} style={{flex:1,padding:13,borderRadius:12,background:C.ink,border:"none",color:C.surface,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:Fb}}>Ver mis publicaciones</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══ SAVED — ordenado por prioridad (chats > guardados > likes) ═══
// ─── ChatPanel — open conversation with mock messages ───
function ChatPanel({convo,onBack}) {
  const [draft,setDraft] = useState("");
  const [msgs,setMsgs] = useState(() => {
    // Mock messages depending on the convo
    const base = [
      {from:"them", t:"Hola Valentina, vi tu publicación de "+convo.prop+" en properties. Me interesa mucho.", time:"10:42"},
      {from:"me",   t:"¡Hola "+convo.name.split(" ")[0]+"! Gracias por escribir. Cuéntame, ¿qué te gustaría saber?", time:"10:45"},
      {from:"them", t:convo.last, time:convo.time},
    ];
    return base;
  });
  const send = () => {
    const t = draft.trim();
    if (!t) return;
    const now = new Date(); const hh = String(now.getHours()).padStart(2,"0"); const mm = String(now.getMinutes()).padStart(2,"0");
    setMsgs(m => [...m, {from:"me", t, time:hh+":"+mm}]);
    setDraft("");
    // Simulate reply
    setTimeout(()=>{
      setMsgs(m => [...m, {from:"them", t:"Perfecto, ¡gracias! Te confirmo a la brevedad.", time:hh+":"+mm}]);
    }, 1200);
  };
  return (
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 0px)",animation:"slideRight 0.2s ease"}}>
      {/* Chat header */}
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 18px",background:C.surface,borderBottom:`1px solid ${C.line}`,position:"sticky",top:0,zIndex:10}}>
        <button onClick={onBack} style={{width:34,height:34,borderRadius:"50%",background:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Icon name="chevronLeft" size={18} color={C.ink} stroke={1.8}/>
        </button>
        <Avatar initials={convo.av} size={38} verified/>
        <div style={{flex:1,minWidth:0}}>
          <p style={{margin:0,fontSize:13.5,fontWeight:500,color:C.ink,fontFamily:Fb}}>{convo.name}</p>
          <p style={{margin:"2px 0 0",fontSize:10.5,color:C.muted,fontFamily:Fb,fontWeight:400}}>{convo.prop} · en línea</p>
        </div>
        <button onClick={()=>window.open(waUrl(SELLER.wa,`Hola ${convo.name.split(" ")[0]}, sigamos por acá la conversación de ${convo.prop}`),"_blank")} style={{width:34,height:34,borderRadius:"50%",background:C.mintWash,border:`1px solid ${C.forest}30`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Icon name="whatsapp" size={16} color={C.forest} stroke={1.6}/>
        </button>
      </div>

      {/* Schedule pill */}
      {convo.sched && (
        <div style={{padding:"10px 18px",background:C.mintWash,borderBottom:`1px solid #CDDBCE`,display:"flex",alignItems:"center",gap:8}}>
          <Icon name="calendar" size={14} color={C.forest} stroke={1.6}/>
          <span style={{fontSize:11.5,color:C.forest,fontFamily:Fb,fontWeight:500}}>Disponibilidad acordada: {convo.days.join(", ")} · {convo.hrs}</span>
        </div>
      )}

      {/* Messages */}
      <div style={{flex:1,overflowY:"auto",padding:"16px 18px 12px",display:"flex",flexDirection:"column",gap:8}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.from==="me"?"flex-end":"flex-start"}}>
            <div style={{maxWidth:"78%",padding:"9px 13px",borderRadius:m.from==="me"?"14px 14px 4px 14px":"14px 14px 14px 4px",background:m.from==="me"?C.ink:C.surface,color:m.from==="me"?C.surface:C.ink,border:m.from==="me"?"none":`1px solid ${C.line}`,fontSize:13,fontFamily:Fb,fontWeight:400,lineHeight:1.45}}>
              {m.t}
              <div style={{fontSize:9.5,opacity:0.6,marginTop:4,textAlign:"right",fontFamily:Fb,fontWeight:400}}>{m.time}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{padding:"10px 14px env(safe-area-inset-bottom,90px)",background:C.surface,borderTop:`1px solid ${C.line}`,display:"flex",alignItems:"center",gap:8}}>
        <input value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Escribe un mensaje..." style={{flex:1,padding:"11px 14px",borderRadius:999,background:C.bg,border:`1px solid ${C.line}`,color:C.ink,fontSize:13,fontFamily:Fb,fontWeight:400,outline:"none"}}/>
        <button onClick={send} disabled={!draft.trim()} style={{width:40,height:40,borderRadius:"50%",background:draft.trim()?C.ink:C.line,border:"none",cursor:draft.trim()?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Icon name="send" size={16} color={C.surface} stroke={1.8}/>
        </button>
      </div>
    </div>
  );
}

function SavedView({props,onTap,subTab,setSubTab,selectedChat,setSelectedChat}) {
  // Vale unificó Like = Guardado. Una sola lista con propiedades que te gustaron.
  if (selectedChat) {
    return <ChatPanel convo={selectedChat} onBack={()=>setSelectedChat(null)}/>;
  }
  const items = props.filter(p=>p.liked);

  return (
    <div style={{padding:"0 14px",paddingBottom:86}}>
      {/* Header explicativo */}
      <div style={{display:"flex",alignItems:"center",gap:8,padding:"4px 4px 16px"}}>
        <Icon name="heart" size={16} color={C.terracotta} stroke={1.6} fill={C.terracotta}/>
        <div>
          <div style={{fontSize:13,fontWeight:500,color:C.ink,fontFamily:Fb}}>Tus guardados</div>
          <div style={{fontSize:11,color:C.muted,fontFamily:Fb,fontWeight:400,marginTop:1}}>
            {items.length} {items.length===1?"propiedad guardada":"propiedades guardadas"}
          </div>
        </div>
      </div>

      {/* Grid de propiedades guardadas */}
      {items.length>0 ? (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {items.map(p=>(
            <div key={p.id} onClick={()=>onTap(p)} style={{borderRadius:12,overflow:"hidden",cursor:"pointer",background:C.surface,border:`1px solid ${C.line}`,position:"relative"}}>
              <div style={{position:"relative"}}>
                <div style={{height:110}}><CoverMedia p={p} iconSize={26} labelSize={8}/></div>
                <div style={{position:"absolute",top:6,right:6,width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.92)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Icon name="heart" size={13} color={C.terracotta} stroke={1.6} fill={C.terracotta}/>
                </div>
              </div>
              <div style={{padding:10}}>
                <p style={{margin:0,fontSize:11,fontWeight:500,color:C.ink,fontFamily:Fb,lineHeight:1.3,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{p.title}</p>
                <p style={{margin:"5px 0 0",fontSize:14,fontWeight:400,color:C.ink,fontFamily:Fs,letterSpacing:"-0.01em"}}>{p.cur} {fmt(p.price)}</p>
                {publicLocation(p) && <p style={{margin:"3px 0 0",fontSize:10,color:C.muted,fontFamily:Fb,fontWeight:400}}>{publicLocation(p)}</p>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{textAlign:"center",padding:"56px 20px",color:C.muted}}>
          <div style={{margin:"0 auto 12px",width:56,height:56,borderRadius:"50%",background:C.brandWash,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Icon name="heart" size={24} color={C.brand} stroke={1.5}/>
          </div>
          <p style={{fontFamily:Fs,fontSize:16,fontWeight:400,color:C.ink,margin:"0 0 4px"}}>Sin guardados todavía</p>
          <p style={{fontFamily:Fb,fontSize:12.5,fontWeight:400,margin:0,lineHeight:1.5}}>Dale ❤️ a las propiedades que te gustan para volver a verlas acá.</p>
        </div>
      )}
    </div>
  );
}

// ─── Sheet Modal — generic full-screen sheet ───
function Sheet({title,onClose,children}){
  return (
    <div style={{position:"fixed",inset:0,zIndex:300,background:"rgba(28,26,23,0.5)",display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:430,maxHeight:"90vh",background:C.bg,borderRadius:"20px 20px 0 0",display:"flex",flexDirection:"column",animation:"slideUp 0.25s ease"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 18px",borderBottom:`1px solid ${C.line}`}}>
          <button onClick={onClose} style={{width:34,height:34,borderRadius:"50%",background:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Icon name="close" size={18} color={C.ink} stroke={1.7}/>
          </button>
          <h3 style={{margin:0,fontSize:17,fontWeight:400,color:C.ink,fontFamily:Fs,letterSpacing:"-0.01em"}}>{title}</h3>
          <div style={{width:34}}/>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"22px 18px"}}>{children}</div>
      </div>
    </div>
  );
}

// ═══ PROFILE ═══
function Profile({props,allProps,subTab,setSubTab,onGoTo,initialPanel,clearPanel,me,setMe,onOpenProp,onEditProp,onDeleteProp}) {
  // props = propiedades PUBLICADAS por este usuario (para el tab Publicaciones)
  // allProps = TODAS las propiedades del feed (para contar likes/guardados del user en propiedades ajenas)
  const _allProps = allProps || props;
  const [gear,setGear]=useState(false);
  const [editProfile,setEditProfile]=useState(false);
  const [propMenu,setPropMenu]=useState(null); // prop being shown 3-dot menu
  const [editingProp,setEditingProp]=useState(null); // prop being edited
  const photoInputRef = useRef(null);
  const tab = subTab || "pub";
  const setTab = setSubTab || (()=>{});
  const [panel,setPanel]=useState(initialPanel||null);
  useEffect(()=>{
    if (initialPanel) { setPanel(initialPanel); clearPanel&&clearPanel(); }
  },[initialPanel]);
  // Local form state for the edit-profile modal
  const [pf,setPf]=useState({name:me?.name||"", email:me?.email||"", wa:me?.wa||"", city:me?.city||"Santiago"});
  useEffect(()=>{
    if (editProfile) setPf({name:me?.name||"", email:me?.email||"", wa:me?.wa||"", city:me?.city||"Santiago"});
  },[editProfile, me]);
  // Local form state for editing a published property
  const [epf,setEpf]=useState({title:"",price:"",cur:"UF",desc:"",loc:""});
  useEffect(()=>{
    if (editingProp) setEpf({title:editingProp.title||"",price:String(editingProp.price||""),cur:editingProp.cur||"UF",desc:editingProp.desc||"",loc:editingProp.loc||""});
  },[editingProp]);
  const onPhotoPick = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setMe && setMe(m => ({...m, photo: url}));
    e.target.value = "";
  };
  const menuItems=[
    {id:"stats", icon:"chart",l:"Estadísticas"},
    {id:"pagos", icon:"card", l:"Pagos y plan"},
    {id:"ayuda", icon:"help", l:"Centro de ayuda"},
    {id:"logout",icon:"logout",l:"Cerrar sesión"},
  ];
  // Guardados = TODAS las propiedades con like (independiente de quien las publicó)
  const liked = _allProps.filter(p=>p.liked).length;
  const stats=[
    {n:String(liked),l:"Guardados",icon:"heart",onClick:()=>onGoTo&&onGoTo("saved")},
    {n:String(props.length),l:"Publicados",icon:"house",onClick:()=>setTab("pub")},
  ];
  return (
    <div style={{padding:"0 14px",paddingBottom:86}}>
      {gear&&<div style={{position:"fixed",inset:0,zIndex:200}} onClick={()=>setGear(false)}>
        <div onClick={e=>e.stopPropagation()} style={{position:"absolute",top:56,right:18,width:220,background:C.surface,borderRadius:14,border:`1px solid ${C.line}`,boxShadow:`0 12px 32px ${C.ink}15`,overflow:"hidden"}}>
          {menuItems.map((x,idx)=>(
            <div key={idx} onClick={()=>{setPanel(x.id);setGear(false);}} style={{padding:"12px 16px",borderBottom:idx<3?`1px solid ${C.lineSoft}`:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:10,fontSize:13,fontFamily:Fb,fontWeight:400,color:x.id==="logout"?C.terracotta:C.ink}}
              onMouseEnter={e=>e.currentTarget.style.background=C.bg} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <Icon name={x.icon} size={16} color={x.id==="logout"?C.terracotta:C.text} stroke={1.5}/>{x.l}
            </div>
          ))}
        </div>
      </div>}

      {panel==="stats" && <Sheet title="Estadísticas" onClose={()=>setPanel(null)}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}}>
          {[{l:"Vistas totales",n:"2.341",icon:"eye"},{l:"Mensajes recibidos",n:"18",icon:"chat"},{l:"Visitas agendadas",n:"4",icon:"calendar"},{l:"Likes recibidos",n:"56",icon:"heart"}].map(x=>(
            <div key={x.l} style={{padding:14,borderRadius:12,background:C.surface,border:`1px solid ${C.line}`}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                <Icon name={x.icon} size={13} color={C.brand} stroke={1.5}/>
                <span style={{fontSize:9.5,color:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.08em",textTransform:"uppercase"}}>{x.l}</span>
              </div>
              <div style={{fontSize:24,fontWeight:400,color:C.ink,fontFamily:Fs,letterSpacing:"-0.01em"}}>{x.n}</div>
            </div>
          ))}
        </div>
        <div style={{padding:14,borderRadius:12,background:C.brandWash,border:`1px solid ${C.line}`,display:"flex",alignItems:"center",gap:10}}>
          <Icon name="sparkle" size={16} color={C.brand} stroke={1.5}/>
          <p style={{margin:0,fontSize:12,color:C.text,fontFamily:Fb,fontWeight:400,lineHeight:1.45}}>Próximamente: gráficos detallados, comparación con la zona y tracking de visitas en tiempo real.</p>
        </div>
      </Sheet>}

      {panel==="pagos" && <Sheet title="Pagos y plan" onClose={()=>setPanel(null)}>
        <p style={{margin:"0 0 14px",fontSize:12,color:C.muted,fontFamily:Fb,fontWeight:400,letterSpacing:"0.04em"}}>Tu plan actual</p>
        <div style={{padding:18,borderRadius:14,background:C.surface,border:`2px solid ${C.brand}`,marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <span style={{fontSize:18,fontWeight:400,color:C.ink,fontFamily:Fs}}>Gratis</span>
            <span style={{fontSize:9.5,color:C.brand,fontFamily:Fb,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",background:C.brandWash,padding:"3px 9px",borderRadius:999}}>Activo</span>
          </div>
          <p style={{margin:"0 0 10px",fontSize:11.5,color:C.muted,fontFamily:Fb,fontWeight:400}}>Hasta 3 publicaciones simultáneas</p>
          {["3 publicaciones activas","Coordinación de visitas","Métricas básicas"].map(f=><div key={f} style={{display:"flex",alignItems:"center",gap:7,fontSize:12,color:C.text,fontFamily:Fb,fontWeight:400,padding:"4px 0"}}><Icon name="check" size={13} color={C.forest} stroke={2}/>{f}</div>)}
        </div>
        <p style={{margin:"0 0 14px",fontSize:12,color:C.muted,fontFamily:Fb,fontWeight:400,letterSpacing:"0.04em"}}>Mejora tu plan</p>
        <div style={{padding:18,borderRadius:14,background:C.ink,color:C.surface,position:"relative"}}>
          <div style={{position:"absolute",top:-9,right:14,padding:"3px 9px",borderRadius:999,background:C.brand,fontSize:9,fontWeight:600,fontFamily:Fb,letterSpacing:"0.12em",textTransform:"uppercase"}}>Próximamente</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <span style={{fontSize:18,fontWeight:400,fontFamily:Fs}}>Premium</span>
            <span style={{fontSize:14,fontFamily:Fs}}>UF 1,5/mes</span>
          </div>
          <p style={{margin:"0 0 10px",fontSize:11.5,opacity:0.75,fontFamily:Fb,fontWeight:400}}>Para corredores y proyectos inmobiliarios</p>
          {["Publicaciones ilimitadas","Posición destacada","IA para textos y videos","Soporte prioritario","Estadísticas avanzadas"].map(f=><div key={f} style={{display:"flex",alignItems:"center",gap:7,fontSize:12,fontFamily:Fb,fontWeight:400,padding:"4px 0",opacity:0.95}}><Icon name="check" size={13} color={C.brandSoft} stroke={2}/>{f}</div>)}
        </div>
      </Sheet>}

      {panel==="ayuda" && <Sheet title="Centro de ayuda" onClose={()=>setPanel(null)}>
        {[
          {q:"¿Cómo publico una propiedad?",a:"Andá a Publicar en el menú superior y completá los 3 pasos: datos, video y precio. Te guiamos foto por foto y video por video."},
          {q:"¿Es gratis publicar?",a:"Sí. El plan Gratis te permite hasta 3 publicaciones activas. Próximamente lanzamos el plan Premium con más funcionalidades."},
          {q:"¿Cómo funciona la coordinación de visitas?",a:"En tu perfil defines tus días y horarios disponibles. Cuando un comprador interesado quiere visitar, cruzamos las dos agendas automáticamente."},
          {q:"¿Mis datos están seguros?",a:"Sí. Tu información personal solo se comparte con interesados verificados. Tu número de WhatsApp solo aparece cuando confirmas el contacto."},
        ].map((f,i)=>(
          <div key={i} style={{padding:"14px 0",borderBottom:i<3?`1px solid ${C.line}`:"none"}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:8}}>
              <Icon name="help" size={15} color={C.brand} stroke={1.5}/>
              <div style={{flex:1}}>
                <p style={{margin:0,fontSize:13,fontWeight:500,color:C.ink,fontFamily:Fb}}>{f.q}</p>
                <p style={{margin:"5px 0 0",fontSize:12,color:C.text,fontFamily:Fb,fontWeight:400,lineHeight:1.55}}>{f.a}</p>
              </div>
            </div>
          </div>
        ))}
        <div style={{marginTop:16,padding:14,borderRadius:12,background:C.surface,border:`1px solid ${C.line}`,textAlign:"center"}}>
          <p style={{margin:"0 0 6px",fontSize:12,color:C.muted,fontFamily:Fb,fontWeight:400}}>¿Necesitas más ayuda?</p>
          <a href={waUrl(SELLER.wa,"Hola, necesito ayuda con properties.")} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:12.5,color:C.forest,fontFamily:Fb,fontWeight:500,textDecoration:"none"}}>
            <Icon name="whatsapp" size={15} color={C.forest} stroke={1.6}/>Escríbenos por WhatsApp
          </a>
        </div>
      </Sheet>}

      {panel==="logout" && <Sheet title="Cerrar sesión" onClose={()=>setPanel(null)}>
        <p style={{margin:"0 0 22px",fontSize:14,color:C.text,fontFamily:Fb,fontWeight:400,lineHeight:1.55,textAlign:"center"}}>¿Estás segura que quieres cerrar tu sesión en properties?</p>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>setPanel(null)} style={{flex:1,padding:14,borderRadius:12,background:C.surface,border:`1px solid ${C.line}`,color:C.ink,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:Fb}}>Cancelar</button>
          <button onClick={async ()=>{setPanel(null); if(supabase){await supabase.auth.signOut();}}} style={{flex:1,padding:14,borderRadius:12,background:C.terracotta,border:"none",color:C.surface,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:Fb}}>Sí, salir</button>
        </div>
      </Sheet>}

      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:8}}>
        <button onClick={()=>setGear(!gear)} style={{width:36,height:36,borderRadius:"50%",background:C.surface,border:`1px solid ${C.line}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Icon name="gear" size={16} color={C.text} stroke={1.5}/>
        </button>
      </div>
      <input ref={photoInputRef} type="file" accept="image/*" onChange={onPhotoPick} style={{display:"none"}}/>
      <div style={{textAlign:"center",marginBottom:22}}>
        <button onClick={()=>setEditProfile(true)} style={{display:"inline-block",position:"relative",marginBottom:10,background:"none",border:"none",padding:0,cursor:"pointer"}}>
          {me?.photo
            ? <img src={me.photo} alt="" style={{width:72,height:72,borderRadius:"50%",objectFit:"cover",border:`2px solid ${C.surface}`,boxShadow:`0 0 0 1.5px ${C.forest}`}}/>
            : <Avatar initials={me?.avatar||SELLER.avatar} size={72} verified/>
          }
          {/* Edit pencil overlay */}
          <span style={{position:"absolute",bottom:-2,right:-2,width:26,height:26,borderRadius:"50%",background:C.ink,border:`2.5px solid ${C.bg}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Icon name="pencil" size={11} color={C.surface} stroke={2}/>
          </span>
        </button>
        <h3 onClick={()=>setEditProfile(true)} style={{fontSize:20,fontWeight:400,color:C.ink,fontFamily:Fs,margin:"0 0 3px",letterSpacing:"-0.01em",cursor:"pointer"}}>{me?.name||"Tu perfil"}</h3>
        <p style={{fontSize:11.5,color:C.muted,fontFamily:Fb,fontWeight:400,margin:"0 0 8px",letterSpacing:"0.02em"}}>
          {me?.email
            ? `${me.email} · ${me.city||"Chile"}`
            : (me?.wa ? `WhatsApp +${me.wa} · ${me?.city||"Chile"}` : (me?.city||"Chile"))}
        </p>
        {me?.verified ? (
          <div style={{display:"inline-flex",alignItems:"center",gap:5,padding:"4px 11px",borderRadius:999,background:C.mintWash,border:`1px solid #CDDBCE`}}>
            <Icon name="check" size={10} color={C.forest} stroke={2.5}/>
            <span style={{fontSize:10,fontWeight:500,color:C.forest,fontFamily:Fb,letterSpacing:"0.08em",textTransform:"uppercase"}}>Cuenta verificada</span>
          </div>
        ) : (
          <div style={{display:"inline-flex",alignItems:"center",gap:5,padding:"4px 11px",borderRadius:999,background:C.brandWash,border:`1px solid ${C.line}`}}>
            <Icon name="sparkle" size={10} color={C.brand} stroke={2}/>
            <span style={{fontSize:10,fontWeight:500,color:C.brand,fontFamily:Fb,letterSpacing:"0.08em",textTransform:"uppercase"}}>Cuenta sin verificar</span>
          </div>
        )}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
        {stats.map(s=>(
          <button key={s.l} onClick={s.onClick} style={{padding:"14px 6px",borderRadius:12,textAlign:"center",background:C.surface,border:`1px solid ${C.line}`,cursor:"pointer",transition:"all 0.15s",fontFamily:"inherit"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.brand;e.currentTarget.style.transform="translateY(-1px)";}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.line;e.currentTarget.style.transform="translateY(0)";}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:4}}>
              <Icon name={s.icon} size={15} color={C.brand} stroke={1.5}/>
            </div>
            <div style={{fontSize:20,fontWeight:400,color:C.ink,fontFamily:Fs,letterSpacing:"-0.01em"}}>{s.n}</div>
            <div style={{fontSize:9.5,color:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.08em",textTransform:"uppercase",marginTop:2}}>{s.l}</div>
          </button>
        ))}
      </div>
      <div style={{display:"flex",gap:3,marginBottom:14,background:C.surface,borderRadius:999,padding:3,border:`1px solid ${C.line}`}}>
        {[{id:"pub",l:"Publicaciones"},{id:"algo",l:"Preferencias IA"}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"8px 0",borderRadius:999,border:"none",background:tab===t.id?C.ink:"transparent",color:tab===t.id?C.surface:C.muted,fontSize:11,fontWeight:500,cursor:"pointer",fontFamily:Fb,letterSpacing:"0.02em"}}>{t.l}</button>
        ))}
      </div>
      {tab==="pub"?
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {props.length===0 && (
            <div style={{padding:30,borderRadius:14,background:C.surface,border:`1px dashed ${C.line}`,textAlign:"center"}}>
              <Icon name="house" size={32} color={C.subtle} stroke={1.3}/>
              <p style={{margin:"10px 0 0",fontSize:13,color:C.muted,fontFamily:Fb,fontWeight:400}}>Aún no tienes publicaciones</p>
              <button onClick={()=>onGoTo&&onGoTo("sell")} style={{marginTop:12,padding:"10px 18px",borderRadius:10,background:C.ink,border:"none",color:C.surface,fontSize:12,fontWeight:500,fontFamily:Fb,cursor:"pointer"}}>Publicar mi primera propiedad</button>
            </div>
          )}
          {props.map(p=>(
            <div key={p.id} style={{position:"relative",display:"flex",gap:12,padding:12,borderRadius:12,background:C.surface,border:`1px solid ${C.line}`,cursor:"pointer",transition:"all 0.15s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor=C.brand} onMouseLeave={e=>e.currentTarget.style.borderColor=C.line}
              onClick={()=>onOpenProp&&onOpenProp(p)}>
              <div style={{width:66,height:66,flexShrink:0,borderRadius:10,overflow:"hidden"}}><CoverMedia p={p} iconSize={22} showLabel={false}/></div>
              <div style={{flex:1,minWidth:0}}>
                <p style={{margin:0,fontSize:12.5,fontWeight:500,color:C.ink,fontFamily:Fb,lineHeight:1.3,overflow:"hidden",textOverflow:"ellipsis",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{p.title}</p>
                <p style={{margin:"3px 0 0",fontSize:13,color:C.ink,fontFamily:Fs,fontWeight:400}}>{p.cur} {fmt(p.price)}</p>
                <div style={{display:"flex",gap:12,marginTop:6,fontSize:10.5,color:C.muted,fontFamily:Fb,fontWeight:400}}>
                  <span style={{display:"inline-flex",alignItems:"center",gap:4}}><Icon name="pin" size={11} color={C.muted} stroke={1.5}/>{p.loc || publicLocation(p)}</span>
                  <span style={{display:"inline-flex",alignItems:"center",gap:4}}><Icon name="eye" size={11} color={C.muted} stroke={1.5}/>{p.nuevo?"Nueva":"1.2K"}</span>
                </div>
              </div>
              {/* 3-dot menu trigger */}
              <button onClick={(e)=>{e.stopPropagation(); setPropMenu(propMenu===p.id?null:p.id);}} style={{position:"absolute",top:8,right:8,width:30,height:30,borderRadius:8,background:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Icon name="dots" size={16} color={C.muted} stroke={1.5}/>
              </button>
              {propMenu===p.id && (
                <>
                  <div onClick={(e)=>{e.stopPropagation(); setPropMenu(null);}} style={{position:"fixed",inset:0,zIndex:150}}/>
                  <div onClick={e=>e.stopPropagation()} style={{position:"absolute",top:38,right:6,zIndex:160,minWidth:170,background:C.surface,borderRadius:10,border:`1px solid ${C.line}`,boxShadow:`0 8px 24px ${C.ink}20`,overflow:"hidden"}}>
                    <button onClick={()=>{setPropMenu(null); onOpenProp&&onOpenProp(p);}} style={{display:"flex",alignItems:"center",gap:9,width:"100%",padding:"11px 14px",border:"none",background:"transparent",cursor:"pointer",fontSize:12.5,color:C.ink,fontFamily:Fb,fontWeight:500,textAlign:"left",borderBottom:`1px solid ${C.lineSoft}`}}>
                      <Icon name="eye" size={14} color={C.text} stroke={1.5}/>Ver ficha
                    </button>
                    <button onClick={()=>{setPropMenu(null); setEditingProp(p);}} style={{display:"flex",alignItems:"center",gap:9,width:"100%",padding:"11px 14px",border:"none",background:"transparent",cursor:"pointer",fontSize:12.5,color:C.ink,fontFamily:Fb,fontWeight:500,textAlign:"left",borderBottom:`1px solid ${C.lineSoft}`}}>
                      <Icon name="pencil" size={14} color={C.text} stroke={1.5}/>Editar
                    </button>
                    <button onClick={()=>{setPropMenu(null); if(window.confirm(`¿Eliminar "${p.title}"?`)) onDeleteProp&&onDeleteProp(p.id);}} style={{display:"flex",alignItems:"center",gap:9,width:"100%",padding:"11px 14px",border:"none",background:"transparent",cursor:"pointer",fontSize:12.5,color:C.terracotta,fontFamily:Fb,fontWeight:500,textAlign:"left"}}>
                      <Icon name="trash" size={14} color={C.terracotta} stroke={1.5}/>Eliminar
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      :
        <div style={{padding:16,borderRadius:12,background:C.surface,border:`1px solid ${C.line}`}}>
          <div style={{display:"flex",alignItems:"center",gap:8,margin:"0 0 12px"}}>
            <Icon name="brain" size={16} color={C.brand} stroke={1.5}/>
            <p style={{margin:0,fontSize:12.5,fontWeight:500,color:C.ink,fontFamily:Fb}}>Tu algoritmo aprende de:</p>
          </div>
          {[
            {l:"Likes que das",icon:"heart"},
            {l:"Guardados y carpetas",icon:"bookmark"},
            {l:"Tiempo de visualización",icon:"eye"},
            {l:"Filtros frecuentes",icon:"search"},
            {l:"Reels completos",icon:"play"},
          ].map((x,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,fontSize:12,color:C.text,fontFamily:Fb,fontWeight:400,padding:"8px 0",borderBottom:i<4?`1px solid ${C.lineSoft}`:"none"}}>
              <Icon name={x.icon} size={13} color={C.subtle} stroke={1.5}/>{x.l}
            </div>
          ))}
          <div style={{marginTop:16,paddingTop:14,borderTop:`1px solid ${C.line}`}}>
            <label style={{fontSize:10,color:C.muted,fontFamily:Fb,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.1em",display:"flex",alignItems:"center",gap:5}}>
              <Icon name="calendar" size={11} color={C.muted} stroke={1.5}/>Disponibilidad para visitas
            </label>
            <div style={{display:"flex",gap:5,marginTop:8,flexWrap:"wrap"}}>
              {["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"].map(d=>{
                const on=["Sáb","Dom"].includes(d);
                return <button key={d} style={{padding:"6px 10px",borderRadius:999,fontSize:10.5,fontWeight:500,fontFamily:Fb,border:`1px solid ${on?C.forest:C.line}`,background:on?C.mintWash:C.surface,color:on?C.forest:C.muted,cursor:"pointer",letterSpacing:"0.02em"}}>{d}</button>;
              })}
            </div>
            <div style={{display:"flex",gap:8,marginTop:8,alignItems:"center"}}>
              <input value="10:00" readOnly style={{flex:1,padding:"8px 10px",borderRadius:8,background:C.bg,border:`1px solid ${C.line}`,color:C.ink,fontSize:12,fontFamily:Fb,fontWeight:500,textAlign:"center"}} />
              <span style={{color:C.subtle,fontSize:11}}>—</span>
              <input value="18:00" readOnly style={{flex:1,padding:"8px 10px",borderRadius:8,background:C.bg,border:`1px solid ${C.line}`,color:C.ink,fontSize:12,fontFamily:Fb,fontWeight:500,textAlign:"center"}} />
            </div>
          </div>
        </div>
      }

      {/* ── EDIT PROFILE MODAL ── */}
      {editProfile && (
        <div onClick={()=>setEditProfile(false)} style={{position:"fixed",inset:0,zIndex:400,background:"rgba(28,26,23,0.55)",display:"flex",alignItems:"center",justifyContent:"center",padding:18}}>
          <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:420,background:C.bg,borderRadius:18,padding:"22px 22px 18px",maxHeight:"90vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
              <h3 style={{margin:0,fontSize:20,fontWeight:400,color:C.ink,fontFamily:Fs,letterSpacing:"-0.01em"}}>Editar perfil</h3>
              <button onClick={()=>setEditProfile(false)} style={{width:30,height:30,borderRadius:"50%",background:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="close" size={16} color={C.ink} stroke={1.7}/></button>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:18}}>
              <button onClick={()=>photoInputRef.current?.click()} style={{position:"relative",background:"none",border:"none",padding:0,cursor:"pointer",marginBottom:8}}>
                {me?.photo
                  ? <img src={me.photo} alt="" style={{width:90,height:90,borderRadius:"50%",objectFit:"cover"}}/>
                  : <Avatar initials={me?.avatar||SELLER.avatar} size={90} verified/>}
                <span style={{position:"absolute",bottom:0,right:0,width:30,height:30,borderRadius:"50%",background:C.ink,border:`3px solid ${C.bg}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Icon name="camera" size={13} color={C.surface} stroke={2}/>
                </span>
              </button>
              <p style={{margin:0,fontSize:11,color:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.04em"}}>Toca para cambiar foto</p>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:13}}>
              <div><label style={{fontSize:10,color:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase"}}>Nombre completo</label>
                <input value={pf.name} onChange={e=>setPf({...pf,name:e.target.value})} style={{display:"block",width:"100%",marginTop:6,padding:"11px 13px",borderRadius:10,background:C.surface,border:`1px solid ${C.line}`,color:C.ink,fontSize:13,fontFamily:Fb,fontWeight:400,outline:"none",boxSizing:"border-box"}}/>
              </div>
              <div><label style={{fontSize:10,color:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase"}}>Email</label>
                <input type="email" value={pf.email} onChange={e=>setPf({...pf,email:e.target.value})} style={{display:"block",width:"100%",marginTop:6,padding:"11px 13px",borderRadius:10,background:C.surface,border:`1px solid ${C.line}`,color:C.ink,fontSize:13,fontFamily:Fb,fontWeight:400,outline:"none",boxSizing:"border-box"}}/>
              </div>
              <div><label style={{fontSize:10,color:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase"}}>WhatsApp</label>
                <input value={pf.wa} onChange={e=>setPf({...pf,wa:e.target.value})} placeholder="+569..." style={{display:"block",width:"100%",marginTop:6,padding:"11px 13px",borderRadius:10,background:C.surface,border:`1px solid ${C.line}`,color:C.ink,fontSize:13,fontFamily:Fb,fontWeight:400,outline:"none",boxSizing:"border-box"}}/>
              </div>
              <div><label style={{fontSize:10,color:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase"}}>Ciudad</label>
                <input value={pf.city} onChange={e=>setPf({...pf,city:e.target.value})} style={{display:"block",width:"100%",marginTop:6,padding:"11px 13px",borderRadius:10,background:C.surface,border:`1px solid ${C.line}`,color:C.ink,fontSize:13,fontFamily:Fb,fontWeight:400,outline:"none",boxSizing:"border-box"}}/>
              </div>
            </div>
            <div style={{display:"flex",gap:8,marginTop:18}}>
              <button onClick={()=>setEditProfile(false)} style={{flex:1,padding:13,borderRadius:11,background:C.surface,border:`1px solid ${C.line}`,color:C.text,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:Fb}}>Cancelar</button>
              <button onClick={async ()=>{
                const newAvatar = (pf.name||"VS").split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase();
                // Optimistic update of local state
                setMe && setMe(m=>({...m, name:pf.name, email:pf.email, wa:pf.wa, city:pf.city, avatar:newAvatar}));
                // Persist to Supabase profiles table
                if (supabase && me?.id) {
                  const { error } = await supabase.from("profiles").update({
                    name: pf.name, wa: pf.wa, city: pf.city,
                  }).eq("id", me.id);
                  if (error) console.warn("Profile update error:", error);
                }
                setEditProfile(false);
              }} style={{flex:1.4,padding:13,borderRadius:11,background:C.ink,border:"none",color:C.surface,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:Fb}}>Guardar cambios</button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT PROPERTY MODAL ── */}
      {editingProp && (
        <div onClick={()=>setEditingProp(null)} style={{position:"fixed",inset:0,zIndex:400,background:"rgba(28,26,23,0.55)",display:"flex",alignItems:"center",justifyContent:"center",padding:18}}>
          <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:420,background:C.bg,borderRadius:18,padding:"22px 22px 18px",maxHeight:"90vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <h3 style={{margin:0,fontSize:20,fontWeight:400,color:C.ink,fontFamily:Fs,letterSpacing:"-0.01em"}}>Editar publicación</h3>
              <button onClick={()=>setEditingProp(null)} style={{width:30,height:30,borderRadius:"50%",background:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="close" size={16} color={C.ink} stroke={1.7}/></button>
            </div>
            <img src={editingProp.img} alt="" style={{width:"100%",height:140,borderRadius:12,objectFit:"cover",marginBottom:14}}/>
            <div style={{display:"flex",flexDirection:"column",gap:13}}>
              <div><label style={{fontSize:10,color:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase"}}>Título</label>
                <input value={epf.title} onChange={e=>setEpf({...epf,title:e.target.value})} style={{display:"block",width:"100%",marginTop:6,padding:"11px 13px",borderRadius:10,background:C.surface,border:`1px solid ${C.line}`,color:C.ink,fontSize:13,fontFamily:Fb,fontWeight:400,outline:"none",boxSizing:"border-box"}}/>
              </div>
              <div><label style={{fontSize:10,color:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase"}}>Ubicación</label>
                <input value={epf.loc} onChange={e=>setEpf({...epf,loc:e.target.value})} placeholder="Dejala en blanco para no cambiarla" style={{display:"block",width:"100%",marginTop:6,padding:"11px 13px",borderRadius:10,background:C.surface,border:`1px solid ${C.line}`,color:C.ink,fontSize:13,fontFamily:Fb,fontWeight:400,outline:"none",boxSizing:"border-box"}}/>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
                <div style={{flex:0.4}}><label style={{fontSize:10,color:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase"}}>Moneda</label>
                  <div style={{display:"flex",gap:3,marginTop:6,background:C.surface,padding:3,borderRadius:10,border:`1px solid ${C.line}`}}>
                    {["UF","CLP"].map(c=>{const on=epf.cur===c; return <button key={c} onClick={()=>setEpf({...epf,cur:c})} style={{flex:1,padding:"7px 0",borderRadius:7,border:"none",background:on?C.ink:"transparent",color:on?C.surface:C.muted,fontSize:11,fontWeight:500,cursor:"pointer",fontFamily:Fb}}>{c}</button>;})}
                  </div>
                </div>
                <div style={{flex:1}}><label style={{fontSize:10,color:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase"}}>Precio</label>
                  <input type="number" value={epf.price} onChange={e=>setEpf({...epf,price:e.target.value})} style={{display:"block",width:"100%",marginTop:6,padding:"11px 13px",borderRadius:10,background:C.surface,border:`1px solid ${C.line}`,color:C.ink,fontSize:13,fontFamily:Fb,fontWeight:400,outline:"none",boxSizing:"border-box"}}/>
                </div>
              </div>
              <div><label style={{fontSize:10,color:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase"}}>Descripción</label>
                <textarea value={epf.desc} onChange={e=>setEpf({...epf,desc:e.target.value})} style={{display:"block",width:"100%",marginTop:6,padding:"11px 13px",borderRadius:10,background:C.surface,border:`1px solid ${C.line}`,color:C.ink,fontSize:13,fontFamily:Fb,fontWeight:400,outline:"none",resize:"vertical",minHeight:90,boxSizing:"border-box",lineHeight:1.5}}/>
              </div>
            </div>
            <div style={{display:"flex",gap:8,marginTop:18}}>
              <button onClick={()=>setEditingProp(null)} style={{flex:1,padding:13,borderRadius:11,background:C.surface,border:`1px solid ${C.line}`,color:C.text,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:Fb}}>Cancelar</button>
              <button onClick={()=>{
                onEditProp && onEditProp(editingProp.id, {title:epf.title, price:Number(epf.price)||0, cur:epf.cur, desc:epf.desc, loc:epf.loc});
                setEditingProp(null);
              }} style={{flex:1.4,padding:13,borderRadius:11,background:C.ink,border:"none",color:C.surface,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:Fb}}>Guardar cambios</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══ MAIN ═══
// ─── Desktop sidebar nav ───
// ─── Desktop TopBar — horizontal nav, replaces the sidebar on PC ───
function TopBarDesktop({active,go,onNotif}) {
  const [aiOpen,setAiOpen]=useState(false);
  return (
    <header className="pc-topbar" style={{position:"sticky",top:0,zIndex:120,background:"rgba(10,10,11,0.92)",backdropFilter:"blur(20px)",borderBottom:`1px solid ${C.line}`,padding:"14px 28px",display:"none",alignItems:"center",justifyContent:"space-between",gap:24}}>
      {/* Logo C2C (clickable → home C2C) */}
      <a href="https://c2cprops.com" style={{display:"flex",flexDirection:"column",textDecoration:"none",lineHeight:1}} title="Volver al inicio C2C">
        <span style={{fontSize:26,fontWeight:500,fontFamily:Fs,color:C.ink,letterSpacing:"-0.5px"}}>C<em style={{fontStyle:"italic",color:C.brand,fontWeight:400}}>2</em>C</span>
        <span style={{fontSize:9.5,color:C.muted,fontFamily:Fb,letterSpacing:"0.2em",textTransform:"lowercase",marginTop:4,fontWeight:300}}>property market</span>
      </a>

      {/* Nav C2C unificado: Comprar / Vender / Mi asistente IA */}
      <nav style={{display:"flex",alignItems:"center",gap:6,position:"relative"}}>
        <a href="https://c2cprops.com/comprar" style={{color:C.text,padding:"7px 16px",borderRadius:999,fontSize:13,fontWeight:500,letterSpacing:"0.03em",textDecoration:"none",fontFamily:Fb}}>Comprar</a>
        <a href="https://c2cprops.com/vender" style={{color:C.text,padding:"7px 16px",borderRadius:999,fontSize:13,fontWeight:500,letterSpacing:"0.03em",textDecoration:"none",fontFamily:Fb}}>Publicar</a>
        <button onClick={(e)=>{e.stopPropagation();setAiOpen(!aiOpen)}} style={{display:"inline-flex",alignItems:"center",gap:6,color:C.text,background:`rgba(201,168,106,0.08)`,border:`1px solid ${C.brand}40`,padding:"7px 14px",borderRadius:999,fontSize:13,fontWeight:500,letterSpacing:"0.03em",cursor:"pointer",fontFamily:Fb}}>
          <span style={{color:C.brand,fontSize:12}}>✦</span> Mi asistente IA <span style={{fontSize:10,transform:aiOpen?"rotate(180deg)":"none",transition:"transform 0.2s"}}>▾</span>
        </button>
        {aiOpen && <>
          <div onClick={()=>setAiOpen(false)} style={{position:"fixed",inset:0,zIndex:200,background:"transparent"}}/>
          <div style={{position:"absolute",top:"calc(100% + 8px)",right:0,minWidth:280,background:"#0f0f10",border:`1px solid ${C.line}`,borderRadius:14,padding:8,boxShadow:`0 20px 50px rgba(0,0,0,0.8)`,zIndex:300}}>
            <a href="https://c2cprops.com/tasar?view=comprador" style={{display:"flex",alignItems:"flex-start",gap:12,padding:"12px 14px",borderRadius:10,textDecoration:"none",color:C.text}}>
              <span style={{fontSize:20,lineHeight:1}}>🔍</span>
              <div>
                <div style={{fontFamily:Fs,fontSize:16,fontWeight:500,color:C.ink}}>Ayuda en tu compra</div>
                <div style={{fontSize:11,color:C.muted,fontFamily:Fb,marginTop:2}}>Isidora te encuentra la propiedad perfecta</div>
              </div>
            </a>
            <a href="https://c2cprops.com/tasar?view=vendedor" style={{display:"flex",alignItems:"flex-start",gap:12,padding:"12px 14px",borderRadius:10,textDecoration:"none",color:C.text}}>
              <span style={{fontSize:20,lineHeight:1}}>🏡</span>
              <div>
                <div style={{fontFamily:Fs,fontSize:16,fontWeight:500,color:C.ink}}>Ayuda en tu venta</div>
                <div style={{fontSize:11,color:C.muted,fontFamily:Fb,marginTop:2}}>Valentina tasa y te asesora gratis</div>
              </div>
            </a>
            <a href="https://vender.c2cprops.com/?mode=editor" style={{display:"flex",alignItems:"flex-start",gap:12,padding:"12px 14px",borderRadius:10,textDecoration:"none",color:C.text}}>
              <span style={{fontSize:20,lineHeight:1}}>🎬</span>
              <div>
                <div style={{fontFamily:Fs,fontSize:16,fontWeight:500,color:C.ink}}>Editor de videos</div>
                <div style={{fontSize:11,color:C.muted,fontFamily:Fb,marginTop:2}}>Armá tu reel con IA y descargalo</div>
              </div>
            </a>
          </div>
        </>}
      </nav>
    </header>
  );
}

// ─── User badge — avatar Valentina fijo abajo a la izquierda ───
function UserCornerBadge({me, onClick}) {
  if (!me) return null;
  return (
    <button
      onClick={onClick}
      style={{
        position:"fixed",
        bottom:20,
        left:20,
        zIndex:90,
        display:"flex",
        alignItems:"center",
        gap:10,
        padding:"8px 14px 8px 8px",
        borderRadius:999,
        background:C.surface,
        border:`1px solid ${C.line}`,
        boxShadow:`0 6px 20px rgba(0,0,0,0.4)`,
        cursor:"pointer",
        fontFamily:Fb,
      }}
      title="Mi perfil"
    >
      <Avatar initials={me.avatar||"VS"} size={32} verified={me.verified}/>
      <div style={{textAlign:"left",lineHeight:1.1}}>
        <div style={{fontSize:12.5,fontWeight:500,color:C.ink}}>{(me.name||"Usuario").split(" ")[0]}</div>
        <div style={{fontSize:9.5,color:C.muted,fontWeight:400,letterSpacing:"0.04em",marginTop:2}}>{me.verified?"Verificada":"Sin verificar"}</div>
      </div>
    </button>
  );
}

// ─── useAuth: tracks supabase session + profile ───
function useAuth() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  // Load profile whenever session changes
  useEffect(() => {
    if (!supabase || !session?.user) { setProfile(null); return; }
    const load = async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).maybeSingle();
      if (error) { console.warn("Profile load error", error); return; }
      // If trigger hasn't created the profile yet (race), wait and retry once
      if (!data) {
        await new Promise(r => setTimeout(r, 600));
        const retry = await supabase.from("profiles").select("*").eq("id", session.user.id).maybeSingle();
        setProfile(retry.data || null);
      } else {
        setProfile(data);
      }
    };
    load();
  }, [session?.user?.id]);

  return { session, user: session?.user || null, profile, setProfile, loading };
}

// ─── AuthScreen: signup / login ───
function AuthScreen({ onAuthed, onGuest }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [wa, setWa] = useState("+56");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");

  // Normalize phone — strip non-digits but keep leading +
  const normalizePhone = (raw) => {
    const trimmed = (raw || "").trim();
    if (!trimmed) return "";
    const digits = trimmed.replace(/\D/g, "");
    if (digits.length < 8) return "";
    // If user typed without +, prepend +56 (Chile)
    if (trimmed.startsWith("+")) return "+" + digits;
    if (digits.startsWith("56")) return "+" + digits;
    return "+56" + digits;
  };

  const submit = async (e) => {
    e?.preventDefault?.();
    setErr(""); setInfo(""); setBusy(true);
    try {
      if (!supabase) throw new Error("Supabase no configurado");
      if (mode === "signup") {
        if (!name.trim()) throw new Error("Tu nombre es obligatorio");
        if (password.length < 6) throw new Error("La contraseña debe tener al menos 6 caracteres");
        const phone = normalizePhone(wa);
        if (!phone) throw new Error("Necesitamos tu WhatsApp para que los interesados te contacten");
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { name: name.trim() } },
        });
        if (error) throw error;
        // Update profile row with WhatsApp (the trigger created the row with just name+email)
        if (data?.user?.id) {
          // Wait a tick so the trigger has time to create the profile row
          await new Promise(r => setTimeout(r, 800));
          const { error: updErr } = await supabase.from("profiles").update({ wa: phone }).eq("id", data.user.id);
          if (updErr) console.warn("Profile WhatsApp update error:", updErr);
        }
        // If session auto-created (email confirmation off), we're logged in
        if (data?.session) {
          onAuthed && onAuthed();
        } else {
          setInfo("Cuenta creada. Iniciá sesión para continuar.");
          setMode("login");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        onAuthed && onAuthed();
      }
    } catch (e) {
      setErr(e?.message || "Algo salió mal. Inténtalo otra vez.");
    } finally {
      setBusy(false);
    }
  };

  const forgot = async () => {
    if (!email.trim()) { setErr("Escribe tu email arriba primero"); return; }
    setErr(""); setInfo(""); setBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      if (error) throw error;
      setInfo("Te enviamos un email para resetear tu contraseña.");
    } catch (e) {
      setErr(e?.message || "Error enviando email de reseteo");
    } finally { setBusy(false); }
  };

  return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:"24px 18px"}}>
      <div style={{width:"100%",maxWidth:380,background:C.surface,borderRadius:18,padding:"28px 24px 24px",boxShadow:`0 18px 50px ${C.ink}10`,border:`1px solid ${C.line}`}}>
        {/* Brand header */}
        <div style={{textAlign:"center",marginBottom:22}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:9}}>
            <Logo size={32}/>
            <h1 style={{margin:0,fontSize:28,fontWeight:400,fontFamily:Fs,color:C.ink,letterSpacing:"-0.02em"}}>C<em style={{fontStyle:"italic",color:C.brand,fontWeight:400}}>2</em>C</h1>
          </div>
          <p style={{margin:"6px 0 0",fontSize:10.5,color:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.16em",textTransform:"uppercase"}}>Sector inmobiliario</p>
        </div>

        <h2 style={{margin:"0 0 4px",fontSize:18,fontWeight:400,color:C.ink,fontFamily:Fs,letterSpacing:"-0.01em"}}>{mode==="signup"?"Crear cuenta":"Iniciar sesión"}</h2>
        <p style={{margin:"0 0 18px",fontSize:12,color:C.muted,fontFamily:Fb,fontWeight:400,lineHeight:1.45}}>{mode==="signup"?"Sumate a properties y publicá tu propiedad en minutos.":"Bienvenida de vuelta."}</p>

        <form onSubmit={submit}>
          {mode==="signup" && (
            <>
              <div style={{marginBottom:11}}>
                <label style={{fontSize:10,color:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase"}}>Nombre completo</label>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="Valentina Sanchez" autoComplete="name" style={{display:"block",width:"100%",marginTop:6,padding:"11px 13px",borderRadius:10,background:C.bg,border:`1px solid ${C.line}`,color:C.ink,fontSize:13,fontFamily:Fb,fontWeight:400,outline:"none",boxSizing:"border-box"}}/>
              </div>
              <div style={{marginBottom:11}}>
                <label style={{fontSize:10,color:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase"}}>WhatsApp</label>
                <input type="tel" value={wa} onChange={e=>setWa(e.target.value)} placeholder="+56 9 8765 4321" autoComplete="tel" style={{display:"block",width:"100%",marginTop:6,padding:"11px 13px",borderRadius:10,background:C.bg,border:`1px solid ${C.line}`,color:C.ink,fontSize:13,fontFamily:Fb,fontWeight:400,outline:"none",boxSizing:"border-box"}}/>
                <p style={{margin:"4px 0 0",fontSize:10,color:C.subtle,fontFamily:Fb,fontWeight:400,fontStyle:"italic"}}>Para que los interesados te contacten cuando vean tus reels.</p>
              </div>
            </>
          )}
          <div style={{marginBottom:11}}>
            <label style={{fontSize:10,color:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase"}}>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@email.com" autoComplete="email" required style={{display:"block",width:"100%",marginTop:6,padding:"11px 13px",borderRadius:10,background:C.bg,border:`1px solid ${C.line}`,color:C.ink,fontSize:13,fontFamily:Fb,fontWeight:400,outline:"none",boxSizing:"border-box"}}/>
          </div>
          <div style={{marginBottom:14}}>
            <label style={{fontSize:10,color:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase"}}>Contraseña</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder={mode==="signup"?"Al menos 6 caracteres":"Tu contraseña"} autoComplete={mode==="signup"?"new-password":"current-password"} required style={{display:"block",width:"100%",marginTop:6,padding:"11px 13px",borderRadius:10,background:C.bg,border:`1px solid ${C.line}`,color:C.ink,fontSize:13,fontFamily:Fb,fontWeight:400,outline:"none",boxSizing:"border-box"}}/>
          </div>

          {err && (
            <div style={{padding:"8px 11px",borderRadius:9,background:"#FCEEDC",border:"1px solid #E8B996",marginBottom:11}}>
              <p style={{margin:0,fontSize:11.5,color:"#9B3D2B",fontFamily:Fb,fontWeight:500,lineHeight:1.4}}>{err}</p>
            </div>
          )}
          {info && (
            <div style={{padding:"8px 11px",borderRadius:9,background:C.mintWash,border:"1px solid #CDDBCE",marginBottom:11}}>
              <p style={{margin:0,fontSize:11.5,color:C.forest,fontFamily:Fb,fontWeight:500,lineHeight:1.4}}>{info}</p>
            </div>
          )}

          <button type="submit" disabled={busy} style={{width:"100%",padding:13,borderRadius:11,background:busy?C.line:C.ink,border:"none",color:C.surface,fontSize:13.5,fontWeight:500,cursor:busy?"default":"pointer",fontFamily:Fb,letterSpacing:"0.02em"}}>
            {busy ? "Procesando…" : (mode==="signup" ? "Crear cuenta" : "Iniciar sesión")}
          </button>

          {mode==="login" && (
            <button type="button" onClick={forgot} style={{display:"block",margin:"10px auto 0",background:"none",border:"none",cursor:"pointer",fontSize:11.5,color:C.brand,fontFamily:Fb,fontWeight:500,textDecoration:"underline"}}>
              ¿Olvidaste tu contraseña?
            </button>
          )}
        </form>

        <div style={{marginTop:18,paddingTop:14,borderTop:`1px solid ${C.lineSoft}`,textAlign:"center"}}>
          <p style={{margin:0,fontSize:11.5,color:C.muted,fontFamily:Fb,fontWeight:400}}>
            {mode==="signup" ? "¿Ya tenés cuenta?" : "¿Primera vez en properties?"}
            <button onClick={()=>{setMode(mode==="signup"?"login":"signup");setErr("");setInfo("");}} style={{marginLeft:5,background:"none",border:"none",cursor:"pointer",color:C.brand,fontFamily:Fb,fontWeight:600,fontSize:11.5}}>
              {mode==="signup" ? "Iniciá sesión" : "Crear cuenta"}
            </button>
          </p>
        </div>

        {/* Guest mode — explorar sin cuenta */}
        <button onClick={()=>onGuest && onGuest()} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:7,width:"100%",marginTop:14,padding:"11px 14px",borderRadius:11,background:"transparent",border:`1px solid ${C.line}`,cursor:"pointer",color:C.text,fontSize:12,fontWeight:500,fontFamily:Fb,letterSpacing:"0.02em"}}>
          <Icon name="eye" size={14} color={C.text} stroke={1.6}/>Continuar como invitado
          <span style={{fontSize:10,color:C.muted,fontWeight:400,letterSpacing:"0.04em"}}>· explorar sin cuenta</span>
        </button>
      </div>
    </div>
  );
}

// ─── Auth gate wrapper — keeps the hooks of MainApp stable across auth changes ───
export default function App() {
  const { session, profile, setProfile, loading: authLoading } = useAuth();
  // Guest mode — explorar la app sin crear cuenta
  const [guestMode, setGuestMode] = useState(() => {
    try {
      // Llegada desde "publicar" (vender.c2cprops.com) o link con ?guest=1:
      // entrar como invitado de inmediato, sin interponer el login.
      const qs = new URLSearchParams(window.location.search);
      if (qs.get("guest") === "1" || qs.get("justPublished")) {
        window.localStorage.setItem("guest_mode", "1");
        return true;
      }
      return window.localStorage.getItem("guest_mode") === "1";
    } catch(e) { return false; }
  });
  // Buyer profile — quick signup (nombre + WA), sin Supabase Auth
  const [buyerProfile, setBuyerProfile] = useState(() => {
    try {
      const raw = window.localStorage.getItem("c2c_buyer_profile");
      return raw ? JSON.parse(raw) : null;
    } catch(e) { return null; }
  });
  // Escuchar cambios en localStorage (cuando el modal signup lo escribe)
  useEffect(() => {
    const check = () => {
      try {
        const raw = window.localStorage.getItem("c2c_buyer_profile");
        const parsed = raw ? JSON.parse(raw) : null;
        setBuyerProfile(cur => (cur?.id === parsed?.id ? cur : parsed));
      } catch(e) {}
    };
    window.addEventListener("storage", check);
    // Poll cada 1s por si se escribió en la misma pestaña
    const iv = setInterval(check, 1000);
    return () => { window.removeEventListener("storage", check); clearInterval(iv); };
  }, []);
  const enterGuestMode = () => {
    try { window.localStorage.setItem("guest_mode", "1"); } catch(e) {}
    setGuestMode(true);
  };
  // Si la persona se loguea, salimos del modo invitado automáticamente
  useEffect(() => {
    if (session && guestMode) {
      try { window.localStorage.removeItem("guest_mode"); } catch(e) {}
      setGuestMode(false);
    }
  }, [session, guestMode]);
  // Si tiene buyerProfile, ya no es "invitado" — es un usuario buyer con cuenta rápida
  const hasBuyerAccount = !!buyerProfile?.id;
  const effectiveIsGuest = !session && guestMode && !hasBuyerAccount;

  // While checking auth on first load, show a small loader
  if (supabase && authLoading && !guestMode && !hasBuyerAccount) {
    return (
      <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:24,height:24,borderRadius:"50%",border:`2.5px solid ${C.brand}`,borderTopColor:"transparent",animation:"spin 0.9s linear infinite"}}/>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <span style={{fontSize:12,color:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.06em",textTransform:"uppercase"}}>Cargando properties.</span>
        </div>
      </div>
    );
  }
  // Not authenticated AND not guest AND no buyer profile → show signup/login screen
  if (supabase && !session && !guestMode && !hasBuyerAccount) return <AuthScreen onGuest={enterGuestMode}/>;
  // Prioridad de identidad: session Supabase > buyerProfile > null
  const effectiveProfile = profile || (hasBuyerAccount ? {
    id: buyerProfile.id,
    name: buyerProfile.name,
    wa: buyerProfile.wa,
    verified: false,
    is_buyer_quick: true,
  } : null);
  return <MainApp
    key={session?.user?.id || buyerProfile?.id || (guestMode?"guest":"anon")}
    authProfile={effectiveProfile}
    setAuthProfile={setProfile}
    isGuest={effectiveIsGuest}
    onExitGuest={()=>{
      try { window.localStorage.removeItem("guest_mode"); } catch(e) {}
      setGuestMode(false);
    }}
    onLogout={()=>{
      try {
        window.localStorage.removeItem("guest_mode");
        window.localStorage.removeItem("c2c_buyer_profile");
        window.localStorage.removeItem("c2c_guest_owner_id");
      } catch(e) {}
      setGuestMode(false);
      setBuyerProfile(null);
    }}
  />;
}

function MainApp({ authProfile, setAuthProfile, isGuest, onExitGuest }) {
  // ─── App state ───
  // Tab inicial: leer ?modo= de la URL para integración con shell C2C.
  //   ?modo=publicar (/publicar en el shell)  → abre el wizard de vender
  //   ?modo=comprar  (/comprar en el shell)   → feed default
  //   sin param                                → feed default
  const initialTab = (() => {
    try {
      const params = new URLSearchParams(window.location.search);
      // Al publicar un reel desde greatdeal-app se redirige acá con ?tab=reels
      const tab = params.get("tab");
      if (tab === "reels" || tab === "feed" || tab === "saved" || tab === "profile") return tab;
      const modo = params.get("modo");
      if (modo === "publicar") return "sell";
      if (modo === "comprar")  return "feed";
    } catch(e) {}
    return "feed";
  })();
  // ID de la propiedad recién publicada (viene de greatdeal-app después de publicar)
  // Se usa para: (a) mostrar toast "¡Publicado!" (b) opcionalmente hacer scroll a ese reel
  const justPublishedId = (() => {
    try {
      const p = new URLSearchParams(window.location.search).get("justPublished");
      return p || null;
    } catch(e) { return null; }
  })();
  // ?prop=<id> → link directo a un aviso. Se lee al cargar para abrir la ficha
  // y se mantiene sincronizado con history.replaceState mientras esté abierta.
  const initialPropId = (() => {
    try { return new URLSearchParams(window.location.search).get("prop") || null; }
    catch(e) { return null; }
  })();
  // Owner ID viene de greatdeal-app (?owner=<uuid>) cuando publica sin login.
  // Lo guardamos en localStorage para que la app reconozca al vendedor sin auth
  // formal — todas las propiedades con ese owner_id son "suyas".
  const guestOwnerId = (() => {
    try {
      const fromUrl = new URLSearchParams(window.location.search).get("owner");
      if (fromUrl) {
        localStorage.setItem("c2c_guest_owner_id", fromUrl);
        return fromUrl;
      }
      return localStorage.getItem("c2c_guest_owner_id") || null;
    } catch(e) { return null; }
  })();
  const [tab,setTab]=useState(initialTab);
  const [view,setView]=useState(null);
  const [reelStart,setReelStart]=useState(null);
  const [savedSubTab,setSavedSubTab]=useState("saved");
  const [profileSubTab,setProfileSubTab]=useState("pub");
  const [openProfilePanel,setOpenProfilePanel]=useState(null);
  const [selectedChat,setSelectedChat]=useState(null);
  const [toast,setToast]=useState(null);
  const [props,setProps]=useState(PROPS);
  const [loadError,setLoadError]=useState(false);
  // Toast de bienvenida: si llegaste desde greatdeal-app (?justPublished=<id>),
  // celebrá que la propiedad ya está publicada + abrir directo tu reel.
  useEffect(() => {
    if (justPublishedId) {
      setToast("🎉 ¡Tu propiedad ya está publicada!");
      // Abrir el reel player con TU reel primero (para preview inmediato)
      setReelStart(justPublishedId);
      setTab("reels");
      setTimeout(() => setToast(null), 4000);
      // Limpiar los query params de la URL para no re-mostrar al recargar
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete("justPublished");
        url.searchParams.delete("owner"); // ya está guardado en localStorage
        url.searchParams.delete("tab");
        window.history.replaceState({}, "", url.toString());
      } catch(e) {}
    }
  }, []);
  // Load real properties from Supabase on mount + subscribe to real-time changes
  useEffect(() => {
    if (!supabase) return;
    let active = true;
    const refresh = async () => {
      try {
        const rows = await fetchProperties();
        if (!active) return;
        if (rows === null) { setLoadError(true); return; }
        setLoadError(false);
        if (rows.length > 0) setProps([...rows, ...PROPS]);
      } catch(e) { console.warn("Fetch error", e); if (active) setLoadError(true); }
    };
    refresh();
    // Real-time: cuando alguien publica/edita/borra, todos refrescan el feed
    const channel = supabase
      .channel("properties-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "properties" }, () => { refresh(); })
      .subscribe();
    return () => { active = false; supabase.removeChannel(channel); };
  }, []);
  // "me" state — initialized from authenticated profile if available, else SELLER fallback
  const [me,setMe]=useState(() => {
    if (authProfile) {
      const initials = (authProfile.name||"VS").split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase();
      return {
        name: authProfile.name || "Usuario",
        email: authProfile.email || "",
        wa: authProfile.wa || "",
        city: authProfile.city || "Santiago",
        avatar: initials,
        photo: authProfile.avatar_url || null,
        verified: authProfile.verified || false,
        id: authProfile.id,
      };
    }
    return {...SELLER, email:"valentina@mktandgrowth.com", city:"Santiago", photo:null};
  });

  // Sync `me` with profile changes
  useEffect(() => {
    if (authProfile) {
      const initials = (authProfile.name||"VS").split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase();
      setMe({
        name: authProfile.name || "Usuario",
        email: authProfile.email || "",
        wa: authProfile.wa || "",
        city: authProfile.city || "Santiago",
        avatar: initials,
        photo: authProfile.avatar_url || null,
        verified: authProfile.verified || false,
        id: authProfile.id,
      });
    }
  }, [authProfile]);

  // Logout helper available inside MainApp
  const logout = async () => { if (supabase) await supabase.auth.signOut(); };

  // ─── Back-button navigation: handle Android back button gracefully ───
  // Each time we open Detail or Chat, push a history entry. When popstate fires (back pressed),
  // close the topmost open view instead of letting the browser close the app.
  const pushedRef = useRef(0);
  useEffect(() => {
    const isOpen = (view || selectedChat) ? 1 : 0;
    if (isOpen && pushedRef.current === 0) {
      window.history.pushState({appModal: true}, "");
      pushedRef.current = 1;
    } else if (!isOpen && pushedRef.current > 0) {
      pushedRef.current = 0;
      // Don't call history.back here — that triggers popstate which would re-fire
    }
  }, [view, selectedChat]);
  useEffect(() => {
    const onPop = () => {
      // Close in priority order: chat first, then detail
      if (selectedChat) { setSelectedChat(null); pushedRef.current = 0; return; }
      if (view) { setView(null); pushedRef.current = 0; return; }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [view, selectedChat]);

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(null), 2000); };

  // ─── Link por aviso (?prop=<id>) ───────────────────────────────────────────
  // Al cargar con ?prop=<id>, abrimos esa ficha apenas la propiedad esté en
  // `props` (los avisos de Supabase llegan después del primer render).
  const deepLinkDone = useRef(false);
  useEffect(() => {
    if (deepLinkDone.current || !initialPropId) return;
    const p = props.find(x => String(x.id) === String(initialPropId));
    if (!p) return;
    deepLinkDone.current = true;
    setView({t:"d", p});
  }, [props, initialPropId]);
  // Mientras haya una ficha abierta, la URL apunta a ese aviso (link compartible).
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (view?.t === "d" && view.p?.id != null) url.searchParams.set("prop", String(view.p.id));
      else url.searchParams.delete("prop");
      if (url.toString() !== window.location.href) {
        window.history.replaceState(window.history.state, "", url.toString());
      }
    } catch(e) {}
  }, [view]);
  // URL canónica de un aviso: origen + path actual + ?prop=<id>.
  const propUrl = (id) => {
    try {
      const url = new URL(window.location.href);
      url.search = ""; url.hash = "";
      url.searchParams.set("prop", String(id));
      return url.toString();
    } catch(e) { return ""; }
  };
  const shareProp = async (p) => {
    const link = p && p.id != null ? propUrl(p.id) : "";
    if (!link) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(link);
      } else {
        // Fallback para contextos sin clipboard API (http, WebViews viejos)
        const ta = document.createElement("textarea");
        ta.value = link; ta.setAttribute("readonly", "");
        ta.style.position = "fixed"; ta.style.top = "-1000px"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      showToast("Link copiado");
    } catch(e) { showToast("No se pudo copiar el link"); }
  };

  // ─── Cargar likes/saved del user autenticado desde Supabase ─────────────
  // Tabla `user_actions` (user_id text, prop_id uuid, action text, created_at)
  // Al montar (o cuando cambia el user), traemos sus acciones y marcamos las props.
  useEffect(() => {
    if (!supabase || !me?.id || isGuest) return;
    let active = true;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("user_actions")
          .select("prop_id, action")
          .eq("user_id", me.id);
        if (error) { console.warn("user_actions fetch error", error); return; }
        if (!active) return;
        const likedSet = new Set(data.filter(a => a.action === "like").map(a => a.prop_id));
        const savedSet = new Set(data.filter(a => a.action === "save").map(a => a.prop_id));
        setProps(ps => ps.map(p => ({
          ...p,
          liked: likedSet.has(p.id) || p.liked,
          saved: savedSet.has(p.id) || p.saved,
        })));
      } catch (e) { console.warn("user_actions fetch failed", e); }
    })();
    return () => { active = false; };
  }, [me?.id, isGuest]);

  // Toggle like/save con persistencia en Supabase (optimistic UI)
  const toggleAction = async (id, action) => {
    if (isGuest) { setGuestPromptFor(action === "like" ? "dar like a propiedades" : "guardar propiedades"); return; }
    const p = props.find(x => x.id === id);
    const isActive = action === "like" ? p?.liked : p?.saved;
    // Optimistic UI: cambiar visualmente ya
    setProps(ps => ps.map(x => x.id === id ? { ...x, [action === "like" ? "liked" : "saved"]: !isActive } : x));
    const msg = isActive
      ? (action === "like" ? "Quitado de tus likes" : "Quitado de guardados")
      : (action === "like" ? "Agregado a tus likes" : "Guardado en tu lista");
    showToast(msg);
    // Persistir en Supabase (silencioso si falla — no revertimos la UI para no confundir)
    if (!supabase || !me?.id) return;
    try {
      if (isActive) {
        // Delete existing action
        await supabase
          .from("user_actions")
          .delete()
          .eq("user_id", me.id)
          .eq("prop_id", id)
          .eq("action", action);
      } else {
        // Upsert new action (evita duplicados)
        await supabase
          .from("user_actions")
          .upsert(
            { user_id: me.id, prop_id: id, action },
            { onConflict: "user_id,prop_id,action" }
          );
      }
    } catch (e) { console.warn("user_actions persist failed", e); }
  };
  const like = id => toggleAction(id, "like");
  const save = id => toggleAction(id, "save");
  const open=p=>setView({t:"d",p});
  const openReel=id=>{setReelStart(id);setTab("reels");setView(null);};
  const openChat=()=>{setTab("saved");setSavedSubTab("chats");setView(null);setSelectedChat(null);};
  const openConvo=convo=>{setTab("saved");setSavedSubTab("chats");setView(null);setSelectedChat(convo);};
  // ─── Sell navigation guard — prevent accidental loss of draft ───
  const [sellHasDraft,setSellHasDraft]=useState(false);
  const [navConfirm,setNavConfirm]=useState(null); // pending tab to navigate to
  const [guestPromptFor,setGuestPromptFor]=useState(null); // texto a mostrar cuando un invitado intenta hacer algo de auth
  const [isidoraOpen,setIsidoraOpen]=useState(false); // chat popup inline de Isidora (asesora de compra)
  const [feedPrefs,setFeedPrefs]=useState(null); // filtros que Isidora manda al Feed (se limpian al aplicarse)
  // ─── Signup rápido (nombre + WA + código skippable) ───
  const [signupName,setSignupName]=useState("");
  const [signupWa,setSignupWa]=useState("");
  const [signupCode,setSignupCode]=useState("");
  const [signupLoading,setSignupLoading]=useState(false);
  const [signupError,setSignupError]=useState("");
  const submitSignup = async () => {
    setSignupError("");
    const name = signupName.trim();
    const wa = signupWa.trim();
    if (!name) { setSignupError("Falta tu nombre"); return; }
    const waDigits = wa.replace(/\D/g,"");
    if (waDigits.length < 8) { setSignupError("Ingresá un WhatsApp válido"); return; }
    setSignupLoading(true);
    try {
      const r = await fetch("https://greatdeal-api.onrender.com/api/profile/upsert", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ name, wa: waDigits, code: signupCode }),
      });
      const j = await r.json();
      if (!r.ok || !j?.owner_id) {
        setSignupError(j?.error || j?.detail || "No se pudo crear la cuenta");
        setSignupLoading(false); return;
      }
      // Guardar owner_id como guest owner y perfil local
      try {
        window.localStorage.setItem("c2c_guest_owner_id", j.owner_id);
        window.localStorage.setItem("c2c_buyer_profile", JSON.stringify({ id: j.owner_id, name, wa: waDigits }));
      } catch(e) {}
      const target = guestPromptFor;
      setGuestPromptFor(null);
      setSignupName(""); setSignupWa(""); setSignupCode(""); setSignupLoading(false);
      showToast("Cuenta creada ✓");
      // El App.tsx tiene un polling que detecta c2c_buyer_profile en localStorage
      // y actualiza el state global. Mientras tanto, navegamos al tab correcto.
      setTimeout(() => {
        if (target && target.includes("perfil")) setTab("profile");
        else if (target && target.includes("guardados")) setTab("saved");
        else if (target && target.includes("publicar")) setTab("sell");
      }, 300);
    } catch (e) {
      setSignupError("Error de conexión — reintentá");
      setSignupLoading(false);
    }
  };
  const go=id=>{
    // Guest mode: bloqueamos Vender, Guardados y Perfil (necesitan cuenta)
    // EXCEPCIÓN: si el user tiene guestOwnerId (ya publicó una propiedad desde
    // greatdeal-app con su WA), lo dejamos entrar a Perfil para ver sus reels.
    if (isGuest && (id==="sell" || id==="profile" || id==="saved")) {
      // Si tiene guestOwnerId, permitir acceso a "profile" (para ver sus publicaciones)
      if (id === "profile" && guestOwnerId) {
        // Sigue el flow normal
      } else {
        const labels = { sell:"publicar una propiedad", profile:"acceder a tu perfil", saved:"ver tus guardados" };
        setGuestPromptFor(labels[id]);
        return;
      }
    }
    // If leaving Sell tab while user has a draft in progress, ask first
    if (tab==="sell" && id!=="sell" && sellHasDraft) {
      setNavConfirm(id);
      return;
    }
    setTab(id);setView(null);if(id!=="reels")setReelStart(null);if(id!=="saved")setSelectedChat(null);
  };
  const forceGo = (id) => { setTab(id); setView(null); if(id!=="reels")setReelStart(null); if(id!=="saved")setSelectedChat(null); setNavConfirm(null); };
  // Generic navigator used by Profile stats and Notifications
  const goTo = (t,opts={}) => {
    setTab(t); setView(null);
    if (t!=="reels") setReelStart(null);
    if (opts.savedSub) setSavedSubTab(opts.savedSub);
    if (opts.profileSub) setProfileSubTab(opts.profileSub);
    if (opts.profilePanel) setOpenProfilePanel(opts.profilePanel);
    if (opts.chat) setSelectedChat(opts.chat); else if (t!=="saved") setSelectedChat(null);
  };
  // Notification → action
  const onNotifAction = (n) => {
    if (n.icon === "chat" || n.icon === "calendar") {
      const convo = CONVOS.find(c => n.t.includes(c.name.split(" ")[0]) || (n.d && n.d.includes(c.prop)));
      if (convo) openConvo(convo);
      else goTo("saved",{savedSub:"chats"});
    } else if (n.icon === "eye") {
      goTo("profile",{profilePanel:"stats"});
    } else if (n.icon === "bookmark") {
      goTo("profile",{profileSub:"pub"});
    }
  };

  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:Fb,position:"relative"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
        * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        html, body { margin: 0; background: ${C.bg}; }
        input::placeholder, textarea::placeholder { color: ${C.subtle}; font-weight: 400; }
        input:focus, textarea:focus { border-color: ${C.brand} !important; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes toastIn { 0%{opacity:0;transform:translate(-50%, 20px)} 100%{opacity:1;transform:translate(-50%, 0)} }
        @keyframes slideRight { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        /* Google Places Autocomplete dropdown — force above modals */
        .pac-container { z-index: 999999 !important; border-radius: 12px !important; margin-top: 4px !important; box-shadow: 0 12px 28px rgba(28,26,23,0.18) !important; border: 1px solid ${C.line} !important; font-family: ${Fb} !important; }
        .pac-item { padding: 10px 14px !important; font-size: 13px !important; cursor: pointer !important; border-top: 1px solid ${C.lineSoft} !important; }
        .pac-item:first-child { border-top: none !important; }
        .pac-item-query { font-size: 13px !important; color: ${C.ink} !important; font-weight: 500 !important; }
        .pac-matched { font-weight: 600 !important; color: ${C.brand} !important; }
        .mob-nav { display:flex; }
        .mob-header { display: block; position: sticky; top: 0; z-index: 50; }
        .pc-only { display:none; }
        @media (min-width: 900px) {
          .mob-nav { display:flex !important; }
          .mob-header { display:none !important; }
          .pc-only, .pc-topbar { display:flex !important; }
          .main-app { max-width: none !important; margin: 0 !important; }
          .pc-content { padding: 24px 28px 40px; max-width: 1280px; margin: 0 auto; }
          .feed-grid { grid-template-columns: repeat(4, 1fr) !important; gap: 8px !important; padding: 0 !important; }
          .reels-frame { max-width: 460px !important; margin: 0 auto !important; height: calc(100vh - 88px) !important; margin-top: 12px !important; border-radius: 24px !important; overflow: hidden; }
          /* Explore in PC: filters sidebar left + results right */
          .pc-explore-layout { display: grid !important; grid-template-columns: 300px 1fr; gap: 28px; align-items: start; }
          .pc-filters-side { position: sticky; top: 96px; background: ${C.surface}; border: 1px solid ${C.line}; border-radius: 16px; padding: 8px 0; }
          .pc-results-side { min-width: 0; }
        }
      `}</style>

      <TopBarDesktop active={tab} go={go} onNotif={onNotifAction}/>

      {/* Banner de modo invitado — solo visible si entró sin cuenta */}
      {isGuest && (
        <div style={{position:"sticky",top:0,zIndex:80,background:C.brand,color:C.surface,padding:"9px 14px",display:"flex",alignItems:"center",justifyContent:"center",gap:10,fontSize:11.5,fontFamily:Fb,fontWeight:500,letterSpacing:"0.01em",boxShadow:`0 2px 8px ${C.ink}25`}}>
          <Icon name="eye" size={13} color={C.surface} stroke={1.8}/>
          <span>Estás viendo como invitado</span>
          <button onClick={()=>onExitGuest && onExitGuest()} style={{padding:"4px 11px",borderRadius:999,background:C.surface,border:"none",color:C.brand,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:Fb,letterSpacing:"0.02em"}}>Crear cuenta</button>
        </div>
      )}

      <div className="main-app" style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:C.bg,position:"relative"}}>
        <div className="mob-header">
          {tab!=="reels"&&!view&&<Header sub={tab==="feed"?"Encuentra tu próxima propiedad":tab==="sell"?"Publica tu propiedad":tab==="saved"?"Tus guardados":tab==="profile"?"Tu perfil":"Sector inmobiliario"} onNotif={onNotifAction} />}
        </div>
        <div className="pc-content">
        {view?.t==="d"?<Detail p={props.find(x=>x.id===view.p.id)||view.p} back={()=>setView(null)} onLike={like} onSave={save} onShare={shareProp} />:(
          <>
            {tab==="feed"&&<Feed props={props} onTap={open} onOpenReel={openReel} applyPrefs={feedPrefs} onPrefsApplied={()=>setFeedPrefs(null)} />}
            {tab==="reels"&&<Reels props={props} onLike={like} onSave={save} onOpen={open} onChat={openChat} onShare={shareProp} startPropId={reelStart} />}
            {tab==="sell"&&<Sell onPublish={(p)=>{setProps(ps=>[p,...ps.filter(x=>x.id!==p.id)]); showToast("Propiedad publicada ✓"); setSellHasDraft(false);}} goTo={go} onDraftChange={setSellHasDraft} me={me}/>}
            {tab==="saved"&&<SavedView props={props} onTap={open} subTab={savedSubTab} setSubTab={setSavedSubTab} selectedChat={selectedChat} setSelectedChat={setSelectedChat} />}
            {tab==="profile"&&<Profile
              props={(function() {
                // "props" en Profile = publicaciones del owner actual (para el tab Publicaciones)
                const ownerId = me?.id || guestOwnerId;
                if (!ownerId) return props;
                return props.filter(p => p._ownerId === ownerId);
              })()}
              allProps={props}
              subTab={profileSubTab}
              setSubTab={setProfileSubTab}
              onGoTo={goTo}
              initialPanel={openProfilePanel}
              clearPanel={()=>setOpenProfilePanel(null)}
              me={me}
              setMe={setMe}
              onOpenProp={(p)=>open(p)}
              onEditProp={async (id,patch)=>{
                // Optimistic update — actualiza UI inmediatamente
                setProps(ps=>ps.map(p=>p.id===id?{...p,...patch}:p));
                // Persist en la DB
                if (supabase && typeof id === "string") {
                  const dbPatch = {};
                  if (patch.title !== undefined) dbPatch.title = patch.title;
                  if (patch.price !== undefined) dbPatch.price = patch.price;
                  if (patch.cur !== undefined) dbPatch.currency = patch.cur;
                  if (patch.desc !== undefined) dbPatch.description = patch.desc;
                  // El feed público ya no pide `loc`, así que el formulario de
                  // edición lo abre vacío. Vacío significa "no la tocó", no
                  // "borrala": si lo mandáramos tal cual, cualquier edición de
                  // precio o título borraría la dirección guardada.
                  if (patch.loc) dbPatch.loc = patch.loc;
                  const { error } = await supabase.from("properties").update(dbPatch).eq("id", id);
                  if (error) { console.error("Edit failed", error); showToast("Error al actualizar"); return; }
                }
                showToast("Publicación actualizada ✓");
              }}
              onDeleteProp={async (id)=>{
                // Optimistic UI — remueve del feed inmediatamente
                setProps(ps=>ps.filter(p=>p.id!==id));
                // Persist en la DB (solo si id es un UUID — los demo PROPS tienen ids numéricos)
                if (supabase && typeof id === "string") {
                  const { error } = await supabase.from("properties").delete().eq("id", id);
                  if (error) {
                    console.error("Delete failed", error);
                    showToast("Error al eliminar — volvé a cargar la app");
                    return;
                  }
                }
                showToast("Publicación eliminada");
              }}
            />}
          </>
        )}
        </div>
        <div className="mob-nav"><Nav active={tab} go={go} /></div>
        {!isidoraOpen && <FloatingAssistant onOpen={()=>setIsidoraOpen(true)} />}
        {isidoraOpen && <IsidoraChat
          onClose={()=>setIsidoraOpen(false)}
          onApplyFilters={(prefs)=>{
            // Los filtros viven en Feed: le pasamos las prefs y navegamos a Explorar.
            // Objeto nuevo en cada llamada para que el efecto del Feed vuelva a correr.
            setFeedPrefs({...prefs});
            setTab("feed");
          }}
        />}
        <UserCornerBadge me={me} onClick={()=>go("profile")} />

        {/* Toast feedback */}
        {loadError && <div style={{position:"fixed",top:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,padding:"10px 16px",background:C.terracotta,color:C.surface,fontSize:12.5,fontFamily:Fb,fontWeight:500,textAlign:"center",zIndex:500,boxSizing:"border-box",letterSpacing:"0.01em"}}>No pudimos cargar las propiedades, recargá la página</div>}
        {toast && <div style={{position:"fixed",bottom:96,left:"50%",transform:"translateX(-50%)",padding:"10px 18px",borderRadius:999,background:C.ink,color:C.surface,fontSize:12.5,fontFamily:Fb,fontWeight:500,boxShadow:"0 8px 24px rgba(28,26,23,0.3)",zIndex:400,animation:"toastIn 0.2s ease",letterSpacing:"0.01em",pointerEvents:"none"}}>{toast}</div>}

        {/* Sell draft navigation guard */}
        {navConfirm && (
          <div onClick={()=>setNavConfirm(null)} style={{position:"fixed",inset:0,zIndex:600,background:"rgba(28,26,23,0.6)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
            <div onClick={e=>e.stopPropagation()} style={{maxWidth:380,width:"100%",background:C.surface,borderRadius:18,padding:"22px 22px 18px",animation:"successIn 0.25s ease"}}>
              <div style={{width:48,height:48,borderRadius:"50%",background:"#FCEEDC",border:"1px solid #E8B996",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12}}>
                <Icon name="sparkle" size={22} color="#A6601C" stroke={1.7}/>
              </div>
              <h3 style={{margin:"0 0 6px",fontSize:17,fontWeight:500,color:C.ink,fontFamily:Fb}}>¿Salir de Publicar?</h3>
              <p style={{margin:"0 0 14px",fontSize:13,color:C.text,fontFamily:Fb,fontWeight:400,lineHeight:1.5}}>Tienes una propiedad en proceso. Tu <strong style={{color:C.forest}}>borrador queda guardado</strong> automáticamente — podés volver cuando quieras y seguir donde dejaste.</p>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setNavConfirm(null)} style={{flex:1,padding:12,borderRadius:11,background:C.surface,border:`1px solid ${C.line}`,color:C.text,fontSize:12.5,fontWeight:500,cursor:"pointer",fontFamily:Fb}}>Seguir editando</button>
                <button onClick={()=>forceGo(navConfirm)} style={{flex:1.3,padding:12,borderRadius:11,background:C.ink,border:"none",color:C.surface,fontSize:12.5,fontWeight:500,cursor:"pointer",fontFamily:Fb}}>Salir (guardado)</button>
              </div>
            </div>
          </div>
        )}

        {/* Guest prompt — mini signup con nombre + WA + código (skippable) */}
        {guestPromptFor && (
          <div onClick={()=>{ if(!signupLoading) setGuestPromptFor(null); }} style={{position:"fixed",inset:0,zIndex:600,background:"rgba(28,26,23,0.6)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
            <div onClick={e=>e.stopPropagation()} style={{maxWidth:400,width:"100%",background:C.surface,borderRadius:18,padding:"22px 22px 18px",animation:"successIn 0.25s ease"}}>
              <div style={{width:54,height:54,borderRadius:"50%",margin:"0 auto 12px",background:C.brandWash,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Logo size={26}/>
              </div>
              <h3 style={{margin:"0 0 4px",fontSize:19,fontWeight:400,color:C.ink,fontFamily:Fs,letterSpacing:"-0.01em",textAlign:"center"}}>Creá tu cuenta</h3>
              <p style={{margin:"0 0 16px",fontSize:12.5,color:C.text,fontFamily:Fb,fontWeight:400,lineHeight:1.5,textAlign:"center"}}>Solo necesitamos tu nombre y WhatsApp para {guestPromptFor}.</p>

              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div>
                  <label style={{display:"block",fontSize:10.5,color:C.text,fontFamily:Fb,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:4}}>Nombre</label>
                  <input
                    type="text"
                    value={signupName}
                    onChange={e=>setSignupName(e.target.value)}
                    placeholder="Tu nombre"
                    disabled={signupLoading}
                    style={{width:"100%",padding:"11px 12px",borderRadius:10,background:C.brandWash,border:`1px solid ${C.line}`,color:C.ink,fontSize:14,fontFamily:Fb,fontWeight:400,outline:"none",boxSizing:"border-box"}}
                  />
                </div>
                <div>
                  <label style={{display:"block",fontSize:10.5,color:C.text,fontFamily:Fb,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:4}}>WhatsApp</label>
                  <input
                    type="tel"
                    value={signupWa}
                    onChange={e=>setSignupWa(e.target.value)}
                    placeholder="+56 9 1234 5678"
                    disabled={signupLoading}
                    style={{width:"100%",padding:"11px 12px",borderRadius:10,background:C.brandWash,border:`1px solid ${C.line}`,color:C.ink,fontSize:14,fontFamily:Fb,fontWeight:400,outline:"none",boxSizing:"border-box"}}
                  />
                </div>
                <div>
                  <label style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:10.5,color:C.text,fontFamily:Fb,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:4}}>
                    <span>Código verificación</span>
                    <span style={{textTransform:"none",letterSpacing:0,fontSize:10,color:C.brand,fontWeight:500}}>opcional por ahora</span>
                  </label>
                  <input
                    type="text"
                    value={signupCode}
                    onChange={e=>setSignupCode(e.target.value)}
                    placeholder="Se activa próximamente (SMS)"
                    disabled={signupLoading}
                    style={{width:"100%",padding:"11px 12px",borderRadius:10,background:C.brandWash,border:`1px dashed ${C.line}`,color:C.ink,fontSize:14,fontFamily:Fb,fontWeight:400,outline:"none",boxSizing:"border-box",opacity:0.75}}
                  />
                </div>
                {signupError && (
                  <div style={{padding:"8px 10px",borderRadius:8,background:"#FDECEC",color:"#8B2A2A",fontSize:12,fontFamily:Fb,fontWeight:500}}>{signupError}</div>
                )}
              </div>

              <div style={{display:"flex",gap:8,marginTop:14}}>
                <button
                  onClick={()=>{ if(!signupLoading) setGuestPromptFor(null); }}
                  disabled={signupLoading}
                  style={{flex:1,padding:13,borderRadius:11,background:C.surface,border:`1px solid ${C.line}`,color:C.text,fontSize:12.5,fontWeight:500,cursor:signupLoading?"default":"pointer",fontFamily:Fb,opacity:signupLoading?0.5:1}}
                >Después</button>
                <button
                  onClick={submitSignup}
                  disabled={signupLoading}
                  style={{flex:1.6,padding:13,borderRadius:11,background:C.ink,border:"none",color:C.surface,fontSize:12.5,fontWeight:500,cursor:signupLoading?"default":"pointer",fontFamily:Fb,opacity:signupLoading?0.7:1}}
                >{signupLoading?"Creando…":"Crear cuenta"}</button>
              </div>
              <div style={{marginTop:8,textAlign:"center"}}>
                <span style={{fontSize:11,color:C.text,fontFamily:Fb,fontWeight:400,opacity:0.7}}>
                  El código por SMS se activa pronto para verificar tu WhatsApp.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
