
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
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowUp, ArrowDown, Eye, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const evolutionSchema = z.object({
  medicalRecordId: z.string().min(1, { message: "Prontuário é obrigatório" }),
  queixasRelatos: z.string().min(10, { message: "Campo deve ter pelo menos 10 caracteres" }),
  condutaAtendimento: z.string().min(10, { message: "Campo deve ter pelo menos 10 caracteres" }),
  observacoes: z.string().optional(),
  progressScore: z.coerce.number().min(0).max(10),
});

type EvolutionFormValues = z.infer<typeof evolutionSchema>;

interface MedicalRecord {
  id: string;
  date: Date;
  visitReason: string;
  currentCondition: string;
}

interface PatientEvolution {
  id: string;
  date: Date;
  medicalRecordId: string;
  queixasRelatos: string;
  condutaAtendimento: string;
  observacoes?: string;
  progressScore: number;
  previousScore?: number;
}

interface PatientEvolutionProps {
  patientId: string;
  evolutions: PatientEvolution[];
  medicalRecords: MedicalRecord[];
  onAddEvolution: (patientId: string, evolution: PatientEvolution) => void;
  onUpdateEvolution: (patientId: string, evolution: PatientEvolution) => void;
  onDeleteEvolution: (patientId: string, evolutionId: string) => void;
}

export function PatientEvolution({
  patientId,
  evolutions = [],
  medicalRecords = [],
  onAddEvolution,
  onUpdateEvolution,
  onDeleteEvolution,
}: PatientEvolutionProps) {
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editingEvolution, setEditingEvolution] = useState<PatientEvolution | null>(null);
  const [viewingEvolution, setViewingEvolution] = useState<PatientEvolution | null>(null);
  
  const form = useForm<EvolutionFormValues>({
    resolver: zodResolver(evolutionSchema),
    defaultValues: {
      medicalRecordId: "",
      queixasRelatos: "",
      condutaAtendimento: "",
      observacoes: "",
      progressScore: 5,
    },
  });

  function onSubmit(values: EvolutionFormValues) {
    const lastEvolution = evolutions.length > 0 ? evolutions[evolutions.length - 1] : undefined;
    
    if (editingEvolution) {
      const updatedEvolution: PatientEvolution = {
        ...editingEvolution,
        medicalRecordId: values.medicalRecordId,
        queixasRelatos: values.queixasRelatos,
        condutaAtendimento: values.condutaAtendimento,
        observacoes: values.observacoes,
        progressScore: values.progressScore,
      };
      
      onUpdateEvolution(patientId, updatedEvolution);
      toast.success("Evolução atualizada com sucesso");
      setEditingEvolution(null);
    } else {
      const newEvolution: PatientEvolution = {
        id: `evolution-${Date.now()}`,
        date: new Date(),
        medicalRecordId: values.medicalRecordId,
        queixasRelatos: values.queixasRelatos,
        condutaAtendimento: values.condutaAtendimento,
        observacoes: values.observacoes,
        progressScore: values.progressScore,
        previousScore: lastEvolution?.progressScore,
      };
      
      onAddEvolution(patientId, newEvolution);
      toast.success("Evolução adicionada com sucesso");
    }
    
    form.reset();
    setOpen(false);
  }

  const handleEdit = (evolution: PatientEvolution) => {
    setEditingEvolution(evolution);
    form.reset({
      medicalRecordId: evolution.medicalRecordId,
      queixasRelatos: evolution.queixasRelatos,
      condutaAtendimento: evolution.condutaAtendimento,
      observacoes: evolution.observacoes || "",
      progressScore: evolution.progressScore,
    });
    setOpen(true);
  };

  const handleView = (evolution: PatientEvolution) => {
    setViewingEvolution(evolution);
    setViewOpen(true);
  };

  const handleDelete = (evolutionId: string) => {
    if (confirm("Tem certeza que deseja excluir esta evolução?")) {
      onDeleteEvolution(patientId, evolutionId);
      toast.success("Evolução excluída com sucesso");
    }
  };

  const getProgressColor = (score: number) => {
    if (score < 3) return "bg-red-100 text-red-800 border-red-200";
    if (score < 7) return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-green-100 text-green-800 border-green-200";
  };

  const getMedicalRecordInfo = (recordId: string) => {
    const record = medicalRecords.find(r => r.id === recordId);
    return record ? `${record.visitReason} - ${format(new Date(record.date), "dd/MM/yyyy", {locale: ptBR})}` : "Prontuário não encontrado";
  };

  // Ordenar os registros do mais recente para o mais antigo
  const sortedEvolutions = [...evolutions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Formatação da diferença de progresso
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
            <Button>Adicionar Evolução</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingEvolution ? "Editar Evolução" : "Nova Evolução"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="medicalRecordId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prontuário</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um prontuário" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {medicalRecords.map((record) => (
                            <SelectItem key={record.id} value={record.id}>
                              {record.visitReason} - {format(new Date(record.date), "dd/MM/yyyy", {locale: ptBR})}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="queixasRelatos"
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
                  name="condutaAtendimento"
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
                  name="progressScore"
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

      {sortedEvolutions.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            Nenhum registro de evolução encontrado para este paciente.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedEvolutions.map((evolution) => (
            <Card key={evolution.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">
                      Evolução de {format(new Date(evolution.date), "dd 'de' MMMM 'de' yyyy", {locale: ptBR})}
                    </h4>
                    <p className="text-xs text-muted-foreground">{format(new Date(evolution.date), "HH:mm", {locale: ptBR})}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      <strong>Prontuário:</strong> {getMedicalRecordInfo(evolution.medicalRecordId)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getProgressColor(evolution.progressScore)}>
                      Score: {evolution.progressScore}/10
                    </Badge>
                    {renderProgressDifference(evolution.progressScore, evolution.previousScore)}
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
                        <DropdownMenuItem onClick={() => handleDelete(evolution.id)} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700">Queixas e relatos</h5>
                    <p className="text-sm text-muted-foreground line-clamp-2">{evolution.queixasRelatos}</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700">Conduta no atendimento</h5>
                    <p className="text-sm text-muted-foreground line-clamp-2">{evolution.condutaAtendimento}</p>
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
                  Evolução de {format(new Date(viewingEvolution.date), "dd 'de' MMMM 'de' yyyy", {locale: ptBR})}
                </h4>
                <p className="text-sm text-muted-foreground">
                  <strong>Prontuário:</strong> {getMedicalRecordInfo(viewingEvolution.medicalRecordId)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className={getProgressColor(viewingEvolution.progressScore)}>
                    Score: {viewingEvolution.progressScore}/10
                  </Badge>
                  {renderProgressDifference(viewingEvolution.progressScore, viewingEvolution.previousScore)}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h5 className="text-sm font-medium text-gray-700">Queixas e relatos</h5>
                  <p className="text-sm text-muted-foreground">{viewingEvolution.queixasRelatos}</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-700">Conduta no atendimento</h5>
                  <p className="text-sm text-muted-foreground">{viewingEvolution.condutaAtendimento}</p>
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
