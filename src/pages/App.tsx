
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Smartphone, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Patient {
  id: string;
  name: string;
  email: string;
}

interface AppUser {
  id: string;
  patientId: string;
  patientName: string;
  email: string;
  password: string;
  permissions: {
    planos: boolean;
    agenda: boolean;
    evolucao: boolean;
  };
}

const mockPatients: Patient[] = [
  { id: "1", name: "Marina Oliveira", email: "marina.o@email.com" },
  { id: "2", name: "Felipe Martins", email: "felipe.m@email.com" },
  { id: "3", name: "Carla Sousa", email: "carla.s@email.com" },
  { id: "4", name: "Ricardo Almeida", email: "ricardo.a@email.com" },
  { id: "5", name: "Patricia Mendes", email: "patricia.m@email.com" },
  { id: "6", name: "Gustavo Torres", email: "gustavo.t@email.com" },
];

export function App() {
  const [appUsers, setAppUsers] = useState<AppUser[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientId: "",
    email: "",
    password: "",
    permissions: {
      planos: false,
      agenda: false,
      evolucao: false,
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedPatient = mockPatients.find(p => p.id === formData.patientId);
    if (!selectedPatient) return;

    const newUser: AppUser = {
      id: Date.now().toString(),
      patientId: formData.patientId,
      patientName: selectedPatient.name,
      email: formData.email,
      password: formData.password,
      permissions: formData.permissions
    };

    setAppUsers([...appUsers, newUser]);
    setFormData({
      patientId: "",
      email: "",
      password: "",
      permissions: { planos: false, agenda: false, evolucao: false }
    });
    setIsDialogOpen(false);
  };

  const handleDeleteUser = (userId: string) => {
    setAppUsers(appUsers.filter(user => user.id !== userId));
  };

  const handlePermissionChange = (userId: string, permission: keyof AppUser["permissions"], value: boolean) => {
    setAppUsers(appUsers.map(user => 
      user.id === userId 
        ? { ...user, permissions: { ...user.permissions, [permission]: value } }
        : user
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Smartphone className="mr-2 h-8 w-8" /> Aplicativo
          </h1>
          <p className="text-muted-foreground">
            Gerencie o acesso dos pacientes ao aplicativo móvel.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Paciente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Paciente ao Aplicativo</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="patient">Paciente</Label>
                <Select value={formData.patientId} onValueChange={(value) => setFormData({...formData, patientId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPatients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name} - {patient.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-3">
                <Label>Permissões de Acesso</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="planos"
                    checked={formData.permissions.planos}
                    onCheckedChange={(checked) => setFormData({
                      ...formData, 
                      permissions: {...formData.permissions, planos: checked}
                    })}
                  />
                  <Label htmlFor="planos">Planos</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="agenda"
                    checked={formData.permissions.agenda}
                    onCheckedChange={(checked) => setFormData({
                      ...formData, 
                      permissions: {...formData.permissions, agenda: checked}
                    })}
                  />
                  <Label htmlFor="agenda">Agenda</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="evolucao"
                    checked={formData.permissions.evolucao}
                    onCheckedChange={(checked) => setFormData({
                      ...formData, 
                      permissions: {...formData.permissions, evolucao: checked}
                    })}
                  />
                  <Label htmlFor="evolucao">Evolução</Label>
                </div>
              </div>
              <Button type="submit" className="w-full">
                Criar Conta
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuários do Aplicativo</CardTitle>
          <CardDescription>Pacientes com acesso ao aplicativo móvel</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Planos</TableHead>
                <TableHead>Agenda</TableHead>
                <TableHead>Evolução</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.patientName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Switch
                      checked={user.permissions.planos}
                      onCheckedChange={(checked) => handlePermissionChange(user.id, 'planos', checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={user.permissions.agenda}
                      onCheckedChange={(checked) => handlePermissionChange(user.id, 'agenda', checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={user.permissions.evolucao}
                      onCheckedChange={(checked) => handlePermissionChange(user.id, 'evolucao', checked)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {appUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Nenhum paciente cadastrado no aplicativo
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
