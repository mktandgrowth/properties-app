import { useState, useEffect } from "react";

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

// ── Data ──
const PROPS = [
  { id:1,type:"Departamento",price:3102,cur:"UF",loc:"Santiago Centro",comuna:"Santiago",beds:2,baths:1,parks:1,area:52,nuevo:true,amenities:["bodega","gimnasio","piscina"],title:"Edificio Centenario — 2D/1B Piso 8",desc:"Departamento nuevo con amenities completos. Orientación norte, excelente luminosidad. Cocina equipada, 1 estacionamiento incluido.",img:"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",user:"Inmobiliaria Ingevec",avatar:"IN",liked:false,saved:false,wa:"+56912345678",tags:["Nuevo","Amenities","Metro"],photos:8,hasVideo:true },
  { id:2,type:"Casa",price:8500,cur:"UF",loc:"La Reina, Santiago",comuna:"La Reina",beds:4,baths:3,parks:2,area:180,nuevo:false,amenities:["piscina","quincho","jardin","terraza"],title:"Casa mediterránea con piscina y quincho",desc:"Amplia casa familiar. Living comedor con salida a terraza, jardín con piscina, quincho y bodega. Barrio residencial consolidado.",img:"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",user:"Claudia Mendez",avatar:"CM",liked:true,saved:false,wa:"+56987654321",tags:["Piscina","Jardín","Quincho"],photos:12,hasVideo:true },
  { id:3,type:"Terreno",price:2800,cur:"UF",loc:"Chicureo, Santiago",comuna:"Chicureo",beds:0,baths:0,parks:0,area:800,nuevo:false,amenities:[],title:"Terreno plano en condominio cerrado",desc:"Con factibilidad de agua y luz. Acceso pavimentado, vigilancia 24hrs. Ideal para proyecto familiar o inversión.",img:"https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop",user:"Felipe Araya",avatar:"FA",liked:false,saved:true,wa:"+56911223344",tags:["Condominio","Factibilidad"],photos:5,hasVideo:false },
  { id:4,type:"Departamento",price:4900,cur:"UF",loc:"Ñuñoa, Santiago",comuna:"Ñuñoa",beds:3,baths:2,parks:2,area:78,nuevo:true,amenities:["terraza","gimnasio"],title:"Depto esquina con doble terraza panorámica",desc:"Último piso, vista despejada a la cordillera. Cocina equipada Bosch, 2 estacionamientos. Entrega inmediata.",img:"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",user:"Landes Inmobiliaria",avatar:"LI",liked:false,saved:false,wa:"+56955667788",tags:["Último piso","Entrega inmediata"],photos:10,hasVideo:true },
  { id:5,type:"Casa",price:12000,cur:"UF",loc:"Lo Barnechea",comuna:"Lo Barnechea",beds:5,baths:4,parks:3,area:280,nuevo:false,amenities:["piscina","quincho","jardin","terraza","bodega"],title:"Casa contemporánea — condominio premium",desc:"Triple altura en living. Cocina gourmet, sala de estar, oficina. Jardín 400m² con piscina temperada y spa.",img:"https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",user:"María José Prieto",avatar:"MP",liked:false,saved:false,wa:"+56944332211",tags:["Premium","Piscina temperada"],photos:15,hasVideo:true },
  { id:6,type:"Departamento",price:3107,cur:"UF",loc:"Estación Central",comuna:"Estación Central",beds:2,baths:1,parks:1,area:45,nuevo:true,amenities:["bodega","gimnasio","piscina"],title:"El Aromo — Depto nuevo con bodega y metro",desc:"Proyecto con piscina, gym y cowork. Bodega incluida. A 3 min caminando del metro.",img:"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",user:"Inmobiliaria Ingevec",avatar:"IN",liked:false,saved:false,wa:"+56912345678",tags:["Nuevo","Bodega","Metro"],photos:6,hasVideo:false },
  { id:7,type:"Terreno",price:1500,cur:"UF",loc:"Melipilla, RM",comuna:"Melipilla",beds:0,baths:0,parks:0,area:5000,nuevo:false,amenities:["jardin"],title:"Parcela 5.000m² — camino a la costa",desc:"Parcela con árboles frutales, pozo profundo y electricidad trifásica. A 30 min de Santiago por autopista.",img:"https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop",user:"Roberto Muñoz",avatar:"RM",liked:false,saved:false,wa:"+56977889900",tags:["5.000m²","Pozo"],photos:9,hasVideo:true },
  { id:8,type:"Casa",price:6800,cur:"UF",loc:"Providencia",comuna:"Providencia",beds:3,baths:2,parks:2,area:140,nuevo:false,amenities:["terraza","jardin","bodega"],title:"Casa remodelada en barrio Italia",desc:"Casa completamente renovada con diseño de autor. 2 pisos, patio interior, estacionamiento para 2 autos.",img:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",user:"Corredora BHP",avatar:"BH",liked:false,saved:true,wa:"+56933445566",tags:["Remodelada","Barrio Italia"],photos:11,hasVideo:true },
];

const REELS = [
  { id:1,propId:2,views:"15.2K",caption:"Recorrido casa La Reina — piscina y quincho",likes:842 },
  { id:2,propId:5,views:"28.1K",caption:"Casa premium Lo Barnechea — triple altura",likes:1523 },
  { id:3,propId:4,views:"9.8K",caption:"Doble terraza Ñuñoa — último piso con vista",likes:456 },
  { id:4,propId:8,views:"11.6K",caption:"Casa remodelada barrio Italia — diseño de autor",likes:677 },
  { id:5,propId:7,views:"6.3K",caption:"Parcela en Melipilla — tu escape de Santiago",likes:312 },
];

const CONVOS = [
  { id:1,name:"Claudia Mendez",av:"CM",prop:"Casa La Reina",last:"Perfecto, agendemos la visita",time:"1h",unread:2,sched:true,days:["Lun","Mié","Vie"],hrs:"10:00-18:00" },
  { id:2,name:"Felipe Araya",av:"FA",prop:"Terreno Chicureo",last:"El terreno tiene factibilidad al día",time:"Ayer",unread:0,sched:false,days:["Mar","Jue","Sáb"],hrs:"09:00-14:00" },
  { id:3,name:"Corredora BHP",av:"BH",prop:"Casa Barrio Italia",last:"Te envío los planos",time:"3d",unread:0,sched:false,days:["Lun-Vie"],hrs:"09:00-17:00" },
];

const PHOTO_GUIDE = [
  { s:1,l:"Fachada / Entrada",r:true,t:"Foto frontal con buena luz" },
  { s:2,l:"Living / Estar",r:true,t:"Desde la esquina, muestra amplitud" },
  { s:3,l:"Cocina",r:true,t:"Luces encendidas, mesones despejados" },
  { s:4,l:"Dormitorio principal",r:true,t:"Cama hecha, cortinas abiertas" },
  { s:5,l:"Baño principal",r:false,t:"Limpio y ordenado" },
  { s:6,l:"Vista / Terraza",r:false,t:"Desde adentro hacia afuera" },
  { s:7,l:"Segundo dormitorio",r:false,t:"Mismo estilo que el principal" },
  { s:8,l:"Estacionamiento",r:false,t:"Muestra el espacio disponible" },
];

const VID_GUIDE = [
  { n:1,t:"Gran angular — Entrada",d:"Paneo lento mostrando fachada y entrada.",icon:"aperture",dur:"8-12s" },
  { n:2,t:"Interior principal",d:"Camina por el living. Mantén estable.",icon:"house",dur:"10-15s" },
  { n:3,t:"Espacio secundario",d:"Dormitorio, cocina o segundo piso.",icon:"door",dur:"8-12s" },
  { n:4,t:"Exterior y entorno",d:"Jardín, calle. Plano abierto final.",icon:"tree",dur:"10-15s" },
];

// UF rate for CLP conversion (mock — production should pull from API)
const UF_TO_CLP = 40000;
const AMENITIES = [
  { k:"terraza",  l:"Terraza",  icon:"terrace" },
  { k:"piscina",  l:"Piscina",  icon:"pool" },
  { k:"quincho",  l:"Quincho",  icon:"grill" },
  { k:"jardin",   l:"Jardín",   icon:"tree" },
  { k:"bodega",   l:"Bodega",   icon:"storage" },
  { k:"gimnasio", l:"Gimnasio", icon:"gym" },
];

const PROP_TYPES = [
  { t:"Casa", icon:"house" },
  { t:"Departamento", icon:"building" },
  { t:"Terreno", icon:"land" },
  { t:"Parcela", icon:"mountain" },
  { t:"Local comercial", icon:"shop" },
  { t:"Oficina", icon:"briefcase" },
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
function Header({sub}) {
  return (
    <div style={{position:"sticky",top:0,zIndex:50,background:"rgba(252,251,248,0.88)",backdropFilter:"blur(20px)",padding:"14px 18px 10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <Logo size={26} />
        <div>
          <h1 style={{margin:0,fontSize:24,fontWeight:400,fontFamily:Fs,color:C.ink,letterSpacing:"-0.02em",lineHeight:1}}>properties<span style={{color:C.brand}}>.</span></h1>
          {sub&&<p style={{margin:"3px 0 0",fontSize:9,color:C.muted,fontFamily:Fb,letterSpacing:"0.14em",textTransform:"uppercase",fontWeight:500}}>{sub}</p>}
        </div>
      </div>
      <button style={{width:36,height:36,borderRadius:"50%",background:C.surface,border:`1px solid ${C.line}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
        <Icon name="bell" size={16} color={C.text} stroke={1.5} />
        <div style={{position:"absolute",top:6,right:6,width:7,height:7,borderRadius:"50%",background:C.terracotta,border:`2px solid ${C.surface}`}} />
      </button>
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
function FilterSheet({draft,setDraft,onApply,onClose,onClear,resultCount}){
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
          {/* PRICE */}
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

          {/* DORMITORIOS */}
          <Section title="Dormitorios">
            <ChipRow value={draft.beds} setValue={v=>setDraft({...draft,beds:v})} opts={[{v:1,l:"1+"},{v:2,l:"2+"},{v:3,l:"3+"},{v:4,l:"4+"},{v:5,l:"5+"}]}/>
          </Section>

          {/* BAÑOS */}
          <Section title="Baños">
            <ChipRow value={draft.baths} setValue={v=>setDraft({...draft,baths:v})} opts={[{v:1,l:"1+"},{v:2,l:"2+"},{v:3,l:"3+"},{v:4,l:"4+"}]}/>
          </Section>

          {/* ESTACIONAMIENTOS */}
          <Section title="Estacionamientos">
            <ChipRow value={draft.parks} setValue={v=>setDraft({...draft,parks:v})} opts={[{v:1,l:"1+"},{v:2,l:"2+"},{v:3,l:"3+"}]}/>
          </Section>

          {/* SUPERFICIE */}
          <Section title="Superficie (m²)">
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              {numInput(draft.areaMin,v=>setDraft({...draft,areaMin:v}),"Mín m²")}
              <span style={{color:C.subtle,fontSize:12}}>—</span>
              {numInput(draft.areaMax,v=>setDraft({...draft,areaMax:v}),"Máx m²")}
            </div>
          </Section>

          {/* CARACTERÍSTICAS (multi) */}
          <Section title="Características">
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {AMENITIES.map(a=>{
                const on=draft.amenities.includes(a.k);
                return (
                  <button key={a.k} onClick={()=>{
                    const next = on ? draft.amenities.filter(x=>x!==a.k) : [...draft.amenities,a.k];
                    setDraft({...draft,amenities:next});
                  }} style={{padding:"11px 12px",borderRadius:12,background:on?C.brandWash:C.surface,border:`1px solid ${on?C.brand:C.line}`,cursor:"pointer",display:"flex",alignItems:"center",gap:9}}>
                    <Icon name={a.icon} size={17} color={on?C.brand:C.muted} stroke={1.5}/>
                    <span style={{fontSize:12.5,fontWeight:500,color:on?C.brand:C.ink,fontFamily:Fb}}>{a.l}</span>
                    {on&&<div style={{marginLeft:"auto"}}><Icon name="check" size={13} color={C.brand} stroke={2.2}/></div>}
                  </button>
                );
              })}
            </div>
          </Section>

          {/* ESTADO */}
          <Section title="Estado">
            <div style={{display:"flex",gap:6}}>
              {[{v:"",l:"Indiferente"},{v:"nuevo",l:"Nuevo"},{v:"usado",l:"Usado"}].map(o=>{
                const on=draft.nuevo===o.v;
                return <button key={o.l} onClick={()=>setDraft({...draft,nuevo:o.v})} style={{flex:1,padding:"10px 8px",borderRadius:10,background:on?C.ink:C.surface,border:`1px solid ${on?C.ink:C.line}`,color:on?C.surface:C.text,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:Fb,letterSpacing:"0.01em"}}>{o.l}</button>;
              })}
            </div>
          </Section>
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
  currency:"UF", priceMin:"", priceMax:"",
  beds:"", baths:"", parks:"",
  areaMin:"", areaMax:"",
  amenities:[],
  nuevo:"", // "", "nuevo", "usado"
});

function Feed({props,onTap,onOpenReel}) {
  const [q,setQ]=useState("");
  const [fType,setFType]=useState("");
  const [sheet,setSheet]=useState(false);
  const [filters,setFilters]=useState(initialFilters());
  const [draft,setDraft]=useState(initialFilters());

  // Open sheet → init draft from current filters
  const openSheet=()=>{setDraft({...filters,amenities:[...filters.amenities]});setSheet(true);};
  const apply=()=>{setFilters({...draft,amenities:[...draft.amenities]});setSheet(false);};
  const clearAll=()=>setDraft(initialFilters());

  // Active filter count
  const activeCount = (
    (filters.priceMin||filters.priceMax?1:0) +
    (filters.beds?1:0) + (filters.baths?1:0) + (filters.parks?1:0) +
    (filters.areaMin||filters.areaMax?1:0) +
    filters.amenities.length +
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
      {/* Search bar */}
      <div style={{padding:"4px 14px 12px"}}>
        <div style={{position:"relative"}}>
          <div style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",display:"flex",alignItems:"center",pointerEvents:"none"}}>
            <Icon name="search" size={16} color={C.subtle} stroke={1.6}/>
          </div>
          <input type="text" placeholder="Busca por comuna, barrio o proyecto" value={q} onChange={e=>setQ(e.target.value)} style={{width:"100%",padding:"12px 50px 12px 40px",borderRadius:12,background:C.surface,border:`1px solid ${C.line}`,color:C.ink,fontSize:13,fontFamily:Fb,fontWeight:400,outline:"none",boxSizing:"border-box"}} />
          <button onClick={openSheet} style={{position:"absolute",right:6,top:"50%",transform:"translateY(-50%)",height:32,padding:"0 10px",borderRadius:8,background:activeCount>0?C.ink:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:5,color:activeCount>0?C.surface:C.muted,fontSize:11,fontWeight:500,fontFamily:Fb,letterSpacing:"0.01em"}}>
            <Icon name="sliders" size={14} color={activeCount>0?C.surface:C.muted} stroke={1.6}/>
            Filtros{activeCount>0?` · ${activeCount}`:""}
          </button>
        </div>

        {/* Type chips — horizontal scroll */}
        <div style={{display:"flex",gap:6,marginTop:11,overflowX:"auto",scrollbarWidth:"none",msOverflowStyle:"none",paddingBottom:2}}>
          <style>{`div::-webkit-scrollbar{display:none}`}</style>
          {types.map(t=>{
            const v = t==="Todos"?"":t;
            const on = fType===v;
            return <button key={t} onClick={()=>setFType(v)} style={{flexShrink:0,padding:"7px 14px",borderRadius:999,background:on?C.ink:C.surface,border:`1px solid ${on?C.ink:C.line}`,color:on?C.surface:C.text,fontSize:11.5,fontWeight:500,cursor:"pointer",fontFamily:Fb,letterSpacing:"0.01em",whiteSpace:"nowrap"}}>{t}</button>;
          })}
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

      {/* Results count */}
      <div style={{padding:"0 16px 8px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:11,color:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.02em"}}>{filtered.length} {filtered.length===1?"propiedad":"propiedades"}</span>
        <span style={{fontSize:10,color:C.subtle,fontFamily:Fb,fontWeight:500,letterSpacing:"0.08em",textTransform:"uppercase"}}>Explorar</span>
      </div>

      {/* FILTER SHEET */}
      {sheet && <FilterSheet draft={draft} setDraft={setDraft} onApply={apply} onClose={()=>setSheet(false)} onClear={clearAll} resultCount={
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
          <button onClick={()=>window.open(`https://wa.me/${p.wa}`,"_blank")} style={{flex:1,padding:14,borderRadius:12,background:C.ink,border:"none",cursor:"pointer",fontSize:13.5,fontWeight:500,color:C.surface,fontFamily:Fb,display:"flex",alignItems:"center",justifyContent:"center",gap:8,letterSpacing:"0.01em"}}>
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
function Reels({props,onLike,onSave,onOpen,startPropId}) {
  // If startPropId is provided, jump to that reel
  const startIdx = startPropId ? Math.max(0, REELS.findIndex(r=>r.propId===startPropId)) : 0;
  const [idx,setIdx]=useState(startIdx);
  const r=REELS[idx]; const p=props.find(x=>x.id===r.propId);
  const [lk,setLk]=useState(false);const [sv,setSv]=useState(false);
  useEffect(()=>{if(p){setLk(p.liked);setSv(p.saved);}},[idx,p?.liked,p?.saved]);

  const Stat = ({icon,val}) => (
    <div style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:12.5,color:C.surface,fontFamily:Fb,fontWeight:500,textShadow:"0 1px 4px rgba(0,0,0,0.7)"}}>
      <Icon name={icon} size={15} color={C.surface} stroke={1.7}/>{val}
    </div>
  );

  return (
    <div style={{height:"100vh",position:"relative",overflow:"hidden",background:"#000"}}>
      {p&&<img src={p.img} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",filter:"brightness(0.55) saturate(1.05)"}} />}
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
        <button style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <Icon name="chat" size={27} color={C.surface} stroke={1.6}/>
          <span style={{fontSize:10,color:C.surface,fontFamily:Fb,fontWeight:400,textShadow:"0 1px 4px rgba(0,0,0,0.7)"}}>Chat</span>
        </button>
        <button onClick={()=>{if(p)onSave(p.id);setSv(!sv);}} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <Icon name="bookmark" size={27} color={sv?C.brandSoft:C.surface} stroke={1.6} fill={sv?C.brandSoft:"none"}/>
          <span style={{fontSize:10,color:C.surface,fontFamily:Fb,fontWeight:400,textShadow:"0 1px 4px rgba(0,0,0,0.7)"}}>Guardar</span>
        </button>
        <button onClick={()=>{if(p)window.open(`https://wa.me/${p.wa}`,"_blank");}} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <Icon name="whatsapp" size={27} color={C.surface} stroke={1.6}/>
          <span style={{fontSize:10,color:C.surface,fontFamily:Fb,fontWeight:400,textShadow:"0 1px 4px rgba(0,0,0,0.7)"}}>WhatsApp</span>
        </button>
      </div>

      {/* Bottom info panel */}
      <div style={{position:"absolute",bottom:80,left:0,right:0,zIndex:10,padding:"0 16px"}}>
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

      <button onClick={()=>setIdx(Math.max(0,idx-1))} style={{position:"absolute",left:"50%",top:56,transform:"translateX(-50%)",background:"rgba(255,255,255,0.12)",border:"none",borderRadius:"50%",width:34,height:34,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",opacity:idx===0?0.25:0.7,zIndex:10}}>
        <Icon name="chevronUp" size={15} color={C.surface} stroke={1.8}/>
      </button>
      <button onClick={()=>setIdx(Math.min(REELS.length-1,idx+1))} style={{position:"absolute",left:"50%",top:"42%",transform:"translateX(-50%)",background:"rgba(255,255,255,0.12)",border:"none",borderRadius:"50%",width:34,height:34,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",opacity:idx===REELS.length-1?0.25:0.7,zIndex:10}}>
        <Icon name="chevronDown" size={15} color={C.surface} stroke={1.8}/>
      </button>
    </div>
  );
}

// ═══ SELL ═══
function Sell() {
  const [step,setStep]=useState(1);
  const [form,setForm]=useState({type:"",title:"",desc:"",price:"",loc:"",beds:"",baths:"",area:"",photos:[]});
  const [aiDone,setAiDone]=useState(false);
  const total=6;
  const inp={display:"block",width:"100%",padding:"11px 13px",borderRadius:10,background:C.surface,border:`1px solid ${C.line}`,color:C.ink,fontSize:13,fontFamily:Fb,fontWeight:400,outline:"none",marginTop:6,boxSizing:"border-box"};
  const lbl={fontSize:10,color:C.muted,fontFamily:Fb,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.1em"};

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
        <h3 style={{fontSize:22,fontWeight:400,color:C.ink,fontFamily:Fs,margin:"0 0 18px",letterSpacing:"-0.01em"}}>Detalles</h3>
        {[{k:"title",l:"Título",ph:"Ej: Casa 4D en La Reina con piscina"},{k:"loc",l:"Ubicación (comuna)",ph:"La Reina, Santiago"},{k:"price",l:"Precio (UF)",ph:"3.500",type:"number"},{k:"area",l:"Superficie m²",ph:"120",type:"number"}].map(({k,l,ph,type})=>(
          <div key={k} style={{marginBottom:14}}><label style={lbl}>{l}</label><input type={type||"text"} placeholder={ph} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} style={inp} /></div>
        ))}
        <div style={{display:"flex",gap:8}}>
          {[{k:"beds",l:"Dormitorios"},{k:"baths",l:"Baños"}].map(({k,l})=>(
            <div key={k} style={{flex:1}}><label style={lbl}>{l}</label><input type="number" placeholder="0" value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} style={inp} /></div>
          ))}
        </div>
        <div style={{marginTop:16}}>
          <label style={{...lbl,display:"flex",alignItems:"center",gap:5}}><Icon name="pin" size={11} color={C.muted} stroke={1.5}/>Ubicación en el mapa</label>
          <div style={{marginTop:8,borderRadius:12,border:`1px dashed ${C.brand}`,height:110,background:C.brandWash,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:6,cursor:"pointer"}}>
            <Logo size={26} />
            <span style={{fontSize:11,color:C.brand,fontFamily:Fb,fontWeight:500,letterSpacing:"0.04em"}}>Toca para marcar en el mapa</span>
          </div>
        </div>
      </div>}

      {step===3&&<div>
        <h3 style={{fontSize:22,fontWeight:400,color:C.ink,fontFamily:Fs,margin:"0 0 4px",letterSpacing:"-0.01em"}}>Sube tus fotos</h3>
        <p style={{fontSize:12,color:C.muted,fontFamily:Fb,fontWeight:400,margin:"0 0 14px"}}>Mínimo 4, máximo 15 — sigue la guía</p>
        <div style={{display:"flex",flexDirection:"column",gap:7}}>
          {PHOTO_GUIDE.map(g=>{
            const up=form.photos.includes(g.s);
            return <div key={g.s} onClick={()=>!up&&setForm({...form,photos:[...form.photos,g.s]})} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:12,background:up?C.brandWash:C.surface,border:`1px solid ${up?C.brand:C.line}`,cursor:"pointer"}}>
              <div style={{width:38,height:38,borderRadius:10,background:up?C.brand:C.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                {up?<Icon name="check" size={16} color={C.surface} stroke={2}/>:<Icon name="camera" size={16} color={C.subtle} stroke={1.5}/>}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:12.5,fontWeight:500,color:C.ink,fontFamily:Fb,display:"flex",alignItems:"center",gap:5}}>
                  {g.l}{g.r&&<span style={{color:C.terracotta,fontSize:10}}>*</span>}
                </div>
                <div style={{fontSize:11,color:C.muted,fontFamily:Fb,fontWeight:400,marginTop:1}}>{g.t}</div>
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
        {VID_GUIDE.map(g=>(
          <div key={g.n} style={{padding:14,borderRadius:12,background:C.surface,border:`1px solid ${C.line}`,display:"flex",gap:12,marginBottom:8}}>
            <div style={{width:42,height:42,borderRadius:10,background:C.brandWash,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Icon name={g.icon} size={20} color={C.brand} stroke={1.5}/>
            </div>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:12.5,fontWeight:500,color:C.ink,fontFamily:Fb}}>Toma {g.n} · {g.t}</span>
                <span style={{fontSize:10,color:C.brand,fontFamily:Fb,fontWeight:500,letterSpacing:"0.04em"}}>{g.dur}</span>
              </div>
              <p style={{margin:0,fontSize:11.5,color:C.muted,fontFamily:Fb,fontWeight:400,lineHeight:1.45}}>{g.d}</p>
            </div>
          </div>
        ))}
        <button style={{width:"100%",padding:14,borderRadius:12,marginTop:8,background:C.surface,border:`1.5px dashed ${C.brand}60`,cursor:"pointer",color:C.brand,fontSize:13,fontWeight:500,fontFamily:Fb,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <Icon name="video" size={18} color={C.brand} stroke={1.5}/>Subir video (4 tomas)
        </button>
        <div style={{marginTop:10,padding:12,borderRadius:10,background:C.brandWash,border:`1px solid ${C.line}`,display:"flex",alignItems:"center",gap:10}}>
          <Icon name="sparkle" size={16} color={C.brand} stroke={1.5}/>
          <p style={{margin:0,fontSize:11.5,color:C.text,fontFamily:Fb,fontWeight:400,lineHeight:1.4}}>La IA edita tus tomas con transiciones y música</p>
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

      {step===6&&<div style={{textAlign:"center",padding:"20px 0"}}>
        <div style={{width:68,height:68,borderRadius:"50%",margin:"0 auto 14px",background:C.mintWash,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Icon name="checkCircle" size={32} color={C.forest} stroke={1.5}/>
        </div>
        <h3 style={{fontSize:24,fontWeight:400,color:C.ink,fontFamily:Fs,margin:"0 0 6px",letterSpacing:"-0.01em"}}>Listo para publicar</h3>
        <p style={{fontSize:12,color:C.muted,fontFamily:Fb,fontWeight:400,margin:"0 0 18px"}}>Revisa el resumen antes de enviar</p>
        <div style={{padding:18,borderRadius:12,background:C.surface,border:`1px solid ${C.line}`,textAlign:"left",margin:"0 0 18px"}}>
          {[["Tipo",form.type||"Casa"],["Título",form.title||"Mi propiedad"],["Ubicación",form.loc||"Santiago"],["Precio",`UF ${form.price||"3.500"}`],["Fotos",`${form.photos.length||6}`],["Video","4 tomas (IA)"],["Texto",aiDone?"IA ✓":"Original"]].map(([k,v],i)=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:i<6?`1px solid ${C.lineSoft}`:"none"}}>
              <span style={{fontSize:11.5,color:C.muted,fontFamily:Fb,fontWeight:400,letterSpacing:"0.04em",textTransform:"uppercase"}}>{k}</span>
              <span style={{fontSize:12.5,color:C.ink,fontFamily:Fb,fontWeight:500}}>{v}</span>
            </div>
          ))}
        </div>
        <button style={{width:"100%",padding:15,borderRadius:12,background:C.forest,border:"none",cursor:"pointer",color:C.surface,fontSize:13.5,fontWeight:500,fontFamily:Fb,display:"flex",alignItems:"center",justifyContent:"center",gap:8,letterSpacing:"0.02em",boxShadow:`0 4px 14px ${C.forest}30`}}>
          Publicar propiedad<Icon name="send" size={16} color={C.surface} stroke={1.6}/>
        </button>
      </div>}

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
    </div>
  );
}

// ═══ SAVED — ordenado por prioridad (chats > guardados > likes) ═══
function SavedView({props,onTap}) {
  const [tab,setTab]=useState("chats");
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
            <div key={c.id} style={{padding:14,borderRadius:12,display:"flex",gap:12,alignItems:"center",background:C.surface,border:`1px solid ${C.line}`,cursor:"pointer",position:"relative"}}>
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

// ═══ PROFILE ═══
function Profile({props}) {
  const [gear,setGear]=useState(false);const [tab,setTab]=useState("pub");
  const menuItems=[
    {icon:"chart",l:"Estadísticas"},
    {icon:"card",l:"Pagos y plan"},
    {icon:"help",l:"Centro de ayuda"},
    {icon:"logout",l:"Cerrar sesión"},
  ];
  const stats=[
    {n:"3",l:"Likes",icon:"heart"},
    {n:"2",l:"Guardados",icon:"bookmark"},
    {n:"2",l:"Publicados",icon:"house"},
  ];
  return (
    <div style={{padding:"0 14px",paddingBottom:86}}>
      {gear&&<div style={{position:"fixed",inset:0,zIndex:200}} onClick={()=>setGear(false)}>
        <div onClick={e=>e.stopPropagation()} style={{position:"absolute",top:56,right:18,width:220,background:C.surface,borderRadius:14,border:`1px solid ${C.line}`,boxShadow:`0 12px 32px ${C.ink}15`,overflow:"hidden"}}>
          {menuItems.map((x,idx)=>(
            <div key={idx} style={{padding:"12px 16px",borderBottom:idx<3?`1px solid ${C.lineSoft}`:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:10,fontSize:13,fontFamily:Fb,fontWeight:400,color:C.ink}}
              onMouseEnter={e=>e.currentTarget.style.background=C.bg} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <Icon name={x.icon} size={16} color={C.text} stroke={1.5}/>{x.l}
            </div>
          ))}
        </div>
      </div>}
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
          <div key={s.l} style={{padding:"14px 6px",borderRadius:12,textAlign:"center",background:C.surface,border:`1px solid ${C.line}`}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:4}}>
              <Icon name={s.icon} size={15} color={C.brand} stroke={1.5}/>
            </div>
            <div style={{fontSize:20,fontWeight:400,color:C.ink,fontFamily:Fs,letterSpacing:"-0.01em"}}>{s.n}</div>
            <div style={{fontSize:9.5,color:C.muted,fontFamily:Fb,fontWeight:500,letterSpacing:"0.08em",textTransform:"uppercase",marginTop:2}}>{s.l}</div>
          </div>
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
export default function App() {
  const [tab,setTab]=useState("feed");
  const [view,setView]=useState(null);
  const [reelStart,setReelStart]=useState(null);
  const [props,setProps]=useState(PROPS);
  const like=id=>setProps(ps=>ps.map(p=>p.id===id?{...p,liked:!p.liked}:p));
  const save=id=>setProps(ps=>ps.map(p=>p.id===id?{...p,saved:!p.saved}:p));
  const open=p=>setView({t:"d",p});
  const openReel=id=>{setReelStart(id);setTab("reels");setView(null);};
  const go=id=>{setTab(id);setView(null);if(id!=="reels")setReelStart(null);};

  return (
    <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:C.bg,position:"relative",fontFamily:Fb}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
        * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        body { margin: 0; background: ${C.bg}; }
        input::placeholder, textarea::placeholder { color: ${C.subtle}; font-weight: 400; }
        input:focus, textarea:focus { border-color: ${C.brand} !important; }
      `}</style>
      {tab!=="reels"&&!view&&<Header sub={tab==="feed"?"Encuentra tu próxima propiedad":tab==="sell"?"Publica tu propiedad":tab==="saved"?"Tus guardados":tab==="profile"?"Tu perfil":"Sector inmobiliario"} />}
      {view?.t==="d"?<Detail p={props.find(x=>x.id===view.p.id)||view.p} back={()=>setView(null)} onLike={like} onSave={save} />:(
        <>
          {tab==="feed"&&<Feed props={props} onTap={open} onOpenReel={openReel} />}
          {tab==="reels"&&<Reels props={props} onLike={like} onSave={save} onOpen={open} startPropId={reelStart} />}
          {tab==="sell"&&<Sell />}
          {tab==="saved"&&<SavedView props={props} onTap={open} />}
          {tab==="profile"&&<Profile props={props} />}
        </>
      )}
      <Nav active={tab} go={go} />
    </div>
  );
}
