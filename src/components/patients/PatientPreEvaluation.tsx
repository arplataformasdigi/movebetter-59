
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
import { FileText } from "lucide-react";
import { usePatientPreEvaluations } from "@/hooks/usePatientPreEvaluations";

const preEvaluationSchema = z.object({
  // Informações pessoais
  profissao: z.string().min(3, { message: "Campo obrigatório" }),
  atividade_fisica: z.string().min(3, { message: "Campo obrigatório" }),
  hobby: z.string().min(3, { message: "Campo obrigatório" }),
  
  // Queixa Principal
  queixa_principal: z.string().min(3, { message: "Campo obrigatório" }),
  tempo_problema: z.string().min(3, { message: "Campo obrigatório" }),
  inicio_problema: z.string().min(3, { message: "Campo obrigatório" }),
  tratamento_anterior: z.string().min(3, { message: "Campo obrigatório" }),
  
  // Caracterização da Dor
  descricao_dor: z.string().min(3, { message: "Campo obrigatório" }),
  escala_dor: z.string().min(1, { message: "Campo obrigatório" }),
  irradiacao_dor: z.string().min(3, { message: "Campo obrigatório" }),
  piora_dor: z.string().min(3, { message: "Campo obrigatório" }),
  alivio_dor: z.string().min(3, { message: "Campo obrigatório" }),
  interferencia_dor: z.string().min(3, { message: "Campo obrigatório" }),
  
  // Histórico Médico
  diagnostico_medico: z.string().min(3, { message: "Campo obrigatório" }),
  exames_recentes: z.string().min(3, { message: "Campo obrigatório" }),
  condicoes_saude: z.string().min(3, { message: "Campo obrigatório" }),
  cirurgias: z.string().min(3, { message: "Campo obrigatório" }),
  medicamentos: z.string().optional(),
  alergias: z.string().optional(),
  
  // Histórico Familiar
  doencas_familiares: z.string().min(3, { message: "Campo obrigatório" }),
  condicoes_similares: z.string().min(3, { message: "Campo obrigatório" }),
  
  // Hábitos e Estilo de Vida
  alimentacao: z.string().min(3, { message: "Campo obrigatório" }),
  padrao_sono: z.string().min(3, { message: "Campo obrigatório" }),
  alcool: z.string().min(3, { message: "Campo obrigatório" }),
  fumante: z.string().min(3, { message: "Campo obrigatório" }),
  ingestao_agua: z.string().min(3, { message: "Campo obrigatório" }),
  tempo_sentado: z.string().min(3, { message: "Campo obrigatório" }),
  
  // Aspectos Psicossociais
  nivel_estresse: z.string().optional(),
  questoes_emocionais: z.string().optional(),
  impacto_qualidade_vida: z.string().optional(),
  
  // Objetivos e Expectativas
  expectativas_tratamento: z.string().optional(),
  exercicios_casa: z.string().min(3, { message: "Campo obrigatório" }),
  restricoes: z.string().optional(),
  
  // Avaliação Funcional
  dificuldade_dia: z.string().min(3, { message: "Campo obrigatório" }),
  dispositivo_auxilio: z.string().min(3, { message: "Campo obrigatório" }),
  dificuldade_equilibrio: z.string().min(3, { message: "Campo obrigatório" }),
  limitacao_movimento: z.string().min(3, { message: "Campo obrigatório" }),
  
  // Informações Adicionais
  info_adicional: z.string().optional(),
  duvidas_fisioterapia: z.string().optional(),
});

type PreEvaluationFormValues = z.infer<typeof preEvaluationSchema>;

interface PatientPreEvaluationProps {
  patientId: string;
}

