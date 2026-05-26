import { createFileRoute, Outlet } from "@tanstack/react-router";

/**
 * Layout root da rota /blog. Projeta apenas <Outlet />.
 * Filhos: /blog/ (index), /blog/$slug (post), /blog/enviar (submissão).
 */
export const Route = createFileRoute("/blog")({
  component: () => <Outlet />,
});
