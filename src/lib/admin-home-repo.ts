/**
 * Repository da configuração da página inicial:
 * - Quais seções aparecem
 * - Ordem das seções
 * - Quais produtos ficam em destaque
 */

const LS_KEY = "conecta_admin_home_v1";

export type SecaoHome =
  | "hero"
  | "marquee_top"
  | "categorias"
  | "destaques"
  | "principios"
  | "sobre"
  | "depoimento"
  | "cta_final";

export type SecaoConfig = {
  id: SecaoHome;
  label: string;
  descricao: string;
  ordem: number;
  ativa: boolean;
};

export type HomeConfig = {
  secoes: SecaoConfig[];
  produtos_destaque_slugs: string[];
};

export const DEFAULT_HOME: HomeConfig = {
  secoes: [
    {
      id: "hero",
      label: "Hero (topo)",
      descricao: "Headline principal, sub-título, CTAs e card de catálogo.",
      ordem: 1,
      ativa: true,
    },
    {
      id: "marquee_top",
      label: "Marquee editorial",
      descricao: "Faixa horizontal com mensagem de marca em scroll infinito.",
      ordem: 2,
      ativa: true,
    },
    {
      id: "categorias",
      label: "Grid de categorias",
      descricao: "8 linhas clínicas em destaque.",
      ordem: 3,
      ativa: true,
    },
    {
      id: "destaques",
      label: "Produtos em destaque",
      descricao: "Carrossel com os produtos selecionados como destaque.",
      ordem: 4,
      ativa: true,
    },
    {
      id: "principios",
      label: "Princípios / pilares",
      descricao: "3-4 valores da Conecta com ícones editoriais.",
      ordem: 5,
      ativa: true,
    },
    {
      id: "sobre",
      label: "Sobre (banner)",
      descricao: "Resumo institucional com CTA para /sobre.",
      ordem: 6,
      ativa: true,
    },
    {
      id: "depoimento",
      label: "Depoimento",
      descricao: "Quote editorial com autor + cargo + foto opcional.",
      ordem: 7,
      ativa: true,
    },
    {
      id: "cta_final",
      label: "CTA de fechamento",
      descricao: "Última seção com WhatsApp + link contato.",
      ordem: 8,
      ativa: true,
    },
  ],
  produtos_destaque_slugs: [
    "moni-3l",
    "lc-c240c",
    "sr-f1b",
    "hemo-3100v",
    "hx-200",
    "sl-3c",
    "mcg-302c",
    "w003",
  ],
};

function readLs(): HomeConfig | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as HomeConfig;
  } catch {
    return null;
  }
}

function writeLs(config: HomeConfig) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_KEY, JSON.stringify(config));
}

export function getConfig(): HomeConfig {
  return readLs() ?? DEFAULT_HOME;
}

export function toggleSecao(id: SecaoHome): HomeConfig {
  const config = getConfig();
  const secoes = config.secoes.map((s) =>
    s.id === id ? { ...s, ativa: !s.ativa } : s,
  );
  const next = { ...config, secoes };
  writeLs(next);
  return next;
}

export function reorderSecoes(orderedIds: SecaoHome[]): HomeConfig {
  const config = getConfig();
  const map = new Map(config.secoes.map((s) => [s.id, s]));
  const secoes = orderedIds
    .map((id, i) => {
      const s = map.get(id);
      return s ? { ...s, ordem: i + 1 } : null;
    })
    .filter(Boolean) as SecaoConfig[];
  const next = { ...config, secoes };
  writeLs(next);
  return next;
}

export function setProdutosDestaque(slugs: string[]): HomeConfig {
  const config = getConfig();
  const next = { ...config, produtos_destaque_slugs: slugs };
  writeLs(next);
  return next;
}

export function reset(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(LS_KEY);
  }
}
