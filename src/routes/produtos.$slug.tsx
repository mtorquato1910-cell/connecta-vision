import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/site/PagePlaceholder";
import { PRODUTOS_DESTAQUE } from "@/lib/site-data";

export const Route = createFileRoute("/produtos/$slug")({
  component: ProdutoPage,
});

function ProdutoPage() {
  const { slug } = Route.useParams();
  const p = PRODUTOS_DESTAQUE.find((x) => x.slug === slug);
  return (
    <PagePlaceholder eyebrow={p?.categoriaNome ?? "Produto"} title={p?.modelo ?? "Produto"}>
      <p>{p?.nome ?? "Detalhes do produto em construção — galeria, especificações e formulário de orçamento chegam na Fase 2."}</p>
    </PagePlaceholder>
  );
}
