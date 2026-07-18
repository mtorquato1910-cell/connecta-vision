import { createFileRoute } from "@tanstack/react-router";
import { listCategorias, listProdutos } from "@/lib/catalog.functions";
import { listPublishedPosts, listEventosPublic } from "@/lib/admin.functions";

/**
 * Sitemap XML dinâmico em /sitemap.xml
 *
 * Lista todas as URLs públicas do site para indexação no Google, lidas do
 * Supabase em runtime — reflete produto/categoria/post/evento novo na hora.
 */
export const Route = createFileRoute("/sitemap.xml")({
  loader: async () => {
    const base = "https://www.conecta2lab.com.br";
    const now = new Date().toISOString();

    const [categorias, produtos, posts, eventos] = await Promise.all([
      listCategorias(),
      listProdutos({}),
      listPublishedPosts() as Promise<Array<{ slug: string; publicado_em: string | null }>>,
      listEventosPublic() as Promise<Array<{ slug: string; data_evento: string | null }>>,
    ]);

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
    for (const cat of categorias) {
      urls.push({
        loc: `${base}/produtos/categoria/${cat.slug}`,
        lastmod: now,
        changefreq: "weekly",
        priority: 0.8,
      });
    }

    // produtos (listProdutos já retorna só os publicados)
    for (const p of produtos) {
      urls.push({
        loc: `${base}/produtos/${p.slug}`,
        lastmod: now,
        changefreq: "weekly",
        priority: 0.7,
      });
    }

    // blog posts publicados
    for (const post of posts) {
      urls.push({
        loc: `${base}/blog/${post.slug}`,
        lastmod: post.publicado_em ?? now,
        changefreq: "monthly",
        priority: 0.6,
      });
    }

    // eventos publicados
    for (const ev of eventos) {
      urls.push({
        loc: `${base}/eventos/${ev.slug}`,
        lastmod: ev.data_evento ?? now,
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
            (u.priority !== undefined
              ? `    <priority>${u.priority.toFixed(1)}</priority>\n`
              : "") +
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
