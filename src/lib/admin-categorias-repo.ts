/**
 * Repository de categorias para o admin (mock + localStorage).
 */
import categoriasJson from "@/data/categorias.json";

const LS_KEY = "conecta_admin_categorias_v1";

export type Categoria = {
  id: string;
  slug: string;
  nome: string;
  descricao_curta: string;
  numero: string;
  ordem: number;
  destaque: boolean;
  fonte_aba?: string;
};

function readLs(): Categoria[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Categoria[];
  } catch {
    return null;
  }
}

function writeLs(cats: Categoria[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_KEY, JSON.stringify(cats));
}

export function getAll(): Categoria[] {
  const ls = readLs();
  return (ls ?? (categoriasJson as Categoria[]))
    .slice()
    .sort((a, b) => a.ordem - b.ordem);
}

export function update(id: string, patch: Partial<Categoria>): Categoria | null {
  const all = getAll();
  const idx = all.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  const atualizado = { ...all[idx], ...patch, id };
  all[idx] = atualizado;
  writeLs(all);
  return atualizado;
}

export function reorder(orderedIds: string[]): void {
  const all = getAll();
  const map = new Map(all.map((c) => [c.id, c]));
  const reordered = orderedIds
    .map((id, i) => {
      const c = map.get(id);
      return c ? { ...c, ordem: i + 1 } : null;
    })
    .filter(Boolean) as Categoria[];
  writeLs(reordered);
}

export function reset(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(LS_KEY);
  }
}
