import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/admin-auth";
import { supabase } from "@/integrations/supabase/client";
import logoConecta from "@/assets/conecta-logo.png";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);
    if (!result.success) {
      // Mensagem genérica, sem revelar se foi e-mail ou senha
      setError("E-mail ou senha incorretos.");
      toast.error("E-mail ou senha incorretos.");
      return;
    }
    toast.success("Bem-vindo ao painel.");
    router.navigate({ to: "/admin" });
  }

  async function handleResetPassword() {
    if (!email.trim()) {
      setError("Informe seu e-mail acima para recuperar a senha.");
      return;
    }
    setError(null);
    setResetting(true);
    try {
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/admin/login`
          : undefined;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        redirectTo ? { redirectTo } : undefined,
      );
      if (resetError) {
        toast.error("Não foi possível enviar o e-mail de recuperação.");
      } else {
        toast.success(
          "Se houver uma conta com esse e-mail, enviamos as instruções de recuperação.",
        );
      }
    } finally {
      setResetting(false);
    }
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[45%_1fr] bg-paper">
      {/* Painel da marca, esquerda no desktop / topo no mobile */}
      <aside className="relative overflow-hidden bg-gradient-to-br from-[#0F1357] via-[#15186B] to-[#1A1F8F] text-white px-6 py-10 sm:px-10 lg:px-12 lg:py-14 flex flex-col justify-between">
        {/* Grafismos sutis */}
        <div className="absolute inset-0 opacity-25 pointer-events-none" aria-hidden>
          <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-conecta-orange/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" />
        </div>

        <div className="relative">
          <div className="inline-flex items-center bg-white rounded-xl px-3.5 py-2.5 shadow-sm">
            <img
              src={logoConecta}
              alt="Conecta Equipamentos Veterinários"
              className="h-9 w-auto"
            />
          </div>
        </div>

        <div className="relative mt-8 lg:mt-0">
          <h1 className="font-sans text-[clamp(1.6rem,4vw,2.6rem)] font-semibold leading-[1.15] tracking-tight max-w-md">
            Tecnologia veterinária, gerenciada num só lugar.
          </h1>
          <p className="mt-4 text-sm sm:text-base text-white/75 max-w-md">
            Catálogo, blog, eventos e o relacionamento com seus clientes, tudo no
            painel da Conecta.
          </p>
        </div>

        <div className="relative mt-8 hidden lg:flex items-center gap-2 text-xs text-white/55 font-mono uppercase tracking-[0.18em]">
          <ShieldCheck className="h-4 w-4 text-white/55" />
          Acesso restrito à equipe
        </div>
      </aside>

      {/* Formulário, direita no desktop */}
      <main className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft">
              Painel administrativo
            </div>
            <h2 className="mt-2 font-sans text-2xl font-semibold tracking-tight text-ink">
              Entrar na sua conta
            </h2>
            <p className="mt-2 text-sm text-ink-soft">
              Acesse para gerenciar produtos, categorias, blog, eventos e
              formulários.
            </p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                inputMode="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="seu@email.com"
                autoComplete="email"
                aria-invalid={!!error}
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={resetting}
                  className="text-xs font-medium text-conecta-blue hover:underline disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {resetting ? "Enviando..." : "Esqueci minha senha"}
                </button>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                autoComplete="current-password"
                aria-invalid={!!error}
                className="text-base"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2"
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full gap-2 h-11 text-base"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <p className="mt-8 text-xs text-ink-soft text-center">
            Conecta Equipamentos Veterinários
          </p>
        </div>
      </main>
    </div>
  );
}
