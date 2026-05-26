import { createFileRoute, Outlet } from "@tanstack/react-router";

/**
 * Layout root da rota /eventos. Projeta apenas <Outlet />.
 * Filhos: /eventos/ (index), /eventos/$slug (detalhe + lightbox).
 */
export const Route = createFileRoute("/eventos")({
  component: () => <Outlet />,
});
