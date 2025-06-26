
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, X, Activity } from "lucide-react";

interface Evolution {
  id: string;
  patient_id: string;
  medical_record_id: string;
  queixas_relatos: string;
  conduta_atendimento: string;
  observacoes?: string;
  progress_score: number;
  previous_score?: number;
  is_active?: boolean;
  created_at: string;
  updated_at?: string;
}

interface PatientEvolutionsListProps {
  evolutions: Evolution[];
  onEditEvolution?: (evolution: Evolution) => void;
  onCloseEvolution?: (evolutionId: string) => void;
  isLoading?: boolean;
  refetchEvolutions?: () => void;
}

export function PatientEvolutionsList({
  evolutions,
  onEditEvolution,
  onCloseEvolution,
  isLoading = false,
  refetchEvolutions,
}: PatientEvolutionsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (evolutions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <Activity className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhuma evolução encontrada</h3>
          <p className="text-sm">As evoluções do paciente aparecerão aqui.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {evolutions.map((evolution) => (
        <Card key={evolution.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Evolução - {new Date(evolution.created_at).toLocaleDateString('pt-BR')}
              </CardTitle>
              <div className="flex gap-2">
                {onEditEvolution && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEditEvolution(evolution)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                )}
                {onCloseEvolution && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onCloseEvolution(evolution.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                Progresso: {evolution.progress_score}/10
              </Badge>
              {evolution.previous_score && (
                <Badge variant="secondary">
                  Anterior: {evolution.previous_score}/10
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <strong>Queixas e Relatos:</strong>
                <p className="text-sm text-muted-foreground mt-1">
                  {evolution.queixas_relatos}
                </p>
              </div>
              <div>
                <strong>Conduta do Atendimento:</strong>
                <p className="text-sm text-muted-foreground mt-1">
                  {evolution.conduta_atendimento}
                </p>
              </div>
              {evolution.observacoes && (
                <div>
                  <strong>Observações:</strong>
                  <p className="text-sm text-muted-foreground mt-1">
                    {evolution.observacoes}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
