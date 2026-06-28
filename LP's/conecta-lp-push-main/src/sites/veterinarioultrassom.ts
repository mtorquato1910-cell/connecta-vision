import type { SiteConfig } from "@/lib/types";
import { dopscan10v, sonoscanE6V, sonoscanB5V } from "@/lib/products-ultrassom";

export const veterinarioultrassom: SiteConfig = {
  id: "veterinarioultrassom",
  domain: "veterinarioultrassom.com.br",
  lineName: "Linha de Ultrassom",
  countWord: "3 equipamentos",

  brand: {
    whatsapp: "5511943436177",
    phoneDisplay: "(11) 94343-6177",
    addressShort: "Vespasiano, MG",
    addressFull: "Av. Prefeito Sebastião Fernandes, 240 · Centro · Shopping Premiere · Vespasiano/MG",
    cnpj: "54.269.525/0001-56",
  },

  meta: {
    title: "Conecta · Ultrassom Veterinário",
    description:
      "Ultrassom veterinário, color doppler, portátil e de mão. Do diagnóstico abdominal e cardíaco à gestação no campo. Representação oficial, suporte nacional, garantia 12 meses.",
  },

  topbarHtml:
    "🇧🇷 Distribuição oficial Shinova no Brasil · <strong>Representação oficial</strong> · Suporte técnico nacional",

  hero: {
    eyebrow: "Ultrassom Veterinário",
    kicker: "Linha de Ultrassom Premium · Distribuição Conecta · Fabricação Shinova",
    titleHtml: 'Ultrassom veterinário que cabe na sua mão, <em class="text-accent">do consultório ao campo.</em>',
    subtitle:
      "Três aparelhos de ultrassom veterinário, color doppler, portátil e de mão, do diagnóstico abdominal e cardíaco à confirmação de gestação no campo, com representação oficial e suporte técnico nacional.",
    bulletsHtml: [
      "Color doppler, portátil e handheld em <strong>uma só linha</strong>",
      "Diagnóstico <strong>multiespécie</strong>, de pets a grandes rebanhos",
      "Representação oficial, <strong>sem intermediário inflando preço</strong>",
      "Suporte técnico nacional + garantia 12 meses + treinamento da equipe",
    ],
    ctaPrimary: "Ver os 3 equipamentos",
    cardTag: "LINHA DE ULTRASSOM 2026",
    cardTitle: "Ultrassom",
    cardImage: "/banco/ultrassom/ultrassom-abdominal-cao.png",
    cardStats: [
      ["3", "Equipamentos"],
      ["100%", "Representação oficial"],
      ["12 meses", "Garantia + suporte"],
    ],
    socialProofHtml:
      '<strong class="text-foreground">Mais de 300 clínicas e hospitais</strong> já operam com equipamentos distribuídos pela Conecta.',
  },

  benefits: {
    eyebrow: "Por que comprar Conecta",
    titleHtml:
      'Três razões pelas quais clínicas e produtores <em class="text-accent">escolhem nossa distribuição.</em>',
    items: [
      {
        n: "i.",
        title: "Do consultório ao campo, fornecedor único",
        p: "Color doppler de bancada, portátil de consultório e handheld de campo, três aparelhos que cobrem toda a demanda de imagem veterinária em uma única origem. Você simplifica compra, treinamento, manutenção e suporte.",
      },
      {
        n: "ii.",
        title: "Equipamentos veterinários de origem",
        p: "Pensados para fisiologia animal e multiespécie, de cães e gatos a bovinos, equinos, suínos e pequenos ruminantes. Softwares de reprodução e obstetrícia dedicados, com diagnóstico de gestação precoce.",
      },
      {
        n: "iii.",
        title: "Atendimento brasileiro",
        p: "Representação oficial sem intermediário. Suporte técnico nacional com resposta em até 4 horas úteis. Treinamento de uso à distância para sua equipe. Documentação fiscal completa. Garantia 12 meses respeitada pela própria Conecta, não terceirizada.",
      },
    ],
  },

  gallery: {
    eyebrow: "Linha de ultrassom · 3 equipamentos",
    titleHtml: 'Toque em qualquer aparelho <em class="text-accent not-italic font-display italic">para explorar.</em>',
    subtitle:
      "Três aparelhos que cobrem color doppler, ultrassom portátil e de mão, fornecidos como linha integrada pela Conecta.",
  },

  applications: {
    eyebrow: "Aplicações",
    titleHtml: 'Onde a linha de ultrassom Conecta <em class="text-accent">se encaixa na sua operação.</em>',
    cards: [
      {
        title: "Abdominal e cardiológico",
        p: "Avaliação de órgãos e fluxo sanguíneo com color doppler de alta definição. Sistema DopScan 10V com estação de trabalho e DICOM 3.0.",
        img: "/banco/ultrassom/ultrassom-egua-haras.png",
      },
      {
        title: "Reprodução e gestação no campo",
        p: "Confirmação de prenhez precoce em bovinos, suínos e pequenos ruminantes. Handheld SonoScan B5V, 0,48 kg, à prova do dia a dia da fazenda.",
        img: "/banco/ultrassom/ultrassom-gestacao-vaca-campo.png",
      },
      {
        title: "Atendimento portátil em consultório",
        p: "Exame rápido à beira do paciente com bateria de 200+ minutos. Portátil SonoScan E6V com tela LED de 10,4\" e software obstétrico.",
        img: "/banco/ultrassom/ultrassom-gato-portatil.png",
      },
      {
        title: "Diagnóstico multiespécie",
        p: "De pets a grandes animais, transdutores e modos de imagem que se adaptam a cada porte e exame, do pequeno ao grande.",
        img: "/banco/ultrassom/vaca-pasto-retrato.png",
      },
    ],
  },

  testimonial: {
    quote:
      "Eu tinha um aparelho parado de consertar e outro que não saía do consultório. Com a linha da Conecta resolvi os dois mundos, o doppler na clínica e o handheld no campo, com suporte que responde de verdade. O diagnóstico de gestação ficou mais rápido e confiável.",
    name: "Dr. Otávio Resende",
    role: "Clínica e Reprodução Animal · Uberaba/MG",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=120&q=80",
  },

  faq: [
    {
      q: "Posso comprar os 3 aparelhos juntos ou só um?",
      a: "Pode comprar como achar melhor. Trabalhamos com pacote (com condição comercial diferenciada) e com aquisição individual. Muitos clientes começam com o aparelho que mais usam, doppler na clínica ou handheld no campo, e expandem depois. Faz orçamento do que faz sentido para sua operação.",
    },
    {
      q: "Qual o prazo de entrega?",
      a: "Prazo de entrega de 60 a 90 dias. São equipamentos importados de alta tecnologia, produzidos sob demanda, por isso o prazo reflete a fabricação e a representação oficial, sem intermediário inflando preço. Todo equipamento chega instalado, comissionado, calibrado e com treinamento operacional incluso.",
    },
    {
      q: "Quais transdutores e espécies são atendidos?",
      a: "A linha cobre transdutores convexos, lineares e retais conforme o aparelho, atendendo pets (cães e gatos) e grandes animais (bovinos, equinos, suínos, ovinos e caprinos). Detalhamos os transdutores ideais para sua rotina na proposta personalizada.",
    },
    {
      q: "Os equipamentos têm certificação Anvisa?",
      a: "Os equipamentos têm certificação CE (Conformidade Europeia) e ISO 13485 do fabricante. Para uso exclusivamente veterinário no Brasil não há exigência de registro Anvisa. Fornecemos toda a documentação fiscal e técnica que acompanha cada equipamento.",
    },
    {
      q: "Vocês entregam em todo o Brasil?",
      a: "Sim, cobertura nacional nas 26 UFs + Distrito Federal. Transportadora especializada em equipamento médico-hospitalar com seguro completo. Coordenamos a instalação técnica e o treinamento da equipe.",
    },
  ],

  quote: {
    titleHtml: 'Cada rotina de imagem é única. <em class="text-accent">Sua proposta também precisa ser.</em>',
    subtitle:
      "Conta o que você precisa, doppler de bancada, portátil de consultório, handheld de campo ou tudo junto. Devolvemos uma proposta sob medida com transdutores, treinamento e condições.",
    bulletsHtml: [
      "Resposta em até 4 horas úteis, direto com nossa equipe técnica",
      "Proposta personalizada com transdutores, acessórios, treinamento e condições",
      "Sem compromisso de compra, se não fizer sentido para você, sem problema.",
      "Dados confidenciais, suas informações não vão fora da Conecta",
    ],
    stats: [
      ["~4h", "tempo médio de resposta"],
      ["300+", "clientes atendidos"],
    ],
    packageLabel: "Pacote completo (todos os 3)",
  },

  footerCatalog: [
    "Ultrassom color doppler",
    "Ultrassom portátil",
    "Ultrassom de mão",
    "Transdutores e probes",
    "Acessórios e suporte",
  ],
  footerBlurb:
    "Distribuição oficial de equipamentos veterinários premium. Representação oficial, suporte técnico nacional, garantia respeitada.",

  products: [dopscan10v, sonoscanE6V, sonoscanB5V],
};
