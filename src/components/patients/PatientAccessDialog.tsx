
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { PatientAccess } from "@/hooks/usePatientAccess";

const accessSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  is_active: z.boolean(),
});

type AccessFormValues = z.infer<typeof accessSchema>;

interface PatientAccessDialogProps {
  patientId: string;
  patientName: string;
  patientAccess: PatientAccess[];
  onCreateAccess: (patientId: string, email: string, password: string) => Promise<{ success: boolean }>;
  onUpdateAccess: (id: string, updates: Partial<PatientAccess>) => Promise<{ success: boolean }>;
  onDeleteAccess: (id: string) => Promise<{ success: boolean }>;
  onClose: () => void;
}

export function PatientAccessDialog({
  patientId,
  patientName,
  patientAccess,
  onCreateAccess,
  onUpdateAccess,
  onDeleteAccess,
  onClose,
}: PatientAccessDialogProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingAccess, setEditingAccess] = useState<PatientAccess | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const currentAccess = patientAccess.find(access => access.patient_id === patientId);

  const form = useForm<AccessFormValues>({
    resolver: zodResolver(accessSchema),
    defaultValues: {
      email: "",
      password: "",
      is_active: true,
    },
  });

  useEffect(() => {
    if (editingAccess) {
      form.reset({
        email: editingAccess.email,
        password: "",
        is_active: editingAccess.is_active,
      });
    } else {
      form.reset({
        email: "",
        password: "",
        is_active: true,
      });
    }
  }, [editingAccess, form]);

  const onSubmit = async (data: AccessFormValues) => {
    try {
      let result;
      
      if (editingAccess) {
        const updates: Partial<PatientAccess> = {
          email: data.email,
          is_active: data.is_active,
        };
        
        if (data.password) {
          updates.password_hash = data.password;
        }
        
        result = await onUpdateAccess(editingAccess.id, updates);
      } else {
        result = await onCreateAccess(patientId, data.email, data.password);
      }

      if (result.success) {
        setIsCreating(false);
        setEditingAccess(null);
        form.reset();
      }
    } catch (error) {
      console.error('Erro ao salvar acesso:', error);
      toast.error("Erro ao salvar acesso do paciente");
    }
  };

  const handleEdit = (access: PatientAccess) => {
    setEditingAccess(access);
    setIsCreating(true);
  };

  const handleDelete = async (access: PatientAccess) => {
    if (window.confirm("Tem certeza que deseja remover este acesso?")) {
      await onDeleteAccess(access.id);
    }
  };

  const handleCancelEdit = () => {
    setIsCreating(false);
    setEditingAccess(null);
    form.reset();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gerenciar Acesso ao App - {patientName}</DialogTitle>
          <DialogDescription>
            Configure o acesso do paciente ao aplicativo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!isCreating && (
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Acesso Configurado</h3>
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {currentAccess ? "Editar Acesso" : "Criar Acesso"}
              </Button>
            </div>
          )}

          {currentAccess && !isCreating && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Acesso Ativo</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant={currentAccess.is_active ? "default" : "secondary"}>
                      {currentAccess.is_active ? "Ativo" : "Inativo"}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(currentAccess)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(currentAccess)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Email:</span> {currentAccess.email}
                  </div>
                  <div>
                    <span className="font-medium">Criado em:</span>{" "}
                    {new Date(currentAccess.created_at).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!currentAccess && !isCreating && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                  Nenhum acesso configurado para este paciente
                </div>
              </CardContent>
            </Card>
          )}

          {isCreating && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingAccess ? "Editar Acesso" : "Criar Novo Acesso"}
                </CardTitle>
                <CardDescription>
                  Configure as credenciais de acesso do paciente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="email@exemplo.com" {...field} />
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
                          <FormLabel>
                            {editingAccess ? "Nova Senha (deixe em branco para manter)" : "Senha"}
                          </FormLabel>
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

                    <FormField
                      control={form.control}
                      name="is_active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Acesso Ativo
                            </FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Permite que o paciente acesse o aplicativo
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={handleCancelEdit}>
                        Cancelar
                      </Button>
                      <Button type="submit">
                        {editingAccess ? "Atualizar" : "Criar"} Acesso
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
