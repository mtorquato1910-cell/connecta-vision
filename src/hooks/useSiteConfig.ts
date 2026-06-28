/**
 * Hook que conecta o site público às configurações editáveis pelo admin.
 * Lê de `configuracoes_empresa` + `conteudo_site` (Supabase) via server-fns públicas.
 *
 * Em SSR, retorna os valores DEFAULT (do código). No client, busca do banco
 * via react-query e atualiza. Helpers síncronos (buildWaLink/getTextoSync)
 * leem de um cache de módulo alimentado pelo hook.
 */
import { useQuery } from "@tanstack/react-query";
import {
  DEFAULT_CONFIG,
  type ConfigAll,
} from "@/lib/admin-config-repo";
import {
  DEFAULT_CONTEUDO,
  type ConteudoItem,
} from "@/lib/admin-conteudo-repo";
import { getConfigPublic, getConteudoPublic } from "@/lib/admin.functions";
import { rowsToConfig, rowsToConteudo } from "@/lib/site-config-adapter";

type SiteConfig = {
  config: ConfigAll;
  conteudo: ConteudoItem[];
  texto: (chave: string, fallback?: string) => string;
};

// Cache de módulo para helpers fora de componente React.
let cachedConfig: ConfigAll = DEFAULT_CONFIG;
let cachedConteudo: ConteudoItem[] = DEFAULT_CONTEUDO;

const STALE = 5 * 60 * 1000;

export function useSiteConfig(): SiteConfig {
  const { data: config = DEFAULT_CONFIG } = useQuery({
    queryKey: ["site-config"],
    queryFn: async () => rowsToConfig(await getConfigPublic()),
    initialData: DEFAULT_CONFIG,
    staleTime: STALE,
  });
  const { data: conteudo = DEFAULT_CONTEUDO } = useQuery({
    queryKey: ["site-conteudo"],
    queryFn: async () => rowsToConteudo(await getConteudoPublic()),
    initialData: DEFAULT_CONTEUDO,
    staleTime: STALE,
  });

  cachedConfig = config;
  cachedConteudo = conteudo;

  const texto = (chave: string, fallback = "") =>
    conteudo.find((c) => c.chave === chave)?.valor ?? fallback;

  return { config, conteudo, texto };
}

/** Helper síncrono para usar fora de componente React. Lê do cache do hook. */
export function getTextoSync(chave: string, fallback = ""): string {
  return cachedConteudo.find((c) => c.chave === chave)?.valor ?? fallback;
}

/** Helper para WhatsApp link usando a config carregada do admin (cache do hook). */
export function buildWaLink(msg?: string): string {
  const phone = cachedConfig.contato.whatsapp_raw;
  const text = msg ?? cachedConfig.contato.whatsapp_msg_padrao;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
