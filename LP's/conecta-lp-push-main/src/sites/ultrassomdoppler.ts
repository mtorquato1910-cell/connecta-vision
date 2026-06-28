import type { SiteConfig } from "@/lib/types";
import { dopscan10v } from "@/lib/products-ultrassom";

export const ultrassomdoppler: SiteConfig = {
  id: "ultrassomdoppler",
  domain: "ultrassomdoppler.com.br",
  lineName: "Color Doppler",
  countWord: "DopScan 10V",

  brand: {
    whatsapp: "5511943436177",
    phoneDisplay: "(11) 94343-6177",
    addressShort: "Vespasiano, MG",
    addressFull: "Av. Prefeito Sebastião Fernandes, 240 · Centro · Shopping Premiere · Vespasiano/MG",
    cnpj: "54.269.525/0001-56",
  },

  meta: {
    title: "Conecta · Ultrassom Color Doppler Veterinário",
    description:
      "DopScan 10V, sistema de ultrassom color doppler veterinário totalmente digital, com estação de trabalho 500 GB e DICOM 3.0. Representação oficial, suporte nacional, garantia 12 meses.",
  },

  topbarHtml:
    "🇧🇷 Distribuição oficial Shinova no Brasil · <strong>Representação oficial</strong> · Suporte técnico nacional",

  hero: {
    eyebrow: "Ultrassom Color Doppler Veterinário",
    kicker: "DopScan 10V · Distribuição Conecta · Fabricação Shinova",
    titleHtml: 'DopScan 10V, <em class="text-accent">color doppler veterinário digital de alta definição.</em>',
    subtitle:
      "O DopScan 10V é a plataforma color doppler totalmente digital da Shinova: síntese multifeixe, foco dinâmico em tempo real, estação de trabalho de 500 GB e DICOM 3.0. Representação oficial e suporte técnico nacional.",
    bulletsHtml: [
      "Color doppler <strong>totalmente digital</strong> com síntese multifeixe",
      "Estação de trabalho <strong>500 GB</strong> + compatibilidade <strong>DICOM 3.0</strong>",
      "Transdutores convexo, linear e retal para <strong>cada exame</strong>",
      "Representação oficial + suporte nacional + garantia 12 meses + treinamento",
    ],
    ctaPrimary: "Ver o equipamento",
    cardTag: "COLOR DOPPLER 2026",
    cardTitle: "DopScan 10V",
    cardImage: "/banco/color-doppler/ecocardiograma-cao-doppler.png",
    cardStats: [
      ["500 GB", "Estação integrada"],
      ["DICOM 3.0", "Integração de imagem"],
      ["12 meses", "Garantia + suporte"],
    ],
    socialProofHtml:
      '<strong class="text-foreground">Mais de 300 clínicas e hospitais</strong> já operam com equipamentos distribuídos pela Conecta.',
  },

  benefits: {
    eyebrow: "Por que comprar Conecta",
    titleHtml:
      'Três razões para trazer o DopScan 10V <em class="text-accent">com a nossa distribuição.</em>',
    items: [
      {
        n: "i.",
        title: "Representação oficial, preço sem intermediário",
        p: "Você compra direto da distribuição oficial Shinova no Brasil, sem camadas de revenda inflando o preço. O mesmo equipamento premium, com condição comercial mais justa e documentação fiscal completa.",
      },
      {
        n: "ii.",
        title: "Equipamento veterinário de origem",
        p: "Plataforma totalmente digital com software de medição e cálculo pensado para rotina clínica veterinária, abdominal, cardíaco, reprodutivo e vascular. Não é equipamento humano adaptado às pressas.",
      },
      {
        n: "iii.",
        title: "Atendimento brasileiro",
        p: "Suporte técnico nacional com resposta em até 4 horas úteis. Treinamento de uso à distância para sua equipe. Garantia 12 meses respeitada pela própria Conecta, não terceirizada.",
      },
    ],
  },

  gallery: {
    eyebrow: "Color Doppler · DopScan 10V",
    titleHtml: 'Conheça o DopScan 10V <em class="text-accent not-italic font-display italic">em detalhe.</em>',
    subtitle:
      "Toque no equipamento para ver as fotos, a descrição completa e a ficha técnica do sistema color doppler.",
  },

  applications: {
    eyebrow: "Aplicações",
    titleHtml: 'Onde o DopScan 10V <em class="text-accent">faz a diferença na sua clínica.</em>',
    cards: [
      {
        title: "Cardiologia veterinária",
        p: "Color doppler para avaliar fluxo, função valvar e hemodinâmica cardíaca em cães e gatos com precisão.",
        img: "/banco/color-doppler/gato-exame-cardiaco.png",
      },
      {
        title: "Abdominal e urinário",
        p: "Avaliação de fígado, rins, bexiga e vascularização de órgãos com imagem digital de alta definição.",
        img: "/banco/color-doppler/equipe-cardio-veterinaria.png",
      },
      {
        title: "Reprodução e gestação",
        p: "Acompanhamento de prenhez, vascularização uterina e estruturas reprodutivas com transdutores dedicados.",
        img: "/banco/color-doppler/gato-monitorado-eletrodos.png",
      },
      {
        title: "Vascular e pequenas estruturas",
        p: "Mapeamento de fluxo e estruturas finas com síntese multifeixe e foco dinâmico em tempo real.",
        img: "/banco/color-doppler/vet-tela-equipamento-doppler.png",
      },
    ],
  },

  testimonial: {
    quote:
      "Eu adiava trocar o aparelho de ultrassom por causa do preço e do suporte. Comprando direto pela Conecta, o color doppler saiu por uma condição que cabia, com treinamento e um suporte que realmente responde. Hoje resolvo cardiologia e reprodução dentro da própria clínica.",
    name: "Dra. Camila Ferraz",
    role: "Clínica Veterinária Vida Animal · Betim/MG",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=120&q=80",
  },

  faq: [
    {
      q: "O DopScan 10V serve para quais exames?",
      a: "Cobre exames abdominais, cardiológicos (color doppler), reprodutivos e vasculares, além de pequenas estruturas, em pequenos e grandes animais, conforme o transdutor utilizado. O software de medição e cálculo atende a demanda clínica do dia a dia.",
    },
    {
      q: "Quais transdutores acompanham?",
      a: "Configuração padrão com transdutor micro-convexo de 6.5 MHz e linear de 7.5 MHz. Como opcionais, há o convexo multifrequência de 3.5 MHz e o linear retal de 6.5 MHz. Indicamos a melhor combinação para sua rotina na proposta.",
    },
    {
      q: "Qual o prazo de entrega?",
      a: "Prazo de entrega de 60 a 90 dias. É um equipamento importado de alta tecnologia, produzido sob demanda, por isso o prazo reflete a fabricação e a representação oficial, sem intermediário inflando preço. Chega instalado, comissionado, calibrado e com treinamento operacional incluso.",
    },
    {
      q: "Tem certificação Anvisa?",
      a: "O equipamento tem certificação CE (Conformidade Europeia) e ISO 13485 do fabricante. Para uso exclusivamente veterinário no Brasil não há exigência de registro Anvisa. Fornecemos toda a documentação fiscal e técnica.",
    },
    {
      q: "Vocês entregam em todo o Brasil?",
      a: "Sim, cobertura nacional nas 26 UFs + Distrito Federal. Transportadora especializada em equipamento médico-hospitalar com seguro completo. Coordenamos a instalação técnica e o treinamento da equipe.",
    },
  ],

  quote: {
    titleHtml: 'Quer o DopScan 10V na sua clínica? <em class="text-accent">Faça seu orçamento.</em>',
    subtitle:
      "Conta como é a sua rotina de exames, cardiologia, abdominal, reprodução. Devolvemos uma proposta sob medida com transdutores, treinamento, condições e prazo.",
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
    packageLabel: "Com transdutores e acessórios opcionais",
  },

  footerCatalog: [
    "Ultrassom color doppler",
    "Transdutor convexo 6.5 MHz",
    "Transdutor linear 7.5 MHz",
    "Transdutor retal 6.5 MHz",
    "Acessórios e suporte",
  ],
  footerBlurb:
    "Distribuição oficial de equipamentos veterinários premium. Representação oficial, suporte técnico nacional, garantia respeitada.",

  products: [dopscan10v],
};
