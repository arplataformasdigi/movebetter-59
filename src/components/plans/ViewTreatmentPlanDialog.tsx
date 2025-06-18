
import React from "react";
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
import { TreatmentPlan } from "@/hooks/useTreatmentPlans";
import { usePlanExercises } from "@/hooks/usePlanExercises";
import { Eye, User, Calendar, Target, Clock, Dumbbell } from "lucide-react";

interface ViewTreatmentPlanDialogProps {
  plan: TreatmentPlan | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ViewTreatmentPlanDialog({ plan, open, onOpenChange }: ViewTreatmentPlanDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const { planExercises, isLoading } = usePlanExercises(plan?.id);
  
  const isControlled = open !== undefined && onOpenChange !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange : setInternalOpen;

  if (!plan) return null;

  const DialogComponent = (
    <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
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
                {plan.start_date ? new Date(plan.start_date).toLocaleDateString('pt-BR') : 'Não definido'}
              </span>
            </div>
            
            {plan.end_date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Fim:</span>
                <span className="text-sm">
                  {new Date(plan.end_date).toLocaleDateString('pt-BR')}
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
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-medium">Progresso</span>
                <span>{plan.progress_percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${plan.progress_percentage}%` }}
                />
              </div>
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
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Dumbbell className="h-4 w-4" />
            Exercícios do Plano
          </h4>
          
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Carregando exercícios...</div>
          ) : planExercises.length === 0 ? (
            <Card>
              <CardContent className="text-center py-6">
                <Dumbbell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Nenhum exercício adicionado a esta trilha
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {planExercises.map((planEx) => (
                <Card key={planEx.id} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">
                        Dia {planEx.day_number} - {planEx.exercises?.name}
                      </CardTitle>
                      <Badge variant={planEx.is_completed ? "default" : "secondary"}>
                        {planEx.is_completed ? "Concluído" : "Pendente"}
                      </Badge>
                    </div>
                    {planEx.exercises?.description && (
                      <CardDescription className="text-xs">
                        {planEx.exercises.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="pt-0">
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
                          <span>{new Date(planEx.completed_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                      )}
                    </div>
                    {planEx.notes && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
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
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
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
