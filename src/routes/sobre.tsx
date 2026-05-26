import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Globe2, ShieldCheck, Truck, Wrench } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Reveal } from "@/components/site/Reveal";
import { SITE } from "@/lib/site-data";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre a Conecta — Distribuição oficial Shinova no Brasil" },
      { name: "description", content: "Distribuidora oficial Shinova no Brasil. Sediada em Vespasiano/MG, com cobertura nacional, importação direta e suporte técnico." },
      { property: "og:title", content: "Sobre a Conecta" },
      { property: "og:description", content: "Distribuição oficial Shinova no Brasil. Operação técnica para clínicas e hospitais veterinários." },
    ],
  }),
  component: SobrePage,
});

function SobrePage() {
  return (
    <SiteShell>
      <section className="container-edge pt-16 md:pt-24 pb-12">
        <Reveal>
          <span className="eyebrow">Sobre nós</span>
          <h1 className="mt-5 font-serif text-5xl md:text-7xl text-ink leading-[1.02] max-w-4xl">
            Uma operação brasileira com olhar global para a medicina veterinária.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-soft">
            Somos a distribuidora oficial Shinova no Brasil. De Vespasiano/MG levamos equipamentos de alto desempenho a clínicas, hospitais e centros de referência em todo o país — com importação direta, treinamento e suporte técnico próprio.
          </p>
        </Reveal>
      </section>

      <section className="container-edge pb-20">
        <div className="grid md:grid-cols-3 gap-px bg-line rounded-3xl overflow-hidden border border-line">
          <Metric n="100+" l="Clínicas atendidas" />
          <Metric n="8" l="Linhas clínicas" />
          <Metric n="100%" l="Cobertura nacional" />
        </div>
      </section>

      <section className="container-edge pb-24">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <Reveal>
            <span className="eyebrow">Manifesto</span>
            <h2 className="mt-4 font-serif text-4xl text-ink leading-tight">Equipamento certo, instalado com método, com gente por perto.</h2>
          </Reveal>
          <Reveal>
            <div className="space-y-5 text-ink-soft text-lg">
              <p>Acreditamos que a tecnologia veterinária só vira resultado clínico quando vem acompanhada de curadoria técnica, treinamento e suporte verdadeiro.</p>
              <p>Por isso operamos como uma extensão do time da clínica: ajudamos a especificar, importamos sob demanda, entregamos e treinamos a equipe — e seguimos disponíveis para qualquer dúvida ao longo do uso.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-edge pb-24">
        <span className="eyebrow">Pilares</span>
        <h2 className="mt-4 font-serif text-4xl md:text-5xl">Como entregamos valor</h2>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          <Pilar icon={Globe2} t="Importação direta" d="Compra oficial sem intermediários. Preço justo e rastreabilidade total." />
          <Pilar icon={ShieldCheck} t="Garantia estendida" d="12 meses de garantia + opção de cobertura premium para missão crítica." />
          <Pilar icon={Truck} t="Logística nacional" d="Entrega coordenada por região com seguro porta a porta." />
          <Pilar icon={Wrench} t="Suporte técnico" d="Atendimento humano, treinamento presencial e remoto." />
        </div>
      </section>

      <section className="container-edge pb-24">
        <div className="rounded-3xl bg-conecta-blue text-white p-10 md:p-16 grid md:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-conecta-orange">Conecta · {SITE.city}</span>
            <h3 className="mt-4 font-serif text-3xl md:text-4xl leading-tight">Pronto para conversar sobre o seu próximo projeto?</h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/contato" className="btn-primary">Falar com a equipe</Link>
            <Link to="/produtos" className="rounded-full border border-white/40 text-white px-6 py-3 text-sm hover:bg-white/10 transition inline-flex items-center justify-center">
              Ver catálogo
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function Metric({ n, l }: { n: string; l: string }) {
  return (
    <div className="bg-paper p-10">
      <div className="font-serif text-5xl md:text-6xl text-conecta-blue">{n}</div>
      <div className="mt-2 font-mono text-[11px] tracking-[0.18em] uppercase text-ink-soft">{l}</div>
    </div>
  );
}

function Pilar({ icon: Icon, t, d }: { icon: typeof Check; t: string; d: string }) {
  return (
    <div className="bg-paper border border-line rounded-3xl p-6">
      <div className="h-11 w-11 rounded-full bg-conecta-orange/15 text-conecta-orange flex items-center justify-center">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 font-serif text-xl text-ink">{t}</h3>
      <p className="mt-2 text-sm text-ink-soft leading-relaxed">{d}</p>
    </div>
  );
}
