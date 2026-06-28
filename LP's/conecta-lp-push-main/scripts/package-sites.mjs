// Empacota as 9 LPs prontas para entrega (opção 1: arquivos compilados, enxutos).
// Para cada site: mantém só as imagens que a CONFIG usa e otimiza, lendo da
// origem estável (dist) e escrevendo no destino — nunca relê arquivo recém-copiado
// (evita o lock de antivírus do Windows em arquivo recém-escrito).
// NÃO toca nas imagens originais em public/.
import sharp from "sharp";
import { execSync } from "node:child_process";
import { rmSync, mkdirSync, cpSync, readdirSync, statSync, existsSync, writeFileSync } from "node:fs";
import { join, extname, dirname, resolve } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

// Raiz do projeto = pasta-pai de scripts/ (resolvida em runtime, portável).
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..").replace(/\\/g, "/");
const sites = [
  "cirugiavet", "analiseveterinaria", "equipamentodentalvet", "veterinarioultrassom",
  "ultrassomdoppler", "endoscopiaveterinario", "microscopiodermatologico", "equipamentovet", "gemafalsa",
];
const outBase = `${root}/sites-prontos`;
const MAX = 1600; // largura máxima (não aumenta imagens menores)

function walk(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}
const mb = (b) => b / 1024 / 1024;
const sizeOf = (dir) => walk(dir).reduce((s, f) => s + statSync(f).size, 0);

async function optimizeTo(inF, outF) {
  const ext = extname(inF).toLowerCase();
  const img = sharp(inF, { failOn: "none" });
  const meta = await img.metadata();
  let pipe = img.rotate();
  if (meta.width && meta.width > MAX) pipe = pipe.resize({ width: MAX });
  const buf = ext === ".png"
    ? await pipe.png({ quality: 80, compressionLevel: 9, palette: true, effort: 7 }).toBuffer()
    : await pipe.jpeg({ quality: 80, mozjpeg: true }).toBuffer();
  mkdirSync(dirname(outF), { recursive: true });
  writeFileSync(outF, buf);
}

rmSync(outBase, { recursive: true, force: true });
mkdirSync(outBase, { recursive: true });

let totalBefore = 0, totalAfter = 0;
for (const s of sites) {
  const env = { ...process.env, VITE_SITE: s };
  // 1. SSR build leve só pra obter a lista de imagens que a config usa
  execSync(`npx vite build --ssr src/entry-seo.ts --outDir dist-seo/${s}`, { cwd: root, env, stdio: "ignore" });
  const jsFile = readdirSync(`${root}/dist-seo/${s}`).find((f) => f.startsWith("entry-seo") && f.endsWith(".js"));
  const mod = await import(pathToFileURL(`${root}/dist-seo/${s}/${jsFile}`).href);
  const used = new Set(mod.images || []);
  used.add("/products/placeholder.jpg"); // fallback usado pelo onError da galeria

  const src = `${root}/dist/${s}`;
  const dst = `${outBase}/${s}`;
  totalBefore += sizeOf(src);

  // 2. copia tudo MENOS as imagens (html, js, css, assets, favicon.png, robots, sitemap)
  cpSync(src, dst, {
    recursive: true,
    filter: (p) => {
      const u = p.replace(/\\/g, "/");
      if (/\/(banco|products)\//.test(u)) return false; // imagens tratadas à parte
      if (u.endsWith("/favicon.jpeg")) return false;     // redundante (usa favicon.png)
      return true;
    },
  });

  // 3. otimiza só as imagens usadas, lendo de dist e escrevendo em sites-prontos
  let kept = 0;
  for (const rel of used) {
    const inF = src + rel;
    if (!existsSync(inF)) continue;
    await optimizeTo(inF, dst + rel);
    kept++;
  }
  // 4. otimiza imagens de assets (logo) lendo da origem
  for (const f of walk(`${src}/assets`)) {
    if (/\.(png|jpe?g)$/i.test(f)) await optimizeTo(f, dst + f.replace(/\\/g, "/").slice(src.length));
  }

  const after = sizeOf(dst);
  totalAfter += after;
  console.log(`${s.padEnd(26)} ${mb(sizeOf(src)).toFixed(0)}MB -> ${mb(after).toFixed(2)}MB  (${kept} imagens usadas)`);
}
console.log("------");
console.log(`TOTAL entrega: ${mb(totalAfter).toFixed(1)} MB`);
