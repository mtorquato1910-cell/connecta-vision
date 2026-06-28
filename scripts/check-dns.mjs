import { Resolver } from "node:dns/promises";

// Usa resolvers públicos pra ver propagação "de fora" (não o cache local).
const r = new Resolver();
r.setServers(["8.8.8.8", "1.1.1.1"]);

const expectApex = "216.198.79.1";
const domains = {
  "cirugiavet.com.br": "4560f3ac7e00154b.vercel-dns-017.com",
  "veterinarioultrassom.com.br": "ce6f196b44666ed2.vercel-dns-017.com",
  "endoscopiaveterinario.com.br": "8d777e6134569ad2.vercel-dns-017.com",
};

for (const [dom, expectCname] of Object.entries(domains)) {
  console.log(`\n=== ${dom} ===`);
  // apex A
  try {
    const a = await r.resolve4(dom);
    const ok = a.includes(expectApex);
    console.log(`  apex A: ${a.join(", ")}  ${ok ? "✓ OK" : "✗ esperado " + expectApex}`);
  } catch (e) {
    console.log(`  apex A: SEM REGISTRO (${e.code})  ✗ falta A -> ${expectApex}`);
  }
  // www CNAME
  try {
    const c = await r.resolveCname(`www.${dom}`);
    const ok = c.some((x) => x.replace(/\.$/, "") === expectCname);
    console.log(`  www CNAME: ${c.join(", ")}  ${ok ? "✓ OK" : "✗ esperado " + expectCname}`);
  } catch (e) {
    // pode ser que tenham posto A no www em vez de CNAME
    try {
      const wa = await r.resolve4(`www.${dom}`);
      console.log(`  www: tem A ${wa.join(", ")} (esperado CNAME ${expectCname})  ✗`);
    } catch {
      console.log(`  www CNAME: SEM REGISTRO (${e.code})  ✗ falta CNAME -> ${expectCname}`);
    }
  }
}
