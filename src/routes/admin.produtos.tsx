import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ExternalLink,
  Eye,
  EyeOff,
  Package,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  create as createProduto,
  formatEspecsText,
  formatGaleriaText,
  getAll as getAllProdutos,
  parseEspecsText,
  parseGaleriaText,
  remove as removeProduto,
  reset as resetProdutos,
  update as updateProduto,
  type Produto,
} from "@/lib/admin-produtos-repo";
import { CATEGORIAS } from "@/lib/site-data";

export const Route = createFileRoute("/admin/produtos")({
  component: AdminProdutosPage,
});

const PAGE_SIZE = 20;

function AdminProdutosPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "publicado" | "rascunho" | "destaque">("all");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Produto | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Produto | null>(null);

  const refresh = () => setRefreshKey((k) => k + 1);

  const allProdutos = useMemo(() => getAllProdutos(), [refreshKey]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return allProdutos.filter((p) => {
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
  }, [allProdutos, search, catFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleDelete = () => {
    if (!confirmDelete) return;
    removeProduto(confirmDelete.id);
    toast.success(`"${confirmDelete.modelo}" excluído.`);
    setConfirmDelete(null);
    refresh();
  };

  const handleReset = () => {
    if (!confirm("Restaurar todos os produtos ao estado original (planilha Shinova)? Suas edições serão perdidas.")) {
      return;
    }
    resetProdutos();
    toast.success("Produtos restaurados.");
    refresh();
  };

  const togglePublicado = (p: Produto) => {
    updateProduto(p.id, { publicado: !p.publicado });
    toast.success(`"${p.modelo}" ${!p.publicado ? "publicado" : "ocultado"}.`);
    refresh();
  };

  const toggleDestaque = (p: Produto) => {
    updateProduto(p.id, { destaque: !p.destaque });
    toast.success(`"${p.modelo}" ${!p.destaque ? "em destaque" : "removido do destaque"}.`);
    refresh();
  };

  return (
    <div>
      <PageHeader
        eyebrow="Catálogo"
        title="Produtos"
        description={`${allProdutos.length} equipamentos cadastrados. Edite informações, galeria, especificações e visibilidade.`}
        icon={Package}
        tone="blue"
        badge={{
          label: `${filtered.filter((p) => !p.publicado).length} em rascunho`,
          tone: "amber",
        }}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              title="Restaurar produtos ao estado original"
              className="gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Restaurar</span>
            </Button>
            <Button onClick={() => setCreating(true)} className="gap-2 bg-conecta-blue hover:bg-conecta-blue-deep text-white">
              <Plus className="h-4 w-4" /> Novo produto
            </Button>
          </div>
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
            {CATEGORIAS.map((c) => (
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
          {filtered.length} resultado{filtered.length === 1 ? "" : "s"}
          {totalPages > 1 && ` · página ${currentPage} de ${totalPages}`}
        </div>

        {/* Lista */}
        {pageItems.length === 0 ? (
          <div className="bg-paper border border-line rounded-2xl py-16 text-center text-ink-soft">
            Nenhum produto encontrado com esses filtros.
          </div>
        ) : (
          <div className="space-y-2">
            {pageItems.map((p) => (
              <ProductRow
                key={p.id}
                p={p}
                onEdit={() => setEditing(p)}
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
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Anterior
            </Button>
            <span className="text-sm text-ink-soft px-3">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Próxima
            </Button>
          </div>
        )}
      </div>

      {(editing || creating) && (
        <ProductForm
          produto={editing}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSave={(input) => {
            if (editing) {
              updateProduto(editing.id, input);
              toast.success("Produto atualizado.");
            } else {
              createProduto(input as Produto);
              toast.success("Produto criado.");
            }
            setEditing(null);
            setCreating(false);
            refresh();
          }}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Excluir produto"
          message={`Tem certeza que quer excluir "${confirmDelete.modelo} — ${confirmDelete.nome}"? Esta ação não pode ser desfeita.`}
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
  p: Produto;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePublicado: () => void;
  onToggleDestaque: () => void;
}) {
  return (
    <div className="bg-paper border border-line rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:border-conecta-blue/30 transition-colors">
      <img
        src={p.imagem_principal ?? "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'/>"}
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
  onClose,
  onSave,
}: {
  produto: Produto | null;
  onClose: () => void;
  onSave: (p: Omit<Produto, "id"> & { id?: string }) => void;
}) {
  const editing = !!produto;

  const cat0 = produto?.categoria_slug ?? CATEGORIAS[0]?.slug ?? "";
  const cat0Meta = CATEGORIAS.find((c) => c.slug === cat0);

  const [modelo, setModelo] = useState(produto?.modelo ?? "");
  const [nome, setNome] = useState(produto?.nome ?? "");
  const [marca, setMarca] = useState(produto?.marca ?? "SHINOVA");
  const [categoriaSlug, setCategoriaSlug] = useState(cat0);
  const [subcategoria, setSubcategoria] = useState(produto?.subcategoria ?? "");
  const [descricaoCurta, setDescricaoCurta] = useState(produto?.descricao_curta ?? "");
  const [descricaoLonga, setDescricaoLonga] = useState(produto?.descricao_longa ?? "");
  const [imagemPrincipal, setImagemPrincipal] = useState(produto?.imagem_principal ?? "");
  const [galeriaText, setGaleriaText] = useState(produto ? formatGaleriaText(produto.galeria) : "");
  const [especsText, setEspecsText] = useState(produto ? formatEspecsText(produto.especificacoes) : "");
  const [urlFabricante, setUrlFabricante] = useState(produto?.url_fabricante ?? "");
  const [destaque, setDestaque] = useState(produto?.destaque ?? false);
  const [publicado, setPublicado] = useState(produto?.publicado ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelo.trim() || !nome.trim()) {
      toast.error("Modelo e nome são obrigatórios.");
      return;
    }
    const catMeta = CATEGORIAS.find((c) => c.slug === categoriaSlug);
    if (!catMeta) {
      toast.error("Categoria inválida.");
      return;
    }
    const galeria = parseGaleriaText(galeriaText);
    const especificacoes = parseEspecsText(especsText);
    onSave({
      ...(produto ?? {}),
      id: produto?.id,
      slug: produto?.slug ?? "",
      modelo: modelo.trim(),
      nome: nome.trim(),
      marca: marca.trim() || "SHINOVA",
      categoria_id: catMeta.slug,
      categoria_slug: catMeta.slug,
      categoria_nome: catMeta.nome,
      subcategoria: subcategoria.trim() || null,
      descricao_curta: descricaoCurta.trim() || null,
      descricao_longa: descricaoLonga.trim() || null,
      especificacoes,
      configuracoes: produto?.configuracoes ?? null,
      imagem_principal: imagemPrincipal.trim() || galeria[0]?.url || null,
      galeria,
      url_fabricante: urlFabricante.trim() || null,
      destaque,
      publicado,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-paper border rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="sticky top-0 z-10 bg-paper border-b border-line px-5 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-ink-soft font-mono">
              {editing ? "Editar produto" : "Novo produto"}
            </div>
            <h2 className="font-serif text-xl text-ink mt-0.5">
              {editing ? `${produto?.modelo} — ${produto?.nome}` : "Cadastrar novo equipamento"}
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

        <form onSubmit={handleSubmit} className="px-5 sm:px-6 py-5 space-y-5">
          {/* Identificação */}
          <Section title="Identificação">
            <Grid>
              <Field label="Modelo *" hint="Ex.: Moni 3L">
                <input
                  required
                  value={modelo}
                  onChange={(e) => setModelo(e.target.value)}
                  className="input"
                  placeholder="MONI 3L"
                />
              </Field>
              <Field label="Marca">
                <input
                  value={marca}
                  onChange={(e) => setMarca(e.target.value)}
                  className="input"
                />
              </Field>
            </Grid>
            <Field label="Nome completo *">
              <input
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="input"
                placeholder="Monitor Multiparâmetros Veterinário Touchscreen 15"
              />
            </Field>
            <Grid>
              <Field label="Categoria">
                <select
                  value={categoriaSlug}
                  onChange={(e) => setCategoriaSlug(e.target.value)}
                  className="input"
                >
                  {CATEGORIAS.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Subcategoria" hint="Opcional. Ex.: Veterinary Monitor">
                <input
                  value={subcategoria}
                  onChange={(e) => setSubcategoria(e.target.value)}
                  className="input"
                />
              </Field>
            </Grid>
          </Section>

          {/* Descrição */}
          <Section title="Descrição">
            <Field label="Descrição curta" hint="Aparece nos cards do catálogo (máx 200 chars).">
              <textarea
                value={descricaoCurta}
                onChange={(e) => setDescricaoCurta(e.target.value)}
                rows={2}
                maxLength={250}
                className="input min-h-[60px] resize-y"
              />
            </Field>
            <Field label="Descrição longa" hint="Aparece na tab Descrição da página do produto.">
              <textarea
                value={descricaoLonga}
                onChange={(e) => setDescricaoLonga(e.target.value)}
                rows={6}
                className="input min-h-[140px] resize-y"
              />
            </Field>
          </Section>

          {/* Imagens */}
          <Section title="Imagens">
            <Field label="Imagem principal (URL)">
              <input
                value={imagemPrincipal}
                onChange={(e) => setImagemPrincipal(e.target.value)}
                placeholder="https://..."
                className="input"
              />
            </Field>
            <Field
              label="Galeria (uma URL por linha)"
              hint="Cada linha vira uma imagem na galeria. Se vazio, usa a imagem principal."
            >
              <textarea
                value={galeriaText}
                onChange={(e) => setGaleriaText(e.target.value)}
                rows={6}
                placeholder={"https://exemplo.com/imagem1.jpg\nhttps://exemplo.com/imagem2.jpg"}
                className="input min-h-[120px] resize-y font-mono text-xs"
              />
            </Field>
          </Section>

          {/* Especificações */}
          <Section title="Especificações técnicas">
            <Field
              label="Lista (uma por linha no formato chave: valor)"
              hint="Ex.: Tela: 15 polegadas touchscreen"
            >
              <textarea
                value={especsText}
                onChange={(e) => setEspecsText(e.target.value)}
                rows={8}
                placeholder={"Tela: 15 polegadas touchscreen\nBateria: Lítio 4h autonomia\nParâmetros: ECG, SpO2, NIBP"}
                className="input min-h-[180px] resize-y font-mono text-xs"
              />
            </Field>
          </Section>

          {/* Visibilidade */}
          <Section title="Visibilidade">
            <Grid>
              <Field label="URL do fabricante" hint="Opcional">
                <input
                  value={urlFabricante}
                  onChange={(e) => setUrlFabricante(e.target.value)}
                  placeholder="https://shinova.com/..."
                  className="input"
                />
              </Field>
              <div className="flex flex-col gap-3 pt-7">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={publicado}
                    onChange={(e) => setPublicado(e.target.checked)}
                    className="h-4 w-4 accent-conecta-blue"
                  />
                  <span className="text-sm text-ink">Publicado no site</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={destaque}
                    onChange={(e) => setDestaque(e.target.checked)}
                    className="h-4 w-4 accent-conecta-orange"
                  />
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
          <Button
            onClick={handleSubmit}
            className="bg-conecta-blue hover:bg-conecta-blue-deep text-white"
          >
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
      <legend className="px-2 text-[10px] uppercase tracking-[0.2em] font-mono text-ink-soft">
        {title}
      </legend>
      {children}
    </fieldset>
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
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        className="bg-paper rounded-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
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
