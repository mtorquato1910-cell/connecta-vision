import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, Clock, FileText, Newspaper, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import {
  adminCreatePost,
  approvePost,
  deletePost,
  formatDate,
  getAllPosts,
  rejectPost,
  type BlogPost,
  type BlogStatus,
} from "@/lib/blog-data";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/PageHeader";

export const Route = createFileRoute("/admin/blog")({
  component: AdminBlogPage,
});

type Tab = "todos" | "pendente" | "publicado" | "rejeitado";

function AdminBlogPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [tab, setTab] = useState<Tab>("pendente");
  const [showCreate, setShowCreate] = useState(false);
  const [rejecting, setRejecting] = useState<BlogPost | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const refresh = () => setRefreshKey((k) => k + 1);

  const all = useMemo(() => getAllPosts(), [refreshKey]);
  const filtered = tab === "todos" ? all : all.filter((p) => p.status === tab);
  const pendingCount = all.filter((p) => p.status === "pendente").length;

  const handleApprove = (post: BlogPost) => {
    approvePost(post.id);
    toast.success(`Artigo "${post.titulo}" publicado.`);
    refresh();
  };

  const handleReject = () => {
    if (!rejecting) return;
    if (rejectReason.trim().length < 10) {
      toast.error("Motivo precisa ter no mínimo 10 caracteres.");
      return;
    }
    rejectPost(rejecting.id, rejectReason.trim());
    toast.success("Artigo rejeitado.");
    setRejecting(null);
    setRejectReason("");
    refresh();
  };

  const handleDelete = (post: BlogPost) => {
    if (!confirm(`Excluir definitivamente "${post.titulo}"?`)) return;
    deletePost(post.id);
    toast.success("Artigo excluído.");
    refresh();
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
          <Button onClick={() => setShowCreate(true)} className="gap-2 bg-conecta-orange hover:bg-conecta-orange-light text-white">
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
        {filtered.length === 0 ? (
          <div className="text-sm text-muted-foreground py-12 text-center border rounded-lg bg-background">
            Nada nesta aba ainda.
          </div>
        ) : (
          filtered.map((p) => (
            <PostRow
              key={p.id}
              post={p}
              onApprove={() => handleApprove(p)}
              onReject={() => setRejecting(p)}
              onDelete={() => handleDelete(p)}
            />
          ))
        )}
      </div>

      {showCreate && (
        <CreateModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
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
  onApprove,
  onReject,
  onDelete,
}: {
  post: BlogPost;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="border rounded-lg bg-background p-4 flex gap-4 items-start">
      <img
        src={post.capa_url}
        alt={post.titulo}
        className="h-20 w-28 rounded-md object-cover bg-muted shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={post.status} />
          <span className="text-xs text-muted-foreground">
            {post.origem === "publico" ? "Submetido por leitor" : "Criado pelo admin"}
          </span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">
            {formatDate(post.criado_em)}
          </span>
        </div>
        <h3 className="mt-1 font-serif font-normal text-base line-clamp-1">{post.titulo}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {post.resumo}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          por {post.autor_nome} ({post.autor_email})
        </p>
        {post.motivo_rejeicao && (
          <p className="text-xs text-red-700 mt-2">
            Motivo da rejeição: {post.motivo_rejeicao}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2 shrink-0">
        {post.status === "pendente" && (
          <>
            <Button size="sm" onClick={onApprove} className="gap-1">
              <Check className="h-4 w-4" /> Aprovar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onReject}
              className="gap-1"
            >
              <X className="h-4 w-4" /> Rejeitar
            </Button>
          </>
        )}
        <Button
          size="sm"
          variant="ghost"
          onClick={onDelete}
          className="gap-1 text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
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
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${v.cls}`}>
      {v.label}
    </span>
  );
}

function CreateModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [titulo, setTitulo] = useState("");
  const [resumo, setResumo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [tags, setTags] = useState("");
  const [capa, setCapa] = useState("");

  const submit = () => {
    if (titulo.length < 10 || resumo.length < 30 || conteudo.length < 100) {
      toast.error("Preencha todos os campos com tamanhos mínimos.");
      return;
    }
    adminCreatePost({
      titulo: titulo.trim(),
      resumo: resumo.trim(),
      conteudo: conteudo.trim(),
      capa_url: capa.trim() || undefined,
      tags: tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
    });
    toast.success("Artigo publicado.");
    onCreated();
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
          <h2 className="font-serif font-normal text-xl">Novo artigo</h2>
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
          <Field label="URL da capa">
            <input
              value={capa}
              onChange={(e) => setCapa(e.target.value)}
              className="input"
              placeholder="https://... (opcional)"
            />
          </Field>
        </div>
        <div className="p-6 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={submit} className="gap-2">
            <FileText className="h-4 w-4" /> Publicar
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
          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
            "{post.titulo}"
          </p>
        </div>
        <div className="p-6">
          <Field label="Motivo da rejeição" hint="Mínimo 10 caracteres. Será enviado por email ao autor (quando o banco estiver pronto).">
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
