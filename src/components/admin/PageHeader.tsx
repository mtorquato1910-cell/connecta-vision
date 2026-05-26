import type { ReactNode } from "react";

type Tone = "blue" | "orange" | "rose" | "violet" | "amber" | "slate";

const TONE_GRADIENTS: Record<Tone, string> = {
  blue: "from-blue-500/10 via-blue-50 to-transparent",
  orange: "from-orange-500/10 via-orange-50 to-transparent",
  rose: "from-rose-500/10 via-rose-50 to-transparent",
  violet: "from-violet-500/10 via-violet-50 to-transparent",
  amber: "from-amber-500/15 via-amber-50 to-transparent",
  slate: "from-slate-500/10 via-slate-50 to-transparent",
};

const TONE_ACCENT: Record<Tone, string> = {
  blue: "bg-blue-500",
  orange: "bg-conecta-orange",
  rose: "bg-rose-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
  slate: "bg-slate-500",
};

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  tone?: Tone;
  actions?: ReactNode;
  badge?: { label: string; tone?: "amber" | "rose" | "blue" };
}

export function PageHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  tone = "blue",
  actions,
  badge,
}: PageHeaderProps) {
  const badgeClass =
    badge?.tone === "rose"
      ? "bg-rose-100 text-rose-900"
      : badge?.tone === "blue"
      ? "bg-blue-100 text-blue-900"
      : "bg-amber-100 text-amber-900";

  return (
    <div className={`relative bg-gradient-to-br ${TONE_GRADIENTS[tone]} border-b border-line`}>
      <div className="px-4 sm:px-6 md:px-10 py-6 sm:py-8 md:py-10 max-w-7xl">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
            {Icon && (
              <div
                className={`h-10 w-10 sm:h-12 sm:w-12 rounded-2xl ${TONE_ACCENT[tone]} text-white flex items-center justify-center shadow-md shrink-0`}
              >
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
            )}
            <div className="min-w-0">
              <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-ink-soft font-mono">
                {eyebrow}
              </div>
              <h1 className="mt-1 text-2xl sm:text-3xl md:text-4xl font-serif text-ink leading-tight">
                {title}
              </h1>
              {description && (
                <p className="mt-2 text-xs sm:text-sm text-ink-soft max-w-2xl">
                  {description}
                </p>
              )}
              {badge && (
                <span
                  className={`mt-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${badgeClass}`}
                >
                  {badge.label}
                </span>
              )}
            </div>
          </div>
          {actions && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
