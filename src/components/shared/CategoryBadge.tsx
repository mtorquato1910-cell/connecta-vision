import type { HTMLAttributes } from "react";

type Variant = "light" | "overlay";

interface CategoryBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: Variant;
}

/**
 * Pill editorial padronizada para tags de categoria.
 * - Tipografia mono com tracking 0.2em (respiração entre letras)
 * - Tamanho 10px / weight 500 (legível mas discreto)
 * - Padding generoso (px-4 py-1.5)
 *
 * Use `variant="overlay"` quando o badge fica sobre uma imagem
 * (adiciona backdrop-blur para legibilidade).
 */
export function CategoryBadge({
  children,
  variant = "light",
  className = "",
  ...rest
}: CategoryBadgeProps) {
  const base =
    "inline-flex items-center px-4 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.2em] rounded-full whitespace-nowrap";

  const variants: Record<Variant, string> = {
    light: "text-ink bg-paper border border-line",
    overlay: "text-ink bg-paper/90 backdrop-blur border border-line/60",
  };

  return (
    <span className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </span>
  );
}
