import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Calendar,
  Check,
  ExternalLink,
  LayoutGrid,
  List,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Plus,
  Search,
  Trash2,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  TIPO_LABELS,
  type Formulario,
  type FormularioTipo,
} from "@/lib/admin-formularios-repo";
import {
  listFormularios,
  updateFormulario,
  deleteFormulario,
  listPipelines,
  upsertPipeline,
  deletePipeline,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/formularios")({
  component: AdminFormulariosPage,
});

const TIPOS: FormularioTipo[] = [
  "contato",
  "orcamento_geral",
  "orcamento_produto",
  "orcamento_lp",
];

/** Uma etapa do funil (coluna do Kanban), lida da tabela `pipelines`. */
type Pipeline = {
  id: string;
  chave: string;
  nome: string;
  ordem: number;
  cor: string;
};

const CORES_PIPELINE = ["blue", "amber", "violet", "green", "rose", "slate"] as const;
type CorPipeline = (typeof CORES_PIPELINE)[number];

/** Classes Tailwind por cor (selo/badge da etapa). */
const COR_BADGE: Record<string, string> = {
  blue: "bg-blue-100 text-blue-900",
  amber: "bg-amber-100 text-amber-900",
  violet: "bg-violet-100 text-violet-900",
  green: "bg-emerald-100 text-emerald-900",
  rose: "bg-rose-100 text-rose-900",
  slate: "bg-slate-100 text-slate-700",
};

/** Cor da faixa no topo da coluna. */
const COR_FAIXA: Record<string, string> = {
  blue: "bg-blue-400",
  amber: "bg-amber-400",
  violet: "bg-violet-400",
  green: "bg-emerald-400",
  rose: "bg-rose-400",
  slate: "bg-slate-400",
};

function corValida(c: string): CorPipeline {
  return (CORES_PIPELINE as readonly string[]).includes(c) ? (c as CorPipeline) : "slate";
}

/**
 * Converte uma linha do Supabase (formularios + payload jsonb) no shape da UI.
 * O `status` agora é dinâmico, aceita qualquer `chave` de pipeline.
 */
function mapRow(r: Record<string, any>): Formulario {
  const p = (r.payload ?? {}) as Record<string, any>;
  const tipo: FormularioTipo = (
    ["contato", "orcamento_geral", "orcamento_produto", "orcamento_lp"] as const
  ).includes(r.tipo)
    ? r.tipo
    : "contato";

  let mensagem = String(r.mensagem ?? "").trim();
  if (!mensagem) {
    const parts: string[] = [];
    if (Array.isArray(p.itens) && p.itens.length) parts.push(`Itens: ${p.itens.join(", ")}`);
    if (p.volume) parts.push(`Volume: ${p.volume}`);
    if (p.prazo) parts.push(`Prazo: ${p.prazo}`);
    if (p.line_name) parts.push(`Linha: ${p.line_name}`);
    mensagem = parts.join(" · ") || ", ";
  }

  return {
    id: r.id,
    tipo,
    nome: r.nome ?? "",
    email: r.email ?? "",
    whatsapp: r.telefone ?? p.whatsapp ?? null,
    telefone: r.telefone ?? null,
    tipo_estabelecimento: p.tipo_estabelecimento ?? null,
    nome_estabelecimento: r.empresa ?? p.nome_estabelecimento ?? null,
    cidade: r.cidade ?? null,
    estado: p.estado ?? null,
    cargo: p.cargo ?? p.funcao ?? null,
    produto_id: p.produto_id ?? null,
    produto_modelo: p.produto_modelo ?? null,
    produto_nome: p.produto_nome ?? null,
    mensagem,
    // status dinâmico: guarda a `chave` crua do banco (string).
    status: String(r.status ?? "novo") as Formulario["status"],
    notas_internas: p.notas_internas ?? null,
    origem_pagina: r.origem ?? "/",
    criado_em: r.created_at ?? new Date().toISOString(),
  };
}

