import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, MapPin } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Reveal } from "@/components/site/Reveal";
import { listEventosPublic } from "@/lib/admin.functions";
import { useLocale } from "@/hooks/useLocale";

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

function formatEventDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export const Route = createFileRoute("/eventos/")({
  head: () => ({
    meta: [
      { title: "Feiras & Eventos — Conecta" },
      {
        name: "description",
        content:
          "Galeria de feiras, congressos e eventos veterinários onde a Conecta esteve presente.",
      },
    ],
  }),
  component: EventosPage,
});

function EventosPage() {
  const [year, setYear] = useState<number | null>(null);
  const { t } = useLocale();

  const { data: eventos = [] } = useQuery({
    queryKey: ["eventos-public"],
    queryFn: async () => {
      const rows = (await listEventosPublic()) as any[];
      return rows.map((e) => ({
        ...e,
        galeria: Array.isArray(e.galeria) ? e.galeria : [],
      })) as Evento[];
    },
  });

  const years = useMemo(() => {
    const set = new Set(
      eventos
        .filter((e) => e.data_evento)
        .map((e) => new Date(e.data_evento as string).getFullYear()),
    );
    return Array.from(set).sort((a, b) => b - a);
  }, [eventos]);

  const filtered = year
    ? eventos.filter(
        (e) => e.data_evento && new Date(e.data_evento).getFullYear() === year,
      )
    : eventos;

  return (
    <SiteShell>
      <section className="container-edge pt-16 md:pt-24 pb-10">
        <Reveal>
          <span className="eyebrow">Feiras & Eventos</span>
          <h1 className="mt-4 font-serif text-5xl md:text-6xl lg:text-7xl text-ink leading-[1.02] max-w-4xl">
            {t("events.title")}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-soft">{t("events.subtitle")}</p>
        </Reveal>
      </section>

      {years.length > 1 && (
        <section className="container-edge pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-ink-soft mr-2">
              Ano:
            </span>
            <button
              onClick={() => setYear(null)}
              className={`px-3 py-1 rounded-full text-sm border transition ${
                year === null
                  ? "bg-ink text-bone border-ink"
                  : "bg-paper text-ink border-line-strong hover:border-ink"
              }`}
            >
              Todos
            </button>
            {years.map((y) => (
              <button
                key={y}
                onClick={() => setYear(y)}
                className={`px-3 py-1 rounded-full text-sm border transition ${
                  year === y
                    ? "bg-ink text-bone border-ink"
                    : "bg-paper text-ink border-line-strong hover:border-ink"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="container-edge pb-24">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-ink-soft">{t("events.empty")}</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filtered.map((e) => (
              <EventoCard key={e.id} evento={e} />
            ))}
          </div>
        )}
      </section>
    </SiteShell>
  );
}

function EventoCard({ evento }: { evento: Evento }) {
  return (
    <Link
      to="/eventos/$slug"
      params={{ slug: evento.slug }}
      className="group block bg-paper border border-line rounded-2xl overflow-hidden hover:border-line-strong transition-all hover:-translate-y-1 hover:shadow-[0_12px_32px_-8px_rgba(10,10,10,0.08)]"
    >
      <div className="aspect-[4/3] overflow-hidden bg-bone">
        <img
          src={evento.capa_url ?? ""}
          alt={evento.nome}
          className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-conecta-orange">
          <Calendar className="h-3 w-3" />
          {evento.data_evento ? formatEventDate(evento.data_evento) : ""}
        </div>
        <h3 className="mt-3 font-serif text-2xl text-ink leading-snug line-clamp-2">
          {evento.nome}
        </h3>
        <p className="mt-2 text-sm text-ink-soft inline-flex items-start gap-1">
          <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          {evento.local}
        </p>
        <p className="mt-3 text-sm text-ink-soft line-clamp-2">
          {evento.descricao_curta}
        </p>
        <p className="mt-4 text-xs font-mono uppercase tracking-wider text-ink-soft">
          {evento.galeria.length} fotos →
        </p>
      </div>
    </Link>
  );
}
