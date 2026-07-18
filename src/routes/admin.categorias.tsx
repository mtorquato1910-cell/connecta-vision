import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Eye, EyeOff, ExternalLink, FolderTree, Pencil, Plus, Star, Trash2, X } from "lucide-react";
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
  listAllProdutos,
  setCategoriaOculta,
  deleteCategoria,
} from "@/lib/admin.functions";

type Categoria = {
  id: string;
  slug: string;
  nome: string;
  numero: string;
  ordem: number;
  destaque: boolean;
  oculto: boolean;
  descricao_curta: string;
  imagem_url: string | null;
  icone: string | null;
};

function toUpsert(c: Categoria) {
  const base = {
    slug: c.slug,
    nome: c.nome,
    numero: c.numero,
    descricao: c.descricao_curta || null,
    imagem_url: c.imagem_url,
    icone: c.icone || null,
    ordem: c.ordem,
    destaque: c.destaque,
    oculto: c.oculto,
  };
  // Sem id ⇒ criação (Supabase gera o uuid). Com id ⇒ atualização.
  return c.id ? { id: c.id, ...base } : base;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

export const Route = createFileRoute("/admin/categorias")({
  component: AdminCategoriasPage,
});

function AdminCategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [countByCat, setCountByCat] = useState<Record<string, number>>({});
  const [editing, setEditing] = useState<Categoria | null>(null);
  const [creating, setCreating] = useState(false);

  // Categoria em branco para o formulário de criação (numero/ordem automáticos).
  const novaCategoria = (): Categoria => {
    const maxOrdem = categorias.reduce((m, c) => Math.max(m, c.ordem ?? 0), 0);
    const proximo = categorias.length + 1;
    return {
      id: "",
      slug: "",
      nome: "",
      numero: String(proximo).padStart(2, "0"),
      ordem: maxOrdem + 1,
      destaque: false,
      oculto: false,
      descricao_curta: "",
      imagem_url: null,
      icone: null,
    };
  };

  const [deleting, setDeleting] = useState<Categoria | null>(null);

  const toggleOculto = async (cat: Categoria) => {
    try {
      await setCategoriaOculta({ data: { id: cat.id, oculto: !cat.oculto } });
      toast.success(!cat.oculto ? "Categoria ocultada do site." : "Categoria visível no site.");
      refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao ocultar.");
    }
  };

  const confirmDelete = async (destinoId?: string) => {
    if (!deleting) return;
    try {
      const res = (await deleteCategoria({
        data: { id: deleting.id, destinoId },
      })) as { migrados?: number };
      toast.success(
        res.migrados
          ? `Categoria excluída. ${res.migrados} produto(s) migrado(s).`
          : "Categoria excluída.",
      );
      setDeleting(null);
      refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao excluir.");
    }
  };

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
            oculto: !!c.oculto,
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
      .catch((e) => toast.error(e instanceof Error ? e.message : "Erro ao carregar categorias."));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

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
        description="As categorias aparecem em ordem alfabética no site. Edite, oculte, exclua (migrando os produtos) e marque destaques da home."
        icon={FolderTree}
        tone="violet"
      />

      <div className="px-4 sm:px-6 md:px-10 py-5 sm:py-6 md:py-8 max-w-5xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-sm text-ink-soft">
            {categorias.length} categorias · em ordem alfabética, edite, oculte ou crie novas.
          </p>
          <Button
            onClick={() => setCreating(true)}
            className="bg-conecta-blue hover:bg-conecta-blue-deep text-white shrink-0"
          >
            <Plus className="h-4 w-4" /> Nova categoria
          </Button>
        </div>

        <div className="space-y-2">
          {categorias.map((c) => (
            <div
              key={c.id}
              className="bg-paper border border-line rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:border-violet-300 transition-colors"
            >
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
                  {c.oculto && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-slate-700 bg-slate-100 rounded-full px-2 py-0.5">
                      <EyeOff className="h-2.5 w-2.5" /> Oculta
                    </span>
                  )}
                </div>
                <p className="text-xs text-ink-soft line-clamp-1 mt-0.5">{c.descricao_curta}</p>
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
                  onClick={() => toggleOculto(c)}
                  aria-label={c.oculto ? "Mostrar no site" : "Ocultar do site"}
                  title={c.oculto ? "Mostrar no site" : "Ocultar do site"}
                  className={`h-8 w-8 rounded-md flex items-center justify-center transition-colors ${
                    c.oculto
                      ? "text-slate-500 bg-slate-100 hover:bg-slate-200"
                      : "text-ink-soft hover:text-ink hover:bg-bone"
                  }`}
                >
                  {c.oculto ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setEditing(c)}
                  aria-label="Editar"
                  className="h-8 w-8 rounded-md flex items-center justify-center text-ink-soft hover:text-conecta-blue hover:bg-blue-50 transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleting(c)}
                  aria-label="Excluir"
                  title="Excluir categoria"
                  className="h-8 w-8 rounded-md flex items-center justify-center text-ink-soft hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-line bg-bone/40 p-4 text-xs text-ink-soft">
          <strong>📌 Dica:</strong> as 8 linhas originais vêm da planilha Shinova. Você pode criar
          novas categorias pelo botão "Nova categoria", escolher o ícone do menu e reordenar.
          Categorias novas aparecem automaticamente no seletor ao cadastrar um produto.
        </div>
      </div>

      {editing && (
        <CategoriaForm
          categoria={editing}
          mode="edit"
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

      {creating && (
        <CategoriaForm
          categoria={novaCategoria()}
          mode="create"
          existingSlugs={categorias.map((c) => c.slug)}
          onClose={() => setCreating(false)}
          onSave={async (input) => {
            const base = novaCategoria();
            try {
              await upsertCategoria({ data: toUpsert({ ...base, ...input }) });
              toast.success("Categoria criada.");
              setCreating(false);
              refresh();
            } catch (e) {
              toast.error(e instanceof Error ? e.message : "Erro ao criar.");
            }
          }}
        />
      )}

      {deleting && (
        <DeleteCategoriaModal
          categoria={deleting}
          qtdProdutos={countByCat[deleting.id] ?? 0}
          outras={categorias.filter((c) => c.id !== deleting.id)}
          onCancel={() => setDeleting(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

function DeleteCategoriaModal({
  categoria,
  qtdProdutos,
  outras,
  onCancel,
  onConfirm,
}: {
  categoria: Categoria;
  qtdProdutos: number;
  outras: Categoria[];
  onCancel: () => void;
  onConfirm: (destinoId?: string) => void;
}) {
  const precisaMigrar = qtdProdutos > 0;
  const [destino, setDestino] = useState("");

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div className="bg-paper rounded-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-line">
          <h2 className="font-serif text-xl text-ink">Excluir categoria</h2>
          <p className="text-sm text-ink-soft mt-1">
            "{categoria.nome}" será removida definitivamente do site.
          </p>
        </div>
        <div className="p-6 space-y-4">
          {precisaMigrar ? (
            <>
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900">
                Esta categoria tem <strong>{qtdProdutos} produto(s)</strong>. Escolha uma categoria
                de destino para migrá-los antes de excluir.
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5">Migrar produtos para</label>
                <select
                  value={destino}
                  onChange={(e) => setDestino(e.target.value)}
                  className="input w-full"
                >
                  <option value="">Selecione uma categoria…</option>
                  {outras.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <p className="text-sm text-ink-soft">
              Esta categoria está vazia (sem produtos) e será excluída direto.
            </p>
          )}
        </div>
        <div className="p-6 border-t border-line flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            disabled={precisaMigrar && !destino}
            onClick={() => onConfirm(precisaMigrar ? destino : undefined)}
          >
            Excluir{precisaMigrar ? " e migrar" : ""}
          </Button>
        </div>
      </div>
    </div>
  );
}

function CategoriaForm({
  categoria,
  mode = "edit",
  existingSlugs = [],
  onClose,
  onSave,
}: {
  categoria: Categoria;
  mode?: "edit" | "create";
  existingSlugs?: string[];
  onClose: () => void;
  onSave: (data: Partial<Categoria>) => void;
}) {
  const isCreate = mode === "create";
  const [nome, setNome] = useState(categoria.nome);
  const [descricao, setDescricao] = useState(categoria.descricao_curta);
  const [destaque, setDestaque] = useState(categoria.destaque);
  const [icone, setIcone] = useState<string>(
    categoria.icone || (isCreate ? "activity" : defaultIconKeyForSlug(categoria.slug)),
  );
  // No modo criação o slug acompanha o nome até o usuário editar manualmente.
  const [slug, setSlug] = useState(categoria.slug);
  const [slugTocado, setSlugTocado] = useState(false);

  const onNomeChange = (v: string) => {
    setNome(v);
    if (isCreate && !slugTocado) setSlug(slugify(v));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      toast.error("Nome obrigatório.");
      return;
    }
    if (isCreate) {
      const s = slugify(slug || nome);
      if (!s) {
        toast.error("Slug inválido. Use letras, números e hífens.");
        return;
      }
      if (existingSlugs.includes(s)) {
        toast.error("Já existe uma categoria com esse slug.");
        return;
      }
      onSave({
        nome: nome.trim(),
        slug: s,
        descricao_curta: descricao.trim(),
        destaque,
        icone,
      });
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
              {isCreate ? "Nova categoria" : "Editar categoria"} · {categoria.numero}
            </div>
            <h2 className="font-serif text-xl text-ink mt-0.5">
              {isCreate ? nome || "Sem nome" : categoria.nome}
            </h2>
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
              onChange={(e) => onNomeChange(e.target.value)}
              placeholder={isCreate ? "Ex.: Reabilitação & Fisioterapia" : undefined}
              className="input"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-ink">Descrição curta</label>
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
              value={isCreate ? slug : categoria.slug}
              disabled={!isCreate}
              onChange={(e) => {
                setSlugTocado(true);
                setSlug(slugify(e.target.value));
              }}
              placeholder="ex.: reabilitacao-fisioterapia"
              className={`input font-mono text-xs ${isCreate ? "" : "bg-bone cursor-not-allowed"}`}
            />
            <p className="text-xs text-ink-soft">
              {isCreate
                ? "Gerado a partir do nome. Compõe a URL /produtos/categoria/slug e não pode ser alterado depois."
                : "O slug não pode ser alterado para preservar links existentes."}
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-ink">Ícone no menu do site</label>
            <p className="text-xs text-ink-soft">
              Aparece no menu "Produtos" do topo do site quando o visitante passa o mouse e escolhe
              esta categoria. Clique para trocar.
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
            {isCreate ? "Criar categoria" : "Salvar"}
          </Button>
        </footer>
      </div>
    </div>
  );
}