function AdminFormulariosPage() {
  const [all, setAll] = useState<Formulario[]>([]);
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tipoFilter, setTipoFilter] = useState<FormularioTipo | "all">("all");
  const [selected, setSelected] = useState<Formulario | null>(null);
  const [view, setView] = useState<"board" | "list">("board");

  const refreshLeads = useCallback(() => {
    return listFormularios()
      .then((rows) => setAll((rows as Record<string, any>[]).map(mapRow)))
      .catch((e) =>
        toast.error(e instanceof Error ? e.message : "Erro ao carregar leads."),
      );
  }, []);

  const refreshPipelines = useCallback(() => {
    return listPipelines()
      .then((rows) => setPipelines(rows as unknown as Pipeline[]))
      .catch((e) =>
        toast.error(e instanceof Error ? e.message : "Erro ao carregar etapas."),
      );
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([refreshLeads(), refreshPipelines()]).finally(() => setLoading(false));
  }, [refreshLeads, refreshPipelines]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: all.length };
    for (const pl of pipelines) c[pl.chave] = 0;
    for (const f of all) {
      c[f.status] = (c[f.status] ?? 0) + 1;
    }
    return c;
  }, [all, pipelines]);

  const novosCount = useMemo(
    () => all.filter((f) => f.status === "novo").length,
    [all],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return all.filter((f) => {
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
  }, [all, search, tipoFilter]);

  /** Coluna padrão (primeira pipeline) para leads cujo status não casa nenhuma. */
  const primeiraChave = pipelines[0]?.chave ?? "novo";

  /** Move um lead para uma etapa (otimista + servidor). */
  const moveLead = useCallback(
    async (lead: Formulario, destino: Pipeline) => {
      if (lead.status === destino.chave) return;
      const anterior = lead.status;
      // Atualização otimista do estado local.
      setAll((prev) =>
        prev.map((f) =>
          f.id === lead.id ? { ...f, status: destino.chave as Formulario["status"] } : f,
        ),
      );
      try {
        await updateFormulario({ data: { id: lead.id, status: destino.chave } });
        toast.success(`Lead movido para "${destino.nome}".`);
      } catch (e) {
        // Reverte em caso de erro.
        setAll((prev) =>
          prev.map((f) => (f.id === lead.id ? { ...f, status: anterior } : f)),
        );
        toast.error(e instanceof Error ? e.message : "Erro ao mover lead.");
      }
    },
    [],
  );

  /** Renomeia uma etapa inline. */
  const renamePipeline = useCallback(
    async (pl: Pipeline, nome: string) => {
      const novo = nome.trim();
      if (!novo || novo === pl.nome) return;
      setPipelines((prev) => prev.map((p) => (p.id === pl.id ? { ...p, nome: novo } : p)));
      try {
        await upsertPipeline({
          data: { id: pl.id, chave: pl.chave, nome: novo, ordem: pl.ordem, cor: corValida(pl.cor) },
        });
        toast.success("Etapa renomeada.");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Erro ao renomear etapa.");
        refreshPipelines();
      }
    },
    [refreshPipelines],
  );

  /** Troca a cor de uma etapa. */
  const changeCor = useCallback(
    async (pl: Pipeline, cor: CorPipeline) => {
      setPipelines((prev) => prev.map((p) => (p.id === pl.id ? { ...p, cor } : p)));
      try {
        await upsertPipeline({
          data: { id: pl.id, chave: pl.chave, nome: pl.nome, ordem: pl.ordem, cor },
        });
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Erro ao salvar cor.");
        refreshPipelines();
      }
    },
    [refreshPipelines],
  );

  /** Cria uma nova etapa no fim do funil. */
  const addPipeline = useCallback(async () => {
    const nome = window.prompt("Nome da nova etapa do funil:");
    if (!nome || !nome.trim()) return;
    try {
      await upsertPipeline({ data: { nome: nome.trim(), cor: "slate" } });
      toast.success("Etapa criada.");
      await refreshPipelines();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao criar etapa.");
    }
  }, [refreshPipelines]);

  /** Exclui uma etapa, reatribuindo os leads dela para a primeira etapa. */
  const removePipeline = useCallback(
    async (pl: Pipeline) => {
      const qtd = counts[pl.chave] ?? 0;
      const msg =
        qtd > 0
          ? `Excluir a etapa "${pl.nome}"? Os ${qtd} ${qtd === 1 ? "lead será movido" : "leads serão movidos"} para a primeira etapa.`
          : `Excluir a etapa "${pl.nome}"?`;
      if (!window.confirm(msg)) return;
      try {
        const res = (await deletePipeline({ data: { id: pl.id } })) as {
          reatribuidos?: number;
        };
        const n = res?.reatribuidos ?? 0;
        toast.success(
          n > 0
            ? `Etapa excluída, ${n} ${n === 1 ? "lead reatribuído" : "leads reatribuídos"}.`
            : "Etapa excluída.",
        );
        await Promise.all([refreshPipelines(), refreshLeads()]);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Erro ao excluir etapa.");
      }
    },
    [counts, refreshPipelines, refreshLeads],
  );

  return (
    <div>
      <PageHeader
        eyebrow="Comercial"
        title="Funil de vendas"
        description="Arraste os leads entre as etapas do funil. As colunas são suas etapas, personalize nome, cor e crie novas conforme seu processo comercial."
        icon={MessageSquare}
        tone="amber"
        badge={
          novosCount > 0
            ? { label: `${novosCount} ${novosCount === 1 ? "novo" : "novos"}`, tone: "blue" }
            : undefined
        }
      />

      <div className="px-4 sm:px-6 md:px-10 py-5 sm:py-6 md:py-8">
        {/* Barra de busca + toggle de visão */}
        <div className="bg-paper border border-line rounded-2xl p-4 mb-6 space-y-3 max-w-5xl">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-mute" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nome, email, WhatsApp, clínica, cidade..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-line focus:border-conecta-blue outline-none transition-colors"
              />
            </div>
            <div className="inline-flex rounded-lg border border-line overflow-hidden shrink-0">
              <button
                onClick={() => setView("board")}
                aria-pressed={view === "board"}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm transition-colors ${
                  view === "board"
                    ? "bg-conecta-blue text-white"
                    : "bg-paper text-ink-soft hover:text-ink"
                }`}
              >
                <LayoutGrid className="h-4 w-4" /> Quadro
              </button>
              <button
                onClick={() => setView("list")}
                aria-pressed={view === "list"}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm transition-colors ${
                  view === "list"
                    ? "bg-conecta-blue text-white"
                    : "bg-paper text-ink-soft hover:text-ink"
                }`}
              >
                <List className="h-4 w-4" /> Lista
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs uppercase tracking-wider text-ink-soft font-mono mr-2">
              Tipo:
            </span>
            <FilterPill active={tipoFilter === "all"} onClick={() => setTipoFilter("all")} small>
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

        {loading ? (
          <div className="text-xs text-ink-soft px-1">Carregando…</div>
        ) : view === "board" ? (
          <KanbanBoard
            pipelines={pipelines}
            leads={filtered}
            counts={counts}
            onSelect={setSelected}
            onMove={moveLead}
            onRename={renamePipeline}
            onChangeCor={changeCor}
            onRemove={removePipeline}
            onAdd={addPipeline}
          />
        ) : (
          <ListView leads={filtered} pipelines={pipelines} onSelect={setSelected} />
        )}
      </div>

      {selected && (
        <FormularioDrawer
          formulario={selected}
          pipelines={pipelines}
          primeiraChave={primeiraChave}
          onClose={() => setSelected(null)}
          onChanged={() => {
            refreshLeads();
          }}
          onMove={moveLead}
        />
      )}
    </div>
  );
}

