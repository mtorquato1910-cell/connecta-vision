/**
 * Repository de produtos para o admin (mock + localStorage).
 *
 * Carrega base do JSON gerado pelo extract-products.py + aplica diff salvo
 * em localStorage. Quando o banco real estiver disponível, basta substituir
 * por implementação Postgres com a mesma interface.
 */
import produtosJson from "@/data/produtos.json";

const LS_KEY = "conecta_admin_produtos_v1";

export type Produto = {
  id: string;
  slug: string;
  modelo: string;
  nome: string;
  categoria_id: string;
  categoria_slug: string;
  categoria_nome: string;
  subcategoria: string | null;
  marca: string;
  descricao_curta: string | null;
  descricao_longa: string | null;
  especificacoes: { chave: string; valor: string }[];
  configuracoes: string | null;
  imagem_principal: string | null;
  galeria: { url: string; ordem: number; alt: string }[];
  url_fabricante: string | null;
  destaque: boolean;
  publicado: boolean;
};

export type ProdutoInput = Omit<Produto, "id"> & { id?: string };

function readLs(): Produto[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Produto[];
  } catch {
    return null;
  }
}

function writeLs(produtos: Produto[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(produtos));
  } catch (e) {
    console.error("Falha ao salvar produtos no localStorage:", e);
  }
}

export function getAll(): Produto[] {
  const ls = readLs();
  return ls ?? (produtosJson as Produto[]);
}

export function getBySlug(slug: string): Produto | undefined {
  return getAll().find((p) => p.slug === slug);
}

export function getById(id: string): Produto | undefined {
  return getAll().find((p) => p.id === id);
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
  while (all.some((p) => p.slug === slug && p.id !== currentId)) {
    i++;
    slug = `${base}-${i}`;
  }
  return slug;
}

export function create(input: ProdutoInput): Produto {
  const id = input.id ?? `prod-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const slugBase = input.slug || slugify(input.modelo || input.nome);
  const novo: Produto = {
    ...input,
    id,
    slug: ensureUniqueSlug(slugBase, id),
  };
  const todos = [...getAll(), novo];
  writeLs(todos);
  return novo;
}

export function update(id: string, patch: Partial<ProdutoInput>): Produto | null {
  const todos = getAll();
  const idx = todos.findIndex((p) => p.id === id);
  if (idx === -1) return null;

  const atualizado: Produto = { ...todos[idx], ...patch, id };

  if (patch.modelo || patch.nome || patch.slug) {
    const slugBase = patch.slug || slugify(patch.modelo || atualizado.modelo || atualizado.nome);
    atualizado.slug = ensureUniqueSlug(slugBase, id);
  }

  todos[idx] = atualizado;
  writeLs(todos);
  return atualizado;
}

export function remove(id: string): boolean {
  const todos = getAll();
  const filtered = todos.filter((p) => p.id !== id);
  if (filtered.length === todos.length) return false;
  writeLs(filtered);
  return true;
}

export function reset(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(LS_KEY);
  }
}

export function stats() {
  const all = getAll();
  return {
    total: all.length,
    publicados: all.filter((p) => p.publicado).length,
    destaques: all.filter((p) => p.destaque).length,
    porCategoria: all.reduce<Record<string, number>>((acc, p) => {
      acc[p.categoria_slug] = (acc[p.categoria_slug] ?? 0) + 1;
      return acc;
    }, {}),
  };
}

/** Texto multilinha → galeria (1 URL por linha). */
export function parseGaleriaText(text: string): Produto["galeria"] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((url, i) => ({ url, ordem: i, alt: `imagem ${i + 1}` }));
}

export function formatGaleriaText(galeria: Produto["galeria"]): string {
  return galeria
    .slice()
    .sort((a, b) => a.ordem - b.ordem)
    .map((g) => g.url)
    .join("\n");
}

export function parseEspecsText(text: string): Produto["especificacoes"] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const m = line.match(/^([^:]+?)\s*:\s*(.+)$/);
      if (m) return { chave: m[1].trim(), valor: m[2].trim() };
      return { chave: "Especificação", valor: line };
    });
}

export function formatEspecsText(especs: Produto["especificacoes"]): string {
  return especs.map((e) => `${e.chave}: ${e.valor}`).join("\n");
}
