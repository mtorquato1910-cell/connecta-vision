import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/site/PagePlaceholder";

export const Route = createFileRoute("/admin/login")({
  component: () => (
    <PagePlaceholder eyebrow="Acesso administrativo" title="Painel Conecta (em construção)">
      <p>O painel administrativo completo será entregue na Fase 4: autenticação, CRUD de produtos e categorias, editor de banner, configurações e inbox de orçamentos.</p>
    </PagePlaceholder>
  ),
});
