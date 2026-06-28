import { Reveal } from "./Reveal";

export function AboutBanner() {
  return (
    <section className="bg-paper">
      <div className="container-edge py-20 md:py-28 grid lg:grid-cols-12 gap-12 items-center">
        <Reveal className="lg:col-span-6">
          <div className="rounded-3xl overflow-hidden aspect-[4/5] lg:aspect-[5/6]">
            <img src="https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=900&q=85" alt="Hospital veterinário em operação" className="h-full w-full object-cover" />
          </div>
        </Reveal>
        <div className="lg:col-span-6">
          <Reveal><span className="eyebrow">Quem somos</span></Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 font-serif text-4xl md:text-5xl leading-[1.05] text-ink">
              Uma operação <em className="italic text-conecta-orange">brasileira</em> com olhar global para medicina veterinária.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-6 space-y-4 text-ink-soft leading-relaxed">
              <p>A Conecta nasceu da insatisfação com o status quo de distribuição de equipamentos veterinários no Brasil, catálogos inflados de marca de gaveta, suporte genérico, importação atravessada por múltiplos intermediários que inflam preço sem agregar serviço.</p>
              <p>Hoje somos representante oficial da linha completa Shinova no país, com sede em Vespasiano/MG e cobertura nacional. Nosso compromisso é simples: equipamento certo, no prazo certo, com suporte técnico que entende a rotina clínica.</p>
              <p>Mais de 40 clínicas, hospitais, universidades e centros de pesquisa já operam com Conecta, e essa rede cresce porque entregamos exatamente o que promete o catálogo.</p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 font-serif italic text-ink">
              Erwing Mondragon
              <span className="block not-italic font-sans text-xs tracking-wide uppercase text-ink-soft mt-1">
                Fundador · Conecta Equipamentos Veterinários
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
