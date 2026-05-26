import { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";
import { Link } from "@tanstack/react-router";

const STORAGE_KEY = "conecta_cookies_consent_v1";

type Consent = "accepted" | "rejected" | null;

export function CookieBanner() {
  const [consent, setConsent] = useState<Consent>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as Consent;
      if (saved === "accepted" || saved === "rejected") {
        setConsent(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const accept = () => {
    setConsent("accepted");
    try {
      window.localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // ignore
    }
  };

  const rejectAll = () => {
    setConsent("rejected");
    try {
      window.localStorage.setItem(STORAGE_KEY, "rejected");
    } catch {
      // ignore
    }
  };

  // Não renderiza no SSR (evita flash)
  if (!mounted || consent !== null) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[80] p-3 sm:p-4 pointer-events-none">
      <div className="max-w-4xl mx-auto pointer-events-auto bg-paper border border-line shadow-xl rounded-2xl overflow-hidden">
        <div className="px-5 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-conecta-orange/10 text-conecta-orange flex items-center justify-center shrink-0">
              <Cookie className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="font-serif text-base text-ink leading-snug">
                Este site usa cookies para melhorar sua experiência.
              </p>
              <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                Usamos cookies essenciais para funcionamento e analíticos
                anônimos para entender como você navega.{" "}
                <Link
                  to="/politica-privacidade"
                  className="underline hover:text-conecta-blue"
                >
                  Saiba mais
                </Link>
                .
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
            <button
              onClick={rejectAll}
              className="text-xs text-ink-soft hover:text-ink px-3 py-2 transition-colors whitespace-nowrap"
            >
              Só essenciais
            </button>
            <button
              onClick={accept}
              className="bg-conecta-blue hover:bg-conecta-blue-deep text-white text-sm font-medium rounded-full px-5 py-2 transition-colors whitespace-nowrap"
            >
              Aceitar todos
            </button>
            <button
              onClick={rejectAll}
              aria-label="Fechar"
              className="h-8 w-8 rounded-md text-ink-soft hover:text-ink hover:bg-bone flex items-center justify-center shrink-0 sm:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
