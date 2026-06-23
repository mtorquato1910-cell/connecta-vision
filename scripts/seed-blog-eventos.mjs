/**
 * Seed de blog_posts + eventos no Supabase a partir dos JSONs de mock.
 * Idempotente via upsert(onConflict: slug).
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-blog-eventos.mjs
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
  console.error("Faltam SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const blog = JSON.parse(readFileSync(join(root, "src/data/blog-posts.json"), "utf8"));
const eventos = JSON.parse(readFileSync(join(root, "src/data/eventos.json"), "utf8"));

const blogRows = blog.map((p) => ({
  slug: p.slug,
  titulo: p.titulo,
  resumo: p.resumo ?? "",
  conteudo: p.conteudo ?? "",
  capa_url: p.capa_url ?? null,
  video_url: p.video_url ?? null,
  autor_nome: p.autor_nome ?? "",
  autor_email: p.autor_email ?? "",
  tags: p.tags ?? [],
  status: p.status ?? "pendente",
  origem: p.origem ?? "publico",
  motivo_rejeicao: p.motivo_rejeicao ?? null,
  publicado_em: p.publicado_em ?? null,
  created_at: p.criado_em ?? undefined,
}));

const eventoRows = eventos.map((e, i) => ({
  slug: e.slug,
  nome: e.nome,
  data_evento: e.data_evento ?? null,
  local: e.local ?? null,
  descricao_curta: e.descricao_curta ?? null,
  descricao_longa: e.descricao_longa ?? null,
  capa_url: e.capa_url ?? null,
  galeria: e.galeria ?? [],
  publicado: e.publicado !== false,
  ordem: e.ordem ?? i,
}));

console.log(`Inserindo ${blogRows.length} posts de blog...`);
{
  const { error } = await supabase.from("blog_posts").upsert(blogRows, { onConflict: "slug" });
  if (error) {
    console.error("Erro blog:", error.message);
    process.exit(1);
  }
}

console.log(`Inserindo ${eventoRows.length} eventos...`);
{
  const { error } = await supabase.from("eventos").upsert(eventoRows, { onConflict: "slug" });
  if (error) {
    console.error("Erro eventos:", error.message);
    process.exit(1);
  }
}

const { count: nBlog } = await supabase.from("blog_posts").select("id", { count: "exact", head: true });
const { count: nEvt } = await supabase.from("eventos").select("id", { count: "exact", head: true });
console.log(`\n✓ Seed concluído. blog_posts=${nBlog} eventos=${nEvt}`);
