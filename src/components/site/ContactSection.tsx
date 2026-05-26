import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Reveal } from "./Reveal";
import { useServerFn } from "@tanstack/react-start";
import { submitFormulario } from "@/lib/admin.functions";
import { toast } from "sonner";

const PROMISES = [
  "Resposta em até 4 horas em dias úteis",
  "Atendimento direto com especialista técnico",
  "Cotação completa: equipamento, frete, instalação",
  "Suporte pós-venda incluído",
];

export function ContactSection() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const submit = useServerFn(submitFormulario);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const nome = String(fd.get("nome") ?? "").trim();
    const telefone = String(fd.get("telefone") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const tipo_estabelecimento = String(fd.get("tipo_estabelecimento") ?? "").trim();
    const mensagem = String(fd.get("mensagem") ?? "").trim();
    setSubmitting(true);
    try {
      await submit({
        data: {
          tipo: "contato",
          nome,
          email,
          telefone,
          mensagem,
          origem: typeof window !== "undefined" ? window.location.pathname : null,
          payload: { tipo_estabelecimento },
        },
      });
      setSent(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível enviar. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }


  return (
    <section id="contato" className="bg-conecta-blue text-white">
      <div className="container-edge py-20 md:py-28 grid lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7">
          <Reveal>
            <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-conecta-orange-light inline-flex items-center gap-2">
              <span className="w-7 h-px bg-conecta-orange-light" /> Vamos conversar
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 font-serif text-4xl md:text-5xl leading-[1.05]">
              Conta o que você <em className="italic text-conecta-orange-light">precisa</em>. A gente cuida do resto.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-white/75 text-lg max-w-xl">
              Fale com um especialista da Conecta. Atendimento humano, técnico, sem script. Você descreve o cenário
              clínico, a gente sugere o equipamento certo.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <ul className="mt-8 space-y-3">
              {PROMISES.map((p) => (
                <li key={p} className="flex items-start gap-3 text-white/85">
                  <span className="mt-0.5 h-5 w-5 rounded-full bg-conecta-orange flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-10 flex items-center gap-8 border-t border-white/15 pt-6">
              <div>
                <div className="font-serif text-3xl">~4h</div>
                <div className="text-xs uppercase tracking-wide text-white/55 mt-1">Tempo médio de resposta</div>
              </div>
              <div>
                <div className="font-serif text-3xl">40+</div>
                <div className="text-xs uppercase tracking-wide text-white/55 mt-1">Clínicas atendidas</div>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:col-span-5">
          <form
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            className="bg-paper text-ink rounded-2xl p-6 md:p-8 shadow-2xl max-w-[480px] mx-auto w-full"
          >
            {sent ? (
              <div className="text-center py-12">
                <div className="h-14 w-14 rounded-full bg-conecta-orange mx-auto flex items-center justify-center">
                  <Check className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-5 font-serif text-2xl">Mensagem recebida</h3>
                <p className="mt-2 text-ink-soft text-sm">Um especialista da Conecta retornará em até 4 horas úteis.</p>
              </div>
            ) : (
              <>
                <h3 className="font-serif text-2xl">Solicite um orçamento</h3>
                <p className="text-sm text-ink-soft mt-1">Resposta em até 4 horas úteis.</p>
                <div className="mt-5 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input required placeholder="Nome" className="rounded-lg border border-line-strong px-3 py-2.5 text-sm focus:outline-none focus:border-conecta-blue" />
                    <input required placeholder="WhatsApp" className="rounded-lg border border-line-strong px-3 py-2.5 text-sm focus:outline-none focus:border-conecta-blue" />
                  </div>
                  <input type="email" required placeholder="E-mail" className="w-full rounded-lg border border-line-strong px-3 py-2.5 text-sm focus:outline-none focus:border-conecta-blue" />
                  <select required defaultValue="" className="w-full rounded-lg border border-line-strong px-3 py-2.5 text-sm focus:outline-none focus:border-conecta-blue bg-paper">
                    <option value="" disabled>Tipo de estabelecimento</option>
                    <option>Clínica veterinária</option>
                    <option>Hospital veterinário</option>
                    <option>Universidade / Ensino</option>
                    <option>Centro de pesquisa</option>
                    <option>Pet shop / Grooming</option>
                    <option>Outro</option>
                  </select>
                  <textarea required rows={3} placeholder="Como podemos ajudar?" className="w-full rounded-lg border border-line-strong px-3 py-2.5 text-sm focus:outline-none focus:border-conecta-blue resize-none" />
                  <button type="submit" className="btn-primary w-full justify-center">Enviar solicitação</button>
                  <p className="text-[11px] text-ink-soft leading-relaxed">
                    Ao enviar, você concorda com nossa política de privacidade (LGPD). Seus dados serão usados apenas para esse contato.
                  </p>
                </div>
              </>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
