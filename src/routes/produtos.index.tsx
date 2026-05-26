import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { CATEGORIAS, PRODUTOS } from "@/lib/site-data";

type Search = { q?: string; cat?: string };

export const Route = createFileRoute("/produtos/")({
  head: () => ({
    meta: [
      { title: "Catálogo de Equipamentos Veterinários — Conecta" },
      { name: "description", content: "Catálogo completo de equipamentos veterinários: anestesia, imagem, laboratório, odontologia, oftalmologia e mais." },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s.q === "string" ? s.q : undefined,
    cat: typeof s.cat === "string" ? s.cat : undefined,
  }),
  component: ProdutosPage,
});

function ProdutosPage() {
  const { q, cat } = Route.useSearch();
  const navigate = useNavigate({ from: "/produtos" });
  const [query, setQuery] = useState(q ?? "");

  const filtered = useMemo(() => {
    const term = (q ?? "").trim().toLowerCase();
    return PRODUTOS.filter((p) => {
      if (cat && p.categoriaSlug !== cat) return false;
      if (!term) return true;
      return (
        p.nome.toLowerCase().includes(term) ||
        p.modelo.toLowerCase().includes(term) ||
        p.categoriaNome.toLowerCase().includes(term)
      );
    });
  }, [q, cat]);

  const activeCat = cat ? CATEGORIAS.find((c) => c.slug === cat) : null;

  return (
    <SiteShell>
      <section className="container-edge pt-16 md:pt-24 pb-10">
        <Reveal>
          <span className="eyebrow">Catálogo completo</span>
          <h1 className="mt-4 font-serif text-5xl md:text-6xl lg:text-7xl text-ink leading-[1.02] max-w-4xl">
            {activeCat ? activeCat.nome : "Equipamentos veterinários sob curadoria técnica."}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-soft">
            {activeCat
              ? `${filtered.length} produtos nesta linha clínica, com suporte e treinamento inclusos.`
              : "Mais de 230 produtos organizados em 8 linhas clínicas. Importação direta com garantia e treinamento."}
          </p>
        </Reveal>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ search: (prev: Search) => ({ ...prev, q: query || undefined }) });
          }}
          className="mt-10 flex items-center gap-3 max-w-2xl bg-paper border border-line-strong rounded-full pl-5 pr-2 py-2"
        >
          <Search className="h-4 w-4 text-ink-soft" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por modelo, nome ou categoria"
            className="flex-1 bg-transparent outline-none text-sm py-2"
          />
          {query && (
            <button type="button" onClick={() => { setQuery(""); navigate({ search: (prev: Search) => ({ ...prev, q: undefined }) }); }} className="h-8 w-8 rounded-full hover:bg-bone flex items-center justify-center">
              <X className="h-4 w-4" />
            </button>
          )}
          <button type="submit" className="bg-conecta-blue text-white text-sm font-medium px-5 py-2 rounded-full hover:opacity-90">
            Buscar
          </button>
        </form>
      </section>

      <section className="container-edge pb-24">
        <div className="grid lg:grid-cols-[260px_1fr] gap-10">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink-soft mb-4">Linhas clínicas</div>
            <div className="flex lg:flex-col flex-wrap gap-2">
              <CatPill active={!cat} to="/produtos" search={{}}>
                Todas <span className="opacity-50">({PRODUTOS.length})</span>
              </CatPill>
              {CATEGORIAS.map((c) => (
                <CatPill key={c.slug} active={cat === c.slug} to="/produtos" search={{ cat: c.slug }}>
                  {c.nome}
                </CatPill>
              ))}
            </div>
          </aside>

          <div>
            {filtered.length === 0 ? (
              <div className="bg-paper border border-line rounded-3xl p-16 text-center">
                <h3 className="font-serif text-2xl text-ink">Nenhum produto encontrado</h3>
                <p className="mt-2 text-ink-soft">Tente outra busca ou navegue por categoria.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((p) => (
                  <Reveal key={p.slug}>
                    <ProductCard p={p} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function CatPill({ to, search, active, children }: { to: "/produtos"; search: Search; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      search={search}
      className={`text-sm rounded-full border px-4 py-2 transition ${
        active
          ? "bg-conecta-blue text-white border-conecta-blue"
          : "bg-paper text-ink border-line-strong hover:border-conecta-blue/40"
      }`}
    >
      {children}
    </Link>
  );
}
