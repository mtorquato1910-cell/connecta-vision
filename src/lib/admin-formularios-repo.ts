/**
 * Repository de formulários recebidos (mock + localStorage).
 */
import formulariosJson from "@/data/formularios.json";

const LS_KEY = "conecta_admin_formularios_v1";

export type FormularioStatus =
  | "novo"
  | "em_contato"
  | "qualificado"
  | "convertido"
  | "perdido";

export type FormularioTipo = "contato" | "orcamento_geral" | "orcamento_produto";

export type Formulario = {
  id: string;
  tipo: FormularioTipo;
  nome: string;
  email: string;
  whatsapp: string | null;
  telefone: string | null;
  tipo_estabelecimento: string | null;
  nome_estabelecimento: string | null;
  cidade: string | null;
  estado: string | null;
  cargo: string | null;
  produto_id: string | null;
  produto_modelo: string | null;
  produto_nome: string | null;
  mensagem: string;
  status: FormularioStatus;
  notas_internas: string | null;
  origem_pagina: string;
  criado_em: string;
};

function readLs(): Formulario[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Formulario[];
  } catch {
    return null;
  }
}

function writeLs(items: Formulario[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_KEY, JSON.stringify(items));
}

export function getAll(): Formulario[] {
  return (readLs() ?? (formulariosJson as Formulario[]))
    .slice()
    .sort(
      (a, b) =>
        new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime(),
    );
}

export function getById(id: string): Formulario | undefined {
  return getAll().find((f) => f.id === id);
}

export function updateStatus(id: string, status: FormularioStatus): void {
  const all = getAll();
  const idx = all.findIndex((f) => f.id === id);
  if (idx === -1) return;
  all[idx] = { ...all[idx], status };
  writeLs(all);
}

export function updateNotas(id: string, notas: string): void {
  const all = getAll();
  const idx = all.findIndex((f) => f.id === id);
  if (idx === -1) return;
  all[idx] = { ...all[idx], notas_internas: notas };
  writeLs(all);
}

export function remove(id: string): void {
  const all = getAll().filter((f) => f.id !== id);
  writeLs(all);
}

export function reset(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(LS_KEY);
  }
}

export const STATUS_LABELS: Record<FormularioStatus, string> = {
  novo: "Novo",
  em_contato: "Em contato",
  qualificado: "Qualificado",
  convertido: "Convertido",
  perdido: "Perdido",
};

export const TIPO_LABELS: Record<FormularioTipo, string> = {
  contato: "Contato",
  orcamento_geral: "Orçamento geral",
  orcamento_produto: "Orçamento de produto",
};

export const STATUS_COLORS: Record<FormularioStatus, string> = {
  novo: "bg-blue-100 text-blue-900",
  em_contato: "bg-amber-100 text-amber-900",
  qualificado: "bg-violet-100 text-violet-900",
  convertido: "bg-emerald-100 text-emerald-900",
  perdido: "bg-slate-100 text-slate-700",
};
