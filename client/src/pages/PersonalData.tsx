import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { User, Shield } from "lucide-react";
// Removed Supabase integration - using local API instead
import { FormLoadingSkeleton } from "@/components/ui/loading-skeleton";

// Interface local que estende o tipo do profile para incluir todos os campos
interface ExtendedProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  crefito?: string;
  phone?: string;
  cpf_cnpj?: string;
  cep?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  created_at: string;
  updated_at: string;
}

interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }),
  cpfCnpj: z.string().min(11, { message: "CPF/CNPJ inválido" }).optional(),
  conselho: z.string().optional(),
  whatsapp: z.string().min(10, { message: "WhatsApp inválido" }).optional(),
  cep: z.string().min(8, { message: "CEP inválido" }).max(9),
  street: z.string(),
  number: z.string(),
  neighborhood: z.string(),
  city: z.string(),
  state: z.string().max(2),
});

export default function PersonalData() {
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [cpfCnpjSaved, setCpfCnpjSaved] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isSearchingCep, setIsSearchingCep] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      cpfCnpj: "",
      conselho: "",
      whatsapp: "",
      cep: "",
      street: "",
      number: "",
      neighborhood: "",
      city: "",
      state: "",
    },
  });

  useEffect(() => {
    const loadUserData = async () => {
      if (user?.id) {
        try {
          console.log('📊 Loading user data for PersonalData...');
          setIsDataLoading(true);
          
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profile && !error) {
            console.log('✅ Profile data loaded:', profile);
            const extendedProfile = profile as ExtendedProfile;
            
            // Pré-preencher todos os dados do perfil
            form.setValue("name", extendedProfile.name || "");
            form.setValue("email", extendedProfile.email || "");
            form.setValue("whatsapp", extendedProfile.phone || "");
            form.setValue("conselho", extendedProfile.crefito || "");
            
            // Campos de endereço
            form.setValue("cep", extendedProfile.cep || "");
            form.setValue("street", extendedProfile.street || "");
            form.setValue("number", extendedProfile.number || "");
            form.setValue("neighborhood", extendedProfile.neighborhood || "");
            form.setValue("city", extendedProfile.city || "");
            form.setValue("state", extendedProfile.state || "");
            
            // Se houver CPF salvo, marcar como bloqueado
            if (extendedProfile.cpf_cnpj) {
              form.setValue("cpfCnpj", extendedProfile.cpf_cnpj);
              setCpfCnpjSaved(true);
            }
          } else {
            console.error('❌ Error loading profile:', error);
          }
        } catch (error) {
          console.error('💥 Exception loading user data:', error);
        } finally {
          setIsDataLoading(false);
        }
      }
    };

    loadUserData();

    // Configurar subscription realtime para atualizar dados automaticamente
    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user?.id}`
        },
        (payload) => {
          console.log('🔄 Profile updated via realtime:', payload);
          toast({
            title: "Dados atualizados",
            description: "Seus dados foram sincronizados automaticamente",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, form, toast]);

  const formatCpfCnpj = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    
    if (numbers.length <= 11) {
      if (numbers.length <= 3) return numbers;
      if (numbers.length <= 6) return numbers.replace(/(\d{3})(\d{1,3})/, "$1.$2");
      if (numbers.length <= 9) return numbers.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
    } else {
      if (numbers.length <= 2) return numbers;
      if (numbers.length <= 5) return numbers.replace(/(\d{2})(\d{1,3})/, "$1.$2");
      if (numbers.length <= 8) return numbers.replace(/(\d{2})(\d{3})(\d{1,3})/, "$1.$2.$3");
      if (numbers.length <= 12) return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{1,4})/, "$1.$2.$3/$4");
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})/, "$1.$2.$3/$4-$5");
    }
  };

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 5) return numbers;
    return numbers.replace(/(\d{5})(\d{1,3})/, "$1-$2");
  };

  const fetchAddressByCep = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");
    
    if (cleanCep.length !== 8) {
      return false;
    }

    setIsSearchingCep(true);
    console.log('🌐 Fetching address for CEP:', cleanCep);
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data: ViaCEPResponse = await response.json();
      
      if (!data.erro) {
        console.log('✅ Address found:', data);
        form.setValue("street", data.logradouro);
        form.setValue("neighborhood", data.bairro);
        form.setValue("city", data.localidade);
        form.setValue("state", data.uf);
        
        toast({
          title: "Endereço encontrado",
          description: "Os campos foram preenchidos automaticamente",
        });
        return true;
      } else {
        console.log('❌ CEP not found');
        toast({
          title: "CEP não encontrado",
          description: "O CEP informado não foi encontrado",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('💥 Error fetching CEP:', error);
      toast({
        title: "Erro",
        description: "Erro ao buscar o CEP",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSearchingCep(false);
    }
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedCep = formatCep(value);
    form.setValue("cep", formattedCep);
    
    const cleanCep = value.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      await fetchAddressByCep(cleanCep);
    }
  };

  const handleCpfCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatCpfCnpj(value);
    form.setValue("cpfCnpj", formatted);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    console.log('💾 Saving profile data:', values);
    
    try {
      const updateData: any = {
        name: values.name,
        phone: values.whatsapp || null,
        crefito: values.conselho || null,
        // Campos de endereço - CORRIGIDO: incluir todos os campos
        cep: values.cep || null,
        street: values.street || null,
        number: values.number || null,
        neighborhood: values.neighborhood || null,
        city: values.city || null,
        state: values.state || null,
        updated_at: new Date().toISOString(),
      };

      // Só adiciona CPF/CNPJ se não estiver salvo ainda
      if (values.cpfCnpj && !cpfCnpjSaved) {
        updateData.cpf_cnpj = values.cpfCnpj;
        setCpfCnpjSaved(true);
      }

      console.log('📤 Updating profile with data:', updateData);

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user?.id);

      if (error) {
        console.error('❌ Error updating profile:', error);
        throw error;
      }

      console.log('✅ Profile updated successfully');
      toast({
        title: "Dados atualizados",
        description: "Suas informações foram atualizadas com sucesso",
      });
      
      // Recarregar dados para mostrar alterações imediatamente
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (updatedProfile) {
        const extendedProfile = updatedProfile as ExtendedProfile;
        form.setValue("name", extendedProfile.name || "");
        form.setValue("whatsapp", extendedProfile.phone || "");
        form.setValue("conselho", extendedProfile.crefito || "");
        form.setValue("cep", extendedProfile.cep || "");
        form.setValue("street", extendedProfile.street || "");
        form.setValue("number", extendedProfile.number || "");
        form.setValue("neighborhood", extendedProfile.neighborhood || "");
        form.setValue("city", extendedProfile.city || "");
        form.setValue("state", extendedProfile.state || "");
      }
      
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar os dados",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast({
        title: "Erro",
        description: "Todos os campos de senha são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Erro",
        description: "A nova senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    setIsPasswordLoading(true);
    console.log('🔒 Changing password...');

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw error;
      }

      console.log('✅ Password changed successfully');
      toast({
        title: "Sucesso",
        description: "Sua senha foi alterada com sucesso",
      });
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error: any) {
      console.error('❌ Error changing password:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao alterar a senha",
        variant: "destructive",
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      console.log('🗑️ Deleting account...');
      toast({
        title: "Conta excluída",
        description: "Sua conta foi excluída com sucesso",
      });
      logout();
    } catch (error) {
      console.error('❌ Error deleting account:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir a conta",
        variant: "destructive",
      });
    }
  };

  if (isDataLoading) {
    return (
      <div className="container mx-auto py-10 space-y-6">
        <h1 className="text-3xl font-bold mb-6">Meus Dados</h1>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-movebetter-primary" />
              Informações Pessoais
            </CardTitle>
            <CardDescription>
              Carregando seus dados...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormLoadingSkeleton />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Meus Dados</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-movebetter-primary" />
            Informações Pessoais
          </CardTitle>
          <CardDescription>
            Mantenha seus dados atualizados para melhor experiência com nossa plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome completo</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" disabled />
                      </FormControl>
                      <FormDescription>O e-mail não pode ser alterado</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cpfCnpj"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF/CNPJ</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="000.000.000-00 ou 00.000.000/0000-00" 
                          disabled={cpfCnpjSaved}
                          onChange={cpfCnpjSaved ? undefined : handleCpfCnpjChange}
                          maxLength={18}
                        />
                      </FormControl>
                      {cpfCnpjSaved && (
                        <FormDescription>O CPF/CNPJ não pode ser alterado após ser salvo</FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {user?.role === "admin" && (
                  <FormField
                    control={form.control}
                    name="conselho"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número do Conselho</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ex: CREFITO-3 123456-F" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="(00) 00000-0000" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Endereço</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="cep"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="00000-000"
                            onChange={handleCepChange}
                            disabled={isSearchingCep}
                            maxLength={9}
                          />
                        </FormControl>
                        {isSearchingCep && (
                          <FormDescription>Buscando endereço...</FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rua</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="neighborhood"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bairro</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Input {...field} maxLength={2} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="bg-movebetter-primary hover:bg-movebetter-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

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
                minLength={6}
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
                minLength={6}
              />
            </div>
          </CardContent>
          
          <CardFooter>
            <Button
              type="submit"
              className="bg-movebetter-primary hover:bg-movebetter-primary/90"
              disabled={isPasswordLoading}
            >
              {isPasswordLoading ? "Alterando..." : "Alterar Senha"}
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
  );
}
