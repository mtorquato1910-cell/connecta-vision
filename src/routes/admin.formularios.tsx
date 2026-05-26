import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Calendar,
  ExternalLink,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Search,
  Trash2,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  getAll as getAllFormularios,
  remove as removeFormulario,
  STATUS_COLORS,
  STATUS_LABELS,
  TIPO_LABELS,
  updateNotas,
  updateStatus,
  type Formulario,
  type FormularioStatus,
  type FormularioTipo,
} from "@/lib/admin-formularios-repo";

export const Route = createFileRoute("/admin/formularios")({
  component: AdminFormulariosPage,
});

const STATUS_ORDER: FormularioStatus[] = [
  "novo",
  "em_contato",
  "qualificado",
  "convertido",
  "perdido",
];
const TIPOS: FormularioTipo[] = ["contato", "orcamento_geral", "orcamento_produto"];

function AdminFormulariosPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FormularioStatus | "all">("all");
  const [tipoFilter, setTipoFilter] = useState<FormularioTipo | "all">("all");
  const [selected, setSelected] = useState<Formulario | null>(null);

  const refresh = () => setRefreshKey((k) => k + 1);

  const all = useMemo(() => getAllFormularios(), [refreshKey]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: all.length };
    STATUS_ORDER.forEach((s) => {
      c[s] = all.filter((f) => f.status === s).length;
    });
    return c;
  }, [all]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return all.filter((f) => {
      if (statusFilter !== "all" && f.status !== statusFilter) return false;
      if (tipoFilter !== "all" && f.tipo !== tipoFilter) return false;
      if (!term) return true;
      return (
        f.nome.toLowerCase().includes(term) ||
        f.email.toLowerCase().includes(term) ||
        (f.whatsapp ?? "").toLowerCase().includes(term) ||
        (f.nome_estabelecimento ?? "").toLowerCase().includes(term) ||
        (f.cidade ?? "").toLowerCase().includes(term) ||
        f.mensagem.toLowerCase().includes(term)
      );
    });
  }, [all, search, statusFilter, tipoFilter]);

  return (
    <div>
      <PageHeader
        eyebrow="Mensagens"
        title="Formulários"
        description="Todas as mensagens enviadas pelos formulários do site (contato, orçamento geral e por produto)."
        icon={MessageSquare}
        tone="amber"
        badge={
          counts.novo > 0
            ? { label: `${counts.novo} ${counts.novo === 1 ? "novo" : "novos"}`, tone: "blue" }
            : undefined
        }
      />

      <div className="px-4 sm:px-6 md:px-10 py-5 sm:py-6 md:py-8 max-w-7xl">
        {/* Filtros */}
        <div className="bg-paper border border-line rounded-2xl p-4 mb-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-mute" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, email, WhatsApp, clínica, cidade..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-line focus:border-conecta-blue outline-none transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterPill
              active={statusFilter === "all"}
              onClick={() => setStatusFilter("all")}
              count={counts.all}
            >
              Todos
            </FilterPill>
            {STATUS_ORDER.map((s) => (
              <FilterPill
                key={s}
                active={statusFilter === s}
                onClick={() => setStatusFilter(s)}
                count={counts[s]}
                tone={s}
              >
                {STATUS_LABELS[s]}
              </FilterPill>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs uppercase tracking-wider text-ink-soft font-mono mr-2">
              Tipo:
            </span>
            <FilterPill
              active={tipoFilter === "all"}
              onClick={() => setTipoFilter("all")}
              small
            >
              Todos
            </FilterPill>
            {TIPOS.map((t) => (
              <FilterPill
                key={t}
                active={tipoFilter === t}
                onClick={() => setTipoFilter(t)}
                small
              >
                {TIPO_LABELS[t]}
              </FilterPill>
            ))}
          </div>
        </div>

        {/* Lista */}
        <div className="text-xs text-ink-soft mb-3 px-1">
          {filtered.length} {filtered.length === 1 ? "mensagem" : "mensagens"}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-paper border border-line rounded-2xl py-16 text-center text-ink-soft">
            Nenhuma mensagem com esses filtros.
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((f) => (
              <FormularioRow key={f.id} f={f} onSelect={() => setSelected(f)} />
            ))}
          </div>
        )}
      </div>

      {selected && (
        <FormularioDrawer
          formulario={selected}
          onClose={() => setSelected(null)}
          onChange={refresh}
        />
      )}
    </div>
  );
}

// ─── Componentes ──────────────────────────────────────────────

