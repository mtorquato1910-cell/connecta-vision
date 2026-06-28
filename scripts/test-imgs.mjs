import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
function env(k){const r=readFileSync(join(root,".env.local"),"utf8");const l=r.split(/\r?\n/).find(x=>x.startsWith(k+"="));return l?l.slice(k.length+1).trim().replace(/^['"]|['"]$/g,""):"";}
const sb=createClient(env("SUPABASE_URL"),env("SUPABASE_SERVICE_ROLE_KEY"),{auth:{persistSession:false}});

const {data}=await sb.from("produtos").select("slug,imagem_url").limit(15);
let sup=0,ext=0,ok=0,bad=0;
for(const p of data){
  const u=p.imagem_url||"";
  const kind=u.includes("/storage/v1/")?"SUPA":(u.startsWith("http")?"EXT":"none");
  if(kind==="SUPA")sup++; if(kind==="EXT")ext++;
  let code="?";
  try{const r=await fetch(u,{method:"GET"});code=r.status; if(r.ok)ok++;else bad++;}catch(e){code="ERR";bad++;}
  console.log(`${kind}  ${code}  ${p.slug}  ${u.slice(0,70)}`);
}
console.log(`\nSupabase=${sup} Externas=${ext} | OK=${ok} FALHA=${bad}`);

// bucket público?
const {data:b}=await sb.storage.getBucket("produtos");
console.log("bucket produtos public =", b?.public);
