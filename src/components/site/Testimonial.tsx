import { Reveal } from "./Reveal";

export function Testimonial() {
  return (
    <section className="relative bg-ink text-white overflow-hidden">
      <span aria-hidden className="pointer-events-none absolute -top-10 left-6 md:left-16 font-serif text-[260px] md:text-[420px] leading-none text-conecta-orange/20 select-none">“</span>
      <div className="container-edge py-24 md:py-32 relative">
        <Reveal>
          <p className="font-serif italic text-2xl md:text-4xl leading-[1.25] text-center max-w-4xl mx-auto">
            Montei boa parte do hospital com a Conecta. O equipamento chegou instalado, calibrado e com a equipe
            treinada, e o suporte responde no mesmo dia. Comprar de um fornecedor só, com representação oficial,
            economizou meses e simplificou tudo na estruturação.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-10 flex items-center justify-center gap-4">
            <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=120&q=80" alt="" className="h-12 w-12 rounded-full object-cover shrink-0" />
            <div className="text-sm">
              <div className="font-serif italic text-lg">Dr. Henrique Vasconcellos</div>
              <div className="text-white/60 text-xs tracking-wide uppercase mt-0.5">
                Hospital Veterinário São Francisco · Belo Horizonte/MG
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
