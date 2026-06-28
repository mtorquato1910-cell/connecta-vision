import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Building2, Globe, Mail, RotateCcw, Save, Search, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/PageHeader";
import { ImageInput } from "@/components/admin/ImageInput";
import { DEFAULT_CONFIG, type ConfigAll } from "@/lib/admin-config-repo";
import {
  getConfigPublic,
  upsertConfigEmpresa,
  deleteConfigEmpresa,
} from "@/lib/admin.functions";
import { rowsToConfig } from "@/lib/site-config-adapter";

export const Route = createFileRoute("/admin/configuracoes")({
  component: AdminConfigPage,
});

type Tab = "empresa" | "contato" | "redes" | "seo";

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "empresa", label: "Empresa", icon: Building2 },
  { id: "contato", label: "Contato", icon: Mail },
  { id: "redes", label: "Redes sociais", icon: Share2 },
  { id: "seo", label: "SEO", icon: Search },
];

function AdminConfigPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>("empresa");

  const { data: config = DEFAULT_CONFIG, dataUpdatedAt } = useQuery({
    queryKey: ["admin-config"],
    queryFn: async () => rowsToConfig(await getConfigPublic()),
    initialData: DEFAULT_CONFIG,
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-config"] });
    qc.invalidateQueries({ queryKey: ["site-config"] });
  };

  const saveMut = useMutation({
    mutationFn: (vars: { group: keyof ConfigAll; data: any }) =>
      upsertConfigEmpresa({ data: { chave: vars.group, valor: vars.data } }),
    onSuccess: () => {
      toast.success("Configurações salvas.");
      invalidate();
    },
    onError: (e: any) => toast.error(e?.message ?? "Erro ao salvar."),
  });

  const handleSave = (group: keyof ConfigAll, data: any) => {
    saveMut.mutate({ group, data });
  };

  const resetMut = useMutation({
    mutationFn: async () => {
      for (const chave of ["empresa", "contato", "redes", "seo"]) {
        await deleteConfigEmpresa({ data: { chave } });
      }
    },
    onSuccess: () => {
      toast.success("Configurações restauradas.");
      invalidate();
    },
    onError: (e: any) => toast.error(e?.message ?? "Erro ao restaurar."),
  });

  const handleReset = () => {
    if (!confirm("Restaurar todas as configurações ao padrão?")) return;
    resetMut.mutate();
  };

  return (
    <div key={dataUpdatedAt}>
      <PageHeader
        eyebrow="Sistema"
        title="Configurações"
        description="Gerencie os dados da empresa, contatos, redes sociais e configurações de SEO do site."
        icon={Globe}
        tone="blue"
        actions={
          <Button variant="outline" size="sm" onClick={handleReset} className="gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Restaurar</span>
          </Button>
        }
      />

      <div className="px-4 sm:px-6 md:px-10 py-5 sm:py-6 md:py-8 max-w-4xl">
        <nav className="bg-paper border border-line rounded-full p-1 mb-6 inline-flex gap-1 max-w-full overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all inline-flex items-center gap-2 whitespace-nowrap ${
                tab === t.id
                  ? "bg-conecta-blue text-white shadow-sm"
                  : "text-ink-soft hover:text-ink hover:bg-bone"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </nav>

        {tab === "empresa" && (
          <EmpresaForm config={config.empresa} onSave={(d) => handleSave("empresa", d)} />
        )}
        {tab === "contato" && (
          <ContatoForm config={config.contato} onSave={(d) => handleSave("contato", d)} />
        )}
        {tab === "redes" && (
          <RedesForm config={config.redes} onSave={(d) => handleSave("redes", d)} />
        )}
        {tab === "seo" && <SeoForm config={config.seo} onSave={(d) => handleSave("seo", d)} />}
      </div>
    </div>
  );
}

// ─── Forms por seção ──────────────────────────────────────────

