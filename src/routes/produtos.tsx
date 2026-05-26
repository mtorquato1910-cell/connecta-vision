import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/site/PagePlaceholder";

export const Route = createFileRoute("/produtos")({
  head: () => ({ meta: [{ title: "Catálogo de Equipamentos Veterinários — Conecta" }, { name: "description", content: "Catálogo completo de 230+ equipamentos veterinários organizados em 8 linhas clínicas." }] }),
  component: () => (
    <PagePlaceholder eyebrow="Catálogo completo" title="Catálogo de equipamentos veterinários">
      <p>Em construção — a navegação por categoria, filtros e busca chegam na Fase 2 do projeto.</p>
    </PagePlaceholder>
  ),
});
