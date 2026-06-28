/**
 * Desliga a Deployment Protection (SSO) de 1+ projetos Vercel.
 * Uso: node scripts/vercel-unprotect.mjs <pasta1> [pasta2 ...]
 * Cada pasta precisa ter .vercel/project.json (criado pelo `vercel deploy`).
 * Token: lê VERCEL_TOKEN de .env.local (crie em vercel.com/account/tokens).
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
  console.error("Falta VERCEL_TOKEN (em .env.local). Crie em https://vercel.com/account/tokens");
  process.exit(1);
}

const dirs = process.argv.slice(2);
if (dirs.length === 0) {
  console.error("Passe ao menos uma pasta de projeto (com .vercel/project.json).");
  process.exit(1);
}

let ok = 0;
for (const dir of dirs) {
  let proj;
  try {
    proj = JSON.parse(readFileSync(join(dir, ".vercel/project.json"), "utf8"));
  } catch {
    console.error(`✗ ${dir}: sem .vercel/project.json (faça o deploy antes).`);
    continue;
  }
  const url = `https://api.vercel.com/v9/projects/${proj.projectId}?teamId=${proj.orgId}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ ssoProtection: null }),
  });
  const txt = await res.text();
  if (!res.ok) {
    console.error(`✗ ${dir} (${res.status}): ${txt.slice(0, 200)}`);
    continue;
  }
  const j = JSON.parse(txt);
  console.log(`✓ ${j.name}: proteção desligada (ssoProtection=${JSON.stringify(j.ssoProtection)})`);
  ok++;
}
console.log(`\n${ok}/${dirs.length} projetos liberados.`);
