
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Shield } from "lucide-react";

export default function AccountAccess() {
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Simulando o processo de alteração de senha
    setTimeout(() => {
      toast({
        title: "Sucesso",
        description: "Sua senha foi alterada com sucesso",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setIsLoading(false);
    }, 1500);
  };

  const handleDeleteAccount = () => {
    // Simulando exclusão de conta
    setTimeout(() => {
      toast({
        title: "Conta excluída",
        description: "Sua conta foi excluída com sucesso",
      });
      logout();
    }, 1500);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Configurações de Acesso</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-movebetter-primary" />
              Alterar Senha
            </CardTitle>
            <CardDescription>
              Atualize sua senha para manter sua conta segura
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleChangePassword}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="current-password">
                  Senha Atual
                </label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="new-password">
                  Nova Senha
                </label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="confirm-password">
                  Confirme a Nova Senha
                </label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            
            <CardFooter>
              <Button
                type="submit"
                className="bg-movebetter-primary hover:bg-movebetter-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Alterando..." : "Alterar Senha"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">Excluir Conta</CardTitle>
            <CardDescription>
              Ao excluir sua conta, todos os seus dados serão removidos permanentemente.
              Esta ação não pode ser desfeita.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">Excluir Conta</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Você tem certeza?</DialogTitle>
                  <DialogDescription>
                    Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta
                    e removerá todos os seus dados dos nossos servidores.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {}}>
                    Cancelar
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    Sim, excluir minha conta
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
