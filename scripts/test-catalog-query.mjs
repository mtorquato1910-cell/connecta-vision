import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
function env(k){const r=readFileSync(join(root,".env.local"),"utf8");const l=r.split(/\r?\n/).find(x=>x.startsWith(k+"="));return l?l.slice(k.length+1).trim().replace(/^['"]|['"]$/g,""):"";}
const sb=createClient(env("SUPABASE_URL"),env("SUPABASE_SERVICE_ROLE_KEY"),{auth:{persistSession:false}});

const SEL="slug, modelo, nome, imagem_url, destaque, ordem, resumo, descricao, galeria, diferenciais, aplicacoes, especificacoes, categoria:categorias!inner(slug, nome)";

console.log("=== listCategorias ===");
{
  const {data,error}=await sb.from("categorias").select("id, slug, nome, numero, imagem_url, ordem").order("ordem");
  console.log(error?("ERRO: "+error.message):("OK "+data.length+" categorias"));
}
console.log("=== listProdutos (publicado=true) ===");
{
  const t=process.hrtime.bigint();
  const {data,error}=await sb.from("produtos").select(SEL).eq("publicado",true).order("ordem");
  const ms=Number(process.hrtime.bigint()-t)/1e6;
  if(error){console.log("ERRO:",error.message, error.details||"", error.hint||"");}
  else {
    const bytes=JSON.stringify(data).length;
    console.log(`OK ${data.length} produtos em ${ms.toFixed(0)}ms | payload bruto=${(bytes/1024).toFixed(0)}KB`);
    console.log("amostra img:", data[0]?.imagem_url?.slice(0,60));
  }
}
