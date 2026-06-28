import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Contador que anima 0 → `value` quando entra no viewport.
 *
 * Importante para SEO/acessibilidade: o número FINAL é renderizado
 * direto no JSX (estado inicial = value). A animação só substitui o
 * valor exibido durante a contagem; sem JS, o texto correto já existe
 * no DOM. Com prefers-reduced-motion, nunca anima.
 */
export function Counter({
  value,
  prefix = "",
  suffix = "",
  duration = 1400,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement | null>(null);
  // Estado inicial já é o valor final → número correto no DOM sem JS.
  const [display, setDisplay] = useState(value);
  const started = useRef(false);

  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const run = () => {
      if (started.current) return;
      started.current = true;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(Math.round(eased * value));
        if (p < 1) requestAnimationFrame(tick);
      };
      // começa de 0 e sobe até o valor
      setDisplay(0);
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) run();
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration, reduce]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
