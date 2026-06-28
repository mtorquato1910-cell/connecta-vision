import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Globe2, ShieldCheck, Truck, Wrench } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Reveal } from "@/components/site/Reveal";
import { SITE } from "@/lib/site-data";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre a Conecta | Distribuidor oficial Shinova no Brasil" },
      { name: "description", content: "Distribuidor oficial Shinova no Brasil, com 300 clientes ativos. Sediado em Vespasiano/MG, com entrega nacional, importação direta e suporte técnico próprio." },
      { property: "og:title", content: "Sobre a Conecta, Distribuidor oficial Shinova" },
      { property: "og:description", content: "Distribuidor oficial Shinova no Brasil. 300 clientes ativos, entrega nacional e suporte técnico para clínicas e hospitais veterinários." },
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
            Tecnologia veterinária importada, entregue pronta para operar.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-soft">
            Somos o distribuidor oficial Shinova no Brasil. De Vespasiano/MG levamos equipamentos de alta performance a clínicas, hospitais e centros de referência em todo o país, instalados, comissionados, calibrados e com a equipe treinada para operar, mais importação direta e suporte técnico próprio.
          </p>
        </Reveal>
      </section>

      <section className="container-edge pb-20">
        <div className="grid md:grid-cols-3 gap-px bg-line rounded-3xl overflow-hidden border border-line">
          <Metric n="300" l="Clientes ativos no Brasil" />
          <Metric n="230+" l="Equipamentos em catálogo" />
          <Metric n="Brasil" l="Entrega para todo o país" />
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
              <p>Acreditamos que tecnologia veterinária só vira resultado clínico quando vem acompanhada de instalação correta, calibração, treinamento e suporte de verdade.</p>
              <p>Por isso operamos como uma extensão do time da clínica. Ajudamos a especificar, importamos sob demanda equipamentos de alta tecnologia, produzidos sob medida, entregamos instalados e calibrados, treinamos a equipe e seguimos disponíveis para qualquer dúvida ao longo do uso.</p>
              <p>O prazo de 60 a 90 dias não é demora, é a garantia de que você recebe um equipamento fabricado para a sua operação, com representação oficial e sem intermediário inflando preço.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-edge pb-24">
        <span className="eyebrow">Pilares</span>
        <h2 className="mt-4 font-serif text-4xl md:text-5xl">Como entregamos valor</h2>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          <Pilar icon={Globe2} t="Importação direta" d="Representação oficial, sem intermediário inflando preço. Equipamento de origem com rastreabilidade total." />
          <Pilar icon={ShieldCheck} t="Instalado e calibrado" d="Cada equipamento chega instalado, comissionado e calibrado, pronto para operar no primeiro dia." />
          <Pilar icon={Truck} t="Entrega nacional" d="Logística coordenada para todo o Brasil, com seguro porta a porta e acompanhamento da chegada." />
          <Pilar icon={Wrench} t="Treinamento e suporte" d="Treinamento operacional da equipe incluso e suporte técnico nacional que responde de verdade." />
        </div>
      </section>

      <section className="container-edge pb-24">
        <div className="rounded-3xl bg-conecta-blue text-white p-10 md:p-16 grid md:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-conecta-orange">Conecta · {SITE.city}</span>
            <h3 className="mt-4 font-serif text-3xl md:text-4xl leading-tight">Vai estruturar ou expandir sua clínica? Vamos montar seu projeto.</h3>
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
