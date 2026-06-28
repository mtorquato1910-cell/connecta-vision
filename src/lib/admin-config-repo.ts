/**
 * Repository de configurações da empresa (chave → JSON).
 */

const LS_KEY = "conecta_admin_config_v2";

export type ConfigEmpresa = {
  nome: string;
  nome_curto: string;
  cnpj: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  missao: string;
  visao: string;
};

export type ConfigContato = {
  email_comercial: string;
  email_suporte: string;
  telefone_principal: string;
  telefone_principal_raw: string;
  whatsapp: string;
  whatsapp_raw: string;
  whatsapp_msg_padrao: string;
  horario_atendimento: string;
};

export type ConfigRedes = {
  instagram: string;
  facebook: string;
  linkedin: string;
  youtube: string;
};

export type ConfigSEO = {
  meta_titulo_global: string;
  meta_descricao_global: string;
  palavras_chave: string;
  og_imagem_url: string;
  google_analytics_id: string;
  google_search_console_token: string;
};

export type ConfigAll = {
  empresa: ConfigEmpresa;
  contato: ConfigContato;
  redes: ConfigRedes;
  seo: ConfigSEO;
};

export const DEFAULT_CONFIG: ConfigAll = {
  empresa: {
    nome: "Conecta Equipamentos Veterinários",
    nome_curto: "Conecta",
    cnpj: "54.269.525/0001-56",
    endereco: "Av. Prefeito Sebastião Fernandes, 240, Loja 108, Centro",
    cidade: "Vespasiano",
    estado: "MG",
    cep: "33200-318",
    missao:
      "Levar tecnologia veterinária de ponta a cada clínica do Brasil, com suporte técnico real.",
    visao: "Ser a referência nacional em distribuição de equipamentos veterinários Shinova até 2030.",
  },
  contato: {
    email_comercial: "comercial@conectavet.com.br",
    email_suporte: "suporte@conectavet.com.br",
    telefone_principal: "(31) 9000-0000",
    telefone_principal_raw: "5531900000000",
    whatsapp: "(31) 9000-0000",
    whatsapp_raw: "5531900000000",
    whatsapp_msg_padrao:
      "Olá! Vim pelo site da Conecta e gostaria de saber mais sobre os equipamentos veterinários.",
    horario_atendimento: "Segunda a sexta · 8h às 18h",
  },
  redes: {
    instagram: "https://www.instagram.com/conectavet2026/",
    facebook: "",
    linkedin: "",
    youtube: "",
  },
  seo: {
    meta_titulo_global: "Conecta, Equipamentos Veterinários | Distribuidora Shinova Brasil",
    meta_descricao_global:
      "Distribuidor oficial Shinova no Brasil. 230+ equipamentos veterinários: anestesia, imagem, laboratório, odontologia e mais.",
    palavras_chave:
      "equipamentos veterinários, shinova brasil, monitor multiparâmetros, ultrassom veterinário, hematológico vet",
    og_imagem_url: "/icon-512.png",
    google_analytics_id: "",
    google_search_console_token: "",
  },
};

function readLs(): ConfigAll | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ConfigAll;
  } catch {
    return null;
  }
}

function writeLs(config: ConfigAll) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_KEY, JSON.stringify(config));
}

export function getAll(): ConfigAll {
  return readLs() ?? DEFAULT_CONFIG;
}

export function updateGroup<K extends keyof ConfigAll>(
  group: K,
  data: Partial<ConfigAll[K]>,
): ConfigAll {
  const current = getAll();
  const updated: ConfigAll = { ...current, [group]: { ...current[group], ...data } };
  writeLs(updated);
  return updated;
}

export function reset(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(LS_KEY);
  }
}
