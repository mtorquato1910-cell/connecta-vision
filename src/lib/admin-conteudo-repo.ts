/**
 * Repository de conteúdo do site (textos editáveis).
 * Persistência em localStorage. Quando migrar para Postgres, troca o adapter.
 */

const LS_KEY = "conecta_admin_conteudo_v1";

export type ConteudoTipo = "texto" | "html" | "url" | "numero";
export type ConteudoPagina = "home" | "sobre" | "contato" | "global" | "footer";

export type ConteudoItem = {
  chave: string;
  valor: string;
  tipo: ConteudoTipo;
  pagina: ConteudoPagina;
  label: string;
  descricao?: string;
  multiline?: boolean;
};

// Estrutura padrão de conteúdo do site (default values)
export const DEFAULT_CONTEUDO: ConteudoItem[] = [
  // HOME
  {
    chave: "home.eyebrow",
    label: "Eyebrow do hero",
    valor: "Equipamentos veterinários premium",
    tipo: "texto",
    pagina: "home",
    descricao: "Linha pequena acima do título principal.",
  },
  {
    chave: "home.hero.titulo",
    label: "Título principal (Hero)",
    valor:
      "Equipamentos veterinários de origem — para quem não aceita aproximação clínica.",
    tipo: "texto",
    pagina: "home",
    multiline: true,
    descricao: "Headline grande do topo da home.",
  },
  {
    chave: "home.hero.subtitulo",
    label: "Subtítulo do hero",
    valor:
      "Distribuímos a linha completa Shinova no Brasil — anestesia, monitoramento, imagem, laboratório, odontologia, cirurgia, oftalmologia e estética veterinária.",
    tipo: "texto",
    pagina: "home",
    multiline: true,
  },
  {
    chave: "home.hero.cta_primario",
    label: "Texto botão primário (Hero)",
    valor: "Explorar catálogo",
    tipo: "texto",
    pagina: "home",
  },
  {
    chave: "home.hero.cta_secundario",
    label: "Texto botão secundário (Hero)",
    valor: "Falar com especialista",
    tipo: "texto",
    pagina: "home",
  },
  {
    chave: "home.depoimento.texto",
    label: "Depoimento — texto",
    valor:
      "A Conecta vai muito além de fornecer equipamentos. O suporte técnico e o treinamento da equipe fizeram toda a diferença na rotina da clínica.",
    tipo: "texto",
    pagina: "home",
    multiline: true,
  },
  {
    chave: "home.depoimento.autor",
    label: "Depoimento — autor",
    valor: "Dr. André Lopes",
    tipo: "texto",
    pagina: "home",
  },
  {
    chave: "home.depoimento.cargo",
    label: "Depoimento — cargo",
    valor: "VetClínica Premium, Belo Horizonte/MG",
    tipo: "texto",
    pagina: "home",
  },

  // SOBRE
  {
    chave: "sobre.eyebrow",
    label: "Eyebrow",
    valor: "Sobre a Conecta",
    tipo: "texto",
    pagina: "sobre",
  },
  {
    chave: "sobre.titulo",
    label: "Título",
    valor: "Tecnologia veterinária com origem técnica e suporte nacional.",
    tipo: "texto",
    pagina: "sobre",
    multiline: true,
  },
  {
    chave: "sobre.historia",
    label: "História",
    valor:
      "A Conecta Equipamentos Veterinários é a distribuidora oficial Shinova no Brasil. Fundada em Vespasiano/MG, atendemos clínicas, hospitais e universidades com importação direta, treinamento e suporte técnico nacional.",
    tipo: "texto",
    pagina: "sobre",
    multiline: true,
  },
  {
    chave: "sobre.missao",
    label: "Missão",
    valor:
      "Levar tecnologia veterinária de ponta a cada clínica do Brasil, com suporte técnico real e treinamento contínuo.",
    tipo: "texto",
    pagina: "sobre",
    multiline: true,
  },
  {
    chave: "sobre.visao",
    label: "Visão",
    valor:
      "Ser a referência nacional em distribuição de equipamentos veterinários Shinova até 2030.",
    tipo: "texto",
    pagina: "sobre",
    multiline: true,
  },

  // CONTATO
  {
    chave: "contato.eyebrow",
    label: "Eyebrow",
    valor: "Fale com a gente",
    tipo: "texto",
    pagina: "contato",
  },
  {
    chave: "contato.titulo",
    label: "Título",
    valor: "Estamos prontos para atender sua clínica.",
    tipo: "texto",
    pagina: "contato",
    multiline: true,
  },
  {
    chave: "contato.subtitulo",
    label: "Subtítulo",
    valor:
      "Responda o formulário ou fale direto pelo WhatsApp. Nossa equipe técnica retorna em até 1 dia útil.",
    tipo: "texto",
    pagina: "contato",
    multiline: true,
  },
  {
    chave: "contato.horario",
    label: "Horário de atendimento",
    valor: "Segunda a sexta · 8h às 18h",
    tipo: "texto",
    pagina: "contato",
  },

  // GLOBAL
  {
    chave: "global.topbar",
    label: "Texto da barra superior (TopBar)",
    valor:
      "Distribuição oficial Shinova no Brasil · Importação direta · Suporte técnico nacional",
    tipo: "texto",
    pagina: "global",
    multiline: true,
  },
  {
    chave: "global.whatsapp_msg",
    label: "Mensagem padrão do WhatsApp",
    valor:
      "Olá! Vim pelo site da Conecta e gostaria de saber mais sobre os equipamentos veterinários.",
    tipo: "texto",
    pagina: "global",
    multiline: true,
    descricao: "Aparece pré-preenchida ao clicar no botão WhatsApp.",
  },

  // FOOTER
  {
    chave: "footer.descricao",
    label: "Descrição do rodapé",
    valor:
      "Distribuidora oficial Shinova de equipamentos veterinários. Mais de 230 produtos com importação direta e suporte técnico nacional.",
    tipo: "texto",
    pagina: "footer",
    multiline: true,
  },
  {
    chave: "footer.copyright",
    label: "Copyright",
    valor: "© 2026 Conecta Equipamentos Veterinários. Todos os direitos reservados.",
    tipo: "texto",
    pagina: "footer",
  },
  {
    chave: "footer.lgpd_url",
    label: "URL Política de Privacidade",
    valor: "/politica-privacidade",
    tipo: "url",
    pagina: "footer",
  },
];

function readLs(): ConteudoItem[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ConteudoItem[];
  } catch {
    return null;
  }
}

function writeLs(items: ConteudoItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_KEY, JSON.stringify(items));
}

export function getAll(): ConteudoItem[] {
  return readLs() ?? DEFAULT_CONTEUDO;
}

export function getByPagina(pagina: ConteudoPagina): ConteudoItem[] {
  return getAll().filter((c) => c.pagina === pagina);
}

export function getValor(chave: string, fallback = ""): string {
  return getAll().find((c) => c.chave === chave)?.valor ?? fallback;
}

export function updateValor(chave: string, valor: string): void {
  const all = getAll();
  const idx = all.findIndex((c) => c.chave === chave);
  if (idx === -1) return;
  all[idx] = { ...all[idx], valor };
  writeLs(all);
}

export function reset(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(LS_KEY);
  }
}

export const PAGINA_LABELS: Record<ConteudoPagina, string> = {
  home: "Home",
  sobre: "Sobre",
  contato: "Contato",
  global: "Global",
  footer: "Rodapé",
};
