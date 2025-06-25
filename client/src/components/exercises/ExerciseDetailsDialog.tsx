
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock } from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  completed: boolean;
  duration: string;
  sets: number;
  reps: number;
  description?: string;
  instructions?: string;
}

interface ExerciseDetailsDialogProps {
  exercise: Exercise | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMarkCompleted: (exerciseId: string) => void;
}

export function ExerciseDetailsDialog({ 
  exercise, 
  open, 
  onOpenChange, 
  onMarkCompleted 
}: ExerciseDetailsDialogProps) {
  if (!exercise) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {exercise.completed ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <Clock className="h-5 w-5 text-amber-500" />
            )}
            {exercise.name}
          </DialogTitle>
          <DialogDescription>
            Detalhes do exercício e instruções de execução
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Badge variant={exercise.completed ? "default" : "outline"}>
              {exercise.completed ? "Concluído" : "Pendente"}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Duração</h4>
              <p className="font-medium">{exercise.duration}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Séries</h4>
              <p className="font-medium">{exercise.sets} séries</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Repetições</h4>
            <p className="font-medium">{exercise.reps} repetições por série</p>
          </div>

          {exercise.description && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Descrição</h4>
              <p className="text-sm">{exercise.description}</p>
            </div>
          )}

          {exercise.instructions && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Instruções</h4>
              <p className="text-sm">{exercise.instructions}</p>
            </div>
          )}

          {!exercise.completed && (
            <div className="pt-4 border-t">
              <Button 
                onClick={() => onMarkCompleted(exercise.id)}
                className="w-full"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Marcar como Concluído
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
