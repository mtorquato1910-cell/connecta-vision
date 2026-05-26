import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/site/PagePlaceholder";

export const Route = createFileRoute("/sobre")({
  head: () => ({ meta: [{ title: "Sobre a Conecta — Equipamentos Veterinários" }, { name: "description", content: "Distribuidora oficial Shinova no Brasil. Sediada em Vespasiano/MG, cobertura nacional." }] }),
  component: () => (
    <PagePlaceholder eyebrow="Sobre" title="Uma operação brasileira com olhar global para medicina veterinária.">
      <p>História, valores e equipe — em construção.</p>
    </PagePlaceholder>
  ),
});
