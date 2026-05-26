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

export type Produto = {
  slug: string;
  modelo: string;
  nome: string;
  categoriaSlug: string;
  categoriaNome: string;
  img: string;
  destaque?: boolean;
};

export const PRODUTOS_DESTAQUE: Produto[] = [
  { slug: "moni-3l", modelo: "Moni 3L", nome: "Monitor Multiparâmetros Veterinário Touchscreen 15\"", categoriaSlug: "anestesia-monitorizacao", categoriaNome: "Anestesia & Monitorização", img: "https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?w=800&q=85", destaque: true },
  { slug: "dopscan-l20", modelo: "DopScan L20", nome: "Ultrassom Color Doppler Veterinário", categoriaSlug: "imagem-diagnostico", categoriaNome: "Imagem & Diagnóstico", img: "https://images.unsplash.com/photo-1559757175-7cb036e0d465?w=800&q=85", destaque: true },
  { slug: "bc-2800vet", modelo: "BC-2800Vet", nome: "Analisador Hematológico Veterinário 3-Diff", categoriaSlug: "laboratorio-clinico", categoriaNome: "Laboratório Clínico", img: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&q=85", destaque: true },
  { slug: "dentalvet-u200", modelo: "DentalVet U200", nome: "Unidade Odontológica Veterinária Móvel", categoriaSlug: "odontologia-veterinaria", categoriaNome: "Odontologia Veterinária", img: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&q=85" },
  { slug: "eyevet-tono", modelo: "EyeVet Tono", nome: "Tonômetro Veterinário Digital", categoriaSlug: "oftalmologia-veterinaria", categoriaNome: "Oftalmologia Veterinária", img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=85" },
  { slug: "groomtable-pro-1-2", modelo: "GroomTable Pro 1.2", nome: "Mesa de Banho e Tosa Hidráulica", categoriaSlug: "pet-grooming-estetica", categoriaNome: "Pet Grooming & Estética", img: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&q=85" },
];

export const waLink = (msg = SITE.whatsappMsg) =>
  `https://wa.me/${SITE.phoneRaw}?text=${encodeURIComponent(msg)}`;
