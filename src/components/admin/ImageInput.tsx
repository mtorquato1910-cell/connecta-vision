import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  ACCEPTED_IMAGE_EXTS,
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE_MB,
  processImageFile,
} from "@/lib/image-upload";

export interface ImageInputProps {
  /** Valor atual: URL pública (http://...) ou data URL (base64). */
  value: string;
  /** Disparado com a nova URL/data URL ou string vazia ao remover. */
  onChange: (value: string) => void;
  /** Texto curto explicativo. Ex.: "1200×630 recomendado para WhatsApp/LinkedIn". */
  hint?: string;
  /** Largura/altura máxima ao redimensionar (default 1600). */
  maxDimension?: number;
  /** Mostra um placeholder no input URL. */
  urlPlaceholder?: string;
}

/**
 * Input de imagem único — aceita URL externa OU upload de PNG/JPG/WebP do
 * desktop (clique, drag-and-drop). Resultado é sempre uma string (URL pública
 * ou data URL base64).
 *
 * Quando o storage real existir, basta trocar `processImageFile` por POST.
 */
export function ImageInput({
  value,
  onChange,
  hint,
  maxDimension,
  urlPlaceholder = "https://... (cole uma URL ou envie do computador)",
}: ImageInputProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const [urlDraft, setUrlDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Formato não suportado. Envie PNG, JPG ou WebP.");
      return;
    }
    setBusy(true);
    try {
      const dataUrl = await processImageFile(file, { maxDimension });
      onChange(dataUrl);
      toast.success("Imagem enviada.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Falha ao processar imagem.";
      toast.error(msg);
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const applyUrl = () => {
    const u = urlDraft.trim();
    if (!u) return;
    if (!/^https?:\/\//i.test(u)) {
      toast.error("Cole uma URL válida começando com http:// ou https://.");
      return;
    }
    onChange(u);
    setUrlDraft("");
  };

  const isUploaded = value.startsWith("data:");

  // Drag handlers no container raiz — funcionam sempre, tenha imagem ou não.
  const onDragEnter = (e: React.DragEvent) => {
    if (!e.dataTransfer.types.includes("Files")) return;
    e.preventDefault();
    dragCounter.current += 1;
    setDragOver(true);
  };
  const onDragOver = (e: React.DragEvent) => {
    if (!e.dataTransfer.types.includes("Files")) return;
    e.preventDefault();
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = Math.max(0, dragCounter.current - 1);
    if (dragCounter.current === 0) setDragOver(false);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      className="space-y-2 relative"
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* Overlay visual quando arrastando — cobre tudo */}
      {dragOver && (
        <div className="absolute inset-0 z-20 rounded-xl border-2 border-dashed border-conecta-blue bg-conecta-blue/10 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none">
          <Upload className="h-8 w-8 text-conecta-blue" />
          <span className="mt-2 text-sm font-medium text-conecta-blue">
            Solte a imagem para enviar
          </span>
          <span className="text-xs text-conecta-blue/80">PNG · JPG · WebP</span>
        </div>
      )}

      {/* Preview ou drop-zone */}
      {value ? (
        <div className="relative bg-bone rounded-xl border border-line overflow-hidden">
          <img
            src={value}
            alt="Pré-visualização"
            className="w-full max-h-56 object-contain bg-paper"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.opacity = "0.3";
            }}
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 h-8 w-8 rounded-md bg-paper/95 hover:bg-red-600 hover:text-white text-ink-soft flex items-center justify-center shadow-sm transition-colors"
            aria-label="Remover imagem"
            title="Remover"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          {isUploaded && (
            <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-conecta-blue text-white text-[10px] font-mono uppercase tracking-wider px-2 py-1">
              <Upload className="h-2.5 w-2.5" /> Enviada
            </span>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="w-full flex flex-col items-center justify-center gap-2 py-10 rounded-xl border-2 border-dashed border-line bg-bone/40 hover:border-conecta-blue hover:bg-conecta-blue/5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {busy ? (
            <Loader2 className="h-6 w-6 animate-spin text-conecta-blue" />
          ) : (
            <ImagePlus className="h-6 w-6 text-ink-soft" />
          )}
          <span className="text-sm text-ink">
            {busy ? "Processando..." : "Clique para enviar ou arraste a imagem aqui"}
          </span>
          <span className="text-xs text-ink-soft">
            PNG, JPG ou WebP · até {MAX_FILE_SIZE_MB} MB
          </span>
        </button>
      )}

      <input
        ref={fileRef}
        type="file"
        accept={ACCEPTED_IMAGE_EXTS}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Ações */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-line bg-paper hover:bg-bone text-ink text-sm font-medium px-3 py-2 transition-colors whitespace-nowrap disabled:opacity-60"
        >
          <Upload className="h-4 w-4" />
          {value ? "Trocar arquivo" : "Enviar do computador"}
        </button>
        <div className="flex gap-2 flex-1 min-w-0">
          <input
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyUrl();
              }
            }}
            placeholder={urlPlaceholder}
            className="input flex-1 min-w-0"
          />
          <button
            type="button"
            onClick={applyUrl}
            className="rounded-lg border border-line bg-paper hover:bg-bone text-ink text-sm font-medium px-3 py-2 transition-colors whitespace-nowrap"
          >
            Usar URL
          </button>
        </div>
      </div>

      {hint && <p className="text-xs text-ink-soft">{hint}</p>}
    </div>
  );
}
