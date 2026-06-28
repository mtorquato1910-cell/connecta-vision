/**
 * Adiciona domínios a projetos Vercel via API e mostra o status/verificação.
 * Uso: node scripts/vercel-add-domain.mjs projeto1=dominio1 projeto2=dominio2 ...
 * Token: VERCEL_TOKEN em .env.local. teamId: orgId do .vercel/project.json principal.
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
function env(k) {
  if (process.env[k]) return process.env[k];
  const r = readFileSync(join(root, ".env.local"), "utf8");
  const l = r.split(/\r?\n/).find((x) => x.startsWith(k + "="));
  return l ? l.slice(k.length + 1).trim().replace(/^['"]|['"]$/g, "") : "";
}
const token = env("VERCEL_TOKEN");
const teamId = JSON.parse(readFileSync(join(root, ".vercel/project.json"), "utf8")).orgId;
const H = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

for (const pair of process.argv.slice(2)) {
  const [project, domain] = pair.split("=");
  console.log(`\n=== ${project}  +  ${domain} ===`);
  const add = await fetch(`https://api.vercel.com/v10/projects/${project}/domains?teamId=${teamId}`, {
    method: "POST",
    headers: H,
    body: JSON.stringify({ name: domain }),
  });
  const addj = await add.json();
  if (!add.ok && addj?.error?.code !== "domain_already_exists") {
    console.log(`  add: ✗ (${add.status}) ${addj?.error?.message || JSON.stringify(addj).slice(0,160)}`);
  } else {
    console.log(`  add: ✓ ${addj?.error?.code === "domain_already_exists" ? "(já existia)" : "adicionado"}`);
  }
  // status de verificação
  const cfg = await fetch(`https://api.vercel.com/v6/domains/${domain}/config?teamId=${teamId}`, { headers: H });
  const cfgj = await cfg.json();
  console.log(`  config: misconfigured=${cfgj.misconfigured}` + (cfgj.recommendedCNAME ? ` cname=${cfgj.recommendedCNAME}` : "") + (cfgj.aValues ? ` A=${cfgj.aValues.join(",")}` : ""));
  const dom = await fetch(`https://api.vercel.com/v9/projects/${project}/domains/${domain}?teamId=${teamId}`, { headers: H });
  const domj = await dom.json();
  console.log(`  verified=${domj.verified}` + (domj.verification ? ` verification=${JSON.stringify(domj.verification)}` : ""));
}
