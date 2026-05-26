import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Reveal } from "@/components/site/Reveal";
import { SchemaOrg } from "@/components/shared/SchemaOrg";
import { YouTubeEmbed } from "@/components/shared/YouTubeEmbed";
import { articleSchema } from "@/lib/schema-org";
import { formatDate, getPostBySlug } from "@/lib/blog-data";
import { isYoutubeUrl } from "@/lib/youtube";
import { waLink } from "@/lib/site-data";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post || post.status !== "publicado") throw notFound();
    return { post };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `${loaderData.post.titulo} — Blog Conecta` },
            { name: "description", content: loaderData.post.resumo },
            { property: "og:title", content: loaderData.post.titulo },
            { property: "og:description", content: loaderData.post.resumo },
            { property: "og:image", content: loaderData.post.capa_url },
          ],
        }
      : { meta: [] },
  notFoundComponent: () => (
    <SiteShell>
      <div className="container-edge py-32 text-center">
        <h1 className="font-serif text-4xl">Artigo não encontrado</h1>
        <Link to="/blog" className="btn-primary mt-6 inline-flex">
          Voltar ao blog
        </Link>
      </div>
    </SiteShell>
  ),
  component: PostPage,
});

function PostPage() {
  const { post } = Route.useLoaderData();
  const minutos = Math.max(1, Math.round(post.conteudo.split(/\s+/).length / 220));

  return (
    <SiteShell>
      <SchemaOrg
        schema={articleSchema({
          titulo: post.titulo,
          resumo: post.resumo,
          capa: post.capa_url,
          slug: post.slug,
          autor: post.autor_nome,
          publicado_em: post.publicado_em ?? post.criado_em,
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
              {post.tags.map((t) => (
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
            <YouTubeEmbed
              url={post.video_url!}
              title={post.titulo}
              className="max-h-[560px]"
            />
          ) : (
            <div className="aspect-[16/9] max-h-[520px] rounded-3xl overflow-hidden bg-bone border border-line">
              <img
                src={post.capa_url}
                alt={post.titulo}
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="container-edge py-12 md:py-16">
          <div className="max-w-3xl mx-auto prose-conecta">
            <p className="text-xl text-ink-soft leading-relaxed font-serif italic">
              {post.resumo}
            </p>
            <div className="hairline my-8" />
            {post.conteudo.split("\n\n").map((p, i) => (
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
              Nossa equipe técnica responde dúvidas e monta cotações personalizadas
              em até 1 dia útil.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link to="/contato" className="btn-primary">
                Solicitar orçamento →
              </Link>
              <a
                href={waLink(`Olá! Acabei de ler o artigo "${post.titulo}" no blog da Conecta. Quero conversar.`)}
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
    return (
      <h2 className="mt-10 mb-4 font-serif text-3xl text-ink">
        {trimmed.slice(3)}
      </h2>
    );
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
