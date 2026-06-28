import { Reveal } from "./Reveal";

const ITEMS = [
  {
    n: "i.",
    title: "Clínica inteira, fornecedor único",
    body: "Do centro cirúrgico ao laboratório, da imagem à odontologia, você equipa toda a operação em uma só origem. Simplifica compra, instalação, treinamento e manutenção, sem montar a clínica com dezenas de fornecedores diferentes.",
  },
  {
    n: "ii.",
    title: "Equipamento de origem, não estoque genérico",
    body: "Tecnologia importada de alta performance, produzida sob demanda para a sua operação. O prazo de 60 a 90 dias reflete a fabricação sob medida e a representação oficial, sem intermediário inflando preço no caminho.",
  },
  {
    n: "iii.",
    title: "Instalado, calibrado e com equipe treinada",
    body: "Todo equipamento chega instalado, comissionado, calibrado e com treinamento operacional incluído. Suporte técnico nacional que responde de verdade, com gente que conhece a rotina clínica, não SAC genérico de importadora.",
  },
];

export function Principles() {
  return (
    <section className="bg-bone border-y border-line">
      <div className="container-edge py-20 md:py-28">
        <div className="max-w-3xl mb-14">
          <Reveal><span className="eyebrow-bracket">Por que comprar Conecta</span></Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 font-serif text-4xl md:text-5xl leading-[1.05] text-ink">
              Três razões pelas quais clínicas premium <em className="italic text-conecta-orange">escolhem nossa distribuição.</em>
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
