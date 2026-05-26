/**
 * Repository de eventos para o admin (mock + localStorage).
 * Espelha src/lib/eventos-data.ts mas com CRUD.
 */
import eventosJson from "@/data/eventos.json";

const LS_KEY = "conecta_admin_eventos_v1";

export type EventoFoto = {
  url: string;
  ordem: number;
  alt: string;
  caption?: string;
};

export type Evento = {
  id: string;
  slug: string;
  nome: string;
  data_evento: string;
  local: string;
  descricao_curta: string;
  descricao_longa: string;
  capa_url: string;
  galeria: EventoFoto[];
  publicado: boolean;
  ordem: number;
};

export type EventoInput = Omit<Evento, "id" | "ordem"> & { id?: string };

function readLs(): Evento[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Evento[];
  } catch {
    return null;
  }
}

function writeLs(items: Evento[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_KEY, JSON.stringify(items));
}

export function getAll(): Evento[] {
  return (readLs() ?? (eventosJson as Evento[]))
    .slice()
    .sort(
      (a, b) =>
        new Date(b.data_evento).getTime() - new Date(a.data_evento).getTime(),
    );
}

export function getById(id: string): Evento | undefined {
  return getAll().find((e) => e.id === id);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function ensureUniqueSlug(base: string, currentId?: string): string {
  const all = getAll();
  let slug = base;
  let i = 1;
  while (all.some((e) => e.slug === slug && e.id !== currentId)) {
    i++;
    slug = `${base}-${i}`;
  }
  return slug;
}

export function create(input: EventoInput): Evento {
  const id = input.id ?? `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const slugBase = input.slug || slugify(input.nome);
  const all = getAll();
  const novo: Evento = {
    ...input,
    id,
    slug: ensureUniqueSlug(slugBase, id),
    ordem: all.length + 1,
  };
  writeLs([novo, ...all]);
  return novo;
}

export function update(id: string, patch: Partial<EventoInput>): Evento | null {
  const all = getAll();
  const idx = all.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  const atualizado: Evento = { ...all[idx], ...patch, id };
  if (patch.nome || patch.slug) {
    const slugBase = patch.slug || slugify(patch.nome || atualizado.nome);
    atualizado.slug = ensureUniqueSlug(slugBase, id);
  }
  all[idx] = atualizado;
  writeLs(all);
  return atualizado;
}

export function remove(id: string): boolean {
  const all = getAll();
  const filtered = all.filter((e) => e.id !== id);
  if (filtered.length === all.length) return false;
  writeLs(filtered);
  return true;
}

export function reset(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(LS_KEY);
  }
}

export function parseFotosText(text: string): EventoFoto[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((url, i) => ({ url, ordem: i, alt: `foto ${i + 1}` }));
}

export function formatFotosText(fotos: EventoFoto[]): string {
  return fotos
    .slice()
    .sort((a, b) => a.ordem - b.ordem)
    .map((f) => f.url)
    .join("\n");
}
