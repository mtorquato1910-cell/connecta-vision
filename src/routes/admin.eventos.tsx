import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Camera, ExternalLink, ImageIcon, MapPin, Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  formatEventDate,
  getAllEventos,
} from "@/lib/eventos-data";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/PageHeader";

export const Route = createFileRoute("/admin/eventos")({
  component: AdminEventosPage,
});

function AdminEventosPage() {
  const eventos = getAllEventos();

  return (
    <div>
      <PageHeader
        eyebrow="Conteúdo"
        title="Galeria de eventos"
        description="Gerencie feiras, congressos e eventos onde a Conecta esteve presente. Cada evento tem capa, descrição e galeria de fotos."
        icon={Camera}
        tone="rose"
        actions={
          <Button disabled className="gap-2" title="Disponível após integração do banco">
            <Plus className="h-4 w-4" /> Novo evento
          </Button>
        }
      />

      <div className="px-4 sm:px-6 md:px-10 py-5 sm:py-6 md:py-8 max-w-7xl">
      <div className="bg-amber-50 border border-amber-200 text-amber-900 text-sm rounded-2xl p-4 mb-6 flex items-start gap-3">
        <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">📌</div>
        <div>
          <strong>Modo somente leitura.</strong> Upload de fotos e CRUD completo
          serão habilitados quando o banco for integrado. Os eventos abaixo vêm do
          mock <code className="bg-amber-100 px-1 rounded text-xs">src/data/eventos.json</code>.
        </div>
      </div>

      <div className="space-y-4">
        {eventos.map((ev) => (
          <div
            key={ev.id}
            className="border rounded-lg bg-background overflow-hidden flex flex-col md:flex-row"
          >
            <img
              src={ev.capa_url}
              alt={ev.nome}
              className="h-48 md:h-auto md:w-64 object-cover bg-muted shrink-0"
            />
            <div className="p-5 flex-1 min-w-0">
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatEventDate(ev.data_evento)}
                </span>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {ev.local}
                </span>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <ImageIcon className="h-3 w-3" />
                  {ev.galeria.length} fotos
                </span>
              </div>
              <h3 className="font-serif font-normal text-xl">{ev.nome}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {ev.descricao_curta}
              </p>
              <div className="mt-4 flex gap-2">
                <Link
                  to="/eventos/$slug"
                  params={{ slug: ev.slug }}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                >
                  Ver no site <ExternalLink className="h-3.5 w-3.5" />
                </Link>
                <span className="text-sm text-muted-foreground">·</span>
                <button
                  disabled
                  className="text-sm text-muted-foreground"
                  title="Disponível após banco"
                >
                  Editar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
