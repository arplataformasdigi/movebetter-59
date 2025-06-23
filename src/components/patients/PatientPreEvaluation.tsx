import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardList, Edit, Trash2, Download } from "lucide-react";
import { usePatientPreEvaluations, PreEvaluation } from "@/hooks/usePatientPreEvaluations";
import { generatePreEvaluationPDF } from "@/utils/pdfGenerator";

const formSchema = z.object({
  profissao: z.string().min(2, "Profissão é obrigatória"),
  atividade_fisica: z.string().min(1, "Atividade física é obrigatória"),
  hobby: z.string().min(1, "Hobby é obrigatório"),
  queixa_principal: z.string().min(10, "Queixa principal deve ter pelo menos 10 caracteres"),
  tempo_problema: z.string().min(1, "Tempo do problema é obrigatório"),
  inicio_problema: z.string().min(1, "Início do problema é obrigatório"),
  tratamento_anterior: z.string().min(1, "Tratamento anterior é obrigatório"),
  descricao_dor: z.string().min(1, "Descrição da dor é obrigatória"),
  escala_dor: z.string().min(1, "Escala da dor é obrigatória"),
  irradiacao_dor: z.string().min(1, "Irradiação da dor é obrigatória"),
  piora_dor: z.string().min(1, "Piora da dor é obrigatória"),
  alivio_dor: z.string().min(1, "Alívio da dor é obrigatória"),
  interferencia_dor: z.string().min(1, "Interferência da dor é obrigatória"),
  diagnostico_medico: z.string().min(1, "Diagnóstico médico é obrigatório"),
  exames_recentes: z.string().min(1, "Exames recentes é obrigatório"),
  condicoes_saude: z.string().min(1, "Condições de saúde é obrigatório"),
  cirurgias: z.string().min(1, "Cirurgias é obrigatório"),
  medicamentos: z.string().optional(),
  alergias: z.string().optional(),
  doencas_familiares: z.string().min(1, "Doenças familiares é obrigatório"),
  condicoes_similares: z.string().min(1, "Condições similares é obrigatório"),
  alimentacao: z.string().min(1, "Alimentação é obrigatória"),
  padrao_sono: z.string().min(1, "Padrão de sono é obrigatório"),
  alcool: z.string().min(1, "Álcool é obrigatório"),
  fumante: z.string().min(1, "Fumante é obrigatório"),
  ingestao_agua: z.string().min(1, "Ingestão de água é obrigatória"),
  tempo_sentado: z.string().min(1, "Tempo sentado é obrigatório"),
  nivel_estresse: z.string().optional(),
  questoes_emocionais: z.string().optional(),
  impacto_qualidade_vida: z.string().optional(),
  expectativas_tratamento: z.string().optional(),
  exercicios_casa: z.string().min(1, "Exercícios em casa é obrigatório"),
  restricoes: z.string().optional(),
  dificuldade_dia: z.string().min(1, "Dificuldade no dia é obrigatória"),
  dispositivo_auxilio: z.string().min(1, "Dispositivo de auxílio é obrigatório"),
  dificuldade_equilibrio: z.string().min(1, "Dificuldade de equilíbrio é obrigatória"),
  limitacao_movimento: z.string().min(1, "Limitação de movimento é obrigatória"),
  info_adicional: z.string().optional(),
  duvidas_fisioterapia: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface PatientPreEvaluationProps {
  patientId: string;
  patientName: string;
}

export function PatientPreEvaluation({ patientId, patientName }: PatientPreEvaluationProps) {
  const [open, setOpen] = useState(false);
  const [editingEvaluation, setEditingEvaluation] = useState<PreEvaluation | null>(null);
  const { 
    preEvaluations, 
    isLoading, 
    addPreEvaluation, 
    updatePreEvaluation, 
    deletePreEvaluation 
  } = usePatientPreEvaluations(patientId);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profissao: "",
      atividade_fisica: "",
      hobby: "",
      queixa_principal: "",
      tempo_problema: "",
      inicio_problema: "",
      tratamento_anterior: "",
      descricao_dor: "",
      escala_dor: "",
      irradiacao_dor: "",
      piora_dor: "",
      alivio_dor: "",
      interferencia_dor: "",
      diagnostico_medico: "",
      exames_recentes: "",
      condicoes_saude: "",
      cirurgias: "",
      medicamentos: "",
      alergias: "",
      doencas_familiares: "",
      condicoes_similares: "",
      alimentacao: "",
      padrao_sono: "",
      alcool: "",
      fumante: "",
      ingestao_agua: "",
      tempo_sentado: "",
      nivel_estresse: "",
      questoes_emocionais: "",
      impacto_qualidade_vida: "",
      expectativas_tratamento: "",
      exercicios_casa: "",
      restricoes: "",
      dificuldade_dia: "",
      dispositivo_auxilio: "",
      dificuldade_equilibrio: "",
      limitacao_movimento: "",
      info_adicional: "",
      duvidas_fisioterapia: "",
    },
  });

  function onSubmit(values: FormValues) {
    if (editingEvaluation) {
      updatePreEvaluation(editingEvaluation.id, values);
      setEditingEvaluation(null);
    } else {
      const evaluationData = {
        patient_id: patientId,
        ...values,
        // Ensure required fields have default values if empty
        alcool: values.alcool || "Não informado",
        doencas_familiares: values.doencas_familiares || "Não informado",
        condicoes_similares: values.condicoes_similares || "Não informado",
        alimentacao: values.alimentacao || "Não informado",
        padrao_sono: values.padrao_sono || "Não informado",
        fumante: values.fumante || "Não informado",
        ingestao_agua: values.ingestao_agua || "Não informado",
        tempo_sentado: values.tempo_sentado || "Não informado",
        exercicios_casa: values.exercicios_casa || "Não informado",
        dificuldade_dia: values.dificuldade_dia || "Não informado",
        dispositivo_auxilio: values.dispositivo_auxilio || "Não informado",
        dificuldade_equilibrio: values.dificuldade_equilibrio || "Não informado",
        limitacao_movimento: values.limitacao_movimento || "Não informado",
      };
      
      addPreEvaluation(evaluationData);
    }
    
    form.reset();
    setOpen(false);
  }

  const handleEditEvaluation = (evaluation: PreEvaluation) => {
    setEditingEvaluation(evaluation);
    form.reset({
      profissao: evaluation.profissao,
      atividade_fisica: evaluation.atividade_fisica,
      hobby: evaluation.hobby,
      queixa_principal: evaluation.queixa_principal,
      tempo_problema: evaluation.tempo_problema,
      inicio_problema: evaluation.inicio_problema,
      tratamento_anterior: evaluation.tratamento_anterior,
      descricao_dor: evaluation.descricao_dor,
      escala_dor: evaluation.escala_dor,
      irradiacao_dor: evaluation.irradiacao_dor,
      piora_dor: evaluation.piora_dor,
      alivio_dor: evaluation.alivio_dor,
      interferencia_dor: evaluation.interferencia_dor,
      diagnostico_medico: evaluation.diagnostico_medico,
      exames_recentes: evaluation.exames_recentes,
      condicoes_saude: evaluation.condicoes_saude,
      cirurgias: evaluation.cirurgias,
      medicamentos: evaluation.medicamentos || "",
      alergias: evaluation.alergias || "",
      doencas_familiares: evaluation.doencas_familiares,
      condicoes_similares: evaluation.condicoes_similares,
      alimentacao: evaluation.alimentacao,
      padrao_sono: evaluation.padrao_sono,
      alcool: evaluation.alcool,
      fumante: evaluation.fumante,
      ingestao_agua: evaluation.ingestao_agua,
      tempo_sentado: evaluation.tempo_sentado,
      nivel_estresse: evaluation.nivel_estresse || "",
      questoes_emocionais: evaluation.questoes_emocionais || "",
      impacto_qualidade_vida: evaluation.impacto_qualidade_vida || "",
      expectativas_tratamento: evaluation.expectativas_tratamento || "",
      exercicios_casa: evaluation.exercicios_casa,
      restricoes: evaluation.restricoes || "",
      dificuldade_dia: evaluation.dificuldade_dia,
      dispositivo_auxilio: evaluation.dispositivo_auxilio,
      dificuldade_equilibrio: evaluation.dificuldade_equilibrio,
      limitacao_movimento: evaluation.limitacao_movimento,
      info_adicional: evaluation.info_adicional || "",
      duvidas_fisioterapia: evaluation.duvidas_fisioterapia || "",
    });
    setOpen(true);
  };

  const handleDeleteEvaluation = (evaluationId: string) => {
    deletePreEvaluation(evaluationId);
  };

  const handleDownloadPDF = (evaluation: PreEvaluation) => {
    generatePreEvaluationPDF(evaluation, patientName);
  };

  if (isLoading) {
    return <div>Carregando pré-avaliações...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Pré-avaliação do Paciente</h3>
        <Dialog open={open} onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) {
            setEditingEvaluation(null);
            form.reset();
          }
        }}>
          <DialogTrigger asChild>
            <Button size="sm">
              {editingEvaluation ? "Editar Pré-avaliação" : "Nova Pré-avaliação"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEvaluation ? "Editar Pré-avaliação" : "Nova Pré-avaliação"}
              </DialogTitle>
              <DialogDescription>
                {editingEvaluation 
                  ? "Edite as informações da pré-avaliação do paciente."
                  : "Registre as informações da pré-avaliação do paciente."
                }
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="profissao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profissão</FormLabel>
                        <FormControl>
                          <Input placeholder="Profissão" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="atividade_fisica"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Atividade Física</FormLabel>
                        <FormControl>
                          <Input placeholder="Atividade física praticada" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="hobby"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hobby</FormLabel>
                      <FormControl>
                        <Input placeholder="Hobbies e interesses" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="queixa_principal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Queixa Principal</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descreva a queixa principal" className="h-20" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit">
                    {editingEvaluation ? "Atualizar Pré-avaliação" : "Salvar Pré-avaliação"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {preEvaluations.length === 0 ? (
        <Card>
          <CardContent className="p-4 text-center text-muted-foreground">
            Nenhuma pré-avaliação encontrada para este paciente.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {preEvaluations.map((evaluation) => (
            <Card key={evaluation.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <ClipboardList className="h-4 w-4" />
                      Pré-avaliação de {format(new Date(evaluation.created_at), "dd 'de' MMMM 'de' yyyy", {locale: ptBR})}
                    </CardTitle>
                    <CardDescription>
                      {format(new Date(evaluation.created_at), "HH:mm", {locale: ptBR})}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadPDF(evaluation)}
                      className="h-8 w-8 p-0"
                      title="Download PDF"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditEvaluation(evaluation)}
                      className="h-8 w-8 p-0"
                      title="Editar pré-avaliação"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          title="Excluir pré-avaliação"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir esta pré-avaliação? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteEvaluation(evaluation.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2 space-y-2">
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div><span className="font-medium">Profissão:</span> {evaluation.profissao}</div>
                  <div><span className="font-medium">Queixa Principal:</span> {evaluation.queixa_principal}</div>
                  <div><span className="font-medium">Tempo do Problema:</span> {evaluation.tempo_problema}</div>
                  <div><span className="font-medium">Descrição da Dor:</span> {evaluation.descricao_dor}</div>
                  <div><span className="font-medium">Escala da Dor:</span> {evaluation.escala_dor}</div>
                  {evaluation.medicamentos && (
                    <div><span className="font-medium">Medicamentos:</span> {evaluation.medicamentos}</div>
                  )}
                  {evaluation.alergias && (
                    <div><span className="font-medium">Alergias:</span> {evaluation.alergias}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
