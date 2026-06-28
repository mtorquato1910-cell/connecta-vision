import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { homeCatalogo } from "@/lib/catalog.functions";
import { dtoToProdutoList } from "@/lib/catalog-adapter";
import { ProductCard } from "./ProductCard";
import { Reveal } from "./Reveal";

export function FeaturedProducts() {
  const { data } = useQuery({
    queryKey: ["home-catalogo"],
    queryFn: () => homeCatalogo(),
  });
  const destaques = (data?.destaques ?? []).map(dtoToProdutoList);
  return (
    <section className="bg-paper">
      <div className="container-edge py-20 md:py-28">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <Reveal>
              <span className="eyebrow-bracket">Equipamentos em destaque</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 font-serif text-4xl md:text-5xl leading-[1.05] text-ink">
                Os equipamentos <em className="italic text-conecta-orange">mais procurados</em> pela rede Conecta.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 text-ink-soft">
                Curadoria atualizada mensalmente baseada em demanda real do mercado brasileiro.
              </p>
            </Reveal>
          </div>
          <Link to="/produtos" className="btn-ghost shrink-0">
            Catálogo completo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
        >
          {destaques.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.04}>
              <ProductCard p={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
