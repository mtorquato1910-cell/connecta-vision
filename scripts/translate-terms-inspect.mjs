import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

function loadEnv(path) {
  const txt = readFileSync(path, "utf8");
  const env = {};
  for (const line of txt.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    env[m[1]] = v;
  }
  return env;
}

const env = loadEnv(new URL("../.env.local", import.meta.url));
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const { data, error } = await supabase
  .from("produtos")
  .select("id, aplicacoes, subcategoria");

if (error) {
  console.error("ERROR:", error);
  process.exit(1);
}

console.log("TOTAL PRODUTOS:", data.length);

const apps = new Set();
const subs = new Set();
for (const row of data) {
  if (Array.isArray(row.aplicacoes)) {
    for (const a of row.aplicacoes) if (a != null) apps.add(String(a));
  }
  if (row.subcategoria != null) subs.add(String(row.subcategoria));
}

const all = new Set([...apps, ...subs]);
console.log("DISTINCT aplicacoes count:", apps.size);
console.log("DISTINCT subcategoria count:", subs.size);
console.log("DISTINCT TOTAL (union) count:", all.size);
console.log("=== ALL DISTINCT VALUES (sorted) ===");
for (const v of [...all].sort((a, b) => a.localeCompare(b))) {
  console.log(JSON.stringify(v));
}
