/**
 * Migra as imagens dos produtos (e capas de categoria) do shinova.com para o
 * Supabase Storage (bucket `produtos`) e atualiza imagem_url/galeria no banco.
 *
 * Idempotente: URLs que já apontam para o Supabase são puladas; upload é upsert.
 * Resiliente: download que falha mantém a URL antiga e segue.
 *
 * Uso: node scripts/migrate-images.mjs [--limit N] [--no-galeria]
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
function env(k) {
  if (process.env[k]) return process.env[k];
  const r = readFileSync(join(root, ".env.local"), "utf8");
  const l = r.split(/\r?\n/).find((x) => x.startsWith(k + "="));
  return l ? l.slice(k.length + 1).trim().replace(/^['"]|['"]$/g, "") : "";
}

const SUPABASE_URL = env("SUPABASE_URL");
const SERVICE_KEY = env("SUPABASE_SERVICE_ROLE_KEY");
const BUCKET = "produtos";
const sb = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

const args = process.argv.slice(2);
const LIMIT = args.includes("--limit") ? Number(args[args.indexOf("--limit") + 1]) : Infinity;
const DO_GALERIA = !args.includes("--no-galeria");

const isSupabase = (u) => typeof u === "string" && u.includes("/storage/v1/object/public/");
const isExternal = (u) => typeof u === "string" && /^https?:\/\//i.test(u) && !isSupabase(u);

function extOf(url) {
  const m = url.split("?")[0].match(/\.(jpe?g|png|webp|gif)(?=$|[^a-z])/i);
  return (m ? m[1] : "jpg").toLowerCase().replace("jpeg", "jpg");
}
function ctOf(ext) {
  return ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : ext === "gif" ? "image/gif" : "image/jpeg";
}

const cache = new Map(); // url externa -> url supabase (dedupe global)

async function migrateUrl(slug, url) {
  if (!isExternal(url)) return url; // já é supabase ou inválida
  if (cache.has(url)) return cache.get(url);
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 ConectaBot" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 100) throw new Error("arquivo vazio");
    const ext = extOf(url);
    const hash = createHash("sha1").update(url).digest("hex").slice(0, 12);
    const path = `${slug}/${hash}.${ext}`;
    const { error } = await sb.storage.from(BUCKET).upload(path, buf, {
      contentType: ctOf(ext),
      upsert: true,
    });
    if (error) throw new Error("upload: " + error.message);
    const { data } = sb.storage.from(BUCKET).getPublicUrl(path);
    cache.set(url, data.publicUrl);
    return data.publicUrl;
  } catch (e) {
    console.warn(`   ! ${slug}: falha em ${url.slice(0, 60)} (${e.message}) — mantém antiga`);
    return url; // mantém a URL antiga
  }
}

// ─── Produtos ────────────────────────────────────────────────────────────────
const { data: produtos, error } = await sb
  .from("produtos")
  .select("id, slug, imagem_url, galeria")
  .order("ordem");
if (error) {
  console.error("Erro lendo produtos:", error.message);
  process.exit(1);
}

let done = 0,
  changed = 0,
  imgs = 0;
const total = Math.min(produtos.length, LIMIT);
console.log(`Migrando imagens de ${total} produtos (galeria=${DO_GALERIA})...`);

for (const p of produtos.slice(0, LIMIT)) {
  const novaPrincipal = p.imagem_url ? await migrateUrl(p.slug, p.imagem_url) : p.imagem_url;
  let novaGaleria = Array.isArray(p.galeria) ? p.galeria : [];
  if (DO_GALERIA && novaGaleria.length) {
    novaGaleria = await Promise.all(novaGaleria.map((u) => migrateUrl(p.slug, u)));
  }
  const mudou =
    novaPrincipal !== p.imagem_url ||
    JSON.stringify(novaGaleria) !== JSON.stringify(p.galeria);
  if (mudou) {
    const { error: upErr } = await sb
      .from("produtos")
      .update({ imagem_url: novaPrincipal, galeria: novaGaleria })
      .eq("id", p.id);
    if (upErr) console.warn(`   ! ${p.slug}: update falhou (${upErr.message})`);
    else changed++;
  }
  done++;
  imgs = cache.size;
  if (done % 10 === 0 || done === total)
    console.log(`  ${done}/${total} produtos | ${changed} atualizados | ${imgs} imagens no storage`);
}

// ─── Capas de categoria ──────────────────────────────────────────────────────
const { data: cats } = await sb.from("categorias").select("id, slug, imagem_url");
let catChanged = 0;
for (const c of cats || []) {
  if (!isExternal(c.imagem_url)) continue;
  const nova = await migrateUrl(`cat-${c.slug}`, c.imagem_url);
  if (nova !== c.imagem_url) {
    await sb.from("categorias").update({ imagem_url: nova }).eq("id", c.id);
    catChanged++;
  }
}

console.log(`\n✅ Concluído. produtos atualizados=${changed}, categorias=${catChanged}, imagens no storage=${cache.size}`);
