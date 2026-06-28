/**
 * Bundle do SSR (Edge) + arquivos de config do output Vercel + cópia do estático.
 * A cópia usa um copiador recursivo em Node puro (não `cpSync`, que crasha no
 * ambiente Windows/OneDrive) — assim funciona tanto local quanto no builder
 * Linux da Vercel (necessário para o auto-deploy via Git).
 *
 * Pré: `npm run build` (gera dist/client + dist/server/server.js).
 */
import { build } from "esbuild";
import {
  writeFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  copyFileSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

/** Cópia recursiva multiplataforma (evita o crash de cpSync no Windows/OneDrive). */
function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    const s = join(src, entry.name);
    const d = join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else copyFileSync(s, d);
  }
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, ".vercel/output");
const funcDir = join(out, "functions/_ssr.func");

if (!existsSync(join(root, "dist/server/server.js"))) {
  console.error("dist/server/server.js não encontrado — rode `npm run build` antes.");
  process.exit(1);
}

await build({
  entryPoints: [join(root, "scripts/vercel-edge-entry.js")],
  bundle: true,
  format: "esm",
  platform: "node",
  target: "node20",
  outfile: join(funcDir, "index.mjs"),
  legalComments: "none",
  logLevel: "warning",
  // Disponibiliza um `require` real no bundle ESM (resolve "Dynamic require of
  // util/..." vindos de pacotes CJS como react-dom/server.node).
  banner: {
    js: [
      'import { createRequire as ___cr } from "node:module";',
      'import { fileURLToPath as ___ftp } from "node:url";',
      'import { dirname as ___dn } from "node:path";',
      "const require = ___cr(import.meta.url);",
      "const __filename = ___ftp(import.meta.url);",
      "const __dirname = ___dn(__filename);",
    ].join("\n"),
  },
});
console.log("✓ SSR bundle gerado (runtime Node)");

writeFileSync(
  join(funcDir, ".vc-config.json"),
  JSON.stringify(
    { runtime: "nodejs20.x", handler: "index.mjs", launcherType: "Nodejs", shouldAddHelpers: false },
    null,
    2,
  ),
);

// Headers de segurança aplicados a todas as respostas (anti-clickjacking,
// HSTS, sniffing, vazamento de referrer e permissões de browser).
const securityHeaders = {
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  "X-DNS-Prefetch-Control": "on",
};

writeFileSync(
  join(out, "config.json"),
  JSON.stringify(
    {
      version: 3,
      routes: [
        // Aplica headers de segurança e segue o roteamento (continue).
        { src: "/(.*)", headers: securityHeaders, continue: true },
        // Admin nunca deve ser indexado por buscadores.
        { src: "/admin(.*)", headers: { "X-Robots-Tag": "noindex, nofollow" }, continue: true },
        { handle: "filesystem" },
        { src: "/(.*)", dest: "/_ssr" },
      ],
    },
    null,
    2,
  ),
);
console.log("✓ config.json + .vc-config.json escritos (com headers de segurança)");

// Copia o estático (dist/client → .vercel/output/static) dentro do próprio script,
// para o build da Vercel (Git auto-deploy) gerar o output completo sozinho.
const staticSrc = join(root, "dist/client");
const staticDest = join(out, "static");
if (existsSync(staticSrc)) {
  copyDir(staticSrc, staticDest);
  console.log("✓ estático copiado para .vercel/output/static");
} else {
  console.warn("⚠ dist/client não encontrado — pulei a cópia do estático.");
}
