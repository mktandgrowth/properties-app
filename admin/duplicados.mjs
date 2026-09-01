#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// admin/duplicados.mjs — herramienta LOCAL de administración. No se importa
// nunca desde la app: vive fuera del bundle y se corre a mano con Node.
//
//   node admin/duplicados.mjs            → solo lectura (no toca nada)
//   node admin/duplicados.mjs --delete   → borra, pidiendo confirmación
//
// Credenciales: admin/.env (SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY).
// La service role key salta RLS, así que este archivo nunca se sube al repo.
// ─────────────────────────────────────────────────────────────────────────────
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const HERE = path.dirname(fileURLToPath(import.meta.url));

// ── Flags ──
const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const DO_DELETE = has("--delete");
const SOLO_DUP = has("--solo-duplicados");
const SOLO_BASURA = has("--solo-basura");
if (has("--help") || has("-h")) {
  console.log(`
Uso: node admin/duplicados.mjs [opciones]

  (sin flags)          Solo lectura: lista grupos duplicados y filas basura.
  --delete             Borra las filas marcadas (pide confirmación escrita).
  --solo-duplicados    Restringe el borrado a los duplicados.
  --solo-basura        Restringe el borrado a las filas basura (precio 0 + owner QA%).
  --help               Esta ayuda.
`);
  process.exit(0);
}

// ── Env desde admin/.env ──
function loadEnv() {
  const file = path.join(HERE, ".env");
  if (!fs.existsSync(file)) {
    console.error(`\nFalta ${file}\nCopiá admin/.env.example a admin/.env y completá las dos variables.\n`);
    process.exit(1);
  }
  const out = {};
  for (const raw of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    let v = line.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    out[line.slice(0, eq).trim()] = v;
  }
  return out;
}
const env = loadEnv();
const SUPABASE_URL = env.SUPABASE_URL || "";
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || "";
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("\nadmin/.env incompleto: hacen falta SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.\n");
  process.exit(1);
}
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });

