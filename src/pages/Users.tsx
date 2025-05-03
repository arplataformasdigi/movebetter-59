
import React, { useState } from "react";
import { User, UserRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Users as UsersIcon, UserPlus, Eye, UserCheck, UserX } from "lucide-react";

// Mock inicial de usuários
const initialUsers: User[] = [
  {
    id: "1",
    name: "Administrador Principal",
    email: "admin@movebetter.com",
    role: "admin"
  },
  {
    id: "2",
    name: "Carlos Gestor",
    email: "gestor@movebetter.com",
    role: "manager"
  },
  {
    id: "3",
    name: "Maria Fisioterapeuta",
    email: "profissional@movebetter.com",
    role: "professional",
    crefito: "12345-F"
  },
  {
    id: "4",
    name: "João Fisioterapeuta",
    email: "joao@movebetter.com",
    role: "professional",
    crefito: "54321-F"
  },
  {
    id: "5",
    name: "Paula Gestora",
    email: "paula@movebetter.com",
    role: "manager"
  }
];

// Schema para o formulário de adicionar usuário
const userSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  role: z.enum(["admin", "manager", "professional"]),
  crefito: z.string().optional(),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não conferem",
  path: ["confirmPassword"],
}).refine(
  (data) => !(data.role === "professional" && (!data.crefito || data.crefito.trim() === "")),
  {
    message: "Número CREFITO é obrigatório para profissionais",
    path: ["crefito"],
  }
);

type UserFormValues = z.infer<typeof userSchema>;

export default function Users() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  // Filtro de usuários
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "professional",
      crefito: "",
      password: "",
      confirmPassword: "",
    },
  });

  const watchRole = form.watch("role");

  // Função para adicionar usuário
  const handleAddUser = (data: UserFormValues) => {
    const newUser: User = {
      id: `${users.length + 1}`,
      name: data.name,
      email: data.email,
      role: data.role,
      ...(data.crefito && { crefito: data.crefito }),
    };

    setUsers([...users, newUser]);
    toast({
      title: "Usuário adicionado",
      description: `${data.name} foi adicionado com sucesso.`,
    });

    setIsAddDialogOpen(false);
    form.reset();
  };

  // Função para alternar o status do usuário (ativo/inativo)
  const toggleUserStatus = (userId: string) => {
    // Em um sistema real, isso chamaria uma API
    toast({
      title: "Status alterado",
      description: "O status do usuário foi alterado com sucesso.",
    });
  };

  // Função para acessar a conta do usuário
  const accessUserAccount = (user: User) => {
    setSelectedUser(user);
    toast({
      title: "Acessando conta",
      description: `Acessando a conta de ${user.name}`,
    });
    // Em um sistema real, isso redirecionaria para a visualização da conta do usuário
  };

  // Função para pegar o badge do tipo de usuário
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Administrador</Badge>;
      case "manager":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Gestor</Badge>;
      case "professional":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Profissional</Badge>;
      case "patient":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Paciente</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <UsersIcon className="mr-2 h-8 w-8" /> Usuários
          </h1>
          <p className="text-muted-foreground">
            Gerencie usuários do sistema e suas permissões.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" /> Adicionar Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Usuário</DialogTitle>
              <DialogDescription>
                Preencha os dados para adicionar um novo usuário ao sistema.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddUser)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do usuário" {...field} />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@exemplo.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de usuário</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de usuário" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Tipo</SelectLabel>
                            <SelectItem value="admin">Administrador</SelectItem>
                            <SelectItem value="manager">Gestor</SelectItem>
                            <SelectItem value="professional">Profissional</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchRole === "professional" && (
                  <FormField
                    control={form.control}
                    name="crefito"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número CREFITO</FormLabel>
                        <FormControl>
                          <Input placeholder="12345-F" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

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

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="******" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit">Adicionar usuário</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Usuários</CardTitle>
              <CardDescription>Gerencie todos os usuários do sistema</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Input 
                placeholder="Buscar usuários..." 
                className="w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}  
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>CREFITO</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="font-medium">{user.name}</div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{user.crefito || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => accessUserAccount(user)}>
                        <Eye className="h-4 w-4 mr-1" /> Acessar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-green-600 border-green-200 hover:bg-green-50"
                        onClick={() => toggleUserStatus(user.id)}
                      >
                        <UserCheck className="h-4 w-4 mr-1" /> Ativar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => toggleUserStatus(user.id)}
                      >
                        <UserX className="h-4 w-4 mr-1" /> Desativar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