function EmpresaForm({
  config,
  onSave,
}: {
  config: ConfigAll["empresa"];
  onSave: (d: Partial<ConfigAll["empresa"]>) => void;
}) {
  const [data, setData] = useState(config);
  const set = <K extends keyof ConfigAll["empresa"]>(k: K, v: string) =>
    setData((d) => ({ ...d, [k]: v }));

  return (
    <Section title="Dados da empresa" onSave={() => onSave(data)}>
      <Grid>
        <Field label="Razão social / Nome">
          <input value={data.nome} onChange={(e) => set("nome", e.target.value)} className="input" />
        </Field>
        <Field label="Nome curto / Marca">
          <input
            value={data.nome_curto}
            onChange={(e) => set("nome_curto", e.target.value)}
            className="input"
          />
        </Field>
      </Grid>
      <Field label="CNPJ">
        <input value={data.cnpj} onChange={(e) => set("cnpj", e.target.value)} className="input" />
      </Field>
      <Field label="Endereço">
        <input
          value={data.endereco}
          onChange={(e) => set("endereco", e.target.value)}
          className="input"
        />
      </Field>
      <Grid>
        <Field label="Cidade">
          <input value={data.cidade} onChange={(e) => set("cidade", e.target.value)} className="input" />
        </Field>
        <Field label="Estado">
          <input
            value={data.estado}
            onChange={(e) => set("estado", e.target.value)}
            className="input"
            maxLength={2}
          />
        </Field>
        <Field label="CEP">
          <input value={data.cep} onChange={(e) => set("cep", e.target.value)} className="input" />
        </Field>
      </Grid>
      <Field label="Missão">
        <textarea
          value={data.missao}
          onChange={(e) => set("missao", e.target.value)}
          rows={2}
          className="input min-h-[60px] resize-y"
        />
      </Field>
      <Field label="Visão">
        <textarea
          value={data.visao}
          onChange={(e) => set("visao", e.target.value)}
          rows={2}
          className="input min-h-[60px] resize-y"
        />
      </Field>
    </Section>
  );
}

