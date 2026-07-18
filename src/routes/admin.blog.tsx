import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Eye,
  EyeOff,
  FileText,
  Newspaper,
  Pencil,
  Plus,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  adminUpsertPost,
  approvePost,
  deletePost,
  listAllPosts,
  rejectPost,
  reorderPosts,
  setPostDestaque,
  setPostVisivel,
} from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/PageHeader";
import { ImageInput } from "@/components/admin/ImageInput";

export const Route = createFileRoute("/admin/blog")({
  component: AdminBlogPage,
});

type BlogStatus = "pendente" | "publicado" | "rascunho" | "rejeitado";

type BlogPost = {
  id: string;
  slug: string;
  titulo: string;
  resumo: string | null;
  conteudo: string | null;
  capa_url: string | null;
  video_url: string | null;
  autor_nome: string;
  autor_email: string;
  tags: string[] | null;
  status: BlogStatus;
  origem: string;
  publicado_em: string | null;
  created_at: string;
  motivo_rejeicao?: string | null;
  destaque?: boolean;
  ordem?: number;
};

const FALLBACK_CAPA = "https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=1600&q=85";

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

type Tab = "todos" | "pendente" | "publicado" | "rejeitado";

// Ordem canônica dos publicados = mesma do site (destaque → ordem → data).
function sortPublicados(posts: BlogPost[]): BlogPost[] {
  return posts
    .filter((p) => p.status === "publicado")
    .sort(
      (a, b) =>
        Number(b.destaque ?? false) - Number(a.destaque ?? false) ||
        (a.ordem ?? 0) - (b.ordem ?? 0) ||
        (b.publicado_em ?? "").localeCompare(a.publicado_em ?? ""),
    );
}

