
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
    
    setOpen(false);
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
        <PreEvaluationFormDialog
          open={open}
          onOpenChange={handleOpenChange}
          patientId={patientId}
          editingEvaluation={editingEvaluation}
          onSubmit={handleSubmit}
        />
        <DialogTrigger asChild>
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Pré-avaliação
          </Button>
        </DialogTrigger>
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