// ── Helpers de formato ──
const norm = (s) => String(s ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
// ROL chileno = manzana-predio. Normalizamos el separador (espacio, punto,
// guion) a un solo "-" en vez de borrarlo: "1234 56" y "1234-56" son el mismo
// rol, pero "12-3456" no es "123-456".
const normRol = (s) => String(s ?? "").toUpperCase().replace(/[^0-9K]+/g, "-").replace(/^-+|-+$/g, "");
const fecha = (s) => (s ? String(s).slice(0, 16).replace("T", " ") : "sin fecha");
const money = (r) => `${r.currency || "UF"} ${Number(r.price) || 0}`;
const corto = (s, n) => { const t = String(s ?? "").replace(/\s+/g, " ").trim(); return t.length > n ? t.slice(0, n - 1) + "…" : t; };
const nombreArchivo = (u) => (u ? String(u).split("/").pop().split("?")[0] : "—");

// ── Traer todas las filas (paginado: el select trae máximo 1000 por llamada) ──
async function fetchAll(table, select) {
  const rows = [];
  const STEP = 1000;
  for (let from = 0; ; from += STEP) {
    const { data, error } = await supabase.from(table).select(select).range(from, from + STEP - 1);
    if (error) throw new Error(`${table}: ${error.message}`);
    rows.push(...(data || []));
    if (!data || data.length < STEP) break;
  }
  return rows;
}

const props = await fetchAll(
  "properties",
  "id,created_at,title,price,currency,status,rol,street,numero,comuna,loc,owner_id,video_url,video_take_urls"
);
props.sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")));

// Los perfiles se piden aparte (no por join) para no depender del nombre de la FK.
const ownerIds = [...new Set(props.map((p) => p.owner_id).filter(Boolean))];
const perfiles = new Map();
for (let i = 0; i < ownerIds.length; i += 200) {
  const { data, error } = await supabase.from("profiles").select("id,name,wa").in("id", ownerIds.slice(i, i + 200));
  if (error) throw new Error(`profiles: ${error.message}`);
  for (const p of data || []) perfiles.set(p.id, p);
}
const ownerName = (r) => perfiles.get(r.owner_id)?.name || (r.owner_id ? `(sin perfil ${String(r.owner_id).slice(0, 8)})` : "(sin owner)");

// ── Basura: precio 0 y owner tipo "QA%" ──
const esBasura = (r) => (Number(r.price) || 0) === 0 && /^qa/i.test(ownerName(r));
const basura = props.filter(esBasura);
const idsBasura = new Set(basura.map((r) => r.id));

// ── Agrupación: mismo ROL, o misma dirección+comuna, o mismo video_url ──
// Union-find: si dos filas quedan unidas por cualquiera de los tres criterios
// terminan en el mismo grupo, y así nunca proponemos borrar la misma fila dos
// veces con dos razones distintas.
const padre = new Map(props.map((p) => [p.id, p.id]));
const find = (x) => { while (padre.get(x) !== x) { padre.set(x, padre.get(padre.get(x))); x = padre.get(x); } return x; };
const union = (a, b) => { const ra = find(a), rb = find(b); if (ra !== rb) padre.set(ra, rb); };

const razonesPorFila = new Map(props.map((p) => [p.id, new Set()]));
const criterios = [
  ["ROL", (r) => (normRol(r.rol).length >= 5 ? `rol:${normRol(r.rol)}` : null)],
  ["dirección+comuna", (r) => {
    const calle = norm(`${r.street || ""} ${r.numero || ""}`) || norm(r.loc);
    const comuna = norm(r.comuna);
    return calle && comuna ? `dir:${calle}|${comuna}` : null;
  }],
  ["video", (r) => (r.video_url ? `vid:${String(r.video_url).trim()}` : null)],
];
for (const [etiqueta, clave] of criterios) {
  const buckets = new Map();
  for (const r of props) {
    const k = clave(r);
    if (!k) continue;
    if (!buckets.has(k)) buckets.set(k, []);
    buckets.get(k).push(r);
  }
  for (const filas of buckets.values()) {
    if (filas.length < 2) continue;
    for (const r of filas) { razonesPorFila.get(r.id).add(etiqueta); union(r.id, filas[0].id); }
  }
}

const porGrupo = new Map();
for (const r of props) {
  const raiz = find(r.id);
  if (!porGrupo.has(raiz)) porGrupo.set(raiz, []);
  porGrupo.get(raiz).push(r);
}
const grupos = [...porGrupo.values()]
  .filter((g) => g.length > 1)
  .map((g) => {
    const filas = [...g].sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")));
    // Conservamos la más reciente con precio > 0. Una fila basura nunca se
    // conserva. Si ninguna califica, no marcamos nada para borrar: el grupo
    // queda para revisión manual.
    const elegibles = filas.filter((r) => (Number(r.price) || 0) > 0 && !idsBasura.has(r.id));
    const keep = elegibles[0] || null;
    const razones = [...new Set(filas.flatMap((r) => [...razonesPorFila.get(r.id)]))];
    return { filas, keep, borrar: keep ? filas.filter((r) => r.id !== keep.id) : [], razones };
  })
  .sort((a, b) => b.filas.length - a.filas.length);

// ── Listado ──
const linea = (r, marca) => {
  const vid = r.video_url ? nombreArchivo(r.video_url) : (r.video_take_urls && Object.keys(r.video_take_urls).length ? "(takes)" : "sin video");
  return `   ${marca}  ${r.id}  ${fecha(r.created_at)}  ${String(money(r)).padEnd(11)}  ${corto(ownerName(r), 18).padEnd(18)}  ${corto(r.title, 34).padEnd(34)}  ${corto(vid, 30)}`;
};

console.log(`\n═══ DUPLICADOS — properties (${props.length} filas leídas) ═══`);
console.log(`Base: ${SUPABASE_URL}`);
console.log(`Modo: ${DO_DELETE ? "BORRADO" : "solo lectura"}\n`);

if (!grupos.length) {
  console.log("Sin grupos duplicados.\n");
} else {
  console.log(`── ${grupos.length} grupo(s) duplicado(s) ──`);
  console.log(`   [marca] id  fecha  precio  owner  título  video\n`);
  grupos.forEach((g, i) => {
    console.log(` Grupo ${i + 1} · ${g.filas.length} filas · coincide por: ${g.razones.join(", ")}`);
    for (const r of g.filas) {
      const marca = g.keep && r.id === g.keep.id ? "CONSERVAR" : g.keep ? "BORRAR   " : "REVISAR  ";
      console.log(linea(r, marca));
    }
    if (!g.keep) console.log("   ⚠ ninguna fila del grupo tiene precio > 0 — no se marca nada, revisar a mano.");
    console.log("");
  });
}

if (basura.length) {
  console.log(`── ${basura.length} fila(s) basura (precio 0 + owner QA%) ──\n`);
  for (const r of basura) console.log(linea(r, "BASURA   "));
  console.log("");
} else {
  console.log("── Sin filas basura (precio 0 + owner QA%) ──\n");
}

// ── Set final a borrar ──
const aBorrarDup = grupos.flatMap((g) => g.borrar);
const idsDup = new Set(aBorrarDup.map((r) => r.id));
const aBorrarBasura = basura.filter((r) => !idsDup.has(r.id));
let aBorrar = [];
if (!SOLO_BASURA) aBorrar.push(...aBorrarDup);
if (!SOLO_DUP) aBorrar.push(...aBorrarBasura);

console.log(`Resumen: ${aBorrarDup.length} duplicado(s) + ${aBorrarBasura.length} basura = ${aBorrarDup.length + aBorrarBasura.length} fila(s) borrables.`);

if (!DO_DELETE) {
  console.log(`Nada se modificó. Para borrar: node admin/duplicados.mjs --delete\n`);
  process.exit(0);
}

if (!aBorrar.length) {
  console.log("Nada para borrar con estos filtros.\n");
  process.exit(0);
}

// ── Confirmación escrita ──
const idsBorrar = new Set(aBorrar.map((r) => r.id));
const esperado = `BORRAR ${aBorrar.length}`;
console.log(`\nSe van a borrar ${aBorrar.length} fila(s) de properties (esto no se puede deshacer).`);
const respuesta = await new Promise((res) => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question(`Escribí exactamente «${esperado}» para confirmar: `, (a) => { rl.close(); res(a.trim()); });
});
if (respuesta !== esperado) {
  console.log("\nConfirmación no coincide. No se borró nada.\n");
  process.exit(1);
}

