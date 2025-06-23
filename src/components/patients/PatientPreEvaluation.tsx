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
import { FileText, Download, Edit, Trash2, Eye } from "lucide-react";
import { usePatientPreEvaluations, PreEvaluation } from "@/hooks/usePatientPreEvaluations";
import { usePatients } from "@/hooks/usePatients";
import { generatePreEvaluationPDF } from "@/utils/pdfGenerator";
import { toast } from "sonner";

// Schema para validação do formulário
const preEvaluationSchema = z.object({
  profissao: z.string().min(2, { message: "Profissão deve ter pelo menos 2 caracteres" }),
  atividade_fisica: z.string().min(1, { message: "Campo obrigatório" }),
  hobby: z.string().min(1, { message: "Campo obrigatório" }),
  queixa_principal: z.string().min(10, { message: "Campo deve ter pelo menos 10 caracteres" }),
  tempo_problema: z.string().min(1, { message: "Campo obrigatório" }),
  inicio_problema: z.string().min(1, { message: "Campo obrigatório" }),
  tratamento_anterior: z.string().min(1, { message: "Campo obrigatório" }),
  descricao_dor: z.string().min(1, { message: "Campo obrigatório" }),
  escala_dor: z.string().min(1, { message: "Campo obrigatório" }),
  irradiacao_dor: z.string().min(1, { message: "Campo obrigatório" }),
  piora_dor: z.string().min(1, { message: "Campo obrigatório" }),
  alivio_dor: z.string().min(1, { message: "Campo obrigatório" }),
  interferencia_dor: z.string().min(1, { message: "Campo obrigatório" }),
  diagnostico_medico: z.string().min(1, { message: "Campo obrigatório" }),
  exames_recentes: z.string().min(1, { message: "Campo obrigatório" }),
  condicoes_saude: z.string().min(1, { message: "Campo obrigatório" }),
  cirurgias: z.string().min(1, { message: "Campo obrigatório" }),
  medicamentos: z.string().optional(),
  alergias: z.string().optional(),
  doencas_familiares: z.string().min(1, { message: "Campo obrigatório" }),
  condicoes_similares: z.string().min(1, { message: "Campo obrigatório" }),
  alimentacao: z.string().min(1, { message: "Campo obrigatório" }),
  padrao_sono: z.string().min(1, { message: "Campo obrigatório" }),
  alcool: z.string().min(1, { message: "Campo obrigatório" }),
  fumante: z.string().min(1, { message: "Campo obrigatório" }),
  ingestao_agua: z.string().min(1, { message: "Campo obrigatório" }),
  tempo_sentado: z.string().min(1, { message: "Campo obrigatório" }),
  nivel_estresse: z.string().optional(),
  questoes_emocionais: z.string().optional(),
  impacto_qualidade_vida: z.string().optional(),
  expectativas_tratamento: z.string().optional(),
  exercicios_casa: z.string().min(1, { message: "Campo obrigatório" }),
  restricoes: z.string().optional(),
  dificuldade_dia: z.string().min(1, { message: "Campo obrigatório" }),
  dispositivo_auxilio: z.string().min(1, { message: "Campo obrigatório" }),
  dificuldade_equilibrio: z.string().min(1, { message: "Campo obrigatório" }),
  limitacao_movimento: z.string().min(1, { message: "Campo obrigatório" }),
  info_adicional: z.string().optional(),
  duvidas_fisioterapia: z.string().optional(),
});

type PreEvaluationFormValues = z.infer<typeof preEvaluationSchema>;

interface PatientPreEvaluationProps {
  patientId: string;
}

