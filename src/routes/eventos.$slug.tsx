import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, MapPin, X, ChevronLeft, ChevronRight } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Reveal } from "@/components/site/Reveal";
import { formatEventDate, getEventoBySlug } from "@/lib/eventos-data";

export const Route = createFileRoute("/eventos/$slug")({
  loader: ({ params }) => {
    const evento = getEventoBySlug(params.slug);
    if (!evento || !evento.publicado) throw notFound();
    return { evento };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `${loaderData.evento.nome} — Conecta` },
            { name: "description", content: loaderData.evento.descricao_curta },
            { property: "og:title", content: loaderData.evento.nome },
            { property: "og:image", content: loaderData.evento.capa_url },
          ],
        }
      : { meta: [] },
  notFoundComponent: () => (
    <SiteShell>
      <div className="container-edge py-32 text-center">
        <h1 className="font-serif text-4xl">Evento não encontrado</h1>
        <Link to="/eventos" className="btn-primary mt-6 inline-flex">
          Voltar à galeria
        </Link>
      </div>
    </SiteShell>
  ),
  component: EventoPage,
});

function EventoPage() {
  const { evento } = Route.useLoaderData();
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // teclado: Esc fecha, ← → navegam
  useEffect(() => {
    if (lightboxIdx === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIdx(null);
      if (e.key === "ArrowLeft") setLightboxIdx((i) => (i! - 1 + evento.galeria.length) % evento.galeria.length);
      if (e.key === "ArrowRight") setLightboxIdx((i) => (i! + 1) % evento.galeria.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIdx, evento.galeria.length]);

  return (
    <SiteShell>
      <article>
        <header className="container-edge pt-10 md:pt-14">
          <Link
            to="/eventos"
            className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-conecta-blue"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Galeria de eventos
          </Link>
          <Reveal>
            <h1 className="mt-6 font-serif text-4xl md:text-6xl text-ink leading-[1.05] max-w-4xl">
              {evento.nome}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-ink-soft">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatEventDate(evento.data_evento)}
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {evento.local}
              </span>
              <span>·</span>
              <span>{evento.galeria.length} fotos</span>
            </div>
          </Reveal>
        </header>

        <div className="container-edge mt-8 md:mt-12">
          <div className="aspect-[16/9] max-h-[520px] rounded-3xl overflow-hidden bg-bone border border-line">
            <img
              src={evento.capa_url}
              alt={evento.nome}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="container-edge py-12">
          <div className="max-w-3xl text-lg text-ink-soft leading-relaxed">
            {evento.descricao_longa}
          </div>
        </div>

        <section className="container-edge pb-24">
          <span className="eyebrow">Galeria</span>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl text-ink">
            Bastidores do evento
          </h2>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {evento.galeria.map((foto, i) => (
              <button
                key={foto.url}
                onClick={() => setLightboxIdx(i)}
                className="aspect-square overflow-hidden rounded-xl bg-bone group focus:outline-none focus:ring-2 focus:ring-conecta-orange"
              >
                <img
                  src={foto.url}
                  alt={foto.alt}
                  loading="lazy"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </button>
            ))}
          </div>
        </section>
      </article>

      {lightboxIdx !== null && (
        <Lightbox
          fotos={evento.galeria}
          index={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
          onPrev={() =>
            setLightboxIdx((i) => (i! - 1 + evento.galeria.length) % evento.galeria.length)
          }
          onNext={() => setLightboxIdx((i) => (i! + 1) % evento.galeria.length)}
        />
      )}
    </SiteShell>
  );
}

function Lightbox({
  fotos,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  fotos: { url: string; alt: string; caption?: string }[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const foto = fotos[index];
  return (
    <div
      className="fixed inset-0 z-[100] bg-ink/95 flex items-center justify-center p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 h-10 w-10 rounded-full bg-bone/10 text-bone hover:bg-bone/20 flex items-center justify-center"
        aria-label="Fechar"
      >
        <X className="h-5 w-5" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-4 h-12 w-12 rounded-full bg-bone/10 text-bone hover:bg-bone/20 flex items-center justify-center"
        aria-label="Anterior"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-4 h-12 w-12 rounded-full bg-bone/10 text-bone hover:bg-bone/20 flex items-center justify-center"
        aria-label="Próxima"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
      <img
        src={foto.url}
        alt={foto.alt}
        className="max-h-[88vh] max-w-[92vw] object-contain rounded-xl"
        onClick={(e) => e.stopPropagation()}
      />
      <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-bone/80">
        {index + 1} / {fotos.length}
        {foto.caption && <span className="block mt-1">{foto.caption}</span>}
      </div>
    </div>
  );
}
