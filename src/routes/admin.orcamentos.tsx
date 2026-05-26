import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { listOrcamentos, updateOrcamentoStatus, deleteOrcamento } from "@/lib/admin.functions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Mail, Phone, MapPin, Building2 } from "lucide-react";

export const Route = createFileRoute("/admin/orcamentos")({
  component: AdminOrcamentos,
});

type Status = "novo" | "em_andamento" | "concluido" | "arquivado";

type Orc = {
  id: string;
  produto_nome: string | null;
  produto_slug: string | null;
  nome: string;
  email: string;
  telefone: string;
  clinica: string | null;
  cidade: string | null;
  mensagem: string | null;
  status: Status;
  origem: string | null;
  created_at: string;
};

const STATUS_LABEL: Record<Status, string> = {
  novo: "Novo",
  em_andamento: "Em andamento",
  concluido: "Concluído",
  arquivado: "Arquivado",
};

const STATUS_VARIANT: Record<Status, "default" | "secondary" | "outline"> = {
  novo: "default",
  em_andamento: "secondary",
  concluido: "outline",
  arquivado: "outline",
};

function AdminOrcamentos() {
  const listFn = useServerFn(listOrcamentos);
  const updateFn = useServerFn(updateOrcamentoStatus);
  const deleteFn = useServerFn(deleteOrcamento);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin", "orcamentos"], queryFn: () => listFn() });

  const update = useMutation({
    mutationFn: (v: { id: string; status: Status }) => updateFn({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "orcamentos"] }),
  });
  const remove = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Orçamento removido.");
      qc.invalidateQueries({ queryKey: ["admin", "orcamentos"] });
    },
  });

  return (
    <div className="p-8 space-y-6">
      <header>
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Pipeline</div>
        <h1 className="text-3xl font-semibold mt-1">Orçamentos</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Pedidos recebidos via formulário do site.
        </p>
      </header>

      <div className="space-y-3">
        {isLoading && <Card className="p-6 text-sm text-muted-foreground">Carregando...</Card>}
        {(data as Orc[] | undefined)?.length === 0 && (
          <Card className="p-12 text-center text-sm text-muted-foreground">
            Nenhum orçamento ainda. Quando o site receber pedidos, eles aparecem aqui.
          </Card>
        )}
        {(data as Orc[] | undefined)?.map((o) => (
          <Card key={o.id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold">{o.nome}</h3>
                  <Badge variant={STATUS_VARIANT[o.status]}>{STATUS_LABEL[o.status]}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(o.created_at).toLocaleString("pt-BR")}
                  </span>
                </div>
                {o.produto_nome && (
                  <div className="text-sm text-muted-foreground">
                    Interesse: <span className="text-foreground">{o.produto_nome}</span>
                  </div>
                )}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground pt-2">
                  <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{o.email}</span>
                  <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{o.telefone}</span>
                  {o.clinica && <span className="inline-flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{o.clinica}</span>}
                  {o.cidade && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{o.cidade}</span>}
                </div>
                {o.mensagem && (
                  <p className="text-sm mt-3 bg-muted/50 rounded p-3 whitespace-pre-wrap">{o.mensagem}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={o.status}
                  onValueChange={(v) => update.mutate({ id: o.id, status: v as Status })}
                >
                  <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.keys(STATUS_LABEL) as Status[]).map((s) => (
                      <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="sm" onClick={() => remove.mutate(o.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
