
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

const preEvaluationSchema = z.object({
  // Informações pessoais
  profissao: z.string().min(3, { message: "Campo obrigatório" }),
  atividadeFisica: z.string().min(3, { message: "Campo obrigatório" }),
  hobby: z.string().min(3, { message: "Campo obrigatório" }),
  
  // Queixa Principal
  queixaPrincipal: z.string().min(3, { message: "Campo obrigatório" }),
  tempoProblema: z.string().min(3, { message: "Campo obrigatório" }),
  inicioProblema: z.string().min(3, { message: "Campo obrigatório" }),
  tratamentoAnterior: z.string().min(3, { message: "Campo obrigatório" }),
  
  // Caracterização da Dor
  descricaoDor: z.string().min(3, { message: "Campo obrigatório" }),
  escalaDor: z.string().min(1, { message: "Campo obrigatório" }),
  irradiacaoDor: z.string().min(3, { message: "Campo obrigatório" }),
  pioraDor: z.string().min(3, { message: "Campo obrigatório" }),
  alivioDor: z.string().min(3, { message: "Campo obrigatório" }),
  interferenciaDor: z.string().min(3, { message: "Campo obrigatório" }),
  
  // Histórico Médico
  diagnosticoMedico: z.string().min(3, { message: "Campo obrigatório" }),
  examesRecentes: z.string().min(3, { message: "Campo obrigatório" }),
  condicoesSaude: z.string().min(3, { message: "Campo obrigatório" }),
  cirurgias: z.string().min(3, { message: "Campo obrigatório" }),
  
  // Histórico Familiar
  doencasFamiliares: z.string().min(3, { message: "Campo obrigatório" }),
  condicesSimilares: z.string().min(3, { message: "Campo obrigatório" }),
  
  // Atividades Extras
  exerciciosCasa: z.string().min(3, { message: "Campo obrigatório" }),
  
  // Hábitos e Estilo de Vida
  alimentacao: z.string().min(3, { message: "Campo obrigatório" }),
  padraoSono: z.string().min(3, { message: "Campo obrigatório" }),
  alcool: z.string().min(3, { message: "Campo obrigatório" }),
  fumante: z.string().min(3, { message: "Campo obrigatório" }),
  ingestaoAgua: z.string().min(3, { message: "Campo obrigatório" }),
  tempoSentado: z.string().min(3, { message: "Campo obrigatório" }),
  
  // Avaliação Funcional
  dificuldadeDia: z.string().min(3, { message: "Campo obrigatório" }),
  dispositivoAuxilio: z.string().min(3, { message: "Campo obrigatório" }),
  dificuldadeEquilibrio: z.string().min(3, { message: "Campo obrigatório" }),
  limitacaoMovimento: z.string().min(3, { message: "Campo obrigatório" }),
  
  // Informações Adicionais
  infoAdicional: z.string().optional(),
});

type PreEvaluationFormValues = z.infer<typeof preEvaluationSchema>;

interface PatientPreEvaluation {
  id: string;
  createdAt: Date;
  formData: PreEvaluationFormValues;
}

interface PatientPreEvaluationProps {
  patientId: string;
  preEvaluations?: PatientPreEvaluation[];
  onAddPreEvaluation: (patientId: string, evaluation: PatientPreEvaluation) => void;
}

