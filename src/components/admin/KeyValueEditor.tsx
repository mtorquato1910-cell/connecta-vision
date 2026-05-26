import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Save, Plus } from "lucide-react";

type Row = { chave: string; valor: unknown; updated_at: string };

export function KeyValueEditor({
  title,
  subtitle,
  kicker,
  queryKey,
  listFn,
  upsertFn,
  deleteFn,
  suggestions = [],
}: {
  title: string;
  subtitle: string;
  kicker: string;
  queryKey: string;
  listFn: () => Promise<unknown>;
  upsertFn: (args: { data: { chave: string; valor: unknown } }) => Promise<unknown>;
  deleteFn: (args: { data: { chave: string } }) => Promise<unknown>;
  suggestions?: { chave: string; valor: unknown; descricao?: string }[];
}) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin", queryKey], queryFn: () => listFn() });
  const upsert = useMutation({
    mutationFn: (v: { chave: string; valor: unknown }) => upsertFn({ data: v }),
    onSuccess: () => {
      toast.success("Salvo.");
      qc.invalidateQueries({ queryKey: ["admin", queryKey] });
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Erro ao salvar."),
  });
  const remove = useMutation({
    mutationFn: (chave: string) => deleteFn({ data: { chave } }),
    onSuccess: () => {
      toast.success("Removido.");
      qc.invalidateQueries({ queryKey: ["admin", queryKey] });
    },
  });

  const [novaChave, setNovaChave] = useState("");
  const rows = (data as Row[] | undefined) ?? [];

  return (
    <div className="p-8 space-y-6">
      <header>
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{kicker}</div>
        <h1 className="text-3xl font-semibold mt-1">{title}</h1>
        <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>
      </header>

      <Card className="p-5 space-y-3">
        <div className="text-sm font-medium">Adicionar novo registro</div>
        <div className="flex gap-2 flex-wrap">
          <Input
            placeholder="chave.exemplo"
            value={novaChave}
            onChange={(e) => setNovaChave(e.target.value)}
            className="max-w-xs"
          />
          <Button
            onClick={() => {
              const k = novaChave.trim();
              if (!k) return;
              upsert.mutate({ chave: k, valor: {} });
              setNovaChave("");
            }}
          >
            <Plus className="h-4 w-4 mr-1" /> Adicionar
          </Button>
        </div>
        {suggestions.length > 0 && (
          <div className="pt-2">
            <div className="text-xs text-muted-foreground mb-2">Modelos sugeridos:</div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <Button
                  key={s.chave}
                  size="sm"
                  variant="outline"
                  onClick={() => upsert.mutate({ chave: s.chave, valor: s.valor })}
                  disabled={rows.some((r) => r.chave === s.chave)}
                  title={s.descricao}
                >
                  {s.chave}
                </Button>
              ))}
            </div>
          </div>
        )}
      </Card>

      <div className="space-y-3">
        {isLoading && <Card className="p-6 text-sm text-muted-foreground">Carregando...</Card>}
        {!isLoading && rows.length === 0 && (
          <Card className="p-12 text-center text-sm text-muted-foreground">
            Nenhum registro ainda. Adicione um modelo sugerido ou crie uma nova chave.
          </Card>
        )}
        {rows.map((r) => (
          <KvRow
            key={r.chave}
            row={r}
            onSave={(valor) => upsert.mutate({ chave: r.chave, valor })}
            onDelete={() => remove.mutate(r.chave)}
          />
        ))}
      </div>
    </div>
  );
}

function KvRow({
  row,
  onSave,
  onDelete,
}: {
  row: Row;
  onSave: (valor: unknown) => void;
  onDelete: () => void;
}) {
  const [text, setText] = useState(() => JSON.stringify(row.valor, null, 2));
  const [err, setErr] = useState<string | null>(null);

  return (
    <Card className="p-5 space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <Label className="text-base font-medium">{row.chave}</Label>
          <div className="text-xs text-muted-foreground">
            Atualizado em {new Date(row.updated_at).toLocaleString("pt-BR")}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => {
              try {
                const v = JSON.parse(text);
                setErr(null);
                onSave(v);
              } catch (e) {
                setErr(e instanceof Error ? e.message : "JSON inválido");
              }
            }}
          >
            <Save className="h-3.5 w-3.5 mr-1" /> Salvar
          </Button>
          <Button size="sm" variant="ghost" onClick={onDelete}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={Math.min(20, Math.max(4, text.split("\n").length))}
        className="font-mono text-xs"
      />
      {err && <div className="text-xs text-destructive">{err}</div>}
    </Card>
  );
}
