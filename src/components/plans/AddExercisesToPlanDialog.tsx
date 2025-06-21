
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { usePlanExercises } from "@/hooks/usePlanExercises";
import { Dumbbell, Clock, Hash, FileText } from "lucide-react";

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

  const { addPlanExercise } = usePlanExercises(plan?.id);

  const selectedExercise = exercises.find(ex => ex.id === selectedExerciseId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedExerciseId || !plan) {
      toast.error("Selecione um exercício");
      return;
    }

    const exerciseData = {
      treatment_plan_id: plan.id,
      exercise_id: selectedExerciseId,
      day_number: parseInt(dayNumber),
      sets: parseInt(sets),
      repetitions: repetitions ? parseInt(repetitions) : undefined,
      duration_minutes: durationMinutes ? parseInt(durationMinutes) : undefined,
      notes: notes || undefined,
      is_completed: false,
    };

    const result = await addPlanExercise(exerciseData);
    
    if (result.success) {
      toast.success("Exercício adicionado à trilha com sucesso!");
      onOpenChange(false);
      resetForm();
    }
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
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Exercício à Trilha</DialogTitle>
          <DialogDescription>
            Adicione exercícios à trilha "{plan?.name}"
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="exercise">Exercício *</Label>
              <Select value={selectedExerciseId} onValueChange={setSelectedExerciseId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um exercício" />
                </SelectTrigger>
                <SelectContent>
                  {exercises.map((exercise) => (
                    <SelectItem key={exercise.id} value={exercise.id}>
                      <div className="flex items-center gap-2">
                        <Dumbbell className="h-4 w-4" />
                        <span>{exercise.name}</span>
                        {exercise.category && (
                          <Badge variant="outline" className="ml-2">
                            {exercise.category}
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedExercise && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Dumbbell className="h-4 w-4" />
                    {selectedExercise.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {selectedExercise.description && (
                    <CardDescription>{selectedExercise.description}</CardDescription>
                  )}
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    {selectedExercise.category && (
                      <span className="flex items-center gap-1">
                        <Badge variant="outline">{selectedExercise.category}</Badge>
                      </span>
                    )}
                    {selectedExercise.difficulty_level && (
                      <span>Nível: {selectedExercise.difficulty_level}/5</span>
                    )}
                    {selectedExercise.duration_minutes && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {selectedExercise.duration_minutes} min
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dayNumber">Dia da Trilha *</Label>
                <Input
                  id="dayNumber"
                  type="number"
                  min="1"
                  value={dayNumber}
                  onChange={(e) => setDayNumber(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="sets">Séries *</Label>
                <Input
                  id="sets"
                  type="number"
                  min="1"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  required
                />
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
              </div>
              <div>
                <Label htmlFor="duration">Duração (minutos)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  placeholder="Ex: 5, 10"
                />
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
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Adicionar Exercício
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
