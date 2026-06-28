/**
 * Sistema i18n leve para o site Conecta.
 * Idiomas: PT (default), EN, ES.
 *
 * Detecção:
 *   1. Cookie 'conecta_locale' (preferência manual do usuário)
 *   2. Accept-Language do navegador
 *   3. País por IP (api gratuita ipapi.co, opcional)
 *   4. Fallback: PT
 */

export type Locale = "pt" | "en" | "es";
export const LOCALES: Locale[] = ["pt", "en", "es"];
export const DEFAULT_LOCALE: Locale = "pt";

const COOKIE_KEY = "conecta_locale";
const LS_KEY = "conecta_locale_v1";

const LOCALE_LABELS: Record<Locale, { label: string; flag: string; native: string }> = {
  pt: { label: "Português", flag: "🇧🇷", native: "Português" },
  en: { label: "English", flag: "🇺🇸", native: "English" },
  es: { label: "Español", flag: "🇪🇸", native: "Español" },
};

export function getLocaleMeta(locale: Locale) {
  return LOCALE_LABELS[locale];
}

// País → locale
const COUNTRY_TO_LOCALE: Record<string, Locale> = {
  // Português
  BR: "pt", PT: "pt", AO: "pt", MZ: "pt", CV: "pt", GW: "pt", ST: "pt", TL: "pt",
  // Espanhol
  ES: "es", AR: "es", MX: "es", CL: "es", PE: "es", CO: "es", VE: "es", UY: "es",
  PY: "es", BO: "es", EC: "es", CR: "es", DO: "es", GT: "es", HN: "es", NI: "es",
  PA: "es", PR: "es", SV: "es", CU: "es",
  // Inglês (resto fica EN)
};

export function localeFromCountry(country: string | null | undefined): Locale | null {
  if (!country) return null;
  const cc = country.toUpperCase();
  return COUNTRY_TO_LOCALE[cc] ?? null;
}

export function localeFromAcceptLanguage(header: string | null | undefined): Locale | null {
  if (!header) return null;
  const langs = header.split(",").map((l) => l.split(";")[0].trim().toLowerCase());
  for (const lang of langs) {
    if (lang.startsWith("pt")) return "pt";
    if (lang.startsWith("es")) return "es";
    if (lang.startsWith("en")) return "en";
  }
  return null;
}

export function getStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  try {
    const fromLs = window.localStorage.getItem(LS_KEY) as Locale | null;
    if (fromLs && LOCALES.includes(fromLs)) return fromLs;
    const fromCookie = document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${COOKIE_KEY}=`))
      ?.split("=")[1] as Locale | undefined;
    if (fromCookie && LOCALES.includes(fromCookie)) return fromCookie;
  } catch {
    // ignore
  }
  return null;
}

export function setStoredLocale(locale: Locale): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LS_KEY, locale);
    document.cookie = `${COOKIE_KEY}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  } catch {
    // ignore
  }
}

/**
 * Detecta locale automaticamente em ordem de prioridade.
 * Use no client (não SSR).
 */
export async function detectLocale(): Promise<Locale> {
  if (typeof window === "undefined") return DEFAULT_LOCALE;

  // 1. Preferência salva
  const stored = getStoredLocale();
  if (stored) return stored;

  // 2. Accept-Language do navegador
  const fromBrowser = localeFromAcceptLanguage(navigator.language);
  if (fromBrowser) return fromBrowser;

  // 3. País por IP (opcional, leve, sem chave)
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 1500);
    const res = await fetch("https://ipapi.co/json/", { signal: ctrl.signal });
    clearTimeout(t);
    if (res.ok) {
      const data = (await res.json()) as { country_code?: string };
      const fromCountry = localeFromCountry(data.country_code);
      if (fromCountry) return fromCountry;
    }
  } catch {
    // sem conexão / bloqueado, ok
  }

  // 4. Fallback
  return DEFAULT_LOCALE;
}

// ─── Dicionários ───────────────────────────────────────────────────────

type Dict = Record<string, string>;

const PT: Dict = {
  "nav.products": "Produtos",
  "nav.solutions": "Soluções",
  "nav.blog": "Blog",
  "nav.events": "Eventos",
  "nav.about": "Sobre",
  "nav.contact": "Contato",
  "nav.whatsapp": "WhatsApp",
  "nav.menu": "Menu",
  "nav.search": "Buscar",

  "common.see_more": "Ver mais",
  "common.see_all": "Ver todos",
  "common.see_details": "Ver detalhes",
  "common.request_quote": "Solicitar orçamento",
  "common.talk_whatsapp": "Falar no WhatsApp",
  "common.back_to_catalog": "Voltar para o catálogo",
  "common.published_on": "Publicado em",
  "common.tags": "Tags",
  "common.send": "Enviar",
  "common.cancel": "Cancelar",
  "common.close": "Fechar",
  "common.loading": "Carregando...",
  "common.read_more": "Ler mais",
  "common.from": "por",
  "common.min_read": "min de leitura",

  "home.cta_primary": "Explorar catálogo",
  "home.cta_secondary": "Falar com especialista",

  "products.title": "Equipamentos veterinários sob curadoria técnica.",
  "products.subtitle": "Mais de 230 produtos organizados em 8 linhas clínicas. Importação direta com garantia e treinamento.",
  "products.empty": "Nenhum produto encontrado",
  "products.empty_hint": "Tente outra busca ou navegue por categoria.",
  "products.all_categories": "Todas",
  "products.lines": "Linhas clínicas",
  "products.search_placeholder": "Buscar por modelo, nome ou categoria",
  "products.search_button": "Buscar",

  "blog.title": "Conteúdo técnico para quem opera a medicina veterinária.",
  "blog.subtitle": "Artigos, estudos e guias práticos sobre os equipamentos e protocolos que movem a clínica veterinária moderna.",
  "blog.send_article": "Enviar meu artigo →",
  "blog.send_hint": "Tem algo para compartilhar? Sua submissão passa por aprovação editorial.",
  "blog.empty": "Nenhum artigo nesta tag ainda.",
  "blog.video_badge": "Vídeo",

  "events.title": "Onde a Conecta encontra o mercado veterinário.",
  "events.subtitle": "Estamos nos principais congressos e feiras do Brasil apresentando tecnologia, treinamentos e novos lançamentos da Shinova.",
  "events.empty": "Nenhum evento nesse ano.",
  "events.photos_count_one": "foto",
  "events.photos_count_other": "fotos",

  "contact.eyebrow": "Vamos conversar",
};

