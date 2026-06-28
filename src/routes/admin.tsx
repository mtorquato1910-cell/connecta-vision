import {
  createFileRoute,
  Outlet,
  Link,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Camera,
  ChevronDown,
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
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  UserCog,
  X,
} from "lucide-react";
import { getCurrentUser, signOut, onAuthChange, type AdminUser } from "@/lib/admin-auth";
import logoConecta from "@/assets/conecta-logo.png";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

// ─── Estrutura de navegação (fonte única) ───────────────────────────────────

type NavLink = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
};

type NavGroupDef = {
  id: string;
  title: string;
  items: NavLink[];
};

const NAV_GROUPS: NavGroupDef[] = [
  {
    id: "geral",
    title: "Geral",
    items: [
      { to: "/admin", label: "Visão geral", icon: LayoutDashboard, exact: true },
    ],
  },
  {
    id: "catalogo",
    title: "Catálogo",
    items: [
      { to: "/admin/produtos", label: "Produtos", icon: Package },
      { to: "/admin/categorias", label: "Categorias", icon: FolderTree },
    ],
  },
  {
    id: "conteudo",
    title: "Conteúdo",
    items: [
      { to: "/admin/blog", label: "Blog", icon: Newspaper },
      { to: "/admin/eventos", label: "Eventos", icon: Camera },
      { to: "/admin/pagina-inicial", label: "Página inicial", icon: Home },
      { to: "/admin/conteudo", label: "Textos do site", icon: FileText },
    ],
  },
  {
    id: "comercial",
    title: "Comercial",
    items: [
      { to: "/admin/orcamentos", label: "Orçamentos", icon: Inbox },
      { to: "/admin/formularios", label: "Funil de vendas", icon: MessageSquare },
    ],
  },
  {
    id: "sistema",
    title: "Sistema",
    items: [
      { to: "/admin/configuracoes", label: "Configurações", icon: Settings },
      { to: "/admin/perfil", label: "Meu perfil", icon: UserCog },
    ],
  },
];

function isItemActive(pathname: string, item: NavLink): boolean {
  return item.exact ? pathname === item.to : pathname.startsWith(item.to);
}

function activeGroupId(pathname: string): string {
  for (const g of NAV_GROUPS) {
    if (g.items.some((it) => isItemActive(pathname, it))) return g.id;
  }
  return NAV_GROUPS[0].id;
}

