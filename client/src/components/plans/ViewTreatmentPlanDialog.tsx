
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Clock, Play, Calendar, User, Activity } from "lucide-react";
import { toast } from "sonner";

interface Exercise {
  id: string;
  name: string;
  description?: string;
  instructions?: string;
  difficulty_level?: number;
  duration_minutes?: number;
  equipment_needed?: string[];
  image_url?: string;
  video_url?: string;
  is_active?: boolean;
  created_at?: string;
}

interface PlanExercise {
  id: string;
  day_number: number;
  sets?: number;
  repetitions?: number;
  duration_minutes?: number;
  notes?: string;
  is_completed?: boolean;
  completed_at?: string;
  exercise_id?: string;
  treatment_plan_id?: string;
  created_at?: string;
  exercises?: Exercise;
}

interface TreatmentPlan {
  id: string;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
  progress_percentage?: number;
  patient_id?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  exercises?: PlanExercise[];
}

interface ViewTreatmentPlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string | null;
}

export function ViewTreatmentPlanDialog({
  isOpen,
  onClose,
  planId,
}: ViewTreatmentPlanDialogProps) {
  const [plan, setPlan] = useState<TreatmentPlan | null>(null);
  const [exercises, setExercises] = useState<PlanExercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && planId) {
      fetchPlanDetails();
    }
  }, [isOpen, planId]);

  const fetchPlanDetails = async () => {
    if (!planId) return;

    setIsLoading(true);
    try {
      // Fetch plan details
      const { data: planData, error: planError } = await supabase
        .from("treatment_plans")
        .select("*")
        .eq("id", planId)
        .single();

      if (planError) {
        console.error("Error fetching plan:", planError);
        toast.error("Erro ao carregar detalhes do plano");
        return;
      }

      setPlan(planData);

      // Fetch plan exercises with exercise details
      const { data: exercisesData, error: exercisesError } = await supabase
        .from("plan_exercises")
        .select(`
          *,
          exercises (*)
        `)
        .eq("treatment_plan_id", planId)
        .order("day_number", { ascending: true });

      if (exercisesError) {
        console.error("Error fetching exercises:", exercisesError);
        toast.error("Erro ao carregar exercícios");
        return;
      }

      setExercises(exercisesData || []);
    } catch (error) {
      console.error("Error in fetchPlanDetails:", error);
      toast.error("Erro inesperado ao carregar dados");
    } finally {
      setIsLoading(false);
    }
  };

  const markExerciseAsCompleted = async (exerciseId: string) => {
    try {
      const { error } = await supabase
        .from("plan_exercises")
        .update({
          is_completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq("id", exerciseId);

      if (error) {
        console.error("Error completing exercise:", error);
        toast.error("Erro ao marcar exercício como concluído");
        return;
      }

      // Update local state
      setExercises((prev) =>
        prev.map((ex) =>
          ex.id === exerciseId
            ? { ...ex, is_completed: true, completed_at: new Date().toISOString() }
            : ex
        )
      );

      toast.success("Exercício marcado como concluído!");
      
      // Update plan progress
      await updatePlanProgress();
    } catch (error) {
      console.error("Error in markExerciseAsCompleted:", error);
      toast.error("Erro inesperado");
    }
  };

  const updatePlanProgress = async () => {
    if (!planId || exercises.length === 0) return;

    const completedCount = exercises.filter((ex) => ex.is_completed).length;
    const progressPercentage = Math.round((completedCount / exercises.length) * 100);

    try {
      const { error } = await supabase
        .from("treatment_plans")
        .update({ progress_percentage: progressPercentage })
        .eq("id", planId);

      if (error) {
        console.error("Error updating progress:", error);
        return;
      }

      setPlan((prev) => prev ? { ...prev, progress_percentage: progressPercentage } : null);
    } catch (error) {
      console.error("Error in updatePlanProgress:", error);
    }
  };

  const groupExercisesByDay = () => {
    const grouped: { [day: number]: PlanExercise[] } = {};
    
    exercises.forEach((exercise: PlanExercise) => {
      const day = exercise.day_number;
      if (!grouped[day]) {
        grouped[day] = [];
      }
      grouped[day].push(exercise);
    });

    return grouped;
  };

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <Clock className="mx-auto h-12 w-12 text-muted-foreground animate-spin mb-4" />
              <p>Carregando detalhes do plano...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!plan) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px]">
          <div className="text-center p-8">
            <p>Plano não encontrado</p>
            <Button onClick={onClose} className="mt-4">
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const groupedExercises = groupExercisesByDay();
  const totalExercises = exercises.length;
  const completedExercises = exercises.filter((ex) => ex.is_completed).length;
  const progressPercentage = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            {plan.name}
          </DialogTitle>
          <DialogDescription>
            Visualize e gerencie os exercícios do plano de tratamento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plan Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumo do Plano</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {plan.description && (
                <p className="text-muted-foreground">{plan.description}</p>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium">Período</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {plan.start_date ? new Date(plan.start_date).toLocaleDateString('pt-BR') : 'Não definido'} - {' '}
                    {plan.end_date ? new Date(plan.end_date).toLocaleDateString('pt-BR') : 'Não definido'}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">Status</span>
                  </div>
                  <Badge variant={plan.is_active ? "default" : "secondary"}>
                    {plan.is_active ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Progresso Geral</span>
                  <span className="text-sm text-muted-foreground">
                    {completedExercises}/{totalExercises} exercícios
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <p className="text-sm text-muted-foreground text-center">
                  {progressPercentage}% concluído
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Exercises by Day */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Exercícios por Dia</h3>
            
            {Object.keys(groupedExercises).length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  <Activity className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum exercício encontrado</h3>
                  <p className="text-sm">Este plano ainda não possui exercícios cadastrados.</p>
                </CardContent>
              </Card>
            ) : (
              Object.keys(groupedExercises)
                .sort((a, b) => parseInt(a) - parseInt(b))
                .map((day) => (
                  <Card key={day}>
                    <CardHeader>
                      <CardTitle className="text-base">Dia {day}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {groupedExercises[parseInt(day)].map((exercise) => (
                          <div
                            key={exercise.id}
                            className={`p-4 rounded-lg border ${
                              exercise.is_completed
                                ? "bg-green-50 border-green-200"
                                : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium flex items-center gap-2">
                                  {exercise.is_completed && (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  )}
                                  {exercise.exercises?.name || 'Exercício sem nome'}
                                </h4>
                                
                                {exercise.exercises?.description && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {exercise.exercises.description}
                                  </p>
                                )}

                                <div className="flex flex-wrap gap-4 mt-2 text-sm">
                                  {exercise.sets && (
                                    <span>
                                      <strong>Séries:</strong> {exercise.sets}
                                    </span>
                                  )}
                                  {exercise.repetitions && (
                                    <span>
                                      <strong>Repetições:</strong> {exercise.repetitions}
                                    </span>
                                  )}
                                  {exercise.duration_minutes && (
                                    <span>
                                      <strong>Duração:</strong> {exercise.duration_minutes} min
                                    </span>
                                  )}
                                </div>

                                {exercise.notes && (
                                  <p className="text-sm text-muted-foreground mt-2">
                                    <strong>Observações:</strong> {exercise.notes}
                                  </p>
                                )}

                                {exercise.is_completed && exercise.completed_at && (
                                  <p className="text-xs text-green-600 mt-2">
                                    Concluído em {new Date(exercise.completed_at).toLocaleDateString('pt-BR')}
                                  </p>
                                )}
                              </div>

                              {!exercise.is_completed && (
                                <Button
                                  size="sm"
                                  onClick={() => markExerciseAsCompleted(exercise.id)}
                                  className="ml-4"
                                >
                                  <Play className="h-3 w-3 mr-1" />
                                  Concluir
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        </div>

        <Separator />
        
        <div className="flex justify-end">
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
