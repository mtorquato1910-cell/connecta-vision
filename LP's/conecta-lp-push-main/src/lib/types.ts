export type Product = {
  id: string;
  model: string;
  name: string;
  category: string;
  shortName: string;
  productUrl: string;
  description: string[];
  specs: { label: string; value: string }[];
  images: string[];
};

export type Stat = [value: string, label: string];

export type SiteConfig = {
  id: string;
  domain: string;
  lineName: string; // ex: "Linha Cirúrgica", "Linha Laboratorial"
  countWord: string; // ex: "7 equipamentos"

  brand: {
    whatsapp: string; // só dígitos, formato internacional
    phoneDisplay: string; // ex: "(11) 94343-6177"
    addressShort: string; // ex: "Vespasiano, MG"
    addressFull: string;
    cnpj: string;
    companyName?: string; // nome no rodapé (default: "Conecta Equipamentos Veterinários")
  };

  meta: { title: string; description: string };

  topbarHtml: string;

  hero: {
    eyebrow: string;
    kicker: string;
    titleHtml: string;
    h2?: string; // H2 opcional (keyword) logo abaixo do H1
    subtitle: string;
    bulletsHtml: string[];
    ctaPrimary: string;
    cardTag: string;
    cardTitle: string;
    cardImage: string;
    imageFit?: "cover" | "contain"; // "cover" (foto de ambiente, padrão) ou "contain" (foto de produto, sem cortar)
    cardStats: Stat[];
    socialProofHtml: string;
  };

  benefits: {
    eyebrow: string;
    titleHtml: string;
    items: { n: string; title: string; p: string }[];
  };

  gallery: { eyebrow: string; titleHtml: string; subtitle: string };

  applications: {
    eyebrow: string;
    titleHtml: string;
    cards: { title: string; p: string; img: string }[];
  };

  testimonial: { quote: string; name: string; role: string; avatar: string };

  faq: { q: string; a: string }[];

  quote: {
    titleHtml: string;
    subtitle: string;
    bulletsHtml: string[];
    stats: Stat[];
    packageLabel: string; // ex: "Pacote completo (todos os 7)"
    assurances?: string[]; // 3 selos do formulário (default: garantia/importação/entrega)
  };

  footerCatalog: string[];
  footerBlurb: string;

  // Sobrescreve os campos do formulário (ex.: gemologia não usa "Médico vet").
  form?: {
    funcaoOptions?: string[];
    tipoOptions?: string[];
    volumeLabel?: string;
    volumeOptions?: string[];
    itemsLabel?: string;
  };

  products: Product[];
};
