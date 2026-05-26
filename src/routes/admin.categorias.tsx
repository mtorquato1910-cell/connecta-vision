import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import {
  listAllCategorias,
  upsertCategoria,
  deleteCategoria,
} from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pencil, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/categorias")({
  component: AdminCategorias,
});

type Cat = {
  id: string;
  slug: string;
  nome: string;
  numero: string;
  descricao: string | null;
  imagem_url: string | null;
  ordem: number;
};

function AdminCategorias() {
  const listFn = useServerFn(listAllCategorias);
  const upsertFn = useServerFn(upsertCategoria);
  const deleteFn = useServerFn(deleteCategoria);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin", "categorias"], queryFn: () => listFn() });

  const remove = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Categoria removida.");
      qc.invalidateQueries({ queryKey: ["admin", "categorias"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="p-8 space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Catálogo</div>
          <h1 className="text-3xl font-semibold mt-1">Categorias</h1>
        </div>
        <CategoriaDialog
          trigger={<Button><Plus className="h-4 w-4 mr-2" />Nova categoria</Button>}
          onSave={async (v) => {
            await upsertFn({ data: v });
            qc.invalidateQueries({ queryKey: ["admin", "categorias"] });
            toast.success("Categoria salva.");
          }}
        />
      </header>

      <Card>
        <div className="divide-y">
          {isLoading && <div className="p-6 text-sm text-muted-foreground">Carregando...</div>}
          {(data as Cat[] | undefined)?.map((c) => (
            <div key={c.id} className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-xs font-mono">
                {c.numero}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium">{c.nome}</div>
                <div className="text-xs text-muted-foreground truncate">/{c.slug}</div>
              </div>
              <div className="flex gap-2">
                <CategoriaDialog
                  initial={c}
                  trigger={
                    <Button variant="outline" size="sm">
                      <Pencil className="h-3.5 w-3.5 mr-1" />Editar
                    </Button>
                  }
                  onSave={async (v) => {
                    await upsertFn({ data: { ...v, id: c.id } });
                    qc.invalidateQueries({ queryKey: ["admin", "categorias"] });
                    toast.success("Categoria atualizada.");
                  }}
                />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remover categoria?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação é irreversível. Produtos vinculados precisarão de nova categoria.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => remove.mutate(c.id)}>Remover</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

type CatForm = Omit<Cat, "id"> & { id?: string };

function CategoriaDialog({
  initial,
  trigger,
  onSave,
}: {
  initial?: Cat;
  trigger: React.ReactNode;
  onSave: (v: CatForm) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CatForm>(
    initial ?? { slug: "", nome: "", numero: "", descricao: "", imagem_url: "", ordem: 0 },
  );
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        ...form,
        descricao: form.descricao || null,
        imagem_url: form.imagem_url || null,
      });
      setOpen(false);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? "Editar categoria" : "Nova categoria"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nome" value={form.nome} onChange={(v) => setForm({ ...form, nome: v })} required />
            <Field
              label="Número"
              value={form.numero}
              onChange={(v) => setForm({ ...form, numero: v })}
              required
            />
          </div>
          <Field
            label="Slug"
            value={form.slug}
            onChange={(v) => setForm({ ...form, slug: v.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
            required
          />
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea
              value={form.descricao ?? ""}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              rows={3}
            />
          </div>
          <Field
            label="Imagem (URL)"
            value={form.imagem_url ?? ""}
            onChange={(v) => setForm({ ...form, imagem_url: v })}
          />
          <Field
            label="Ordem"
            type="number"
            value={String(form.ordem)}
            onChange={(v) => setForm({ ...form, ordem: parseInt(v) || 0 })}
          />
          <DialogFooter>
            <Button type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} />
    </div>
  );
}
