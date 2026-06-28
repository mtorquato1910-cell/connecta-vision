import puppeteer from "puppeteer-core";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const URL = process.argv[2] || "https://www.conecta2lab.com.br/produtos";
const OUT = process.argv[3] || "C:/Users/mathe/AppData/Local/Temp/card.png";
const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--no-sandbox", "--disable-gpu"] });
const page = await browser.newPage();
await page.setViewport({ width: 1366, height: 1500, deviceScaleFactor: 2 });
await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 45000 }).catch(() => {});
await new Promise((r) => setTimeout(r, 12000));
// service worker registrado?
const sw = await page.evaluate(async () => {
  if (!("serviceWorker" in navigator)) return "sem suporte";
  const regs = await navigator.serviceWorker.getRegistrations();
  return regs.length ? regs.map((r) => r.active?.scriptURL || "?").join(",") : "nenhum";
});
console.log("service worker:", sw);
const link = await page.evaluateHandle(() =>
  [...document.querySelectorAll('a[href*="/produtos/"]')].find((a) => a.querySelector("img")),
);
const el = link.asElement();
if (el) {
  await el.screenshot({ path: OUT });
  console.log("card salvo:", OUT);
} else {
  console.log("nenhum card encontrado");
}
await browser.close();