export function PatientPreEvaluation({ patientId }: PatientPreEvaluationProps) {
  const [showForm, setShowForm] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<any>(null);
  const { preEvaluations, isLoading, addPreEvaluation } = usePatientPreEvaluations(patientId);

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

  async function onSubmit(values: PreEvaluationFormValues) {
    const result = await addPreEvaluation({
      patient_id: patientId,
      ...values,
    });
    
    if (result.success) {
      setShowForm(false);
      form.reset();
    }
  }

  function handleViewEvaluation(evaluation: any) {
    setSelectedEvaluation(evaluation);
  }

  function handleBackToList() {
    setSelectedEvaluation(null);
  }

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Carregando pré-avaliações...
      </div>
    );
  }

  if (selectedEvaluation) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            Ficha de Pré-avaliação
          </h3>
          <Button variant="outline" onClick={handleBackToList}>
            Voltar à lista
          </Button>
        </div>

        <Card className="p-4">
          <CardContent className="p-4 space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium text-lg border-b pb-2">Informações pessoais</h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Profissão</p>
                  <p className="text-sm mt-1">{selectedEvaluation.profissao}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Atividade Física</p>
                  <p className="text-sm mt-1">{selectedEvaluation.atividade_fisica}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Hobby</p>
                  <p className="text-sm mt-1">{selectedEvaluation.hobby}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-lg border-b pb-2">Queixa Principal</h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Queixa Principal</p>
                  <p className="text-sm mt-1">{selectedEvaluation.queixa_principal}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Tempo do Problema</p>
                  <p className="text-sm mt-1">{selectedEvaluation.tempo_problema}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Início do Problema</p>
                  <p className="text-sm mt-1">{selectedEvaluation.inicio_problema}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-lg border-b pb-2">Caracterização da Dor</h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Descrição da Dor</p>
                  <p className="text-sm mt-1">{selectedEvaluation.descricao_dor}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Escala da Dor (0-10)</p>
                  <p className="text-sm mt-1">{selectedEvaluation.escala_dor}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Nova Pré-avaliação</h3>
          <Button variant="outline" onClick={() => setShowForm(false)}>
            Cancelar
          </Button>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Informações pessoais */}
            <Card className="p-4">
              <h4 className="text-lg font-medium mb-4">Informações pessoais</h4>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="profissao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qual é sua profissão e que atividades realiza diariamente no trabalho?</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descreva sua profissão e atividades diárias" {...field} />
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
                      <FormLabel>Pratica alguma atividade física ou esporte regularmente? Qual frequência e intensidade?</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descreva suas atividades físicas" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hobby"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Possui algum hobby ou atividade de lazer que realiza habitualmente?</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descreva seus hobbies e atividades de lazer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            {/* Queixa Principal */}
            <Card className="p-4">
              <h4 className="text-lg font-medium mb-4">Queixa Principal</h4>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="queixa_principal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qual é o principal motivo que o(a) traz à fisioterapia?</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descreva o motivo principal" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tempo_problema"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Há quanto tempo apresenta esse problema?</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Informe o tempo do problema" {...field} />
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
                      <FormLabel>Como e quando começou esse problema? Foi gradual ou repentino?</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descreva o início do problema" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tratamento_anterior"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Já realizou tratamento para esse problema anteriormente? Qual foi o resultado?</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descreva tratamentos anteriores" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            {/* Caracterização da Dor */}
            <Card className="p-4">
              <h4 className="text-lg font-medium mb-4">Caracterização da Dor</h4>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="descricao_dor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Se sente dor, poderia descrevê-la? (tipo: queimação, pontada, pressão, formigamento)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descreva a dor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="escala_dor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Em uma escala de 0 a 10, sendo 0 ausência de dor e 10 a pior dor imaginável, como classificaria sua dor?</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Informe a escala de dor (0-10)" {...field} />
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
                      <FormLabel>A dor irradia para algum local? Para onde?</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descreva a irradiação da dor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="piora_dor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>O que piora sua dor ou desconforto? (movimentos, posturas, horários do dia)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descreva o que piora a dor" {...field} />
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
                      <FormLabel>O que alivia sua dor ou desconforto?</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descreva o que alivia a dor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="interferencia_dor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>A dor interfere no seu sono ou nas atividades diárias? De que forma?</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descreva como a dor interfere" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            {/* Histórico Médico */}
            <Card className="p-4">
              <h4 className="text-lg font-medium mb-4">Histórico Médico</h4>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="diagnostico_medico"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Possui algum diagnóstico médico relacionado à sua queixa atual?</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descreva diagnósticos médicos" {...field} />
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
                      <FormLabel>Realizou exames de imagem recentes? Quais foram os resultados?</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descreva exames e resultados" {...field} />
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
                      <FormLabel>Possui alguma condição de saúde diagnosticada? (hipertensão, diabetes, problemas cardíacos, etc.)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descreva condições de saúde" {...field} />
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
                      <FormLabel>Já realizou cirurgias? Quais e quando?</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descreva cirurgias realizadas" {...field} />
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
                      <FormLabel>Está fazendo uso de medicamentos? Quais?</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Liste os medicamentos em uso" {...field} />
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
                      <FormLabel>Tem alguma alergia conhecida?</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descreva alergias conhecidas" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            {/* Continue with all other sections... */}
            
            <div className="flex justify-end">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Salvando..." : "Salvar Pré-avaliação"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Pré-avaliação do Paciente</h3>
        <Button onClick={() => setShowForm(true)}>Criar Pré-avaliação</Button>
      </div>

      {preEvaluations.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            Nenhuma ficha de pré-avaliação encontrada para este paciente.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {preEvaluations.map((evaluation) => (
            <Card key={evaluation.id} className="p-4 cursor-pointer hover:bg-gray-50" onClick={() => handleViewEvaluation(evaluation)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-movebetter-light p-2 rounded-md mr-3">
                    <FileText className="h-5 w-5 text-movebetter-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Ficha de Pré-avaliação</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(evaluation.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Ver ficha</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
