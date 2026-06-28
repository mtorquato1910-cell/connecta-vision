import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { User, Mail, KeyRound, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/perfil")({
  component: AdminPerfil,
});

function AdminPerfil() {
  const [loading, setLoading] = useState(true);
  const [currentEmail, setCurrentEmail] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  // Nome de exibição (usado na saudação do dashboard)
  const [displayName, setDisplayName] = useState("");
  const [savingName, setSavingName] = useState(false);

  // Email form
  const [newEmail, setNewEmail] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);

  // Password form
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setCurrentEmail(data.user.email ?? "");
        setNewEmail(data.user.email ?? "");
        setUserId(data.user.id);
        setDisplayName((data.user.user_metadata?.nome as string) ?? "");
      }
      setLoading(false);
    })();
  }, []);

  async function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSavingName(true);
    try {
      const { error } = await supabase.auth.updateUser({ data: { nome: displayName.trim() } });
      if (error) throw error;
      toast.success("Nome de exibição salvo. Recarregue o painel para ver na saudação.");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSavingName(false);
    }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newEmail || newEmail === currentEmail) {
      toast.info("Informe um email diferente do atual.");
      return;
    }
    setSavingEmail(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      setCurrentEmail(newEmail);
      toast.success("Email atualizado com sucesso.");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSavingEmail(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não conferem.");
      return;
    }
    setSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Senha atualizada com sucesso.");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSavingPassword(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-3xl">
      <header>
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Conta</div>
        <h1 className="text-3xl font-serif font-normal mt-1">Meu perfil</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Atualize seu email de acesso e sua senha de administrador.
        </p>
      </header>

      <Card className="p-6">
        <div className="flex items-start gap-3 mb-6">
          <div className="rounded-md bg-muted p-2">
            <User className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-normal leading-none">Identificação</h2>
            <p className="text-sm text-muted-foreground mt-1">Email atualmente usado para login.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Email atual</Label>
            <div className="mt-1 font-mono">{currentEmail || ", "}</div>
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">ID</Label>
            <div className="mt-1 font-mono text-xs truncate">{userId || ", "}</div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-start gap-3 mb-6">
          <div className="rounded-md bg-muted p-2">
            <User className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-normal leading-none">Nome de exibição</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Aparece na saudação do painel ("Bem-vindo de volta, ..."). Use seu nome, não o e-mail.
            </p>
          </div>
        </div>
        <form onSubmit={handleNameSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="display-name">Nome</Label>
            <Input
              id="display-name"
              type="text"
              autoComplete="name"
              placeholder="Ex: Henrique Mondragon"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={savingName}>
            {savingName ? "Salvando..." : "Salvar nome"}
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <div className="flex items-start gap-3 mb-6">
          <div className="rounded-md bg-muted p-2">
            <Mail className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-normal leading-none">Trocar email</h2>
            <p className="text-sm text-muted-foreground mt-1">
              A alteração é aplicada imediatamente. Use o novo email no próximo login.
            </p>
          </div>
        </div>
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-email">Novo email</Label>
            <Input
              id="new-email"
              type="email"
              autoComplete="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={savingEmail}>
            {savingEmail ? "Salvando..." : "Salvar novo email"}
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <div className="flex items-start gap-3 mb-6">
          <div className="rounded-md bg-muted p-2">
            <KeyRound className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-normal leading-none">Trocar senha</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Mínimo 6 caracteres. A sessão atual permanece ativa após a troca.
            </p>
          </div>
        </div>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">Nova senha</Label>
            <Input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmar nova senha</Label>
            <Input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>
          <Button type="submit" disabled={savingPassword}>
            {savingPassword ? "Salvando..." : "Salvar nova senha"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
