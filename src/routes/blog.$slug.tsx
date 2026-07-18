import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Reveal } from "@/components/site/Reveal";
import { SchemaOrg } from "@/components/shared/SchemaOrg";
import { YouTubeEmbed } from "@/components/shared/YouTubeEmbed";
import { articleSchema } from "@/lib/schema-org";
import { getPostPublic } from "@/lib/admin.functions";
import { isYoutubeUrl } from "@/lib/youtube";
import { waLink } from "@/lib/site-data";
import logoConecta from "@/assets/conecta-logo.png";

type BlogPost = {
  id: string;
  slug: string;
  titulo: string;
  resumo: string | null;
  conteudo: string | null;
  capa_url: string | null;
  video_url: string | null;
  galeria: string[] | null;
  autor_nome: string;
  autor_email: string;
  tags: string[] | null;
  status: string;
  origem: string;
  publicado_em: string | null;
  created_at: string;
  motivo_rejeicao?: string | null;
};

// Carrossel de imagens do post (capa + galeria). Sem imagem = logo da Conecta.
function BlogCarousel({ imagens, titulo }: { imagens: string[]; titulo: string }) {
  const [idx, setIdx] = useState(0);
  if (imagens.length === 0) {
    return (
      <div className="aspect-[16/9] max-h-[520px] rounded-3xl overflow-hidden bg-bone border border-line flex items-center justify-center">
        <img
          src={logoConecta}
          alt="Conecta"
          className="max-h-[40%] max-w-[50%] object-contain opacity-70"
        />
      </div>
    );
  }
  const atual = imagens[Math.min(idx, imagens.length - 1)];
  return (
    <div className="relative aspect-[16/9] max-h-[520px] rounded-3xl overflow-hidden bg-bone border border-line flex items-center justify-center">
      <img src={atual} alt={titulo} className="h-full w-full object-contain" />
      {imagens.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setIdx((i) => (i - 1 + imagens.length) % imagens.length)}
            aria-label="Imagem anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-ink/50 text-white hover:bg-ink/70 flex items-center justify-center"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setIdx((i) => (i + 1) % imagens.length)}
            aria-label="Próxima imagem"
            className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-ink/50 text-white hover:bg-ink/70 flex items-center justify-center"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {imagens.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`Ir para imagem ${i + 1}`}
                className={`h-2 rounded-full transition-all ${i === idx ? "w-6 bg-white" : "w-2 bg-white/60"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export const Route = createFileRoute("/blog/$slug")({
  head: () => ({
    meta: [{ title: "Blog Conecta" }],
  }),
  component: PostPage,
});

function NotFoundView() {
  return (
    <SiteShell>
      <div className="container-edge py-32 text-center">
        <h1 className="font-serif text-4xl">Artigo não encontrado</h1>
        <Link to="/blog" className="btn-primary mt-6 inline-flex">
          Voltar ao blog
        </Link>
      </div>
    </SiteShell>
  );
}

function PostPage() {
  const { slug } = Route.useParams();
  const { data: post, isLoading } = useQuery({
    queryKey: ["blog", "post", slug],
    queryFn: async () =>
      ((await getPostPublic({ data: { slug } })) as unknown as BlogPost | null) ?? null,
  });

  if (isLoading) {
    return (
      <SiteShell>
        <div className="container-edge py-32 text-center text-ink-soft">Carregando…</div>
      </SiteShell>
    );
  }
  if (!post) return <NotFoundView />;

  const imagens = [post.capa_url, ...(post.galeria ?? [])].filter(
    (u): u is string => !!u && u.trim().length > 0,
  );
  const capaSchema = imagens[0] ?? `https://www.conecta2lab.com.br/icon-512.png`;
  const conteudo = post.conteudo ?? "";
  const resumo = post.resumo ?? "";
  const minutos = Math.max(1, Math.round(conteudo.split(/\s+/).length / 220));

  return (
    <SiteShell>
      <SchemaOrg
        schema={articleSchema({
          titulo: post.titulo,
          resumo: resumo,
          capa: capaSchema,
          slug: post.slug,
          autor: post.autor_nome,
          publicado_em: post.publicado_em ?? post.created_at,
        })}
      />
      <article>
        <header className="container-edge pt-10 md:pt-14">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-conecta-blue"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao blog
          </Link>
          <Reveal>
            <div className="mt-6 flex items-center gap-3 text-xs font-mono uppercase tracking-wider text-ink-soft">
              {(post.tags ?? []).map((t) => (
                <span key={t}>#{t}</span>
              ))}
            </div>
            <h1 className="mt-4 font-serif text-4xl md:text-6xl text-ink leading-[1.05] max-w-4xl">
              {post.titulo}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-ink-soft">
              <span>por {post.autor_nome}</span>
              <span>·</span>
              <span>{formatDate(post.publicado_em)}</span>
              <span>·</span>
              <span>{minutos} min de leitura</span>
            </div>
          </Reveal>
        </header>

        <div className="container-edge mt-8 md:mt-12">
          {isYoutubeUrl(post.video_url) ? (
            <YouTubeEmbed url={post.video_url!} title={post.titulo} className="max-h-[560px]" />
          ) : (
            <BlogCarousel imagens={imagens} titulo={post.titulo} />
          )}
        </div>

        <div className="container-edge py-12 md:py-16">
          <div className="max-w-3xl mx-auto prose-conecta">
            <p className="text-xl text-ink-soft leading-relaxed font-serif italic">{resumo}</p>
            <div className="hairline my-8" />
            {conteudo.split("\n\n").map((p, i) => (
              <PostBlock key={i} content={p} />
            ))}
          </div>
        </div>

        <section className="container-edge pb-24">
          <div className="bg-paper border border-line rounded-3xl p-8 md:p-12 max-w-3xl mx-auto">
            <span className="eyebrow">Próximo passo</span>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl text-ink leading-tight">
              Quer conversar sobre um equipamento mencionado?
            </h2>
            <p className="mt-4 text-ink-soft">
              Nossa equipe técnica responde dúvidas e monta cotações personalizadas em até 1 dia
              útil.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link to="/contato" className="btn-primary">
                Solicitar orçamento →
              </Link>
              <a
                href={waLink(
                  `Olá! Acabei de ler o artigo "${post.titulo}" no blog da Conecta. Quero conversar.`,
                )}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>
        </section>
      </article>
    </SiteShell>
  );
}

function PostBlock({ content }: { content: string }) {
  const trimmed = content.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("## ")) {
    return <h2 className="mt-10 mb-4 font-serif text-3xl text-ink">{trimmed.slice(3)}</h2>;
  }
  if (trimmed.startsWith("- ")) {
    const items = trimmed.split("\n").map((l) => l.replace(/^-\s*/, ""));
    return (
      <ul className="my-4 space-y-2 list-disc list-inside text-ink">
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    );
  }
  return <p className="my-4 text-ink leading-relaxed">{trimmed}</p>;
}
