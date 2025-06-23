
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TreatmentPlan } from "@/hooks/useTreatmentPlans";
import { usePlanExercises } from "@/hooks/usePlanExercises";
import { EditPlanExerciseDialog } from "./EditPlanExerciseDialog";
import { formatDateToBrazilian } from "@/utils/dateUtils";
import { supabase } from "@/integrations/supabase/client";
import { 
  Eye, 
  User, 
  Calendar, 
  Target, 
  Clock, 
  Dumbbell, 
  CheckCircle, 
  Circle, 
  Edit, 
  Trash, 
  Plus 
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ViewTreatmentPlanDialogProps {
  plan: TreatmentPlan | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ViewTreatmentPlanDialog({ plan, open, onOpenChange }: ViewTreatmentPlanDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [editExerciseOpen, setEditExerciseOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseToDelete, setExerciseToDelete] = useState(null);
  
  const { 
    planExercises, 
    isLoading, 
    toggleExerciseCompletion, 
    updatePlanExercise, 
    removePlanExercise,
    fetchPlanExercises 
  } = usePlanExercises(plan?.id);

  console.log('ViewTreatmentPlanDialog - Plan:', plan);
  console.log('ViewTreatmentPlanDialog - Plan exercises:', planExercises);
  console.log('ViewTreatmentPlanDialog - Is loading:', isLoading);
  
  const isControlled = open !== undefined && onOpenChange !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange : setInternalOpen;

  // Calculate progress based on completed exercises
  const totalExercises = planExercises.length;
  const completedExercises = planExercises.filter(ex => ex.is_completed).length;
  const progressPercentage = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;

  // Force refresh exercises when dialog opens
  useEffect(() => {
    if (isOpen && plan?.id) {
      console.log('Dialog opened, forcing exercise refresh for plan:', plan.id);
      fetchPlanExercises();
    }
  }, [isOpen, plan?.id, fetchPlanExercises]);

  const handleEditExercise = (exercise) => {
    setSelectedExercise(exercise);
    setEditExerciseOpen(true);
  };

  const handleDeleteExercise = (exercise) => {
    console.log('Deleting exercise:', exercise);
    setExerciseToDelete(exercise);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteExercise = async () => {
    if (exerciseToDelete) {
      console.log('Confirming delete for exercise:', exerciseToDelete.id);
      const result = await removePlanExercise(exerciseToDelete.id);
      if (result.success) {
        setDeleteDialogOpen(false);
        setExerciseToDelete(null);
      }
    }
  };

  const handleToggleCompletion = async (exerciseId: string, isCompleted: boolean) => {
    const result = await toggleExerciseCompletion(exerciseId, !isCompleted);
    if (result.success) {
      // Update patient scores when exercise is completed
      if (!isCompleted && plan?.patient_id) {
        await updatePatientScore(plan.patient_id);
      }
    }
  };

  const updatePatientScore = async (patientId: string) => {
    try {
      // Update patient scores
      const { error } = await supabase.rpc('update_patient_score', {
        p_patient_id: patientId,
        p_points_to_add: 10, // 10 points per completed exercise
        p_exercises_completed: 1
      });

      if (error) {
        console.error('Error updating patient score:', error);
      }
    } catch (error) {
      console.error('Error in updatePatientScore:', error);
    }
  };

  // Agrupar exercícios por dia
  const exercisesByDay = planExercises.reduce((acc, exercise) => {
    const day = exercise.day_number;
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(exercise);
    return acc;
  }, {} as Record<number, typeof planExercises>);

  const sortedDays = Object.keys(exercisesByDay).sort((a, b) => parseInt(a) - parseInt(b));

  if (!plan) return null;

  const DialogComponent = (
    <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          {plan.name}
        </DialogTitle>
        <DialogDescription>
          Visualização completa da trilha de tratamento
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Plan Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Paciente:</span>
              <span className="text-sm">{plan.patients?.name || 'Não definido'}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Início:</span>
              <span className="text-sm">
                {plan.start_date ? formatDateToBrazilian(plan.start_date) : 'Não definido'}
              </span>
            </div>
            
            {plan.end_date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Fim:</span>
                <span className="text-sm">
                  {formatDateToBrazilian(plan.end_date)}
                </span>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <Badge className={plan.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                {plan.is_active ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium">Progresso</span>
                <span>{progressPercentage}% ({completedExercises}/{totalExercises})</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>
          </div>
        </div>

        {/* Description */}
        {plan.description && (
          <div>
            <h4 className="text-sm font-medium mb-2">Descrição</h4>
            <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md">
              {plan.description}
            </p>
          </div>
        )}

        {/* Exercises */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Dumbbell className="h-4 w-4" />
              Exercícios do Plano ({planExercises.length})
            </h4>
            {isLoading && (
              <div className="text-xs text-muted-foreground">Carregando...</div>
            )}
          </div>
          
          {isLoading ? (
            <div className="text-sm text-muted-foreground text-center py-8">
              <Dumbbell className="h-8 w-8 text-muted-foreground mx-auto mb-2 animate-pulse" />
              Carregando exercícios...
            </div>
          ) : planExercises.length === 0 ? (
            <Card>
              <CardContent className="text-center py-6">
                <Dumbbell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Nenhum exercício adicionado a esta trilha
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Use o botão "Exercícios" na trilha para adicionar exercícios
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {sortedDays.map((dayStr) => {
                const day = parseInt(dayStr);
                const dayExercises = exercisesByDay[day];
                const completedCount = dayExercises.filter(ex => ex.is_completed).length;
                
                return (
                  <Card key={day} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                          Dia {day}
                        </CardTitle>
                        <Badge variant="outline">
                          {completedCount}/{dayExercises.length} concluídos
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {dayExercises.map((planEx) => (
                        <div key={planEx.id} className={`p-4 rounded-lg border-2 transition-all ${
                          planEx.is_completed 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-gray-50 border-gray-200'
                        }`}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Button
                                size="sm"
                                variant={planEx.is_completed ? "default" : "outline"}
                                className={`h-8 w-8 p-0 ${
                                  planEx.is_completed 
                                    ? 'bg-green-600 hover:bg-green-700' 
                                    : 'hover:bg-gray-100'
                                }`}
                                onClick={() => handleToggleCompletion(planEx.id, planEx.is_completed)}
                              >
                                {planEx.is_completed ? (
                                  <CheckCircle className="h-4 w-4 text-white" />
                                ) : (
                                  <Circle className="h-4 w-4 text-gray-400" />
                                )}
                              </Button>
                              <div>
                                <span className={`font-medium ${planEx.is_completed ? 'line-through text-green-700' : ''}`}>
                                  {planEx.exercises?.name || 'Exercício sem nome'}
                                </span>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant={planEx.is_completed ? "default" : "secondary"} className="text-xs">
                                    {planEx.is_completed ? "Concluído" : "Pendente"}
                                  </Badge>
                                  {planEx.is_completed && (
                                    <span className="text-xs text-green-600">
                                      ✓ +10 pontos
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditExercise(planEx)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => handleDeleteExercise(planEx)}
                              >
                                <Trash className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          {planEx.exercises?.description && (
                            <p className="text-xs text-muted-foreground mb-2">
                              {planEx.exercises.description}
                            </p>
                          )}
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                            {planEx.repetitions && (
                              <div className="flex items-center gap-1">
                                <span className="font-medium">Repetições:</span>
                                <span>{planEx.repetitions}</span>
                              </div>
                            )}
                            {planEx.sets && (
                              <div className="flex items-center gap-1">
                                <span className="font-medium">Séries:</span>
                                <span>{planEx.sets}</span>
                              </div>
                            )}
                            {planEx.duration_minutes && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{planEx.duration_minutes}min</span>
                              </div>
                            )}
                            {planEx.completed_at && (
                              <div className="flex items-center gap-1">
                                <span className="font-medium">Concluído:</span>
                                <span>{formatDateToBrazilian(planEx.completed_at.split('T')[0])}</span>
                              </div>
                            )}
                          </div>
                          
                          {planEx.notes && (
                            <div className="mt-2 p-2 bg-white rounded text-xs">
                              <span className="font-medium">Observações: </span>
                              {planEx.notes}
                            </div>
                          )}
                          
                          {planEx.exercises?.instructions && (
                            <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                              <span className="font-medium">Instruções: </span>
                              {planEx.exercises.instructions}
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <EditPlanExerciseDialog
        planExercise={selectedExercise}
        open={editExerciseOpen}
        onOpenChange={setEditExerciseOpen}
        onUpdate={updatePlanExercise}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o exercício "{exerciseToDelete?.exercises?.name}" da trilha? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteExercise}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DialogContent>
  );

  if (isControlled) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {DialogComponent}
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-1" /> Ver
        </Button>
      </DialogTrigger>
      {DialogComponent}
    </Dialog>
  );
}
