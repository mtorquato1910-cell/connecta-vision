import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Produto } from "@/lib/site-data";

export function ProductCard({ p }: { p: Produto }) {
  // Foto principal + galeria (dedup). Usadas no carrossel ao passar o mouse.
  const imgs = Array.from(new Set([p.img, ...(p.galeria ?? [])].filter(Boolean)));
  const [idx, setIdx] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  };
  // Ao passar o mouse: pula para a foto 2 e cicla a cada 3s, em loop.
  const start = () => {
    if (imgs.length < 2) return;
    setIdx(1);
    stop();
    timer.current = setInterval(() => setIdx((i) => (i + 1) % imgs.length), 3000);
  };
  const reset = () => {
    stop();
    setIdx(0);
  };
  useEffect(() => stop, []);

  // Ajuste da capa definido no admin (encaixe, zoom e posição).
  const fit = p.capaAjuste?.fit ?? "contain";
  const zoom = p.capaAjuste?.zoom ?? 1;
  const posX = p.capaAjuste?.posX ?? 50;
  const posY = p.capaAjuste?.posY ?? 50;

  return (
    <Link
      to="/produtos/$slug"
      params={{ slug: p.slug }}
      aria-label={`Ver detalhes do ${p.modelo}, ${p.nome}`}
      onMouseEnter={start}
      onMouseLeave={reset}
      onFocus={start}
      onBlur={reset}
      className="group block bg-paper rounded-3xl overflow-hidden border border-line hover:border-conecta-blue/30 transition-all hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(28,30,120,0.35)]"
    >
      <div className="aspect-square overflow-hidden bg-white relative">
        <img
          src={imgs[idx] ?? p.img}
          alt={p.nome}
          loading="lazy"
          className={`h-full w-full transition-opacity duration-300 ${
            fit === "cover" ? "object-cover" : "object-contain p-2"
          }`}
          style={{
            objectPosition: `${posX}% ${posY}%`,
            transform: zoom > 1 ? `scale(${zoom})` : undefined,
          }}
        />
        {imgs.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {imgs.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === idx ? "w-4 bg-conecta-orange" : "w-1.5 bg-ink/20"
                }`}
              />
            ))}
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">{p.categoriaNome}</div>
        <div className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-conecta-orange font-medium">{p.modelo}</div>
        <h3 className="mt-2 font-sans text-base font-normal text-ink-soft leading-snug line-clamp-2">{p.nome}</h3>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-ink font-medium">Ver detalhes</span>
          <span className="h-9 w-9 rounded-full border border-line-strong flex items-center justify-center group-hover:bg-conecta-orange group-hover:border-conecta-orange group-hover:text-white transition">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
