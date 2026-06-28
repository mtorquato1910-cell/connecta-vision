import type { SiteConfig, Product } from "@/lib/types";

const CE = "SHINOVA · China · CE/ISO 13485";

const microProducts: Product[] = [
  {
    id: "dm-500l",
    model: "DM-500L",
    category: "MICROSCOPIA DIGITAL",
    name: "Microscópio Biológico Digital Veterinário DM-500L",
    shortName: "Microscópio Digital",
    productUrl: "https://www.shinova.com/product/detailp/Digital-Microscope-DM-500L",
    images: [
      "/products/dm-500l.jpg",
      "/products/dm-500l-2.jpg",
      "/products/dm-500l-3.jpg",
      "/products/dm-500l-4.jpg",
      "/products/dm-500l-5.jpg",
      "/products/dm-500l-6.jpg",
      "/products/dm-500l-7.jpg",
    ],
    description: [
      "O DM-500L é o microscópio biológico digital veterinário da Shinova, une óptica de sistema infinito a um sensor CMOS colorido de 5 MP e tela LCD de 11,6\" em 1080p, permitindo examinar e compartilhar a imagem direto na tela, sem precisar olhar pela ocular. Ideal para discutir achados em equipe, ensino e laudos com imagem.",
      "Interface totalmente digital com zoom, operação por mouse, armazenamento em pen drive (USB) e saída HDMI. Mantém também a observação por ocular, com cabeçote Seidentopf binocular inclinado a 30° e oculares de campo amplo WF10×/18. Objetivas semi-planas acromáticas de sistema infinito 4×, 10×, 40× e 100×, em revólver quádruplo.",
      "Platina mecânica dupla de 140×140 mm (curso 75×50 mm), condensador deslizante centralizável N.A. 1.25 e foco coaxial macro/micro (curso 20 mm, divisão 0,002 mm). Iluminação S-LED com brilho ajustável, ocular com rotação de 180° para ergonomia e alça oculta para transporte. Indicado para citologia, dermatologia, hematologia e patologia veterinária.",
    ],
    specs: [
      { label: "Tela", value: 'LCD 11,6" · 1080p' },
      { label: "Sensor", value: 'CMOS colorido 5,0 MP (1/2.8")' },
      { label: "Operação", value: "Mouse · interface digital" },
      { label: "Saída / armazenamento", value: "HDMI · USB (pen drive)" },
      { label: "Sistema óptico", value: "Infinito" },
      { label: "Cabeçote", value: "Seidentopf binocular, 30° inclinado, interpupilar 48–75 mm" },
      { label: "Ocular", value: "Campo amplo WF10×/18" },
      { label: "Objetivas", value: "Semi-planas acromáticas infinitas 4×, 10×, 40×, 100×" },
      { label: "Revólver", value: "Quádruplo" },
      { label: "Platina", value: "Mecânica dupla 140×140 mm (curso 75×50 mm)" },
      { label: "Condensador", value: "Deslizante centralizável N.A. 1.25" },
      { label: "Foco", value: "Coaxial macro/micro, curso 20 mm, divisão 0,002 mm" },
      { label: "Iluminação", value: "S-LED com brilho ajustável" },
      { label: "Alimentação", value: "DC 12V" },
      { label: "Origem", value: CE },
    ],
  },
  {
    id: "bm-2c",
    model: "BM-2C",
    category: "MICROSCOPIA BIOLÓGICA",
    name: "Microscópio Biológico Veterinário BM-2C",
    shortName: "Microscópio Biológico",
    productUrl: "https://www.shinova.com/product/detailp/Biological-Microscope-BM-2C",
    images: [
      "/products/bm-2c.jpg",
      "/products/bm-2c-2.jpg",
      "/products/bm-2c-3.jpg",
      "/products/bm-2c-4.jpg",
      "/products/bm-2c-5.jpg",
      "/products/bm-2c-6.jpg",
      "/products/bm-2c-7.jpg",
      "/products/bm-2c-8.jpg",
    ],
    description: [
      "O BM-2C é o microscópio biológico veterinário da linha Shinova, indicado para rotina do laboratório veterinário: citologia, dermatologia (raspados de pele, exame de pelos e pesquisa de fungos e ácaros), bacteriologia, parasitologia e patologia. Construção robusta e óptica de qualidade para uso clínico, de pesquisa e de ensino.",
      "Cabeçote binocular articulado com inclinação de 30° e rotação de 360°, ajuste de distância interpupilar de 55–75 mm. Faixa de ampliação óptica de 40× a 1600×, com oculares planas 10× e 16× e objetivas 4×, 10×, 40× e 100× (imersão a óleo). Condensador Abbe N.A. 1.25 com diafragma íris e filtros (azul, amarelo, verde e fosco).",
      "Platina de 125×130 mm com movimento de 60×30 mm e vernier de 0,1 mm. Foco macro e micrométrico com curso de 35 mm e divisão mínima de 0,002 mm. Iluminação elétrica 6V/20W com ajuste contínuo de brilho e tratamento antifungo. Solução confiável e de bom custo-benefício para clínicas, laboratórios e instituições de ensino.",
    ],
    specs: [
      { label: "Oculares", value: "Planas 10× (campo φ18mm) e 16× (φ12mm)" },
      { label: "Objetivas", value: "4×, 10×, 40×, 100× (imersão a óleo)" },
      { label: "Ampliação óptica", value: "40×–1600×" },
      { label: "Cabeçote", value: "Binocular articulado, 30° inclinado, rotação 360°" },
      { label: "Distância interpupilar", value: "55–75 mm" },
      { label: "Condensador", value: "Abbe N.A. 1.25 com diafragma íris" },
      { label: "Filtros", value: "Azul, amarelo, verde, fosco" },
      { label: "Platina", value: "125×130 mm · movimento 60×30 mm · vernier 0,1 mm" },
      { label: "Foco", value: "Macro/micro, curso 35 mm, divisão 0,002 mm" },
      { label: "Iluminação", value: "6V/20W com ajuste contínuo de brilho" },
      { label: "Tratamento", value: "Antifungo" },
      { label: "Dimensões (embalagem)", value: "32×21×46 cm · 6,0 kg" },
      { label: "Origem", value: CE },
    ],
  },
  {
    id: "eom-200tb",
    model: "EOM-200TB",
    category: "MICROSCOPIA CIRÚRGICA",
    name: "Microscópio Cirúrgico Veterinário EOM-200TB",
    shortName: "Microscópio Cirúrgico",
    productUrl: "https://www.shinova.com/product/detailp/Operating-Microscope-EOM-200TB",
    images: [
      "/products/eom-200tb.jpg",
      "/products/eom-200tb-2.jpg",
      "/products/eom-200tb-3.jpg",
      "/products/eom-200tb-4.jpg",
      "/products/eom-200tb-5.jpg",
      "/products/eom-200tb-6.jpg",
      "/products/eom-200tb-7.jpg",
      "/products/eom-200tb-8.jpg",
    ],
    description: [
      "O EOM-200TB é o microscópio cirúrgico (operatório) veterinário da Shinova, desenvolvido para microcirurgias de odontologia e oftalmologia veterinária, com iluminação coaxial e óptica de alta definição para enxergar estruturas finas com precisão.",
      "Observação binocular inclinada a 45° para conforto do cirurgião, ampliação binocular de 6× e mudança de ampliação em 3 passos (0.6×, 1×, 1.6×). Objetiva de distância focal F=200mm/300mm, gerando ampliações totais de 3× a 12× e campos lineares de 15,8 a 60,8 mm. Ajuste de dioptria ±5D e distância interpupilar de 50–80 mm.",
      "Iluminação coaxial por LED de 10W com mais de 30.000 lux e filtros verde e amarelo integrados. Divisor de feixe 50:50 e adaptador C-mount 1/3\" para acoplar câmera de vídeo. Braço de equilíbrio em 2 partes com juntas universais e contrapeso ajustável, sobre base estrela de 5 pontas com rodízios. Foco fino com curso de 10 mm.",
    ],
    specs: [
      { label: "Observação binocular", value: "Inclinada 45°" },
      { label: "Ampliação binocular", value: "6×" },
      { label: "Mudança de ampliação", value: "3 passos (0.6×, 1×, 1.6×)" },
      { label: "Ampliações totais", value: "3×, 5×, 8×, 4.7×, 7.5×, 12×" },
      { label: "Campo linear", value: "15,8–60,8 mm" },
      { label: "Objetiva", value: "F=200mm e F=300mm (M45×0.75)" },
      { label: "Dioptria", value: "±5D" },
      { label: "Distância interpupilar", value: "50–80 mm" },
      { label: "Iluminação", value: "Coaxial LED 10W, >30.000 lux" },
      { label: "Filtros", value: "Verde e amarelo integrados" },
      { label: "Divisor de feixe", value: "50:50" },
      { label: "Adaptador de câmera", value: 'C-mount 1/3"' },
      { label: "Foco fino", value: "Curso 10 mm" },
      { label: "Base", value: "Estrela 5 pontas com rodízios" },
      { label: "Dimensões (embalagem)", value: "77×58×22 cm · 18 kg" },
      { label: "Origem", value: CE },
    ],
  },
];

