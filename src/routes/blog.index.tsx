import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { Reveal } from "@/components/site/Reveal";
import { getPublishedPosts, formatDate, type BlogPost } from "@/lib/blog-data";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog Conecta — Conteúdo técnico para veterinários" },
      {
        name: "description",
        content:
          "Artigos técnicos sobre anestesia, imagem, laboratório e gestão clínica veterinária.",
      },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  const posts = getPublishedPosts();
  const [tag, setTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => s.add(t)));
    return Array.from(s).sort();
  }, [posts]);

  const filtered = tag ? posts.filter((p) => p.tags.includes(tag)) : posts;

  return (
    <SiteShell>
      <section className="container-edge pt-16 md:pt-24 pb-10">
        <Reveal>
          <span className="eyebrow">Blog Conecta</span>
          <h1 className="mt-4 font-serif text-5xl md:text-6xl lg:text-7xl text-ink leading-[1.02] max-w-4xl">
            Conteúdo técnico para quem opera a medicina veterinária.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-soft">
            Artigos, estudos e guias práticos sobre os equipamentos e protocolos
            que movem a clínica veterinária moderna.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <Link to="/blog/enviar" className="btn-primary">
              Enviar meu artigo →
            </Link>
            <span className="text-sm text-ink-soft">
              Tem algo para compartilhar? Sua submissão passa por aprovação editorial.
            </span>
          </div>
        </Reveal>
      </section>

      {allTags.length > 0 && (
        <section className="container-edge pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-ink-soft mr-2">
              Tags:
            </span>
            <button
              onClick={() => setTag(null)}
              className={`px-3 py-1 rounded-full text-sm border transition ${
                tag === null
                  ? "bg-ink text-bone border-ink"
                  : "bg-paper text-ink border-line-strong hover:border-ink"
              }`}
            >
              Todos
            </button>
            {allTags.map((t) => (
              <button
                key={t}
                onClick={() => setTag(t)}
                className={`px-3 py-1 rounded-full text-sm border transition ${
                  tag === t
                    ? "bg-ink text-bone border-ink"
                    : "bg-paper text-ink border-line-strong hover:border-ink"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="container-edge pb-24">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-ink-soft">
            Nenhum artigo nesta tag ainda.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filtered.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </SiteShell>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group block bg-paper border border-line rounded-2xl overflow-hidden hover:border-line-strong transition-all hover:-translate-y-1 hover:shadow-[0_12px_32px_-8px_rgba(10,10,10,0.08)]"
    >
      <div className="aspect-[4/3] overflow-hidden bg-bone">
        <img
          src={post.capa_url}
          alt={post.titulo}
          className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-ink-soft">
          {post.tags.slice(0, 2).map((t) => (
            <span key={t}>#{t}</span>
          ))}
          <span className="ml-auto text-ink-soft">{formatDate(post.publicado_em)}</span>
        </div>
        <h3 className="mt-3 font-serif text-2xl text-ink leading-snug line-clamp-2">
          {post.titulo}
        </h3>
        <p className="mt-2 text-sm text-ink-soft line-clamp-3">{post.resumo}</p>
        <p className="mt-4 text-xs text-ink-soft">por {post.autor_nome}</p>
      </div>
    </Link>
  );
}
