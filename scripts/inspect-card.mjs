import puppeteer from "puppeteer-core";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const URL = process.argv[2] || "https://www.conecta2lab.com.br/produtos";
const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--no-sandbox", "--disable-gpu"] });
const page = await browser.newPage();
await page.setViewport({ width: 1366, height: 1500 });
await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 45000 }).catch(() => {});
await new Promise((r) => setTimeout(r, 12000));
const info = await page.evaluate(() => {
  // pega a primeira imagem de produto (dentro de um link /produtos/)
  const link = [...document.querySelectorAll('a[href*="/produtos/"]')].find((a) => a.querySelector("img"));
  const img = link?.querySelector("img");
  if (!img) return { erro: "nenhum card de produto encontrado" };
  const cs = getComputedStyle(img);
  const box = img.getBoundingClientRect();
  return {
    objectFit: cs.objectFit,
    padding: cs.padding,
    rendered: `${Math.round(box.width)}x${Math.round(box.height)}`,
    natural: `${img.naturalWidth}x${img.naturalHeight}`,
    src: (img.currentSrc || img.src).slice(0, 70),
  };
});
console.log(JSON.stringify(info, null, 1));
await browser.close();
