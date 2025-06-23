import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowUp, ArrowDown, Eye, Edit, Trash2, XCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePatientMedicalRecords } from "@/hooks/usePatientMedicalRecords";
import { usePatientEvolutions, Evolution } from "@/hooks/usePatientEvolutions";

const evolutionSchema = z.object({
  medical_record_id: z.string().min(1, { message: "Prontuário é obrigatório" }),
  queixas_relatos: z.string().min(10, { message: "Campo deve ter pelo menos 10 caracteres" }),
  conduta_atendimento: z.string().min(10, { message: "Campo deve ter pelo menos 10 caracteres" }),
  observacoes: z.string().optional(),
  progress_score: z.coerce.number().min(0).max(10),
});

type EvolutionFormValues = z.infer<typeof evolutionSchema>;

interface PatientEvolutionProps {
  patientId: string;
}

export function PatientEvolution({ patientId }: PatientEvolutionProps) {
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editingEvolution, setEditingEvolution] = useState<Evolution | null>(null);
  const [viewingEvolution, setViewingEvolution] = useState<Evolution | null>(null);
  
  const { medicalRecords, isLoading: recordsLoading } = usePatientMedicalRecords(patientId);
  const { evolutions, isLoading, addEvolution, updateEvolution, closeEvolution } = usePatientEvolutions(patientId);
  
  const form = useForm<EvolutionFormValues>({
    resolver: zodResolver(evolutionSchema),
    defaultValues: {
      medical_record_id: "",
      queixas_relatos: "",
      conduta_atendimento: "",
      observacoes: "",
      progress_score: 5,
    },
  });

  // Filter only active medical records for the select
  const activeMedicalRecords = medicalRecords.filter(record => record.status === 'active');

  function onSubmit(values: EvolutionFormValues) {
    const lastEvolution = evolutions.length > 0 ? evolutions[0] : undefined;
    
    if (editingEvolution) {
      const updatedEvolution = {
        medical_record_id: values.medical_record_id,
        queixas_relatos: values.queixas_relatos,
        conduta_atendimento: values.conduta_atendimento,
        observacoes: values.observacoes,
        progress_score: values.progress_score,
      };
      
      updateEvolution(editingEvolution.id, updatedEvolution);
      setEditingEvolution(null);
    } else {
      const evolutionData = {
        patient_id: patientId,
        medical_record_id: values.medical_record_id,
        queixas_relatos: values.queixas_relatos,
        conduta_atendimento: values.conduta_atendimento,
        observacoes: values.observacoes,
        progress_score: values.progress_score,
        previous_score: lastEvolution?.progress_score,
        is_active: true,
      };
      
      addEvolution(evolutionData);
    }
    
    form.reset();
    setOpen(false);
  }

  const handleEdit = (evolution: Evolution) => {
    setEditingEvolution(evolution);
    form.reset({
      medical_record_id: evolution.medical_record_id,
      queixas_relatos: evolution.queixas_relatos,
      conduta_atendimento: evolution.conduta_atendimento,
      observacoes: evolution.observacoes || "",
      progress_score: evolution.progress_score,
    });
    setOpen(true);
  };

  const handleView = (evolution: Evolution) => {
    setViewingEvolution(evolution);
    setViewOpen(true);
  };

  const handleCloseEvolution = (evolutionId: string) => {
    closeEvolution(evolutionId);
  };

  const getProgressColor = (score: number) => {
    if (score < 3) return "bg-red-100 text-red-800 border-red-200";
    if (score < 7) return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-green-100 text-green-800 border-green-200";
  };

  const getMedicalRecordInfo = (recordId: string) => {
    const record = medicalRecords.find(r => r.id === recordId);
    return record ? `${record.visit_reason} - ${format(new Date(record.created_at), "dd/MM/yyyy", {locale: ptBR})}` : "Prontuário não encontrado";
  };

  const renderProgressDifference = (current: number, previous?: number) => {
    if (previous === undefined) return null;
    
    const difference = current - previous;
    
    return (
      <Badge 
        variant="outline" 
        className={difference > 0 ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}
      >
        {difference > 0 ? (
          <ArrowUp className="h-3 w-3 mr-1" />
        ) : (
          <ArrowDown className="h-3 w-3 mr-1" />
        )}
        {Math.abs(difference)}
      </Badge>
    );
  };

  const canCreateEvolution = activeMedicalRecords.length > 0;

  if (isLoading || recordsLoading) {
    return <div>Carregando evoluções...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Evolução do Paciente</h3>
        <Dialog open={open} onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) {
            setEditingEvolution(null);
            form.reset();
          }
        }}>
          <DialogTrigger asChild>
            <Button disabled={!canCreateEvolution && !editingEvolution}>
              {!canCreateEvolution && !editingEvolution ? "Nenhum prontuário ativo" : "Adicionar Evolução"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingEvolution ? "Editar Evolução" : "Nova Evolução"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="medical_record_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prontuário</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um prontuário ativo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {activeMedicalRecords.map((record) => (
                            <SelectItem key={record.id} value={record.id}>
                              {record.visit_reason} - {format(new Date(record.created_at), "dd/MM/yyyy", {locale: ptBR})}
                            </SelectItem>
                          ))}
                          {activeMedicalRecords.length === 0 && (
                            <SelectItem value="" disabled>
                              Nenhum prontuário ativo disponível
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="queixas_relatos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Queixas e relatos</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descreva as queixas e relatos do paciente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="conduta_atendimento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conduta no atendimento</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descreva a conduta realizada no atendimento" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="observacoes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Observações adicionais" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="progress_score"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Score de Progresso (0-10)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">{editingEvolution ? "Atualizar Evolução" : "Salvar Evolução"}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {!canCreateEvolution && evolutions.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <p>Para criar uma evolução, é necessário ter um prontuário ativo.</p>
            <p>Crie um prontuário primeiro na aba "Prontuário".</p>
          </CardContent>
        </Card>
      )}

      {evolutions.length === 0 && canCreateEvolution && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            Nenhum registro de evolução encontrado para este paciente.
          </CardContent>
        </Card>
      )}

      {evolutions.length > 0 && (
        <div className="space-y-4">
          {evolutions.map((evolution) => (
            <Card key={evolution.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">
                      Evolução de {format(new Date(evolution.created_at), "dd 'de' MMMM 'de' yyyy", {locale: ptBR})}
                    </h4>
                    <p className="text-xs text-muted-foreground">{format(new Date(evolution.created_at), "HH:mm", {locale: ptBR})}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      <strong>Prontuário:</strong> {getMedicalRecordInfo(evolution.medical_record_id)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getProgressColor(evolution.progress_score)}>
                      Score: {evolution.progress_score}/10
                    </Badge>
                    {renderProgressDifference(evolution.progress_score, evolution.previous_score)}
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                          title="Encerrar evolução"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Encerramento</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja encerrar esta evolução? Esta ação removerá a evolução da lista ativa,
                            mas manterá o histórico no sistema.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleCloseEvolution(evolution.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Encerrar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          ⋮
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleView(evolution)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(evolution)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700">Queixas e relatos</h5>
                    <p className="text-sm text-muted-foreground line-clamp-2">{evolution.queixas_relatos}</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700">Conduta no atendimento</h5>
                    <p className="text-sm text-muted-foreground line-clamp-2">{evolution.conduta_atendimento}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog para visualizar evolução completa */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Visualizar Evolução</DialogTitle>
          </DialogHeader>
          {viewingEvolution && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">
                  Evolução de {format(new Date(viewingEvolution.created_at), "dd 'de' MMMM 'de' yyyy", {locale: ptBR})}
                </h4>
                <p className="text-sm text-muted-foreground">
                  <strong>Prontuário:</strong> {getMedicalRecordInfo(viewingEvolution.medical_record_id)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className={getProgressColor(viewingEvolution.progress_score)}>
                    Score: {viewingEvolution.progress_score}/10
                  </Badge>
                  {renderProgressDifference(viewingEvolution.progress_score, viewingEvolution.previous_score)}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h5 className="text-sm font-medium text-gray-700">Queixas e relatos</h5>
                  <p className="text-sm text-muted-foreground">{viewingEvolution.queixas_relatos}</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-700">Conduta no atendimento</h5>
                  <p className="text-sm text-muted-foreground">{viewingEvolution.conduta_atendimento}</p>
                </div>
                {viewingEvolution.observacoes && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-700">Observações</h5>
                    <p className="text-sm text-muted-foreground">{viewingEvolution.observacoes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