// ─── Kanban ────────────────────────────────────────────────────

function KanbanBoard({
  pipelines,
  leads,
  counts,
  onSelect,
  onMove,
  onRename,
  onChangeCor,
  onRemove,
  onAdd,
}: {
  pipelines: Pipeline[];
  leads: Formulario[];
  counts: Record<string, number>;
  onSelect: (f: Formulario) => void;
  onMove: (lead: Formulario, destino: Pipeline) => void;
  onRename: (pl: Pipeline, nome: string) => void;
  onChangeCor: (pl: Pipeline, cor: CorPipeline) => void;
  onRemove: (pl: Pipeline) => void;
  onAdd: () => void;
}) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [overChave, setOverChave] = useState<string | null>(null);

  const primeiraChave = pipelines[0]?.chave ?? "novo";

  // Agrupa leads por etapa; status órfão cai na primeira coluna.
  const porEtapa = useMemo(() => {
    const chaves = new Set(pipelines.map((p) => p.chave));
    const map: Record<string, Formulario[]> = {};
    for (const p of pipelines) map[p.chave] = [];
    for (const f of leads) {
      const chave = chaves.has(f.status) ? f.status : primeiraChave;
      (map[chave] ??= []).push(f);
    }
    return map;
  }, [pipelines, leads, primeiraChave]);

  const leadById = useMemo(() => {
    const m: Record<string, Formulario> = {};
    for (const f of leads) m[f.id] = f;
    return m;
  }, [leads]);

  const handleDrop = (pl: Pipeline) => {
    setOverChave(null);
    if (!dragId) return;
    const lead = leadById[dragId];
    setDragId(null);
    if (lead) onMove(lead, pl);
  };

  if (pipelines.length === 0) {
    return (
      <div className="bg-paper border border-line rounded-2xl py-16 text-center text-ink-soft">
        Nenhuma etapa configurada.
        <div className="mt-3">
          <Button onClick={onAdd} className="bg-conecta-blue hover:bg-conecta-blue-deep text-white">
            <Plus className="h-4 w-4 mr-1" /> Criar primeira etapa
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1">
      {pipelines.map((pl) => {
        const items = porEtapa[pl.chave] ?? [];
        const isOver = overChave === pl.chave;
        return (
          <div
            key={pl.id}
            onDragOver={(e) => {
              e.preventDefault();
              if (overChave !== pl.chave) setOverChave(pl.chave);
            }}
            onDragLeave={(e) => {
              // Só limpa se o ponteiro saiu de fato da coluna.
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setOverChave((c) => (c === pl.chave ? null : c));
              }
            }}
            onDrop={() => handleDrop(pl)}
            className={`shrink-0 w-72 rounded-2xl border flex flex-col transition-colors ${
              isOver ? "border-conecta-blue bg-conecta-blue/5" : "border-line bg-bone/40"
            }`}
          >
            <ColumnHeader
              pipeline={pl}
              count={counts[pl.chave] ?? items.length}
              canDelete={pipelines.length > 1}
              onRename={onRename}
              onChangeCor={onChangeCor}
              onRemove={onRemove}
            />
            <div className="flex-1 px-2 pb-2 space-y-2 min-h-[120px]">
              {items.length === 0 ? (
                <div className="text-xs text-ink-mute text-center py-8 select-none">
                  {isOver ? "Solte aqui" : "Sem leads"}
                </div>
              ) : (
                items.map((f) => (
                  <LeadCard
                    key={f.id}
                    f={f}
                    dragging={dragId === f.id}
                    onSelect={() => onSelect(f)}
                    onDragStart={() => setDragId(f.id)}
                    onDragEnd={() => {
                      setDragId(null);
                      setOverChave(null);
                    }}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}

      {/* Botão nova etapa */}
      <button
        onClick={onAdd}
        className="shrink-0 w-60 rounded-2xl border border-dashed border-line text-ink-soft hover:text-conecta-blue hover:border-conecta-blue/50 transition-colors flex items-center justify-center gap-2 text-sm min-h-[120px] self-start py-6"
      >
        <Plus className="h-4 w-4" /> Nova etapa
      </button>
    </div>
  );
}

function ColumnHeader({
  pipeline,
  count,
  canDelete,
  onRename,
  onChangeCor,
  onRemove,
}: {
  pipeline: Pipeline;
  count: number;
  canDelete: boolean;
  onRename: (pl: Pipeline, nome: string) => void;
  onChangeCor: (pl: Pipeline, cor: CorPipeline) => void;
  onRemove: (pl: Pipeline) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(pipeline.nome);
  const [coresOpen, setCoresOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      setDraft(pipeline.nome);
      requestAnimationFrame(() => inputRef.current?.select());
    }
  }, [editing, pipeline.nome]);

  const commit = () => {
    setEditing(false);
    onRename(pipeline, draft);
  };

  return (
    <div className="px-3 pt-3 pb-2">
      <div className={`h-1 rounded-full mb-2 ${COR_FAIXA[pipeline.cor] ?? COR_FAIXA.slate}`} />
      <div className="flex items-center gap-1.5">
        {editing ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") setEditing(false);
            }}
            className="flex-1 min-w-0 bg-paper border border-conecta-blue rounded px-2 py-1 text-sm font-medium text-ink outline-none"
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            title="Clique para renomear"
            className="flex-1 min-w-0 text-left font-serif text-sm text-ink truncate hover:text-conecta-blue transition-colors"
          >
            {pipeline.nome}
          </button>
        )}
        <span
          className={`text-[10px] font-mono rounded-full px-1.5 py-0.5 shrink-0 ${COR_BADGE[pipeline.cor] ?? COR_BADGE.slate}`}
        >
          {count}
        </span>
      </div>

      <div className="flex items-center gap-2 mt-1.5">
        <div className="relative">
          <button
            onClick={() => setCoresOpen((v) => !v)}
            aria-label="Mudar cor da etapa"
            className={`h-4 w-4 rounded-full ring-1 ring-line ${COR_FAIXA[pipeline.cor] ?? COR_FAIXA.slate}`}
          />
          {coresOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setCoresOpen(false)} aria-hidden />
              <div className="absolute z-20 mt-1 flex gap-1.5 bg-paper border border-line rounded-lg p-1.5 shadow-lg">
                {CORES_PIPELINE.map((c) => (
                  <button
                    key={c}
                    aria-label={`Cor ${c}`}
                    onClick={() => {
                      onChangeCor(pipeline, c);
                      setCoresOpen(false);
                    }}
                    className={`h-5 w-5 rounded-full ${COR_FAIXA[c]} ${
                      pipeline.cor === c ? "ring-2 ring-ink ring-offset-1" : "ring-1 ring-line"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        {canDelete && (
          <button
            onClick={() => onRemove(pipeline)}
            aria-label="Excluir etapa"
            className="text-ink-mute hover:text-red-600 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

function LeadCard({
  f,
  dragging,
  onSelect,
  onDragStart,
  onDragEnd,
}: {
  f: Formulario;
  dragging: boolean;
  onSelect: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  const date = new Date(f.criado_em);
  const initials = f.nome
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", f.id);
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`bg-paper border border-line rounded-xl p-3 cursor-grab active:cursor-grabbing hover:border-conecta-blue/40 transition-all ${
        dragging ? "opacity-40 rotate-1" : ""
      }`}
    >
      <div className="flex items-start gap-2.5">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-conecta-blue to-conecta-blue-deep text-white flex items-center justify-center font-mono text-[10px] font-semibold shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-serif font-normal text-sm text-ink truncate">{f.nome}</h4>
          <span className="text-[9px] font-medium uppercase tracking-wider text-ink-mute font-mono">
            {f.tipo === "orcamento_lp" ? "LP" : "Site"} · {TIPO_LABELS[f.tipo]}
          </span>
        </div>
      </div>
      {f.produto_modelo && (
        <p className="text-[11px] text-conecta-orange font-mono mt-1.5 truncate">
          {f.produto_modelo}
        </p>
      )}
      <p className="text-xs text-ink-soft line-clamp-2 mt-1">{f.mensagem}</p>
      <div className="flex items-center gap-2 mt-2 text-[10px] text-ink-mute flex-wrap">
        <span className="inline-flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
        </span>
        {f.cidade && (
          <span className="inline-flex items-center gap-1 truncate">
            <MapPin className="h-3 w-3" />
            {f.cidade}/{f.estado}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Lista (visão alternativa) ─────────────────────────────────

function ListView({
  leads,
  pipelines,
  onSelect,
}: {
  leads: Formulario[];
  pipelines: Pipeline[];
  onSelect: (f: Formulario) => void;
}) {
  const plByChave = useMemo(() => {
    const m: Record<string, Pipeline> = {};
    for (const p of pipelines) m[p.chave] = p;
    return m;
  }, [pipelines]);

  if (leads.length === 0) {
    return (
      <div className="bg-paper border border-line rounded-2xl py-16 text-center text-ink-soft">
        Nenhum lead com esses filtros.
      </div>
    );
  }

  return (
    <div className="space-y-2 max-w-5xl">
      {leads.map((f) => {
        const pl = plByChave[f.status] ?? pipelines[0];
        return (
          <button
            key={f.id}
            onClick={() => onSelect(f)}
            className="w-full text-left bg-paper border border-line rounded-xl p-3 sm:p-4 hover:border-conecta-blue/30 transition-colors"
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
                  {pl && (
                    <span
                      className={`text-[10px] font-medium uppercase tracking-wider rounded-full px-2 py-0.5 ${COR_BADGE[pl.cor] ?? COR_BADGE.slate}`}
                    >
                      {pl.nome}
                    </span>
                  )}
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
                    {new Date(f.criado_em).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                    })}
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
      })}
    </div>
  );
}

// ─── Componentes auxiliares ────────────────────────────────────

function FilterPill({
  children,
  active,
  onClick,
  small,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  small?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full transition-all inline-flex items-center gap-2 ${
        small ? "px-3 py-1 text-xs" : "px-3.5 py-1.5 text-sm"
      } ${
        active
          ? "bg-conecta-blue text-white"
          : "bg-paper border border-line text-ink-soft hover:text-ink hover:border-ink"
      }`}
    >
      {children}
    </button>
  );
}

function FormularioDrawer({
  formulario,
  pipelines,
  primeiraChave,
  onClose,
  onChanged,
  onMove,
}: {
  formulario: Formulario;
  pipelines: Pipeline[];
  primeiraChave: string;
  onClose: () => void;
  onChanged: () => void;
  onMove: (lead: Formulario, destino: Pipeline) => void;
}) {
  const [notas, setNotas] = useState(formulario.notas_internas ?? "");
  const [notasDirty, setNotasDirty] = useState(false);

  // Status efetivo do lead (status órfão cai na primeira etapa).
  const chaveAtual = pipelines.some((p) => p.chave === formulario.status)
    ? formulario.status
    : primeiraChave;

  const handleSaveNotas = async () => {
    try {
      await updateFormulario({ data: { id: formulario.id, notas } });
      toast.success("Notas salvas.");
      setNotasDirty(false);
      onChanged();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao salvar notas.");
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Excluir lead de ${formulario.nome}? Esta ação não pode ser desfeita.`)) {
      return;
    }
    try {
      await deleteFormulario({ data: { id: formulario.id } });
      toast.success("Lead excluído.");
      onChanged();
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao excluir.");
    }
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
          {/* Etapa do funil */}
          <Section title="Etapa do funil">
            <div className="flex flex-wrap gap-2">
              {pipelines.map((pl) => {
                const ativo = chaveAtual === pl.chave;
                return (
                  <button
                    key={pl.id}
                    onClick={() => onMove(formulario, pl)}
                    className={`inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider rounded-full px-3 py-1.5 transition-all ${
                      ativo
                        ? `${COR_BADGE[pl.cor] ?? COR_BADGE.slate} ring-2 ring-current/30`
                        : "bg-bone text-ink-soft hover:text-ink"
                    }`}
                  >
                    {ativo && <Check className="h-3 w-3" />}
                    {pl.nome}
                  </button>
                );
              })}
            </div>
          </Section>

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

          <Section title="Mensagem">
            <div className="bg-bone/60 border border-line rounded-xl px-4 py-3 text-sm text-ink leading-relaxed whitespace-pre-wrap">
              {formulario.mensagem}
            </div>
          </Section>

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

          <Section title="Origem">
            <Row
              label={formulario.tipo === "orcamento_lp" ? "Landing Page" : "Site"}
              value={
                formulario.tipo === "orcamento_lp"
                  ? `LP: ${formulario.origem_pagina}`
                  : `Site, ${formulario.origem_pagina}`
              }
            />
            <Row
              label="Recebido em"
              value={new Date(formulario.criado_em).toLocaleString("pt-BR")}
            />
          </Section>
        </div>

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
