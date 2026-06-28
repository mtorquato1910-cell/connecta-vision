import {
  createFileRoute,
  Outlet,
  Link,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Camera,
  ExternalLink,
  FileText,
  FolderTree,
  Home,
  Inbox,
  LayoutDashboard,
  Loader2,
  LogOut,
  MessageSquare,
  Menu,
  Newspaper,
  Package,
  Settings,
  UserCog,
  X,
} from "lucide-react";
import { getCurrentUser, signOut, onAuthChange, type AdminUser } from "@/lib/admin-auth";
import logoConecta from "@/assets/conecta-logo.png";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLoginPage = pathname === "/admin/login";
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "ok" | "unauthed">("loading");
  const [session, setSession] = useState<AdminUser | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (isLoginPage) {
      setStatus("ok");
      return;
    }
    let mounted = true;
    getCurrentUser().then((u) => {
      if (!mounted) return;
      setSession(u);
      setStatus(u ? "ok" : "unauthed");
    });
    const sub = onAuthChange((authenticated) => {
      if (!mounted) return;
      if (!authenticated) {
        setSession(null);
        setStatus("unauthed");
      }
    });
    return () => {
      mounted = false;
      sub.unsubscribe();
    };
  }, [isLoginPage, pathname]);

  useEffect(() => {
    if (status === "unauthed" && !isLoginPage) {
      router.navigate({ to: "/admin/login" });
    }
  }, [status, isLoginPage, router]);

  // Fecha drawer ao navegar
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Fecha drawer com Esc
  useEffect(() => {
    if (!drawerOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [drawerOpen]);

  // Bloquear scroll do body quando drawer aberto
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  if (isLoginPage) return <Outlet />;

  if (status === "loading" || status === "unauthed") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bone">
        <Loader2 className="h-6 w-6 animate-spin text-conecta-blue" />
      </div>
    );
  }

  const initials = (session?.nome ?? "AC")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div data-admin-shell className="flex min-h-screen bg-bone">
      {/* Sidebar, desktop sempre visível, mobile como drawer */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-60 shrink-0
          flex flex-col
          bg-gradient-to-b from-[#0F1357] via-[#15186B] to-[#1A1F8F]
          text-white
          transform transition-transform duration-300 ease-out
          ${drawerOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Botão fechar, só mobile */}
        <button
          onClick={() => setDrawerOpen(false)}
          aria-label="Fechar menu"
          className="lg:hidden absolute top-4 right-4 h-8 w-8 rounded-md text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Logotipo oficial */}
        <div className="px-4 py-5 border-b border-white/10">
          <Link to="/admin" className="block group">
            <div className="inline-flex items-center bg-white rounded-xl px-3 py-2 shadow-sm group-hover:shadow-md transition-shadow">
              <img
                src={logoConecta}
                alt="Conecta Equipamentos Veterinários"
                className="h-8 w-auto"
              />
            </div>
            <div className="mt-3 font-serif text-base text-white/90 leading-tight">
              Painel administrativo
            </div>
            <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
              Conecta
            </div>
          </Link>
        </div>

        {/* Navegação */}
        <nav className="flex-1 px-2.5 py-4 space-y-0.5 text-sm overflow-y-auto">
          <NavGroup title="Geral">
            <NavItem to="/admin" exact icon={<LayoutDashboard className="h-4 w-4" />}>
              Visão geral
            </NavItem>
          </NavGroup>
          <NavGroup title="Catálogo">
            <NavItem to="/admin/produtos" icon={<Package className="h-4 w-4" />}>
              Produtos
            </NavItem>
            <NavItem to="/admin/categorias" icon={<FolderTree className="h-4 w-4" />}>
              Categorias
            </NavItem>
          </NavGroup>
          <NavGroup title="Conteúdo">
            <NavItem to="/admin/blog" icon={<Newspaper className="h-4 w-4" />}>
              Blog
            </NavItem>
            <NavItem to="/admin/eventos" icon={<Camera className="h-4 w-4" />}>
              Eventos
            </NavItem>
            <NavItem to="/admin/pagina-inicial" icon={<Home className="h-4 w-4" />}>
              Página inicial
            </NavItem>
            <NavItem to="/admin/conteudo" icon={<FileText className="h-4 w-4" />}>
              Textos do site
            </NavItem>
          </NavGroup>
          <NavGroup title="Mensagens">
            <NavItem to="/admin/orcamentos" icon={<Inbox className="h-4 w-4" />}>
              Orçamentos
            </NavItem>
            <NavItem to="/admin/formularios" icon={<MessageSquare className="h-4 w-4" />}>
              Formulários
            </NavItem>
          </NavGroup>
          <NavGroup title="Sistema">
            <NavItem to="/admin/configuracoes" icon={<Settings className="h-4 w-4" />}>
              Configurações
            </NavItem>
            <NavItem to="/admin/perfil" icon={<UserCog className="h-4 w-4" />}>
              Meu perfil
            </NavItem>
          </NavGroup>
        </nav>

        {/* Card do admin */}
        <div className="px-2.5 py-3 border-t border-white/10 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between rounded-lg px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          >
            <span>Ver site público</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-white/5">
            <div className="h-9 w-9 rounded-full bg-conecta-orange text-white flex items-center justify-center font-mono text-sm font-semibold shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {session?.nome ?? "Admin"}
              </p>
              <p className="text-[11px] text-white/60 truncate">{session?.email}</p>
            </div>
            <button
              onClick={async () => {
                await signOut();
                router.navigate({ to: "/admin/login" });
              }}
              aria-label="Sair"
              className="h-8 w-8 rounded-md flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop do drawer mobile */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-ink/60 backdrop-blur-sm"
          aria-hidden
        />
      )}

      <main className="flex-1 min-w-0 flex flex-col">
        {/* Topbar mobile com hambúrguer */}
        <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between gap-3 bg-paper border-b border-line px-4 py-3">
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menu"
            className="h-10 w-10 rounded-md flex items-center justify-center text-ink hover:bg-bone transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/admin" className="flex items-center gap-2">
            <img src={logoConecta} alt="Conecta" className="h-6 w-auto" />
            <span className="font-serif text-sm text-ink">Admin</span>
          </Link>
          <div className="h-9 w-9 rounded-full bg-conecta-orange text-white flex items-center justify-center font-mono text-xs font-semibold">
            {initials}
          </div>
        </div>

        <Outlet />
      </main>
    </div>
  );
}

function NavGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="pt-3 first:pt-0">
      <div className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
        {title}
      </div>
      <div className="space-y-0.5">{children}</div>
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
      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
        active
          ? "bg-conecta-orange text-white shadow-[0_4px_12px_-2px_rgba(244,123,32,0.4)]"
          : "text-white/75 hover:text-white hover:bg-white/8"
      }`}
    >
      <span className={`shrink-0 ${active ? "text-white" : "text-white/60"}`}>
        {icon}
      </span>
      <span className="text-sm font-medium">{children}</span>
    </Link>
  );
}
