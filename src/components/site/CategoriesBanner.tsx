import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { homeCatalogo } from "@/lib/catalog.functions";
import { dtoToCategoria } from "@/lib/catalog-adapter";
import { Reveal } from "./Reveal";

export function CategoriesBanner() {
  const { data } = useQuery({
    queryKey: ["home-catalogo"],
    queryFn: () => homeCatalogo(),
  });
  const categorias = (data?.categorias ?? []).map((c) => dtoToCategoria(c, c.qtd));
  return (
    <section className="bg-bone border-y border-line">
      <div className="container-edge py-20 md:py-28">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <Reveal>
            <span className="eyebrow">Catálogo completo</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 font-serif text-4xl md:text-5xl leading-[1.05] text-ink">
              Oito linhas clínicas. <em className="italic text-conecta-orange">Uma operação confiável.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-ink-soft text-lg">
              Cada equipamento passa por validação técnica antes de entrar no portfólio. Navegue por categoria
              e encontre exatamente o que sua operação precisa.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categorias.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.04}>
              <Link
                to="/produtos/categoria/$slug"
                params={{ slug: c.slug }}
                className="group block relative rounded-2xl overflow-hidden bg-paper border border-line hover:border-conecta-orange/40 transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-square overflow-hidden bg-white">
                  <img src={c.img} alt={c.nome} loading="lazy" className="h-full w-full object-contain p-4 transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute top-3 right-3 h-9 w-9 rounded-full bg-paper/90 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition translate-y-1 group-hover:translate-y-0 z-10">
                    <ArrowUpRight className="h-4 w-4 text-conecta-blue" />
                  </span>
                </div>
                <div className="p-5">
                  <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-conecta-orange">
                    {c.num} / 08
                  </div>
                  <h3 className="mt-2 font-serif text-[22px] leading-tight text-ink">{c.nome}</h3>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-ink-soft">
                      {c.qtd} Equipamentos
                    </span>
                    <span className="text-xs font-medium text-conecta-blue opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
                      Ver produtos <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/produtos" className="btn-primary text-base px-7 py-3.5">
            Ver catálogo completo (230+ equipamentos) <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
