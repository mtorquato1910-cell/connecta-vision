import type { SiteConfig, Product } from "@/lib/types";
import { cirugiavet } from "./cirugiavet";
import { equipamentodentalvet } from "./equipamentodentalvet";
import { analiseveterinaria } from "./analiseveterinaria";
import { endoscopiaveterinario } from "./endoscopiaveterinario";
import { microscopiodermatologico } from "./microscopiodermatologico";
import { dopscan10v } from "@/lib/products-ultrassom";

// Catálogo geral: reaproveita produtos já definidos nas outras LPs (sem duplicar).
const pick = (cfg: SiteConfig, id: string): Product => {
  const p = cfg.products.find((x) => x.id === id);
  if (!p) throw new Error(`Produto "${id}" não encontrado em ${cfg.id}`);
  return p;
};

const catalogProducts: Product[] = [
  // Cirúrgico
  pick(cirugiavet, "anecompact"),
  pick(cirugiavet, "lifesaver-t"),
  pick(cirugiavet, "moni-3l"),
  pick(cirugiavet, "led-lamp"),
  pick(cirugiavet, "ls-120a"),
  // Odontologia
  pick(equipamentodentalvet, "du-100"),
  pick(equipamentodentalvet, "dx10p-cr"),
  // Ultrassom
  dopscan10v,
  // Laboratório
  pick(analiseveterinaria, "chemo-120v"),
  pick(analiseveterinaria, "hemo-5diff"),
  // Endoscopia
  pick(endoscopiaveterinario, "bronchoscope"),
  pick(endoscopiaveterinario, "wireless-cam"),
  pick(endoscopiaveterinario, "rae-105"),
  // Microscopia
  pick(microscopiodermatologico, "dm-500l"),
];

