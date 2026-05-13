import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════
   properties. — Sector Inmobiliario
   Refined: Fraunces (serif) + Inter (sans)
   Palette: Matte copper · Warm ivory · Warm charcoal
   ═══════════════════════════════════════════════ */

// ── Palette (refined, editorial) ──
const C = {
  brand: "#4A3122",        // very dark espresso — rich & grounded
  brandSoft: "#8F7460",    // mid cocoa
  brandWash: "#EDE4D7",    // subtle warm wash (keeps contrast vs lighter bg)
  ink: "#1C1A17",          // warm black (primary)
  inkMuted: "#3D3530",     // deep warm brown
  text: "#4A443D",         // body text
  muted: "#837A70",        // secondary text
  subtle: "#A8A096",       // tertiary / placeholder
  line: "#E4DDD1",         // hairline (slightly darker to stay visible on lighter bg)
  lineSoft: "#EFEBE3",     // ultra-soft divider
  bg: "#FCFBF8",           // very light — near-white with whisper of warmth
  surface: "#FFFFFF",      // cards
  forest: "#2D4A37",       // deep forest — trust accent
  sage: "#5A7A5F",         // muted success green
  mintWash: "#E9EFE9",     // subtle green wash
  terracotta: "#A65547",   // muted like / accent warm
};
const Fs = "'Fraunces', 'Cormorant Garamond', Georgia, serif";
const Fb = "'Inter', system-ui, -apple-system, sans-serif";

// ── Data — 3 propiedades de Valentina Sanchez ──
const SELLER = { name:"Valentina Sanchez", avatar:"VS", wa:"+56986420055" };

// Helper: build a clean wa.me URL (strips "+" and non-digits, which wa.me requires)
const waUrl = (num, msg) => `https://wa.me/${String(num||"").replace(/\D/g,"")}${msg?`?text=${encodeURIComponent(msg)}`:""}`;

const PROPS = [
  { id:1,type:"Casa",operacion:"venta",price:8500,cur:"UF",loc:"La Reina, Santiago",comuna:"La Reina",beds:4,baths:3,parks:2,area:180,areaTerreno:280,nuevo:false,amenities:["piscina","quincho","jardin","terraza","condominio","dorm_servicio","calefaccion","cerco_electrico","orient_norte"],title:"Casa mediterránea con piscina y quincho",desc:"Amplia casa familiar. Living comedor con salida a terraza, jardín con piscina, quincho y bodega. Barrio residencial consolidado.",img:"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",user:SELLER.name,avatar:SELLER.avatar,liked:false,saved:false,wa:SELLER.wa,tags:["Piscina","Jardín","Quincho"],photos:12,hasVideo:true },
  { id:2,type:"Departamento",operacion:"venta",price:4900,cur:"UF",loc:"Ñuñoa, Santiago",comuna:"Ñuñoa",beds:3,baths:2,parks:2,area:78,areaTotal:92,nuevo:true,amenities:["terraza","gimnasio","bodega","calefaccion","conserje_24","piscina_edif","orient_norte"],title:"Depto esquina con doble terraza panorámica",desc:"Último piso, vista despejada a la cordillera. Cocina equipada Bosch, 2 estacionamientos. Entrega inmediata.",img:"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",user:SELLER.name,avatar:SELLER.avatar,liked:false,saved:false,wa:SELLER.wa,tags:["Último piso","Entrega inmediata","Cordillera"],photos:10,hasVideo:true },
  { id:3,type:"Parcela",operacion:"venta",price:1500,cur:"UF",loc:"Melipilla, RM",comuna:"Melipilla",beds:0,baths:0,parks:0,area:5000,hectareas:0.5,nuevo:false,amenities:["jardin","derechos_agua","frutal"],usoSitio:"agricola",title:"Parcela 5.000m² — camino a la costa",desc:"Parcela con árboles frutales, pozo profundo y electricidad trifásica. A 30 min de Santiago por autopista.",img:"https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop",user:SELLER.name,avatar:SELLER.avatar,liked:false,saved:false,wa:SELLER.wa,tags:["5.000m²","Pozo","Frutales"],photos:9,hasVideo:true },
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
      // Orientación
      { k:"orient_norte",     l:"Orientación Norte",  icon:"sparkle", group:"orientacion" },
      { k:"orient_sur",       l:"Orientación Sur",    icon:"sparkle", group:"orientacion" },
      { k:"orient_este",      l:"Orientación Este",   icon:"sparkle", group:"orientacion" },
      { k:"orient_oeste",     l:"Orientación Oeste",  icon:"sparkle", group:"orientacion" },
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
      // Orientación
      { k:"orient_norte",     l:"Orientación Norte",  icon:"sparkle", group:"orientacion" },
      { k:"orient_sur",       l:"Orientación Sur",    icon:"sparkle", group:"orientacion" },
      { k:"orient_este",      l:"Orientación Este",   icon:"sparkle", group:"orientacion" },
      { k:"orient_oeste",     l:"Orientación Oeste",  icon:"sparkle", group:"orientacion" },
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

const fmt = n => n>=10000?`${(n/1000).toFixed(0)}K`:n.toLocaleString("es-CL");

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
    whatsapp: <><path d="M3 21l1.8-5.4A8.5 8.5 0 1112 20.5a8.4 8.4 0 01-4-1z"/><path d="M8.5 9.5c0 2.5 1.6 4.5 3.5 5.5 1.5 0.8 2.3 0.5 3-0.5 0.3-0.5 0.3-1-0.2-1.3L13 12.5c-0.4-0.3-0.8-0.2-1 0.1-0.3 0.5-0.6 0.8-1.3 0.4-1-0.6-1.6-1.4-2-2.3-0.3-0.6 0-0.9 0.4-1.2 0.3-0.2 0.4-0.6 0.1-1L8.3 7c-0.3-0.5-0.9-0.5-1.3-0.2-1 0.7-1.5 1.5-0.5 2.7z"/></>,
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
  };
  return <svg {...s} style={{display:"block",flexShrink:0}}>{paths[name]}</svg>;
};

