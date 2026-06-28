import { createFileRoute } from "@tanstack/react-router";
import categoriasJson from "@/data/categorias.json";
import produtosJson from "@/data/produtos.json";
import blogPostsJson from "@/data/blog-posts.json";
import eventosJson from "@/data/eventos.json";

/**
 * Sitemap XML dinâmico em /sitemap.xml
 *
 * Lista todas as URLs públicas do site para indexação no Google.
 */
export const Route = createFileRoute("/sitemap.xml")({
  loader: () => {
    const base = "https://www.conecta2lab.com.br";
    const now = new Date().toISOString();

    const urls: { loc: string; lastmod?: string; changefreq?: string; priority?: number }[] = [
      { loc: `${base}/`, lastmod: now, changefreq: "weekly", priority: 1.0 },
      { loc: `${base}/produtos`, lastmod: now, changefreq: "weekly", priority: 0.9 },
      { loc: `${base}/solucoes`, lastmod: now, changefreq: "monthly", priority: 0.7 },
      { loc: `${base}/sobre`, lastmod: now, changefreq: "monthly", priority: 0.7 },
      { loc: `${base}/contato`, lastmod: now, changefreq: "monthly", priority: 0.7 },
      { loc: `${base}/blog`, lastmod: now, changefreq: "weekly", priority: 0.8 },
      { loc: `${base}/eventos`, lastmod: now, changefreq: "monthly", priority: 0.6 },
    ];

    // categorias
    for (const cat of categoriasJson as Array<{ slug: string }>) {
      urls.push({
        loc: `${base}/produtos/categoria/${cat.slug}`,
        lastmod: now,
        changefreq: "weekly",
        priority: 0.8,
      });
    }

    // produtos publicados
    for (const p of produtosJson as Array<{ slug: string; publicado: boolean }>) {
      if (p.publicado === false) continue;
      urls.push({
        loc: `${base}/produtos/${p.slug}`,
        lastmod: now,
        changefreq: "weekly",
        priority: 0.7,
      });
    }

    // blog posts publicados
    for (const post of blogPostsJson as Array<{
      slug: string;
      status: string;
      publicado_em: string | null;
    }>) {
      if (post.status !== "publicado") continue;
      urls.push({
        loc: `${base}/blog/${post.slug}`,
        lastmod: post.publicado_em ?? now,
        changefreq: "monthly",
        priority: 0.6,
      });
    }

    // eventos publicados
    for (const ev of eventosJson as Array<{
      slug: string;
      publicado: boolean;
      data_evento: string;
    }>) {
      if (!ev.publicado) continue;
      urls.push({
        loc: `${base}/eventos/${ev.slug}`,
        lastmod: ev.data_evento,
        changefreq: "yearly",
        priority: 0.5,
      });
    }

    const xml =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      urls
        .map(
          (u) =>
            `  <url>\n` +
            `    <loc>${u.loc}</loc>\n` +
            (u.lastmod ? `    <lastmod>${u.lastmod.split("T")[0]}</lastmod>\n` : "") +
            (u.changefreq ? `    <changefreq>${u.changefreq}</changefreq>\n` : "") +
            (u.priority !== undefined ? `    <priority>${u.priority.toFixed(1)}</priority>\n` : "") +
            `  </url>`,
        )
        .join("\n") +
      `\n</urlset>\n`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  },
  // Sem componente, apenas retorna a Response do loader
  component: () => null,
});
