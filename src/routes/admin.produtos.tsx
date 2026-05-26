import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import {
  listAllProdutos,
  getProdutoAdmin,
  upsertProduto,
  deleteProduto,
  listAllCategorias,
} from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { ImageUpload, GalleryUpload } from "@/components/admin/ImageUpload";

export const Route = createFileRoute("/admin/produtos")({
  component: AdminProdutos,
});

type ProdList = {
  id: string;
  slug: string;
  modelo: string;
  nome: string;
  imagem_url: string | null;
  destaque: boolean;
  publicado: boolean;
  ordem: number;
  categoria_id: string;
  categoria_nome: string;
};

function AdminProdutos() {
  const listFn = useServerFn(listAllProdutos);
  const catsFn = useServerFn(listAllCategorias);
  const deleteFn = useServerFn(deleteProduto);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin", "produtos"], queryFn: () => listFn() });
  const { data: cats } = useQuery({ queryKey: ["admin", "categorias"], queryFn: () => catsFn() });

  const remove = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Produto removido.");
      qc.invalidateQueries({ queryKey: ["admin", "produtos"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="p-8 space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Catálogo</div>
          <h1 className="text-3xl font-semibold mt-1">Produtos</h1>
        </div>
        <ProdutoDialog
          categorias={(cats as { id: string; nome: string }[] | undefined) ?? []}
          trigger={<Button><Plus className="h-4 w-4 mr-2" />Novo produto</Button>}
        />
      </header>

      <Card>
        <div className="divide-y">
          {isLoading && <div className="p-6 text-sm text-muted-foreground">Carregando...</div>}
          {(data as ProdList[] | undefined)?.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-4">
              <div className="w-14 h-14 rounded bg-muted overflow-hidden">
                {p.imagem_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imagem_url} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{p.nome}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {p.modelo} · {p.categoria_nome}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {p.destaque && <Badge variant="secondary">Destaque</Badge>}
                {!p.publicado && <Badge variant="outline">Rascunho</Badge>}
              </div>
              <div className="flex gap-2">
                <ProdutoDialog
                  produtoId={p.id}
                  categorias={(cats as { id: string; nome: string }[] | undefined) ?? []}
                  trigger={
                    <Button variant="outline" size="sm">
                      <Pencil className="h-3.5 w-3.5 mr-1" />Editar
                    </Button>
                  }
                />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remover produto?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação é irreversível.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => remove.mutate(p.id)}>Remover</AlertDialogAction>
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

type ProdForm = {
  id?: string;
  slug: string;
  modelo: string;
  nome: string;
  categoria_id: string;
  imagem_url: string;
  resumo: string;
  descricao: string;
  galeria: string[];
  diferenciais: string;
  aplicacoes: string;
  especificacoes: string;
  destaque: boolean;
  publicado: boolean;
  ordem: number;
};

const EMPTY: ProdForm = {
  slug: "",
  modelo: "",
  nome: "",
  categoria_id: "",
  imagem_url: "",
  resumo: "",
  descricao: "",
  galeria: [],
  diferenciais: "",
  aplicacoes: "",
  especificacoes: "",
  destaque: false,
  publicado: true,
  ordem: 0,
};

function ProdutoDialog({
  produtoId,
  categorias,
  trigger,
}: {
  produtoId?: string;
  categorias: { id: string; nome: string }[];
  trigger: React.ReactNode;
}) {
  const getFn = useServerFn(getProdutoAdmin);
  const upsertFn = useServerFn(upsertProduto);
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ProdForm>(EMPTY);
  const [saving, setSaving] = useState(false);

  async function handleOpen(next: boolean) {
    setOpen(next);
    if (next && produtoId) {
      const row: any = await getFn({ data: { id: produtoId } });
      if (row) {
        setForm({
          id: row.id,
          slug: row.slug,
          modelo: row.modelo,
          nome: row.nome,
          categoria_id: row.categoria_id,
          imagem_url: row.imagem_url ?? "",
          resumo: row.resumo ?? "",
          descricao: row.descricao ?? "",
          galeria: (row.galeria ?? []).join("\n"),
          diferenciais: (row.diferenciais ?? []).join("\n"),
          aplicacoes: (row.aplicacoes ?? []).join("\n"),
          especificacoes: (row.especificacoes ?? [])
            .map((e: any) => `${e.label}: ${e.valor}`)
            .join("\n"),
          destaque: !!row.destaque,
          publicado: !!row.publicado,
          ordem: row.ordem ?? 0,
        });
      }
    } else if (next) {
      setForm({ ...EMPTY, categoria_id: categorias[0]?.id ?? "" });
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const linhas = (s: string) => s.split("\n").map((l) => l.trim()).filter(Boolean);
      const especs = linhas(form.especificacoes).map((l) => {
        const [label, ...rest] = l.split(":");
        return { label: label.trim(), valor: rest.join(":").trim() };
      }).filter((e) => e.label && e.valor);

      await upsertFn({
        data: {
          id: form.id,
          slug: form.slug,
          modelo: form.modelo,
          nome: form.nome,
          categoria_id: form.categoria_id,
          imagem_url: form.imagem_url || null,
          resumo: form.resumo || null,
          descricao: form.descricao || null,
          galeria: linhas(form.galeria),
          diferenciais: linhas(form.diferenciais),
          aplicacoes: linhas(form.aplicacoes),
          especificacoes: especs,
          destaque: form.destaque,
          publicado: form.publicado,
          ordem: form.ordem,
        },
      });
      qc.invalidateQueries({ queryKey: ["admin", "produtos"] });
      toast.success("Produto salvo.");
      setOpen(false);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{produtoId ? "Editar produto" : "Novo produto"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FieldText label="Nome" value={form.nome} onChange={(v) => setForm({ ...form, nome: v })} required />
            <FieldText label="Modelo" value={form.modelo} onChange={(v) => setForm({ ...form, modelo: v })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FieldText
              label="Slug"
              value={form.slug}
              onChange={(v) => setForm({ ...form, slug: v.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
              required
            />
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={form.categoria_id} onValueChange={(v) => setForm({ ...form, categoria_id: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {categorias.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <FieldText label="Imagem principal (URL)" value={form.imagem_url} onChange={(v) => setForm({ ...form, imagem_url: v })} />
          <FieldArea label="Resumo" value={form.resumo} onChange={(v) => setForm({ ...form, resumo: v })} rows={2} />
          <FieldArea label="Descrição" value={form.descricao} onChange={(v) => setForm({ ...form, descricao: v })} rows={4} />
          <FieldArea label="Galeria (uma URL por linha)" value={form.galeria} onChange={(v) => setForm({ ...form, galeria: v })} rows={3} />
          <FieldArea label="Diferenciais (um por linha)" value={form.diferenciais} onChange={(v) => setForm({ ...form, diferenciais: v })} rows={3} />
          <FieldArea label="Aplicações (uma por linha)" value={form.aplicacoes} onChange={(v) => setForm({ ...form, aplicacoes: v })} rows={3} />
          <FieldArea
            label="Especificações (formato `Rótulo: valor` por linha)"
            value={form.especificacoes}
            onChange={(v) => setForm({ ...form, especificacoes: v })}
            rows={5}
          />
          <div className="grid grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label>Ordem</Label>
              <Input type="number" value={form.ordem} onChange={(e) => setForm({ ...form, ordem: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.destaque} onCheckedChange={(v) => setForm({ ...form, destaque: v })} />
              <Label>Destaque</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.publicado} onCheckedChange={(v) => setForm({ ...form, publicado: v })} />
              <Label>Publicado</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={saving}>{saving ? "Salvando..." : "Salvar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FieldText({ label, value, onChange, required }: { label: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} required={required} />
    </div>
  );
}

function FieldArea({ label, value, onChange, rows }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} />
    </div>
  );
}