export const microscopiodermatologico: SiteConfig = {
  id: "microscopiodermatologico",
  domain: "microscopiodermatologico.com.br",
  lineName: "Linha de Microscopia",
  countWord: "3 microscópios",

  brand: {
    whatsapp: "5511943436177",
    phoneDisplay: "(11) 94343-6177",
    addressShort: "Vespasiano, MG",
    addressFull: "Av. Prefeito Sebastião Fernandes, 240 · Centro · Shopping Premiere · Vespasiano/MG",
    cnpj: "54.269.525/0001-56",
  },

  meta: {
    title: "Conecta · Microscopia Veterinária",
    description:
      "Microscopia veterinária, microscópio biológico, digital com tela e cirúrgico. Para dermatologia, citologia, patologia e microcirurgia. Representação oficial, suporte nacional, garantia 12 meses.",
  },

  topbarHtml:
    "🇧🇷 Distribuição oficial Shinova no Brasil · <strong>Representação oficial</strong> · Suporte técnico nacional",

  hero: {
    eyebrow: "Microscopia Veterinária",
    kicker: "Linha de Microscopia Premium · Distribuição Conecta · Fabricação Shinova",
    titleHtml: 'Microscopia veterinária, <em class="text-accent">do raspado de pele à microcirurgia.</em>',
    subtitle:
      "Três microscópios veterinários, biológico, digital com tela e cirúrgico, da dermatologia e citologia ao centro cirúrgico, com representação oficial e suporte técnico nacional.",
    bulletsHtml: [
      "Microscópio biológico, digital e cirúrgico em <strong>uma só linha</strong>",
      "Ideal para <strong>dermatologia, citologia e patologia</strong> veterinária",
      "Representação oficial, <strong>sem intermediário inflando preço</strong>",
      "Suporte técnico nacional + garantia 12 meses + treinamento da equipe",
    ],
    ctaPrimary: "Ver os 3 microscópios",
    cardTag: "LINHA DE MICROSCOPIA 2026",
    cardTitle: "Microscopia",
    cardImage: "/banco/microscopia/dermatologia-raspado-cao.png",
    cardStats: [
      ["3", "Microscópios"],
      ["100%", "Representação oficial"],
      ["12 meses", "Garantia + suporte"],
    ],
    socialProofHtml:
      '<strong class="text-foreground">Mais de 300 clínicas e hospitais</strong> já operam com equipamentos distribuídos pela Conecta.',
  },

  benefits: {
    eyebrow: "Por que comprar Conecta",
    titleHtml:
      'Três razões pelas quais clínicas e laboratórios <em class="text-accent">escolhem nossa distribuição.</em>',
    items: [
      {
        n: "i.",
        title: "Do exame de rotina à microcirurgia, fornecedor único",
        p: "Microscópio biológico de bancada, digital com tela e cirúrgico de centro, três soluções que cobrem a microscopia veterinária em uma única origem. Você simplifica compra, treinamento, manutenção e suporte.",
      },
      {
        n: "ii.",
        title: "Pensados para rotina veterinária",
        p: "Da dermatologia (raspados de pele, fungos e ácaros) à citologia, hematologia e patologia, óptica de qualidade para diagnóstico confiável. E o microscópio cirúrgico para microcirurgia odontológica e oftálmica.",
      },
      {
        n: "iii.",
        title: "Atendimento brasileiro",
        p: "Representação oficial sem intermediário. Suporte técnico nacional com resposta em até 4 horas úteis. Treinamento de uso à distância para sua equipe. Documentação fiscal completa. Garantia 12 meses respeitada pela própria Conecta, não terceirizada.",
      },
    ],
  },

  gallery: {
    eyebrow: "Linha de microscopia · 3 microscópios",
    titleHtml: 'Toque em qualquer microscópio <em class="text-accent not-italic font-display italic">para explorar.</em>',
    subtitle:
      "Três microscópios que cobrem análise biológica, imagem digital e microcirurgia, fornecidos como linha integrada pela Conecta.",
  },

  applications: {
    eyebrow: "Aplicações",
    titleHtml: 'Onde a linha de microscopia Conecta <em class="text-accent">se encaixa na sua operação.</em>',
    cards: [
      {
        title: "Dermatologia e parasitologia",
        p: "Raspados de pele, exame de pelos e pesquisa de fungos e ácaros com óptica de até 1600×. Microscópio biológico BM-2C.",
        img: "/banco/microscopia/patologista-microscopio.png",
      },
      {
        title: "Citologia e hematologia",
        p: "Leitura de lâminas com imagem na tela para discussão em equipe e laudo. Microscópio digital DM-500L com sensor de 5 MP.",
        img: "/banco/microscopia/citologia-laboratorio.png",
      },
      {
        title: "Microcirurgia odontológica e oftálmica",
        p: "Visão ampliada e iluminada de estruturas finas no centro cirúrgico. Microscópio cirúrgico EOM-200TB com LED coaxial.",
        img: "/banco/microscopia/microscopio-digital-tela.png",
      },
      {
        title: "Ensino e documentação",
        p: "Imagem digital com saída HDMI e armazenamento USB para aulas, registro de casos e laudos ilustrados.",
        img: "/banco/microscopia/gato-close-pelagem.png",
      },
    ],
  },

  testimonial: {
    quote:
      "Na dermatologia eu vivo de lâmina, raspado, citologia, pesquisa de fungo. Trocar o microscópio antigo pelo digital mudou meu fluxo: mostro a imagem na tela para o tutor e discuto o caso com a equipe na hora. A Conecta entregou com treinamento e um suporte que responde.",
    name: "Dra. Letícia Andrade",
    role: "Dermatologia Veterinária · Belo Horizonte/MG",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=120&q=80",
  },

  faq: [
    {
      q: "Posso comprar os 3 microscópios juntos ou só um?",
      a: "Pode comprar como achar melhor. Trabalhamos com pacote (com condição comercial diferenciada) e com aquisição individual. Muitos clientes começam com o biológico ou o digital para rotina e adicionam o cirúrgico depois. Faz orçamento do que faz sentido para sua operação.",
    },
    {
      q: "Qual o prazo de entrega?",
      a: "Prazo de entrega de 60 a 90 dias. São equipamentos importados de alta tecnologia, produzidos sob demanda, por isso o prazo reflete a fabricação e a representação oficial, sem intermediário inflando preço. Todo equipamento chega instalado, comissionado, calibrado e com treinamento operacional incluso.",
    },
    {
      q: "O microscópio digital substitui a observação pela ocular?",
      a: "Não precisa escolher: o DM-500L mantém a observação por ocular E oferece a tela LCD com câmera de 5 MP. Você usa a ocular na rotina e a tela quando quiser mostrar a imagem, gravar, ensinar ou anexar ao laudo (saída HDMI e armazenamento USB).",
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
    titleHtml: 'Cada laboratório enxerga diferente. <em class="text-accent">Sua proposta também precisa ser.</em>',
    subtitle:
      "Conta o que você precisa, microscópio biológico, digital com tela ou cirúrgico. Devolvemos uma proposta sob medida com acessórios, câmeras, treinamento e condições.",
    bulletsHtml: [
      "Resposta em até 4 horas úteis, direto com nossa equipe técnica",
      "Proposta personalizada com microscópios, câmeras, treinamento e condições",
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
    "Microscópio biológico",
    "Microscópio digital",
    "Microscópio cirúrgico",
    "Câmeras e adaptadores",
    "Lâminas e acessórios",
  ],
  footerBlurb:
    "Distribuição oficial de equipamentos veterinários premium. Representação oficial, suporte técnico nacional, garantia respeitada.",

  products: microProducts,
};
