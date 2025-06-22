
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
import { ExerciseSelector } from "./ExerciseSelector";
import { Plus, AlertCircle } from "lucide-react";
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

  const { addPlanExercise } = usePlanExercises(plan?.id);

  const selectedExercise = exercises.find(ex => ex.id === selectedExerciseId);

  // Validações
  const errors = {
    exercise: !selectedExerciseId ? "Selecione um exercício" : "",
    dayNumber: !dayNumber || parseInt(dayNumber) < 1 ? "Dia deve ser maior que 0" : "",
    sets: !sets || parseInt(sets) < 1 ? "Séries deve ser maior que 0" : "",
  };

  const hasErrors = Object.values(errors).some(error => error !== "");

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
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          {/* Seletor de Exercícios */}
          <div>
            <ExerciseSelector
              exercises={exercises}
              selectedExerciseId={selectedExerciseId}
              onExerciseSelect={setSelectedExerciseId}
            />
            {errors.exercise && (
              <Alert className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.exercise}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Configurações do Exercício */}
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

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={hasErrors || isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? "Adicionando..." : "Adicionar Exercício"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
