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
    endereco: "Av. Prefeito Sebastião Fernandes, 240, Centro, Shopping Premiere",
    cidade: "Vespasiano",
    estado: "MG",
    cep: "33200-318",
    missao:
      "Equipar cada clínica e hospital veterinário do Brasil com tecnologia importada de alta performance, instalada, calibrada e com a equipe treinada, sem intermediário inflando preço.",
    visao: "Ser a distribuidora veterinária de referência no Brasil, reconhecida por entregar equipamento certo, no prazo combinado, com suporte técnico que responde de verdade.",
  },
  contato: {
    email_comercial: "comercial@conectavet.com.br",
    email_suporte: "suporte@conectavet.com.br",
    telefone_principal: "(11) 94343-6177",
    telefone_principal_raw: "5511943436177",
    whatsapp: "(11) 94343-6177",
    whatsapp_raw: "5511943436177",
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
    meta_titulo_global: "Conecta, Equipamentos Veterinários Premium | Distribuidor Shinova",
    meta_descricao_global:
      "Distribuidor oficial Shinova no Brasil, com 300 clientes ativos. 230+ equipamentos veterinários importados, instalados, calibrados e com treinamento incluso. Entrega para todo o Brasil.",
    palavras_chave:
      "equipamentos veterinários, distribuidor shinova brasil, ultrassom veterinário, monitor multiparâmetros, anestesia veterinária, equipamento odontológico vet, hematológico veterinário",
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
