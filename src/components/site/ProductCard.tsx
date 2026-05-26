import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Produto } from "@/lib/site-data";
import { CategoryBadge } from "@/components/shared/CategoryBadge";

export function ProductCard({ p }: { p: Produto }) {
  return (
    <Link
      to="/produtos/$slug"
      params={{ slug: p.slug }}
      aria-label={`Ver detalhes do ${p.modelo} — ${p.nome}`}
      className="group block bg-paper rounded-3xl overflow-hidden border border-line hover:border-conecta-blue/30 transition-all hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(28,30,120,0.35)]"
    >
      <div className="aspect-[4/3] overflow-hidden bg-bone relative">
        <img
          src={p.img}
          alt={p.nome}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <CategoryBadge variant="overlay" className="absolute top-4 left-4">
          {p.categoriaNome}
        </CategoryBadge>
      </div>
      <div className="p-5">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-conecta-orange font-medium">{p.modelo}</div>
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
