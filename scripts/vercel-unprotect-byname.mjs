/**
 * Desliga a Deployment Protection (SSO) de projetos Vercel, buscando por NOME via API.
 * Uso: node scripts/vercel-unprotect-byname.mjs nome1 nome2 ...
 * Token: VERCEL_TOKEN em .env.local. teamId: orgId do .vercel/project.json principal.
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function envVal(key) {
  if (process.env[key]) return process.env[key];
  try {
    const raw = readFileSync(join(root, ".env.local"), "utf8");
    const line = raw.split(/\r?\n/).find((l) => l.startsWith(key + "="));
    if (line) return line.slice(key.length + 1).trim().replace(/^['"]|['"]$/g, "");
  } catch {}
  return "";
}

const token = envVal("VERCEL_TOKEN");
if (!token) {
  console.error("Falta VERCEL_TOKEN em .env.local");
  process.exit(1);
}

const mainProj = JSON.parse(readFileSync(join(root, ".vercel/project.json"), "utf8"));
const teamId = mainProj.orgId;
const names = process.argv.slice(2);
const H = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

let ok = 0;
for (const name of names) {
  // Busca o projeto pelo nome (endpoint aceita o nome como id também)
  const getRes = await fetch(`https://api.vercel.com/v9/projects/${name}?teamId=${teamId}`, { headers: H });
  if (!getRes.ok) {
    console.error(`✗ ${name}: não encontrei (${getRes.status})`);
    continue;
  }
  const proj = await getRes.json();
  const patchRes = await fetch(`https://api.vercel.com/v9/projects/${proj.id}?teamId=${teamId}`, {
    method: "PATCH",
    headers: H,
    body: JSON.stringify({ ssoProtection: null }),
  });
  const txt = await patchRes.text();
  if (!patchRes.ok) {
    console.error(`✗ ${name} (${patchRes.status}): ${txt.slice(0, 160)}`);
    continue;
  }
  const j = JSON.parse(txt);
  console.log(`✓ ${j.name}: proteção desligada (ssoProtection=${JSON.stringify(j.ssoProtection)})`);
  ok++;
}
console.log(`\n${ok}/${names.length} LPs liberadas.`);
