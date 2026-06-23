/**
 * Seed do catálogo (categorias + produtos) no Supabase a partir dos JSONs
 * da planilha Shinova (src/data/*.json). Idempotente via upsert(onConflict: slug).
 *
 * Uso:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-catalog.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Faltam SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY no ambiente.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const categoriasRaw = JSON.parse(readFileSync(join(root, "src/data/categorias.json"), "utf8"));
const produtosRaw = JSON.parse(readFileSync(join(root, "src/data/produtos.json"), "utf8"));

// Primeira imagem de produto por categoria (capa)
const firstImgByCat = {};
for (const p of produtosRaw) {
  if (p.imagem_principal && !firstImgByCat[p.categoria_slug]) {
    firstImgByCat[p.categoria_slug] = p.imagem_principal;
  }
}

// ─── Categorias ───────────────────────────────────────────────────────────────
const categoriasRows = categoriasRaw
  .slice()
  .sort((a, b) => a.ordem - b.ordem)
  .map((c) => ({
    slug: c.slug,
    nome: c.nome,
    numero: c.numero,
    descricao: c.descricao_curta ?? null,
    imagem_url: firstImgByCat[c.slug] ?? null,
    ordem: c.ordem ?? 0,
  }));

console.log(`Inserindo ${categoriasRows.length} categorias...`);
{
  const { error } = await supabase
    .from("categorias")
    .upsert(categoriasRows, { onConflict: "slug" });
  if (error) {
    console.error("Erro categorias:", error.message);
    process.exit(1);
  }
}

// Mapa slug → id
const { data: catIds, error: catErr } = await supabase
  .from("categorias")
  .select("id, slug");
if (catErr) {
  console.error("Erro lendo ids de categorias:", catErr.message);
  process.exit(1);
}
const idBySlug = Object.fromEntries(catIds.map((c) => [c.slug, c.id]));

// ─── Produtos ─────────────────────────────────────────────────────────────────
const seen = new Set();
const produtosRows = [];
produtosRaw.forEach((p, i) => {
  if (seen.has(p.slug)) return; // dedupe por slug
  seen.add(p.slug);
  const categoria_id = idBySlug[p.categoria_slug];
  if (!categoria_id) {
    console.warn(`  ! produto ${p.slug} sem categoria (${p.categoria_slug}) — pulado`);
    return;
  }
  const galeria = (p.galeria ?? [])
    .slice()
    .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))
    .map((g) => g.url)
    .filter(Boolean);

  produtosRows.push({
    slug: p.slug,
    modelo: p.modelo ?? p.nome,
    nome: p.nome,
    categoria_id,
    imagem_url: p.imagem_principal ?? galeria[0] ?? null,
    resumo: p.descricao_curta ?? null,
    descricao: p.descricao_longa ?? p.descricao_curta ?? null,
    galeria,
    diferenciais: [],
    aplicacoes: p.subcategoria ? [p.subcategoria] : [],
    especificacoes: (p.especificacoes ?? []).map((e) => ({
      label: e.chave,
      valor: e.valor,
    })),
    marca: p.marca ?? null,
    subcategoria: p.subcategoria ?? null,
    configuracoes: p.configuracoes ?? null,
    url_fabricante: p.url_fabricante ?? null,
    destaque: !!p.destaque,
    publicado: p.publicado !== false,
    ordem: i,
  });
});

console.log(`Inserindo ${produtosRows.length} produtos...`);
// Upsert em lotes de 100
for (let i = 0; i < produtosRows.length; i += 100) {
  const batch = produtosRows.slice(i, i + 100);
  const { error } = await supabase.from("produtos").upsert(batch, { onConflict: "slug" });
  if (error) {
    console.error(`Erro produtos lote ${i}:`, error.message);
    process.exit(1);
  }
  console.log(`  lote ${i / 100 + 1}: ${batch.length} ok`);
}

// ─── Resumo ───────────────────────────────────────────────────────────────────
const { count: nCat } = await supabase.from("categorias").select("id", { count: "exact", head: true });
const { count: nProd } = await supabase.from("produtos").select("id", { count: "exact", head: true });
console.log(`\n✓ Seed concluído. categorias=${nCat} produtos=${nProd}`);
