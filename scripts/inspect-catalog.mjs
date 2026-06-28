import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
function env(k){const r=readFileSync(join(root,".env.local"),"utf8");const l=r.split(/\r?\n/).find(x=>x.startsWith(k+"="));return l?l.slice(k.length+1).trim().replace(/^['"]|['"]$/g,""):"";}

const URL=env("SUPABASE_URL"), KEY=env("SUPABASE_SERVICE_ROLE_KEY");
const sb=createClient(URL,KEY,{auth:{persistSession:false}});

console.log("=== produtos.json (amostra de imagens) ===");
const prod=JSON.parse(readFileSync(join(root,"src/data/produtos.json"),"utf8"));
console.log("total no json:", prod.length);
for(const p of prod.slice(0,3)){
  console.log(` - ${p.slug}: principal=${JSON.stringify(p.imagem_principal)} galeria=${(p.galeria||[]).length} img`);
}

console.log("\n=== BANCO ===");
const {count:nc}=await sb.from("categorias").select("id",{count:"exact",head:true});
const {count:np}=await sb.from("produtos").select("id",{count:"exact",head:true});
console.log("categorias:",nc,"| produtos:",np);
const {data:sample}=await sb.from("produtos").select("slug,imagem_url").limit(4);
for(const s of sample||[]) console.log("  img_url:", s.imagem_url);

console.log("\n=== STORAGE buckets ===");
const {data:buckets}=await sb.storage.listBuckets();
console.log("buckets:", (buckets||[]).map(b=>`${b.name}(public=${b.public})`).join(", ")||"nenhum");
for(const b of buckets||[]){
  const {data:files}=await sb.storage.from(b.name).list("",{limit:5});
  console.log(`  ${b.name}: ${(files||[]).length>0?(files.length+"+ arquivos, ex: "+files.slice(0,3).map(f=>f.name).join(", ")):"vazio"}`);
}
