
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, User, Activity, Target } from "lucide-react";
import { TreatmentPlan } from "@/hooks/useTreatmentPlans";
import { usePlanExercises } from "@/hooks/usePlanExercises";

interface ViewTreatmentPlanDialogProps {
  plan: TreatmentPlan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewTreatmentPlanDialog({ plan, open, onOpenChange }: ViewTreatmentPlanDialogProps) {
  const { planExercises, isLoading } = usePlanExercises(plan?.id);

  if (!plan) return null;

  const groupedExercises = planExercises.reduce((acc, exercise) => {
    if (!acc[exercise.day_number]) {
      acc[exercise.day_number] = [];
    }
    acc[exercise.day_number].push(exercise);
    return acc;
  }, {} as Record<number, typeof planExercises>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[600px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {plan.name}
          </DialogTitle>
          <DialogDescription>{plan.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Paciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{plan.patients?.name || 'Não informado'}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Período
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {plan.start_date ? new Date(plan.start_date).toLocaleDateString('pt-BR') : 'Não informado'} - {' '}
                  {plan.end_date ? new Date(plan.end_date).toLocaleDateString('pt-BR') : 'Em andamento'}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Progresso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${plan.progress_percentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{plan.progress_percentage}%</span>
              </div>
              <Badge className={plan.is_active ? "bg-green-100 text-green-800 mt-2" : "bg-red-100 text-red-800 mt-2"}>
                {plan.is_active ? "Ativo" : "Inativo"}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exercícios por Dia</CardTitle>
              <CardDescription>
                {isLoading ? 'Carregando exercícios...' : `${planExercises.length} exercícios encontrados`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4 text-gray-500">Carregando exercícios...</div>
              ) : Object.keys(groupedExercises).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(groupedExercises).map(([day, exercises]) => (
                    <div key={day} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-3">Dia {day}</h4>
                      <div className="space-y-2">
                        {exercises.map((exercise) => (
                          <div key={exercise.id} className="bg-gray-50 p-3 rounded">
                            <h5 className="font-medium">{exercise.exercises?.name}</h5>
                            {exercise.exercises?.description && (
                              <p className="text-sm text-gray-600 mt-1">{exercise.exercises.description}</p>
                            )}
                            <div className="flex gap-4 mt-2 text-sm text-gray-500">
                              {exercise.repetitions && <span>Repetições: {exercise.repetitions}</span>}
                              {exercise.sets && <span>Séries: {exercise.sets}</span>}
                              {exercise.duration_minutes && <span>Duração: {exercise.duration_minutes} min</span>}
                            </div>
                            {exercise.notes && (
                              <p className="text-sm text-gray-600 mt-2"><strong>Notas:</strong> {exercise.notes}</p>
                            )}
                            <Badge className={exercise.is_completed ? "bg-green-100 text-green-800 mt-2" : "bg-yellow-100 text-yellow-800 mt-2"}>
                              {exercise.is_completed ? "Concluído" : "Pendente"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Nenhum exercício cadastrado para este plano
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
