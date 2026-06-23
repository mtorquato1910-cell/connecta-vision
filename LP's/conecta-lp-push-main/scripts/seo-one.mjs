// Re-injeta o SEO em UM site só, reaproveitando o build de cliente existente.
// Uso: node scripts/seo-one.mjs <site>
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { pathToFileURL } from "node:url";

const root = "d:/Projetos/ADABTECH/adabech/Conecta/conecta-lp";
const s = process.argv[2];
if (!s) throw new Error("informe o site: node scripts/seo-one.mjs <site>");
const today = "2026-06-11";
const env = { ...process.env, VITE_SITE: s };

// build SSR leve só da cabeça de SEO (NÃO rebuilda o cliente)
execSync(`npx vite build --ssr src/entry-seo.ts --outDir dist-seo/${s}`, { cwd: root, env, stdio: "ignore" });
const jsFile = readdirSync(`${root}/dist-seo/${s}`).find((f) => f.startsWith("entry-seo") && f.endsWith(".js"));
const mod = await import(pathToFileURL(`${root}/dist-seo/${s}/${jsFile}`).href);
const { head, domain } = mod;

const idx = `${root}/dist/${s}/index.html`;
let html = readFileSync(idx, "utf8");
if (!html.includes("<!--app-head-->")) throw new Error(`placeholder <!--app-head--> ausente em ${s}`);
writeFileSync(idx, html.replace("<!--app-head-->", head));
writeFileSync(`${root}/dist/${s}/robots.txt`, `User-agent: *\nAllow: /\n\nSitemap: https://${domain}/sitemap.xml\n`);
writeFileSync(
  `${root}/dist/${s}/sitemap.xml`,
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://${domain}/</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url>\n</urlset>\n`,
);
console.log(`SEO re-injetado em ${s} -> ${domain}`);
