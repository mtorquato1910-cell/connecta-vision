import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
function env(k){const r=readFileSync(join(root,".env.local"),"utf8");const l=r.split(/\r?\n/).find(x=>x.startsWith(k+"="));return l?l.slice(k.length+1).trim().replace(/^['"]|['"]$/g,""):"";}

const URL=env("SUPABASE_URL"), KEY=env("SUPABASE_SERVICE_ROLE_KEY");
const sb=createClient(URL,KEY,{auth:{persistSession:false}});

const all=[];
let from=0; const size=1000;
for(;;){
  const {data,error}=await sb.from("produtos")
    .select("id,nome,resumo,descricao,especificacoes")
    .order("id",{ascending:true})
    .range(from,from+size-1);
  if(error){console.error("Erro:",error.message);process.exit(1);}
  if(!data||data.length===0) break;
  all.push(...data);
  if(data.length<size) break;
  from+=size;
}

writeFileSync(join(root,"scripts/_produtos-en.json"), JSON.stringify(all,null,2),"utf8");
console.log("Total produtos exportados:", all.length);
console.log("Amostra nome[0]:", all[0]?.nome);
console.log("Amostra nome[1]:", all[1]?.nome);
