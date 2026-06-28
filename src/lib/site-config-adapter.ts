/**
 * Adapter entre o armazenamento key/value do Supabase
 * (tabelas `configuracoes_empresa` e `conteudo_site`, chave→JSON)
 * e as estruturas tipadas usadas pelo admin e pelo site público.
 *
 * Os DEFAULTS (estrutura + valores de fábrica) vivem no código
 * (admin-config-repo / admin-conteudo-repo). O banco guarda só os overrides.
 */
import { DEFAULT_CONFIG, type ConfigAll } from "./admin-config-repo";
import { DEFAULT_CONTEUDO, type ConteudoItem } from "./admin-conteudo-repo";

type Row = { chave: string; valor: unknown };

/** Reduz as linhas de `configuracoes_empresa` para o objeto ConfigAll (merge sobre defaults). */
export function rowsToConfig(rows: Row[]): ConfigAll {
  const map = new Map(rows.map((r) => [r.chave, r.valor as Record<string, unknown>]));
  return {
    empresa: { ...DEFAULT_CONFIG.empresa, ...(map.get("empresa") ?? {}) },
    contato: { ...DEFAULT_CONFIG.contato, ...(map.get("contato") ?? {}) },
    redes: { ...DEFAULT_CONFIG.redes, ...(map.get("redes") ?? {}) },
    seo: { ...DEFAULT_CONFIG.seo, ...(map.get("seo") ?? {}) },
  } as ConfigAll;
}

/** Reduz as linhas de `conteudo_site` para a lista de ConteudoItem (override de `valor` sobre os defaults). */
export function rowsToConteudo(rows: Row[]): ConteudoItem[] {
  const map = new Map(
    rows.map((r) => [r.chave, typeof r.valor === "string" ? r.valor : String(r.valor ?? "")]),
  );
  return DEFAULT_CONTEUDO.map((item) =>
    map.has(item.chave) ? { ...item, valor: map.get(item.chave) as string } : item,
  );
}
