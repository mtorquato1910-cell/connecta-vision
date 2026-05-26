import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { promoverPrimeiroAdmin } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const router = useRouter();
  const promover = useServerFn(promoverPrimeiroAdmin);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function afterAuth() {
    try {
      const r = await promover();
      if (r.promoted) toast.success("Conta promovida a administrador.");
    } catch {
      // sem promoção (já existem admins)
    }
    router.navigate({ to: "/admin" });
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    await afterAuth();
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    if (error) {
      setLoading(false);
      return toast.error(error.message);
    }
    // tenta signin imediato (auto-confirm ativo)
    const { error: sErr } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (sErr) return toast.error(sErr.message);
    toast.success("Conta criada.");
    await afterAuth();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Conecta</div>
          <CardTitle className="text-2xl">Painel administrativo</CardTitle>
          <CardDescription>Acesse para gerenciar produtos, categorias e orçamentos.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="signin">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Criar conta</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4 pt-4">
                <FormFields email={email} setEmail={setEmail} password={password} setPassword={setPassword} />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4 pt-4">
                <FormFields email={email} setEmail={setEmail} password={password} setPassword={setPassword} />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Criando..." : "Criar conta"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  A primeira conta criada será automaticamente promovida a administrador.
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function FormFields(props: {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
}) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          required
          value={props.email}
          onChange={(e) => props.setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          required
          minLength={6}
          value={props.password}
          onChange={(e) => props.setPassword(e.target.value)}
        />
      </div>
    </>
  );
}