function AdminBlogPage() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("pendente");
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [rejecting, setRejecting] = useState<BlogPost | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "blog"],
    queryFn: async () => (await listAllPosts()) as unknown as BlogPost[],
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "blog"] });
  };

  const all = useMemo(() => data ?? [], [data]);
  // Publicados na MESMA ordem do site (destaque→ordem→data). É a fonte da
  // verdade para as setas de reordenar e para o isFirst/isLast baterem com a tela.
  const pubsOrdered = useMemo(() => sortPublicados(all), [all]);
  const filtered =
    tab === "publicado" ? pubsOrdered : tab === "todos" ? all : all.filter((p) => p.status === tab);
  const pendingCount = all.filter((p) => p.status === "pendente").length;

  const handleApprove = async (post: BlogPost) => {
    try {
      await approvePost({ data: { id: post.id } });
      toast.success(`Artigo "${post.titulo}" publicado.`);
      refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao aprovar.");
    }
  };

  const handleReject = async () => {
    if (!rejecting) return;
    if (rejectReason.trim().length < 10) {
      toast.error("Motivo precisa ter no mínimo 10 caracteres.");
      return;
    }
    try {
      await rejectPost({ data: { id: rejecting.id, motivo: rejectReason.trim() } });
      toast.success("Artigo rejeitado.");
      setRejecting(null);
      setRejectReason("");
      refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao rejeitar.");
    }
  };

  const handleDelete = async (post: BlogPost) => {
    if (!confirm(`Excluir definitivamente "${post.titulo}"?`)) return;
    try {
      await deletePost({ data: { id: post.id } });
      toast.success("Artigo excluído.");
      refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao excluir.");
    }
  };

  const handleToggleDestaque = async (post: BlogPost) => {
    try {
      await setPostDestaque({ data: { id: post.id, destaque: !post.destaque } });
      toast.success(!post.destaque ? "Fixado no topo." : "Removido do topo.");
      refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao destacar.");
    }
  };

  const handleToggleVisivel = async (post: BlogPost) => {
    const ocultar = post.status === "publicado";
    try {
      await setPostVisivel({ data: { id: post.id, visivel: !ocultar } });
      toast.success(ocultar ? "Artigo ocultado do site." : "Artigo publicado no site.");
      refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao alterar visibilidade.");
    }
  };

  // Reordena dentro da lista de publicados (a ordem só vale para o site público).
  const handleMove = async (post: BlogPost, dir: -1 | 1) => {
    const idx = pubsOrdered.findIndex((p) => p.id === post.id);
    const target = idx + dir;
    if (idx < 0 || target < 0 || target >= pubsOrdered.length) return;
    const reordered = [...pubsOrdered];
    [reordered[idx], reordered[target]] = [reordered[target], reordered[idx]];
    try {
      await reorderPosts({ data: { ids: reordered.map((p) => p.id) } });
      refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao reordenar.");
    }
  };

  const tabCounts: Record<Tab, number> = {
    todos: all.length,
    pendente: all.filter((p) => p.status === "pendente").length,
    publicado: all.filter((p) => p.status === "publicado").length,
    rejeitado: all.filter((p) => p.status === "rejeitado").length,
  };

  return (
    <div>
      <PageHeader
        eyebrow="Conteúdo"
        title="Blog editorial"
        description="Modere submissões públicas e publique conteúdo técnico próprio para a comunidade veterinária."
        icon={Newspaper}
        tone="orange"
        badge={
          pendingCount > 0
            ? { label: `${pendingCount} aguardando moderação`, tone: "amber" }
            : undefined
        }
        actions={
          <Button
            onClick={() => setShowCreate(true)}
            className="gap-2 bg-conecta-orange hover:bg-conecta-orange-light text-white"
          >
            <Plus className="h-4 w-4" /> Novo artigo
          </Button>
        }
      />

      <div className="px-4 sm:px-6 md:px-10 py-5 sm:py-6 md:py-8 max-w-7xl">
        <nav className="bg-paper border border-line rounded-full p-1 mb-6 inline-flex gap-1 max-w-full overflow-x-auto">
          {(["pendente", "publicado", "rejeitado", "todos"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all capitalize inline-flex items-center gap-2 ${
                tab === t
                  ? "bg-conecta-blue text-white shadow-sm"
                  : "text-ink-soft hover:text-ink hover:bg-bone"
              }`}
            >
              {t}
              <span
                className={`text-[10px] font-mono rounded-full px-1.5 py-0.5 ${
                  tab === t ? "bg-white/20" : "bg-bone"
                }`}
              >
                {tabCounts[t]}
              </span>
            </button>
          ))}
        </nav>

        <div className="space-y-3">
          {isLoading ? (
            <div className="text-sm text-muted-foreground py-12 text-center border rounded-lg bg-background">
              Carregando…
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-sm text-muted-foreground py-12 text-center border rounded-lg bg-background">
              Nada nesta aba ainda.
            </div>
          ) : (
            filtered.map((p) => {
              const pubIdx = pubsOrdered.findIndex((x) => x.id === p.id);
              return (
                <PostRow
                  key={p.id}
                  post={p}
                  isFirst={pubIdx === 0}
                  isLast={pubIdx === pubsOrdered.length - 1}
                  onApprove={() => handleApprove(p)}
                  onReject={() => setRejecting(p)}
                  onDelete={() => handleDelete(p)}
                  onEdit={() => setEditing(p)}
                  onToggleDestaque={() => handleToggleDestaque(p)}
                  onToggleVisivel={() => handleToggleVisivel(p)}
                  onMoveUp={() => handleMove(p, -1)}
                  onMoveDown={() => handleMove(p, 1)}
                />
              );
            })
          )}
        </div>

        {showCreate && (
          <PostModal
            onClose={() => setShowCreate(false)}
            onSaved={() => {
              setShowCreate(false);
              refresh();
            }}
          />
        )}

        {editing && (
          <PostModal
            post={editing}
            onClose={() => setEditing(null)}
            onSaved={() => {
              setEditing(null);
              refresh();
            }}
          />
        )}

        {rejecting && (
          <RejectModal
            post={rejecting}
            reason={rejectReason}
            onReason={setRejectReason}
            onCancel={() => {
              setRejecting(null);
              setRejectReason("");
            }}
            onConfirm={handleReject}
          />
        )}
      </div>
    </div>
  );
}

function PostRow({
  post,
  isFirst,
  isLast,
  onApprove,
  onReject,
  onDelete,
  onEdit,
  onToggleDestaque,
  onToggleVisivel,
  onMoveUp,
  onMoveDown,
}: {
  post: BlogPost;
  isFirst: boolean;
  isLast: boolean;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onToggleDestaque: () => void;
  onToggleVisivel: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const publicado = post.status === "publicado";
  const oculto = post.status === "rascunho";
  return (
    <div className="border rounded-lg bg-background p-4 flex gap-4 items-start">
      <img
        src={post.capa_url || FALLBACK_CAPA}
        alt={post.titulo}
        className="h-20 w-28 rounded-md object-cover bg-muted shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={post.status} />
          {post.destaque && (
            <span className="inline-flex items-center gap-1 rounded-full bg-conecta-orange/15 text-conecta-orange text-[10px] font-medium px-2 py-0.5">
              <Star className="h-2.5 w-2.5 fill-current" /> Topo
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {post.origem === "publico" ? "Submetido por leitor" : "Criado pelo admin"}
          </span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">{formatDate(post.created_at)}</span>
        </div>
        <h3 className="mt-1 font-serif font-normal text-base line-clamp-1">{post.titulo}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{post.resumo}</p>
        <p className="text-xs text-muted-foreground mt-2">
          por {post.autor_nome} ({post.autor_email})
        </p>
        {post.motivo_rejeicao && (
          <p className="text-xs text-red-700 mt-2">Motivo da rejeição: {post.motivo_rejeicao}</p>
        )}
      </div>
      <div className="flex flex-col gap-2 shrink-0 items-end">
        {post.status === "pendente" && (
          <>
            <Button size="sm" onClick={onApprove} className="gap-1">
              <Check className="h-4 w-4" /> Aprovar
            </Button>
            <Button size="sm" variant="outline" onClick={onReject} className="gap-1">
              <X className="h-4 w-4" /> Rejeitar
            </Button>
          </>
        )}

        {(publicado || oculto) && (
          <div className="flex items-center gap-1">
            {publicado && (
              <>
                <IconBtn title="Mover para cima" onClick={onMoveUp} disabled={isFirst}>
                  <ArrowUp className="h-4 w-4" />
                </IconBtn>
                <IconBtn title="Mover para baixo" onClick={onMoveDown} disabled={isLast}>
                  <ArrowDown className="h-4 w-4" />
                </IconBtn>
                <IconBtn
                  title={post.destaque ? "Tirar do topo" : "Fixar no topo"}
                  onClick={onToggleDestaque}
                  active={post.destaque}
                >
                  <Star className={`h-4 w-4 ${post.destaque ? "fill-current" : ""}`} />
                </IconBtn>
              </>
            )}
            <IconBtn
              title={publicado ? "Ocultar do site" : "Publicar no site"}
              onClick={onToggleVisivel}
            >
              {publicado ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </IconBtn>
          </div>
        )}

        <div className="flex items-center gap-1">
          {post.origem === "admin" && (
            <IconBtn title="Editar" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
            </IconBtn>
          )}
          <IconBtn title="Excluir" onClick={onDelete} danger>
            <Trash2 className="h-4 w-4" />
          </IconBtn>
        </div>
      </div>
    </div>
  );
}

function IconBtn({
  children,
  title,
  onClick,
  disabled,
  active,
  danger,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className={`h-8 w-8 rounded-md flex items-center justify-center border transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
        danger
          ? "border-line text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600"
          : active
            ? "border-conecta-orange bg-conecta-orange/10 text-conecta-orange"
            : "border-line text-ink-soft hover:bg-bone hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }: { status: BlogStatus }) {
  const map: Record<BlogStatus, { label: string; cls: string }> = {
    pendente: { label: "Pendente", cls: "bg-amber-100 text-amber-900" },
    publicado: { label: "Publicado", cls: "bg-emerald-100 text-emerald-900" },
    rascunho: { label: "Rascunho", cls: "bg-slate-100 text-slate-900" },
    rejeitado: { label: "Rejeitado", cls: "bg-red-100 text-red-900" },
  };
  const v = map[status];
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${v.cls}`}>{v.label}</span>;
}

function PostModal({
  post,
  onClose,
  onSaved,
}: {
  post?: BlogPost;
  onClose: () => void;
  onSaved: () => void;
}) {
  const editando = !!post;
  const [titulo, setTitulo] = useState(post?.titulo ?? "");
  const [resumo, setResumo] = useState(post?.resumo ?? "");
  const [conteudo, setConteudo] = useState(post?.conteudo ?? "");
  const [tags, setTags] = useState((post?.tags ?? []).join(", "));
  const [capa, setCapa] = useState(post?.capa_url ?? "");
  const [videoUrl, setVideoUrl] = useState(post?.video_url ?? "");

  const [saving, setSaving] = useState(false);

  const submit = async () => {
    // Validação campo a campo com aviso específico (antes era uma mensagem
    // genérica que não dizia o que faltava). Só título e conteúdo são
    // obrigatórios; resumo é opcional.
    if (titulo.trim().length < 5) {
      toast.error("O título precisa de pelo menos 5 caracteres.");
      return;
    }
    if (conteudo.trim().length < 20) {
      toast.error("Escreva o conteúdo do artigo (mínimo 20 caracteres).");
      return;
    }
    if (resumo.trim().length > 0 && resumo.trim().length < 20) {
      toast.error("O resumo, se preenchido, precisa de pelo menos 20 caracteres.");
      return;
    }
    setSaving(true);
    try {
      await adminUpsertPost({
        data: {
          ...(editando ? { id: post!.id, slug: post!.slug } : {}),
          titulo: titulo.trim(),
          resumo: resumo.trim(),
          conteudo: conteudo.trim(),
          capa_url: capa.trim() || null,
          video_url: videoUrl.trim() || null,
          tags: tags
            .split(",")
            .map((t) => t.trim().toLowerCase())
            .filter(Boolean),
          // Ao editar, preserva o status atual (ex.: se estava oculto/rascunho
          // não republica sozinho). Post novo já nasce publicado.
          status: editando ? post!.status : "publicado",
          destaque: post?.destaque ?? false,
          ordem: post?.ordem ?? 0,
        },
      });
      toast.success(editando ? "Artigo atualizado." : "Artigo publicado.");
      onSaved();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao salvar artigo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-background border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="font-serif font-normal text-xl">
            {editando ? "Editar artigo" : "Novo artigo"}
          </h2>
          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <Field label="Título">
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="input"
              placeholder="Título do artigo"
            />
          </Field>
          <Field label="Resumo">
            <textarea
              value={resumo}
              onChange={(e) => setResumo(e.target.value)}
              rows={2}
              className="input min-h-[60px] resize-y"
              placeholder="Resumo curto"
            />
          </Field>
          <Field label="Conteúdo" hint="Use ## para subtítulos">
            <textarea
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              rows={10}
              className="input min-h-[200px] resize-y font-mono text-sm"
            />
          </Field>
          <Field label="Tags" hint="Separe por vírgula">
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="input"
              placeholder="anestesia, monitorização"
            />
          </Field>
          <Field
            label="Imagem de capa"
            hint="Imagem usada se não houver vídeo. Envie do computador ou cole uma URL."
          >
            <ImageInput value={capa} onChange={setCapa} pasta="blog" />
          </Field>
          <Field
            label="URL do vídeo YouTube"
            hint="Cole o link do YouTube (youtu.be/... ou youtube.com/watch?v=...). Se preenchido, o post abre com o vídeo em vez da capa."
          >
            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="input"
              placeholder="https://youtu.be/... (opcional)"
            />
          </Field>
        </div>
        <div className="p-6 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={submit} disabled={saving} className="gap-2">
            <FileText className="h-4 w-4" />{" "}
            {saving ? "Salvando…" : editando ? "Salvar" : "Publicar"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function RejectModal({
  post,
  reason,
  onReason,
  onCancel,
  onConfirm,
}: {
  post: BlogPost;
  reason: string;
  onReason: (v: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        className="bg-background border rounded-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b">
          <h2 className="font-serif font-normal text-xl">Rejeitar artigo</h2>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">"{post.titulo}"</p>
        </div>
        <div className="p-6">
          <Field
            label="Motivo da rejeição"
            hint="Mínimo 10 caracteres. Será enviado por email ao autor (quando o banco estiver pronto)."
          >
            <textarea
              value={reason}
              onChange={(e) => onReason(e.target.value)}
              rows={4}
              className="input min-h-[100px] resize-y"
              placeholder="Ex.: O artigo precisa de mais referências técnicas..."
            />
          </Field>
        </div>
        <div className="p-6 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={onConfirm} variant="destructive">
            Rejeitar
          </Button>
        </div>
      </div>
    </div>
  );
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
    <div>
      <label className="text-sm font-medium block mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}
