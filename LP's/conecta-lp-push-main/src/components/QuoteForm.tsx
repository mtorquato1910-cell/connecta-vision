import { useState } from "react";
import { Check, Shield, Package, Truck } from "lucide-react";
import { site, waLink } from "@/lib/site";
import { submitLead } from "@/lib/leads";

export function QuoteForm() {
  const [equipamentos, setEquipamentos] = useState<string[]>([]);
  const [enviando, setEnviando] = useState(false);
  const toggle = (id: string) =>
    setEquipamentos((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (enviando) return;
    setEnviando(true);
    const fd = new FormData(e.currentTarget);

    const nome = String(fd.get("nome") ?? "");
    const whatsapp = String(fd.get("whatsapp") ?? "");
    const email = String(fd.get("email") ?? "");
    const funcao = String(fd.get("funcao") ?? "");
    const estabelecimento = String(fd.get("estabelecimento") ?? "");
    const tipo = String(fd.get("tipo") ?? "");
    const cidade = String(fd.get("cidade") ?? "");
    const volume = String(fd.get("volume") ?? "");
    const prazo = String(fd.get("prazo") ?? "");
    const obs = String(fd.get("obs") ?? "");

    // 1) Salva o lead no Supabase (cai no painel admin). Não bloqueia o WhatsApp.
    await submitLead({
      nome,
      email,
      whatsapp,
      funcao,
      tipoEstabelecimento: tipo,
      nomeEstabelecimento: estabelecimento,
      cidade,
      volume,
      itens: equipamentos,
      prazo,
      observacoes: obs,
      origem: site.domain || site.id,
      lineName: site.lineName,
    });

    // 2) Abre o WhatsApp com a mensagem preenchida (comportamento original).
    const lines = [
      `Olá! Quero um orçamento da ${site.lineName.toLowerCase()} Conecta:`,
      `Nome: ${nome}`,
      `WhatsApp: ${whatsapp}`,
      `E-mail: ${email}`,
      `Função: ${funcao}`,
      `Estabelecimento: ${estabelecimento} (${tipo})`,
      `Cidade/UF: ${cidade}`,
      `Volume: ${volume}`,
      `Itens: ${equipamentos.join(", ") || "—"}`,
      `Prazo: ${prazo}`,
      `Obs: ${obs}`,
    ].join("\n");
    window.open(waLink(lines), "_blank");
    setEnviando(false);
  };

  const checkboxes = [
    ...site.products.map((p) => ({ id: p.model, label: `${p.model} — ${p.shortName}` })),
    { id: "pacote-completo", label: site.quote.packageLabel },
    { id: "avaliando", label: "Ainda avaliando" },
  ];

  // Campos do formulário (sobrescritos por site quando necessário, ex.: gemologia).
  const f = site.form ?? {};
  const funcaoOptions = f.funcaoOptions ?? ["Médico vet proprietário", "Médico vet equipe", "Diretor técnico", "Comprador/Admin", "Outro"];
  const tipoOptions = f.tipoOptions ?? ["Clínica", "Hospital", "Universidade", "Campo"];
  const volumeLabel = f.volumeLabel ?? "Volume mensal";
  const volumeOptions = f.volumeOptions ?? ["Até 100 atendimentos/mês", "100-300", "300-800", "+800"];
  const itemsLabel = f.itemsLabel ?? "Quais itens te interessam?";

  return (
    <section id="orcamento" className="relative py-24 md:py-32 bg-primary overflow-hidden">
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-accent/20 blur-3xl pointer-events-none" />
      <div className="relative max-w-[1600px] mx-auto px-6 grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-start">
        {/* Left */}
        <div className="text-primary-foreground">
          <p className="text-xs font-semibold tracking-[0.16em] uppercase text-accent mb-4">
            Solicite seu orçamento
          </p>
          <h2
            className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05]"
            dangerouslySetInnerHTML={{ __html: site.quote.titleHtml }}
          />
          <p className="mt-6 text-lg text-primary-foreground/80 max-w-xl">{site.quote.subtitle}</p>

          <ul className="mt-10 space-y-4">
            {site.quote.bulletsHtml.map((t) => (
              <li key={t} className="flex gap-3 text-primary-foreground/90">
                <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span dangerouslySetInnerHTML={{ __html: t.replace(/^(.+?) —/, "<strong>$1</strong> —") }} />
              </li>
            ))}
          </ul>

          <div className="mt-12 grid grid-cols-2 gap-8 max-w-sm">
            {site.quote.stats.map(([n, l]) => (
              <div key={l}>
                <p className="font-display text-5xl text-accent">{n}</p>
                <p className="text-sm text-primary-foreground/70 mt-1">{l}</p>
              </div>
            ))}
          </div>

          <ul className="mt-10 max-w-md rounded-xl bg-white/5 border border-white/10 divide-y divide-white/10">
            {(site.quote.assurances ?? [
              "Garantia 12 meses + suporte técnico nacional",
              "Representação oficial · sem intermediário",
              "Entrega Brasil inteiro com seguro completo",
            ]).map((t, i) => {
              const Icon = [Shield, Package, Truck][i] ?? Shield;
              return (
                <li key={t} className="flex items-center gap-3 px-4 py-3 text-sm text-primary-foreground/85">
                  <Icon className="w-4 h-4 text-accent shrink-0" />
                  <span>{t}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="bg-card rounded-2xl p-6 md:p-8 shadow-2xl w-full max-w-[480px] lg:justify-self-end">
          <h3 className="font-display text-2xl text-primary">Orçamento {site.lineName}</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-8">
            Preenchimento leva ~2 minutos. Quanto mais detalhe, mais precisa a proposta.
          </p>

          <Step n={1} title="Sobre você">
            <Field label="Nome completo" name="nome" required />
            <Field label="WhatsApp" name="whatsapp" required />
            <Field label="E-mail profissional" name="email" type="email" required />
            <Select label="Função" name="funcao" options={funcaoOptions} />
          </Step>

          <Step n={2} title="Sobre o estabelecimento">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Tipo</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {tipoOptions.map((t) => (
                  <label key={t} className="flex items-center gap-2 px-3 py-2.5 border border-border rounded-lg cursor-pointer hover:border-accent has-[:checked]:border-accent has-[:checked]:bg-accent/5 transition">
                    <input type="radio" name="tipo" value={t} className="accent-accent" />
                    <span className="text-sm">{t}</span>
                  </label>
                ))}
              </div>
            </div>
            <Field label="Cidade/Estado" name="cidade" />
            <Field label="Nome do estabelecimento" name="estabelecimento" />
            <Select label={volumeLabel} name="volume" options={volumeOptions} />
          </Step>

          <Step n={3} title="Sobre sua necessidade">
            <div>
              <label className="text-xs font-medium text-muted-foreground">{itemsLabel}</label>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {checkboxes.map((c) => (
                  <label key={c.id} className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-border rounded-md cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition text-[13px]">
                    <input
                      type="checkbox"
                      checked={equipamentos.includes(c.id)}
                      onChange={() => toggle(c.id)}
                      className="accent-primary"
                    />
                    <span className="truncate">{c.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <Select label="Prazo de aquisição" name="prazo" options={["Urgente (30 dias)", "Curto (60 dias)", "Médio (3-6 meses)", "Apenas avaliando"]} />
            <div>
              <label className="text-xs font-medium text-muted-foreground">Observações</label>
              <textarea name="obs" rows={3} className="mt-2 w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
          </Step>

          <button type="submit" disabled={enviando} className="mt-8 w-full px-6 py-4 rounded-lg bg-accent text-accent-foreground font-semibold hover:brightness-110 transition shadow-lg shadow-accent/30 disabled:opacity-60 disabled:cursor-not-allowed">
            {enviando ? "Enviando…" : "Solicitar orçamento personalizado →"}
          </button>
          <p className="text-[11px] text-muted-foreground text-center mt-4">
            Ao enviar você concorda com nossa política de privacidade. Não compartilhamos seus dados com terceiros.
          </p>
        </form>
      </div>
    </section>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="flex items-center gap-3 mb-3">
        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold font-mono-tech">
          {n}
        </span>
        <h4 className="font-display text-base text-primary">{title}</h4>
      </div>
      <div className="space-y-3.5">{children}</div>
    </div>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">{label}{required && " *"}</label>
      <input type={type} name={name} required={required} className="mt-2 w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
    </div>
  );
}

function Select({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <select name={name} className="mt-2 w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-card focus:outline-none focus:ring-2 focus:ring-accent">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}
