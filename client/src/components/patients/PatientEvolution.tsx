
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Activity, Edit, X } from "lucide-react";
import { usePatientMedicalRecords } from "@/hooks/usePatientMedicalRecords";
import { usePatientEvolutionsRealtime } from "@/hooks/usePatientEvolutionsRealtime";

interface PatientEvolutionProps {
  patientId: string;
}

interface EvolutionFormData {
  queixas_relatos: string;
  conduta_atendimento: string;
  observacoes: string;
  progress_score: number;
  is_active: boolean;
}

export function PatientEvolution({ patientId }: PatientEvolutionProps) {
  const [open, setOpen] = useState(false);
  const [editingEvolution, setEditingEvolution] = useState<any>(null);
  const { getActiveRecord } = usePatientMedicalRecords(patientId);
  const { 
    evolutions, 
    isLoading, 
    addEvolution, 
    updateEvolution, 
    closeEvolution 
  } = usePatientEvolutionsRealtime(patientId);

  const activeRecord = getActiveRecord();

  const handleSubmit = async (values: EvolutionFormData) => {
    if (!activeRecord) {
      console.error('No active medical record found');
      return;
    }

    const evolutionData = {
      ...values,
      patient_id: patientId,
      medical_record_id: activeRecord.id,
    };

    try {
      let result;
      if (editingEvolution) {
        result = await updateEvolution(editingEvolution.id, evolutionData);
        setEditingEvolution(null);
      } else {
        result = await addEvolution(evolutionData);
      }
      
      if (result.success) {
        setOpen(false);
      }
    } catch (error) {
      console.error('Error submitting evolution:', error);
    }
  };

  const handleEditEvolution = (evolution: any) => {
    setEditingEvolution(evolution);
    setOpen(true);
  };

  const handleCloseEvolution = async (evolutionId: string) => {
    await closeEvolution(evolutionId);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setEditingEvolution(null);
    }
  };

  if (isLoading) {
    return <div>Carregando evoluções...</div>;
  }

  if (!activeRecord) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <Activity className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhum prontuário ativo</h3>
          <p className="text-sm">É necessário ter um prontuário ativo para criar evoluções.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Evolução do Paciente</h3>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Evolução
        </Button>
      </div>

      {/* Simple form dialog for now - will create proper components later if needed */}
      {open && (
        <Card>
          <CardHeader>
            <CardTitle>{editingEvolution ? 'Editar Evolução' : 'Nova Evolução'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const values: EvolutionFormData = {
                queixas_relatos: formData.get('queixas_relatos') as string,
                conduta_atendimento: formData.get('conduta_atendimento') as string,
                observacoes: formData.get('observacoes') as string,
                progress_score: parseInt(formData.get('progress_score') as string) || 5,
                is_active: true
              };
              handleSubmit(values);
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Queixas e Relatos</label>
                <textarea 
                  name="queixas_relatos"
                  defaultValue={editingEvolution?.queixas_relatos || ''}
                  className="w-full p-2 border rounded-md" 
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Conduta do Atendimento</label>
                <textarea 
                  name="conduta_atendimento"
                  defaultValue={editingEvolution?.conduta_atendimento || ''}
                  className="w-full p-2 border rounded-md" 
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Observações</label>
                <textarea 
                  name="observacoes"
                  defaultValue={editingEvolution?.observacoes || ''}
                  className="w-full p-2 border rounded-md" 
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Pontuação de Progresso (1-10)</label>
                <input 
                  type="number" 
                  name="progress_score"
                  defaultValue={editingEvolution?.progress_score || 5}
                  min="1" 
                  max="10" 
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  {editingEvolution ? 'Atualizar' : 'Salvar'}
                </Button>
                <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {evolutions.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <Activity className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma evolução encontrada</h3>
            <p className="text-sm">Clique em "Nova Evolução" para começar.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {evolutions.map((evolution) => (
            <Card key={evolution.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    Evolução - {new Date(evolution.created_at).toLocaleDateString('pt-BR')}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditEvolution(evolution)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCloseEvolution(evolution.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Progresso: {evolution.progress_score}/10
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <strong>Queixas:</strong> {evolution.queixas_relatos}
                  </div>
                  <div>
                    <strong>Conduta:</strong> {evolution.conduta_atendimento}
                  </div>
                  {evolution.observacoes && (
                    <div>
                      <strong>Observações:</strong> {evolution.observacoes}
                    </div>
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
