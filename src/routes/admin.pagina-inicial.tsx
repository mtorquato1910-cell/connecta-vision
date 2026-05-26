import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { listConteudo, upsertConteudo } from "@/lib/admin.functions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowUp, ArrowDown, Save } from "lucide-react";

export const Route = createFileRoute("/admin/pagina-inicial")({
  component: AdminHome,
});

type Bloco = { id: string; label: string; visivel: boolean };

const DEFAULT_BLOCOS: Bloco[] = [
  { id: "hero", label: "Hero principal", visivel: true },
  { id: "marcas", label: "Faixa de marcas / clientes", visivel: true },
  { id: "categorias", label: "Categorias de produtos", visivel: true },
  { id: "destaques", label: "Produtos em destaque", visivel: true },
  { id: "diferenciais", label: "Diferenciais da Conecta", visivel: true },
  { id: "depoimentos", label: "Depoimentos", visivel: true },
  { id: "cta", label: "Bloco de chamada (CTA)", visivel: true },
  { id: "contato", label: "Formulário de contato", visivel: true },
];

const CHAVE = "home.blocos";

function AdminHome() {
  const listFn = useServerFn(listConteudo);
  const upsertFn = useServerFn(upsertConteudo);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin", "conteudo"], queryFn: () => listFn() });

  const saved = useMemo<Bloco[] | null>(() => {
    const row = (data as { chave: string; valor: unknown }[] | undefined)?.find(
      (r) => r.chave === CHAVE,
    );
    if (!row) return null;
    const v = row.valor as { blocos?: unknown };
    if (!v || !Array.isArray(v.blocos)) return null;
    return v.blocos as Bloco[];
  }, [data]);

  const [blocos, setBlocos] = useState<Bloco[]>(DEFAULT_BLOCOS);

  useEffect(() => {
    if (!saved) return;
    // merge: keep saved order/visibility; append any new defaults at the end
    const byId = new Map(saved.map((b) => [b.id, b]));
    const merged: Bloco[] = [];
    for (const b of saved) {
      const def = DEFAULT_BLOCOS.find((d) => d.id === b.id);
      if (def) merged.push({ id: b.id, label: def.label, visivel: b.visivel });
    }
    for (const d of DEFAULT_BLOCOS) {
      if (!byId.has(d.id)) merged.push(d);
    }
    setBlocos(merged);
  }, [saved]);

  const save = useMutation({
    mutationFn: (b: Bloco[]) => upsertFn({ data: { chave: CHAVE, valor: { blocos: b } } }),
    onSuccess: () => {
      toast.success("Página inicial atualizada.");
      qc.invalidateQueries({ queryKey: ["admin", "conteudo"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro ao salvar."),
  });

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= blocos.length) return;
    const next = blocos.slice();
    [next[i], next[j]] = [next[j], next[i]];
    setBlocos(next);
  }

  function toggle(i: number, v: boolean) {
    const next = blocos.slice();
    next[i] = { ...next[i], visivel: v };
    setBlocos(next);
  }

  return (
    <div className="p-8 space-y-6">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Home</div>
          <h1 className="text-3xl font-semibold mt-1">Página inicial</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Ative, desative e reordene as seções exibidas na home. Salve para aplicar.
          </p>
        </div>
        <Button onClick={() => save.mutate(blocos)} disabled={save.isPending}>
          <Save className="h-4 w-4 mr-1" /> Salvar ordem
        </Button>
      </header>

      {isLoading ? (
        <Card className="p-6 text-sm text-muted-foreground">Carregando...</Card>
      ) : (
        <Card className="p-2">
          <ul className="divide-y">
            {blocos.map((b, i) => (
              <li key={b.id} className="flex items-center gap-3 px-4 py-3">
                <div className="text-xs w-6 text-muted-foreground tabular-nums">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{b.label}</div>
                  <div className="text-xs text-muted-foreground">{b.id}</div>
                </div>
                <Switch checked={b.visivel} onCheckedChange={(v) => toggle(i, v)} />
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => move(i, -1)} disabled={i === 0}>
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => move(i, 1)} disabled={i === blocos.length - 1}>
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <p className="text-xs text-muted-foreground">
        A ordem e visibilidade são lidas pela home a partir da chave <code>home.blocos</code> em
        Conteúdo do site.
      </p>
    </div>
  );
}
