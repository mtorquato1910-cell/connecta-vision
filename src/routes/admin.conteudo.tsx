import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FileText, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  DEFAULT_CONTEUDO,
  PAGINA_LABELS,
  type ConteudoItem,
  type ConteudoPagina,
} from "@/lib/admin-conteudo-repo";
import { getConteudoPublic, upsertConteudo, deleteConteudo } from "@/lib/admin.functions";
import { rowsToConteudo } from "@/lib/site-config-adapter";

export const Route = createFileRoute("/admin/conteudo")({
  component: AdminConteudoPage,
});

const TABS: ConteudoPagina[] = ["home", "sobre", "contato", "global", "footer"];

function AdminConteudoPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<ConteudoPagina>("home");
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const { data: all = DEFAULT_CONTEUDO } = useQuery({
    queryKey: ["admin-conteudo"],
    queryFn: async () => rowsToConteudo(await getConteudoPublic()),
    initialData: DEFAULT_CONTEUDO,
  });
  const items = all.filter((c) => c.pagina === tab);
  const dirty = Object.keys(drafts).length > 0;

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-conteudo"] });
    qc.invalidateQueries({ queryKey: ["site-conteudo"] });
  };

  const handleChange = (chave: string, valor: string) => {
    setDrafts((prev) => ({ ...prev, [chave]: valor }));
  };

  const saveMut = useMutation({
    mutationFn: async (entries: [string, string][]) => {
      for (const [chave, valor] of entries) {
        await upsertConteudo({ data: { chave, valor } });
      }
    },
    onSuccess: (_d, entries) => {
      toast.success(`${entries.length} ${entries.length === 1 ? "texto salvo" : "textos salvos"}.`);
      setDrafts({});
      invalidate();
    },
    onError: (e: any) => toast.error(e?.message ?? "Erro ao salvar."),
  });

  const handleSave = () => {
    const entries = Object.entries(drafts);
    if (entries.length === 0) return;
    saveMut.mutate(entries);
  };

  const handleDiscard = () => {
    if (!dirty) return;
    if (!confirm("Descartar alterações não salvas?")) return;
    setDrafts({});
  };

  const resetMut = useMutation({
    mutationFn: async () => {
      for (const item of DEFAULT_CONTEUDO) {
        await deleteConteudo({ data: { chave: item.chave } });
      }
    },
    onSuccess: () => {
      setDrafts({});
      invalidate();
      toast.success("Conteúdo restaurado ao padrão.");
    },
    onError: (e: any) => toast.error(e?.message ?? "Erro ao restaurar."),
  });

  const handleReset = () => {
    if (!confirm("Restaurar todos os textos ao padrão original?")) return;
    resetMut.mutate();
  };

  return (
    <div>
      <PageHeader
        eyebrow="Conteúdo"
        title="Textos do site"
        description="Edite todos os textos institucionais e CTAs do site. As mudanças aparecem em tempo real."
        icon={FileText}
        tone="violet"
        badge={
          dirty
            ? {
                label: `${Object.keys(drafts).length} alteração(ões) não salvas`,
                tone: "amber",
              }
            : undefined
        }
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleReset} className="gap-1.5">
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Restaurar</span>
            </Button>
            <Button
              onClick={handleSave}
              disabled={!dirty}
              className="gap-2 bg-conecta-blue hover:bg-conecta-blue-deep text-white disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              Salvar
            </Button>
          </div>
        }
      />

      <div className="px-4 sm:px-6 md:px-10 py-5 sm:py-6 md:py-8 max-w-5xl">
        <nav className="bg-paper border border-line rounded-full p-1 mb-6 inline-flex gap-1 max-w-full overflow-x-auto">
          {TABS.map((t) => {
            const count = all.filter((c) => c.pagina === t).length;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all inline-flex items-center gap-2 whitespace-nowrap ${
                  tab === t
                    ? "bg-conecta-blue text-white shadow-sm"
                    : "text-ink-soft hover:text-ink hover:bg-bone"
                }`}
              >
                {PAGINA_LABELS[t]}
                <span
                  className={`text-[10px] font-mono rounded-full px-1.5 py-0.5 ${
                    tab === t ? "bg-white/20" : "bg-bone"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="space-y-4">
          {items.map((item) => (
            <ConteudoField
              key={item.chave}
              item={item}
              value={drafts[item.chave] ?? item.valor}
              isDirty={item.chave in drafts}
              onChange={(v) => handleChange(item.chave, v)}
            />
          ))}
        </div>

        {dirty && (
          <div className="mt-6 flex items-center justify-end gap-2 sticky bottom-4 bg-paper border border-conecta-orange/40 rounded-2xl px-5 py-3 shadow-lg shadow-conecta-orange/10">
            <p className="text-sm text-ink-soft flex-1">
              {Object.keys(drafts).length} alteração
              {Object.keys(drafts).length === 1 ? "" : "ões"} não salvas
            </p>
            <Button variant="outline" size="sm" onClick={handleDiscard}>
              Descartar
            </Button>
            <Button
              onClick={handleSave}
              size="sm"
              className="gap-2 bg-conecta-blue hover:bg-conecta-blue-deep text-white"
            >
              <Save className="h-4 w-4" />
              Salvar tudo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function ConteudoField({
  item,
  value,
  isDirty,
  onChange,
}: {
  item: ConteudoItem;
  value: string;
  isDirty: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div
      className={`bg-paper border rounded-xl p-4 sm:p-5 transition-colors ${
        isDirty ? "border-conecta-orange/40 bg-conecta-orange/5" : "border-line"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
        <div className="min-w-0">
          <label className="block text-sm font-medium text-ink">{item.label}</label>
          {item.descricao && (
            <p className="text-xs text-ink-soft mt-0.5">{item.descricao}</p>
          )}
        </div>
        <span className="font-mono text-[10px] text-ink-mute uppercase tracking-wider shrink-0">
          {item.tipo} · {item.chave}
        </span>
      </div>
      {item.multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="input min-h-[80px] resize-y"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input"
          type={item.tipo === "url" ? "url" : item.tipo === "numero" ? "number" : "text"}
        />
      )}
      {isDirty && (
        <p className="text-[11px] text-conecta-orange mt-2 font-medium">
          Alteração pendente, clique em Salvar tudo para aplicar
        </p>
      )}
    </div>
  );
}
