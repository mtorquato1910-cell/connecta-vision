import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, MessageCircle, Send } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { ProductCard } from "@/components/site/ProductCard";
import { QuoteModal } from "@/components/site/QuoteModal";
import { Reveal } from "@/components/site/Reveal";
import { findProduto, produtosRelacionados, waLink, type Produto, type Especificacao } from "@/lib/site-data";

export const Route = createFileRoute("/produtos/$slug")({
  loader: ({ params }) => {
    const p = findProduto(params.slug);
    if (!p) throw notFound();
    return { p, relacionados: produtosRelacionados(p) };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.p.modelo} — ${loaderData.p.nome} | Conecta` },
          { name: "description", content: loaderData.p.resumo ?? loaderData.p.nome },
          { property: "og:title", content: `${loaderData.p.modelo} — Conecta` },
          { property: "og:description", content: loaderData.p.resumo ?? loaderData.p.nome },
          { property: "og:image", content: loaderData.p.img },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <SiteShell>
      <div className="container-edge py-32 text-center">
        <h1 className="font-serif text-4xl">Produto não encontrado</h1>
        <Link to="/produtos" className="btn-primary mt-6 inline-flex">Ver catálogo</Link>
      </div>
    </SiteShell>
  ),
  errorComponent: ({ error }) => (
    <SiteShell><div className="container-edge py-32"><p>Erro: {error.message}</p></div></SiteShell>
  ),
  component: ProdutoPage,
});

function ProdutoPage() {
  const { p, relacionados } = Route.useLoaderData();
  const [activeImg, setActiveImg] = useState(p.galeria?.[0] ?? p.img);
  const [tab, setTab] = useState<"desc" | "specs" | "uso">("desc");
  const [open, setOpen] = useState(false);

  const waMsg = `Olá! Tenho interesse no ${p.modelo} — ${p.nome}. Pode me enviar mais informações?`;

  return (
    <SiteShell>
      <section className="container-edge pt-10 md:pt-14 pb-16">
        <div className="flex items-center gap-2 text-sm text-ink-soft">
          <Link to="/produtos" className="hover:text-conecta-blue inline-flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Catálogo
          </Link>
          <span>/</span>
          <Link to="/produtos/categoria/$slug" params={{ slug: p.categoriaSlug }} className="hover:text-conecta-blue">
            {p.categoriaNome}
          </Link>
        </div>

        <div className="mt-8 grid lg:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <div className="aspect-square rounded-3xl overflow-hidden bg-paper border border-line">
              <img src={activeImg} alt={p.nome} className="h-full w-full object-cover" />
            </div>
            {p.galeria && p.galeria.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {p.galeria.map((g) => (
                  <button
                    key={g}
                    onClick={() => setActiveImg(g)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition ${activeImg === g ? "border-conecta-orange" : "border-line hover:border-line-strong"}`}
                  >
                    <img src={g} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <Reveal>
              <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-conecta-orange">{p.modelo}</div>
              <h1 className="mt-3 font-serif text-4xl md:text-5xl text-ink leading-[1.05]">{p.nome}</h1>
              {p.resumo && <p className="mt-5 text-lg text-ink-soft leading-relaxed">{p.resumo}</p>}

              {p.diferenciais && p.diferenciais.length > 0 && (
                <ul className="mt-6 space-y-2">
                  {p.diferenciais.slice(0, 4).map((d) => (
                    <li key={d} className="flex items-start gap-3 text-sm text-ink">
                      <span className="mt-0.5 h-5 w-5 rounded-full bg-conecta-orange/15 text-conecta-orange flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3" />
                      </span>
                      {d}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button onClick={() => setOpen(true)} className="btn-primary">
                  <Send className="h-4 w-4" /> Solicitar orçamento
                </button>
                <a href={waLink(waMsg)} target="_blank" rel="noreferrer" className="btn-ghost">
                  <MessageCircle className="h-4 w-4" /> Falar no WhatsApp
                </a>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3 text-center">
                <Mini label="Garantia" valor="12 meses" />
                <Mini label="Entrega" valor="Nacional" />
                <Mini label="Suporte" valor="Treinamento" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="container-edge pb-20">
        <div className="border-b border-line flex gap-6">
          {[
            { id: "desc" as const, label: "Descrição" },
            { id: "specs" as const, label: "Especificações" },
            { id: "uso" as const, label: "Aplicações" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative pb-3 text-sm font-medium transition ${tab === t.id ? "text-ink" : "text-ink-soft hover:text-ink"}`}
            >
              {t.label}
              {tab === t.id && <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-conecta-orange" />}
            </button>
          ))}
        </div>

        <div className="mt-8 max-w-3xl">
          {tab === "desc" && (
            <div className="prose-conecta text-ink-soft leading-relaxed space-y-4">
              <p>{p.descricao ?? p.resumo}</p>
              {p.diferenciais && (
                <ul className="space-y-2 text-ink">
                  {p.diferenciais.map((d) => (
                    <li key={d} className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-conecta-orange mt-1 shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {tab === "specs" && (
            <div className="bg-paper border border-line rounded-3xl overflow-hidden">
              {p.especificacoes && p.especificacoes.length > 0 ? (
                <dl>
                  {p.especificacoes.map((e, i) => (
                    <div key={e.label} className={`grid grid-cols-3 gap-4 px-6 py-4 ${i % 2 ? "bg-bone/50" : ""}`}>
                      <dt className="text-sm font-mono uppercase tracking-wider text-ink-soft">{e.label}</dt>
                      <dd className="col-span-2 text-sm text-ink">{e.valor}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="p-6 text-ink-soft">Solicite a ficha técnica completa pelo orçamento.</p>
              )}
            </div>
          )}
          {tab === "uso" && (
            <div className="flex flex-wrap gap-2">
              {(p.aplicacoes ?? ["Clínica geral", "Hospital veterinário"]).map((a) => (
                <span key={a} className="px-4 py-2 rounded-full bg-paper border border-line-strong text-sm text-ink">{a}</span>
              ))}
            </div>
          )}
        </div>
      </section>

      {relacionados.length > 0 && (
        <section className="container-edge pb-24">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="eyebrow">Relacionados</span>
              <h2 className="mt-3 font-serif text-3xl md:text-4xl">Outros itens da mesma linha</h2>
            </div>
            <Link to="/produtos/categoria/$slug" params={{ slug: p.categoriaSlug }} className="text-sm text-conecta-blue hover:underline">
              Ver toda a linha →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relacionados.map((r) => <ProductCard key={r.slug} p={r} />)}
          </div>
        </section>
      )}

      <QuoteModal produto={p} open={open} onClose={() => setOpen(false)} />
    </SiteShell>
  );
}

function Mini({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="rounded-2xl border border-line bg-paper py-3 px-2">
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-soft">{label}</div>
      <div className="mt-1 text-sm font-medium text-ink">{valor}</div>
    </div>
  );
}
