
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { PreEvaluationFormTabs } from "./PreEvaluationFormTabs";
import { preEvaluationFormSchema, PreEvaluationFormValues } from "./types";
import { PreEvaluation } from "@/hooks/usePatientPreEvaluations";

interface PreEvaluationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
  editingEvaluation: PreEvaluation | null;
  onSubmit: (values: PreEvaluationFormValues) => void;
}

export function PreEvaluationFormDialog({
  open,
  onOpenChange,
  patientId,
  editingEvaluation,
  onSubmit,
}: PreEvaluationFormDialogProps) {
  const form = useForm<PreEvaluationFormValues>({
    resolver: zodResolver(preEvaluationFormSchema),
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

  React.useEffect(() => {
    if (editingEvaluation) {
      form.reset({
        profissao: editingEvaluation.profissao,
        atividade_fisica: editingEvaluation.atividade_fisica,
        hobby: editingEvaluation.hobby,
        queixa_principal: editingEvaluation.queixa_principal,
        tempo_problema: editingEvaluation.tempo_problema,
        inicio_problema: editingEvaluation.inicio_problema,
        tratamento_anterior: editingEvaluation.tratamento_anterior,
        descricao_dor: editingEvaluation.descricao_dor,
        escala_dor: editingEvaluation.escala_dor,
        irradiacao_dor: editingEvaluation.irradiacao_dor,
        piora_dor: editingEvaluation.piora_dor,
        alivio_dor: editingEvaluation.alivio_dor,
        interferencia_dor: editingEvaluation.interferencia_dor,
        diagnostico_medico: editingEvaluation.diagnostico_medico,
        exames_recentes: editingEvaluation.exames_recentes,
        condicoes_saude: editingEvaluation.condicoes_saude,
        cirurgias: editingEvaluation.cirurgias,
        medicamentos: editingEvaluation.medicamentos || "",
        alergias: editingEvaluation.alergias || "",
        doencas_familiares: editingEvaluation.doencas_familiares,
        condicoes_similares: editingEvaluation.condicoes_similares,
        alimentacao: editingEvaluation.alimentacao,
        padrao_sono: editingEvaluation.padrao_sono,
        alcool: editingEvaluation.alcool,
        fumante: editingEvaluation.fumante,
        ingestao_agua: editingEvaluation.ingestao_agua,
        tempo_sentado: editingEvaluation.tempo_sentado,
        nivel_estresse: editingEvaluation.nivel_estresse || "",
        questoes_emocionais: editingEvaluation.questoes_emocionais || "",
        impacto_qualidade_vida: editingEvaluation.impacto_qualidade_vida || "",
        expectativas_tratamento: editingEvaluation.expectativas_tratamento || "",
        exercicios_casa: editingEvaluation.exercicios_casa,
        restricoes: editingEvaluation.restricoes || "",
        dificuldade_dia: editingEvaluation.dificuldade_dia,
        dispositivo_auxilio: editingEvaluation.dispositivo_auxilio,
        dificuldade_equilibrio: editingEvaluation.dificuldade_equilibrio,
        limitacao_movimento: editingEvaluation.limitacao_movimento,
        info_adicional: editingEvaluation.info_adicional || "",
        duvidas_fisioterapia: editingEvaluation.duvidas_fisioterapia || "",
      });
    } else {
      form.reset();
    }
  }, [editingEvaluation, form]);

  function handleSubmit(values: PreEvaluationFormValues) {
    onSubmit(values);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <PreEvaluationFormTabs form={form} />
            
            <DialogFooter>
              <Button type="submit">
                {editingEvaluation ? "Atualizar Pré-avaliação" : "Salvar Pré-avaliação"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
