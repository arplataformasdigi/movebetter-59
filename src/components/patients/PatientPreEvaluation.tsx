
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import { ClipboardList, Edit, Trash2, Download, Plus } from "lucide-react";
import { usePatientPreEvaluations, PreEvaluation } from "@/hooks/usePatientPreEvaluations";

// Simplified PDF generation function
const generatePreEvaluationPDF = (evaluation: PreEvaluation, patientName: string) => {
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    throw new Error('Popup bloqueado. Permita popups para gerar o PDF.');
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Pré-avaliação - ${patientName}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .section { margin-bottom: 20px; }
        .section-title { font-weight: bold; font-size: 14px; margin-bottom: 10px; color: #333; border-bottom: 1px solid #ddd; }
        .field { margin-bottom: 8px; }
        .field-label { font-weight: bold; display: inline-block; min-width: 150px; }
        .field-value { display: inline-block; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>FICHA DE PRÉ-AVALIAÇÃO</h1>
        <h2>FISIOTERAPIA</h2>
      </div>

      <div class="section">
        <div class="section-title">Dados do Paciente</div>
        <div class="field">
          <span class="field-label">Nome:</span>
          <span class="field-value">${patientName}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Informações Gerais</div>
        <div class="field">
          <span class="field-label">Profissão:</span>
          <span class="field-value">${evaluation.profissao}</span>
        </div>
        <div class="field">
          <span class="field-label">Atividade Física:</span>
          <span class="field-value">${evaluation.atividade_fisica}</span>
        </div>
        <div class="field">
          <span class="field-label">Hobby:</span>
          <span class="field-value">${evaluation.hobby}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Queixa e Dor</div>
        <div class="field">
          <span class="field-label">Queixa Principal:</span>
          <span class="field-value">${evaluation.queixa_principal}</span>
        </div>
        <div class="field">
          <span class="field-label">Tempo do Problema:</span>
          <span class="field-value">${evaluation.tempo_problema}</span>
        </div>
        <div class="field">
          <span class="field-label">Descrição da Dor:</span>
          <span class="field-value">${evaluation.descricao_dor}</span>
        </div>
        <div class="field">
          <span class="field-label">Escala da Dor:</span>
          <span class="field-value">${evaluation.escala_dor}</span>
        </div>
      </div>

      <div class="footer">
        <p>Data de Avaliação: ${new Date(evaluation.created_at).toLocaleDateString('pt-BR')}</p>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };
};

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
  medicamentos: z.string().min(1, "Medicamentos é obrigatório"),
  alergias: z.string().min(1, "Alergias é obrigatório"),
  doencas_familiares: z.string().min(1, "Doenças familiares é obrigatório"),
  condicoes_similares: z.string().min(1, "Condições similares é obrigatório"),
  alimentacao: z.string().min(1, "Alimentação é obrigatória"),
  padrao_sono: z.string().min(1, "Padrão de sono é obrigatório"),
  alcool: z.string().min(1, "Álcool é obrigatório"),
  fumante: z.string().min(1, "Fumante é obrigatório"),
  ingestao_agua: z.string().min(1, "Ingestão de água é obrigatória"),
  tempo_sentado: z.string().min(1, "Tempo sentado é obrigatório"),
  nivel_estresse: z.string().min(1, "Nível de estresse é obrigatório"),
  questoes_emocionais: z.string().min(1, "Questões emocionais é obrigatório"),
  impacto_qualidade_vida: z.string().min(1, "Impacto na qualidade de vida é obrigatório"),
  expectativas_tratamento: z.string().min(1, "Expectativas do tratamento é obrigatório"),
  exercicios_casa: z.string().min(1, "Exercícios em casa é obrigatório"),
  restricoes: z.string().min(1, "Restrições é obrigatório"),
  dificuldade_dia: z.string().min(1, "Dificuldade no dia é obrigatória"),
  dispositivo_auxilio: z.string().min(1, "Dispositivo de auxílio é obrigatório"),
  dificuldade_equilibrio: z.string().min(1, "Dificuldade de equilíbrio é obrigatória"),
  limitacao_movimento: z.string().min(1, "Limitação de movimento é obrigatória"),
  info_adicional: z.string().min(1, "Informações adicionais é obrigatório"),
  duvidas_fisioterapia: z.string().min(1, "Dúvidas sobre fisioterapia é obrigatório"),
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
    const evaluationData = {
      patient_id: patientId,
      ...values,
    };

    if (editingEvaluation) {
      updatePreEvaluation(editingEvaluation.id, evaluationData);
      setEditingEvaluation(null);
    } else {
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
              <Plus className="h-4 w-4 mr-2" />
              Nova Pré-avaliação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
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
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs defaultValue="dados-gerais" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="dados-gerais">Dados Gerais</TabsTrigger>
                    <TabsTrigger value="dor-sintomas">Dor e Sintomas</TabsTrigger>
                    <TabsTrigger value="saude-historico">Saúde e Histórico</TabsTrigger>
                    <TabsTrigger value="estilo-vida">Estilo de Vida</TabsTrigger>
                  </TabsList>

                  <TabsContent value="dados-gerais" className="space-y-4">
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

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="tempo_problema"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tempo do Problema</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: 3 meses, 1 ano" {...field} />
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
                            <FormLabel>Como Iniciou o Problema</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: gradualmente, após acidente" {...field} />
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
                            <Textarea placeholder="Descreva tratamentos já realizados" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="dor-sintomas" className="space-y-4">
                    <FormField
                      control={form.control}
                      name="descricao_dor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição da Dor</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Como é a dor? (queimação, pontada, etc.)" {...field} />
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
                            <FormLabel>Escala da Dor (0-10)</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione de 0 a 10" />
                                </SelectTrigger>
                                <SelectContent>
                                  {[...Array(11)].map((_, i) => (
                                    <SelectItem key={i} value={i.toString()}>
                                      {i} - {i === 0 ? "Sem dor" : i <= 3 ? "Leve" : i <= 6 ? "Moderada" : i <= 8 ? "Intensa" : "Insuportável"}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
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
                              <Input placeholder="Para onde a dor se espalha?" {...field} />
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
                              <Textarea placeholder="Atividades ou situações que pioram" {...field} />
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
                              <Textarea placeholder="Atividades ou situações que aliviam" {...field} />
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
                          <FormLabel>Como a Dor Interfere no Dia a Dia</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Impacto nas atividades diárias" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="dificuldade_dia"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Principais Dificuldades</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Atividades mais difíceis de realizar" {...field} />
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
                            <FormLabel>Limitações de Movimento</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Movimentos limitados ou dolorosos" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="dificuldade_equilibrio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dificuldade de Equilíbrio</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione uma opção" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="nenhuma">Nenhuma</SelectItem>
                                  <SelectItem value="leve">Leve</SelectItem>
                                  <SelectItem value="moderada">Moderada</SelectItem>
                                  <SelectItem value="severa">Severa</SelectItem>
                                </SelectContent>
                              </Select>
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
                            <FormLabel>Usa Dispositivos de Auxílio</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione uma opção" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="nenhum">Nenhum</SelectItem>
                                  <SelectItem value="bengala">Bengala</SelectItem>
                                  <SelectItem value="muletas">Muletas</SelectItem>
                                  <SelectItem value="andador">Andador</SelectItem>
                                  <SelectItem value="cadeira-rodas">Cadeira de rodas</SelectItem>
                                  <SelectItem value="outros">Outros</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="saude-historico" className="space-y-4">
                    <FormField
                      control={form.control}
                      name="diagnostico_medico"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Diagnóstico Médico</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Diagnóstico fornecido pelo médico" {...field} />
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
                            <Textarea placeholder="Exames realizados (raio-x, ressonância, etc.)" {...field} />
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
                          <FormLabel>Outras Condições de Saúde</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Diabetes, hipertensão, etc." {...field} />
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
                          <FormLabel>Cirurgias Anteriores</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Cirurgias realizadas e quando" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="medicamentos"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Medicamentos em Uso</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Medicamentos atuais" {...field} />
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
                              <Textarea placeholder="Alergias conhecidas" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="doencas_familiares"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Doenças na Família</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Histórico familiar de doenças" {...field} />
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
                            <FormLabel>Condições Similares na Família</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Família com problemas similares" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="estilo-vida" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="alimentacao"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Alimentação</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Como avalia sua alimentação?" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="excelente">Excelente</SelectItem>
                                  <SelectItem value="boa">Boa</SelectItem>
                                  <SelectItem value="regular">Regular</SelectItem>
                                  <SelectItem value="ruim">Ruim</SelectItem>
                                </SelectContent>
                              </Select>
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Como é seu sono?" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="excelente">Excelente</SelectItem>
                                  <SelectItem value="bom">Bom</SelectItem>
                                  <SelectItem value="regular">Regular</SelectItem>
                                  <SelectItem value="ruim">Ruim</SelectItem>
                                  <SelectItem value="insonia">Insônia</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="alcool"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Consumo de Álcool</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Frequência" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="nunca">Nunca</SelectItem>
                                  <SelectItem value="raramente">Raramente</SelectItem>
                                  <SelectItem value="socialmente">Socialmente</SelectItem>
                                  <SelectItem value="frequentemente">Frequentemente</SelectItem>
                                  <SelectItem value="diariamente">Diariamente</SelectItem>
                                </SelectContent>
                              </Select>
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="nao">Não</SelectItem>
                                  <SelectItem value="sim">Sim</SelectItem>
                                  <SelectItem value="ex-fumante">Ex-fumante</SelectItem>
                                </SelectContent>
                              </Select>
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
                            <FormLabel>Ingestão de Água (litros/dia)</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Quantidade" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="menos-1">Menos de 1L</SelectItem>
                                  <SelectItem value="1-2">1-2L</SelectItem>
                                  <SelectItem value="2-3">2-3L</SelectItem>
                                  <SelectItem value="mais-3">Mais de 3L</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="tempo_sentado"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tempo Sentado por Dia</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Horas por dia" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="menos-2">Menos de 2 horas</SelectItem>
                                <SelectItem value="2-4">2-4 horas</SelectItem>
                                <SelectItem value="4-6">4-6 horas</SelectItem>
                                <SelectItem value="6-8">6-8 horas</SelectItem>
                                <SelectItem value="mais-8">Mais de 8 horas</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="nivel_estresse"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nível de Estresse (0-10)</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione de 0 a 10" />
                                </SelectTrigger>
                                <SelectContent>
                                  {[...Array(11)].map((_, i) => (
                                    <SelectItem key={i} value={i.toString()}>
                                      {i} - {i === 0 ? "Nenhum" : i <= 3 ? "Baixo" : i <= 6 ? "Moderado" : i <= 8 ? "Alto" : "Muito Alto"}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
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
                            <FormLabel>Disponibilidade para Exercícios em Casa</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="sim-muito">Sim, muito interessado</SelectItem>
                                  <SelectItem value="sim-moderado">Sim, moderadamente</SelectItem>
                                  <SelectItem value="talvez">Talvez</SelectItem>
                                  <SelectItem value="nao-tempo">Não tenho tempo</SelectItem>
                                  <SelectItem value="nao-interesse">Não tenho interesse</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="questoes_emocionais"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Questões Emocionais</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Ansiedade, depressão, ou outras questões emocionais" {...field} />
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
                            <Textarea placeholder="Como o problema afeta sua qualidade de vida" {...field} />
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
                            <Textarea placeholder="O que espera do tratamento fisioterapêutico" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="restricoes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Restrições Especiais</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Restrições médicas ou físicas" {...field} />
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
                              <Textarea placeholder="Outras informações relevantes" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="duvidas_fisioterapia"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dúvidas sobre Fisioterapia</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Dúvidas ou preocupações sobre o tratamento" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>
                
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
          <CardContent className="p-6 text-center text-muted-foreground">
            <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma pré-avaliação encontrada</h3>
            <p className="text-sm">Clique em "Nova Pré-avaliação" para começar.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {preEvaluations.map((evaluation) => (
            <Card key={evaluation.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <ClipboardList className="h-4 w-4" />
                      Pré-avaliação de {format(new Date(evaluation.created_at), "dd 'de' MMMM 'de' yyyy", {locale: ptBR})}
                    </CardTitle>
                    <CardDescription>
                      Criada às {format(new Date(evaluation.created_at), "HH:mm", {locale: ptBR})}
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
              <CardContent className="pb-3 space-y-2">
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div><span className="font-medium">Profissão:</span> {evaluation.profissao}</div>
                  <div><span className="font-medium">Queixa Principal:</span> {evaluation.queixa_principal}</div>
                  <div><span className="font-medium">Tempo do Problema:</span> {evaluation.tempo_problema}</div>
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
