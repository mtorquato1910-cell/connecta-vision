import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { waLink } from "@/lib/site-data";
import { Reveal } from "./Reveal";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="container-edge pt-10 sm:pt-16 md:pt-24 pb-16 md:pb-28 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-7">
          <Reveal>
            <span className="eyebrow">Equipamentos veterinários premium</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-5 sm:mt-6 font-serif text-[32px] sm:text-[40px] md:text-[52px] lg:text-[64px] leading-[1.02] tracking-tight text-ink">
              Equipamentos veterinários <em className="italic text-conecta-blue">de origem</em> — para quem não aceita aproximação clínica.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 sm:mt-6 text-base sm:text-lg text-ink-soft max-w-xl leading-relaxed">
              Distribuímos a linha completa <strong className="text-ink">Shinova</strong> no Brasil — anestesia, monitoramento, imagem, laboratório,
              odontologia, cirurgia, oftalmologia e estética veterinária. Mais de 230 equipamentos em catálogo,
              importação direta, suporte técnico nacional.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-7 sm:mt-8 flex flex-wrap gap-3">
              <Link to="/produtos" className="btn-primary">
                Explorar catálogo <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={waLink()} target="_blank" rel="noreferrer" className="btn-ghost">
                Falar com especialista <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.22}>
            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-3">
                {[
                  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&q=80",
                  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&q=80",
                  "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=120&q=80",
                ].map((src) => (
                  <img key={src} src={src} alt="" className="h-10 w-10 rounded-full border-2 border-paper object-cover" />
                ))}
              </div>
              <p className="text-sm text-ink-soft max-w-xs">
                <strong className="text-ink">Mais de 40 clínicas e hospitais</strong> já operam com equipamentos Conecta.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-5">
          <Reveal delay={0.1}>
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-conecta-blue/8 to-conecta-orange/10 p-3 shadow-xl">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=900&q=85"
                  alt="Veterinário em consulta com cão de grande porte"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <span className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-paper/90 backdrop-blur px-3 py-1 text-xs font-medium">
                  <span className="h-2 w-2 rounded-full bg-conecta-orange" /> Catálogo 2026
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1 mt-3">
                {[
                  ["230+", "Equipamentos"],
                  ["8", "Categorias"],
                  ["26 UF", "Cobertura nacional"],
                ].map(([n, l]) => (
                  <div key={l} className="rounded-xl bg-paper p-3 text-center">
                    <div className="font-serif text-xl text-conecta-blue">{n}</div>
                    <div className="text-[10px] tracking-wide uppercase text-ink-soft mt-0.5">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* faint flask watermark */}
      <div aria-hidden className="pointer-events-none absolute -right-20 -bottom-20 h-[420px] w-[420px] rounded-full bg-conecta-orange/5 blur-3xl" />
    </section>
  );
}