const EN: Dict = {
  "nav.products": "Products",
  "nav.solutions": "Solutions",
  "nav.blog": "Blog",
  "nav.events": "Events",
  "nav.about": "About",
  "nav.contact": "Contact",
  "nav.whatsapp": "WhatsApp",
  "nav.menu": "Menu",
  "nav.search": "Search",

  "common.see_more": "See more",
  "common.see_all": "See all",
  "common.see_details": "See details",
  "common.request_quote": "Request quote",
  "common.talk_whatsapp": "Chat on WhatsApp",
  "common.back_to_catalog": "Back to catalog",
  "common.published_on": "Published on",
  "common.tags": "Tags",
  "common.send": "Send",
  "common.cancel": "Cancel",
  "common.close": "Close",
  "common.loading": "Loading...",
  "common.read_more": "Read more",
  "common.from": "by",
  "common.min_read": "min read",

  "home.cta_primary": "Browse catalog",
  "home.cta_secondary": "Talk to a specialist",

  "products.title": "Veterinary equipment under technical curation.",
  "products.subtitle": "Over 230 products organized into 8 clinical lines. Direct imports with warranty and training.",
  "products.empty": "No products found",
  "products.empty_hint": "Try another search or browse by category.",
  "products.all_categories": "All",
  "products.lines": "Clinical lines",
  "products.search_placeholder": "Search by model, name or category",
  "products.search_button": "Search",

  "blog.title": "Technical content for those who run veterinary medicine.",
  "blog.subtitle": "Articles, studies and practical guides about the equipment and protocols that drive the modern veterinary clinic.",
  "blog.send_article": "Submit my article →",
  "blog.send_hint": "Have something to share? Your submission goes through editorial review.",
  "blog.empty": "No articles in this tag yet.",
  "blog.video_badge": "Video",

  "events.title": "Where Conecta meets the veterinary market.",
  "events.subtitle": "We attend the main congresses and trade shows in Brazil presenting technology, training and new Shinova launches.",
  "events.empty": "No events this year.",
  "events.photos_count_one": "photo",
  "events.photos_count_other": "photos",

  "contact.eyebrow": "Let's talk",
};

const ES: Dict = {
  "nav.products": "Productos",
  "nav.solutions": "Soluciones",
  "nav.blog": "Blog",
  "nav.events": "Eventos",
  "nav.about": "Sobre",
  "nav.contact": "Contacto",
  "nav.whatsapp": "WhatsApp",
  "nav.menu": "Menú",
  "nav.search": "Buscar",

  "common.see_more": "Ver más",
  "common.see_all": "Ver todos",
  "common.see_details": "Ver detalles",
  "common.request_quote": "Solicitar cotización",
  "common.talk_whatsapp": "Chatear por WhatsApp",
  "common.back_to_catalog": "Volver al catálogo",
  "common.published_on": "Publicado el",
  "common.tags": "Etiquetas",
  "common.send": "Enviar",
  "common.cancel": "Cancelar",
  "common.close": "Cerrar",
  "common.loading": "Cargando...",
  "common.read_more": "Leer más",
  "common.from": "por",
  "common.min_read": "min de lectura",

  "home.cta_primary": "Explorar catálogo",
  "home.cta_secondary": "Hablar con un especialista",

  "products.title": "Equipos veterinarios con curaduría técnica.",
  "products.subtitle": "Más de 230 productos organizados en 8 líneas clínicas. Importación directa con garantía y capacitación.",
  "products.empty": "Ningún producto encontrado",
  "products.empty_hint": "Pruebe otra búsqueda o navegue por categoría.",
  "products.all_categories": "Todas",
  "products.lines": "Líneas clínicas",
  "products.search_placeholder": "Buscar por modelo, nombre o categoría",
  "products.search_button": "Buscar",

  "blog.title": "Contenido técnico para quienes operan la medicina veterinaria.",
  "blog.subtitle": "Artículos, estudios y guías prácticas sobre los equipos y protocolos que mueven la clínica veterinaria moderna.",
  "blog.send_article": "Enviar mi artículo →",
  "blog.send_hint": "¿Tiene algo que compartir? Su envío pasa por aprobación editorial.",
  "blog.empty": "Aún no hay artículos en esta etiqueta.",
  "blog.video_badge": "Video",

  "events.title": "Donde Conecta encuentra el mercado veterinario.",
  "events.subtitle": "Participamos en los principales congresos y ferias de Brasil presentando tecnología, capacitación y lanzamientos de Shinova.",
  "events.empty": "Ningún evento este año.",
  "events.photos_count_one": "foto",
  "events.photos_count_other": "fotos",

  "contact.eyebrow": "Hablemos",
};

const DICTS: Record<Locale, Dict> = { pt: PT, en: EN, es: ES };

export function t(locale: Locale, key: string): string {
  return DICTS[locale][key] ?? DICTS.pt[key] ?? key;
}
