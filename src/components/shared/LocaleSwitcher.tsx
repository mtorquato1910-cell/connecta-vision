import { useState, useRef, useEffect } from "react";
import { Globe, Check } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { LOCALES, getLocaleMeta, type Locale } from "@/lib/i18n";

interface Props {
  variant?: "navbar" | "drawer";
}

export function LocaleSwitcher({ variant = "navbar" }: Props) {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Fecha ao clicar fora
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const current = getLocaleMeta(locale);

  if (variant === "drawer") {
    return (
      <div className="flex flex-wrap gap-2">
        {LOCALES.map((l) => {
          const m = getLocaleMeta(l);
          const active = l === locale;
          return (
            <button
              key={l}
              onClick={() => setLocale(l)}
              className={`text-xs rounded-full px-3 py-1.5 border transition ${
                active
                  ? "bg-ink text-bone border-ink"
                  : "bg-paper text-ink border-line-strong hover:border-ink"
              }`}
              aria-label={`Trocar para ${m.label}`}
            >
              {m.flag} {m.native}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={`Idioma atual: ${current.label}`}
        aria-expanded={open}
        className="h-10 w-10 rounded-full border border-line-strong flex items-center justify-center hover:bg-bone transition relative"
        title={current.label}
      >
        <Globe className="h-4 w-4" />
        <span className="absolute -bottom-1 -right-1 text-[10px] bg-paper rounded-full px-1 leading-none border border-line">
          {locale.toUpperCase()}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 bg-paper border border-line rounded-xl shadow-lg overflow-hidden min-w-[180px]">
          {LOCALES.map((l) => {
            const m = getLocaleMeta(l);
            const active = l === locale;
            return (
              <button
                key={l}
                onClick={() => {
                  setLocale(l as Locale);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors text-left ${
                  active ? "bg-conecta-blue-mute text-conecta-blue" : "hover:bg-bone text-ink"
                }`}
              >
                <span className="text-base">{m.flag}</span>
                <span className="flex-1">{m.native}</span>
                {active && <Check className="h-4 w-4" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
