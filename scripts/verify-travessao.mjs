import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const raw = readFileSync(join(root, ".env.local"), "utf8");
const line = raw.split(/\r?\n/).find((l) => l.startsWith("SUPABASE_DB_URL="));
const url = line.slice("SUPABASE_DB_URL=".length).trim().replace(/^['"]|['"]$/g, "");

const c = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
await c.connect();

const dash = "—"; // travessão —
const q = async (label, sql) => {
  const r = await c.query(sql, [`%${dash}%`]);
  console.log(label.padEnd(42), r.rows[0].n);
};

await q(
  "produtos com travessao",
  "select count(*) n from produtos where nome like $1 or resumo like $1 or descricao like $1 or diferenciais::text like $1 or aplicacoes::text like $1 or especificacoes::text like $1",
);
await q("categorias com travessao", "select count(*) n from categorias where nome like $1 or descricao like $1");
await q("blog_posts com travessao", "select count(*) n from blog_posts where titulo like $1 or resumo like $1 or conteudo like $1");
await q("eventos com travessao", "select count(*) n from eventos where nome like $1 or descricao_curta like $1 or descricao_longa like $1");

await c.end();
console.log("\nSe tudo = 0, o banco esta limpo de travessao.");
