// Blindagem do build: renderiza cada página compilada num navegador headless
// e falha (exit 1) se alguma vier "branca" (sem conteúdo no #root).
// Evita publicar página quebrada silenciosamente (já aconteceu com a gemologia).
// Uso: node scripts/verify-build.mjs   (precisa do Google Chrome instalado)
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { spawn } from "node:child_process";
import { join, extname } from "node:path";

// Chrome assíncrono (spawn), pois o servidor HTTP roda no MESMO processo:
// com execSync (bloqueante) o event loop trava e o servidor não responde.
function runChrome(chrome, url) {
  return new Promise((resolve) => {
    const cp = spawn(chrome, ["--headless=new", "--disable-gpu", "--no-sandbox",
      "--dump-dom", "--virtual-time-budget=9000", url], { windowsHide: true });
    let out = "";
    cp.stdout.on("data", (d) => (out += d));
    const timer = setTimeout(() => { try { cp.kill(); } catch {} resolve({ out, err: "timeout" }); }, 25000);
    cp.on("close", () => { clearTimeout(timer); resolve({ out, err: "" }); });
    cp.on("error", (e) => { clearTimeout(timer); resolve({ out, err: e.message }); });
  });
}

const root = "d:/Projetos/ADABTECH/adabech/Conecta/conecta-lp";
const sites = [
  "cirugiavet", "analiseveterinaria", "equipamentodentalvet", "veterinarioultrassom",
  "ultrassomdoppler", "endoscopiaveterinario", "microscopiodermatologico", "equipamentovet", "gemafalsa",
];
const baseDir = process.argv[2] || "dist"; // verifica dist/ por padrão; ou sites-prontos/
const MIN_DIVS = 20; // página saudável tem dezenas de <div>; branca tem ~1

const CHROME = process.env.CHROME_PATH
  || ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"]
       .find((p) => existsSync(p));
if (!CHROME) { console.error("Chrome nao encontrado. Defina CHROME_PATH."); process.exit(2); }

const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".webp": "image/webp",
  ".xml": "application/xml", ".txt": "text/plain", ".ico": "image/x-icon" };

function serve(dir, port) {
  return new Promise((resolve) => {
    const srv = createServer((req, res) => {
      let p = decodeURIComponent(req.url.split("?")[0]);
      let file = join(dir, p);
      if (!existsSync(file) || statSync(file).isDirectory()) file = join(dir, "index.html"); // fallback SPA
      try {
        const data = readFileSync(file);
        res.writeHead(200, { "Content-Type": MIME[extname(file).toLowerCase()] || "application/octet-stream" });
        res.end(data);
      } catch { res.writeHead(404); res.end("404"); }
    });
    srv.listen(port, () => resolve(srv));
  });
}

let fail = 0, port = 4310;
for (const s of sites) {
  const dir = `${root}/${baseDir}/${s}`;
  if (!existsSync(`${dir}/index.html`)) { console.log(`FALHA ${s} (sem index.html)`); fail++; continue; }
  const srv = await serve(dir, port);
  const { out: dom, err: cerr } = await runChrome(CHROME, `http://localhost:${port}/`);
  const divs = (dom.match(/<div/g) || []).length;
  let err = cerr ? ` (${cerr})` : "";
  if (/useContext|Cannot read properties of null/.test(dom)) err += " (erro React detectado)";
  srv.close();
  const ok = divs >= MIN_DIVS;
  if (!ok) fail++;
  console.log(`${ok ? "PASS " : "FALHA"} ${s.padEnd(26)} divs=${divs}${err}`);
  port++;
}
console.log("------");
if (fail) { console.error(`BUILD REPROVADO: ${fail} de ${sites.length} pagina(s) em branco/quebrada(s).`); process.exit(1); }
console.log(`BUILD APROVADO: ${sites.length}/${sites.length} renderizam.`);
