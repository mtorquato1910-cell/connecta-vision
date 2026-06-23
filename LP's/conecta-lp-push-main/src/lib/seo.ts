import type { SiteConfig } from "./types";

const esc = (s: string) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// og:image em 1200x630 a partir da imagem-herói (Unsplash).
function ogImageOf(site: SiteConfig): string {
  const base = site.hero.cardImage.split("?")[0];
  return `${base}?auto=format&fit=crop&w=1200&h=630&q=80`;
}

// Bloco de <head> com canonical, Open Graph/Twitter de imagem e JSON-LD — servido no HTML inicial.
export function buildHead(site: SiteConfig): string {
  const canonical = `https://${site.domain}/`;
  const ogImage = ogImageOf(site);
  const name = site.brand.companyName ?? "Conecta Equipamentos Veterinários";

  const graph: unknown[] = [
    {
      "@type": "Organization",
      name,
      url: canonical,
      logo: `${canonical}favicon.png`,
      telephone: `+${site.brand.whatsapp}`,
      address: { "@type": "PostalAddress", streetAddress: site.brand.addressFull, addressCountry: "BR" },
    },
    { "@type": "WebSite", name: site.meta.title, url: canonical, inLanguage: "pt-BR" },
    {
      "@type": "ItemList",
      name: site.meta.title,
      numberOfItems: site.products.length,
      itemListElement: site.products.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          name: p.name,
          category: p.category,
          description: p.description?.[0] ?? "",
          brand: { "@type": "Brand", name: (p.specs.find((s) => s.label === "Origem")?.value ?? "").split(" ")[0] || "Conecta" },
        },
      })),
    },
    {
      "@type": "FAQPage",
      mainEntity: site.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  const jsonld = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");

  return [
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${esc(ogImage)}" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:image" content="${esc(ogImage)}" />`,
    `<script type="application/ld+json">${jsonld}</script>`,
  ].join("\n    ");
}

export const seoMeta = (site: SiteConfig) => ({
  domain: site.domain,
  canonical: `https://${site.domain}/`,
});