export function PatientPreEvaluation({ patientId }: PatientPreEvaluationProps) {
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editingEvaluation, setEditingEvaluation] = useState<PreEvaluation | null>(null);
  const [viewingEvaluation, setViewingEvaluation] = useState<PreEvaluation | null>(null);
  
  const { preEvaluations, isLoading, addPreEvaluation, updatePreEvaluation, deletePreEvaluation } = usePatientPreEvaluations(patientId);
  const { patients } = usePatients();
  
  const currentPatient = patients.find(p => p.id === patientId);
  
  const form = useForm<PreEvaluationFormValues>({
    resolver: zodResolver(preEvaluationSchema),
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

  function onSubmit(values: PreEvaluationFormValues) {
    if (editingEvaluation) {
      updatePreEvaluation(editingEvaluation.id, {
        ...values,
        patient_id: patientId,
      });
      setEditingEvaluation(null);
    } else {
      addPreEvaluation({
        ...values,
        patient_id: patientId,
      });
    }
    
    form.reset();
    setOpen(false);
  }

  const handleEdit = (evaluation: PreEvaluation) => {
    setEditingEvaluation(evaluation);
    form.reset(evaluation);
    setOpen(true);
  };

  const handleView = (evaluation: PreEvaluation) => {
    setViewingEvaluation(evaluation);
    setViewOpen(true);
  };

  const handleDelete = (evaluationId: string) => {
    deletePreEvaluation(evaluationId);
  };

  const handleDownloadPDF = (evaluation: PreEvaluation) => {
    if (!currentPatient) {
      toast.error("Dados do paciente não encontrados");
      return;
    }

    try {
      // Mock dos dados do profissional - em uma implementação real, 
      // estes dados viriam do perfil do usuário logado
      const professionalData = {
        name: "Dr(a). Nome do Profissional",
        address: "Endereço da clínica",
        phone: "(11) 99999-9999",
        councilNumber: "CREFITO XX/XXXXX"
      };

      generatePreEvaluationPDF(evaluation, currentPatient, professionalData);
      toast.success("PDF gerado com sucesso");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Erro ao gerar PDF. Verifique se popups estão permitidos.");
    }
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
              {editingEvaluation ? "Editar Pré-avaliação" : "Adicionar Pré-avaliação"}
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
                {/* Formulário completo com todos os campos - mantendo estrutura existente */}
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
                        <Input placeholder="Hobbies e atividades de lazer" {...field} />
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

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tempo_problema"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tempo do Problema</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 6 meses" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="inicio_problema"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Início do Problema</FormLabel>
                        <FormControl>
                          <Input placeholder="Como começou o problema" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="tratamento_anterior"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tratamento Anterior</FormLabel>
                      <FormControl>
                        <Input placeholder="Descreva tratamentos anteriores" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="descricao_dor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição da Dor</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descreva a dor" className="h-20" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="escala_dor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Escala da Dor</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 0 a 10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="irradiacao_dor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Irradiação da Dor</FormLabel>
                        <FormControl>
                          <Input placeholder="Localização da irradiação" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="piora_dor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>O que Piora a Dor</FormLabel>
                        <FormControl>
                          <Input placeholder="Fatores que pioram a dor" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="alivio_dor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>O que Alivia a Dor</FormLabel>
                        <FormControl>
                          <Input placeholder="Fatores que aliviam a dor" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="interferencia_dor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interferência da Dor</FormLabel>
                      <FormControl>
                        <Input placeholder="Como a dor interfere na vida" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="diagnostico_medico"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diagnóstico Médico</FormLabel>
                      <FormControl>
                        <Input placeholder="Diagnóstico médico" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="exames_recentes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exames Recentes</FormLabel>
                      <FormControl>
                        <Input placeholder="Exames realizados recentemente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="condicoes_saude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condições de Saúde</FormLabel>
                      <FormControl>
                        <Input placeholder="Condições de saúde atuais" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cirurgias"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cirurgias</FormLabel>
                      <FormControl>
                        <Input placeholder="Cirurgias anteriores" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="medicamentos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medicamentos</FormLabel>
                      <FormControl>
                        <Input placeholder="Medicamentos em uso" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="alergias"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alergias</FormLabel>
                      <FormControl>
                        <Input placeholder="Alergias conhecidas" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="doencas_familiares"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Doenças Familiares</FormLabel>
                      <FormControl>
                        <Input placeholder="Histórico familiar de doenças" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="condicoes_similares"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condições Similares</FormLabel>
                      <FormControl>
                        <Input placeholder="Condições similares na família" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="alimentacao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alimentação</FormLabel>
                      <FormControl>
                        <Input placeholder="Hábitos alimentares" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="padrao_sono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Padrão de Sono</FormLabel>
                      <FormControl>
                        <Input placeholder="Qualidade e quantidade do sono" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="alcool"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Álcool</FormLabel>
                      <FormControl>
                        <Input placeholder="Consumo de álcool" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fumante"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fumante</FormLabel>
                      <FormControl>
                        <Input placeholder="Consumo de tabaco" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ingestao_agua"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ingestão de Água</FormLabel>
                      <FormControl>
                        <Input placeholder="Quantidade diária de água" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tempo_sentado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tempo Sentado</FormLabel>
                      <FormControl>
                        <Input placeholder="Tempo sentado por dia" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nivel_estresse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nível de Estresse</FormLabel>
                      <FormControl>
                        <Input placeholder="Nível de estresse" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="questoes_emocionais"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Questões Emocionais</FormLabel>
                      <FormControl>
                        <Input placeholder="Questões emocionais relevantes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="impacto_qualidade_vida"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Impacto na Qualidade de Vida</FormLabel>
                      <FormControl>
                        <Input placeholder="Impacto na qualidade de vida" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expectativas_tratamento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expectativas do Tratamento</FormLabel>
                      <FormControl>
                        <Input placeholder="Expectativas do paciente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="exercicios_casa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exercícios em Casa</FormLabel>
                      <FormControl>
                        <Input placeholder="Exercícios realizados em casa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="restricoes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Restrições</FormLabel>
                      <FormControl>
                        <Input placeholder="Restrições do paciente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dificuldade_dia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dificuldade nas Atividades Diárias</FormLabel>
                      <FormControl>
                        <Input placeholder="Dificuldades diárias" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dispositivo_auxilio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dispositivo de Auxílio</FormLabel>
                      <FormControl>
                        <Input placeholder="Uso de dispositivos de auxílio" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dificuldade_equilibrio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dificuldade de Equilíbrio</FormLabel>
                      <FormControl>
                        <Input placeholder="Dificuldades de equilíbrio" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="limitacao_movimento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Limitação de Movimento</FormLabel>
                      <FormControl>
                        <Input placeholder="Limitações de movimento" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="info_adicional"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Informações Adicionais</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Informações adicionais" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duvidas_fisioterapia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dúvidas sobre Fisioterapia</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Dúvidas do paciente" {...field} />
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
                      <FileText className="h-4 w-4" />
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
                      onClick={() => handleView(evaluation)}
                      className="h-8 w-8 p-0"
                      title="Ver ficha completa"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(evaluation)}
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
                            Todos os dados da pré-avaliação serão removidos permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(evaluation.id)}
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
              <CardContent className="pb-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Profissão:</span> {evaluation.profissao}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Atividade Física:</span> {evaluation.atividade_fisica}
                  </div>
                </div>
                <div className="mt-2">
                  <span className="font-medium text-gray-700">Queixa Principal:</span>
                  <p className="text-sm text-muted-foreground mt-1">{evaluation.queixa_principal}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog para visualizar pré-avaliação completa */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Visualizar Pré-avaliação Completa</DialogTitle>
          </DialogHeader>
          {viewingEvaluation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Profissão:</span>
                  <p>{viewingEvaluation.profissao}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Atividade Física:</span>
                  <p>{viewingEvaluation.atividade_fisica}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Hobby:</span>
                  <p>{viewingEvaluation.hobby}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Tempo do Problema:</span>
                  <p>{viewingEvaluation.tempo_problema}</p>
                </div>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Queixa Principal:</span>
                <p className="text-sm mt-1">{viewingEvaluation.queixa_principal}</p>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Descrição da Dor:</span>
                <p className="text-sm mt-1">{viewingEvaluation.descricao_dor}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Escala da Dor:</span>
                  <p>{viewingEvaluation.escala_dor}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">O que Piora:</span>
                  <p>{viewingEvaluation.piora_dor}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">O que Alivia:</span>
                  <p>{viewingEvaluation.alivio_dor}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Interferência:</span>
                  <p>{viewingEvaluation.interferencia_dor}</p>
                </div>
              </div>
              
              {/* Adicionar mais campos de visualização conforme necessário */}
              
              <div className="pt-4">
                <Button 
                  onClick={() => handleDownloadPDF(viewingEvaluation)}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF Completo
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
