import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Calendar, User, TrendingUp, Eye } from "lucide-react";
import { usePatientEvolutionsRealtime } from "@/hooks/usePatientEvolutionsRealtime";
import { EvolutionForm } from "./EvolutionForm";
import { EditEvolutionDialog } from "./EditEvolutionDialog";
import { formatDateToBrazilian } from "@/utils/dateUtils";

interface PatientEvolutionsListProps {
  patientId: string;
  patientStatus: string;
}

export function PatientEvolutionsList({ patientId, patientStatus }: PatientEvolutionsListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedEvolution, setSelectedEvolution] = useState<any>(null);
  
  const { evolutions, isLoading, refetchEvolutions } = usePatientEvolutionsRealtime(patientId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div>Carregando evoluções...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Evoluções do Paciente</h3>
          <p className="text-sm text-muted-foreground">
            {evolutions.length} evolução(ões) encontrada(s)
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {patientStatus === 'active' && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Evolução
            </Button>
          )}
          {patientStatus !== 'active' && (
            <p className="text-sm text-muted-foreground">
              Paciente com alta - evoluções apenas para visualização
            </p>
          )}
        </div>
      </div>

      {evolutions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-center mb-2">
              Nenhuma evolução encontrada
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              As evoluções do paciente aparecerão aqui
            </p>
            {patientStatus === 'active' && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Criar primeira evolução
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {evolutions.map((evolution) => (
            <Card key={evolution.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-base">
                      Evolução - {formatDateToBrazilian(evolution.created_at)}
                    </CardTitle>
                    <CardDescription className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDateToBrazilian(evolution.created_at)}
                      </span>
                      <span className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Progresso: {evolution.progress_score}/100
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      Score: {evolution.progress_score}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">
                      Queixas e Relatos
                    </h4>
                    <p className="text-sm">{evolution.queixas_relatos}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">
                      Conduta do Atendimento
                    </h4>
                    <p className="text-sm">{evolution.conduta_atendimento}</p>
                  </div>
                  
                  {evolution.observacoes && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">
                        Observações
                      </h4>
                      <p className="text-sm">{evolution.observacoes}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-end pt-2">
                    {patientStatus === 'active' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedEvolution(evolution)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedEvolution(evolution)}
                        disabled
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Visualizar
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <EvolutionForm
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        patientId={patientId}
        onEvolutionAdded={refetchEvolutions}
        patientStatus={patientStatus}
      />

      {selectedEvolution && (
        <EditEvolutionDialog
          evolution={selectedEvolution}
          open={!!selectedEvolution}
          onOpenChange={(open) => !open && setSelectedEvolution(null)}
          onEvolutionUpdated={refetchEvolutions}
          patientStatus={patientStatus}
        />
      )}
    </div>
  );
}