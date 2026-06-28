import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ExternalLink,
  Eye,
  EyeOff,
  Package,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/PageHeader";
import { ImagensEditor } from "@/components/admin/ImagensEditor";
import {
  listAllProdutos,
  listAllCategorias,
  getProdutoAdmin,
  upsertProduto,
  deleteProduto,
  updateProdutoStatus,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/produtos")({
  component: AdminProdutosPage,
});

const PAGE_SIZE = 20;

type Espec = { label: string; valor: string };

type CapaAjuste = { fit?: "contain" | "cover"; zoom?: number; posX?: number; posY?: number };

type ProdutoLista = {
  id: string;
  slug: string;
  modelo: string;
  nome: string;
  imagem_url: string | null;
  subcategoria: string | null;
  destaque: boolean;
  publicado: boolean;
  ordem: number;
  categoria_id: string;
  categoria_nome: string;
  categoria_slug: string;
};

type ProdutoFull = {
  id: string;
  slug: string;
  modelo: string;
  nome: string;
  categoria_id: string;
  imagem_url: string | null;
  galeria: string[];
  resumo: string | null;
  descricao: string | null;
  diferenciais: string[];
  aplicacoes: string[];
  especificacoes: Espec[];
  capa_ajuste: CapaAjuste | null;
  marca: string | null;
  subcategoria: string | null;
  configuracoes: string | null;
  url_fabricante: string | null;
  destaque: boolean;
  publicado: boolean;
  ordem: number;
};

type CategoriaOpc = { id: string; slug: string; nome: string };

function especsToText(especs: Espec[]): string {
  return especs.map((e) => `${e.label}: ${e.valor}`).join("\n");
}

