
import React, { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { PlanExercise } from "@/hooks/usePlanExercises";
import { Edit, Dumbbell } from "lucide-react";

interface EditPlanExerciseDialogProps {
  planExercise: PlanExercise | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (exerciseId: string, updates: Partial<PlanExercise>) => Promise<{ success: boolean }>;
}

export function EditPlanExerciseDialog({
  planExercise,
  open,
  onOpenChange,
  onUpdate,
}: EditPlanExerciseDialogProps) {
  const [dayNumber, setDayNumber] = useState("");
  const [sets, setSets] = useState("");
  const [repetitions, setRepetitions] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (planExercise) {
      setDayNumber(planExercise.day_number.toString());
      setSets(planExercise.sets?.toString() || "");
      setRepetitions(planExercise.repetitions?.toString() || "");
      setDurationMinutes(planExercise.duration_minutes?.toString() || "");
      setNotes(planExercise.notes || "");
    }
  }, [planExercise]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!planExercise) return;

    setIsSubmitting(true);

    const updates = {
      day_number: parseInt(dayNumber),
      sets: sets ? parseInt(sets) : undefined,
      repetitions: repetitions ? parseInt(repetitions) : undefined,
      duration_minutes: durationMinutes ? parseInt(durationMinutes) : undefined,
      notes: notes || undefined,
    };

    const result = await onUpdate(planExercise.id, updates);
    
    if (result.success) {
      onOpenChange(false);
    }

    setIsSubmitting(false);
  };

  if (!planExercise) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Editar Exercício
          </DialogTitle>
          <DialogDescription>
            Edite as configurações do exercício na trilha
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Dumbbell className="h-4 w-4" />
            <span className="font-medium">{planExercise.exercises?.name}</span>
            <Badge variant={planExercise.is_completed ? "default" : "secondary"}>
              {planExercise.is_completed ? "Concluído" : "Pendente"}
            </Badge>
          </div>
          {planExercise.exercises?.description && (
            <p className="text-sm text-muted-foreground">
              {planExercise.exercises.description}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="sets">Séries</Label>
              <Input
                id="sets"
                type="number"
                min="1"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
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
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
