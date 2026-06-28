import { Reveal } from "./Reveal";

export function AboutBanner() {
  return (
    <section className="bg-paper">
      <div className="container-edge py-20 md:py-28 grid lg:grid-cols-12 gap-12 items-center">
        <Reveal className="lg:col-span-6">
          <div className="relative rounded-3xl overflow-hidden aspect-[4/5] lg:aspect-[5/6] bg-conecta-blue text-white">
            <img
              src="https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=900&q=85"
              alt="Hospital veterinário em operação"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-conecta-blue/85 via-conecta-blue/20 to-transparent" />
            <div className="relative h-full flex flex-col justify-end p-8">
              <div className="font-serif text-5xl leading-tight">230+</div>
              <div className="mt-1 text-sm text-white/80">equipamentos importados de alta tecnologia</div>
              <div className="mt-6 h-px bg-white/20" />
              <div className="mt-6 font-serif text-5xl leading-tight">300+</div>
              <div className="mt-1 text-sm text-white/80">clínicas e hospitais ativos no Brasil</div>
            </div>
          </div>
        </Reveal>
        <div className="lg:col-span-6">
          <Reveal><span className="eyebrow-bracket">Quem somos</span></Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 font-serif text-4xl md:text-5xl leading-[1.05] text-ink">
              Uma distribuidora <em className="italic text-conecta-orange">brasileira</em> com tecnologia importada e suporte que responde.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-6 space-y-4 text-ink-soft leading-relaxed">
              <p>A Conecta nasceu para acabar com o que cansava o veterinário no Brasil, catálogos cheios de marca de gaveta, suporte genérico e importação atravessada por intermediários que só inflam o preço sem agregar serviço algum.</p>
              <p>Hoje somos distribuidor oficial da linha completa Shinova no país, com sede em Vespasiano/MG e entrega para todo o Brasil. Nosso compromisso é direto: equipamento certo, no prazo combinado, instalado, calibrado e com a sua equipe treinada para operar desde o primeiro dia.</p>
              <p>Mais de 300 clientes ativos, entre clínicas, hospitais, universidades e centros de pesquisa, já operam com a Conecta, e essa rede cresce porque entregamos exatamente o que o catálogo promete.</p>
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
