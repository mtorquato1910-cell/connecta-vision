import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ImagePlus,
  Star,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

export interface ImagensEditorProps {
  /** URL da imagem principal (capa). */
  capa: string;
  /** Lista ordenada de URLs adicionais (sem incluir a capa). */
  galeria: string[];
  onChange: (next: { capa: string; galeria: string[] }) => void;
}

/**
 * Editor visual de imagens do produto.
 *
 * - Adiciona URL pela barra superior (Enter ou botão).
 * - Aceita várias URLs coladas de uma vez (separadas por nova linha ou espaço).
 * - A primeira imagem é sempre a CAPA (badge laranja).
 * - Botões por imagem: marcar como capa (★), mover ↑/↓, remover ×.
 *
 * Quando o servidor estiver pronto (Sprint 6), adicionar upload real
 * substituindo o input de URL — o estado interno fica idêntico.
 */
export function ImagensEditor({ capa, galeria, onChange }: ImagensEditorProps) {
  const [input, setInput] = useState("");

  // Lista unificada: capa em [0] + galeria depois
  const all = capa ? [capa, ...galeria.filter((u) => u !== capa)] : [...galeria];

  const setAll = (next: string[]) => {
    if (next.length === 0) {
      onChange({ capa: "", galeria: [] });
      return;
    }
    onChange({ capa: next[0]!, galeria: next.slice(1) });
  };

  const handleAdd = () => {
    const urls = input
      .split(/[\s\n]+/)
      .map((u) => u.trim())
      .filter((u) => u && /^https?:\/\//i.test(u));
    if (urls.length === 0) {
      toast.error("Cole uma ou mais URLs válidas (http://...)");
      return;
    }
    const novas = urls.filter((u) => !all.includes(u));
    if (novas.length === 0) {
      toast.error("Estas imagens já estão na lista.");
      return;
    }
    setAll([...all, ...novas]);
    setInput("");
    toast.success(
      `${novas.length} ${novas.length === 1 ? "imagem adicionada" : "imagens adicionadas"}.`,
    );
  };

  const setAsCover = (idx: number) => {
    if (idx === 0) return;
    const next = [...all];
    const [item] = next.splice(idx, 1);
    next.unshift(item);
    setAll(next);
  };

  const moveUp = (idx: number) => {
    if (idx <= 0) return;
    const next = [...all];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    setAll(next);
  };

  const moveDown = (idx: number) => {
    if (idx >= all.length - 1) return;
    const next = [...all];
    [next[idx + 1], next[idx]] = [next[idx], next[idx + 1]];
    setAll(next);
  };

  const remove = (idx: number) => {
    const next = all.filter((_, i) => i !== idx);
    setAll(next);
  };

  return (
    <div className="space-y-3">
      {/* Input de URL */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder="Cole a URL da imagem aqui (Enter para adicionar)"
          className="input flex-1"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 rounded-lg bg-conecta-blue hover:bg-conecta-blue-deep text-white text-sm font-medium px-4 py-2 transition-colors whitespace-nowrap"
        >
          <ImagePlus className="h-4 w-4" />
          Adicionar
        </button>
      </div>
      <p className="text-xs text-ink-soft">
        Pode colar várias URLs de uma vez separadas por espaço ou linha nova. A
        primeira imagem é a capa principal — você pode mudar com ★.
      </p>

      {all.length === 0 ? (
        <div className="bg-bone/40 border border-dashed border-line rounded-xl py-10 text-center text-sm text-ink-soft">
          Nenhuma imagem adicionada.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {all.map((url, idx) => (
            <ImagemCard
              key={`${url}-${idx}`}
              url={url}
              index={idx}
              total={all.length}
              isCover={idx === 0}
              onSetCover={() => setAsCover(idx)}
              onMoveUp={() => moveUp(idx)}
              onMoveDown={() => moveDown(idx)}
              onRemove={() => remove(idx)}
            />
          ))}
        </div>
      )}

      {all.length > 0 && (
        <p className="text-xs text-ink-soft">
          {all.length} {all.length === 1 ? "imagem" : "imagens"} ·{" "}
          <span className="text-conecta-orange font-medium">1 capa</span> ·{" "}
          {Math.max(0, all.length - 1)} na galeria
        </p>
      )}
    </div>
  );
}

function ImagemCard({
  url,
  index,
  total,
  isCover,
  onSetCover,
  onMoveUp,
  onMoveDown,
  onRemove,
}: {
  url: string;
  index: number;
  total: number;
  isCover: boolean;
  onSetCover: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}) {
  return (
    <div
      className={`group relative bg-paper border rounded-xl overflow-hidden ${
        isCover ? "border-conecta-orange ring-2 ring-conecta-orange/20" : "border-line"
      }`}
    >
      <div className="aspect-square bg-bone">
        <img
          src={url}
          alt={isCover ? "Capa do produto" : `Imagem ${index + 1}`}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.opacity = "0.3";
          }}
        />
      </div>

      {/* Badge capa */}
      {isCover && (
        <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-conecta-orange text-white text-[10px] font-mono uppercase tracking-wider font-medium px-2 py-1">
          <Star className="h-2.5 w-2.5 fill-current" /> Capa
        </span>
      )}
      {!isCover && (
        <span className="absolute top-2 left-2 inline-flex items-center rounded-full bg-paper/90 backdrop-blur text-ink text-[10px] font-mono uppercase tracking-wider px-2 py-1">
          #{index + 1}
        </span>
      )}

      {/* Botões de ação — visíveis em hover/touch */}
      <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
        {!isCover && (
          <button
            type="button"
            onClick={onSetCover}
            aria-label="Tornar capa principal"
            title="Tornar capa principal"
            className="h-7 w-7 rounded-md bg-paper/95 hover:bg-conecta-orange hover:text-white text-ink-soft flex items-center justify-center shadow-sm transition-colors"
          >
            <Star className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          type="button"
          onClick={onMoveUp}
          disabled={index === 0}
          aria-label="Mover para a esquerda"
          title="Mover anterior"
          className="h-7 w-7 rounded-md bg-paper/95 hover:bg-conecta-blue hover:text-white text-ink-soft flex items-center justify-center shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={index === total - 1}
          aria-label="Mover para a direita"
          title="Mover próxima"
          className="h-7 w-7 rounded-md bg-paper/95 hover:bg-conecta-blue hover:text-white text-ink-soft flex items-center justify-center shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remover imagem"
          title="Remover"
          className="h-7 w-7 rounded-md bg-paper/95 hover:bg-red-600 hover:text-white text-ink-soft flex items-center justify-center shadow-sm transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* URL truncada na base — fica útil para debugar */}
      <div className="px-2 py-1.5 text-[10px] font-mono text-ink-mute truncate bg-bone/40 border-t border-line">
        {url.replace(/^https?:\/\//, "").slice(0, 40)}
      </div>
    </div>
  );
}
