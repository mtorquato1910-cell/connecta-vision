/**
 * Helpers para gerar JSON-LD schema.org em rotas do site.
 *
 * Use em `head()` da rota:
 *   links: [{ rel: 'application/ld+json', innerHTML: JSON.stringify(...) }]
 *
 * Ou injete via componente <SchemaOrg> dentro da página.
 */

const SITE_URL = "https://www.conecta2lab.com.br";
const SITE_NAME = "Conecta Equipamentos Veterinários";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    alternateName: "Conecta",
    url: SITE_URL,
    logo: `${SITE_URL}/icon-512.png`,
    description:
      "Distribuidor oficial Shinova no Brasil. 230+ equipamentos veterinários: anestesia, imagem, laboratório, odontologia e mais.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Prefeito Sebastião Fernandes, 240, Loja 108, Centro",
      addressLocality: "Vespasiano",
      addressRegion: "MG",
      postalCode: "33200-318",
      addressCountry: "BR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Atendimento comercial",
      areaServed: "BR",
      availableLanguage: ["Portuguese"],
    },
  };
}

export function productSchema(p: {
  modelo: string;
  nome: string;
  descricao: string;
  imagem: string;
  slug: string;
  categoria: string;
  marca?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${p.modelo} — ${p.nome}`,
    sku: p.modelo,
    description: p.descricao,
    image: p.imagem,
    url: `${SITE_URL}/produtos/${p.slug}`,
    category: p.categoria,
    brand: { "@type": "Brand", name: p.marca ?? "SHINOVA" },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/produtos/${p.slug}`,
      availability: "https://schema.org/InStock",
      priceSpecification: { "@type": "PriceSpecification", priceCurrency: "BRL" },
      seller: { "@type": "Organization", name: SITE_NAME },
    },
  };
}

export function articleSchema(post: {
  titulo: string;
  resumo: string;
  capa: string;
  slug: string;
  autor: string;
  publicado_em: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.titulo,
    description: post.resumo,
    image: post.capa,
    url: `${SITE_URL}/blog/${post.slug}`,
    datePublished: post.publicado_em,
    dateModified: post.publicado_em,
    author: { "@type": "Person", name: post.autor },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-512.png` },
    },
  };
}

export function eventSchema(ev: {
  nome: string;
  data_evento: string;
  local: string;
  descricao: string;
  capa: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: ev.nome,
    startDate: ev.data_evento,
    location: { "@type": "Place", name: ev.local },
    description: ev.descricao,
    image: ev.capa,
    url: `${SITE_URL}/eventos/${ev.slug}`,
    organizer: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url.startsWith("http") ? it.url : `${SITE_URL}${it.url}`,
    })),
  };
}

/** Serializa para string segura JSON-LD. */
export function serializeSchema(schema: object): string {
  return JSON.stringify(schema).replace(/</g, "\\u003c");
}
