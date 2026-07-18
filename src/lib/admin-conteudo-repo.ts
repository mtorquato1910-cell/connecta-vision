/**
 * Repository de conteúdo do site (textos editáveis).
 * Persistência em localStorage. Quando migrar para Postgres, troca o adapter.
 */

const LS_KEY = "conecta_admin_conteudo_v1";

export type ConteudoTipo = "texto" | "html" | "url" | "numero";
export type ConteudoPagina = "home" | "sobre" | "solucoes" | "contato" | "global" | "footer";

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
    valor: "Distribuidor oficial Shinova no Brasil",
    tipo: "texto",
    pagina: "home",
    descricao: "Linha pequena acima do título principal.",
  },
  {
    chave: "home.hero.titulo",
    label: "Título principal (Hero)",
    valor:
      "Equipe sua clínica com tecnologia veterinária de verdade, instalada e calibrada por quem entende.",
    tipo: "texto",
    pagina: "home",
    multiline: true,
    descricao: "Headline grande do topo da home.",
  },
  {
    chave: "home.hero.subtitulo",
    label: "Subtítulo do hero",
    valor:
      "Somos o distribuidor oficial Shinova no Brasil, com a linha completa em um só fornecedor: anestesia, monitoramento, imagem, laboratório, odontologia, cirurgia, oftalmologia e estética veterinária. Mais de 230 equipamentos importados, instalados, calibrados e com treinamento da sua equipe incluído.",
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
    label: "Depoimento, texto (deixe vazio para ocultar a seção)",
    valor:
      "Montei boa parte do hospital com a Conecta. O equipamento chegou instalado, calibrado e com a equipe treinada, e o suporte responde no mesmo dia. Comprar de um fornecedor só, com representação oficial, economizou meses e simplificou tudo na estruturação.",
    tipo: "texto",
    pagina: "home",
    multiline: true,
    descricao: "Se este campo ficar vazio, a seção de depoimento some do site.",
  },
  {
    chave: "home.depoimento.autor",
    label: "Depoimento, autor",
    valor: "Dr. Henrique Vasconcellos",
    tipo: "texto",
    pagina: "home",
  },
  {
    chave: "home.depoimento.cargo",
    label: "Depoimento, cargo",
    valor: "Hospital Veterinário São Francisco · Belo Horizonte/MG",
    tipo: "texto",
    pagina: "home",
  },
  {
    chave: "home.sobre.eyebrow",
    label: "Bloco 'Quem somos', eyebrow",
    valor: "Quem somos",
    tipo: "texto",
    pagina: "home",
  },
  {
    chave: "home.sobre.titulo",
    label: "Bloco 'Quem somos', título",
    valor: "Uma distribuidora brasileira com tecnologia importada e suporte que responde.",
    tipo: "texto",
    pagina: "home",
    multiline: true,
  },
  {
    chave: "home.sobre.texto",
    label: "Bloco 'Quem somos', texto",
    valor:
      "A Conecta nasceu para acabar com o que cansava o veterinário no Brasil, catálogos cheios de marca de gaveta, suporte genérico e importação atravessada por intermediários que só inflam o preço sem agregar serviço algum.\n\nHoje somos distribuidor oficial da linha completa Shinova no país, com sede em Vespasiano/MG e entrega para todo o Brasil. Nosso compromisso é direto: equipamento certo, no prazo combinado, instalado, calibrado e com a sua equipe treinada para operar desde o primeiro dia.\n\nMais de 300 clientes ativos, entre clínicas, hospitais, universidades e centros de pesquisa, já operam com a Conecta, e essa rede cresce porque entregamos exatamente o que o catálogo promete.",
    tipo: "texto",
    pagina: "home",
    multiline: true,
    descricao: "Separe os parágrafos com uma linha em branco.",
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
    valor: "Tecnologia veterinária importada, entregue pronta para operar.",
    tipo: "texto",
    pagina: "sobre",
    multiline: true,
  },
  {
    chave: "sobre.historia",
    label: "História",
    valor:
      "A Conecta Equipamentos Veterinários é a distribuidora oficial Shinova no Brasil, com 300 clientes ativos em todo o país. Sediada em Vespasiano/MG, atende clínicas, hospitais e universidades com importação direta, equipamentos instalados e calibrados, treinamento da equipe e suporte técnico próprio.",
    tipo: "texto",
    pagina: "sobre",
    multiline: true,
  },

  // SOLUÇÕES
  {
    chave: "solucoes.eyebrow",
    label: "Eyebrow",
    valor: "Soluções por perfil",
    tipo: "texto",
    pagina: "solucoes",
  },
  {
    chave: "solucoes.titulo",
    label: "Título",
    valor: "Pacotes técnicos sob medida para cada operação veterinária.",
    tipo: "texto",
    pagina: "solucoes",
    multiline: true,
  },
  {
    chave: "solucoes.subtitulo",
    label: "Subtítulo",
    valor:
      "Da clínica de bairro ao hospital de referência, montamos o conjunto de equipamentos certo para o tamanho, o foco clínico e o orçamento do seu projeto, com instalação, calibração e treinamento da equipe inclusos. Você equipa em etapas, sem precisar decidir tudo de uma vez.",
    tipo: "texto",
    pagina: "solucoes",
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
    valor: "Fale com gente que entende de equipamento veterinário.",
    tipo: "texto",
    pagina: "contato",
    multiline: true,
  },
  {
    chave: "contato.subtitulo",
    label: "Subtítulo",
    valor:
      "Responda o formulário ou fale direto pelo WhatsApp. Nossa equipe técnica retorna em até 4 horas úteis, com uma proposta sob medida para a sua operação.",
    tipo: "texto",
    pagina: "contato",
    multiline: true,
  },

  // GLOBAL
  {
    chave: "global.topbar",
    label: "Texto da barra superior (TopBar)",
    valor:
      "🇧🇷 Distribuição oficial Shinova no Brasil · Representação oficial · Suporte técnico nacional",
    tipo: "texto",
    pagina: "global",
    multiline: true,
  },

  // FOOTER
  {
    chave: "footer.descricao",
    label: "Descrição do rodapé",
    valor:
      "Distribuidor oficial Shinova de equipamentos veterinários premium. Mais de 230 produtos importados, instalados, calibrados e com treinamento incluso, entregues para todo o Brasil.",
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
  solucoes: "Soluções",
  contato: "Contato",
  global: "Global",
  footer: "Rodapé",
};
