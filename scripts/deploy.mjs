/**
 * Deploy de produção em UM comando: `npm run deploy`.
 *
 * Faz toda a sequência que antes era manual, de forma cross-platform (Windows ok):
 *   1. limpa .vercel/output (evita lixo de build anterior)
 *   2. vite build (gera dist/client + dist/server)
 *   3. node scripts/build-vercel.mjs (monta .vercel/output — Build Output API)
 *   4. vercel deploy --prebuilt --prod --yes (sobe o pré-buildado)
 *
 * Enquanto o auto-deploy por git push não está ligado (projeto Vercel é da conta
 * do cliente, repo é de outra conta), este é o caminho confiável de publicar.
 */
import { rmSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const run = (cmd) => execSync(cmd, { cwd: root, stdio: "inherit", shell: true });

console.log("→ [1/4] limpando .vercel/output");
rmSync(join(root, ".vercel/output"), { recursive: true, force: true });

console.log("→ [2/4] vite build");
run("npx vite build");

console.log("→ [3/4] montando output da Vercel");
run("node scripts/build-vercel.mjs");

console.log("→ [4/4] deploy de produção");
run("npx vercel deploy --prebuilt --prod --yes");

console.log("\n✓ Deploy de produção concluído.");