// ── Archivos de storage que quedarían huérfanos ──
// Solo podemos borrar lo que vive en el Storage de esta misma instancia de
// Supabase (.../storage/v1/object/public/<bucket>/<path>). Cualquier otro
// host (R2, CDN externo) se reporta y se deja como está.
const prefijoPublico = `${SUPABASE_URL.replace(/\/+$/, "")}/storage/v1/object/public/`;
const urlsDeFila = (r) => [r.video_url, ...Object.values(r.video_take_urls || {})].filter(Boolean).map(String);
const usadaPorSobrevivientes = new Set(props.filter((r) => !idsBorrar.has(r.id)).flatMap(urlsDeFila));
const huerfanas = [...new Set(aBorrar.flatMap(urlsDeFila))].filter((u) => !usadaPorSobrevivientes.has(u));
const borrables = [], externas = [];
for (const u of huerfanas) {
  if (!u.startsWith(prefijoPublico)) { externas.push(u); continue; }
  const resto = decodeURIComponent(u.slice(prefijoPublico.length).split("?")[0]);
  const slash = resto.indexOf("/");
  if (slash < 1) { externas.push(u); continue; }
  borrables.push({ bucket: resto.slice(0, slash), key: resto.slice(slash + 1), url: u });
}

// ── Borrado: primero las filas, después los archivos ──
console.log(`\nBorrando ${aBorrar.length} fila(s)…`);
const ids = [...idsBorrar];
let filasBorradas = 0;
for (let i = 0; i < ids.length; i += 100) {
  const lote = ids.slice(i, i + 100);
  const { error } = await supabase.from("properties").delete().in("id", lote);
  if (error) { console.error(`  ✗ lote ${i / 100 + 1}: ${error.message}`); continue; }
  filasBorradas += lote.length;
}
console.log(`  ✓ ${filasBorradas}/${ids.length} fila(s) borradas.`);

if (borrables.length) {
  console.log(`\nBorrando ${borrables.length} archivo(s) de storage sin otra fila que los use…`);
  const porBucket = new Map();
  for (const f of borrables) { if (!porBucket.has(f.bucket)) porBucket.set(f.bucket, []); porBucket.get(f.bucket).push(f.key); }
  for (const [bucket, keys] of porBucket) {
    const { error } = await supabase.storage.from(bucket).remove(keys);
    if (error) console.error(`  ✗ ${bucket}: ${error.message}`);
    else console.log(`  ✓ ${bucket}: ${keys.length} archivo(s).`);
  }
} else {
  console.log("\nNingún archivo de storage queda huérfano.");
}
if (externas.length) {
  console.log(`\n⚠ ${externas.length} video(s) viven fuera del Storage de esta instancia (R2 / CDN externo).`);
  console.log("  No se pueden borrar desde este script: se borraron solo las filas. Hay que sacarlos a mano:");
  for (const u of externas) console.log(`    ${u}`);
}
console.log("");
