import puppeteer from "puppeteer-core";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const URL = process.argv[2] || "https://www.conecta2lab.com.br/produtos";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu"],
});
const page = await browser.newPage();

const consoleErrs = [];
const pageErrs = [];
const failed = [];
page.on("console", (m) => { if (m.type() === "error") consoleErrs.push(m.text().slice(0, 300)); });
page.on("pageerror", (e) => pageErrs.push((e.message || String(e)).slice(0, 300)));
page.on("requestfailed", (r) => failed.push(`${r.failure()?.errorText} ${r.url().slice(0, 90)}`));
const serverFnCalls = [];
page.on("response", async (r) => {
  const u = r.url();
  if (/_serverFn/.test(u)) {
    let snippet = "";
    try { snippet = (await r.text()).slice(0, 280); } catch {}
    serverFnCalls.push(`HTTP ${r.status()} ${u.split("/_serverFn/")[1]?.slice(0, 16)} :: ${snippet}`);
  }
  if (r.status() >= 400 && /supabase/.test(u)) failed.push(`HTTP ${r.status()} ${u.slice(0, 90)}`);
});

await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 45000 }).catch((e) => console.log("goto:", e.message));
await new Promise((r) => setTimeout(r, 18000));
console.log("=== chamadas _serverFn ===", serverFnCalls.length ? serverFnCalls : "NENHUMA chamada feita");

const imgs = await page.evaluate(() => {
  const all = [...document.querySelectorAll("img")];
  const loaded = all.filter((i) => i.complete && i.naturalWidth > 0).length;
  const broken = all.filter((i) => i.complete && i.naturalWidth === 0).length;
  const srcs = all.slice(0, 3).map((i) => i.currentSrc || i.src).map((s) => s.slice(0, 60));
  const bodyText = document.body.innerText.slice(0, 400);
  return { total: all.length, loaded, broken, srcs, hasCarregando: /Carregando catálogo/.test(bodyText) };
});

console.log("=== IMAGENS ===", JSON.stringify(imgs, null, 1));
console.log("=== pageerror (JS crash) ===", pageErrs.length ? pageErrs : "nenhum");
console.log("=== console.error ===", consoleErrs.slice(0, 8));
console.log("=== requisições falhas ===", failed.slice(0, 10));

await browser.close();
