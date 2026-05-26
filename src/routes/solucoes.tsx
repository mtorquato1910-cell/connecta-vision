import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/site/PagePlaceholder";

export const Route = createFileRoute("/solucoes")({
  head: () => ({ meta: [{ title: "Soluções por Segmento — Conecta" }, { name: "description", content: "Equipamentos veterinários para hospitais, clínicas, grooming, pesquisa, fazendas e zoológicos." }] }),
  component: () => (
    <PagePlaceholder eyebrow="Soluções por segmento" title="Atendemos cada tipo de operação com o catálogo certo.">
      <p>Conteúdo detalhado de cada segmento em construção.</p>
    </PagePlaceholder>
  ),
});
