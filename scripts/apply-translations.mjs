import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
function env(k){const r=readFileSync(join(root,".env.local"),"utf8");const l=r.split(/\r?\n/).find(x=>x.startsWith(k+"="));return l?l.slice(k.length+1).trim().replace(/^['"]|['"]$/g,""):"";}

const URL=env("SUPABASE_URL"), KEY=env("SUPABASE_SERVICE_ROLE_KEY");
const sb=createClient(URL,KEY,{auth:{persistSession:false}});

// arquivo de traduções: array de { id, nome?, resumo?, descricao?, especificacoes? }
const file = process.argv[2] || "scripts/_translations.json";
const items = JSON.parse(readFileSync(join(root,file),"utf8"));

let ok=0, err=0;
for(const it of items){
  const patch={};
  if(it.nome!=null) patch.nome=it.nome;
  if(it.resumo!=null) patch.resumo=it.resumo;
  if(it.descricao!=null) patch.descricao=it.descricao;
  if(it.especificacoes!=null) patch.especificacoes=it.especificacoes;
  if(Object.keys(patch).length===0) continue;
  const {error}=await sb.from("produtos").update(patch).eq("id",it.id);
  if(error){err++; console.error("ERRO id",it.id, error.message);}
  else ok++;
}
console.log(`Aplicado: ${ok} ok, ${err} erros (de ${items.length} no arquivo ${file})`);
