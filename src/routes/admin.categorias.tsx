import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  FolderTree,
  Pencil,
  Star,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  CATEGORY_ICON_OPTIONS,
  resolveCategoryIcon,
  defaultIconKeyForSlug,
} from "@/lib/category-icons";
import {
  listAllCategorias,
  upsertCategoria,
  reorderCategorias,
  listAllProdutos,
} from "@/lib/admin.functions";

type Categoria = {
  id: string;
  slug: string;
  nome: string;
  numero: string;
  ordem: number;
  destaque: boolean;
  descricao_curta: string;
  imagem_url: string | null;
  icone: string | null;
};

function toUpsert(c: Categoria) {
  return {
    id: c.id,
    slug: c.slug,
    nome: c.nome,
    numero: c.numero,
    descricao: c.descricao_curta || null,
    imagem_url: c.imagem_url,
    icone: c.icone || null,
    ordem: c.ordem,
    destaque: c.destaque,
  };
}

export const Route = createFileRoute("/admin/categorias")({
  component: AdminCategoriasPage,
});

function AdminCategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [countByCat, setCountByCat] = useState<Record<string, number>>({});
  const [editing, setEditing] = useState<Categoria | null>(null);

  const refresh = useCallback(() => {
    Promise.all([listAllCategorias(), listAllProdutos()])
      .then(([cats, prods]) => {
        setCategorias(
          (cats as Record<string, any>[]).map((c) => ({
            id: c.id,
            slug: c.slug,
            nome: c.nome,
            numero: c.numero,
            ordem: c.ordem,
            destaque: !!c.destaque,
            descricao_curta: c.descricao ?? "",
            imagem_url: c.imagem_url ?? null,
            icone: c.icone ?? null,
          })),
        );
        const map: Record<string, number> = {};
        for (const p of prods as { categoria_id: string }[]) {
          map[p.categoria_id] = (map[p.categoria_id] ?? 0) + 1;
        }
        setCountByCat(map);
      })
      .catch((e) =>
        toast.error(e instanceof Error ? e.message : "Erro ao carregar categorias."),
      );
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const reordenar = async (ids: string[]) => {
    try {
      await reorderCategorias({
        data: { ordem: ids.map((id, i) => ({ id, ordem: i + 1 })) },
      });
      refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao reordenar.");
    }
  };

  const moveUp = (id: string) => {
    const ids = categorias.map((c) => c.id);
    const i = ids.indexOf(id);
    if (i <= 0) return;
    [ids[i - 1], ids[i]] = [ids[i], ids[i - 1]];
    reordenar(ids);
  };

  const moveDown = (id: string) => {
    const ids = categorias.map((c) => c.id);
    const i = ids.indexOf(id);
    if (i < 0 || i >= ids.length - 1) return;
    [ids[i + 1], ids[i]] = [ids[i], ids[i + 1]];
    reordenar(ids);
  };

  const toggleDestaque = async (cat: Categoria) => {
    try {
      await upsertCategoria({ data: toUpsert({ ...cat, destaque: !cat.destaque }) });
      refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao atualizar.");
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Catálogo"
        title="Categorias"
        description="8 linhas clínicas. Reordene, edite descrição e marque destaques que aparecem na home."
        icon={FolderTree}
        tone="violet"
      />

      <div className="px-4 sm:px-6 md:px-10 py-5 sm:py-6 md:py-8 max-w-5xl">
        <div className="space-y-2">
          {categorias.map((c, i) => (
            <div
              key={c.id}
              className="bg-paper border border-line rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:border-violet-300 transition-colors"
            >
              <div className="flex flex-col gap-0.5 shrink-0">
                <button
                  onClick={() => moveUp(c.id)}
                  disabled={i === 0}
                  aria-label="Mover para cima"
                  className="h-6 w-6 rounded flex items-center justify-center text-ink-soft hover:text-ink hover:bg-bone disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => moveDown(c.id)}
                  disabled={i === categorias.length - 1}
                  aria-label="Mover para baixo"
                  className="h-6 w-6 rounded flex items-center justify-center text-ink-soft hover:text-ink hover:bg-bone disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>

              <div
                className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-100 to-violet-50 text-violet-700 flex items-center justify-center shrink-0"
                title={`Ícone exibido no menu do site (categoria ${c.numero})`}
              >
                {(() => {
                  const Icon = resolveCategoryIcon(c.icone, c.slug);
                  return <Icon className="h-5 w-5" />;
                })()}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-serif font-normal text-base sm:text-lg text-ink line-clamp-1">
                    {c.nome}
                  </h3>
                  {c.destaque && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-amber-900 bg-amber-100 rounded-full px-2 py-0.5">
                      <Star className="h-2.5 w-2.5" /> Destaque
                    </span>
                  )}
                </div>
                <p className="text-xs text-ink-soft line-clamp-1 mt-0.5">
                  {c.descricao_curta}
                </p>
                <p className="text-[11px] font-mono text-ink-mute mt-1">
                  {countByCat[c.id] ?? 0} produtos · /{c.slug}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={`/produtos/categoria/${c.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Ver no site"
                  className="h-8 w-8 rounded-md flex items-center justify-center text-ink-soft hover:text-ink hover:bg-bone transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
                <button
                  onClick={() => toggleDestaque(c)}
                  aria-label={c.destaque ? "Remover destaque" : "Marcar destaque"}
                  className={`h-8 w-8 rounded-md flex items-center justify-center transition-colors ${
                    c.destaque
                      ? "text-amber-600 bg-amber-50"
                      : "text-ink-soft hover:text-amber-700 hover:bg-amber-50"
                  }`}
                >
                  <Star className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setEditing(c)}
                  aria-label="Editar"
                  className="h-8 w-8 rounded-md flex items-center justify-center text-ink-soft hover:text-conecta-blue hover:bg-blue-50 transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-line bg-bone/40 p-4 text-xs text-ink-soft">
          <strong>📌 Estrutura fixa:</strong> as 8 categorias vêm da planilha
          Shinova e não podem ser adicionadas/removidas pelo painel, apenas
          editadas e reordenadas. Para mudanças estruturais, fale com o suporte.
        </div>
      </div>

      {editing && (
        <CategoriaForm
          categoria={editing}
          onClose={() => setEditing(null)}
          onSave={async (input) => {
            try {
              await upsertCategoria({ data: toUpsert({ ...editing, ...input }) });
              toast.success("Categoria atualizada.");
              setEditing(null);
              refresh();
            } catch (e) {
              toast.error(e instanceof Error ? e.message : "Erro ao salvar.");
            }
          }}
        />
      )}
    </div>
  );
}

function CategoriaForm({
  categoria,
  onClose,
  onSave,
}: {
  categoria: Categoria;
  onClose: () => void;
  onSave: (data: Partial<Categoria>) => void;
}) {
  const [nome, setNome] = useState(categoria.nome);
  const [descricao, setDescricao] = useState(categoria.descricao_curta);
  const [destaque, setDestaque] = useState(categoria.destaque);
  const [icone, setIcone] = useState<string>(
    categoria.icone || defaultIconKeyForSlug(categoria.slug),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      toast.error("Nome obrigatório.");
      return;
    }
    onSave({
      nome: nome.trim(),
      descricao_curta: descricao.trim(),
      destaque,
      icone,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-paper rounded-2xl w-full max-w-lg max-h-[92vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="border-b border-line px-5 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-ink-soft font-mono">
              Editar categoria · {categoria.numero}
            </div>
            <h2 className="font-serif text-xl text-ink mt-0.5">{categoria.nome}</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="h-9 w-9 rounded-md text-ink-soft hover:text-ink hover:bg-bone flex items-center justify-center"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="px-5 sm:px-6 py-5 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-ink">Nome</label>
            <input
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="input"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-ink">
              Descrição curta
            </label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              maxLength={250}
              className="input min-h-[80px] resize-y"
            />
            <p className="text-xs text-ink-soft">
              Aparece em listagens e na home (máx 250 caracteres).
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-ink">Slug (URL)</label>
            <input
              value={categoria.slug}
              disabled
              className="input bg-bone cursor-not-allowed font-mono text-xs"
            />
            <p className="text-xs text-ink-soft">
              O slug não pode ser alterado para preservar links existentes.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-ink">
              Ícone no menu do site
            </label>
            <p className="text-xs text-ink-soft">
              Aparece no menu "Produtos" do topo do site quando o visitante passa
              o mouse e escolhe esta categoria. Clique para trocar.
            </p>
            <div className="mt-1 grid grid-cols-7 sm:grid-cols-9 gap-1.5 rounded-xl border border-line bg-bone/40 p-2">
              {CATEGORY_ICON_OPTIONS.map((opt) => {
                const Icon = opt.Icon;
                const selected = icone === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setIcone(opt.key)}
                    title={opt.label}
                    aria-label={opt.label}
                    aria-pressed={selected}
                    className={`aspect-square rounded-lg flex items-center justify-center transition-colors ${
                      selected
                        ? "bg-conecta-blue text-white shadow-sm"
                        : "bg-paper text-ink-soft hover:text-conecta-blue hover:bg-blue-50 border border-line"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                );
              })}
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={destaque}
              onChange={(e) => setDestaque(e.target.checked)}
              className="h-4 w-4 accent-conecta-orange"
            />
            <span className="text-sm text-ink">Exibir como destaque na home</span>
          </label>
        </form>

        <footer className="border-t border-line px-5 sm:px-6 py-3 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-conecta-blue hover:bg-conecta-blue-deep text-white"
          >
            Salvar
          </Button>
        </footer>
      </div>
    </div>
  );
}
