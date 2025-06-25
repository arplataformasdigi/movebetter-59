
import React from "react";
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
import { ClipboardList, Edit, Trash2, Download } from "lucide-react";
import { PreEvaluation } from "@/hooks/usePatientPreEvaluations";

interface PreEvaluationCardProps {
  evaluation: PreEvaluation;
  onEdit: (evaluation: PreEvaluation) => void;
  onDelete: (evaluationId: string) => void;
  onDownloadPDF: (evaluation: PreEvaluation) => void;
}

export function PreEvaluationCard({
  evaluation,
  onEdit,
  onDelete,
  onDownloadPDF,
}: PreEvaluationCardProps) {
  return (
    <Card>
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
              onClick={() => onDownloadPDF(evaluation)}
              className="h-8 w-8 p-0"
              title="Download PDF"
            >
              <Download className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(evaluation)}
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
                    onClick={() => onDelete(evaluation.id)}
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
  );
}
