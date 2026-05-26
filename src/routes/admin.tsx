import { createFileRoute, Outlet, Link, useRouter, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Package, FolderTree, Inbox, LogOut, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { meSouAdmin } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLoginPage = pathname === "/admin/login";
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "ok" | "unauthed" | "forbidden">("loading");
  const checkAdmin = useServerFn(meSouAdmin);

  useEffect(() => {
    if (isLoginPage) {
      setStatus("ok");
      return;
    }
    let alive = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        if (alive) setStatus("unauthed");
        return;
      }
      try {
        const r = await checkAdmin();
        if (!alive) return;
        setStatus(r.isAdmin ? "ok" : "forbidden");
      } catch {
        if (alive) setStatus("forbidden");
      }
    })();
    return () => {
      alive = false;
    };
  }, [isLoginPage, checkAdmin]);

  useEffect(() => {
    if (status === "unauthed" && !isLoginPage) {
      router.navigate({ to: "/admin/login" });
    }
  }, [status, isLoginPage, router]);

  if (isLoginPage) return <Outlet />;

  if (status === "loading" || status === "unauthed") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (status === "forbidden") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-semibold">Acesso restrito</h1>
          <p className="text-sm text-muted-foreground">
            Sua conta não tem permissão de administrador. Faça login com uma conta autorizada.
          </p>
          <Button
            onClick={async () => {
              await supabase.auth.signOut();
              router.navigate({ to: "/admin/login" });
            }}
          >
            Sair e voltar ao login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="w-64 shrink-0 border-r bg-background flex flex-col">
        <div className="px-6 py-5 border-b">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Conecta</div>
          <div className="text-lg font-semibold">Painel admin</div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
          <NavItem to="/admin" exact icon={<LayoutDashboard className="h-4 w-4" />}>Visão geral</NavItem>
          <NavItem to="/admin/produtos" icon={<Package className="h-4 w-4" />}>Produtos</NavItem>
          <NavItem to="/admin/categorias" icon={<FolderTree className="h-4 w-4" />}>Categorias</NavItem>
          <NavItem to="/admin/orcamentos" icon={<Inbox className="h-4 w-4" />}>Orçamentos</NavItem>
        </nav>
        <div className="p-3 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={async () => {
              await supabase.auth.signOut();
              router.navigate({ to: "/admin/login" });
            }}
          >
            <LogOut className="h-4 w-4" /> Sair
          </Button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}

function NavItem({
  to,
  icon,
  children,
  exact,
}: {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  exact?: boolean;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = exact ? pathname === to : pathname.startsWith(to);
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors ${
        active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
      }`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}
