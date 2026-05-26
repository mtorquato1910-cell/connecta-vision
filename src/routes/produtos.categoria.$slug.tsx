import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/site/PagePlaceholder";
import { CATEGORIAS } from "@/lib/site-data";

export const Route = createFileRoute("/produtos/categoria/$slug")({
  component: CategoriaPage,
});

function CategoriaPage() {
  const { slug } = Route.useParams();
  const cat = CATEGORIAS.find((c) => c.slug === slug);
  return (
    <PagePlaceholder eyebrow="Categoria" title={cat?.nome ?? "Categoria"}>
      <p>{cat?.qtd ?? 0} equipamentos nesta linha. Listagem detalhada e filtros disponíveis na Fase 2.</p>
    </PagePlaceholder>
  );
}
