/**
 * Autenticação real do painel admin via Supabase Auth.
 * Substitui o antigo auth-mock (localStorage). O token de sessão é anexado
 * automaticamente às server-functions pelo middleware `attachSupabaseAuth`
 * (registrado em src/start.ts); o servidor valida via `requireSupabaseAuth`
 * e o papel admin via `requireAdmin` (tabela user_roles).
 */
import { supabase } from "@/integrations/supabase/client";

export type AdminUser = {
  email: string;
  nome: string;
};

function deriveNome(user: { email?: string | null; user_metadata?: Record<string, unknown> }): string {
  const meta = user.user_metadata ?? {};
  const nome = (meta.nome ?? meta.full_name ?? meta.name) as string | undefined;
  if (nome && nome.trim()) return nome.trim();
  const email = user.email ?? "";
  return email ? email.split("@")[0] : "Administrador";
}

export async function signIn(
  email: string,
  password: string,
): Promise<{ success: true } | { success: false; error: string }> {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) {
    const msg = /invalid login credentials/i.test(error.message)
      ? "E-mail ou senha inválidos."
      : error.message;
    return { success: false, error: msg };
  }
  return { success: true };
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getCurrentUser(): Promise<AdminUser | null> {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  return { email: data.user.email ?? "", nome: deriveNome(data.user) };
}

/** Assina mudanças de sessão (logout em outra aba, expiração, etc.). */
export function onAuthChange(cb: (authenticated: boolean) => void) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    cb(!!session);
  });
  return data.subscription;
}
