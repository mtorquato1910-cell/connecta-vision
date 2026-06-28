import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, MessageCircle, Send } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { ProductCard } from "@/components/site/ProductCard";
import { QuoteModal } from "@/components/site/QuoteModal";
import { Reveal } from "@/components/site/Reveal";
import { CategoryBadge } from "@/components/shared/CategoryBadge";
import { SchemaOrg } from "@/components/shared/SchemaOrg";
import { productSchema, breadcrumbSchema } from "@/lib/schema-org";
import { waLink, type Produto, type Especificacao } from "@/lib/site-data";
import { findProduto, produtosRelacionados } from "@/lib/produtos-data";

export const Route = createFileRoute("/produtos/$slug")({
  // Dados estáticos do bundle, resolvidos no servidor (SSR-safe). A ficha do
  // produto (nome, resumo, descrição, specs) sai no HTML cru, indexável sem JS.
  loader: ({ params }) => {
    const p = findProduto(params.slug);
    if (!p) throw notFound();
    const relacionados = produtosRelacionados(p, 3);
    return { p, relacionados };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.p;
    if (!p) {
      return { meta: [{ title: "Produto, Conecta Equipamentos Veterinários" }] };
    }
    const descricao =
      p.resumo ??
      p.descricao ??
      `${p.nome} (${p.modelo}), ${p.categoriaNome} no catálogo Conecta Equipamentos Veterinários.`;
    return {
      meta: [
        { title: `${p.modelo}, ${p.nome} | Conecta` },
        { name: "description", content: descricao },
        { property: "og:title", content: `${p.modelo}, ${p.nome}` },
        { property: "og:description", content: descricao },
        { property: "og:type", content: "product" },
        { property: "og:image", content: p.img },
      ],
    };
  },
  component: ProdutoPage,
});

function ProdutoPage() {
  const { p, relacionados } = Route.useLoaderData();
  return <ProdutoView p={p} relacionados={relacionados} />;
}

function ProdutoView({ p, relacionados }: { p: Produto; relacionados: Produto[] }) {
  const router = useRouter();
  const [activeImg, setActiveImg] = useState(p.galeria?.[0] ?? p.img);
  const [open, setOpen] = useState(false);

  const waMsg = `Olá! Tenho interesse no ${p.modelo}, ${p.nome}. Pode me enviar mais informações?`;
  const temEspecificacoes = !!p.especificacoes && p.especificacoes.length > 0;
  const aplicacoes = p.aplicacoes && p.aplicacoes.length > 0 ? p.aplicacoes : [];

  const goBack = () => {
    if (window.history.length > 1) router.history.back();
    else router.navigate({ to: "/produtos" });
  };

  return (
    <SiteShell>
      <SchemaOrg
        schema={productSchema({
          modelo: p.modelo,
          nome: p.nome,
          descricao: p.descricao ?? p.resumo ?? p.nome,
          imagem: p.img,
          slug: p.slug,
          categoria: p.categoriaNome,
        })}
      />
      <SchemaOrg
        schema={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Catálogo", url: "/produtos" },
          { name: p.categoriaNome, url: `/produtos/categoria/${p.categoriaSlug}` },
          { name: p.modelo, url: `/produtos/${p.slug}` },
        ])}
      />
      <section className="container-edge pt-8 pb-2">
        <button
          onClick={goBack}
          className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft hover:text-ink transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          Voltar para o catálogo
        </button>
      </section>

      <section className="container-edge pt-4 md:pt-6 pb-16">
        <div className="flex items-center gap-2 text-sm text-ink-soft">
          <Link to="/produtos" className="hover:text-conecta-blue inline-flex items-center gap-1">
            Catálogo
          </Link>
          <span>/</span>
          <Link to="/produtos/categoria/$slug" params={{ slug: p.categoriaSlug }} className="hover:text-conecta-blue">
            {p.categoriaNome}
          </Link>
        </div>

        <div className="mt-8 grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Galeria / carrossel */}
          <div>
            <div className="aspect-square rounded-3xl overflow-hidden bg-paper border border-line">
              <img src={activeImg} alt={p.nome} className="h-full w-full object-contain p-4" />
            </div>
            {p.galeria && p.galeria.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {p.galeria.map((g: string) => (
                  <button
                    key={g}
                    onClick={() => setActiveImg(g)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition ${activeImg === g ? "border-conecta-orange" : "border-line hover:border-line-strong"}`}
                  >
                    <img src={g} alt="" className="h-full w-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cabeçalho: NOME em destaque → resumo logo abaixo */}
          <div>
            <Reveal>
              <CategoryBadge>{p.categoriaNome}</CategoryBadge>
              <h1 className="mt-4 font-serif text-4xl md:text-5xl text-ink leading-[1.05]">{p.nome}</h1>
              <div className="mt-3 font-mono text-[11px] tracking-[0.2em] uppercase text-conecta-orange">
                {p.modelo}
              </div>
              {p.resumo && (
                <p className="mt-5 text-lg text-ink-soft leading-relaxed">{p.resumo}</p>
              )}

              {p.diferenciais && p.diferenciais.length > 0 && (
                <ul className="mt-6 space-y-2">
                  {p.diferenciais.slice(0, 4).map((d: string) => (
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

      {/* Seção completa: descrição → especificações → aplicações */}
      <section className="container-edge pb-20">
        <div className="grid lg:grid-cols-[1fr_360px] gap-12 lg:gap-16">
          <div className="max-w-3xl">
            {(p.descricao || p.resumo) && (
              <div>
                <h2 className="font-serif text-2xl md:text-3xl text-ink">Descrição completa</h2>
                <div className="mt-5 prose-conecta text-ink-soft leading-relaxed space-y-3">
                  {(p.descricao ?? p.resumo ?? "")
                    .split(/\n+/)
                    .map((par) => par.trim())
                    .filter(Boolean)
                    .map((par, i) => (
                      <p key={i}>{par}</p>
                    ))}
                </div>
                {p.diferenciais && p.diferenciais.length > 0 && (
                  <ul className="mt-6 space-y-2 text-ink">
                    {p.diferenciais.map((d: string) => (
                      <li key={d} className="flex items-start gap-3">
                        <Check className="h-4 w-4 text-conecta-orange mt-1 shrink-0" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="mt-12">
              <h2 className="font-serif text-2xl md:text-3xl text-ink">Especificações técnicas</h2>
              <div className="mt-5 bg-paper border border-line rounded-3xl overflow-hidden">
                {temEspecificacoes ? (
                  <dl>
                    {p.especificacoes!.map((e: Especificacao, i: number) => (
                      <div key={`${e.label}-${i}`} className={`grid grid-cols-3 gap-4 px-6 py-4 ${i % 2 ? "bg-bone/50" : ""}`}>
                        <dt className="text-sm font-mono uppercase tracking-wider text-ink-soft">{e.label}</dt>
                        <dd className="col-span-2 text-sm text-ink">{e.valor}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="p-6 text-ink-soft">Solicite a ficha técnica completa pelo orçamento.</p>
                )}
              </div>
            </div>
          </div>

          {/* Aplicações */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <h2 className="font-serif text-2xl md:text-3xl text-ink">Aplicações</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {(aplicacoes.length > 0 ? aplicacoes : ["Clínica geral", "Hospital veterinário"]).map(
                (a: string) => (
                  <span key={a} className="px-4 py-2 rounded-full bg-paper border border-line-strong text-sm text-ink">
                    {a}
                  </span>
                ),
              )}
            </div>
          </aside>
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
            {relacionados.map((r: Produto) => <ProductCard key={r.slug} p={r} />)}
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
