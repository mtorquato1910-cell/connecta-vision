/**
 * Hook que conecta o site público às configurações editáveis pelo admin.
 * Lê de admin-config-repo + admin-conteudo-repo.
 *
 * Em SSR, retorna os valores DEFAULT (do código).
 * No client, lê do localStorage e reage a mudanças.
 */
import { useEffect, useState } from "react";
import {
  DEFAULT_CONFIG,
  getAll as getAllConfig,
  type ConfigAll,
} from "@/lib/admin-config-repo";
import {
  getAll as getAllConteudo,
  type ConteudoItem,
} from "@/lib/admin-conteudo-repo";

type SiteConfig = {
  config: ConfigAll;
  conteudo: ConteudoItem[];
  texto: (chave: string, fallback?: string) => string;
};

export function useSiteConfig(): SiteConfig {
  const [config, setConfig] = useState<ConfigAll>(DEFAULT_CONFIG);
  const [conteudo, setConteudo] = useState<ConteudoItem[]>([]);

  useEffect(() => {
    const load = () => {
      setConfig(getAllConfig());
      setConteudo(getAllConteudo());
    };
    load();

    // Reage a mudanças do storage (outras abas) e ao próprio admin
    const onStorage = (e: StorageEvent) => {
      if (
        e.key === "conecta_admin_config_v1" ||
        e.key === "conecta_admin_conteudo_v1"
      ) {
        load();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const texto = (chave: string, fallback = "") =>
    conteudo.find((c) => c.chave === chave)?.valor ?? fallback;

  return { config, conteudo, texto };
}

/** Helper síncrono para usar fora de componente React (SSR-safe). */
export function getTextoSync(chave: string, fallback = ""): string {
  if (typeof window === "undefined") return fallback;
  return getAllConteudo().find((c) => c.chave === chave)?.valor ?? fallback;
}

/** Helper para WhatsApp link usando config do admin. */
export function buildWaLink(msg?: string): string {
  const cfg = typeof window === "undefined" ? DEFAULT_CONFIG : getAllConfig();
  const phone = cfg.contato.whatsapp_raw;
  const text = msg ?? cfg.contato.whatsapp_msg_padrao;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
