export const SITE = {
  name: "Conecta Equipamentos Veterinários",
  shortName: "Conecta",
  cnpj: "54.269.525/0001-56",
  city: "Vespasiano/MG",
  phone: "(31) 9000-0000",
  phoneRaw: "5531900000000",
  whatsappMsg: "Olá! Vim pelo site da Conecta e gostaria de saber mais sobre os equipamentos veterinários.",
  email: "comercial@conectavet.com.br",
  topBar:
    "Distribuição oficial Shinova no Brasil · Importação direta · Suporte técnico nacional · WhatsApp: (31) 9000-0000",
};

export const NAV = [
  { label: "Produtos", to: "/produtos" },
  { label: "Soluções", to: "/solucoes" },
  { label: "Sobre", to: "/sobre" },
  { label: "Contato", to: "/contato" },
] as const;

export type Categoria = {
  num: string;
  slug: string;
  nome: string;
  qtd: number;
  img: string;
};

export const CATEGORIAS: Categoria[] = [
  { num: "01", slug: "anestesia-monitorizacao", nome: "Anestesia & Monitorização", qtd: 66, img: "https://images.unsplash.com/photo-1612531822040-39bb96aa6efb?w=800&q=85" },
  { num: "02", slug: "imagem-diagnostico", nome: "Imagem & Diagnóstico", qtd: 29, img: "https://images.unsplash.com/photo-1559757175-7cb036e0d465?w=800&q=85" },
  { num: "03", slug: "laboratorio-clinico", nome: "Laboratório Clínico", qtd: 28, img: "https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=800&q=85" },
  { num: "04", slug: "tratamento-recuperacao", nome: "Tratamento & Recuperação", qtd: 20, img: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800&q=85" },
  { num: "05", slug: "odontologia-veterinaria", nome: "Odontologia Veterinária", qtd: 13, img: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&q=85" },
  { num: "06", slug: "oftalmologia-veterinaria", nome: "Oftalmologia Veterinária", qtd: 5, img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=85" },
  { num: "07", slug: "exame-diagnostico", nome: "Exame & Diagnóstico", qtd: 45, img: "https://images.unsplash.com/photo-1612531386530-97286d97c2d2?w=800&q=85" },
  { num: "08", slug: "pet-grooming-estetica", nome: "Pet Grooming & Estética", qtd: 24, img: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&q=85" },
];

export type Especificacao = { label: string; valor: string };

export type Produto = {
  slug: string;
  modelo: string;
  nome: string;
  categoriaSlug: string;
  categoriaNome: string;
  img: string;
  galeria?: string[];
  destaque?: boolean;
  resumo?: string;
  descricao?: string;
  diferenciais?: string[];
  aplicacoes?: string[];
  especificacoes?: Especificacao[];
};

const baseGallery = (img: string) => [
  img,
  "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=1200&q=85",
  "https://images.unsplash.com/photo-1584515933487-779824d29309?w=1200&q=85",
  "https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=1200&q=85",
];

export const PRODUTOS: Produto[] = [
  {
    slug: "moni-3l",
    modelo: "Moni 3L",
    nome: 'Monitor Multiparâmetros Veterinário Touchscreen 15"',
    categoriaSlug: "anestesia-monitorizacao",
    categoriaNome: "Anestesia & Monitorização",
    img: "https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?w=1200&q=85",
    destaque: true,
    resumo: "Monitor de sinais vitais veterinário com tela touchscreen de 15 polegadas e até 8 parâmetros simultâneos.",
    descricao:
      "Plataforma de monitorização modular concebida para o ambiente veterinário, com curvas amplas, navegação por toque e algoritmos otimizados para pequenos e grandes animais. Operação contínua em centros cirúrgicos, UTIs e procedimentos ambulatoriais.",
    diferenciais: [
      "Tela touchscreen capacitiva de 15\" com leitura clara em ambientes iluminados",
      "Algoritmos veterinários para SpO2, ECG, NIBP, IBP, EtCO2, Temp e Resp",
      "Bateria interna de até 4 horas de uso contínuo",
      "Interface portuguesa com perfis por espécie",
    ],
    aplicacoes: ["Centro cirúrgico", "UTI veterinária", "Recuperação anestésica", "Pronto-atendimento"],
    especificacoes: [
      { label: "Tela", valor: "15\" touchscreen capacitiva, 1024×768" },
      { label: "Parâmetros", valor: "ECG, SpO2, NIBP, IBP, EtCO2, Temp, Resp" },
      { label: "Bateria", valor: "Lítio recarregável, autonomia ~4h" },
      { label: "Conectividade", valor: "Wi-Fi, Ethernet, USB, saída VGA" },
      { label: "Dimensões", valor: "350 × 320 × 165 mm" },
      { label: "Peso", valor: "5,8 kg" },
    ],
  },
  {
    slug: "dopscan-l20",
    modelo: "DopScan L20",
    nome: "Ultrassom Color Doppler Veterinário",
    categoriaSlug: "imagem-diagnostico",
    categoriaNome: "Imagem & Diagnóstico",
    img: "https://images.unsplash.com/photo-1559757175-7cb036e0d465?w=1200&q=85",
    destaque: true,
    resumo: "Plataforma de ultrassom Doppler colorida com transdutores dedicados à medicina veterinária.",
    descricao:
      "DopScan L20 combina arquitetura de imagem de alta densidade com presets veterinários para cardiologia, abdômen, reprodução e musculoesquelético. Equipamento portátil para clínicas e ambulatórios.",
    diferenciais: [
      "Doppler colorido, pulsado e contínuo",
      "Transdutores convexo, linear e microconvexo inclusos",
      "Presets veterinários por espécie",
      "Armazenamento DICOM e exportação USB",
    ],
    aplicacoes: ["Abdômen", "Cardiologia", "Reprodução", "Musculoesquelético"],
    especificacoes: [
      { label: "Tela", valor: "15\" LED de alta resolução" },
      { label: "Modos", valor: "B, M, Color, PW, CW, PDI" },
      { label: "Transdutores", valor: "Convexo 3.5MHz, Linear 7.5MHz, Microconvexo 6.5MHz" },
      { label: "Armazenamento", valor: "SSD 500GB, DICOM 3.0" },
    ],
  },
  {
    slug: "bc-2800vet",
    modelo: "BC-2800Vet",
    nome: "Analisador Hematológico Veterinário 3-Diff",
    categoriaSlug: "laboratorio-clinico",
    categoriaNome: "Laboratório Clínico",
    img: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1200&q=85",
    destaque: true,
    resumo: "Hemograma completo com diferenciação em 3 partes para múltiplas espécies em até 60s por amostra.",
    descricao:
      "Analisador hematológico compacto, ideal para clínicas que buscam autonomia laboratorial sem abrir mão de precisão. Calibrações dedicadas para cães, gatos, equinos, bovinos e exóticos.",
    diferenciais: [
      "21 parâmetros + 3 histogramas",
      "Throughput de 60 amostras/hora",
      "Aspiração de 13 µL de sangue total",
      "Perfis salvos para 12 espécies",
    ],
    aplicacoes: ["Hemograma de rotina", "Pré-cirúrgico", "Internação", "Triagem"],
    especificacoes: [
      { label: "Parâmetros", valor: "21 + 3 histogramas (WBC, RBC, PLT)" },
      { label: "Volume de amostra", valor: "13 µL" },
      { label: "Velocidade", valor: "60 amostras/h" },
      { label: "Tela", valor: "10\" touchscreen colorido" },
    ],
  },
  {
    slug: "dentalvet-u200",
    modelo: "DentalVet U200",
    nome: "Unidade Odontológica Veterinária Móvel",
    categoriaSlug: "odontologia-veterinaria",
    categoriaNome: "Odontologia Veterinária",
    img: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=1200&q=85",
    resumo: "Estação completa para odontologia veterinária com ultrassom piezo, micromotor e seringa tríplice.",
    diferenciais: ["Ultrassom piezo com 3 pontas", "Micromotor de alta rotação", "Compressor silencioso embutido"],
    especificacoes: [
      { label: "Pontas", valor: "Piezo, micromotor, jato de bicarbonato" },
      { label: "Compressor", valor: "Interno, livre de óleo" },
    ],
  },
  {
    slug: "eyevet-tono",
    modelo: "EyeVet Tono",
    nome: "Tonômetro Veterinário Digital",
    categoriaSlug: "oftalmologia-veterinaria",
    categoriaNome: "Oftalmologia Veterinária",
    img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=1200&q=85",
    resumo: "Medição rápida e indolor da pressão intraocular em cães, gatos e equinos.",
  },
  {
    slug: "groomtable-pro-1-2",
    modelo: "GroomTable Pro 1.2",
    nome: "Mesa de Banho e Tosa Hidráulica",
    categoriaSlug: "pet-grooming-estetica",
    categoriaNome: "Pet Grooming & Estética",
    img: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1200&q=85",
    resumo: "Mesa hidráulica robusta com tampo antiderrapante e ajuste ergonômico.",
  },
  {
    slug: "vent-vita-v8",
    modelo: "Vent Vita V8",
    nome: "Ventilador Pulmonar Veterinário",
    categoriaSlug: "anestesia-monitorizacao",
    categoriaNome: "Anestesia & Monitorização",
    img: "https://images.unsplash.com/photo-1631815587646-b85a1bb027e1?w=1200&q=85",
    resumo: "Ventilador volumétrico e pressórico para anestesia veterinária com modos VCV, PCV e SIMV.",
  },
  {
    slug: "raio-x-vetray-5",
    modelo: "VetRay 5",
    nome: "Raio-X Veterinário Digital",
    categoriaSlug: "imagem-diagnostico",
    categoriaNome: "Imagem & Diagnóstico",
    img: "https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=1200&q=85",
    resumo: "Sistema de radiografia digital direto com detector flat-panel sem fio.",
  },
  {
    slug: "chem-pro-5",
    modelo: "ChemPro 5",
    nome: "Analisador Bioquímico Veterinário",
    categoriaSlug: "laboratorio-clinico",
    categoriaNome: "Laboratório Clínico",
    img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=85",
    resumo: "Bioquímica automática com cartuchos prontos para uso e resultados em 12 minutos.",
  },
  {
    slug: "incubatherm-i10",
    modelo: "IncubaTherm i10",
    nome: "Incubadora para Recém-Nascidos Veterinária",
    categoriaSlug: "tratamento-recuperacao",
    categoriaNome: "Tratamento & Recuperação",
    img: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=1200&q=85",
    resumo: "Controle preciso de temperatura, umidade e oxigênio para neonatos e pacientes críticos.",
  },
  {
    slug: "scaler-piezo-x3",
    modelo: "Scaler Piezo X3",
    nome: "Ultrassom Odontológico Piezoelétrico",
    categoriaSlug: "odontologia-veterinaria",
    categoriaNome: "Odontologia Veterinária",
    img: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1200&q=85",
    resumo: "Ultrassom piezoelétrico autoclavável com LED para procedimentos periodontais.",
  },
  {
    slug: "exam-table-flex-pro",
    modelo: "FlexPro Exam",
    nome: "Mesa de Exame Veterinária Pantográfica",
    categoriaSlug: "exame-diagnostico",
    categoriaNome: "Exame & Diagnóstico",
    img: "https://images.unsplash.com/photo-1583912267550-d6c2ac3196c0?w=1200&q=85",
    resumo: "Mesa de exame com elevação pantográfica, tampo inox e plataforma rebatível.",
  },
];

// Backwards compat
export const PRODUTOS_DESTAQUE: Produto[] = PRODUTOS.filter((p) => p.destaque);

PRODUTOS.forEach((p) => {
  if (!p.galeria) p.galeria = baseGallery(p.img);
  if (!p.descricao && p.resumo) p.descricao = p.resumo;
});

export const findProduto = (slug: string) => PRODUTOS.find((p) => p.slug === slug);
export const findCategoria = (slug: string) => CATEGORIAS.find((c) => c.slug === slug);
export const produtosPorCategoria = (slug: string) => PRODUTOS.filter((p) => p.categoriaSlug === slug);
export const produtosRelacionados = (p: Produto, limit = 3) =>
  PRODUTOS.filter((x) => x.slug !== p.slug && x.categoriaSlug === p.categoriaSlug).slice(0, limit);

export const waLink = (msg = SITE.whatsappMsg) =>
  `https://wa.me/${SITE.phoneRaw}?text=${encodeURIComponent(msg)}`;
