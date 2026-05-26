import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { dashboardStats } from "@/lib/admin.functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, FolderTree, Inbox, Sparkles } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const fn = useServerFn(dashboardStats);
  const { data, isLoading } = useQuery({ queryKey: ["admin", "stats"], queryFn: () => fn() });

  const items = [
    { label: "Produtos", value: data?.produtos ?? 0, icon: Package },
    { label: "Categorias", value: data?.categorias ?? 0, icon: FolderTree },
    { label: "Orçamentos", value: data?.orcamentos ?? 0, icon: Inbox },
    { label: "Novos pedidos", value: data?.orcamentosNovos ?? 0, icon: Sparkles },
  ];

  return (
    <div className="p-8 space-y-8">
      <header>
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Painel</div>
        <h1 className="text-3xl font-semibold mt-1">Visão geral</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Resumo do catálogo e da caixa de orçamentos.
        </p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((it) => (
          <Card key={it.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{it.label}</CardTitle>
              <it.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{isLoading ? "—" : it.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
