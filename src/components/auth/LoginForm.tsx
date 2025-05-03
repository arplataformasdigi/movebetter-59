
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      // Simulação de login - em ambiente real usaria autenticação
      if (data.email === "admin@movebetter.com" && data.password === "123456") {
        // Simular usuário autenticado para o admin
        localStorage.setItem("user", JSON.stringify({
          id: "1",
          name: "Administrador",
          email: data.email,
          role: "admin"
        }));
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao MoveBetter",
        });
        navigate("/");
      } else if (data.email === "gestor@movebetter.com" && data.password === "123456") {
        // Simular usuário autenticado para o gestor
        localStorage.setItem("user", JSON.stringify({
          id: "2",
          name: "Gestor",
          email: data.email,
          role: "manager"
        }));
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao MoveBetter",
        });
        navigate("/");
      } else if (data.email === "profissional@movebetter.com" && data.password === "123456") {
        // Simular usuário autenticado para o profissional
        localStorage.setItem("user", JSON.stringify({
          id: "3",
          name: "Profissional",
          email: data.email,
          role: "professional",
          crefito: "12345-F"
        }));
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao MoveBetter",
        });
        navigate("/");
      } else if (data.email === "paciente@email.com" && data.password === "123456") {
        // Simular usuário autenticado para o paciente
        localStorage.setItem("user", JSON.stringify({
          id: "4",
          name: "Paciente Exemplo",
          email: data.email,
          role: "patient",
          professionalId: "3"
        }));
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao MoveBetter",
        });
        navigate("/paciente");
      } else {
        toast({
          title: "Erro ao fazer login",
          description: "Email ou senha incorretos",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro durante o login. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
        
        <div className="text-sm text-center text-muted-foreground mt-2">
          <p className="mb-4">Contas para teste:</p>
          <p>Admin: admin@movebetter.com / 123456</p>
          <p>Gestor: gestor@movebetter.com / 123456</p>
          <p>Profissional: profissional@movebetter.com / 123456</p>
          <p>Paciente: paciente@email.com / 123456</p>
        </div>
      </form>
    </Form>
  );
}
