
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, isAuthenticated, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect authenticated users
  React.useEffect(() => {
    if (isAuthenticated && user && !isLoading) {
      console.log('User authenticated, redirecting...', user.role);
      const from = location.state?.from || (user.role === 'patient' ? '/paciente' : '/');
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location.state, isLoading]);

  const onSubmit = async (data: LoginFormValues) => {
    if (isSubmitting || isLoading) return;
    
    setIsSubmitting(true);
    console.log('Submitting login for:', data.email);
    
    try {
      const { error } = await login(data.email, data.password);
      
      if (error) {
        console.error('Login failed:', error);
        
        let errorMessage = "Ocorreu um erro durante o login. Tente novamente.";
        
        // Handle error as string or object
        const errorMsg = typeof error === 'string' ? error : String(error);
        
        if (errorMsg === "Invalid login credentials") {
          errorMessage = "Email ou senha incorretos";
        } else if (errorMsg.includes("Email not confirmed")) {
          errorMessage = "Confirme seu email antes de fazer login";
        } else if (errorMsg.includes("Too many requests")) {
          errorMessage = "Muitas tentativas. Tente novamente em alguns minutos.";
        }
        
        toast({
          title: "Erro ao fazer login",
          description: errorMessage,
          variant: "destructive",
        });
        setIsSubmitting(false);
      } else {
        console.log('Login successful, waiting for auth state update...');
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao Fisio Smart Care",
        });
        // Não definir submitting como false aqui, deixar o useEffect handle
      }
    } catch (error) {
      console.error('Unexpected login error:', error);
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="seu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="******" 
                    {...field} 
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting || isLoading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </Form>
  );
}
