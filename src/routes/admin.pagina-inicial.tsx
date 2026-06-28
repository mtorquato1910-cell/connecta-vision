import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Home,
  RotateCcw,
  Save,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  DEFAULT_HOME,
  type HomeConfig,
  type SecaoConfig,
  type SecaoHome,
} from "@/lib/admin-home-repo";
import {
  getConteudoPublic,
  upsertConteudo,
  deleteConteudo,
  listAllProdutos,
} from "@/lib/admin.functions";

const HOME_KEY = "home_config";

export const Route = createFileRoute("/admin/pagina-inicial")({
  component: AdminPaginaInicialPage,
});

function AdminPaginaInicialPage() {
  const qc = useQueryClient();

  const { data: config = DEFAULT_HOME } = useQuery({
    queryKey: ["admin-home-config"],
    queryFn: async () => {
      const rows = (await getConteudoPublic()) as Array<{ chave: string; valor: unknown }>;
      const row = rows.find((r) => r.chave === HOME_KEY);
      return (row?.valor as HomeConfig) ?? DEFAULT_HOME;
    },
    initialData: DEFAULT_HOME,
  });

  const { data: produtos = [] } = useQuery({
    queryKey: ["admin-produtos"],
    queryFn: async () => await listAllProdutos(),
  });

  const saveMut = useMutation({
    mutationFn: (cfg: HomeConfig) => upsertConteudo({ data: { chave: HOME_KEY, valor: cfg } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-home-config"] }),
    onError: (e: any) => toast.error(e?.message ?? "Erro ao salvar."),
  });

  const persistSecoes = (secoes: SecaoConfig[]) =>
    saveMut.mutate({ ...config, secoes });

  const ordered = config.secoes.slice().sort((a, b) => a.ordem - b.ordem);

  // Destaques são rascunho local com botão de salvar explícito.
  const persistedDestaqueKey = JSON.stringify(config.produtos_destaque_slugs);
  const [destaques, setDestaques] = useState<string[]>(config.produtos_destaque_slugs);
  useEffect(() => {
    setDestaques(config.produtos_destaque_slugs);
    // só reseta quando a lista SALVA muda (evita perder rascunho em re-fetch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persistedDestaqueKey]);
  const destaquesDirty =
    JSON.stringify(destaques) !== persistedDestaqueKey;

  const reassignOrdem = (ids: SecaoHome[]): SecaoConfig[] => {
    const map = new Map(config.secoes.map((s) => [s.id, s]));
    return ids
      .map((id, i) => {
        const s = map.get(id);
        return s ? { ...s, ordem: i + 1 } : null;
      })
      .filter(Boolean) as SecaoConfig[];
  };

  const moveUp = (id: SecaoHome) => {
    const ids = ordered.map((s) => s.id);
    const i = ids.indexOf(id);
    if (i <= 0) return;
    [ids[i - 1], ids[i]] = [ids[i], ids[i - 1]];
    persistSecoes(reassignOrdem(ids));
  };

  const moveDown = (id: SecaoHome) => {
    const ids = ordered.map((s) => s.id);
    const i = ids.indexOf(id);
    if (i < 0 || i >= ids.length - 1) return;
    [ids[i + 1], ids[i]] = [ids[i], ids[i + 1]];
    persistSecoes(reassignOrdem(ids));
  };

  const handleToggle = (id: SecaoHome) => {
    persistSecoes(config.secoes.map((s) => (s.id === id ? { ...s, ativa: !s.ativa } : s)));
  };

  const toggleDestaque = (slug: string) => {
    setDestaques((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  const handleSaveDestaques = () => {
    saveMut.mutate(
      { ...config, produtos_destaque_slugs: destaques },
      {
        onSuccess: () =>
          toast.success(
            `${destaques.length} ${destaques.length === 1 ? "produto" : "produtos"} em destaque.`,
          ),
      },
    );
  };

  const handleReset = () => {
    if (!confirm("Restaurar configuração da página inicial ao padrão?")) return;
    deleteConteudo({ data: { chave: HOME_KEY } })
      .then(() => {
        qc.invalidateQueries({ queryKey: ["admin-home-config"] });
        setDestaques(DEFAULT_HOME.produtos_destaque_slugs);
        toast.success("Página inicial restaurada.");
      })
      .catch((e: any) => toast.error(e?.message ?? "Erro ao restaurar."));
  };

  const ativasCount = ordered.filter((s) => s.ativa).length;

  return (
    <div>
      <PageHeader
        eyebrow="Conteúdo"
        title="Página inicial"
        description="Controle quais seções aparecem na home, em que ordem, e quais produtos ficam em destaque."
        icon={Home}
        tone="amber"
        badge={{
          label: `${ativasCount} de ${ordered.length} seções ativas`,
          tone: "blue",
        }}
        actions={
          <Button variant="outline" size="sm" onClick={handleReset} className="gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Restaurar</span>
          </Button>
        }
      />

      <div className="px-4 sm:px-6 md:px-10 py-5 sm:py-6 md:py-8 max-w-5xl space-y-8">
        {/* Seções da home */}
        <section>
          <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft mb-3">
            Seções da página
          </h2>
          <p className="text-sm text-ink-soft mb-4">
            Use as setas para reordenar e o botão de olho para ativar/desativar
            cada bloco.
          </p>
          <div className="space-y-2">
            {ordered.map((s, i) => (
              <div
                key={s.id}
                className={`bg-paper border rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 transition-colors ${
                  s.ativa ? "border-line hover:border-amber-300" : "border-line opacity-60"
                }`}
              >
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button
                    onClick={() => moveUp(s.id)}
                    disabled={i === 0}
                    aria-label="Mover para cima"
                    className="h-6 w-6 rounded flex items-center justify-center text-ink-soft hover:text-ink hover:bg-bone disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => moveDown(s.id)}
                    disabled={i === ordered.length - 1}
                    aria-label="Mover para baixo"
                    className="h-6 w-6 rounded flex items-center justify-center text-ink-soft hover:text-ink hover:bg-bone disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-100 to-amber-50 text-amber-700 flex items-center justify-center font-mono text-xs font-medium shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-normal text-base sm:text-lg text-ink">
                    {s.label}
                  </h3>
                  <p className="text-xs text-ink-soft line-clamp-1 mt-0.5">{s.descricao}</p>
                </div>

                <button
                  onClick={() => handleToggle(s.id)}
                  aria-label={s.ativa ? "Desativar seção" : "Ativar seção"}
                  className={`h-9 w-9 rounded-md flex items-center justify-center transition-colors ${
                    s.ativa
                      ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                      : "text-slate-500 bg-slate-100 hover:bg-slate-200"
                  }`}
                >
                  {s.ativa ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Produtos em destaque */}
        <section>
          <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
            <div>
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft">
                Produtos em destaque
              </h2>
              <p className="text-sm text-ink-soft mt-1">
                {destaques.length} {destaques.length === 1 ? "produto selecionado" : "produtos selecionados"}.
                Aparecem na seção "Produtos em destaque" da home.
              </p>
            </div>
            {destaquesDirty && (
              <Button
                onClick={handleSaveDestaques}
                size="sm"
                className="bg-conecta-blue hover:bg-conecta-blue-deep text-white gap-2"
              >
                <Save className="h-4 w-4" />
                Salvar destaques
              </Button>
            )}
          </div>

          <div className="bg-paper border border-line rounded-2xl p-4 max-h-[460px] overflow-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {produtos.map((p) => {
                const isSelected = destaques.includes(p.slug);
                return (
                  <button
                    key={p.id}
                    onClick={() => toggleDestaque(p.slug)}
                    className={`text-left flex items-center gap-3 p-2 rounded-lg border transition-colors ${
                      isSelected
                        ? "border-conecta-orange bg-conecta-orange/5"
                        : "border-line hover:border-line-strong"
                    }`}
                  >
                    <img
                      src={p.imagem_url ?? ""}
                      alt=""
                      className="h-10 w-10 rounded-md object-cover bg-bone shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-conecta-orange font-medium">
                        {p.modelo}
                      </p>
                      <p className="text-xs text-ink line-clamp-1">{p.nome}</p>
                    </div>
                    {isSelected && (
                      <Star className="h-4 w-4 text-conecta-orange fill-conecta-orange shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {destaquesDirty && (
            <p className="text-xs text-conecta-orange font-medium mt-2">
              Alterações de destaque pendentes, clique em "Salvar destaques" acima para aplicar.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
