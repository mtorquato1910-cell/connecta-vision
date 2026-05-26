import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { listFormularios, updateFormulario, deleteFormulario } from "@/lib/admin.functions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Mail, Phone, MapPin, Building2, CheckCheck } from "lucide-react";

export const Route = createFileRoute("/admin/formularios")({
  component: AdminFormularios,
});

type Form = {
  id: string;
  tipo: string;
  nome: string;
  email: string;
  telefone: string | null;
  empresa: string | null;
  cidade: string | null;
  mensagem: string | null;
  origem: string | null;
  status: string;
  lido: boolean;
  payload: Record<string, unknown>;
  created_at: string;
};

const STATUS = ["novo", "em_andamento", "concluido", "arquivado"] as const;
const STATUS_LABEL: Record<string, string> = {
  novo: "Novo",
  em_andamento: "Em andamento",
  concluido: "Concluído",
  arquivado: "Arquivado",
};

function AdminFormularios() {
  const listFn = useServerFn(listFormularios);
  const updateFn = useServerFn(updateFormulario);
  const deleteFn = useServerFn(deleteFormulario);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin", "formularios"], queryFn: () => listFn() });

  const update = useMutation({
    mutationFn: (v: { id: string; status?: string; lido?: boolean }) => updateFn({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "formularios"] }),
  });
  const remove = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Formulário removido.");
      qc.invalidateQueries({ queryKey: ["admin", "formularios"] });
    },
  });

  return (
    <div className="p-8 space-y-6">
      <header>
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Inbox</div>
        <h1 className="text-3xl font-semibold mt-1">Formulários</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Todas as mensagens enviadas pelos formulários do site.
        </p>
      </header>

      <div className="space-y-3">
        {isLoading && <Card className="p-6 text-sm text-muted-foreground">Carregando...</Card>}
        {(data as Form[] | undefined)?.length === 0 && (
          <Card className="p-12 text-center text-sm text-muted-foreground">
            Nenhum formulário recebido ainda.
          </Card>
        )}
        {(data as Form[] | undefined)?.map((o) => (
          <Card key={o.id} className={`p-5 ${o.lido ? "opacity-80" : ""}`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold">{o.nome}</h3>
                  <Badge variant="outline">{o.tipo}</Badge>
                  <Badge>{STATUS_LABEL[o.status] ?? o.status}</Badge>
                  {!o.lido && <Badge variant="secondary">Não lido</Badge>}
                  <span className="text-xs text-muted-foreground">
                    {new Date(o.created_at).toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground pt-2">
                  <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{o.email}</span>
                  {o.telefone && <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{o.telefone}</span>}
                  {o.empresa && <span className="inline-flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{o.empresa}</span>}
                  {o.cidade && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{o.cidade}</span>}
                </div>
                {o.mensagem && (
                  <p className="text-sm mt-3 bg-muted/50 rounded p-3 whitespace-pre-wrap">{o.mensagem}</p>
                )}
                {o.origem && (
                  <div className="text-xs text-muted-foreground pt-2">Origem: {o.origem}</div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={o.status}
                  onValueChange={(v) => update.mutate({ id: o.id, status: v })}
                >
                  <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUS.map((s) => (
                      <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!o.lido && (
                  <Button variant="outline" size="sm" onClick={() => update.mutate({ id: o.id, lido: true })}>
                    <CheckCheck className="h-3.5 w-3.5" />
                  </Button>
                )}
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
