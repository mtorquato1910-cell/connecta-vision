import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { CATEGORIAS, findCategoria, type Produto } from "@/lib/site-data";
import { produtosPorCategoria } from "@/lib/produtos-data";

export const Route = createFileRoute("/produtos/categoria/$slug")({
  // Dados estáticos do bundle, resolvidos no servidor (SSR-safe). A categoria
  // e seus produtos saem renderizados no HTML cru, indexáveis sem JS.
  loader: ({ params }) => {
    const cat = findCategoria(params.slug);
    if (!cat) throw notFound();
    const produtos = produtosPorCategoria(params.slug);
    const outras = CATEGORIAS.filter((c) => c.slug !== params.slug);
    return { cat: { ...cat, qtd: produtos.length }, produtos, outras };
  },
  head: ({ loaderData }) => {
    const nome = loaderData?.cat.nome ?? "Categoria";
    const qtd = loaderData?.produtos.length ?? 0;
    const plural = qtd === 1 ? "equipamento" : "equipamentos";
    return {
      meta: [
        { title: `${nome}, Equipamentos Veterinários | Conecta` },
        {
          name: "description",
          content: `${qtd} ${plural} da linha ${nome} no catálogo Conecta. Distribuidor oficial Shinova no Brasil, com instalação, calibração e treinamento inclusos.`,
        },
      ],
    };
  },
  component: CategoriaPage,
});

function CategoriaPage() {
  const { cat, produtos, outras } = Route.useLoaderData();
  return (
    <SiteShell>
      <section className="container-edge pt-16 md:pt-24 pb-10">
        <Reveal>
          <div className="flex items-center gap-3 text-sm text-ink-soft">
            <Link to="/produtos" className="hover:text-conecta-blue">Catálogo</Link>
            <span>/</span>
            <span className="text-ink">{cat.nome}</span>
          </div>
          <div className="mt-6 flex items-baseline gap-4">
            <span className="font-mono text-conecta-orange text-sm tracking-[0.2em]">{cat.num}</span>
            <h1 className="font-serif text-5xl md:text-6xl text-ink leading-tight">{cat.nome}</h1>
          </div>
          <p className="mt-4 text-ink-soft max-w-2xl">
            {produtos.length} {produtos.length === 1 ? "equipamento" : "equipamentos"} desta linha clínica disponíveis no catálogo Conecta.
          </p>
        </Reveal>
      </section>

      <section className="container-edge pb-24">
        {produtos.length === 0 ? (
          <div className="bg-paper border border-line rounded-3xl p-16 text-center">
            <h3 className="font-serif text-2xl">Em breve novos lançamentos</h3>
            <p className="mt-2 text-ink-soft">Fale com a gente para conhecer o portfólio completo desta linha.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {produtos.map((p: Produto) => (
              <Reveal key={p.slug}><ProductCard p={p} /></Reveal>
            ))}
          </div>
        )}
      </section>

      <section className="container-edge pb-24">
        <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink-soft mb-4">Outras linhas</div>
        <div className="flex flex-wrap gap-2">
          {outras.map((c) => (
            <Link key={c.slug} to="/produtos/categoria/$slug" params={{ slug: c.slug }} className="text-sm rounded-full bg-paper border border-line-strong px-4 py-2 hover:border-conecta-blue/40 transition">
              {c.nome}
            </Link>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
