/**
 * Hook React que expõe locale atual + setter + helper de tradução.
 * - Lê do localStorage/cookie
 * - Na primeira visita, dispara detecção automática
 * - Atualizações persistem em localStorage e cookie
 */
import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_LOCALE,
  detectLocale,
  getStoredLocale,
  setStoredLocale,
  t as translate,
  type Locale,
} from "@/lib/i18n";

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;

    const stored = getStoredLocale();
    if (stored) {
      setLocaleState(stored);
      setReady(true);
      return;
    }

    detectLocale().then((detected) => {
      if (!alive) return;
      setLocaleState(detected);
      setStoredLocale(detected);
      setReady(true);
    });

    return () => {
      alive = false;
    };
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    setStoredLocale(next);
  }, []);

  const t = useCallback((key: string) => translate(locale, key), [locale]);

  return { locale, setLocale, t, ready };
}
