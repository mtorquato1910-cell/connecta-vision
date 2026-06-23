import type { SiteConfig } from "@/lib/types";
import { products } from "@/lib/products";

export const cirugiavet: SiteConfig = {
  id: "cirugiavet",
  domain: "cirugiavet.com.br",
  lineName: "Linha Cirúrgica",
  countWord: "7 equipamentos",

  brand: {
    whatsapp: "5511943436177",
    phoneDisplay: "(11) 94343-6177",
    addressShort: "Vespasiano, MG",
    addressFull: "Av. Prefeito Sebastião Fernandes, 240 · Centro · Shopping Premiere · Vespasiano/MG",
    cnpj: "54.269.525/0001-56",
  },

  meta: {
    title: "Conecta · Material Cirúrgico Veterinário",
    description:
      "Distribuição oficial de equipamentos cirúrgicos veterinários, anestesia, ventilação, monitor, desfibrilador, foco LED, bisturi ultrassônico e vessel sealing. Representação oficial, suporte nacional, garantia 12 meses.",
  },

  topbarHtml:
    "🇧🇷 Distribuição oficial Shinova no Brasil · <strong>Representação oficial</strong> · Suporte técnico nacional",

  hero: {
    eyebrow: "Material Cirúrgico Veterinário",
    kicker: "Linha Cirúrgica Premium · Distribuição Conecta · Fabricação Shinova",
    titleHtml: 'Centro cirúrgico veterinário completo, <em class="text-accent">com um fornecedor só.</em>',
    subtitle:
      "Equipamentos para o centro cirúrgico veterinário, anestesia, ventilação, monitoramento multiparâmetros, foco LED e bisturi ultrassônico, com representação oficial e suporte técnico nacional.",
    bulletsHtml: [
      "Anestesia, ventilação, monitoramento, iluminação e eletrocirurgia em <strong>uma só linha</strong>",
      "Equipamentos veterinários de origem, <strong>multiespécie</strong>",
      "Representação oficial, <strong>sem intermediário inflando preço</strong>",
      "Suporte técnico nacional, garantia de 12 meses e treinamento da equipe",
    ],
    ctaPrimary: "Ver os 7 equipamentos",
    cardTag: "LINHA CIRÚRGICA 2026",
    cardTitle: "Sala Cirúrgica",
    cardImage: "/banco/material-cirurgico/veterinaria-aparelho-anestesia.png",
    cardStats: [
      ["7", "Equipamentos cirúrgicos"],
      ["100%", "Representação oficial"],
      ["12 meses", "Garantia + suporte"],
    ],
    socialProofHtml:
      '<strong class="text-foreground">Mais de 300 clínicas e hospitais</strong> já operam com equipamentos distribuídos pela Conecta.',
  },

  benefits: {
    eyebrow: "Por que comprar Conecta",
    titleHtml:
      'Três razões pelas quais clínicas premium <em class="text-accent">escolhem nossa distribuição.</em>',
    items: [
      {
        n: "i.",
        title: "Linha completa, fornecedor único",
        p: "De anestesia portátil a vessel sealing, sete equipamentos cirúrgicos chave em uma única origem. Você simplifica compra, treinamento, manutenção e suporte. Sem cinco fornecedores diferentes para montar uma sala cirúrgica completa.",
      },
      {
        n: "ii.",
        title: "Equipamentos veterinários de origem",
        p: "Algoritmos calibrados para fisiologia animal, cães, gatos, equinos, ruminantes, exóticos. Não é equipamento humano adaptado às pressas. É linha dedicada à medicina veterinária com manguitos por porte, modos cirúrgicos pensados para anestesia inalatória prolongada.",
      },
      {
        n: "iii.",
        title: "Atendimento brasileiro",
        p: "Representação oficial sem intermediário. Suporte técnico nacional com resposta em até 4 horas úteis. Treinamento de uso à distância para sua equipe. Documentação fiscal completa. Garantia 12 meses respeitada pela própria Conecta, não terceirizada.",
      },
    ],
  },

  gallery: {
    eyebrow: "Linha cirúrgica · 7 equipamentos",
    titleHtml: 'Toque em qualquer equipamento <em class="text-accent not-italic font-display italic">para explorar.</em>',
    subtitle:
      "Sete equipamentos premium que cobrem anestesia, ventilação, monitoramento, emergência, iluminação e cirurgia avançada, fornecidos como linha integrada pela Conecta.",
  },

  applications: {
    eyebrow: "Aplicações",
    titleHtml: 'Onde a linha cirúrgica Conecta <em class="text-accent">se encaixa na sua operação.</em>',
    cards: [
      {
        title: "Cirurgias de tecidos moles",
        p: "Castração, OSH, esplenectomia, gastrotomia. Combinação ideal: anestesia AneCompact + ventilador LifeSaver-T + monitor Moni 3L + vessel sealing LS-150.",
        img: "/banco/material-cirurgico/cao-anestesia-mesa-cirurgica.png",
      },
      {
        title: "Cirurgias ortopédicas",
        p: "Procedimentos prolongados onde a estabilidade hemodinâmica importa. Monitor Moni 3L + foco cirúrgico LEDBL-7070 + desfibrilador DM8D-II em prontidão.",
        img: "/banco/material-cirurgico/gato-monitor-multiparametrico.png",
      },
      {
        title: "Cirurgias minimamente invasivas",
        p: "Laparoscopia veterinária e procedimentos com mínimo sangramento. Bisturi ultrassônico LS-120A + vessel sealing LS-150 + monitor multiparâmetros.",
        img: "/banco/material-cirurgico/equipe-veterinaria-sala-cirurgica.png",
      },
      {
        title: "Centros equino/bovino",
        p: "Grandes animais, ambiente de campo. Equipamentos portáteis com bateria longa, AneCompact portátil + DM8D-II em emergências.",
        img: "/banco/material-cirurgico/bisturi-foco-cirurgico-led.png",
      },
    ],
  },

  testimonial: {
    quote:
      "Montar uma sala cirúrgica do zero com fornecedor único economizou meses de coordenação. A Conecta entregou os sete equipamentos, validou compatibilidade entre eles e treinou minha equipe em duas tardes. Resolveu o que três distribuidores não tinham resolvido em seis meses.",
    name: "Dr. Henrique Vasconcellos",
    role: "Hospital Veterinário São Francisco · Belo Horizonte/MG",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=120&q=80",
  },

  faq: [
    {
      q: "Posso comprar os 7 equipamentos juntos ou só alguns?",
      a: "Pode comprar como achar melhor. Trabalhamos tanto com pacote completo (com condição comercial diferenciada) quanto com aquisição parcial. Muitos clientes começam com 2 ou 3 equipamentos e expandem a linha cirúrgica ao longo de 6-12 meses. Faz orçamento da configuração que faz sentido para sua operação atual.",
    },
    {
      q: "Qual o prazo de entrega?",
      a: "Prazo de entrega de 60 a 90 dias. São equipamentos importados de alta tecnologia, produzidos sob demanda, por isso o prazo reflete a fabricação e a representação oficial, sem intermediário inflando preço. Todo equipamento chega instalado, comissionado, calibrado e com treinamento operacional incluso.",
    },
    {
      q: "Como funciona o treinamento da equipe?",
      a: "Todo equipamento é instalado, comissionado e calibrado, com treinamento operacional fornecido para sua equipe. Disponibilizamos também acompanhamento à distância e materiais de consulta em português para que a equipe domine o uso com segurança desde o primeiro procedimento.",
    },
    {
      q: "Os equipamentos têm certificação Anvisa?",
      a: "Os equipamentos têm certificação CE (Conformidade Europeia) e ISO 13485 do fabricante. Para uso exclusivamente veterinário no Brasil não há exigência de registro Anvisa. Fornecemos toda a documentação fiscal e técnica que acompanha cada equipamento.",
    },
    {
      q: "Vocês entregam em todo o Brasil?",
      a: "Sim, cobertura nacional nas 26 UFs + Distrito Federal. Transportadora especializada em equipamento médico-hospitalar com seguro completo. Coordenamos a instalação técnica local, inclusive para os equipamentos maiores.",
    },
  ],

  quote: {
    titleHtml: 'Cada operação clínica é única. <em class="text-accent">Sua proposta também precisa ser.</em>',
    subtitle:
      "Conta o que você precisa equipar, anestesia, monitoramento, cirurgia avançada ou tudo junto. Devolvemos uma proposta sob medida com prazos, condições e treinamento incluso.",
    bulletsHtml: [
      "Resposta em até 4 horas úteis, direto com nossa equipe técnica",
      "Proposta personalizada com pacote, acessórios, treinamento e condições",
      "Sem compromisso de compra, se não fizer sentido para você, sem problema.",
      "Dados confidenciais, suas informações não vão fora da Conecta",
    ],
    stats: [
      ["~4h", "tempo médio de resposta"],
      ["300+", "clientes atendidos"],
    ],
    packageLabel: "Pacote completo (todos os 7)",
  },

  footerCatalog: [
    "Anestesia",
    "Ventilação",
    "Monitor multiparâmetros",
    "Desfibrilador",
    "Foco LED",
    "Bisturi ultrassônico",
    "Vessel sealing",
    "Suprimentos cirúrgicos",
  ],
  footerBlurb:
    "Distribuição oficial de equipamentos veterinários premium. Representação oficial, suporte técnico nacional, garantia respeitada.",

  products,
};
