import { useRef, useState } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BUCKET = "produtos";
const MAX_MB = 8;
const ACCEPT = "image/png,image/jpeg,image/jpg,image/webp";

async function uploadToBucket(file: File, folder: string): Promise<string> {
  if (!ACCEPT.split(",").includes(file.type)) {
    throw new Error("Formato inválido. Use PNG, JPG ou WEBP.");
  }
  if (file.size > MAX_MB * 1024 * 1024) {
    throw new Error(`Arquivo muito grande. Máximo ${MAX_MB}MB.`);
  }
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const name = `${crypto.randomUUID()}.${ext}`;
  const path = `${folder}/${name}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type,
  });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/* ---------- Upload de imagem única (capa) ---------- */
export function ImageUpload({
  value,
  onChange,
  folder = "produtos",
  label = "Imagem de capa",
  aspect = "aspect-[4/3]",
}: {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  aspect?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const url = await uploadToBucket(file, folder);
      onChange(url);
      toast.success("Imagem enviada.");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-3">
        <div
          className={`${aspect} w-44 shrink-0 rounded-md border bg-muted relative overflow-hidden flex items-center justify-center`}
        >
          {value ? (
            <img src={value} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
          )}
          {busy && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2 min-w-0">
          <div className="flex gap-2">
            <input
              ref={ref}
              type="file"
              accept={ACCEPT}
              className="hidden"
              onChange={pick}
            />
            <Button type="button" variant="outline" size="sm" onClick={() => ref.current?.click()} disabled={busy}>
              <Upload className="h-3.5 w-3.5 mr-2" />
              {value ? "Trocar imagem" : "Enviar PNG/JPG"}
            </Button>
            {value && (
              <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
                <X className="h-3.5 w-3.5 mr-1" />Remover
              </Button>
            )}
          </div>
          <div className="text-[11px] text-muted-foreground">
            PNG, JPG ou WEBP até {MAX_MB}MB. Recomendado 1200×900.
          </div>
          <Input
            placeholder="…ou cole uma URL"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

/* ---------- Upload da galeria (várias imagens) ---------- */
export function GalleryUpload({
  value,
  onChange,
  folder = "produtos/galeria",
  label = "Galeria do produto",
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  label?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function pickMany(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setBusy(true);
    try {
      const urls: string[] = [];
      for (const f of files) {
        urls.push(await uploadToBucket(f, folder));
      }
      onChange([...value, ...urls]);
      toast.success(`${urls.length} imagem(ns) enviada(s).`);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  }

  function remove(i: number) {
    const next = [...value];
    next.splice(i, 1);
    onChange(next);
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <span className="text-[11px] text-muted-foreground">{value.length} imagem(ns)</span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {value.map((url, i) => (
          <div key={`${url}-${i}`} className="relative aspect-square rounded-md overflow-hidden bg-muted group border">
            <img src={url} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition">
              <button
                type="button"
                onClick={() => remove(i)}
                className="bg-black/70 text-white rounded p-1 hover:bg-red-600"
                title="Remover"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <div className="absolute bottom-1 left-1 right-1 flex justify-between opacity-0 group-hover:opacity-100 transition">
              <button
                type="button"
                onClick={() => move(i, -1)}
                className="bg-black/70 text-white text-[10px] rounded px-1.5 py-0.5 hover:bg-black"
                title="Mover para esquerda"
              >
                ←
              </button>
              <span className="bg-black/70 text-white text-[10px] rounded px-1.5 py-0.5 font-mono">{i + 1}</span>
              <button
                type="button"
                onClick={() => move(i, 1)}
                className="bg-black/70 text-white text-[10px] rounded px-1.5 py-0.5 hover:bg-black"
                title="Mover para direita"
              >
                →
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={busy}
          className="aspect-square rounded-md border-2 border-dashed flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground hover:border-primary hover:text-primary transition disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {busy ? "Enviando..." : "Adicionar"}
        </button>
      </div>

      <input
        ref={ref}
        type="file"
        accept={ACCEPT}
        multiple
        className="hidden"
        onChange={pickMany}
      />
      <div className="text-[11px] text-muted-foreground">
        Selecione um ou vários arquivos. PNG, JPG ou WEBP até {MAX_MB}MB cada.
      </div>
    </div>
  );
}
