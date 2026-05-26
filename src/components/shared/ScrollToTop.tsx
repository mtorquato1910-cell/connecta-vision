/**
 * Garante scroll para o topo em cada mudança de rota.
 *
 * TanStack Router já tem `scrollRestoration: true` no router config,
 * mas em alguns navegadores/SSR o reset pode ficar inconsistente.
 * Este componente é cinto + suspensório: força window.scrollTo(0, 0)
 * sempre que o pathname mudar.
 */
import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

export function ScrollToTop() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
