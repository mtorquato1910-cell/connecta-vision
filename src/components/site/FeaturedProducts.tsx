import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PRODUTOS_DESTAQUE } from "@/lib/site-data";
import { Reveal } from "./Reveal";

export function FeaturedProducts() {
  return (
    <section className="bg-paper">
      <div className="container-edge py-20 md:py-28">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <Reveal>
              <span className="eyebrow">Equipamentos em destaque</span>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUTOS_DESTAQUE.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.04}>
              <Link
                to="/produtos/$slug"
                params={{ slug: p.slug }}
                className="group block rounded-2xl overflow-hidden border border-line bg-bone hover:border-conecta-orange/40 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="aspect-[4/3] overflow-hidden bg-[#f5f5f0]">
                  <img src={p.img} alt={p.nome} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-conecta-orange">
                    {p.categoriaNome}
                  </div>
                  <h3 className="mt-2 font-serif text-2xl text-ink leading-tight">{p.modelo}</h3>
                  <p className="mt-1 text-sm text-ink-soft line-clamp-2">{p.nome}</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-conecta-blue">
                    Ver detalhes <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
