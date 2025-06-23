
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { usePlanExercises } from "@/hooks/usePlanExercises";
import { useExercises } from "@/hooks/useExercises";
import { ExerciseSelector } from "./ExerciseSelector";
import { ExerciseForm } from "../exercises/ExerciseForm";
import { Plus, AlertCircle, Dumbbell } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Exercise {
  id: string;
  name: string;
  description?: string;
  instructions?: string;
  category?: string;
  difficulty_level?: number;
  duration_minutes?: number;
}

interface AddExercisesToPlanDialogProps {
  plan: any;
  exercises: Exercise[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddExercisesToPlanDialog({
  plan,
  exercises,
  open,
  onOpenChange,
}: AddExercisesToPlanDialogProps) {
  const [selectedExerciseId, setSelectedExerciseId] = useState("");
  const [dayNumber, setDayNumber] = useState("1");
  const [sets, setSets] = useState("3");
  const [repetitions, setRepetitions] = useState("10");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCreateExercise, setShowCreateExercise] = useState(false);

  const { addPlanExercise } = usePlanExercises(plan?.id);
  const { addExercise } = useExercises();

  const selectedExercise = exercises.find(ex => ex.id === selectedExerciseId);

  // Validações
  const errors = {
    exercise: !selectedExerciseId ? "Selecione um exercício" : "",
    dayNumber: !dayNumber || parseInt(dayNumber) < 1 ? "Dia deve ser maior que 0" : "",
    sets: !sets || parseInt(sets) < 1 ? "Séries deve ser maior que 0" : "",
  };

  const hasErrors = Object.values(errors).some(error => error !== "");

  const handleCreateExercise = async (exerciseData: any) => {
    const formattedData = {
      name: exerciseData.name,
      description: exerciseData.description,
      instructions: exerciseData.description,
      category: null,
      difficulty_level: exerciseData.difficulty === "iniciante" ? 1 : 
                       exerciseData.difficulty === "intermediário" ? 3 : 5,
      duration_minutes: null,
      equipment_needed: exerciseData.targetArea ? [exerciseData.targetArea] : [],
      image_url: exerciseData.thumbnailUrl || null,
      video_url: exerciseData.videoUrl || null,
      is_active: true,
    };

    const result = await addExercise(formattedData);
    
    if (result.success) {
      setShowCreateExercise(false);
      setSelectedExerciseId(result.data.id);
      toast.success("Exercício criado com sucesso!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (hasErrors) {
      toast.error("Corrija os campos obrigatórios antes de continuar");
      return;
    }

    setIsSubmitting(true);

    const exerciseData = {
      treatment_plan_id: plan.id,
      exercise_id: selectedExerciseId,
      day_number: parseInt(dayNumber),
      sets: parseInt(sets),
      repetitions: repetitions ? parseInt(repetitions) : undefined,
      duration_minutes: durationMinutes ? parseInt(durationMinutes) : selectedExercise?.duration_minutes,
      notes: notes || undefined,
      is_completed: false,
    };

    const result = await addPlanExercise(exerciseData);
    
    if (result.success) {
      toast.success("Exercício adicionado à trilha com sucesso!");
      onOpenChange(false);
      resetForm();
    }

    setIsSubmitting(false);
  };

  const resetForm = () => {
    setSelectedExerciseId("");
    setDayNumber("1");
    setSets("3");
    setRepetitions("10");
    setDurationMinutes("");
    setNotes("");
    setShowCreateExercise(false);
  };

  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      resetForm();
    }
    onOpenChange(isOpen);
  };

  if (showCreateExercise) {
    return (
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5" />
              Criar Novo Exercício
            </DialogTitle>
            <DialogDescription>
              Crie um novo exercício para adicionar à trilha "{plan?.name}"
            </DialogDescription>
          </DialogHeader>

          <ExerciseForm
            onSave={handleCreateExercise}
          />

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowCreateExercise(false)}
            >
              Voltar para Seleção
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Adicionar Exercício à Trilha
          </DialogTitle>
          <DialogDescription>
            Adicione exercícios à trilha "{plan?.name}"
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seletor de Exercícios com botão para criar */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-base font-medium">Exercícios</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowCreateExercise(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Criar Exercício
              </Button>
            </div>
            
            {exercises.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Dumbbell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-center mb-2">Nenhum exercício disponível</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Crie seu primeiro exercício para começar a montar trilhas de tratamento
                  </p>
                  <Button
                    type="button"
                    onClick={() => setShowCreateExercise(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Criar Primeiro Exercício
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <ExerciseSelector
                exercises={exercises}
                selectedExerciseId={selectedExerciseId}
                onExerciseSelect={setSelectedExerciseId}
              />
            )}
            
            {errors.exercise && (
              <Alert className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.exercise}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Configurações do Exercício */}
          {exercises.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configurações do Exercício</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dayNumber">Dia da Trilha *</Label>
                    <Input
                      id="dayNumber"
                      type="number"
                      min="1"
                      value={dayNumber}
                      onChange={(e) => setDayNumber(e.target.value)}
                      className={errors.dayNumber ? "border-red-500" : ""}
                    />
                    {errors.dayNumber && (
                      <p className="text-sm text-red-500 mt-1">{errors.dayNumber}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="sets">Séries *</Label>
                    <Input
                      id="sets"
                      type="number"
                      min="1"
                      value={sets}
                      onChange={(e) => setSets(e.target.value)}
                      className={errors.sets ? "border-red-500" : ""}
                    />
                    {errors.sets && (
                      <p className="text-sm text-red-500 mt-1">{errors.sets}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="repetitions">Repetições</Label>
                    <Input
                      id="repetitions"
                      type="number"
                      min="1"
                      value={repetitions}
                      onChange={(e) => setRepetitions(e.target.value)}
                      placeholder="Ex: 10, 15"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Deixe vazio se não aplicável
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="duration">Duração (minutos)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(e.target.value)}
                      placeholder={selectedExercise?.duration_minutes ? `Padrão: ${selectedExercise.duration_minutes}min` : "Ex: 5, 10"}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedExercise?.duration_minutes 
                        ? `Exercício tem duração padrão de ${selectedExercise.duration_minutes}min`
                        : "Deixe vazio se não aplicável"
                      }
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Instruções específicas, modificações, etc."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            {exercises.length > 0 && (
              <Button 
                type="submit" 
                disabled={hasErrors || isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? "Adicionando..." : "Adicionar Exercício"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
