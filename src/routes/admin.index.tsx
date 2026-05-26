import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { dashboardStats } from "@/lib/admin.functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, FolderTree, Inbox, Sparkles, MessageSquare, Mail, Home, Settings, FileText } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const fn = useServerFn(dashboardStats);
  const { data, isLoading } = useQuery({ queryKey: ["admin", "stats"], queryFn: () => fn() });

  const items = [
    { label: "Produtos", value: data?.produtos ?? 0, icon: Package, to: "/admin/produtos" },
    { label: "Categorias", value: data?.categorias ?? 0, icon: FolderTree, to: "/admin/categorias" },
    { label: "Orçamentos", value: data?.orcamentos ?? 0, icon: Inbox, to: "/admin/orcamentos" },
    { label: "Pedidos novos", value: data?.orcamentosNovos ?? 0, icon: Sparkles, to: "/admin/orcamentos" },
    { label: "Formulários", value: data?.formularios ?? 0, icon: MessageSquare, to: "/admin/formularios" },
    { label: "Mensagens novas", value: data?.formulariosNovos ?? 0, icon: Mail, to: "/admin/formularios" },
  ];

  const shortcuts = [
    { label: "Página inicial", to: "/admin/pagina-inicial", icon: Home, desc: "Ordene e ative blocos da home." },
    { label: "Conteúdo do site", to: "/admin/conteudo", icon: FileText, desc: "Edite textos institucionais." },
    { label: "Configurações", to: "/admin/configuracoes", icon: Settings, desc: "SEO, contato e redes sociais." },
  ];

  return (
    <div className="p-8 space-y-8">
      <header>
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Painel</div>
        <h1 className="text-3xl font-semibold mt-1">Visão geral</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Resumo do catálogo, orçamentos e mensagens recebidas.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {items.map((it) => (
          <Link key={it.label} to={it.to} className="block group">
            <Card className="transition hover:shadow-md hover:border-primary/40">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{it.label}</CardTitle>
                <it.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">{isLoading ? "—" : it.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <section>
        <h2 className="text-sm uppercase tracking-[0.18em] text-muted-foreground mb-3">Atalhos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {shortcuts.map((s) => (
            <Link key={s.to} to={s.to} className="block group">
              <Card className="h-full transition hover:shadow-md hover:border-primary/40">
                <CardHeader className="flex flex-row items-center gap-3">
                  <s.icon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">{s.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
