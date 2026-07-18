/**
 * Seções configuráveis (reordenar + ocultar) das páginas Sobre, Soluções e
 * Contato — mesmo padrão da home (admin-home-repo), mas genérico.
 *
 * A config de cada página é guardada em `conteudo_site` sob a chave
 * `<pagina>_config` (JSON), lida no site via server fn getConteudoPublic e
 * editada no admin (/admin/pagina-inicial → seletor de página).
 */

export type PaginaComSecoes = "sobre" | "solucoes" | "contato";

export type PageSecao = {
  id: string;
  label: string;
  descricao: string;
  ordem: number;
  ativa: boolean;
};

export type PageSecoesConfig = { secoes: PageSecao[] };

export const PAGE_CONFIG_KEY: Record<PaginaComSecoes, string> = {
  sobre: "sobre_config",
  solucoes: "solucoes_config",
  contato: "contato_config",
};

export const PAGE_LABEL: Record<PaginaComSecoes, string> = {
  sobre: "Sobre",
  solucoes: "Soluções",
  contato: "Contato",
};

export const DEFAULT_PAGE_SECOES: Record<PaginaComSecoes, PageSecoesConfig> = {
  sobre: {
    secoes: [
      {
        id: "hero",
        label: "Topo (título + descrição)",
        descricao: "Eyebrow, título e texto de abertura.",
        ordem: 1,
        ativa: true,
      },
      {
        id: "metricas",
        label: "Métricas",
        descricao: "Faixa com 300 / 230+ / Brasil.",
        ordem: 2,
        ativa: true,
      },
      {
        id: "manifesto",
        label: "Manifesto",
        descricao: "Bloco 'Equipamento certo, instalado com método'.",
        ordem: 3,
        ativa: true,
      },
      {
        id: "pilares",
        label: "Pilares",
        descricao: "Os 4 pilares (importação, instalação, entrega, suporte).",
        ordem: 4,
        ativa: true,
      },
      {
        id: "cta",
        label: "CTA de fechamento",
        descricao: "Faixa azul com botões de contato/catálogo.",
        ordem: 5,
        ativa: true,
      },
    ],
  },
  solucoes: {
    secoes: [
      {
        id: "header",
        label: "Cabeçalho",
        descricao: "Eyebrow, título e subtítulo.",
        ordem: 1,
        ativa: true,
      },
      {
        id: "cards",
        label: "Cards de perfis",
        descricao: "Clínicas, hospitais, especialidades, pet shops.",
        ordem: 2,
        ativa: true,
      },
    ],
  },
  contato: {
    secoes: [
      {
        id: "header",
        label: "Cabeçalho",
        descricao: "Eyebrow, título e subtítulo.",
        ordem: 1,
        ativa: true,
      },
      {
        id: "conteudo",
        label: "Formulário + dados",
        descricao: "Formulário de contato e informações (telefone, e-mail, WhatsApp).",
        ordem: 2,
        ativa: true,
      },
    ],
  },
};

/** Aplica a config salva sobre o default (ordena e resolve ativa), tolerando IDs novos. */
export function resolvePageSecoes(
  pagina: PaginaComSecoes,
  saved: PageSecoesConfig | null | undefined,
): PageSecao[] {
  const base = DEFAULT_PAGE_SECOES[pagina].secoes;
  const savedById = new Map((saved?.secoes ?? []).map((s) => [s.id, s]));
  return base
    .map((def) => {
      const s = savedById.get(def.id);
      return s ? { ...def, ordem: s.ordem, ativa: s.ativa } : def;
    })
    .sort((a, b) => a.ordem - b.ordem);
}
