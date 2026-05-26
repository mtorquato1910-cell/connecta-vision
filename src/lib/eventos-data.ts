/**
 * Eventos: mock data + helpers.
 */
import eventosJson from "@/data/eventos.json";

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

export function getAllEventos(): Evento[] {
  return (eventosJson as Evento[])
    .filter((e) => e.publicado)
    .sort(
      (a, b) =>
        new Date(b.data_evento).getTime() - new Date(a.data_evento).getTime(),
    );
}

export function getEventoBySlug(slug: string): Evento | undefined {
  return (eventosJson as Evento[]).find((e) => e.slug === slug);
}

export function formatEventDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function eventoYears(): number[] {
  const years = new Set(
    getAllEventos().map((e) => new Date(e.data_evento).getFullYear()),
  );
  return Array.from(years).sort((a, b) => b - a);
}
