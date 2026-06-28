import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Camera,
  Clock,
  FileText,
  FolderTree,
  Home,
  Inbox,
  MessageSquare,
  Newspaper,
  Package,
  Settings,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/admin-auth";
import { dashboardStats, listAllPosts, listAllEventos } from "@/lib/admin.functions";

type BlogPost = {
  id: string;
  titulo: string;
  autor_nome: string;
  capa_url: string | null;
  created_at: string;
  status: string;
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [displayName, setDisplayName] = useState("Administrador");
  useEffect(() => {
    getCurrentUser().then((u) => {
      const nome = u?.nome?.trim();
      if (nome) setDisplayName(nome);
    });
  }, []);

  const { data: dashStats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => dashboardStats(),
  });
  const { data: posts = [] } = useQuery({
    queryKey: ["admin", "blog"],
    queryFn: async () => (await listAllPosts()) as unknown as BlogPost[],
  });
  const { data: eventos = [] } = useQuery({
    queryKey: ["admin-eventos"],
    queryFn: async () => (await listAllEventos()) as unknown as { id: string }[],
  });

  const totalProdutos = dashStats?.produtos ?? 0;
  const totalCategorias = dashStats?.categorias ?? 0;
  const totalOrcamentos = dashStats?.orcamentos ?? 0;
  const orcamentosNovos = dashStats?.orcamentosNovos ?? 0;
  const postsPublicados = posts.filter((p) => p.status === "publicado").length;
  const postsPendentes = posts.filter((p) => p.status === "pendente");
  const totalPostsAll = posts.length;
  const totalEventos = eventos.length;

  const totalFormularios = dashStats?.formularios ?? 0;
  const formulariosNovos = dashStats?.formulariosNovos ?? 0;

  type StatTone = "blue" | "orange" | "amber" | "violet" | "rose" | "slate";
  const stats: Array<{
    label: string;
    value: number;
    sub: string;
    icon: React.ComponentType<{ className?: string }>;
    to: string;
    tone: StatTone;
    pill?: string;
  }> = [
    {
      label: "Produtos",
      value: totalProdutos,
      sub: "No catálogo",
      icon: Package,
      to: "/admin/produtos",
      tone: "blue",
    },
    {
      label: "Categorias",
      value: totalCategorias,
      sub: "Linhas clínicas",
      icon: FolderTree,
      to: "/admin/categorias",
      tone: "violet",
    },
    {
      label: "Posts no blog",
      value: postsPublicados,
      sub: `${totalPostsAll} no total`,
      icon: Newspaper,
      to: "/admin/blog",
      tone: "orange",
      pill:
        postsPendentes.length > 0
          ? `${postsPendentes.length} pendentes`
          : undefined,
    },
    {
      label: "Eventos",
      value: totalEventos,
      sub: "Feiras e congressos",
      icon: Camera,
      to: "/admin/eventos",
      tone: "rose",
    },
    {
      label: "Formulários",
      value: totalFormularios,
      sub: `${formulariosNovos} mensagens novas`,
      icon: MessageSquare,
      to: "/admin/formularios",
      tone: "amber",
    },
    {
      label: "Orçamentos",
      value: totalOrcamentos,
      sub: `${orcamentosNovos} ${orcamentosNovos === 1 ? "novo" : "novos"}`,
      icon: Inbox,
      to: "/admin/orcamentos",
      tone: "slate",
    },
  ];

  const shortcuts = [
    {
      label: "Página inicial",
      to: "/admin/pagina-inicial",
      icon: Home,
      desc: "Ordenar e ativar blocos da home pública.",
      color: "bg-amber-100 text-amber-700",
    },
    {
      label: "Textos do site",
      to: "/admin/conteudo",
      icon: FileText,
      desc: "Editar textos institucionais e CTAs.",
      color: "bg-violet-100 text-violet-700",
    },
    {
      label: "Configurações",
      to: "/admin/configuracoes",
      icon: Settings,
      desc: "Contato, redes sociais, SEO e dados da empresa.",
      color: "bg-blue-100 text-blue-700",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Banner topo com gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0F1357] via-[#15186B] to-[#1A1F8F] text-white">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-conecta-orange/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" />
        </div>
        <div className="relative px-5 sm:px-8 md:px-10 py-8 md:py-14 max-w-7xl">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="min-w-0 flex-1">
              <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-white/60 font-mono">
                {new Date().toLocaleDateString("pt-BR", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-serif leading-[1.1] max-w-2xl">
                Bem-vindo de volta, {displayName}.
              </h1>
              <p className="mt-3 text-sm sm:text-base text-white/75 max-w-xl">
                Aqui você gerencia o catálogo, o blog editorial, eventos e a
                comunicação com clientes da Conecta.
              </p>
            </div>
            {postsPendentes.length > 0 && (
              <Link
                to="/admin/blog"
                className="inline-flex items-center gap-2 rounded-full bg-conecta-orange hover:bg-conecta-orange-light text-white px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium shadow-lg shadow-conecta-orange/30 transition-all hover:-translate-y-0.5"
              >
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {postsPendentes.length}{" "}
                  {postsPendentes.length === 1
                    ? "post aguarda"
                    : "posts aguardam"}{" "}
                  moderação
                </span>
                <span className="sm:hidden">{postsPendentes.length} pendentes</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 md:px-10 py-6 sm:py-8 md:py-10 max-w-7xl space-y-8 sm:space-y-10">
        {/* Stats */}
        <section>
          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft">
                Resumo geral
              </h2>
              <p className="mt-1 text-2xl font-serif text-ink">
                O que está acontecendo agora
              </p>
            </div>
            <div className="hidden md:flex items-center gap-1 text-xs text-ink-soft">
              <TrendingUp className="h-3.5 w-3.5" />
              dados em tempo real
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {stats.map((it) => (
              <StatCard key={it.label} {...it} />
            ))}
          </div>
        </section>

        {/* Posts pendentes */}
        {postsPendentes.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-5">
              <div>
                <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft">
                  Aguardando ação
                </h2>
                <p className="mt-1 text-2xl font-serif text-ink">
                  Posts submetidos para moderação
                </p>
              </div>
              <Link
                to="/admin/blog"
                className="text-sm text-conecta-blue hover:underline inline-flex items-center gap-1"
              >
                Ver todos <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="bg-paper border border-line rounded-2xl overflow-hidden shadow-sm">
              <div className="divide-y divide-line">
                {postsPendentes.slice(0, 5).map((post) => (
                  <PendingPostRow key={post.id} post={post} />
                ))}
              </div>
              {postsPendentes.length > 5 && (
                <div className="px-5 py-3 text-xs text-ink-soft bg-bone/60">
                  + {postsPendentes.length - 5} submissões adicionais em fila.
                </div>
              )}
            </div>
          </section>
        )}

        {/* Atalhos */}
        <section>
          <div className="mb-5">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft">
              Atalhos
            </h2>
            <p className="mt-1 text-2xl font-serif text-ink">
              Personalize o site rapidamente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {shortcuts.map((s) => (
              <Link
                key={s.to}
                to={s.to}
                className="group relative bg-paper border border-line rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-12px_rgba(10,10,10,0.12)] hover:border-conecta-blue/30"
              >
                <div
                  className={`inline-flex h-12 w-12 rounded-xl items-center justify-center ${s.color} mb-4`}
                >
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-xl text-ink mb-1">{s.label}</h3>
                <p className="text-sm text-ink-soft leading-snug">{s.desc}</p>
                <ArrowRight className="absolute top-6 right-6 h-4 w-4 text-ink-soft opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </section>

        {/* Nota dev */}
        <section>
          <div className="rounded-2xl border border-line bg-gradient-to-br from-bone to-paper px-6 py-5 text-sm text-ink-soft flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-ink mb-1">Dados em produção</p>
              <p>
                Catálogo com {totalProdutos} produtos. Todas as alterações do
                admin (catálogo, blog, eventos, textos e configurações) são
                salvas no banco{" "}
                <code className="bg-bone px-1.5 py-0.5 rounded text-xs font-mono">
                  Supabase
                </code>{" "}
                e refletem no site público em tempo real.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// ─── Componentes ────────────────────────────────────────────────────────────

type StatTone = "blue" | "orange" | "amber" | "violet" | "rose" | "slate";

const TONE_STYLES: Record<
  StatTone,
  { bg: string; icon: string; ring: string; value: string }
> = {
  blue: {
    bg: "bg-gradient-to-br from-blue-50 to-paper",
    icon: "bg-blue-500 text-white",
    ring: "hover:border-blue-300",
    value: "text-blue-900",
  },
  orange: {
    bg: "bg-gradient-to-br from-orange-50 to-paper",
    icon: "bg-conecta-orange text-white",
    ring: "hover:border-orange-300",
    value: "text-orange-900",
  },
  amber: {
    bg: "bg-gradient-to-br from-amber-50 to-paper",
    icon: "bg-amber-500 text-white",
    ring: "hover:border-amber-300",
    value: "text-amber-900",
  },
  violet: {
    bg: "bg-gradient-to-br from-violet-50 to-paper",
    icon: "bg-violet-500 text-white",
    ring: "hover:border-violet-300",
    value: "text-violet-900",
  },
  rose: {
    bg: "bg-gradient-to-br from-rose-50 to-paper",
    icon: "bg-rose-500 text-white",
    ring: "hover:border-rose-300",
    value: "text-rose-900",
  },
  slate: {
    bg: "bg-gradient-to-br from-slate-50 to-paper",
    icon: "bg-slate-500 text-white",
    ring: "hover:border-slate-300",
    value: "text-slate-900",
  },
};

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  to,
  tone,
  pill,
}: {
  label: string;
  value: number;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
  to: string;
  tone: StatTone;
  pill?: string;
}) {
  const t = TONE_STYLES[tone];
  return (
    <Link
      to={to}
      className={`group relative block rounded-2xl border border-line ${t.bg} ${t.ring} p-5 transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-12px_rgba(10,10,10,0.10)]`}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={`h-10 w-10 rounded-xl flex items-center justify-center ${t.icon} shadow-sm`}
        >
          <Icon className="h-5 w-5" />
        </div>
        {pill && (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider bg-amber-100 text-amber-900 rounded-full px-2 py-0.5">
            <Clock className="h-2.5 w-2.5" />
            {pill}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className={`text-4xl font-serif leading-none ${t.value}`}>{value}</p>
        <p className="mt-2 text-sm font-medium text-ink">{label}</p>
        <p className="text-xs text-ink-soft mt-0.5">{sub}</p>
      </div>
      <ArrowRight className="absolute bottom-5 right-5 h-4 w-4 text-ink-soft opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
    </Link>
  );
}

function PendingPostRow({ post }: { post: BlogPost }) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 hover:bg-bone/40 transition-colors">
      <img
        src={post.capa_url ?? "/placeholder.svg"}
        alt=""
        className="h-14 w-20 rounded-lg object-cover bg-bone shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-amber-900 bg-amber-100 rounded-full px-2 py-0.5">
            <Clock className="h-2.5 w-2.5" /> Pendente
          </span>
          <span className="text-xs text-ink-soft">{formatDate(post.created_at)}</span>
        </div>
        <p className="font-medium text-sm text-ink line-clamp-1">{post.titulo}</p>
        <p className="text-xs text-ink-soft line-clamp-1 mt-0.5">
          por {post.autor_nome}
        </p>
      </div>
      <Link
        to="/admin/blog"
        className="inline-flex items-center gap-1 rounded-full bg-conecta-blue hover:bg-conecta-blue-deep text-white text-xs font-medium px-4 py-2 transition-colors shrink-0"
      >
        Moderar
        <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
