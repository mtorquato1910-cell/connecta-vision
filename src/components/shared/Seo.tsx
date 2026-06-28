import { useEffect } from "react";

const SITE_URL = "https://www.conecta2lab.com.br";
const SITE_NAME = "Conecta Equipamentos Veterinários";

export type SeoProps = {
  /** Título da aba/SERP. Já recebe o sufixo da marca se `appendSiteName` for true. */
  title: string;
  description?: string;
  /** Caminho relativo (ex.: "/produtos/xyz") ou URL absoluta. Vira canonical + og:url. */
  path?: string;
  /** URL absoluta ou relativa da imagem de compartilhamento. */
  image?: string;
  type?: "website" | "article" | "product";
  appendSiteName?: boolean;
};

/**
 * Gerencia o <head> de forma imperativa no client.
 *
 * O catálogo é renderizado client-side (server-fn em loader quebra no adapter Vercel),
 * então a meta dinâmica por produto/categoria é aplicada aqui quando os dados carregam.
 * O Googlebot renderiza JS, então title/description/canonical/OG são indexados.
 */
export function Seo({
  title,
  description,
  path,
  image,
  type = "website",
  appendSiteName = true,
}: SeoProps) {
  useEffect(() => {
    const fullTitle =
      appendSiteName && !title.includes("Conecta")
        ? `${title} — ${SITE_NAME}`
        : title;
    document.title = fullTitle;

    const abs = (u?: string) =>
      !u ? undefined : u.startsWith("http") ? u : `${SITE_URL}${u.startsWith("/") ? "" : "/"}${u}`;
    const url = abs(path);
    const img = abs(image);

    const setMeta = (attr: "name" | "property", key: string, value?: string) => {
      if (!value) return;
      let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
    };

    setMeta("name", "description", description);
    setMeta("property", "og:title", fullTitle);
    setMeta("name", "twitter:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("name", "twitter:description", description);
    setMeta("property", "og:type", type === "product" ? "website" : type);
    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:locale", "pt_BR");
    if (url) setMeta("property", "og:url", url);
    if (img) {
      setMeta("property", "og:image", img);
      setMeta("name", "twitter:image", img);
      setMeta("name", "twitter:card", "summary_large_image");
    }

    if (url) {
      let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", url);
    }
  }, [title, description, path, image, type, appendSiteName]);

  return null;
}
