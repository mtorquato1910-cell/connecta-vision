import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { site } from "@/lib/site";

const faqs = site.faq;

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="eyebrow mb-3">Perguntas frequentes</p>
          <h2 className="font-display text-4xl md:text-5xl text-primary">
            Antes de você <em className="text-accent">perguntar...</em>
          </h2>
        </div>
        <div className="divide-y divide-border border-y border-border">
          {faqs.map((f, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 py-6 text-left group"
              >
                <span className="font-display text-lg md:text-xl text-primary group-hover:text-accent transition">
                  {f.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${
                    open === i ? "rotate-180 text-accent" : ""
                  }`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ${
                  open === i ? "grid-rows-[1fr] opacity-100 pb-6" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-foreground/75 leading-relaxed">{f.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
