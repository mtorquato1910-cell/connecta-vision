import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PlayCircle } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Reveal } from "@/components/site/Reveal";
import { listPublishedPosts } from "@/lib/admin.functions";
import { isYoutubeUrl, youtubeThumbnail } from "@/lib/youtube";
import { useLocale } from "@/hooks/useLocale";

type BlogPost = {
  id: string;
  slug: string;
  titulo: string;
  resumo: string | null;
  conteudo: string | null;
  capa_url: string | null;
  video_url: string | null;
  autor_nome: string;
  autor_email: string;
  tags: string[] | null;
  status: string;
  origem: string;
  publicado_em: string | null;
  created_at: string;
  motivo_rejeicao?: string | null;
};

const FALLBACK_CAPA =
  "https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?w=1600&q=85";

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog Conecta, Conteúdo técnico para veterinários" },
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
  const { data, isLoading } = useQuery({
    queryKey: ["blog", "published"],
    queryFn: async () => (await listPublishedPosts()) as unknown as BlogPost[],
  });
  const posts = useMemo(() => data ?? [], [data]);
  const [tag, setTag] = useState<string | null>(null);
  const { t } = useLocale();

  const allTags = useMemo(() => {
    const s = new Set<string>();
    posts.forEach((p) => (p.tags ?? []).forEach((tg) => s.add(tg)));
    return Array.from(s).sort();
  }, [posts]);

  const filtered = tag ? posts.filter((p) => (p.tags ?? []).includes(tag)) : posts;

  return (
    <SiteShell>
      <section className="container-edge pt-16 md:pt-24 pb-10">
        <Reveal>
          <span className="eyebrow">Blog Conecta</span>
          <h1 className="mt-4 font-serif text-5xl md:text-6xl lg:text-7xl text-ink leading-[1.02] max-w-4xl">
            {t("blog.title")}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-soft">{t("blog.subtitle")}</p>
          <div className="mt-8 flex items-center gap-3 flex-wrap">
            <Link to="/blog/enviar" className="btn-primary">
              {t("blog.send_article")}
            </Link>
            <span className="text-sm text-ink-soft">{t("blog.send_hint")}</span>
          </div>
        </Reveal>
      </section>

      {allTags.length > 0 && (
        <section className="container-edge pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-ink-soft mr-2">
              {t("common.tags")}:
            </span>
            <button
              onClick={() => setTag(null)}
              className={`px-3 py-1 rounded-full text-sm border transition ${
                tag === null
                  ? "bg-ink text-bone border-ink"
                  : "bg-paper text-ink border-line-strong hover:border-ink"
              }`}
            >
              {t("products.all_categories")}
            </button>
            {allTags.map((tg) => (
              <button
                key={tg}
                onClick={() => setTag(tg)}
                className={`px-3 py-1 rounded-full text-sm border transition ${
                  tag === tg
                    ? "bg-ink text-bone border-ink"
                    : "bg-paper text-ink border-line-strong hover:border-ink"
                }`}
              >
                {tg}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="container-edge pb-24">
        {isLoading ? (
          <div className="py-16 text-center text-ink-soft">Carregando…</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-ink-soft">{t("blog.empty")}</div>
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
  const hasVideo = isYoutubeUrl(post.video_url);
  const capa = post.capa_url || FALLBACK_CAPA;
  const imgSrc =
    hasVideo && post.video_url
      ? youtubeThumbnail(post.video_url, "max") || capa
      : capa;
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group block bg-paper border border-line rounded-2xl overflow-hidden hover:border-line-strong transition-all hover:-translate-y-1 hover:shadow-[0_12px_32px_-8px_rgba(10,10,10,0.08)]"
    >
      <div className="aspect-[4/3] overflow-hidden bg-bone relative">
        <img
          src={imgSrc}
          alt={post.titulo}
          className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
        />
        {hasVideo && (
          <>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayCircle className="h-14 w-14 text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
            </div>
            <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-paper/90 backdrop-blur px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-ink">
              Vídeo
            </span>
          </>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-ink-soft">
          {(post.tags ?? []).slice(0, 2).map((t) => (
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