// ── Nav ──
function Nav({active,go}) {
  const items=[
    {id:"feed",l:"Explorar",icon:"grid"},
    {id:"reels",l:"Reels",icon:"reels"},
    {id:"sell",l:"Vender",special:true},
    {id:"saved",l:"Guardados",icon:"bookmark"},
    {id:"profile",l:"Perfil",icon:"user"},
  ];
  return (
    <nav style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,zIndex:100,background:"rgba(252,251,248,0.92)",backdropFilter:"blur(20px)",borderTop:`1px solid ${C.line}`,display:"flex",justifyContent:"space-around",alignItems:"center",padding:"6px 0 env(safe-area-inset-bottom,8px)"}}>
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
  const unreadCount = NOTIFS.filter(n=>n.unread).length;
  return (
    <div style={{position:"sticky",top:0,zIndex:50,background:"rgba(252,251,248,0.88)",backdropFilter:"blur(20px)",padding:"14px 18px 10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <Logo size={26} />
        <div>
          <h1 style={{margin:0,fontSize:24,fontWeight:400,fontFamily:Fs,color:C.ink,letterSpacing:"-0.02em",lineHeight:1}}>properties<span style={{color:C.brand}}>.</span></h1>
          {sub&&<p style={{margin:"3px 0 0",fontSize:9,color:C.muted,fontFamily:Fb,letterSpacing:"0.14em",textTransform:"uppercase",fontWeight:500}}>{sub}</p>}
        </div>
      </div>
      <button onClick={()=>setOpen(!open)} style={{width:36,height:36,borderRadius:"50%",background:C.surface,border:`1px solid ${C.line}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
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

function Feed({props,onTap,onOpenReel}) {
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
      if(!p.comuna.toLowerCase().includes(s)&&!p.loc.toLowerCase().includes(s)&&!p.title.toLowerCase().includes(s))return false;
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

      {/* Mapa placeholder modal */}
      {mapInfo && (
        <div onClick={()=>setMapInfo(false)} style={{position:"fixed",inset:0,zIndex:300,background:"rgba(28,26,23,0.5)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div onClick={e=>e.stopPropagation()} style={{maxWidth:380,background:C.surface,borderRadius:18,padding:"24px 22px",textAlign:"center",animation:"slideUp 0.25s ease"}}>
            <div style={{margin:"0 auto 12px",width:56,height:56,borderRadius:"50%",background:C.brandWash,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="pin" size={26} color={C.brand} stroke={1.5}/></div>
            <h3 style={{margin:"0 0 6px",fontSize:18,fontWeight:400,color:C.ink,fontFamily:Fs,letterSpacing:"-0.01em"}}>Búsqueda por mapa</h3>
            <p style={{margin:"0 0 18px",fontSize:13,color:C.text,fontFamily:Fb,fontWeight:400,lineHeight:1.5}}>Pronto vas a poder arrastrar el mapa para encontrar propiedades en cualquier zona — estilo Airbnb.</p>
            <button onClick={()=>setMapInfo(false)} style={{padding:"11px 20px",borderRadius:12,background:C.ink,border:"none",color:C.surface,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:Fb}}>Entendido</button>
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
            <div key={p.id} onClick={()=>isReel?onOpenReel(p.id):onTap(p)} style={{...style,position:"relative",overflow:"hidden",cursor:"pointer",background:"#000"}}>
              <img src={p.img} alt={p.title} loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} />

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
                <div style={{fontSize:big?10:9,fontFamily:Fb,fontWeight:400,opacity:0.85,marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.comuna}</div>
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
                <img src={p.img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} />
                <div style={{position:"absolute",top:6,right:6,width:22,height:22,borderRadius:"50%",background:"rgba(0,0,0,0.45)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Icon name="play" size={10} color={C.surface}/>
                </div>
                <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"10px 9px 8px",background:"linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,0.8) 100%)",color:C.surface}}>
                  <div style={{fontSize:11,fontWeight:500,fontFamily:Fs,letterSpacing:"-0.01em"}}>{p.cur} {fmt(p.price)}</div>
                  <div style={{fontSize:9,fontFamily:Fb,fontWeight:400,opacity:0.85,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.comuna}</div>
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
function Detail({p,back,onLike,onSave}) {
  return (
    <div style={{paddingBottom:92,background:C.bg}}>
      <div style={{position:"relative"}}>
        <img src={p.img} alt="" style={{width:"100%",height:280,objectFit:"cover",display:"block"}} />
        <button onClick={back} style={{position:"absolute",top:14,left:14,width:38,height:38,borderRadius:"50%",background:"rgba(252,251,248,0.95)",backdropFilter:"blur(10px)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Icon name="chevronLeft" size={16} color={C.ink} stroke={1.8}/>
        </button>
        <div style={{position:"absolute",bottom:14,left:14,display:"flex",gap:6}}>
          <span style={{background:"rgba(28,26,23,0.5)",backdropFilter:"blur(10px)",borderRadius:999,padding:"5px 11px",fontSize:10.5,color:C.surface,fontFamily:Fb,fontWeight:500,display:"inline-flex",alignItems:"center",gap:5}}>
            <Icon name="camera" size={11} color={C.surface} stroke={1.6}/>{p.photos}
          </span>
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
          <Icon name="pin" size={13} color={C.muted} stroke={1.5}/>{p.loc}
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
        <div style={{borderRadius:12,overflow:"hidden",marginBottom:18,border:`1px solid ${C.line}`}}>
          <div style={{height:120,background:C.brandWash,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:6}}>
            <Logo size={30} />
            <span style={{fontSize:11,color:C.muted,fontFamily:Fb,fontWeight:400,letterSpacing:"0.06em"}}>Mapa — {p.loc}</span>
          </div>
        </div>
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
          <button onClick={()=>window.open(waUrl(p.wa,`Hola ${p.user}, vi tu publicación "${p.title}" en properties. Me interesa coordinar una visita.`),"_blank")} style={{flex:1,padding:14,borderRadius:12,background:C.ink,border:"none",cursor:"pointer",fontSize:13.5,fontWeight:500,color:C.surface,fontFamily:Fb,display:"flex",alignItems:"center",justifyContent:"center",gap:8,letterSpacing:"0.01em"}}>
            <Icon name="whatsapp" size={18} color={C.surface} stroke={1.6}/>WhatsApp
          </button>
          <button onClick={()=>onLike(p.id)} style={{width:50,height:50,borderRadius:12,background:p.liked?C.brandWash:C.surface,border:`1px solid ${p.liked?C.brand:C.line}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Icon name="heart" size={18} color={p.liked?C.terracotta:C.text} stroke={1.6} fill={p.liked?C.terracotta:"none"}/>
          </button>
          <button onClick={()=>onSave(p.id)} style={{width:50,height:50,borderRadius:12,background:p.saved?C.brandWash:C.surface,border:`1px solid ${p.saved?C.brand:C.line}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Icon name="bookmark" size={18} color={p.saved?C.brand:C.text} stroke={1.6} fill={p.saved?C.brand:"none"}/>
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══ REELS ═══
function Reels({props,onLike,onSave,onOpen,onChat,startPropId}) {
  // If startPropId is provided, jump to that reel
  const startIdx = startPropId ? Math.max(0, REELS.findIndex(r=>r.propId===startPropId)) : 0;
  const [idx,setIdx]=useState(startIdx);
  const r=REELS[idx]; const p=props.find(x=>x.id===r.propId);
  const [lk,setLk]=useState(false);const [sv,setSv]=useState(false);
  const [touchY,setTouchY]=useState(null);
  const wheelLockRef = useRef(0);
  useEffect(()=>{if(p){setLk(p.liked);setSv(p.saved);}},[idx,p?.liked,p?.saved]);

  // Navigation helpers
  const goNext = () => setIdx(i => Math.min(REELS.length-1, i+1));
  const goPrev = () => setIdx(i => Math.max(0, i-1));

  // Swipe (mobile)
  const onTS = e => setTouchY(e.touches[0].clientY);
  const onTE = e => {
    if (touchY===null) return;
    const dy = touchY - e.changedTouches[0].clientY;
    if (Math.abs(dy) > 50) (dy > 0 ? goNext : goPrev)();
    setTouchY(null);
  };
  // Wheel (desktop) — throttled
  const onWheel = e => {
    e.preventDefault();
    const now = Date.now();
    if (now - wheelLockRef.current < 600) return;
    if (Math.abs(e.deltaY) < 20) return;
    wheelLockRef.current = now;
    (e.deltaY > 0 ? goNext : goPrev)();
  };
  // Keyboard arrows (desktop)
  useEffect(()=>{
    const onKey = e => {
      if (e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); goNext(); }
      if (e.key === "ArrowUp"   || e.key === "PageUp")   { e.preventDefault(); goPrev(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const Stat = ({icon,val}) => (
    <div style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:12.5,color:C.surface,fontFamily:Fb,fontWeight:500,textShadow:"0 1px 4px rgba(0,0,0,0.7)"}}>
      <Icon name={icon} size={15} color={C.surface} stroke={1.7}/>{val}
    </div>
  );

  return (
    <div onTouchStart={onTS} onTouchEnd={onTE} onWheel={onWheel} style={{height:"100vh",position:"relative",overflow:"hidden",background:"#000",touchAction:"none"}}>
      <style>{`
        @keyframes reelIn { 0%{opacity:0;transform:scale(1.06) translateY(8px)} 100%{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes reelInfoIn { 0%{opacity:0;transform:translateY(16px)} 100%{opacity:1;transform:translateY(0)} }
      `}</style>
      {/* Background image with smooth fade transition between reels */}
      {p&&<img key={"img-"+idx} src={p.img} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",filter:"brightness(0.55) saturate(1.05)",animation:"reelIn 0.45s ease"}} />}
      <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(0,0,0,0.4) 0%,rgba(0,0,0,0) 22%,rgba(0,0,0,0) 45%,rgba(0,0,0,0.85) 100%)"}} />

      <div style={{position:"absolute",top:18,left:18,zIndex:10,display:"flex",alignItems:"center",gap:8}}>
        <Logo size={22} color={C.surface} />
        <span style={{fontSize:17,fontWeight:400,color:C.surface,fontFamily:Fs,letterSpacing:"-0.01em"}}>properties<span style={{color:C.brandSoft}}>.</span> <span style={{fontFamily:Fb,fontWeight:400,opacity:0.65,fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",marginLeft:4}}>Reels</span></span>
      </div>

      {/* Right actions — moved higher to clear the new info panel */}
      <div style={{position:"absolute",right:12,bottom:250,display:"flex",flexDirection:"column",gap:22,alignItems:"center",zIndex:10}}>
        <button onClick={()=>{if(p)onLike(p.id);setLk(!lk);}} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <Icon name="heart" size={27} color={lk?C.terracotta:C.surface} stroke={1.6} fill={lk?C.terracotta:"none"}/>
          <span style={{fontSize:10,color:C.surface,fontFamily:Fb,fontWeight:400,textShadow:"0 1px 4px rgba(0,0,0,0.7)"}}>{r.likes}</span>
        </button>
        <button onClick={()=>onChat&&onChat(p)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <Icon name="chat" size={27} color={C.surface} stroke={1.6}/>
          <span style={{fontSize:10,color:C.surface,fontFamily:Fb,fontWeight:400,textShadow:"0 1px 4px rgba(0,0,0,0.7)"}}>Chat</span>
        </button>
        <button onClick={()=>{if(p)onSave(p.id);setSv(!sv);}} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <Icon name="bookmark" size={27} color={sv?C.brandSoft:C.surface} stroke={1.6} fill={sv?C.brandSoft:"none"}/>
          <span style={{fontSize:10,color:C.surface,fontFamily:Fb,fontWeight:400,textShadow:"0 1px 4px rgba(0,0,0,0.7)"}}>Guardar</span>
        </button>
        <button onClick={()=>{if(p)window.open(waUrl(p.wa,`Hola ${p.user}, vi tu reel sobre "${p.title}" en properties. Me interesa.`),"_blank");}} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <Icon name="whatsapp" size={27} color={C.surface} stroke={1.6}/>
          <span style={{fontSize:10,color:C.surface,fontFamily:Fb,fontWeight:400,textShadow:"0 1px 4px rgba(0,0,0,0.7)"}}>WhatsApp</span>
        </button>
      </div>

      {/* Bottom info panel — animates in when reel changes */}
      <div key={"info-"+idx} style={{position:"absolute",bottom:80,left:0,right:0,zIndex:10,padding:"0 16px",animation:"reelInfoIn 0.35s ease 0.05s both"}}>
        {/* User row */}
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
          <Avatar initials={p?.avatar} size={28} bg="rgba(255,255,255,0.22)"/>
          <span style={{fontSize:12,fontWeight:500,color:C.surface,fontFamily:Fb,textShadow:"0 1px 4px rgba(0,0,0,0.7)"}}>{p?.user}</span>
          <span style={{width:3,height:3,borderRadius:"50%",background:"rgba(255,255,255,0.4)"}}/>
          <span style={{fontSize:10.5,color:"rgba(255,255,255,0.7)",fontFamily:Fb,fontWeight:400,textShadow:"0 1px 4px rgba(0,0,0,0.7)"}}>{r.views} vistas</span>
        </div>

        {/* Type chip + price + location (editorial) */}
        {p&&<>
          <div style={{display:"inline-flex",alignItems:"center",padding:"4px 10px",borderRadius:999,background:"rgba(255,255,255,0.18)",backdropFilter:"blur(10px)",border:`1px solid rgba(255,255,255,0.2)`,marginBottom:7}}>
            <span style={{fontSize:9,fontWeight:500,color:C.surface,fontFamily:Fb,letterSpacing:"0.1em",textTransform:"uppercase"}}>{p.type}</span>
          </div>
          <div style={{fontSize:24,fontWeight:400,color:C.surface,fontFamily:Fs,letterSpacing:"-0.01em",lineHeight:1.1,textShadow:"0 1px 8px rgba(0,0,0,0.6)"}}>{p.cur} {fmt(p.price)} <span style={{color:"rgba(255,255,255,0.65)",fontSize:15}}>· {p.comuna}</span></div>

          {/* Icon stats row */}
          <div style={{display:"flex",alignItems:"center",gap:16,marginTop:10}}>
            {p.beds>0&&<Stat icon="bed" val={p.beds}/>}
            {p.baths>0&&<Stat icon="bath" val={p.baths}/>}
            <Stat icon="ruler" val={`${p.area} m²`}/>
            {p.parks>0&&<Stat icon="car" val={p.parks}/>}
          </div>

          {/* Caption */}
          <p style={{fontSize:12.5,color:"rgba(255,255,255,0.9)",fontFamily:Fb,fontWeight:400,margin:"10px 0 0",lineHeight:1.45,textShadow:"0 1px 6px rgba(0,0,0,0.6)"}}>{r.caption}</p>

          {/* Ver ficha CTA — prominent */}
          <button onClick={()=>onOpen&&onOpen(p)} style={{width:"100%",marginTop:12,padding:"13px 18px",borderRadius:12,background:C.surface,border:"none",cursor:"pointer",color:C.ink,fontSize:13,fontWeight:500,fontFamily:Fb,display:"flex",alignItems:"center",justifyContent:"center",gap:8,letterSpacing:"0.02em",boxShadow:"0 6px 20px rgba(0,0,0,0.35)"}}>
            Ver ficha completa
            <Icon name="arrowRight" size={15} color={C.ink} stroke={1.8}/>
          </button>
        </>}
      </div>

      {/* Pager indicator + arrows on the LEFT side, vertically centered */}
      <div style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",display:"flex",flexDirection:"column",gap:14,alignItems:"center",zIndex:10}}>
        <button onClick={()=>setIdx(Math.max(0,idx-1))} disabled={idx===0} style={{background:"rgba(255,255,255,0.18)",backdropFilter:"blur(10px)",border:`1px solid rgba(255,255,255,0.18)`,borderRadius:"50%",width:38,height:38,cursor:idx===0?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",opacity:idx===0?0.3:1}}>
          <Icon name="chevronUp" size={16} color={C.surface} stroke={1.8}/>
        </button>
        <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"center"}}>
          {REELS.map((_,i)=>(
            <div key={i} style={{width:3,height:i===idx?16:6,borderRadius:2,background:i===idx?C.surface:"rgba(255,255,255,0.4)",transition:"all 0.2s"}}/>
          ))}
        </div>
        <button onClick={()=>setIdx(Math.min(REELS.length-1,idx+1))} disabled={idx===REELS.length-1} style={{background:"rgba(255,255,255,0.18)",backdropFilter:"blur(10px)",border:`1px solid rgba(255,255,255,0.18)`,borderRadius:"50%",width:38,height:38,cursor:idx===REELS.length-1?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",opacity:idx===REELS.length-1?0.3:1}}>
          <Icon name="chevronDown" size={16} color={C.surface} stroke={1.8}/>
        </button>
      </div>
    </div>
  );
}

// ═══ SELL ═══
function Sell() {
  const [step,setStep]=useState(1);
  const [form,setForm]=useState({
    type:"", operacion:"venta", title:"", desc:"",
    currency:"UF", price:"",
    loc:"", beds:"", baths:"", parks:"",
    area:"", areaTerreno:"", areaTotal:"", hectareas:"", privados:"",
    photos:[], videoUp:false, videoTakes:[false,false,false,false], amenities:[],
  });
  const [aiDone,setAiDone]=useState(false);
  const [uploadFor,setUploadFor]=useState(null);
  const [mapModal,setMapModal]=useState(false);
  const [locFocus,setLocFocus]=useState(false);
  const [published,setPublished]=useState(false);
  const total=6;

  const handlePublish = () => {
    // Simulate publishing — in production, POST to backend
    setPublished(true);
  };
  const resetForm = () => {
    setForm({
      type:"", operacion:"venta", title:"", desc:"",
      currency:"UF", price:"",
      loc:"", beds:"", baths:"", parks:"",
      area:"", areaTerreno:"", areaTotal:"", hectareas:"", privados:"",
      photos:[], videoUp:false, videoTakes:[false,false,false,false], amenities:[],
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
    // For photo + video-take, move to preview phase
    setUploadFor({...uploadFor, phase:"preview", tempUrl:url, tempIsVideo: uploadFor.kind==="video-take"});
    e.target.value = "";
  };

  // User confirms the captured file
  const confirmCapture = () => {
    if (!uploadFor || !uploadFor.tempUrl) return;
    if (uploadFor.kind === "photo") {
      const slot = uploadFor.slot;
      const existing = form.photoFiles || {};
      const newPhotos = form.photos.includes(slot) ? form.photos : [...form.photos, slot];
      setForm({...form, photos: newPhotos, photoFiles: {...existing, [slot]: uploadFor.tempUrl}});
    } else if (uploadFor.kind === "video-take") {
      const takes = [...(form.videoTakes || [false,false,false,false])];
      takes[uploadFor.slot - 1] = true;
      const allDone = takes.every(Boolean);
      const takeFiles = {...(form.videoTakeFiles||{}), [uploadFor.slot]: uploadFor.tempUrl};
      setForm({...form, videoTakes: takes, videoTakeFiles: takeFiles, videoUp: allDone});
    }
    setUploadFor(null);
  };

  return (
    <div style={{padding:"0 18px",paddingBottom:92}}>
      <div style={{display:"flex",gap:3,marginBottom:6}}>{Array.from({length:total}).map((_,i)=><div key={i} style={{flex:1,height:2,borderRadius:1,background:step>i?C.brand:C.line,transition:"all 0.3s"}} />)}</div>
      <p style={{fontSize:10,color:C.muted,fontFamily:Fb,fontWeight:500,margin:"0 0 18px",letterSpacing:"0.12em",textTransform:"uppercase"}}>Paso {step} de {total}</p>

      {step===1&&<div>
        <h3 style={{fontSize:22,fontWeight:400,color:C.ink,fontFamily:Fs,margin:"0 0 16px",letterSpacing:"-0.01em"}}>¿Qué vas a publicar?</h3>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {PROP_TYPES.map(({t,icon})=>(
            <button key={t} onClick={()=>{setForm({...form,type:t});setStep(2);}} style={{padding:"20px 12px",borderRadius:12,background:form.type===t?C.brandWash:C.surface,border:`1px solid ${form.type===t?C.brand:C.line}`,cursor:"pointer",textAlign:"center"}}>
              <div style={{display:"flex",justifyContent:"center",marginBottom:6}}>
                <Icon name={icon} size={26} color={form.type===t?C.brand:C.text} stroke={1.4}/>
              </div>
              <div style={{fontSize:12.5,fontWeight:500,color:form.type===t?C.brand:C.ink,fontFamily:Fb,letterSpacing:"0.01em"}}>{t}</div>
            </button>
          ))}
        </div>
      </div>}

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

        {/* Ubicación (comuna) con autocomplete */}
        <div style={{marginBottom:14,position:"relative"}}>
          <label style={lbl}>Ubicación (comuna) *</label>
          <input
            type="text"
            placeholder="Empieza a escribir tu comuna..."
            value={form.loc}
            onChange={e=>{setForm({...form,loc:e.target.value});setLocFocus(true);}}
            onFocus={()=>setLocFocus(true)}
            onBlur={()=>setTimeout(()=>setLocFocus(false),200)}
            style={inp}
          />
          {locFocus && locSugs.length>0 && (
            <div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,zIndex:100,background:C.surface,border:`1px solid ${C.line}`,borderRadius:12,boxShadow:`0 8px 24px ${C.ink}15`,maxHeight:240,overflowY:"auto"}}>
              {locSugs.map(([c,r],i)=>(
                <button key={c} onMouseDown={(e)=>{e.preventDefault();setForm({...form,loc:c});setLocFocus(false);}} style={{width:"100%",padding:"10px 13px",border:"none",background:"transparent",cursor:"pointer",display:"flex",alignItems:"center",gap:8,textAlign:"left",borderBottom:i<locSugs.length-1?`1px solid ${C.lineSoft}`:"none"}}>
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
            {sellCatalog?.showBaths && <div style={{flex:1}}><label style={lbl}>Baños</label><input type="number" placeholder="0" value={form.baths} onChange={e=>setForm({...form,baths:e.target.value})} style={inp}/></div>}
            {sellCatalog?.showParks && <div style={{flex:1}}><label style={lbl}>Estac.</label><input type="number" placeholder="0" value={form.parks} onChange={e=>setForm({...form,parks:e.target.value})} style={inp}/></div>}
          </div>
        )}

        {/* Mapa */}
        <div style={{marginBottom:18}}>
          <label style={{...lbl,display:"flex",alignItems:"center",gap:5}}><Icon name="pin" size={11} color={C.muted} stroke={1.5}/>Ubicación en el mapa</label>
          <div onClick={()=>setMapModal(true)} style={{marginTop:8,borderRadius:12,border:`1px dashed ${C.brand}`,height:100,background:C.brandWash,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:6,cursor:"pointer"}}>
            <Logo size={26} />
            <span style={{fontSize:11,color:C.brand,fontFamily:Fb,fontWeight:500,letterSpacing:"0.04em"}}>Toca para marcar el pin exacto</span>
          </div>
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
        <h3 style={{fontSize:22,fontWeight:400,color:C.ink,fontFamily:Fs,margin:"0 0 4px",letterSpacing:"-0.01em"}}>Sube tus fotos</h3>
        <p style={{fontSize:12,color:C.muted,fontFamily:Fb,fontWeight:400,margin:"0 0 14px"}}>Mínimo 4, máximo 15 — sigue la guía</p>
        <div style={{display:"flex",flexDirection:"column",gap:7}}>
          {PHOTO_GUIDE.map(g=>{
            const up=form.photos.includes(g.s);
            const previewUrl = (form.photoFiles||{})[g.s];
            return <div key={g.s} onClick={()=>setUploadFor({kind:"photo",slot:g.s,label:g.l,phase:"guide",guideData:g})} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:12,background:up?C.brandWash:C.surface,border:`1px solid ${up?C.brand:C.line}`,cursor:"pointer"}}>
              {previewUrl ? (
                <div style={{width:42,height:42,borderRadius:10,overflow:"hidden",flexShrink:0,position:"relative"}}>
                  <img src={previewUrl} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  <div style={{position:"absolute",top:2,right:2,width:14,height:14,borderRadius:"50%",background:C.brand,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <Icon name="check" size={9} color={C.surface} stroke={2.5}/>
                  </div>
                </div>
              ) : (
                <div style={{width:38,height:38,borderRadius:10,background:up?C.brand:C.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {up?<Icon name="check" size={16} color={C.surface} stroke={2}/>:<Icon name="camera" size={16} color={C.subtle} stroke={1.5}/>}
                </div>
              )}
              <div style={{flex:1}}>
                <div style={{fontSize:12.5,fontWeight:500,color:C.ink,fontFamily:Fb,display:"flex",alignItems:"center",gap:5}}>
                  {g.l}{g.r&&<span style={{color:C.terracotta,fontSize:10}}>*</span>}
                </div>
                <div style={{fontSize:11,color:C.muted,fontFamily:Fb,fontWeight:400,marginTop:1}}>{up?"Toca para cambiar":g.t}</div>
              </div>
            </div>;
          })}
        </div>
        <div style={{marginTop:12,display:"flex",alignItems:"center",gap:6,fontSize:11.5,fontFamily:Fb,fontWeight:500,color:form.photos.length>=4?C.sage:C.terracotta}}>
          {form.photos.length>=4&&<Icon name="check" size={13} color={C.sage} stroke={2}/>}
          {form.photos.length}/15 fotos {form.photos.length>=4?"":"(mínimo 4)"}
        </div>
      </div>}

      {step===4&&<div>
        <h3 style={{fontSize:22,fontWeight:400,color:C.ink,fontFamily:Fs,margin:"0 0 4px",letterSpacing:"-0.01em"}}>Graba tu video</h3>
        <p style={{fontSize:12,color:C.muted,fontFamily:Fb,fontWeight:400,margin:"0 0 14px"}}>4 tomas — la IA lo edita por ti</p>
        {VID_GUIDE.map(g=>{
          const isUp = (form.videoTakes||[])[g.n-1];
          return (
            <div key={g.n} style={{padding:14,borderRadius:12,background:isUp?C.brandWash:C.surface,border:`1px solid ${isUp?C.brand:C.line}`,display:"flex",gap:12,marginBottom:8,alignItems:"center"}}>
              <div style={{width:42,height:42,borderRadius:10,background:isUp?C.brand:C.brandWash,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Icon name={isUp?"check":g.icon} size={20} color={isUp?C.surface:C.brand} stroke={isUp?2:1.5}/>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3,gap:8}}>
                  <span style={{fontSize:12.5,fontWeight:500,color:C.ink,fontFamily:Fb}}>Toma {g.n} · {g.t}</span>
                  <span style={{fontSize:10,color:C.brand,fontFamily:Fb,fontWeight:500,letterSpacing:"0.04em",whiteSpace:"nowrap"}}>{g.dur}</span>
                </div>
                <p style={{margin:0,fontSize:11.5,color:C.muted,fontFamily:Fb,fontWeight:400,lineHeight:1.45}}>{isUp?"Grabada ✓ — toca para reemplazar":g.d}</p>
              </div>
              <button onClick={()=>setUploadFor({kind:"video-take",slot:g.n,label:`Toma ${g.n}: ${g.t}`,phase:"guide",guideData:g})} style={{padding:"8px 12px",borderRadius:8,background:isUp?C.surface:C.brand,border:isUp?`1px solid ${C.brand}`:"none",color:isUp?C.brand:C.surface,fontSize:11.5,fontWeight:500,cursor:"pointer",fontFamily:Fb,whiteSpace:"nowrap",letterSpacing:"0.02em",flexShrink:0}}>
                {isUp?"Cambiar":"Subir"}
              </button>
            </div>
          );
        })}

        {/* Progress indicator */}
        <div style={{margin:"10px 0 12px",padding:"10px 12px",borderRadius:10,background:C.bg,border:`1px solid ${C.line}`,display:"flex",alignItems:"center",gap:10}}>
          <div style={{display:"flex",gap:3,flex:1}}>
            {(form.videoTakes||[false,false,false,false]).map((up,i)=>(
              <div key={i} style={{flex:1,height:4,borderRadius:2,background:up?C.forest:C.line,transition:"all 0.25s"}}/>
            ))}
          </div>
          <span style={{fontSize:11.5,color:(form.videoTakes||[]).every(Boolean)?C.forest:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.02em"}}>
            {(form.videoTakes||[]).filter(Boolean).length}/4 tomas
          </span>
        </div>

        {/* Alternative: single full video */}
        <button onClick={()=>setUploadFor({kind:"video",slot:null,label:"video completo"})} style={{width:"100%",padding:12,borderRadius:10,marginTop:4,background:"transparent",border:`1px dashed ${C.line}`,cursor:"pointer",color:C.muted,fontSize:11.5,fontWeight:500,fontFamily:Fb,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
          <Icon name="video" size={14} color={C.muted} stroke={1.5}/>O subir un video completo (sustituye las 4 tomas)
        </button>

        <div style={{marginTop:10,padding:12,borderRadius:10,background:C.mintWash,border:`1px solid #CDDBCE`,display:"flex",alignItems:"center",gap:10}}>
          <Icon name="sparkle" size={16} color={C.forest} stroke={1.5}/>
          <p style={{margin:0,fontSize:11.5,color:C.text,fontFamily:Fb,fontWeight:400,lineHeight:1.4}}>La IA edita tus 4 tomas con transiciones y música automáticas</p>
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
          ["Fotos", `${form.photos.length||0} de 4 mínimo`],
          ["Video", form.videoUp?"Listo ✓":"Pendiente"],
          ["Texto", aiDone?"Mejorado con IA ✓":"Manual"],
        );
        return (
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <div style={{width:68,height:68,borderRadius:"50%",margin:"0 auto 14px",background:C.mintWash,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Icon name="checkCircle" size={32} color={C.forest} stroke={1.5}/>
            </div>
            <h3 style={{fontSize:24,fontWeight:400,color:C.ink,fontFamily:Fs,margin:"0 0 6px",letterSpacing:"-0.01em"}}>Listo para publicar</h3>
            <p style={{fontSize:12,color:C.muted,fontFamily:Fb,fontWeight:400,margin:"0 0 18px"}}>Revisa el resumen antes de enviar</p>
            <div style={{padding:14,borderRadius:12,background:C.surface,border:`1px solid ${C.line}`,textAlign:"left",margin:"0 0 18px"}}>
              {rows.map(([k,v],i)=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<rows.length-1?`1px solid ${C.lineSoft}`:"none"}}>
                  <span style={{fontSize:10.5,color:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.06em",textTransform:"uppercase",flexShrink:0}}>{k}</span>
                  <span style={{fontSize:12.5,color:C.ink,fontFamily:Fb,fontWeight:500,textAlign:"right",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v}</span>
                </div>
              ))}
            </div>
            <button onClick={handlePublish} style={{width:"100%",padding:15,borderRadius:12,background:C.forest,border:"none",cursor:"pointer",color:C.surface,fontSize:13.5,fontWeight:500,fontFamily:Fb,display:"flex",alignItems:"center",justifyContent:"center",gap:8,letterSpacing:"0.02em",boxShadow:`0 4px 14px ${C.forest}30`}}>
              Publicar propiedad<Icon name="send" size={16} color={C.surface} stroke={1.6}/>
            </button>
          </div>
        );
      })()}

      {step>1&&step<6&&(
        <div style={{display:"flex",gap:8,marginTop:18}}>
          <button onClick={()=>setStep(step-1)} style={{padding:"12px 18px",borderRadius:10,background:C.surface,border:`1px solid ${C.line}`,color:C.text,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:Fb,display:"flex",alignItems:"center",gap:6}}>
            <Icon name="arrowLeft" size={15} color={C.text} stroke={1.6}/>Atrás
          </button>
          <button onClick={()=>setStep(step+1)} style={{flex:1,padding:"12px 18px",borderRadius:10,background:C.ink,border:"none",color:C.surface,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:Fb,display:"flex",alignItems:"center",justifyContent:"center",gap:6,letterSpacing:"0.01em"}}>
            Siguiente<Icon name="arrowRight" size={15} color={C.surface} stroke={1.6}/>
          </button>
        </div>
      )}

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

                {/* Checklist visual */}
                {uploadFor.guideData?.tips && (
                  <div style={{marginBottom:16,padding:"12px 14px",borderRadius:12,background:C.mintWash,border:`1px solid #CDDBCE`}}>
                    <p style={{margin:"0 0 8px",fontSize:11.5,color:C.forest,fontFamily:Fb,fontWeight:600,letterSpacing:"0.04em"}}>Revisa rápido antes de continuar:</p>
                    {uploadFor.guideData.tips.slice(0,3).map((tip,i)=>(
                      <div key={i} style={{display:"flex",gap:8,fontSize:11.5,color:C.text,fontFamily:Fb,fontWeight:400,lineHeight:1.5}}>
                        <Icon name="check" size={12} color={C.forest} stroke={2.2}/>{tip}
                      </div>
                    ))}
                  </div>
                )}

                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>setUploadFor({...uploadFor,phase:"source",tempUrl:null})} style={{flex:1,padding:13,borderRadius:12,background:C.surface,border:`1px solid ${C.line}`,color:C.text,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:Fb,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                    <Icon name={uploadFor.tempIsVideo?"video":"camera"} size={14} color={C.text} stroke={1.6}/>Tomar otra
                  </button>
                  <button onClick={confirmCapture} style={{flex:1.4,padding:13,borderRadius:12,background:C.forest,border:"none",color:C.surface,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:Fb,display:"flex",alignItems:"center",justifyContent:"center",gap:6,boxShadow:`0 4px 14px ${C.forest}30`}}>
                    <Icon name="check" size={14} color={C.surface} stroke={2}/>Usar esta {uploadFor.tempIsVideo?"toma":"foto"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mapa placeholder modal (Vender step 2) */}
      {mapModal && (
        <div onClick={()=>setMapModal(false)} style={{position:"fixed",inset:0,zIndex:300,background:"rgba(28,26,23,0.5)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div onClick={e=>e.stopPropagation()} style={{maxWidth:380,background:C.surface,borderRadius:18,padding:"24px 22px",textAlign:"center",animation:"slideUp 0.25s ease"}}>
            <div style={{margin:"0 auto 12px",width:56,height:56,borderRadius:"50%",background:C.brandWash,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="pin" size={26} color={C.brand} stroke={1.5}/></div>
            <h3 style={{margin:"0 0 6px",fontSize:18,fontWeight:400,color:C.ink,fontFamily:Fs,letterSpacing:"-0.01em"}}>Marca tu propiedad</h3>
            <p style={{margin:"0 0 18px",fontSize:13,color:C.text,fontFamily:Fb,fontWeight:400,lineHeight:1.5}}>Pronto vas a poder arrastrar el pin sobre el mapa real (Google Maps) para ubicar exacto tu propiedad. Por ahora usamos la comuna que ingresaste.</p>
            <button onClick={()=>setMapModal(false)} style={{padding:"11px 20px",borderRadius:12,background:C.ink,border:"none",color:C.surface,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:Fb}}>Entendido</button>
          </div>
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
              <button onClick={()=>{resetForm();}} style={{flex:1,padding:13,borderRadius:12,background:C.ink,border:"none",color:C.surface,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:Fb}}>Ver mis publicaciones</button>
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
  const tab = subTab || "chats";
  const setTab = setSubTab || (()=>{});

  // If a chat is selected, show ChatPanel
  if (selectedChat) {
    return <ChatPanel convo={selectedChat} onBack={()=>setSelectedChat(null)}/>;
  }

  const liked=props.filter(p=>p.liked);const saved=props.filter(p=>p.saved);

  // Priority config: chats=1 (forest), guardados=2 (brand copper), likes=3 (muted warm)
  const TABS = [
    { id:"chats",    rank:1, label:"Chats",     count:CONVOS.length, color:C.forest,   wash:C.mintWash,  desc:"Conversaciones activas" },
    { id:"saved",    rank:2, label:"Guardados", count:saved.length,  color:C.brand,    wash:C.brandWash, desc:"Propiedades para revisitar" },
    { id:"likes",    rank:3, label:"Likes",     count:liked.length,  color:C.muted,    wash:"#F1EBE1",   desc:"Primera impresión" },
  ];
  const current = TABS.find(t=>t.id===tab);

  const RankDot = ({rank,color,active=false,size=20}) => (
    <div style={{width:size,height:size,borderRadius:"50%",background:active?C.surface:color,border:active?`1.5px solid ${C.surface}`:"none",color:active?color:C.surface,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.52,fontWeight:600,fontFamily:Fb,flexShrink:0,letterSpacing:"-0.02em"}}>{rank}</div>
  );

  return (
    <div style={{padding:"0 14px",paddingBottom:86}}>
      {/* Priority explainer */}
      <div style={{display:"flex",alignItems:"center",gap:7,padding:"2px 4px 12px"}}>
        <Icon name="sparkle" size={13} color={C.brand} stroke={1.6}/>
        <span style={{fontSize:11,color:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.04em"}}>
          Ordenado por tu nivel de interés
        </span>
      </div>

      {/* Priority tabs */}
      <div style={{display:"flex",gap:6,marginBottom:6}}>
        {TABS.map(t=>{
          const active = tab===t.id;
          return (
            <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"10px 6px",borderRadius:14,border:`1px solid ${active?t.color:C.line}`,background:active?t.color:C.surface,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:6,transition:"all 0.15s"}}>
              <RankDot rank={t.rank} color={t.color} active={active} size={22}/>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:1}}>
                <span style={{fontSize:11.5,fontWeight:500,color:active?C.surface:C.ink,fontFamily:Fb,letterSpacing:"0.01em"}}>{t.label}</span>
                <span style={{fontSize:9.5,fontWeight:400,color:active?"rgba(255,255,255,0.75)":C.muted,fontFamily:Fb,letterSpacing:"0.04em"}}>{t.count} {t.count===1?"ítem":"ítems"}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Current tab subtitle */}
      <div style={{display:"flex",alignItems:"center",gap:8,padding:"14px 4px 12px"}}>
        <div style={{width:5,height:5,borderRadius:"50%",background:current.color}}/>
        <span style={{fontSize:10,color:current.color,fontFamily:Fb,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase"}}>
          Prioridad {current.rank}
        </span>
        <span style={{fontSize:11,color:C.muted,fontFamily:Fb,fontWeight:400}}>· {current.desc}</span>
      </div>

      {/* CHATS (Priority 1) */}
      {tab==="chats"&&(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {CONVOS.map(c=>(
            <div key={c.id} onClick={()=>setSelectedChat&&setSelectedChat(c)} style={{padding:14,borderRadius:12,display:"flex",gap:12,alignItems:"center",background:C.surface,border:`1px solid ${C.line}`,cursor:"pointer",position:"relative"}}>
              {/* Left rank stripe */}
              <div style={{position:"absolute",left:0,top:14,bottom:14,width:3,borderRadius:"0 3px 3px 0",background:C.forest}}/>
              <Avatar initials={c.av} size={42} verified/>
              <div style={{flex:1,overflow:"hidden"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:13,fontWeight:500,color:C.ink,fontFamily:Fb}}>{c.name}</span>
                  <span style={{fontSize:10,color:C.subtle,fontFamily:Fb,fontWeight:400}}>{c.time}</span>
                </div>
                <p style={{margin:"2px 0 0",fontSize:11.5,color:C.muted,fontFamily:Fb,fontWeight:400,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.prop} — {c.last}</p>
                {c.sched&&<div style={{marginTop:6,padding:"4px 10px",borderRadius:999,background:C.mintWash,display:"inline-flex",alignItems:"center",gap:6}}>
                  <Icon name="calendar" size={11} color={C.forest} stroke={1.5}/>
                  <span style={{fontSize:10.5,color:C.forest,fontFamily:Fb,fontWeight:500,letterSpacing:"0.02em"}}>Visita — {c.days.join(", ")} · {c.hrs}</span>
                </div>}
              </div>
              {c.unread>0&&<div style={{width:18,height:18,borderRadius:"50%",background:C.forest,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9.5,fontWeight:500,color:C.surface,fontFamily:Fb}}>{c.unread}</div>}
            </div>
          ))}
          <div style={{marginTop:6,padding:14,borderRadius:12,background:C.mintWash,border:`1px solid #CDDBCE`,display:"flex",gap:10}}>
            <Icon name="sparkle" size={18} color={C.forest} stroke={1.5}/>
            <p style={{margin:0,fontSize:11.5,color:C.text,fontFamily:Fb,fontWeight:400,lineHeight:1.5}}>
              <strong style={{color:C.forest,fontWeight:500}}>Coordinación inteligente.</strong> Te preguntamos tus días y horarios disponibles. Esta info se envía automáticamente al corredor para agilizar la visita.
            </p>
          </div>
        </div>
      )}

      {/* GUARDADOS (Priority 2) / LIKES (Priority 3) — grid with rank dot on each card */}
      {tab!=="chats"&&(()=>{
        const items = tab==="likes"?liked:saved;
        const rank = current.rank;
        const rankColor = current.color;
        return (
          <>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {items.map(p=>(
                <div key={p.id} onClick={()=>onTap(p)} style={{borderRadius:12,overflow:"hidden",cursor:"pointer",background:C.surface,border:`1px solid ${C.line}`,position:"relative"}}>
                  <div style={{position:"relative"}}>
                    <img src={p.img} alt="" style={{width:"100%",height:110,objectFit:"cover",display:"block"}} />
                    {/* Rank badge top-left on image */}
                    <div style={{position:"absolute",top:6,left:6,padding:"3px 7px",borderRadius:999,background:"rgba(255,255,255,0.92)",backdropFilter:"blur(8px)",display:"inline-flex",alignItems:"center",gap:4}}>
                      <div style={{width:4,height:4,borderRadius:"50%",background:rankColor}}/>
                      <span style={{fontSize:8.5,fontWeight:600,color:rankColor,fontFamily:Fb,letterSpacing:"0.1em",textTransform:"uppercase"}}>P{rank}</span>
                    </div>
                  </div>
                  <div style={{padding:10}}>
                    <p style={{margin:0,fontSize:11,fontWeight:500,color:C.ink,fontFamily:Fb,lineHeight:1.3,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{p.title}</p>
                    <p style={{margin:"5px 0 0",fontSize:14,fontWeight:400,color:C.ink,fontFamily:Fs,letterSpacing:"-0.01em"}}>{p.cur} {fmt(p.price)}</p>
                  </div>
                </div>
              ))}
            </div>
            {!items.length&&<div style={{textAlign:"center",padding:"48px 0",color:C.muted}}>
              <div style={{margin:"0 auto 10px",width:44,height:44,borderRadius:"50%",background:current.wash,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Icon name={tab==="likes"?"heart":"bookmark"} size={20} color={rankColor} stroke={1.5}/>
              </div>
              <p style={{fontFamily:Fb,fontSize:12.5,fontWeight:400,margin:0}}>{tab==="likes"?"Dale like para guardar":"Guarda propiedades para verlas después"}</p>
            </div>}
          </>
        );
      })()}
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
function Profile({props,subTab,setSubTab,onGoTo,initialPanel,clearPanel}) {
  const [gear,setGear]=useState(false);
  const tab = subTab || "pub";
  const setTab = setSubTab || (()=>{});
  const [panel,setPanel]=useState(initialPanel||null);
  useEffect(()=>{
    if (initialPanel) { setPanel(initialPanel); clearPanel&&clearPanel(); }
  },[initialPanel]);
  const menuItems=[
    {id:"stats", icon:"chart",l:"Estadísticas"},
    {id:"pagos", icon:"card", l:"Pagos y plan"},
    {id:"ayuda", icon:"help", l:"Centro de ayuda"},
    {id:"logout",icon:"logout",l:"Cerrar sesión"},
  ];
  const liked = props.filter(p=>p.liked).length;
  const savedC = props.filter(p=>p.saved).length;
  const stats=[
    {n:String(liked),l:"Likes",icon:"heart",onClick:()=>onGoTo&&onGoTo("saved",{savedSub:"likes"})},
    {n:String(savedC),l:"Guardados",icon:"bookmark",onClick:()=>onGoTo&&onGoTo("saved",{savedSub:"saved"})},
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
          {q:"¿Cómo publico una propiedad?",a:"Toca el botón '+' al centro de la barra inferior y completa los 6 pasos del flujo Vender. Te guiamos foto por foto y video por video."},
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
          <button onClick={()=>{alert("Sesión cerrada (demo).");setPanel(null);}} style={{flex:1,padding:14,borderRadius:12,background:C.terracotta,border:"none",color:C.surface,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:Fb}}>Sí, salir</button>
        </div>
      </Sheet>}

      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:8}}>
        <button onClick={()=>setGear(!gear)} style={{width:36,height:36,borderRadius:"50%",background:C.surface,border:`1px solid ${C.line}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Icon name="gear" size={16} color={C.text} stroke={1.5}/>
        </button>
      </div>
      <div style={{textAlign:"center",marginBottom:22}}>
        <div style={{display:"inline-block",position:"relative",marginBottom:10}}>
          <Avatar initials="JC" size={72} verified/>
        </div>
        <h3 style={{fontSize:20,fontWeight:400,color:C.ink,fontFamily:Fs,margin:"0 0 3px",letterSpacing:"-0.01em"}}>Juan Carlos</h3>
        <p style={{fontSize:11.5,color:C.muted,fontFamily:Fb,fontWeight:400,margin:"0 0 8px",letterSpacing:"0.02em"}}>juan@email.com · Santiago</p>
        <div style={{display:"inline-flex",alignItems:"center",gap:5,padding:"4px 11px",borderRadius:999,background:C.mintWash,border:`1px solid #CDDBCE`}}>
          <Icon name="check" size={10} color={C.forest} stroke={2.5}/>
          <span style={{fontSize:10,fontWeight:500,color:C.forest,fontFamily:Fb,letterSpacing:"0.08em",textTransform:"uppercase"}}>Cuenta verificada</span>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:20}}>
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
          {props.slice(0,2).map(p=>(
            <div key={p.id} style={{display:"flex",gap:12,padding:12,borderRadius:12,background:C.surface,border:`1px solid ${C.line}`}}>
              <img src={p.img} alt="" style={{width:66,height:66,borderRadius:10,objectFit:"cover"}} />
              <div style={{flex:1}}>
                <p style={{margin:0,fontSize:12.5,fontWeight:500,color:C.ink,fontFamily:Fb,lineHeight:1.3}}>{p.title}</p>
                <p style={{margin:"3px 0 0",fontSize:13,color:C.ink,fontFamily:Fs,fontWeight:400}}>{p.cur} {fmt(p.price)}</p>
                <div style={{display:"flex",gap:12,marginTop:6,fontSize:10.5,color:C.muted,fontFamily:Fb,fontWeight:400}}>
                  <span style={{display:"inline-flex",alignItems:"center",gap:4}}><Icon name="eye" size={11} color={C.muted} stroke={1.5}/>1.2K</span>
                  <span style={{display:"inline-flex",alignItems:"center",gap:4}}><Icon name="chat" size={11} color={C.muted} stroke={1.5}/>8</span>
                </div>
              </div>
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
    </div>
  );
}

// ═══ MAIN ═══
// ─── Desktop sidebar nav ───
// ─── Desktop TopBar — horizontal nav, replaces the sidebar on PC ───
function TopBarDesktop({active,go,onNotif}) {
  const [notifOpen,setNotifOpen]=useState(false);
  const unreadCount = NOTIFS.filter(n=>n.unread).length;
  const items=[
    {id:"feed",l:"Explorar",icon:"grid"},
    {id:"reels",l:"Reels",icon:"reels"},
    {id:"sell",l:"Vender",icon:"plus",accent:true},
    {id:"saved",l:"Guardados",icon:"bookmark"},
    {id:"profile",l:"Perfil",icon:"user"},
  ];
  return (
    <header className="pc-topbar" style={{position:"sticky",top:0,zIndex:50,background:"rgba(252,251,248,0.92)",backdropFilter:"blur(20px)",borderBottom:`1px solid ${C.line}`,padding:"14px 28px",display:"none",alignItems:"center",justifyContent:"space-between",gap:24}}>
      {/* Logo (clickable → Explorar) */}
      <button onClick={()=>go("feed")} style={{display:"flex",alignItems:"center",gap:10,background:"transparent",border:"none",cursor:"pointer",padding:0}}>
        <Logo size={32}/>
        <div style={{textAlign:"left"}}>
          <div style={{fontSize:24,fontWeight:400,fontFamily:Fs,color:C.ink,letterSpacing:"-0.02em",lineHeight:1}}>properties<span style={{color:C.brand}}>.</span></div>
          <div style={{fontSize:8.5,color:C.muted,fontFamily:Fb,letterSpacing:"0.14em",textTransform:"uppercase",fontWeight:500,marginTop:3}}>Sector inmobiliario</div>
        </div>
      </button>

      {/* Horizontal nav */}
      <nav style={{display:"flex",alignItems:"center",gap:4}}>
        {items.map(i => {
          const on = active===i.id;
          return (
            <button key={i.id} onClick={()=>go(i.id)} style={{
              display:"flex",alignItems:"center",gap:8,padding:"9px 14px",borderRadius:10,border:"none",cursor:"pointer",
              background:on?C.brandWash:i.accent?C.ink:"transparent",
              color:on?C.brand:i.accent?C.surface:C.text,
              fontSize:13.5,fontWeight:on?600:500,fontFamily:Fb,letterSpacing:"0.01em",transition:"all 0.15s",
            }}>
              <Icon name={i.icon} size={17} color={on?C.brand:i.accent?C.surface:C.text} stroke={1.6}/>
              {i.l}
            </button>
          );
        })}
      </nav>

      {/* Right: bell + avatar */}
      <div style={{display:"flex",alignItems:"center",gap:14,position:"relative"}}>
        <button onClick={()=>setNotifOpen(!notifOpen)} style={{width:38,height:38,borderRadius:"50%",background:C.surface,border:`1px solid ${C.line}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
          <Icon name="bell" size={17} color={C.text} stroke={1.5}/>
          {unreadCount>0 && <div style={{position:"absolute",top:7,right:7,width:8,height:8,borderRadius:"50%",background:C.terracotta,border:`2px solid ${C.surface}`}}/>}
        </button>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <Avatar initials={SELLER.avatar} size={34} verified/>
          <div style={{minWidth:0}}>
            <p style={{margin:0,fontSize:12.5,fontWeight:500,color:C.ink,fontFamily:Fb,whiteSpace:"nowrap"}}>{SELLER.name.split(" ")[0]}</p>
            <p style={{margin:"1px 0 0",fontSize:9.5,color:C.muted,fontFamily:Fb,fontWeight:400,letterSpacing:"0.04em"}}>Verificada</p>
          </div>
        </div>

        {notifOpen && <>
          <div onClick={()=>setNotifOpen(false)} style={{position:"fixed",inset:0,zIndex:200,background:"transparent"}}/>
          <div style={{position:"absolute",top:50,right:0,width:320,maxWidth:"calc(100vw - 28px)",background:C.surface,borderRadius:14,border:`1px solid ${C.line}`,boxShadow:`0 12px 32px ${C.ink}18`,overflow:"hidden",zIndex:201}}>
            <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.lineSoft}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:13,fontWeight:500,color:C.ink,fontFamily:Fb}}>Notificaciones</span>
              {unreadCount>0 && <span style={{fontSize:9.5,color:C.brand,fontFamily:Fb,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase"}}>{unreadCount} nuevas</span>}
            </div>
            <div style={{maxHeight:360,overflowY:"auto"}}>
              {NOTIFS.map(n=>(
                <div key={n.id} onClick={()=>{setNotifOpen(false); onNotif&&onNotif(n);}} style={{padding:"11px 16px",display:"flex",gap:10,borderBottom:`1px solid ${C.lineSoft}`,background:n.unread?C.brandWash+"40":"transparent",cursor:"pointer"}}>
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
          </div>
        </>}
      </div>
    </header>
  );
}

export default function App() {
  const [tab,setTab]=useState("feed");
  const [view,setView]=useState(null);
  const [reelStart,setReelStart]=useState(null);
  const [savedSubTab,setSavedSubTab]=useState("chats");
  const [profileSubTab,setProfileSubTab]=useState("pub");
  const [openProfilePanel,setOpenProfilePanel]=useState(null);
  const [selectedChat,setSelectedChat]=useState(null);
  const [toast,setToast]=useState(null);
  const [props,setProps]=useState(PROPS);

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
  const like=id=>{
    setProps(ps=>ps.map(p=>p.id===id?{...p,liked:!p.liked}:p));
    const p = props.find(x=>x.id===id);
    showToast(p?.liked?"Quitado de tus likes":"Agregado a tus likes");
  };
  const save=id=>{
    setProps(ps=>ps.map(p=>p.id===id?{...p,saved:!p.saved}:p));
    const p = props.find(x=>x.id===id);
    showToast(p?.saved?"Quitado de guardados":"Guardado en tu lista");
  };
  const open=p=>setView({t:"d",p});
  const openReel=id=>{setReelStart(id);setTab("reels");setView(null);};
  const openChat=()=>{setTab("saved");setSavedSubTab("chats");setView(null);setSelectedChat(null);};
  const openConvo=convo=>{setTab("saved");setSavedSubTab("chats");setView(null);setSelectedChat(convo);};
  const go=id=>{setTab(id);setView(null);if(id!=="reels")setReelStart(null);if(id!=="saved")setSelectedChat(null);};
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
        .mob-nav { display:flex; }
        .mob-header { display: block; position: sticky; top: 0; z-index: 50; }
        .pc-only { display:none; }
        @media (min-width: 900px) {
          .mob-nav { display:none !important; }
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

      <div className="main-app" style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:C.bg,position:"relative"}}>
        <div className="mob-header">
          {tab!=="reels"&&!view&&<Header sub={tab==="feed"?"Encuentra tu próxima propiedad":tab==="sell"?"Publica tu propiedad":tab==="saved"?"Tus guardados":tab==="profile"?"Tu perfil":"Sector inmobiliario"} onNotif={onNotifAction} />}
        </div>
        <div className="pc-content">
        {view?.t==="d"?<Detail p={props.find(x=>x.id===view.p.id)||view.p} back={()=>setView(null)} onLike={like} onSave={save} />:(
          <>
            {tab==="feed"&&<Feed props={props} onTap={open} onOpenReel={openReel} />}
            {tab==="reels"&&<Reels props={props} onLike={like} onSave={save} onOpen={open} onChat={openChat} startPropId={reelStart} />}
            {tab==="sell"&&<Sell />}
            {tab==="saved"&&<SavedView props={props} onTap={open} subTab={savedSubTab} setSubTab={setSavedSubTab} selectedChat={selectedChat} setSelectedChat={setSelectedChat} />}
            {tab==="profile"&&<Profile props={props} subTab={profileSubTab} setSubTab={setProfileSubTab} onGoTo={goTo} initialPanel={openProfilePanel} clearPanel={()=>setOpenProfilePanel(null)} />}
          </>
        )}
        </div>
        <div className="mob-nav"><Nav active={tab} go={go} /></div>

        {/* Toast feedback */}
        {toast && <div style={{position:"fixed",bottom:96,left:"50%",transform:"translateX(-50%)",padding:"10px 18px",borderRadius:999,background:C.ink,color:C.surface,fontSize:12.5,fontFamily:Fb,fontWeight:500,boxShadow:"0 8px 24px rgba(28,26,23,0.3)",zIndex:400,animation:"toastIn 0.2s ease",letterSpacing:"0.01em",pointerEvents:"none"}}>{toast}</div>}
      </div>
    </div>
  );
}
