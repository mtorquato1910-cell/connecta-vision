import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DEMO_CREDENTIALS, login } from "@/lib/auth-mock";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // pequeno delay para parecer "rede"
    setTimeout(() => {
      const result = login(email, password);
      setLoading(false);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Bem-vindo ao painel.");
      router.navigate({ to: "/admin" });
    }, 250);
  }

  function preencherDemo() {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-mono">
            Conecta
          </div>
          <CardTitle className="text-2xl font-serif">Painel administrativo</CardTitle>
          <CardDescription>
            Acesse para gerenciar produtos, categorias, blog, eventos e formulários.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@conecta.dev"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" className="w-full gap-2" disabled={loading}>
              <Lock className="h-4 w-4" />
              {loading ? "Entrando..." : "Entrar"}
            </Button>

            <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-900">
              <p className="font-medium">Modo desenvolvimento</p>
              <p className="mt-1">
                Sem banco ainda — use as credenciais de demonstração:
                <br />
                <code className="bg-amber-100 px-1 rounded">admin@conecta.dev</code> /{" "}
                <code className="bg-amber-100 px-1 rounded">admin123</code>
              </p>
              <button
                type="button"
                onClick={preencherDemo}
                className="mt-2 text-amber-900 underline hover:no-underline"
              >
                Preencher automaticamente →
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
