import { Reveal } from "./Reveal";

const ITEMS = [
  {
    n: "i.",
    title: "Curadoria de catálogo",
    body: "Trabalhamos apenas com fabricantes auditados. Cada equipamento passa por validação técnica antes de entrar no portfólio. Nada de marca de gaveta empurrada pra preencher catálogo.",
  },
  {
    n: "ii.",
    title: "Suporte que entende clínica",
    body: "Equipe técnica formada por profissionais com background veterinário. Você conversa com quem sabe usar o equipamento na rotina real — não com SAC genérico de importadora.",
  },
  {
    n: "iii.",
    title: "Logística sob demanda",
    body: "Importação direta e fornecimento sob pedido. Você compra exatamente o que vai usar, sem intermediário inflando custo, sem estoque parado encarecendo o produto.",
  },
];

export function Principles() {
  return (
    <section className="bg-bone border-y border-line">
      <div className="container-edge py-20 md:py-28">
        <div className="max-w-3xl mb-14">
          <Reveal><span className="eyebrow">Por que Conecta</span></Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 font-serif text-4xl md:text-5xl leading-[1.05] text-ink">
              Três princípios <em className="italic text-conecta-orange">guiam</em> tudo que distribuímos.
            </h2>
          </Reveal>
        </div>
        <div className="grid md:grid-cols-3 gap-10 md:gap-12">
          {ITEMS.map((it, i) => (
            <Reveal key={it.n} delay={i * 0.06}>
              <div className="border-t border-line-strong pt-6">
                <div className="font-serif italic text-5xl text-conecta-orange">{it.n}</div>
                <h3 className="mt-4 font-serif text-2xl text-ink">{it.title}</h3>
                <p className="mt-3 text-ink-soft leading-relaxed">{it.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