function FilterPill({
  children,
  active,
  onClick,
  count,
  tone,
  small,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  count?: number;
  tone?: FormularioStatus;
  small?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full transition-all inline-flex items-center gap-2 ${
        small ? "px-3 py-1 text-xs" : "px-3.5 py-1.5 text-sm"
      } ${
        active
          ? tone
            ? `${STATUS_COLORS[tone]} ring-2 ring-current/30`
            : "bg-conecta-blue text-white"
          : "bg-paper border border-line text-ink-soft hover:text-ink hover:border-ink"
      }`}
    >
      {children}
      {count !== undefined && (
        <span
          className={`text-[10px] font-mono rounded-full px-1.5 py-0.5 ${
            active && !tone ? "bg-white/20" : "bg-bone"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function FormularioRow({ f, onSelect }: { f: Formulario; onSelect: () => void }) {
  const date = new Date(f.criado_em);
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left bg-paper border rounded-xl p-3 sm:p-4 hover:border-conecta-blue/30 transition-colors ${
        f.status === "novo" ? "border-blue-200 bg-blue-50/30" : "border-line"
      }`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-conecta-blue to-conecta-blue-deep text-white flex items-center justify-center font-mono text-xs font-semibold shrink-0">
          {f.nome
            .split(" ")
            .map((p) => p[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-serif font-normal text-base text-ink truncate">{f.nome}</h3>
            <span
              className={`text-[10px] font-medium uppercase tracking-wider rounded-full px-2 py-0.5 ${STATUS_COLORS[f.status]}`}
            >
              {STATUS_LABELS[f.status]}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-ink-mute font-mono">
              {TIPO_LABELS[f.tipo]}
            </span>
          </div>
          {f.produto_modelo && (
            <p className="text-xs text-conecta-orange font-mono mt-0.5">
              Sobre {f.produto_modelo}
            </p>
          )}
          <p className="text-sm text-ink-soft line-clamp-1 mt-1">{f.mensagem}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-ink-mute flex-wrap">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {date.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
              })}{" "}
              · {date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
            </span>
            {f.cidade && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {f.cidade}/{f.estado}
              </span>
            )}
            {f.nome_estabelecimento && (
              <span className="truncate max-w-[200px]">· {f.nome_estabelecimento}</span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

function FormularioDrawer({
  formulario,
  onClose,
  onChange,
}: {
  formulario: Formulario;
  onClose: () => void;
  onChange: () => void;
}) {
  const [notas, setNotas] = useState(formulario.notas_internas ?? "");
  const [notasDirty, setNotasDirty] = useState(false);

  const handleStatusChange = (status: FormularioStatus) => {
    updateStatus(formulario.id, status);
    toast.success(`Status alterado para "${STATUS_LABELS[status]}".`);
    onChange();
  };

  const handleSaveNotas = () => {
    updateNotas(formulario.id, notas);
    toast.success("Notas salvas.");
    setNotasDirty(false);
    onChange();
  };

  const handleDelete = () => {
    if (!confirm(`Excluir mensagem de ${formulario.nome}? Esta ação não pode ser desfeita.`)) {
      return;
    }
    removeFormulario(formulario.id);
    toast.success("Mensagem excluída.");
    onChange();
    onClose();
  };

  const waText = `Olá ${formulario.nome.split(" ")[0]}, sou da Conecta Equipamentos Veterinários. Recebi sua mensagem${formulario.produto_modelo ? ` sobre o ${formulario.produto_modelo}` : ""} e estou retornando.`;
  const waUrl = formulario.whatsapp
    ? `https://wa.me/55${formulario.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(waText)}`
    : null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-stretch justify-end"
      onClick={onClose}
    >
      <div
        className="bg-paper w-full sm:max-w-xl h-full overflow-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="sticky top-0 z-10 bg-paper border-b border-line px-5 sm:px-6 py-4 flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.2em] text-ink-soft font-mono">
              {TIPO_LABELS[formulario.tipo]} ·{" "}
              {new Date(formulario.criado_em).toLocaleDateString("pt-BR")}
            </div>
            <h2 className="font-serif text-xl text-ink mt-0.5 truncate">{formulario.nome}</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="h-9 w-9 rounded-md text-ink-soft hover:text-ink hover:bg-bone flex items-center justify-center shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="px-5 sm:px-6 py-5 space-y-6 flex-1">
          {/* Status */}
          <Section title="Status">
            <div className="flex flex-wrap gap-2">
              {STATUS_ORDER.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`text-xs font-medium uppercase tracking-wider rounded-full px-3 py-1.5 transition-all ${
                    formulario.status === s
                      ? `${STATUS_COLORS[s]} ring-2 ring-current/30`
                      : "bg-bone text-ink-soft hover:text-ink"
                  }`}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </Section>

          {/* Contato */}
          <Section title="Contato">
            <Row icon={User} label="Nome" value={formulario.nome} />
            <Row icon={Mail} label="E-mail" value={formulario.email} href={`mailto:${formulario.email}`} />
            {formulario.whatsapp && (
              <Row icon={Phone} label="WhatsApp" value={formulario.whatsapp} />
            )}
            {formulario.telefone && <Row icon={Phone} label="Telefone" value={formulario.telefone} />}
            {formulario.cidade && (
              <Row
                icon={MapPin}
                label="Localização"
                value={`${formulario.cidade}/${formulario.estado}`}
              />
            )}
          </Section>

          {/* Estabelecimento */}
          {(formulario.nome_estabelecimento || formulario.tipo_estabelecimento) && (
            <Section title="Estabelecimento">
              {formulario.nome_estabelecimento && (
                <Row label="Nome" value={formulario.nome_estabelecimento} />
              )}
              {formulario.tipo_estabelecimento && (
                <Row label="Tipo" value={formulario.tipo_estabelecimento} />
              )}
              {formulario.cargo && <Row label="Cargo" value={formulario.cargo} />}
            </Section>
          )}

          {/* Produto */}
          {formulario.produto_modelo && (
            <Section title="Produto de interesse">
              <div className="bg-conecta-orange/5 border border-conecta-orange/20 rounded-xl px-4 py-3">
                <p className="font-mono text-xs uppercase tracking-wider text-conecta-orange">
                  {formulario.produto_modelo}
                </p>
                <p className="text-sm text-ink mt-0.5">{formulario.produto_nome}</p>
                {formulario.produto_id && (
                  <a
                    href={`/produtos/${formulario.produto_id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-conecta-blue hover:underline mt-2"
                  >
                    Ver produto no site <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </Section>
          )}

          {/* Mensagem */}
          <Section title="Mensagem">
            <div className="bg-bone/60 border border-line rounded-xl px-4 py-3 text-sm text-ink leading-relaxed whitespace-pre-wrap">
              {formulario.mensagem}
            </div>
          </Section>

          {/* Notas internas */}
          <Section title="Notas internas (privadas)">
            <textarea
              value={notas}
              onChange={(e) => {
                setNotas(e.target.value);
                setNotasDirty(true);
              }}
              rows={4}
              placeholder="Anote ações tomadas, próximos passos, observações..."
              className="input min-h-[100px] resize-y"
            />
            {notasDirty && (
              <Button
                onClick={handleSaveNotas}
                size="sm"
                className="mt-2 bg-conecta-blue hover:bg-conecta-blue-deep text-white"
              >
                Salvar notas
              </Button>
            )}
          </Section>

          {/* Metadados */}
          <Section title="Origem">
            <Row label="Origem" value={formulario.origem_pagina} />
            <Row
              label="Recebido em"
              value={new Date(formulario.criado_em).toLocaleString("pt-BR")}
            />
          </Section>
        </div>

        {/* Footer com ações */}
        <footer className="sticky bottom-0 bg-paper border-t border-line px-5 sm:px-6 py-3 flex justify-between gap-2">
          <Button
            variant="outline"
            onClick={handleDelete}
            className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Excluir</span>
          </Button>
          <div className="flex gap-2">
            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-[#25D366] hover:bg-[#1eb858] text-white text-sm font-medium px-4 py-2 transition-colors"
              >
                <Phone className="h-4 w-4" />
                Abrir WhatsApp
              </a>
            )}
            <a
              href={`mailto:${formulario.email}`}
              className="inline-flex items-center gap-2 rounded-md bg-conecta-blue hover:bg-conecta-blue-deep text-white text-sm font-medium px-4 py-2 transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Responder</span>
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft mb-2">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function Row({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex items-start gap-3 text-sm">
      {Icon && <Icon className="h-4 w-4 text-ink-mute mt-0.5 shrink-0" />}
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wider text-ink-mute font-mono">
          {label}
        </div>
        {href ? (
          <a
            href={href}
            className="text-ink hover:text-conecta-blue hover:underline break-all"
          >
            {value}
          </a>
        ) : (
          <div className="text-ink break-all">{value}</div>
        )}
      </div>
    </div>
  );
}