const COLLAPSE_KEY = "admin:sidebar-collapsed";

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLoginPage = pathname === "/admin/login";
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "ok" | "unauthed">("loading");
  const [session, setSession] = useState<AdminUser | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Colapso do desktop (rail só-ícones), persistido em localStorage
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    setCollapsed(window.localStorage.getItem(COLLAPSE_KEY) === "1");
  }, []);
  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      }
      return next;
    });
  }

  // Accordion: grupos expandidos; o grupo da seção ativa já vem aberto
  const currentGroup = useMemo(() => activeGroupId(pathname), [pathname]);
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    () => new Set([currentGroup]),
  );
  // Garante que o grupo ativo esteja expandido ao navegar
  useEffect(() => {
    setOpenGroups((prev) => {
      if (prev.has(currentGroup)) return prev;
      const next = new Set(prev);
      next.add(currentGroup);
      return next;
    });
  }, [currentGroup]);
  function toggleGroup(id: string) {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

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

  // Drawer mobile (< md): conteúdo sempre full. md: rail (só ícones, via CSS).
  // lg+: `collapsed` (persistido) alterna full (240px) ↔ rail (72px).

  return (
    <div data-admin-shell className="flex min-h-screen bg-bone">
      {/* Sidebar: full no lg, rail no md, drawer off-canvas no < md */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50 shrink-0
          flex flex-col
          bg-gradient-to-b from-[#0F1357] via-[#15186B] to-[#1A1F8F]
          text-white
          transform transition-[transform,width] duration-300 ease-out motion-reduce:transition-none
          w-60
          ${collapsed ? "lg:w-[72px]" : "lg:w-60"}
          md:w-[72px]
          ${drawerOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Botão fechar, só mobile (drawer) */}
        <button
          onClick={() => setDrawerOpen(false)}
          aria-label="Fechar menu"
          className="md:hidden absolute top-4 right-4 h-9 w-9 rounded-md text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors motion-reduce:transition-none"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Logotipo + toggle de colapso (desktop) */}
        <div className="px-3 py-5 border-b border-white/10">
          <div className="flex items-center justify-between gap-2">
            <Link to="/admin" className="block group min-w-0">
              <div className="inline-flex items-center bg-white rounded-xl px-2.5 py-2 shadow-sm group-hover:shadow-md transition-shadow motion-reduce:transition-none">
                <img
                  src={logoConecta}
                  alt="Conecta Equipamentos Veterinários"
                  className="h-7 w-auto"
                />
              </div>
              {/* Texto some no rail (md) e no colapsado (lg) */}
              <div
                className={[
                  "mt-3 leading-tight",
                  "block", // base (drawer full)
                  "md:hidden", // rail
                  collapsed ? "lg:hidden" : "lg:block",
                ].join(" ")}
              >
                <div className="font-semibold text-base text-white/90">
                  Painel administrativo
                </div>
                <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
                  Conecta
                </div>
              </div>
            </Link>

            {/* Toggle recolher — só desktop lg+ e quando expandido */}
            <button
              onClick={toggleCollapsed}
              aria-label="Recolher menu"
              aria-pressed={collapsed}
              title="Recolher menu"
              className={[
                "hidden h-8 w-8 shrink-0 rounded-md items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors motion-reduce:transition-none",
                collapsed ? "lg:hidden" : "lg:flex",
              ].join(" ")}
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </div>

          {/* Quando colapsado, botão de expandir centralizado */}
          {collapsed && (
            <button
              onClick={toggleCollapsed}
              aria-label="Expandir menu"
              aria-pressed={collapsed}
              title="Expandir menu"
              className="mt-3 hidden lg:flex h-8 w-full rounded-md items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors motion-reduce:transition-none"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Navegação */}
        <nav className="flex-1 px-2 py-4 space-y-1 text-sm overflow-y-auto overflow-x-hidden">
          {NAV_GROUPS.map((group) => (
            <NavGroup
              key={group.id}
              group={group}
              pathname={pathname}
              collapsed={collapsed}
              open={openGroups.has(group.id)}
              onToggle={() => toggleGroup(group.id)}
            />
          ))}
        </nav>

        {/* Rodapé: link site + bloco de usuário/logout */}
        <div className="px-2 py-3 border-t border-white/10 space-y-2">
          <a
            href="https://www.conecta2lab.com.br/"
            target="_blank"
            rel="noreferrer"
            title="Ver site público"
            className={[
              "flex items-center rounded-lg py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 transition-colors motion-reduce:transition-none",
              // base (drawer full): texto + ícone
              "justify-between px-3",
              // md (rail): só ícone, centralizado
              "md:justify-center md:px-2",
              // lg: depende do colapso
              collapsed ? "lg:justify-center lg:px-2" : "lg:justify-between lg:px-3",
            ].join(" ")}
          >
            <span
              className={[
                "inline", // base
                "md:hidden", // rail
                collapsed ? "lg:hidden" : "lg:inline",
              ].join(" ")}
            >
              Ver site público
            </span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
          </a>

          {/* Bloco de usuário (avatar + nome + e-mail + logout) */}
          <div
            className={[
              "flex items-center gap-3 rounded-lg bg-white/5 py-2",
              "px-2", // base
              "md:px-1.5 md:justify-center", // rail
              collapsed ? "lg:px-1.5 lg:justify-center" : "lg:px-2 lg:justify-start",
            ].join(" ")}
          >
            <div className="h-9 w-9 rounded-full bg-conecta-orange text-white flex items-center justify-center font-mono text-sm font-semibold shrink-0">
              {initials}
            </div>
            <div
              className={[
                "flex-1 min-w-0",
                "block", // base
                "md:hidden", // rail
                collapsed ? "lg:hidden" : "lg:block",
              ].join(" ")}
            >
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
              title="Sair"
              className={[
                "h-8 w-8 rounded-md items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors motion-reduce:transition-none shrink-0",
                "flex", // base
                "md:hidden", // rail (usa botão dedicado abaixo)
                collapsed ? "lg:hidden" : "lg:flex",
              ].join(" ")}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          {/* No rail/colapsado, botão de logout dedicado e visível */}
          <button
            onClick={async () => {
              await signOut();
              router.navigate({ to: "/admin/login" });
            }}
            aria-label="Sair"
            title="Sair"
            className={[
              "h-9 w-full rounded-lg items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors motion-reduce:transition-none",
              "hidden", // base (já tem logout no bloco)
              "md:flex", // rail
              collapsed ? "lg:flex" : "lg:hidden",
            ].join(" ")}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* Backdrop do drawer mobile */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-ink/60 backdrop-blur-sm"
          aria-hidden
        />
      )}

      <main className="flex-1 min-w-0 flex flex-col">
        {/* Topbar mobile com hambúrguer (< md) */}
        <div className="md:hidden sticky top-0 z-30 flex items-center justify-between gap-3 bg-paper border-b border-line px-4 py-3">
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menu"
            className="h-11 w-11 rounded-md flex items-center justify-center text-ink hover:bg-bone transition-colors motion-reduce:transition-none"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/admin" className="flex items-center gap-2">
            <img src={logoConecta} alt="Conecta" className="h-6 w-auto" />
            <span className="font-semibold text-sm text-ink">Admin</span>
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

// ─── Grupo de navegação (accordion) ─────────────────────────────────────────

function NavGroup({
  group,
  pathname,
  collapsed,
  open,
  onToggle,
}: {
  group: NavGroupDef;
  pathname: string;
  collapsed: boolean;
  open: boolean;
  onToggle: () => void;
}) {
  const groupActive = group.items.some((it) => isItemActive(pathname, it));

  return (
    <div className="pt-2 first:pt-0">
      {/* Cabeçalho do grupo: botão accordion no full; oculto no rail/colapsado */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={[
          "group/header w-full items-center justify-between rounded-md px-3 py-1.5",
          "font-mono text-[10px] uppercase tracking-[0.2em]",
          groupActive ? "text-white/70" : "text-white/40",
          "hover:text-white/80 transition-colors motion-reduce:transition-none",
          "flex", // base (drawer full)
          "md:hidden", // rail
          collapsed ? "lg:hidden" : "lg:flex",
        ].join(" ")}
      >
        <span className="truncate">{group.title}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 motion-reduce:transition-none ${
            open ? "rotate-0" : "-rotate-90"
          }`}
        />
      </button>

      {/* Separador discreto no rail/colapsado (substitui o título) */}
      <div
        className={[
          "h-px bg-white/10 mx-2 my-2 first:mt-0",
          "hidden", // base
          "md:block", // rail
          collapsed ? "lg:block" : "lg:hidden",
        ].join(" ")}
        aria-hidden
      />

      {/* Itens: no full respeitam o accordion; no rail/colapsado sempre visíveis (só ícones).
          Visibilidade por breakpoint:
          - base (<md, drawer full): segue accordion (open)
          - md (rail): sempre visível
          - lg colapsado: sempre visível; lg full: segue accordion (open) */}
      <div
        className={[
          "space-y-0.5",
          open ? "block" : "hidden",
          "md:block",
          collapsed ? "lg:block" : open ? "lg:block" : "lg:hidden",
        ].join(" ")}
      >
        {group.items.map((item) => (
          <NavItem
            key={item.to}
            item={item}
            active={isItemActive(pathname, item)}
            collapsed={collapsed}
          />
        ))}
      </div>
    </div>
  );
}

function NavItem({
  item,
  active,
  collapsed,
}: {
  item: NavLink;
  active: boolean;
  collapsed: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      title={item.label}
      className={[
        "flex items-center gap-3 rounded-lg py-2 transition-all motion-reduce:transition-none",
        "justify-start px-3", // base (drawer full)
        "md:justify-center md:px-2", // rail
        collapsed ? "lg:justify-center lg:px-2" : "lg:justify-start lg:px-3",
        active
          ? "bg-conecta-orange text-white shadow-[0_4px_12px_-2px_rgba(244,123,32,0.4)]"
          : "text-white/75 hover:text-white hover:bg-white/8",
      ].join(" ")}
    >
      <span className={`shrink-0 ${active ? "text-white" : "text-white/60"}`}>
        <Icon className="h-4 w-4" />
      </span>
      <span
        className={[
          "text-sm font-medium truncate",
          "inline", // base
          "md:hidden", // rail
          collapsed ? "lg:hidden" : "lg:inline",
        ].join(" ")}
      >
        {item.label}
      </span>
    </Link>
  );
}