export const equipamentovet: SiteConfig = {
  id: "equipamentovet",
  domain: "equipamentovet.com.br",
  lineName: "Catálogo Veterinário",
  countWord: "14 equipamentos",

  brand: {
    whatsapp: "5511943436177",
    phoneDisplay: "(11) 94343-6177",
    addressShort: "Vespasiano, MG",
    addressFull: "Av. Prefeito Sebastião Fernandes, 240 · Centro · Shopping Premiere · Vespasiano/MG",
    cnpj: "54.269.525/0001-56",
  },

  meta: {
    title: "Conecta · Equipamentos Veterinários",
    description:
      "Catálogo de equipamentos veterinários, cirurgia, anestesia, monitoramento, odontologia, ultrassom, laboratório, endoscopia e microscopia. Representação oficial, suporte nacional, garantia 12 meses.",
  },

  topbarHtml:
    "🇧🇷 Equipamentos veterinários importados · <strong>Representação oficial</strong> · Suporte técnico nacional",

  hero: {
    eyebrow: "Equipamentos Veterinários",
    kicker: "Catálogo Premium · Distribuição Conecta · Representação oficial",
    titleHtml: 'Equipamentos veterinários — <em class="text-accent">de anestesia a microscopia, em um só lugar.</em>',
    subtitle:
      "Um catálogo que cobre toda a clínica veterinária, cirurgia, anestesia, monitoramento, odontologia, ultrassom, laboratório, endoscopia e microscopia, com representação oficial e suporte técnico nacional.",
    bulletsHtml: [
      "Cirurgia, diagnóstico, imagem e laboratório em <strong>um só fornecedor</strong>",
      "Equipamentos <strong>veterinários de origem</strong>, multiespécie",
      "Representação oficial, <strong>sem intermediário inflando preço</strong>",
      "Suporte técnico nacional + garantia 12 meses + treinamento da equipe",
    ],
    ctaPrimary: "Ver o catálogo",
    cardTag: "CATÁLOGO VETERINÁRIO 2026",
    cardTitle: "Equipamentos",
    cardImage: "/banco/catalogo-geral/veterinaria-gato-colo-hero.png",
    cardStats: [
      ["14", "Equipamentos"],
      ["100%", "Representação oficial"],
      ["12 meses", "Garantia + suporte"],
    ],
    socialProofHtml:
      '<strong class="text-foreground">Mais de 300 clínicas e hospitais</strong> já operam com equipamentos distribuídos pela Conecta.',
  },

  benefits: {
    eyebrow: "Por que comprar Conecta",
    titleHtml:
      'Três razões pelas quais clínicas e hospitais <em class="text-accent">escolhem nossa distribuição.</em>',
    items: [
      {
        n: "i.",
        title: "Clínica inteira, fornecedor único",
        p: "Do centro cirúrgico ao laboratório, do raio-X odontológico à microscopia, equipa toda a operação em uma única origem. Você simplifica compra, treinamento, manutenção e suporte, sem montar a clínica com dezenas de fornecedores.",
      },
      {
        n: "ii.",
        title: "Equipamentos veterinários de origem",
        p: "Calibrados para fisiologia animal e multiespécie, cães, gatos, equinos, bovinos, suínos e exóticos. Não é equipamento humano adaptado às pressas: é linha dedicada à medicina veterinária, de fabricantes de referência.",
      },
      {
        n: "iii.",
        title: "Atendimento brasileiro",
        p: "Representação oficial sem intermediário. Suporte técnico nacional com resposta em até 4 horas úteis. Treinamento de uso à distância para sua equipe. Documentação fiscal completa. Garantia 12 meses respeitada pela própria Conecta, não terceirizada.",
      },
    ],
  },

  gallery: {
    eyebrow: "Catálogo · 14 equipamentos",
    titleHtml: 'Toque em qualquer equipamento <em class="text-accent not-italic font-display italic">para explorar.</em>',
    subtitle:
      "Catálogo integrado que cobre cirurgia, anestesia, monitoramento, odontologia, ultrassom, laboratório, endoscopia e microscopia, tudo distribuído pela Conecta.",
  },

  applications: {
    eyebrow: "Áreas atendidas",
    titleHtml: 'Onde o catálogo Conecta <em class="text-accent">equipa a sua clínica.</em>',
    cards: [
      {
        title: "Centro cirúrgico",
        p: "Anestesia, ventilação, monitoramento multiparâmetros, foco LED e bisturi ultrassônico para montar a sala cirúrgica completa.",
        img: "/banco/catalogo-geral/vet-cao-grande-porte.png",
      },
      {
        title: "Laboratório e diagnóstico",
        p: "Bioquímica e hematologia para rotina de exames, com resultado rápido e parâmetros veterinários dedicados.",
        img: "/banco/catalogo-geral/veterinario-cavalo-campo.png",
      },
      {
        title: "Imagem e endoscopia",
        p: "Ultrassom color doppler, broncoscópio e câmera de endoscopia sem fio para diagnóstico por imagem minimamente invasivo.",
        img: "/banco/catalogo-geral/retrato-coelho.png",
      },
      {
        title: "Odontologia e microscopia",
        p: "Unidade odontológica móvel, raio-X intraoral e microscópio digital para odontologia, dermatologia e citologia.",
        img: "/banco/catalogo-geral/equipe-veterinaria-clinica-moderna.png",
      },
    ],
  },

  testimonial: {
    quote:
      "Eu montei a clínica quase toda com a Conecta, centro cirúrgico, laboratório e a parte de imagem. Comprar de um fornecedor só, com representação oficial, treinamento e suporte que responde, economizou meses e simplificou a manutenção. Foi a decisão mais acertada da estruturação.",
    name: "Dr. Eduardo Lima",
    role: "Hospital Veterinário Pleno · Belo Horizonte/MG",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=120&q=80",
  },

  faq: [
    {
      q: "Posso comprar os equipamentos juntos ou separados?",
      a: "Como achar melhor. Trabalhamos com pacotes (com condição comercial diferenciada) e com aquisição individual. Muitas clínicas estruturam por etapas, centro cirúrgico, depois laboratório, depois imagem. Faz orçamento da configuração que faz sentido para sua operação atual.",
    },
    {
      q: "Qual o prazo de entrega?",
      a: "Prazo de entrega de 60 a 90 dias. São equipamentos importados de alta tecnologia, produzidos sob demanda, por isso o prazo reflete a fabricação e a representação oficial, sem intermediário inflando preço. Todo equipamento chega instalado, comissionado, calibrado e com treinamento operacional incluso.",
    },
    {
      q: "Vocês ajudam a planejar a estruturação da clínica?",
      a: "Sim. A gente entende a sua rotina e o porte da operação e monta uma proposta combinando os equipamentos certos para cada etapa, com prioridades e orçamento. Você não precisa decidir tudo de uma vez.",
    },
    {
      q: "Os equipamentos têm certificação Anvisa?",
      a: "Os equipamentos têm certificação do fabricante (CE / ISO 13485 nos itens Shinova). Para uso exclusivamente veterinário no Brasil não há exigência de registro Anvisa. Fornecemos toda a documentação fiscal e técnica que acompanha cada equipamento.",
    },
    {
      q: "Vocês entregam em todo o Brasil?",
      a: "Sim, cobertura nacional nas 26 UFs + Distrito Federal. Transportadora especializada em equipamento médico-hospitalar com seguro completo. Coordenamos a instalação técnica e o treinamento da equipe.",
    },
  ],

  quote: {
    titleHtml: 'Vai estruturar ou expandir sua clínica? <em class="text-accent">Faça seu orçamento.</em>',
    subtitle:
      "Conta o que você precisa equipar, centro cirúrgico, laboratório, imagem, odontologia ou tudo junto. Devolvemos uma proposta sob medida com equipamentos, treinamento e condições.",
    bulletsHtml: [
      "Resposta em até 4 horas úteis, direto com nossa equipe técnica",
      "Proposta personalizada por etapas, com equipamentos, treinamento e condições",
      "Sem compromisso de compra, se não fizer sentido para você, sem problema.",
      "Dados confidenciais, suas informações não vão fora da Conecta",
    ],
    stats: [
      ["~4h", "tempo médio de resposta"],
      ["300+", "clientes atendidos"],
    ],
    packageLabel: "Pacote completo (estruturar a clínica)",
  },

  footerCatalog: [
    "Centro cirúrgico",
    "Anestesia e monitoramento",
    "Odontologia",
    "Ultrassom e imagem",
    "Laboratório",
    "Endoscopia",
    "Microscopia",
  ],
  footerBlurb:
    "Distribuição oficial de equipamentos veterinários premium. Representação oficial, suporte técnico nacional, garantia respeitada.",

  products: catalogProducts,
};
