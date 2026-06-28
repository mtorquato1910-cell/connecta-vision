/**
 * Exporta o catálogo do Supabase para JSON estático do bundle.
 *
 * Lê `produtos` e `categorias` do Supabase (conteúdo em PT-BR + imagens no
 * Storage) e regenera `src/data/produtos.json` e `src/data/categorias.json`
 * no MESMO formato que o site-data.ts já consome.
 *
 * Esses JSON são lidos em loaders SSR-safe (sem chamar Supabase no servidor),
 * deixando o catálogo indexável no HTML cru.
 *
 * Uso:  node scripts/export-catalog-json.mjs
 * Credenciais: .env.local  (SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ─── .env.local (parser que respeita aspas) ──────────────────────────────────
function loadEnv(file) {
  const out = {};
  let raw;
  try {
    raw = readFileSync(file, "utf8");
  } catch {
    return out;
  }
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    // remove aspas envolventes (simples ou duplas)
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

const env = { ...loadEnv(resolve(ROOT, ".env.local")), ...process.env };

const SUPABASE_URL = env.SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error(
    "[export-catalog] Faltam credenciais. Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY em .env.local.",
  );
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ─── Normalizadores ──────────────────────────────────────────────────────────

function asStringArray(v) {
  if (!Array.isArray(v)) return [];
  return v.filter((x) => typeof x === "string" && x.length > 0);
}

/** especificacoes no banco: [{label, valor}] → JSON do site: [{chave, valor}] */
function toEspecificacoes(v) {
  if (!Array.isArray(v)) return [];
  const out = [];
  for (const x of v) {
    if (!x || typeof x !== "object") continue;
    const chave = x.chave ?? x.label ?? "";
    const valor = x.valor ?? "";
    if (chave === "" && valor === "") continue;
    out.push({ chave: String(chave), valor: String(valor) });
  }
  return out;
}

/** galeria no banco: string[] → JSON do site: [{url, ordem, alt}] */
function toGaleria(v, nome) {
  const urls = asStringArray(v);
  return urls.map((url, i) => ({
    url,
    ordem: i,
    alt: `${nome} - imagem ${i + 1}`,
  }));
}

function capaAjusteOrNull(v) {
  if (!v || typeof v !== "object" || Array.isArray(v)) return null;
  if (Object.keys(v).length === 0) return null;
  return v;
}

// ─── Export ──────────────────────────────────────────────────────────────────

async function main() {
  // Categorias
  const { data: catsRaw, error: catsErr } = await sb
    .from("categorias")
    .select("id, slug, nome, numero, ordem, destaque, descricao")
    .order("ordem", { ascending: true });
  if (catsErr) throw new Error(`categorias: ${catsErr.message}`);

  // Produtos (com categoria embutida para slug/nome)
  const { data: prodsRaw, error: prodsErr } = await sb
    .from("produtos")
    .select(
      "id, slug, modelo, nome, categoria_id, imagem_url, galeria, resumo, descricao, diferenciais, aplicacoes, especificacoes, capa_ajuste, marca, subcategoria, configuracoes, url_fabricante, destaque, publicado, ordem, categoria:categorias(slug, nome)",
    )
    .order("ordem", { ascending: true });
  if (prodsErr) throw new Error(`produtos: ${prodsErr.message}`);

  const cats = catsRaw ?? [];
  const prods = prodsRaw ?? [];

  // Mapa id → categoria (slug/nome) como fallback caso o embed venha vazio.
  const catById = new Map(cats.map((c) => [c.id, c]));

  // ── categorias.json (shape CategoriaRaw do site-data) ──
  const categoriasJson = cats.map((c) => ({
    id: c.slug, // o site-data usa o id apenas como referência; slug é o estável
    slug: c.slug,
    nome: c.nome,
    descricao_curta: c.descricao ?? "",
    numero: c.numero,
    ordem: c.ordem ?? 0,
    destaque: c.destaque ?? false,
    fonte_aba: "",
  }));

  // ── produtos.json (shape ProdutoRaw do site-data) ──
  const produtosJson = prods.map((p) => {
    const cat = Array.isArray(p.categoria) ? p.categoria[0] : p.categoria;
    const catFallback = catById.get(p.categoria_id);
    const categoria_slug = cat?.slug ?? catFallback?.slug ?? "";
    const categoria_nome = cat?.nome ?? catFallback?.nome ?? "";

    const galeria = toGaleria(p.galeria, p.nome);
    const imagem_principal = p.imagem_url ?? galeria[0]?.url ?? null;

    return {
      id: p.slug,
      slug: p.slug,
      categoria_id: categoria_slug, // site-data espera categoria_id == slug
      categoria_slug,
      categoria_nome,
      modelo: p.modelo ?? null,
      nome: p.nome,
      marca: p.marca ?? "SHINOVA",
      subcategoria: p.subcategoria ?? null,
      descricao_curta: p.resumo ?? null,
      descricao_longa: p.descricao ?? null,
      diferenciais: asStringArray(p.diferenciais),
      aplicacoes: asStringArray(p.aplicacoes),
      especificacoes: toEspecificacoes(p.especificacoes),
      configuracoes: p.configuracoes ?? null,
      imagem_principal,
      galeria,
      capa_ajuste: capaAjusteOrNull(p.capa_ajuste),
      url_fabricante: p.url_fabricante ?? null,
      destaque: p.destaque ?? false,
      publicado: p.publicado ?? true,
    };
  });

  const catPath = resolve(ROOT, "src/data/categorias.json");
  const prodPath = resolve(ROOT, "src/data/produtos.json");
  writeFileSync(catPath, JSON.stringify(categoriasJson, null, 2) + "\n", "utf8");
  writeFileSync(prodPath, JSON.stringify(produtosJson, null, 2) + "\n", "utf8");

  const publicados = produtosJson.filter((p) => p.publicado !== false).length;
  console.log(
    `[export-catalog] OK: ${categoriasJson.length} categorias, ${produtosJson.length} produtos (${publicados} publicados).`,
  );
  console.log(`  → ${catPath}`);
  console.log(`  → ${prodPath}`);
}

main().catch((err) => {
  console.error("[export-catalog] FALHOU:", err.message);
  process.exit(1);
});
