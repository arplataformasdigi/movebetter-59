
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
import { EvolutionFormDialog } from "./evolution/EvolutionFormDialog";
import { EvolutionCard } from "./evolution/EvolutionCard";

interface PatientEvolutionProps {
  patientId: string;
}

export function PatientEvolution({ patentId }: PatientEvolutionProps) {
  const [open, setOpen] = useState(false);
  const [editingEvolution, setEditingEvolution] = useState(null);
  const { getActiveRecord } = usePatientMedicalRecords(patientId);
  const { 
    evolutions, 
    isLoading, 
    addEvolution, 
    updateEvolution, 
    closeEvolution 
  } = usePatientEvolutionsRealtime(patientId);

  const activeRecord = getActiveRecord();

  const handleSubmit = async (values: any) => {
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

      <EvolutionFormDialog
        open={open}
        onOpenChange={handleOpenChange}
        patientId={patientId}
        editingEvolution={editingEvolution}
        onSubmit={handleSubmit}
      />

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
            <EvolutionCard
              key={evolution.id}
              evolution={evolution}
              onEdit={handleEditEvolution}
              onClose={handleCloseEvolution}
            />
          ))}
        </div>
      )}
    </div>
  );
}
