/**
 * Blog: mock data + helpers.
 * Persistência de aprovações/rejeições/criações usa localStorage no client.
 */
import postsJson from "@/data/blog-posts.json";

export type BlogStatus = "pendente" | "publicado" | "rascunho" | "rejeitado";
export type BlogOrigem = "publico" | "admin";

export type BlogPost = {
  id: string;
  slug: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  capa_url: string;
  autor_nome: string;
  autor_email: string;
  tags: string[];
  status: BlogStatus;
  origem: BlogOrigem;
  publicado_em: string | null;
  criado_em: string;
  motivo_rejeicao?: string | null;
};

const LS_KEY = "conecta:blog-posts:v1";

function readLs(): BlogPost[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as BlogPost[];
  } catch {
    return null;
  }
}

function writeLs(posts: BlogPost[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_KEY, JSON.stringify(posts));
}

export function getAllPosts(): BlogPost[] {
  const ls = readLs();
  return ls ?? (postsJson as BlogPost[]);
}

export function getPublishedPosts(): BlogPost[] {
  return getAllPosts()
    .filter((p) => p.status === "publicado")
    .sort((a, b) => {
      const da = a.publicado_em ?? a.criado_em;
      const db = b.publicado_em ?? b.criado_em;
      return new Date(db).getTime() - new Date(da).getTime();
    });
}

export function getPendingPosts(): BlogPost[] {
  return getAllPosts()
    .filter((p) => p.status === "pendente")
    .sort(
      (a, b) =>
        new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime(),
    );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function submitPost(input: {
  titulo: string;
  resumo: string;
  conteudo: string;
  capa_url?: string;
  autor_nome: string;
  autor_email: string;
  tags?: string[];
}): BlogPost {
  const slug = slugify(input.titulo) + "-" + Date.now().toString(36);
  const novo: BlogPost = {
    id: slug,
    slug,
    titulo: input.titulo.trim(),
    resumo: input.resumo.trim(),
    conteudo: input.conteudo.trim(),
    capa_url:
      input.capa_url ||
      "https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?w=1600&q=85",
    autor_nome: input.autor_nome.trim(),
    autor_email: input.autor_email.trim(),
    tags: input.tags ?? [],
    status: "pendente",
    origem: "publico",
    publicado_em: null,
    criado_em: new Date().toISOString(),
  };
  const all = [...getAllPosts(), novo];
  writeLs(all);
  return novo;
}

export function approvePost(id: string): void {
  const all = getAllPosts().map((p) =>
    p.id === id
      ? {
          ...p,
          status: "publicado" as BlogStatus,
          publicado_em: new Date().toISOString(),
        }
      : p,
  );
  writeLs(all);
}

export function rejectPost(id: string, motivo: string): void {
  const all = getAllPosts().map((p) =>
    p.id === id
      ? { ...p, status: "rejeitado" as BlogStatus, motivo_rejeicao: motivo }
      : p,
  );
  writeLs(all);
}

export function deletePost(id: string): void {
  const all = getAllPosts().filter((p) => p.id !== id);
  writeLs(all);
}

export function adminCreatePost(input: {
  titulo: string;
  resumo: string;
  conteudo: string;
  capa_url?: string;
  tags?: string[];
}): BlogPost {
  const slug = slugify(input.titulo) + "-" + Date.now().toString(36);
  const now = new Date().toISOString();
  const novo: BlogPost = {
    id: slug,
    slug,
    titulo: input.titulo.trim(),
    resumo: input.resumo.trim(),
    conteudo: input.conteudo.trim(),
    capa_url:
      input.capa_url ||
      "https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=1600&q=85",
    autor_nome: "Equipe Conecta",
    autor_email: "editorial@conectavet.com.br",
    tags: input.tags ?? [],
    status: "publicado",
    origem: "admin",
    publicado_em: now,
    criado_em: now,
  };
  const all = [...getAllPosts(), novo];
  writeLs(all);
  return novo;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
