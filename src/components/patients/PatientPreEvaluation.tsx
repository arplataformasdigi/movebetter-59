
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ClipboardList, Plus } from "lucide-react";
import { usePatientPreEvaluations, PreEvaluation } from "@/hooks/usePatientPreEvaluations";
import { PreEvaluationFormDialog } from "./pre-evaluation/PreEvaluationFormDialog";
import { PreEvaluationCard } from "./pre-evaluation/PreEvaluationCard";
import { generatePreEvaluationPDF } from "./pre-evaluation/PDFGenerator";
import { PreEvaluationFormValues } from "./pre-evaluation/types";

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

  function handleSubmit(values: PreEvaluationFormValues) {
    try {
      // Ensure all fields are properly typed for the database
      const evaluationData: Omit<PreEvaluation, 'id' | 'created_at' | 'updated_at'> = {
        patient_id: patientId,
        profissao: values.profissao || "",
        atividade_fisica: values.atividade_fisica || "",
        hobby: values.hobby || "",
        queixa_principal: values.queixa_principal || "",
        tempo_problema: values.tempo_problema || "",
        inicio_problema: values.inicio_problema || "",
        tratamento_anterior: values.tratamento_anterior || "",
        descricao_dor: values.descricao_dor || "",
        escala_dor: values.escala_dor || "",
        irradiacao_dor: values.irradiacao_dor || "",
        piora_dor: values.piora_dor || "",
        alivio_dor: values.alivio_dor || "",
        interferencia_dor: values.interferencia_dor || "",
        diagnostico_medico: values.diagnostico_medico || "",
        exames_recentes: values.exames_recentes || "",
        condicoes_saude: values.condicoes_saude || "",
        cirurgias: values.cirurgias || "",
        medicamentos: values.medicamentos || "",
        alergias: values.alergias || "",
        doencas_familiares: values.doencas_familiares || "",
        condicoes_similares: values.condicoes_similares || "",
        alimentacao: values.alimentacao || "",
        padrao_sono: values.padrao_sono || "",
        alcool: values.alcool || "",
        fumante: values.fumante || "",
        ingestao_agua: values.ingestao_agua || "",
        tempo_sentado: values.tempo_sentado || "",
        nivel_estresse: values.nivel_estresse || "",
        questoes_emocionais: values.questoes_emocionais || "",
        impacto_qualidade_vida: values.impacto_qualidade_vida || "",
        expectativas_tratamento: values.expectativas_tratamento || "",
        exercicios_casa: values.exercicios_casa || "",
        restricoes: values.restricoes || "",
        dificuldade_dia: values.dificuldade_dia || "",
        dispositivo_auxilio: values.dispositivo_auxilio || "",
        dificuldade_equilibrio: values.dificuldade_equilibrio || "",
        limitacao_movimento: values.limitacao_movimento || "",
        info_adicional: values.info_adicional || "",
        duvidas_fisioterapia: values.duvidas_fisioterapia || "",
      };

      if (editingEvaluation) {
        updatePreEvaluation(editingEvaluation.id, evaluationData);
        setEditingEvaluation(null);
      } else {
        addPreEvaluation(evaluationData);
      }
      
      setOpen(false);
    } catch (error) {
      console.error('Error submitting pre-evaluation:', error);
    }
  }

  const handleEditEvaluation = (evaluation: PreEvaluation) => {
    setEditingEvaluation(evaluation);
    setOpen(true);
  };

  const handleDeleteEvaluation = (evaluationId: string) => {
    deletePreEvaluation(evaluationId);
  };

  const handleDownloadPDF = (evaluation: PreEvaluation) => {
    generatePreEvaluationPDF(evaluation, patientName);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setEditingEvaluation(null);
    }
  };

  if (isLoading) {
    return <div>Carregando pré-avaliações...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Pré-avaliação do Paciente</h3>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Pré-avaliação
        </Button>
      </div>

      <PreEvaluationFormDialog
        open={open}
        onOpenChange={handleOpenChange}
        patientId={patientId}
        editingEvaluation={editingEvaluation}
        onSubmit={handleSubmit}
      />

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
            <PreEvaluationCard
              key={evaluation.id}
              evaluation={evaluation}
              onEdit={handleEditEvaluation}
              onDelete={handleDeleteEvaluation}
              onDownloadPDF={handleDownloadPDF}
            />
          ))}
        </div>
      )}
    </div>
  );
}