function ContatoForm({
  config,
  onSave,
}: {
  config: ConfigAll["contato"];
  onSave: (d: Partial<ConfigAll["contato"]>) => void;
}) {
  const [data, setData] = useState(config);
  const set = <K extends keyof ConfigAll["contato"]>(k: K, v: string) =>
    setData((d) => ({ ...d, [k]: v }));

  return (
    <Section title="Canais de contato" onSave={() => onSave(data)}>
      <Grid>
        <Field label="E-mail comercial">
          <input
            type="email"
            value={data.email_comercial}
            onChange={(e) => set("email_comercial", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="E-mail de suporte">
          <input
            type="email"
            value={data.email_suporte}
            onChange={(e) => set("email_suporte", e.target.value)}
            className="input"
          />
        </Field>
      </Grid>
      <Grid>
        <Field label="Telefone principal (formatado)">
          <input
            value={data.telefone_principal}
            onChange={(e) => set("telefone_principal", e.target.value)}
            className="input"
            placeholder="(31) 9000-0000"
          />
        </Field>
        <Field label="Telefone principal (raw para wa.me)" hint="Sem símbolos. Ex.: 5531900000000">
          <input
            value={data.telefone_principal_raw}
            onChange={(e) => set("telefone_principal_raw", e.target.value)}
            className="input font-mono text-xs"
          />
        </Field>
      </Grid>
      <Grid>
        <Field label="WhatsApp (formatado)">
          <input
            value={data.whatsapp}
            onChange={(e) => set("whatsapp", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="WhatsApp (raw para wa.me)">
          <input
            value={data.whatsapp_raw}
            onChange={(e) => set("whatsapp_raw", e.target.value)}
            className="input font-mono text-xs"
          />
        </Field>
      </Grid>
      <Field label="Mensagem padrão do WhatsApp" hint="Pré-preenche o link wa.me em todos os botões do site.">
        <textarea
          value={data.whatsapp_msg_padrao}
          onChange={(e) => set("whatsapp_msg_padrao", e.target.value)}
          rows={2}
          className="input min-h-[60px] resize-y"
        />
      </Field>
      <Field label="Horário de atendimento">
        <input
          value={data.horario_atendimento}
          onChange={(e) => set("horario_atendimento", e.target.value)}
          className="input"
        />
      </Field>
    </Section>
  );
}

function RedesForm({
  config,
  onSave,
}: {
  config: ConfigAll["redes"];
  onSave: (d: Partial<ConfigAll["redes"]>) => void;
}) {
  const [data, setData] = useState(config);
  const set = <K extends keyof ConfigAll["redes"]>(k: K, v: string) =>
    setData((d) => ({ ...d, [k]: v }));

  return (
    <Section title="Redes sociais" onSave={() => onSave(data)}>
      <Field label="Instagram (URL completa)">
        <input
          type="url"
          value={data.instagram}
          onChange={(e) => set("instagram", e.target.value)}
          placeholder="https://instagram.com/conecta"
          className="input"
        />
      </Field>
      <Field label="Facebook (URL completa)">
        <input
          type="url"
          value={data.facebook}
          onChange={(e) => set("facebook", e.target.value)}
          placeholder="https://facebook.com/conecta"
          className="input"
        />
      </Field>
      <Field label="LinkedIn (URL completa)" hint="Opcional">
        <input
          type="url"
          value={data.linkedin}
          onChange={(e) => set("linkedin", e.target.value)}
          className="input"
        />
      </Field>
      <Field label="YouTube (URL canal)" hint="Opcional">
        <input
          type="url"
          value={data.youtube}
          onChange={(e) => set("youtube", e.target.value)}
          className="input"
        />
      </Field>
    </Section>
  );
}

function SeoForm({
  config,
  onSave,
}: {
  config: ConfigAll["seo"];
  onSave: (d: Partial<ConfigAll["seo"]>) => void;
}) {
  const [data, setData] = useState(config);
  const set = <K extends keyof ConfigAll["seo"]>(k: K, v: string) =>
    setData((d) => ({ ...d, [k]: v }));

  return (
    <Section title="Otimização para mecanismos de busca" onSave={() => onSave(data)}>
      <Field label="Meta título global" hint="Aparece em todas as páginas (~60 chars).">
        <input
          value={data.meta_titulo_global}
          onChange={(e) => set("meta_titulo_global", e.target.value)}
          className="input"
          maxLength={70}
        />
        <p className="text-xs text-ink-mute mt-1">{data.meta_titulo_global.length} / 70</p>
      </Field>
      <Field label="Meta descrição global" hint="~160 caracteres.">
        <textarea
          value={data.meta_descricao_global}
          onChange={(e) => set("meta_descricao_global", e.target.value)}
          rows={2}
          maxLength={180}
          className="input min-h-[60px] resize-y"
        />
        <p className="text-xs text-ink-mute mt-1">{data.meta_descricao_global.length} / 180</p>
      </Field>
      <Field label="Palavras-chave" hint="Separadas por vírgula.">
        <input
          value={data.palavras_chave}
          onChange={(e) => set("palavras_chave", e.target.value)}
          className="input"
        />
      </Field>
      <Field label="Imagem Open Graph" hint="Aparece ao compartilhar no WhatsApp/LinkedIn (1200×630px). Envie do computador ou cole uma URL.">
        <ImageInput
          value={data.og_imagem_url}
          onChange={(v) => set("og_imagem_url", v)}
          maxDimension={1200}
        />
      </Field>
      <Field
        label="Google Analytics ID"
        hint="Opcional. Ex.: G-XXXXXXXXXX. Adicionado quando o banco estiver pronto."
      >
        <input
          value={data.google_analytics_id}
          onChange={(e) => set("google_analytics_id", e.target.value)}
          className="input font-mono text-xs"
          placeholder="G-XXXXXXXXXX"
        />
      </Field>
      <Field label="Google Search Console — token verificação" hint="Opcional.">
        <input
          value={data.google_search_console_token}
          onChange={(e) => set("google_search_console_token", e.target.value)}
          className="input font-mono text-xs"
        />
      </Field>
    </Section>
  );
}

// ─── Componentes utilitários ──────────────────────────────────

function Section({
  title,
  children,
  onSave,
}: {
  title: string;
  children: React.ReactNode;
  onSave: () => void;
}) {
  return (
    <div className="bg-paper border border-line rounded-2xl">
      <div className="px-5 py-4 border-b border-line flex items-center justify-between">
        <h3 className="font-serif text-lg text-ink">{title}</h3>
        <Button
          onClick={onSave}
          size="sm"
          className="gap-2 bg-conecta-blue hover:bg-conecta-blue-deep text-white"
        >
          <Save className="h-4 w-4" />
          Salvar
        </Button>
      </div>
      <div className="px-5 py-5 space-y-4">{children}</div>
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-4">{children}</div>;
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-ink">{label}</label>
      {children}
      {hint && <p className="text-xs text-ink-soft">{hint}</p>}
    </div>
  );
}
