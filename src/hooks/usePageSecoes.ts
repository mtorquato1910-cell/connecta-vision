/**
 * Hook que lê a config de seções (ordem + visibilidade) de uma página do site
 * — Sobre, Soluções ou Contato — editada no admin. Fallback = defaults.
 */
import { useQuery } from "@tanstack/react-query";
import { getConteudoPublic } from "@/lib/admin.functions";
import {
  PAGE_CONFIG_KEY,
  resolvePageSecoes,
  type PaginaComSecoes,
  type PageSecoesConfig,
} from "@/lib/admin-page-sections";

export function usePageSecoes(pagina: PaginaComSecoes) {
  const chave = PAGE_CONFIG_KEY[pagina];
  const { data } = useQuery({
    queryKey: ["page-secoes", pagina],
    queryFn: async () => {
      const rows = (await getConteudoPublic()) as Array<{ chave: string; valor: unknown }>;
      const row = rows.find((r) => r.chave === chave);
      return (row?.valor as PageSecoesConfig) ?? null;
    },
    initialData: null,
  });

  const secoes = resolvePageSecoes(pagina, data);
  const ativas = secoes.filter((s) => s.ativa);
  return {
    /** IDs das seções ativas, na ordem configurada. */
    ordem: ativas.map((s) => s.id),
    /** true se a seção está ativa (visível). */
    ativa: (id: string) => ativas.some((s) => s.id === id),
  };
}
