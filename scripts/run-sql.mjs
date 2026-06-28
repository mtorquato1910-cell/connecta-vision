/**
 * Roda arquivos .sql direto no Postgres do Supabase via SUPABASE_DB_URL.
 * Uso: node scripts/run-sql.mjs <arquivo1.sql> [arquivo2.sql ...]
 * Lê segredos de .env.local (não imprime nenhum).
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function parseEnv(file) {
  const out = {};
  let raw = "";
  try {
    raw = readFileSync(join(root, file), "utf8");
  } catch {
    return out;
  }
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    out[m[1]] = v;
  }
  return out;
}

const env = parseEnv(".env.local");
const DB_URL = env.SUPABASE_DB_URL;
if (!DB_URL) {
  console.error("Falta SUPABASE_DB_URL no .env.local");
  process.exit(1);
}

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("Passe ao menos um arquivo .sql");
  process.exit(1);
}

const client = new pg.Client({
  connectionString: DB_URL,
  ssl: { rejectUnauthorized: false },
});

await client.connect();
console.log("✓ Conectado ao Postgres.");

try {
  for (const file of files) {
    const sql = readFileSync(join(root, file), "utf8");
    process.stdout.write(`\n▶ Rodando ${file} ...\n`);
    await client.query("BEGIN");
    try {
      const result = await client.query(sql);
      await client.query("COMMIT");
      const rows = Array.isArray(result) ? result : [result];
      const counts = rows.map((r) => r?.rowCount ?? 0).join(", ");
      console.log(`✓ OK. Linhas afetadas por statement: [${counts}]`);
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    }
  }
  console.log("\n✅ Todos os SQLs rodaram com sucesso.");
} catch (e) {
  console.error(`✗ ERRO: ${e.message}`);
  process.exitCode = 1;
} finally {
  await client.end();
}
