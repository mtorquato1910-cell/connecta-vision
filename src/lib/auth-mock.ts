/**
 * Autenticação mock para o painel admin durante a fase pré-banco.
 *
 * Quando o servidor do cliente estiver disponível, isso será substituído por
 * auth real (Auth.js v5 ou Lucia) sem mexer nas páginas — basta atualizar
 * os helpers abaixo para chamar a API real.
 *
 * Credenciais de desenvolvimento:
 *   email: admin@conecta.dev
 *   senha: admin123
 */

const STORAGE_KEY = "conecta_admin_session_v1";

const DEFAULT_CREDENTIALS = {
  email: "admin@conecta.dev",
  password: "admin123",
};

export type AdminSession = {
  email: string;
  nome: string;
  role: "admin";
  loggedAt: number;
};

export function login(
  email: string,
  password: string,
): { success: true; session: AdminSession } | { success: false; error: string } {
  if (
    email.trim().toLowerCase() !== DEFAULT_CREDENTIALS.email ||
    password !== DEFAULT_CREDENTIALS.password
  ) {
    return { success: false, error: "E-mail ou senha inválidos." };
  }
  const session: AdminSession = {
    email: DEFAULT_CREDENTIALS.email,
    nome: "Administrador Conecta",
    role: "admin",
    loggedAt: Date.now(),
  };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }
  return { success: true, session };
}

export function logout(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export function getSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AdminSession;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}

/** Para uso futuro quando trocar para auth real. */
export const DEMO_CREDENTIALS = DEFAULT_CREDENTIALS;
