import { Reveal } from "./Reveal";

export function AboutBanner() {
  return (
    <section className="bg-paper">
      <div className="container-edge py-20 md:py-28 grid lg:grid-cols-12 gap-12 items-center">
        <Reveal className="lg:col-span-6">
          {/* Tratamento gráfico sem foto de stock. */}
          <div className="relative rounded-3xl overflow-hidden aspect-[4/5] lg:aspect-[5/6] bg-conecta-blue text-white">
            <svg viewBox="0 0 400 500" className="absolute inset-0 h-full w-full" aria-hidden preserveAspectRatio="xMidYMid slice">
              <defs>
                <pattern id="about-grid" width="36" height="36" patternUnits="userSpaceOnUse">
                  <path d="M36 0H0V36" fill="none" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="400" height="500" fill="url(#about-grid)" />
              <circle cx="300" cy="150" r="140" fill="none" stroke="var(--conecta-teal)" strokeOpacity="0.5" strokeWidth="1.5" />
              <circle cx="100" cy="380" r="90" fill="none" stroke="var(--conecta-orange)" strokeOpacity="0.45" strokeWidth="1.5" />
            </svg>
            <div className="relative h-full flex flex-col justify-end p-8">
              <div className="font-serif text-5xl leading-tight">230+</div>
              <div className="mt-1 text-sm text-white/70">equipamentos importados de alta tecnologia</div>
              <div className="mt-6 h-px bg-white/15" />
              <div className="mt-6 font-serif text-5xl leading-tight">300+</div>
              <div className="mt-1 text-sm text-white/70">clínicas e hospitais ativos no Brasil</div>
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
