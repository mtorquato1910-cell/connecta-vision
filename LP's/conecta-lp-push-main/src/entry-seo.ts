// Entrada SSR leve: gera o bloco de <head> de SEO (canonical, og:image, JSON-LD)
// a partir da config do site ativo (VITE_SITE), sem React/assets — para injetar no HTML estático.
import { site } from "./lib/site";
import { buildHead } from "./lib/seo";

export const head = buildHead(site);
export const domain = site.domain;

// Imagens LOCAIS (servidas do próprio site) que esta config usa — para empacotar enxuto.
const imgs = new Set<string>();
const add = (u?: string) => { if (u && u.startsWith("/")) imgs.add(u); };
add(site.hero.cardImage);
site.applications?.cards?.forEach((c) => add(c.img));
add(site.testimonial?.avatar);
site.products?.forEach((p) => p.images?.forEach((i) => add(i)));
export const images = [...imgs];
