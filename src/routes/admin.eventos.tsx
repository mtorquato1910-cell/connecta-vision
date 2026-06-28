import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  Camera,
  ExternalLink,
  Eye,
  EyeOff,
  Image as ImageIcon,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/PageHeader";
import { ImageInput } from "@/components/admin/ImageInput";
import { ImagensEditor } from "@/components/admin/ImagensEditor";
import {
  listAllEventos,
  upsertEvento,
  deleteEvento,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/eventos")({
  component: AdminEventosPage,
});

type EventoFoto = { url: string; ordem: number; alt: string; caption?: string };

type Evento = {
  id: string;
  slug: string;
  nome: string;
  data_evento: string | null;
  local: string | null;
  descricao_curta: string | null;
  descricao_longa: string | null;
  capa_url: string | null;
  galeria: EventoFoto[];
  publicado: boolean;
  ordem: number;
};

type EventoInput = {
  id?: string;
  slug: string;
  nome: string;
  data_evento: string;
  local: string;
  descricao_curta: string;
  descricao_longa: string;
  capa_url: string;
  galeria: EventoFoto[];
  publicado: boolean;
  ordem?: number;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function AdminEventosPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Evento | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Evento | null>(null);

  const { data: eventos = [], isLoading } = useQuery({
    queryKey: ["admin-eventos"],
    queryFn: async () => {
      const rows = (await listAllEventos()) as any[];
      return rows.map((e) => ({
        ...e,
        galeria: Array.isArray(e.galeria) ? e.galeria : [],
      })) as Evento[];
    },
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-eventos"] });

  const saveMutation = useMutation({
    mutationFn: (payload: EventoInput) => upsertEvento({ data: payload }),
    onSuccess: (_res, payload) => {
      toast.success(payload.id ? "Evento atualizado." : "Evento criado.");
      setEditing(null);
      setCreating(false);
      invalidate();
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : "Erro ao salvar evento."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteEvento({ data: { id } }),
    onSuccess: () => {
      toast.success(`Evento "${confirmDelete?.nome}" excluído.`);
      setConfirmDelete(null);
      invalidate();
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : "Erro ao excluir."),
  });

  const togglePublicado = (e: Evento) => {
    saveMutation.mutate({
      id: e.id,
      slug: e.slug,
      nome: e.nome,
      data_evento: e.data_evento ?? "",
      local: e.local ?? "",
      descricao_curta: e.descricao_curta ?? "",
      descricao_longa: e.descricao_longa ?? "",
      capa_url: e.capa_url ?? "",
      galeria: e.galeria,
      publicado: !e.publicado,
      ordem: e.ordem,
    });
  };

  return (
    <div>
      <PageHeader
        eyebrow="Conteúdo"
        title="Galeria de eventos"
        description="Gerencie feiras, congressos e eventos onde a Conecta esteve presente. Cada evento tem capa, descrição e galeria de fotos."
        icon={Camera}
        tone="rose"
        actions={
          <Button onClick={() => setCreating(true)} className="gap-2 bg-rose-600 hover:bg-rose-700 text-white">
            <Plus className="h-4 w-4" />
            Novo evento
          </Button>
        }
      />

      <div className="px-4 sm:px-6 md:px-10 py-5 sm:py-6 md:py-8 max-w-7xl">
        <div className="text-xs text-ink-soft mb-3 px-1">
          {isLoading
            ? "Carregando…"
            : `${eventos.length} evento${eventos.length === 1 ? "" : "s"}`}
        </div>

        {eventos.length === 0 ? (
          <div className="bg-paper border border-line rounded-2xl py-16 text-center">
            <Camera className="h-10 w-10 text-ink-mute mx-auto mb-3" />
            <p className="text-ink-soft mb-4">
              {isLoading ? "Carregando eventos…" : "Nenhum evento cadastrado."}
            </p>
            {!isLoading && (
              <Button onClick={() => setCreating(true)} className="bg-rose-600 hover:bg-rose-700 text-white gap-2">
                <Plus className="h-4 w-4" /> Adicionar primeiro evento
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {eventos.map((ev) => (
              <EventoRow
                key={ev.id}
                ev={ev}
                onEdit={() => setEditing(ev)}
                onDelete={() => setConfirmDelete(ev)}
                onTogglePublicado={() => togglePublicado(ev)}
              />
            ))}
          </div>
        )}
      </div>

      {(editing || creating) && (
        <EventoForm
          evento={editing}
          existing={eventos}
          saving={saveMutation.isPending}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSave={(input) => saveMutation.mutate(input)}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Excluir evento"
          message={`Tem certeza que quer excluir "${confirmDelete.nome}"? Todas as fotos da galeria também serão removidas. Esta ação não pode ser desfeita.`}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() => deleteMutation.mutate(confirmDelete.id)}
        />
      )}
    </div>
  );
}

// ─── Componentes ────────────────────────────────────────────

function EventoRow({
  ev,
  onEdit,
  onDelete,
  onTogglePublicado,
}: {
  ev: Evento;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePublicado: () => void;
}) {
  return (
    <div className="bg-paper border border-line rounded-2xl overflow-hidden flex flex-col md:flex-row hover:border-rose-300 transition-colors">
      <img
        src={ev.capa_url ?? ""}
        alt={ev.nome}
        className="h-48 md:h-auto md:w-64 object-cover bg-bone shrink-0"
      />
      <div className="p-5 flex-1 min-w-0 flex flex-col">
        <div className="flex items-center gap-2 text-xs text-ink-soft mb-2 flex-wrap">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {ev.data_evento
              ? new Date(ev.data_evento).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "Sem data"}
          </span>
          <span>·</span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {ev.local}
          </span>
          <span>·</span>
          <span className="inline-flex items-center gap-1">
            <ImageIcon className="h-3 w-3" />
            {ev.galeria.length} foto{ev.galeria.length === 1 ? "" : "s"}
          </span>
          {!ev.publicado && (
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-700 bg-slate-100 rounded-full px-2 py-0.5">
              Rascunho
            </span>
          )}
        </div>
        <h3 className="font-serif font-normal text-xl text-ink line-clamp-1">{ev.nome}</h3>
        <p className="text-sm text-ink-soft mt-1 line-clamp-2 flex-1">{ev.descricao_curta}</p>
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <a
            href={`/eventos/${ev.slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-conecta-blue hover:underline"
          >
            Ver no site <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <span className="text-ink-mute">·</span>
          <button
            onClick={onTogglePublicado}
            className={`inline-flex items-center gap-1.5 text-sm hover:underline ${
              ev.publicado ? "text-emerald-700" : "text-slate-500"
            }`}
          >
            {ev.publicado ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            {ev.publicado ? "Publicado" : "Despublicado"}
          </button>
          <span className="text-ink-mute">·</span>
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-conecta-blue hover:underline"
          >
            <Pencil className="h-3.5 w-3.5" /> Editar
          </button>
          <span className="text-ink-mute">·</span>
          <button
            onClick={onDelete}
            className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:underline"
          >
            <Trash2 className="h-3.5 w-3.5" /> Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Form ───────────────────────────────────────────────────

function EventoForm({
  evento,
  existing,
  saving,
  onClose,
  onSave,
}: {
  evento: Evento | null;
  existing: Evento[];
  saving: boolean;
  onClose: () => void;
  onSave: (input: EventoInput) => void;
}) {
  const editing = !!evento;

  const [nome, setNome] = useState(evento?.nome ?? "");
  const [dataEvento, setDataEvento] = useState(
    evento?.data_evento ?? new Date().toISOString().slice(0, 10),
  );
  const [local, setLocal] = useState(evento?.local ?? "");
  const [descricaoCurta, setDescricaoCurta] = useState(evento?.descricao_curta ?? "");
  const [descricaoLonga, setDescricaoLonga] = useState(evento?.descricao_longa ?? "");
  const [capaUrl, setCapaUrl] = useState(evento?.capa_url ?? "");
  const [galeriaUrls, setGaleriaUrls] = useState<string[]>(
    evento?.galeria?.map((g) => g.url).filter(Boolean) ?? [],
  );
  const [publicado, setPublicado] = useState(evento?.publicado ?? true);

  const ensureUniqueSlug = (base: string): string => {
    let slug = base || "evento";
    let i = 1;
    while (existing.some((e) => e.slug === slug && e.id !== evento?.id)) {
      i++;
      slug = `${base}-${i}`;
    }
    return slug;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      toast.error("Nome do evento é obrigatório.");
      return;
    }
    if (!dataEvento) {
      toast.error("Data do evento é obrigatória.");
      return;
    }
    if (!local.trim()) {
      toast.error("Local do evento é obrigatório.");
      return;
    }
    const galeria = galeriaUrls.map((url, i) => ({
      url,
      ordem: i,
      alt: `${nome.trim()} — foto ${i + 1}`,
    }));
    // slug: mantém o existente ao editar (onConflict: "slug"), gera ao criar.
    const slug = evento?.slug || ensureUniqueSlug(slugify(nome));
    onSave({
      id: evento?.id,
      slug,
      nome: nome.trim(),
      data_evento: dataEvento,
      local: local.trim(),
      descricao_curta: descricaoCurta.trim(),
      descricao_longa: descricaoLonga.trim() || descricaoCurta.trim(),
      capa_url: capaUrl.trim() || galeriaUrls[0] || "",
      galeria,
      publicado,
      ordem: evento?.ordem,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-paper rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="sticky top-0 z-10 bg-paper border-b border-line px-5 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-ink-soft font-mono">
              {editing ? "Editar evento" : "Novo evento"}
            </div>
            <h2 className="font-serif text-xl text-ink mt-0.5">
              {editing ? evento?.nome : "Cadastrar evento"}
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
          <Field label="Nome do evento *">
            <input
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Pet South America 2026"
              className="input"
            />
          </Field>

          <Grid>
            <Field label="Data *">
              <input
                required
                type="date"
                value={dataEvento}
                onChange={(e) => setDataEvento(e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Local *">
              <input
                required
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                placeholder="Expo Center Norte — São Paulo/SP"
                className="input"
              />
            </Field>
          </Grid>

          <Field label="Descrição curta" hint="Aparece nos cards (~150 chars).">
            <textarea
              value={descricaoCurta}
              onChange={(e) => setDescricaoCurta(e.target.value)}
              rows={2}
              maxLength={200}
              className="input min-h-[60px] resize-y"
            />
          </Field>

          <Field label="Descrição longa" hint="Aparece na página de detalhe do evento.">
            <textarea
              value={descricaoLonga}
              onChange={(e) => setDescricaoLonga(e.target.value)}
              rows={5}
              className="input min-h-[120px] resize-y"
            />
          </Field>

          <Field label="Imagem de capa *" hint="Envie do computador ou cole uma URL.">
            <ImageInput value={capaUrl} onChange={setCapaUrl} />
          </Field>

          <Field
            label="Galeria de fotos"
            hint="Adicione múltiplas imagens. A primeira é a destaque da galeria."
          >
            <ImagensEditor
              capa={galeriaUrls[0] ?? ""}
              galeria={galeriaUrls.slice(1)}
              onChange={({ capa, galeria }) =>
                setGaleriaUrls(capa ? [capa, ...galeria] : galeria)
              }
            />
          </Field>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={publicado}
              onChange={(e) => setPublicado(e.target.checked)}
              className="h-4 w-4 accent-rose-600"
            />
            <span className="text-sm text-ink">Publicar no site</span>
          </label>
        </form>

        <footer className="sticky bottom-0 bg-paper border-t border-line px-5 sm:px-6 py-3 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={saving} className="bg-rose-600 hover:bg-rose-700 text-white">
            {saving ? "Salvando…" : editing ? "Salvar alterações" : "Criar evento"}
          </Button>
        </footer>
      </div>
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
