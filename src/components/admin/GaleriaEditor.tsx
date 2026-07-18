import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  ACCEPTED_IMAGE_EXTS,
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE_MB,
  processImageFile,
  type ImagePasta,
} from "@/lib/image-upload";
import { uploadImagem, uploadImagemPublica } from "@/lib/admin.functions";

/**
 * Editor de uma lista de imagens (SEM conceito de capa) — para o "card de baixo"
 * com as imagens adicionais do produto/post. Aceita upload (múltiplo) e URL,
 * com reordenar e remover. A capa é gerenciada separadamente por um ImageInput.
 */
export interface GaleriaEditorProps {
  imagens: string[];
  onChange: (next: string[]) => void;
  pasta?: ImagePasta;
  /** Quando true, usa o upload público (sem auth) — para formulários do site. */
  publico?: boolean;
}

export function GaleriaEditor({
  imagens,
  onChange,
  pasta = "produtos",
  publico = false,
}: GaleriaEditorProps) {
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const addUrls = () => {
    const urls = input
      .split(/[\s\n]+/)
      .map((u) => u.trim())
      .filter((u) => u && /^https?:\/\//i.test(u) && !imagens.includes(u));
    if (urls.length === 0) {
      toast.error("Cole uma ou mais URLs válidas (http://...) que ainda não estejam na lista.");
      return;
    }
    onChange([...imagens, ...urls]);
    setInput("");
  };

  const handleFiles = async (files: FileList | null) => {
    const valid = Array.from(files ?? []).filter((f) => ACCEPTED_IMAGE_TYPES.includes(f.type));
    if (valid.length === 0) {
      toast.error("Envie arquivos PNG, JPG ou WebP.");
      return;
    }
    setBusy(true);
    const added: string[] = [];
    for (const file of valid) {
      try {
        const dataUrl = await processImageFile(file);
        const { url } = publico
          ? await uploadImagemPublica({ data: { dataUrl } })
          : await uploadImagem({ data: { dataUrl, pasta } });
        added.push(url);
      } catch (e) {
        toast.error(`${file.name}: ${e instanceof Error ? e.message : "falha ao enviar"}`);
      }
    }
    if (added.length) {
      onChange([...imagens, ...added]);
      toast.success(
        `${added.length} ${added.length === 1 ? "imagem enviada" : "imagens enviadas"}.`,
      );
    }
    setBusy(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const move = (idx: number, dir: -1 | 1) => {
    const t = idx + dir;
    if (t < 0 || t >= imagens.length) return;
    const next = [...imagens];
    [next[idx], next[t]] = [next[t], next[idx]];
    onChange(next);
  };
  const remove = (idx: number) => onChange(imagens.filter((_, i) => i !== idx));

  return (
    <div
      className="space-y-3 relative"
      onDragEnter={(e) => {
        if (!e.dataTransfer.types.includes("Files")) return;
        e.preventDefault();
        dragCounter.current += 1;
        setDragOver(true);
      }}
      onDragOver={(e) => e.dataTransfer.types.includes("Files") && e.preventDefault()}
      onDragLeave={(e) => {
        e.preventDefault();
        dragCounter.current = Math.max(0, dragCounter.current - 1);
        if (dragCounter.current === 0) setDragOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        dragCounter.current = 0;
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      {dragOver && (
        <div className="absolute inset-0 z-20 rounded-xl border-2 border-dashed border-conecta-blue bg-conecta-blue/10 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none">
          <Upload className="h-8 w-8 text-conecta-blue" />
          <span className="mt-2 text-sm font-medium text-conecta-blue">Solte para adicionar</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addUrls();
            }
          }}
          placeholder="Cole a URL de uma imagem (Enter para adicionar)"
          className="input flex-1 min-w-0"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={addUrls}
            className="inline-flex items-center gap-1.5 rounded-lg bg-conecta-blue hover:bg-conecta-blue-deep text-white text-sm font-medium px-4 py-2 transition-colors whitespace-nowrap"
          >
            <ImagePlus className="h-4 w-4" /> URL
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-paper hover:bg-bone text-ink text-sm font-medium px-4 py-2 transition-colors whitespace-nowrap disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Enviar
          </button>
        </div>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept={ACCEPTED_IMAGE_EXTS}
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="text-xs text-ink-soft">
        Envie PNG/JPG/WebP (até {MAX_FILE_SIZE_MB} MB cada) ou cole URLs. Arraste os arquivos aqui.
      </p>

      {imagens.length === 0 ? (
        <div className="border border-dashed border-line bg-bone/40 rounded-xl py-8 text-center text-sm text-ink-soft">
          Nenhuma imagem adicional. (A capa é definida no card acima.)
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {imagens.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className="group relative bg-paper border border-line rounded-xl overflow-hidden"
            >
              <div className="aspect-square bg-bone">
                <img
                  src={url}
                  alt={`Imagem ${idx + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <span className="absolute top-2 left-2 inline-flex items-center rounded-full bg-paper/90 text-ink text-[10px] font-mono px-2 py-1">
                #{idx + 1}
              </span>
              <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => move(idx, -1)}
                  disabled={idx === 0}
                  aria-label="Mover para a esquerda"
                  className="h-7 w-7 rounded-md bg-paper/95 hover:bg-conecta-blue hover:text-white text-ink-soft flex items-center justify-center shadow-sm disabled:opacity-40"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => move(idx, 1)}
                  disabled={idx === imagens.length - 1}
                  aria-label="Mover para a direita"
                  className="h-7 w-7 rounded-md bg-paper/95 hover:bg-conecta-blue hover:text-white text-ink-soft flex items-center justify-center shadow-sm disabled:opacity-40"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  aria-label="Remover"
                  className="h-7 w-7 rounded-md bg-paper/95 hover:bg-red-600 hover:text-white text-ink-soft flex items-center justify-center shadow-sm"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
