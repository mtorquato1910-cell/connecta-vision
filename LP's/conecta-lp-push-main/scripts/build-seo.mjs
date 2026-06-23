// Build das 9 LPs com SEO técnico injetado no HTML estático:
// canonical + og:image + JSON-LD (Organization/WebSite/ItemList/FAQPage) + robots.txt + sitemap.xml.
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { pathToFileURL } from "node:url";

const root = "d:/Projetos/ADABTECH/adabech/Conecta/conecta-lp";
const sites = [
  "cirugiavet", "analiseveterinaria", "equipamentodentalvet", "veterinarioultrassom",
  "ultrassomdoppler", "endoscopiaveterinario", "microscopiodermatologico", "equipamentovet", "gemafalsa",
];
const today = "2026-06-09";

for (const s of sites) {
  const env = { ...process.env, VITE_SITE: s };
  // 1. build do cliente (SPA)
  execSync(`npx vite build --outDir dist/${s} --emptyOutDir`, { cwd: root, env, stdio: "ignore" });
  // 2. build SSR leve só da cabeça de SEO
  execSync(`npx vite build --ssr src/entry-seo.ts --outDir dist-seo/${s}`, { cwd: root, env, stdio: "ignore" });
  // 3. importa head + domain do bundle SSR
  const jsFile = readdirSync(`${root}/dist-seo/${s}`).find((f) => f.startsWith("entry-seo") && f.endsWith(".js"));
  const mod = await import(pathToFileURL(`${root}/dist-seo/${s}/${jsFile}`).href);
  const { head, domain } = mod;
  // 4. injeta a cabeça de SEO no HTML estático
  const idx = `${root}/dist/${s}/index.html`;
  let html = readFileSync(idx, "utf8");
  if (!html.includes("<!--app-head-->")) throw new Error(`placeholder ausente em ${s}`);
  writeFileSync(idx, html.replace("<!--app-head-->", head));
  // 5. robots.txt + sitemap.xml por domínio
  writeFileSync(`${root}/dist/${s}/robots.txt`, `User-agent: *\nAllow: /\n\nSitemap: https://${domain}/sitemap.xml\n`);
  writeFileSync(
    `${root}/dist/${s}/sitemap.xml`,
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://${domain}/</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url>\n</urlset>\n`,
  );
  console.log(`OK ${s} -> ${domain}`);
}
console.log("SEO build completo (9/9).");