export function PatientPreEvaluation({
  patientId,
  preEvaluations = [],
  onAddPreEvaluation,
}: PatientPreEvaluationProps) {
  const [showForm, setShowForm] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<PatientPreEvaluation | null>(null);

  const form = useForm<PreEvaluationFormValues>({
    resolver: zodResolver(preEvaluationSchema),
    defaultValues: {
      profissao: "",
      atividadeFisica: "",
      hobby: "",
      queixaPrincipal: "",
      tempoProblema: "",
      inicioProblema: "",
      tratamentoAnterior: "",
      descricaoDor: "",
      escalaDor: "",
      irradiacaoDor: "",
      pioraDor: "",
      alivioDor: "",
      interferenciaDor: "",
      diagnosticoMedico: "",
      examesRecentes: "",
      condicoesSaude: "",
      cirurgias: "",
      doencasFamiliares: "",
      condicesSimilares: "",
      exerciciosCasa: "",
      alimentacao: "",
      padraoSono: "",
      alcool: "",
      fumante: "",
      ingestaoAgua: "",
      tempoSentado: "",
      dificuldadeDia: "",
      dispositivoAuxilio: "",
      dificuldadeEquilibrio: "",
      limitacaoMovimento: "",
      infoAdicional: "",
    },
  });

  function onSubmit(values: PreEvaluationFormValues) {
    const newPreEvaluation: PatientPreEvaluation = {
      id: `pre-eval-${Date.now()}`,
      createdAt: new Date(),
      formData: values,
    };
    
    onAddPreEvaluation(patientId, newPreEvaluation);
    toast.success("Ficha de pré-avaliação criada com sucesso!");
    setShowForm(false);
    form.reset();
  }

  function handleViewEvaluation(evaluation: PatientPreEvaluation) {
    setSelectedEvaluation(evaluation);
  }

  function handleBackToList() {
    setSelectedEvaluation(null);
  }

  if (selectedEvaluation) {
    const { formData } = selectedEvaluation;
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
                  <p className="text-sm font-medium text-gray-700">Qual é sua profissão e que atividades realiza diariamente no trabalho?</p>
                  <p className="text-sm mt-1">{formData.profissao}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Pratica alguma atividade física ou esporte regularmente? Qual frequência e intensidade?</p>
                  <p className="text-sm mt-1">{formData.atividadeFisica}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Possui algum hobby ou atividade de lazer que realiza habitualmente?</p>
                  <p className="text-sm mt-1">{formData.hobby}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-lg border-b pb-2">Queixa Principal</h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Qual é o principal motivo que o(a) traz à fisioterapia?</p>
                  <p className="text-sm mt-1">{formData.queixaPrincipal}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Há quanto tempo apresenta esse problema?</p>
                  <p className="text-sm mt-1">{formData.tempoProblema}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Como e quando começou esse problema? Foi gradual ou repentino?</p>
                  <p className="text-sm mt-1">{formData.inicioProblema}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Já realizou tratamento para esse problema anteriormente? Qual foi o resultado?</p>
                  <p className="text-sm mt-1">{formData.tratamentoAnterior}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-lg border-b pb-2">Caracterização da Dor</h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Se sente dor, poderia descrevê-la? (tipo: queimação, pontada, pressão, formigamento)</p>
                  <p className="text-sm mt-1">{formData.descricaoDor}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Em uma escala de 0 a 10, sendo 0 ausência de dor e 10 a pior dor imaginável, como classificaria sua dor?</p>
                  <p className="text-sm mt-1">{formData.escalaDor}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">A dor irradia para algum local? Para onde?</p>
                  <p className="text-sm mt-1">{formData.irradiacaoDor}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">O que piora sua dor ou desconforto? (movimentos, posturas, horários do dia)</p>
                  <p className="text-sm mt-1">{formData.pioraDor}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">O que alivia sua dor ou desconforto?</p>
                  <p className="text-sm mt-1">{formData.alivioDor}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">A dor interfere no seu sono ou nas atividades diárias? De que forma?</p>
                  <p className="text-sm mt-1">{formData.interferenciaDor}</p>
                </div>
              </div>
            </div>

            {/* Continuar com os demais campos de forma similar... */}
            <div className="space-y-4">
              <h4 className="font-medium text-lg border-b pb-2">Histórico Médico</h4>
              {/* ... campos de histórico médico ... */}
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-lg border-b pb-2">Histórico Familiar</h4>
              {/* ... campos de histórico familiar ... */}
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-lg border-b pb-2">Atividades Extras</h4>
              {/* ... campos de atividades extras ... */}
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-lg border-b pb-2">Hábitos e Estilo de Vida</h4>
              {/* ... campos de hábitos ... */}
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-lg border-b pb-2">Avaliação Funcional</h4>
              {/* ... campos de avaliação funcional ... */}
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-lg border-b pb-2">Informações Adicionais</h4>
              {/* ... campos de informações adicionais ... */}
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
                  name="atividadeFisica"
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
                  name="queixaPrincipal"
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
                  name="tempoProblema"
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
                  name="inicioProblema"
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
                  name="tratamentoAnterior"
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
                {/* Adicione campos similares para cada item de Caracterização da Dor */}
                <FormField
                  control={form.control}
                  name="descricaoDor"
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
                {/* Adicione os outros campos para Caracterização da Dor */}
              </div>
            </Card>

            {/* Adicione seções adicionais para cada grupo de perguntas */}
            {/* ... */}

            <div className="flex justify-end">
              <Button type="submit">Gerar Ficha de Pré-avaliação</Button>
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
                      {new Date(evaluation.createdAt).toLocaleDateString('pt-BR')}
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
