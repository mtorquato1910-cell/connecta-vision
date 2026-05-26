import { createFileRoute, Outlet } from "@tanstack/react-router";

/**
 * Layout root da rota /produtos.
 * Apenas projeta o <Outlet /> para que as rotas filhas (/produtos/ index,
 * /produtos/$slug detalhe, /produtos/categoria/$slug) renderizem.
 *
 * Sem este arquivo, o TanStack tenta usar a página do catálogo como layout
 * dos filhos, o que esconde o detalhe do produto atrás do grid.
 */
export const Route = createFileRoute("/produtos")({
  component: () => <Outlet />,
});