function textToEspecs(text: string): Espec[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const m = line.match(/^([^:]+?)\s*:\s*(.+)$/);
      if (m) return { label: m[1].trim(), valor: m[2].trim() };
      return { label: "Especificação", valor: line };
    });
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function AdminProdutosPage() {
  const [produtos, setProdutos] = useState<ProdutoLista[]>([]);
  const [categorias, setCategorias] = useState<CategoriaOpc[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "publicado" | "rascunho" | "destaque">("all");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<ProdutoFull | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<ProdutoLista | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    Promise.all([listAllProdutos(), listAllCategorias()])
      .then(([prods, cats]) => {
        setProdutos(prods as ProdutoLista[]);
        setCategorias(
          (cats as Record<string, any>[]).map((c) => ({ id: c.id, slug: c.slug, nome: c.nome })),
        );
      })
      .catch((e) => toast.error(e instanceof Error ? e.message : "Erro ao carregar produtos."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return produtos.filter((p) => {
      if (catFilter && p.categoria_slug !== catFilter) return false;
      if (statusFilter === "publicado" && !p.publicado) return false;
      if (statusFilter === "rascunho" && p.publicado) return false;
      if (statusFilter === "destaque" && !p.destaque) return false;
      if (!term) return true;
      return (
        p.modelo.toLowerCase().includes(term) ||
        p.nome.toLowerCase().includes(term) ||
        p.categoria_nome.toLowerCase().includes(term) ||
        (p.subcategoria ?? "").toLowerCase().includes(term)
      );
    });
  }, [produtos, search, catFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteProduto({ data: { id: confirmDelete.id } });
      toast.success(`"${confirmDelete.modelo}" excluído.`);
      setConfirmDelete(null);
      refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao excluir.");
    }
  };

  const togglePublicado = async (p: ProdutoLista) => {
    try {
      await updateProdutoStatus({ data: { id: p.id, publicado: !p.publicado } });
      toast.success(`"${p.modelo}" ${!p.publicado ? "publicado" : "ocultado"}.`);
      refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao atualizar.");
    }
  };

  const toggleDestaque = async (p: ProdutoLista) => {
    try {
      await updateProdutoStatus({ data: { id: p.id, destaque: !p.destaque } });
      toast.success(`"${p.modelo}" ${!p.destaque ? "em destaque" : "removido do destaque"}.`);
      refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao atualizar.");
    }
  };

  const openEdit = async (id: string) => {
    try {
      const full = await getProdutoAdmin({ data: { id } });
      if (full) setEditing(full as unknown as ProdutoFull);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao abrir produto.");
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Catálogo"
        title="Produtos"
        description={`${produtos.length} equipamentos cadastrados. Edite informações, galeria, especificações e visibilidade.`}
        icon={Package}
        tone="blue"
        badge={{
          label: `${produtos.filter((p) => !p.publicado).length} em rascunho`,
          tone: "amber",
        }}
        actions={
          <Button onClick={() => setCreating(true)} className="gap-2 bg-conecta-blue hover:bg-conecta-blue-deep text-white">
            <Plus className="h-4 w-4" /> Novo produto
          </Button>
        }
      />

      <div className="px-4 sm:px-6 md:px-10 py-5 sm:py-6 md:py-8 max-w-7xl">
        {/* Filtros */}
        <div className="bg-paper border border-line rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-mute" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Buscar por modelo, nome, categoria..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-line focus:border-conecta-blue outline-none transition-colors"
            />
          </div>
          <select
            value={catFilter}
            onChange={(e) => {
              setCatFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-sm rounded-lg border border-line bg-paper focus:border-conecta-blue outline-none transition-colors md:w-56"
          >
            <option value="">Todas categorias</option>
            {categorias.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.nome}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as typeof statusFilter);
              setPage(1);
            }}
            className="px-3 py-2 text-sm rounded-lg border border-line bg-paper focus:border-conecta-blue outline-none transition-colors md:w-44"
          >
            <option value="all">Todos status</option>
            <option value="publicado">Publicados</option>
            <option value="rascunho">Rascunho</option>
            <option value="destaque">Em destaque</option>
          </select>
        </div>

        {/* Contador */}
        <div className="text-xs text-ink-soft mb-3 px-1">
          {loading
            ? "Carregando…"
            : `${filtered.length} resultado${filtered.length === 1 ? "" : "s"}${
                totalPages > 1 ? ` · página ${currentPage} de ${totalPages}` : ""
              }`}
        </div>

        {/* Lista */}
        {pageItems.length === 0 ? (
          <div className="bg-paper border border-line rounded-2xl py-16 text-center text-ink-soft">
            {loading ? "Carregando produtos…" : "Nenhum produto encontrado com esses filtros."}
          </div>
        ) : (
          <div className="space-y-2">
            {pageItems.map((p) => (
              <ProductRow
                key={p.id}
                p={p}
                onEdit={() => openEdit(p.id)}
                onDelete={() => setConfirmDelete(p)}
                onTogglePublicado={() => togglePublicado(p)}
                onToggleDestaque={() => toggleDestaque(p)}
              />
            ))}
          </div>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Anterior
            </Button>
            <span className="text-sm text-ink-soft px-3">
              {currentPage} / {totalPages}
            </span>
            <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
              Próxima
            </Button>
          </div>
        )}
      </div>

      {(editing || creating) && (
        <ProductForm
          produto={editing}
          categorias={categorias}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSave={async (payload) => {
            try {
              await upsertProduto({ data: payload });
              toast.success(editing ? "Produto atualizado." : "Produto criado.");
              setEditing(null);
              setCreating(false);
              refresh();
            } catch (e) {
              toast.error(e instanceof Error ? e.message : "Erro ao salvar produto.");
            }
          }}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Excluir produto"
          message={`Tem certeza que quer excluir "${confirmDelete.modelo}, ${confirmDelete.nome}"? Esta ação não pode ser desfeita.`}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

// ─── Componentes ─────────────────────────────────────────────────────

function ProductRow({
  p,
  onEdit,
  onDelete,
  onTogglePublicado,
  onToggleDestaque,
}: {
  p: ProdutoLista;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePublicado: () => void;
  onToggleDestaque: () => void;
}) {
  return (
    <div className="bg-paper border border-line rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:border-conecta-blue/30 transition-colors">
      <img
        src={p.imagem_url ?? "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'/>"}
        alt=""
        className="h-14 w-14 sm:h-16 sm:w-16 rounded-lg object-cover bg-bone shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-conecta-orange font-medium">
            {p.modelo}
          </span>
          {p.destaque && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-amber-900 bg-amber-100 rounded-full px-2 py-0.5">
              <Star className="h-2.5 w-2.5" /> Destaque
            </span>
          )}
          {!p.publicado && (
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-700 bg-slate-100 rounded-full px-2 py-0.5">
              Rascunho
            </span>
          )}
        </div>
        <p className="text-sm font-serif text-ink line-clamp-1">{p.nome}</p>
        <p className="text-xs text-ink-soft line-clamp-1 mt-0.5">
          {p.categoria_nome}
          {p.subcategoria && ` · ${p.subcategoria}`}
        </p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <a
          href={`/produtos/${p.slug}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Ver no site"
          title="Ver no site"
          className="h-8 w-8 rounded-md flex items-center justify-center text-ink-soft hover:text-ink hover:bg-bone transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
        <button
          onClick={onToggleDestaque}
          aria-label={p.destaque ? "Remover destaque" : "Marcar destaque"}
          title={p.destaque ? "Remover destaque" : "Marcar destaque"}
          className={`h-8 w-8 rounded-md flex items-center justify-center transition-colors ${
            p.destaque ? "text-amber-600 bg-amber-50" : "text-ink-soft hover:text-amber-700 hover:bg-amber-50"
          }`}
        >
          <Star className="h-4 w-4" />
        </button>
        <button
          onClick={onTogglePublicado}
          aria-label={p.publicado ? "Despublicar" : "Publicar"}
          title={p.publicado ? "Despublicar" : "Publicar"}
          className={`h-8 w-8 rounded-md flex items-center justify-center transition-colors ${
            p.publicado ? "text-emerald-700 hover:bg-emerald-50" : "text-slate-500 hover:text-emerald-700 hover:bg-emerald-50"
          }`}
        >
          {p.publicado ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </button>
        <button
          onClick={onEdit}
          aria-label="Editar"
          title="Editar"
          className="h-8 w-8 rounded-md flex items-center justify-center text-ink-soft hover:text-conecta-blue hover:bg-blue-50 transition-colors"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={onDelete}
          aria-label="Excluir"
          title="Excluir"
          className="h-8 w-8 rounded-md flex items-center justify-center text-ink-soft hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Form de edição/criação ──────────────────────────────────────────

function ProductForm({
  produto,
  categorias,
  onClose,
  onSave,
}: {
  produto: ProdutoFull | null;
  categorias: CategoriaOpc[];
  onClose: () => void;
  onSave: (payload: Record<string, unknown>) => void;
}) {
  const editing = !!produto;

  const cat0 =
    categorias.find((c) => c.id === produto?.categoria_id)?.slug ?? categorias[0]?.slug ?? "";

  const [modelo, setModelo] = useState(produto?.modelo ?? "");
  const [nome, setNome] = useState(produto?.nome ?? "");
  const [marca, setMarca] = useState(produto?.marca ?? "SHINOVA");
  const [categoriaSlug, setCategoriaSlug] = useState(cat0);
  const [subcategoria, setSubcategoria] = useState(produto?.subcategoria ?? "");
  const [descricaoCurta, setDescricaoCurta] = useState(produto?.resumo ?? "");
  const [descricaoLonga, setDescricaoLonga] = useState(produto?.descricao ?? "");

  const initialUrls = (() => {
    if (!produto) return [];
    const urls = (produto.galeria ?? []).slice();
    if (produto.imagem_url && !urls.includes(produto.imagem_url)) {
      urls.unshift(produto.imagem_url);
    } else if (produto.imagem_url) {
      const idx = urls.indexOf(produto.imagem_url);
      if (idx > 0) {
        urls.splice(idx, 1);
        urls.unshift(produto.imagem_url);
      }
    }
    return urls;
  })();
  const [imagemCapa, setImagemCapa] = useState<string>(initialUrls[0] ?? "");
  const [imagemRest, setImagemRest] = useState<string[]>(initialUrls.slice(1));

  // Ajuste da capa (encaixe, zoom e posição). Aplica defaults quando vazio.
  const ca = (produto?.capa_ajuste ?? {}) as CapaAjuste;
  const [fit, setFit] = useState<"contain" | "cover">(ca.fit ?? "contain");
  const [zoom, setZoom] = useState<number>(ca.zoom ?? 1);
  const [posX, setPosX] = useState<number>(ca.posX ?? 50);
  const [posY, setPosY] = useState<number>(ca.posY ?? 50);
  const [especsText, setEspecsText] = useState(produto ? especsToText(produto.especificacoes) : "");
  const [urlFabricante, setUrlFabricante] = useState(produto?.url_fabricante ?? "");
  const [destaque, setDestaque] = useState(produto?.destaque ?? false);
  const [publicado, setPublicado] = useState(produto?.publicado ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelo.trim() || !nome.trim()) {
      toast.error("Modelo e nome são obrigatórios.");
      return;
    }
    const catMeta = categorias.find((c) => c.slug === categoriaSlug);
    if (!catMeta) {
      toast.error("Categoria inválida.");
      return;
    }
    const galeria = [imagemCapa, ...imagemRest].filter(Boolean);
    const slug = produto?.slug || slugify(modelo) || slugify(nome);
    onSave({
      id: produto?.id,
      slug,
      modelo: modelo.trim(),
      nome: nome.trim(),
      categoria_id: catMeta.id,
      imagem_url: imagemCapa || galeria[0] || null,
      galeria,
      resumo: descricaoCurta.trim() || null,
      descricao: descricaoLonga.trim() || null,
      diferenciais: produto?.diferenciais ?? [],
      aplicacoes: produto?.aplicacoes ?? (subcategoria.trim() ? [subcategoria.trim()] : []),
      especificacoes: textToEspecs(especsText),
      capa_ajuste: { fit, zoom, posX, posY },
      marca: marca.trim() || "SHINOVA",
      subcategoria: subcategoria.trim() || null,
      configuracoes: produto?.configuracoes ?? null,
      url_fabricante: urlFabricante.trim() || null,
      destaque,
      publicado,
      ordem: produto?.ordem ?? 0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 sm:p-4" onClick={onClose}>
      <div className="bg-paper border rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
        <header className="sticky top-0 z-10 bg-paper border-b border-line px-5 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-ink-soft font-mono">
              {editing ? "Editar produto" : "Novo produto"}
            </div>
            <h2 className="font-serif text-xl text-ink mt-0.5">
              {editing ? `${produto?.modelo}, ${produto?.nome}` : "Cadastrar novo equipamento"}
            </h2>
          </div>
          <button onClick={onClose} aria-label="Fechar" className="h-9 w-9 rounded-md text-ink-soft hover:text-ink hover:bg-bone flex items-center justify-center">
            <X className="h-5 w-5" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="px-5 sm:px-6 py-5 space-y-5">
          <Section title="Identificação">
            <Grid>
              <Field label="Modelo *" hint="Ex.: Moni 3L">
                <input required value={modelo} onChange={(e) => setModelo(e.target.value)} className="input" placeholder="MONI 3L" />
              </Field>
              <Field label="Marca">
                <input value={marca} onChange={(e) => setMarca(e.target.value)} className="input" />
              </Field>
            </Grid>
            <Field label="Nome completo *">
              <input required value={nome} onChange={(e) => setNome(e.target.value)} className="input" placeholder="Monitor Multiparâmetros Veterinário Touchscreen 15" />
            </Field>
            <Grid>
              <Field label="Categoria">
                <select value={categoriaSlug} onChange={(e) => setCategoriaSlug(e.target.value)} className="input">
                  {categorias.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Subcategoria" hint="Opcional. Ex.: Veterinary Monitor">
                <input value={subcategoria} onChange={(e) => setSubcategoria(e.target.value)} className="input" />
              </Field>
            </Grid>
          </Section>

          <Section title="Descrição">
            <Field label="Descrição curta" hint="Aparece nos cards do catálogo (máx 200 chars).">
              <textarea value={descricaoCurta} onChange={(e) => setDescricaoCurta(e.target.value)} rows={2} maxLength={250} className="input min-h-[60px] resize-y" />
            </Field>
            <Field label="Descrição longa" hint="Aparece na tab Descrição da página do produto.">
              <textarea value={descricaoLonga} onChange={(e) => setDescricaoLonga(e.target.value)} rows={6} className="input min-h-[140px] resize-y" />
            </Field>
          </Section>

          <Section title="Imagens">
            <ImagensEditor
              capa={imagemCapa}
              galeria={imagemRest}
              onChange={({ capa, galeria }) => {
                setImagemCapa(capa);
                setImagemRest(galeria);
              }}
            />

            {/* Ajuste de como a capa aparece nos cards do site */}
            <div className="mt-5 pt-5 border-t border-line">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-ink">Ajuste da capa</p>
                  <p className="text-xs text-ink-soft mt-0.5">
                    Controla como a miniatura aparece no card do site.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-[160px_1fr] gap-5 items-start">
                {/* Preview em tempo real (mesma lógica do card) */}
                <div>
                  <div className="aspect-square w-40 max-w-full overflow-hidden rounded-xl border border-line bg-white relative">
                    {imagemCapa ? (
                      <img
                        src={imagemCapa}
                        alt="Pré-visualização da capa"
                        className={`h-full w-full ${
                          fit === "cover" ? "object-cover" : "object-contain p-2"
                        }`}
                        style={{
                          objectPosition: `${posX}% ${posY}%`,
                          transform: zoom > 1 ? `scale(${zoom})` : undefined,
                        }}
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-xs text-ink-soft px-2 text-center">
                        Defina uma capa para ver o preview
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-ink-soft mt-1.5 text-center">Pré-visualização</p>
                </div>

                <div className="space-y-4">
                  {/* Encaixe */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-ink">Encaixe</label>
                    <div className="inline-flex rounded-lg border border-line overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setFit("contain")}
                        className={`px-4 py-2 text-sm transition-colors ${
                          fit === "contain"
                            ? "bg-conecta-blue text-white"
                            : "bg-paper text-ink hover:bg-bone"
                        }`}
                      >
                        Inteiro
                      </button>
                      <button
                        type="button"
                        onClick={() => setFit("cover")}
                        className={`px-4 py-2 text-sm transition-colors border-l border-line ${
                          fit === "cover"
                            ? "bg-conecta-blue text-white"
                            : "bg-paper text-ink hover:bg-bone"
                        }`}
                      >
                        Preencher
                      </button>
                    </div>
                    <p className="text-xs text-ink-soft">
                      Inteiro mostra a imagem completa. Preencher cobre todo o quadro (pode cortar bordas).
                    </p>
                  </div>

                  {/* Zoom */}
                  <div className="space-y-1.5">
                    <label className="flex items-center justify-between text-sm font-medium text-ink">
                      <span>Zoom</span>
                      <span className="font-mono text-xs text-ink-soft">{zoom.toFixed(2)}x</span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={2}
                      step={0.05}
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-full accent-conecta-blue"
                    />
                    <p className="text-xs text-ink-soft">Útil principalmente no modo Preencher.</p>
                  </div>

                  {/* Posição horizontal */}
                  <div className="space-y-1.5">
                    <label className="flex items-center justify-between text-sm font-medium text-ink">
                      <span>Posição horizontal</span>
                      <span className="font-mono text-xs text-ink-soft">{posX}%</span>
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={posX}
                      onChange={(e) => setPosX(Number(e.target.value))}
                      className="w-full accent-conecta-blue"
                    />
                  </div>

                  {/* Posição vertical */}
                  <div className="space-y-1.5">
                    <label className="flex items-center justify-between text-sm font-medium text-ink">
                      <span>Posição vertical</span>
                      <span className="font-mono text-xs text-ink-soft">{posY}%</span>
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={posY}
                      onChange={(e) => setPosY(Number(e.target.value))}
                      className="w-full accent-conecta-blue"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <Section title="Especificações técnicas">
            <Field label="Lista (uma por linha no formato chave: valor)" hint="Ex.: Tela: 15 polegadas touchscreen">
              <textarea
                value={especsText}
                onChange={(e) => setEspecsText(e.target.value)}
                rows={8}
                placeholder={"Tela: 15 polegadas touchscreen\nBateria: Lítio 4h autonomia\nParâmetros: ECG, SpO2, NIBP"}
                className="input min-h-[180px] resize-y font-mono text-xs"
              />
            </Field>
          </Section>

          <Section title="Visibilidade">
            <Grid>
              <Field label="URL do fabricante" hint="Opcional">
                <input value={urlFabricante} onChange={(e) => setUrlFabricante(e.target.value)} placeholder="https://shinova.com/..." className="input" />
              </Field>
              <div className="flex flex-col gap-3 pt-7">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={publicado} onChange={(e) => setPublicado(e.target.checked)} className="h-4 w-4 accent-conecta-blue" />
                  <span className="text-sm text-ink">Publicado no site</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={destaque} onChange={(e) => setDestaque(e.target.checked)} className="h-4 w-4 accent-conecta-orange" />
                  <span className="text-sm text-ink">Em destaque na home</span>
                </label>
              </div>
            </Grid>
          </Section>
        </form>

        <footer className="sticky bottom-0 bg-paper border-t border-line px-5 sm:px-6 py-3 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-conecta-blue hover:bg-conecta-blue-deep text-white">
            {editing ? "Salvar alterações" : "Criar produto"}
          </Button>
        </footer>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border border-line rounded-xl px-4 sm:px-5 py-4 space-y-4">
      <legend className="px-2 text-[10px] uppercase tracking-[0.2em] font-mono text-ink-soft">{title}</legend>
      {children}
    </fieldset>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-4">{children}</div>;
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-ink">{label}</label>
      {children}
      {hint && <p className="text-xs text-ink-soft">{hint}</p>}
    </div>
  );
}

function ConfirmDialog({
  title,
  message,
  onCancel,
  onConfirm,
}: {
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="bg-paper rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-serif text-xl text-ink">{title}</h2>
        <p className="text-sm text-ink-soft mt-2">{message}</p>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={onConfirm} variant="destructive">
            Excluir
          </Button>
        </div>
      </div>
    </div>
  );
}
