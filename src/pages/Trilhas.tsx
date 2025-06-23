
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Plus, Eye, Edit, Trash, Target, User, Calendar, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddTreatmentPlanDialog } from "@/components/plans/AddTreatmentPlanDialog";
import { EditTreatmentPlanDialog } from "@/components/plans/EditTreatmentPlanDialog";
import { ViewTreatmentPlanDialog } from "@/components/plans/ViewTreatmentPlanDialog";
import { CreateExerciseForPlanDialog } from "@/components/plans/CreateExerciseForPlanDialog";
import { useTreatmentPlans } from "@/hooks/useTreatmentPlans";
import { useExercises } from "@/hooks/useExercises";
import { usePlanExercises } from "@/hooks/usePlanExercises";
import { formatDateToBrazilian } from "@/utils/dateUtils";
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

export default function Trilhas() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateExerciseDialogOpen, setIsCreateExerciseDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { treatmentPlans, isLoading, deleteTreatmentPlan } = useTreatmentPlans();
  const { exercises } = useExercises();

  // Filtrar trilhas por nome do paciente
  const filteredPlans = treatmentPlans.filter(plan => 
    plan.patients?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    plan.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log('Treatment plans in component:', treatmentPlans);

  // Handler functions
  const handleView = (plan) => {
    setSelectedPlan(plan);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setIsEditDialogOpen(true);
  };

  const handleCreateExercise = (plan) => {
    setSelectedPlan(plan);
    setIsCreateExerciseDialogOpen(true);
  };

  const handleDeleteClick = (plan) => {
    setPlanToDelete(plan);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (planToDelete) {
      const result = await deleteTreatmentPlan(planToDelete.id);
      if (result.success) {
        setIsDeleteDialogOpen(false);
        setPlanToDelete(null);
      }
    }
  };

  // Custom hook to calculate real-time progress for each plan
  const PlanCard = ({ plan }) => {
    const { planExercises } = usePlanExercises(plan.id);
    
    const totalExercises = planExercises.length;
    const completedExercises = planExercises.filter(ex => ex.is_completed).length;
    const realTimeProgress = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{plan.name}</CardTitle>
            <Badge className={plan.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
              {plan.is_active ? "Ativo" : "Inativo"}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2">
            {plan.description || "Sem descrição"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center text-sm text-muted-foreground">
              <User className="h-4 w-4 mr-2" />
              <span>{plan.patients?.name || 'Paciente não definido'}</span>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              <span>
                {plan.start_date ? formatDateToBrazilian(plan.start_date) : 'Data não definida'}
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Progresso</span>
                <span>{realTimeProgress}% ({completedExercises}/{totalExercises})</span>
              </div>
              <Progress value={realTimeProgress} className="h-2" />
            </div>

            <div className="flex justify-between pt-2 gap-1">
              <div className="flex gap-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleView(plan)}
                  className="text-xs px-2"
                >
                  <Eye className="h-3 w-3 mr-1" /> Ver
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEdit(plan)}
                  className="text-xs px-2"
                >
                  <Edit className="h-3 w-3 mr-1" /> Editar
                </Button>
              </div>
              <div className="flex gap-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleCreateExercise(plan)}
                  className="text-xs px-2"
                >
                  <Plus className="h-3 w-3 mr-1" /> Exercícios
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 border-red-200 hover:bg-red-50 text-xs px-2"
                  onClick={() => handleDeleteClick(plan)}
                >
                  <Trash className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando trilhas de tratamento...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center">
            <Target className="mr-2 h-6 w-6" /> Trilhas de Tratamento
          </h1>
          <p className="text-muted-foreground">
            Gerencie planos de tratamento personalizados ({filteredPlans.length} trilhas encontradas)
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Trilha
          </Button>
        </div>
      </div>

      {/* Campo de pesquisa */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar por nome do paciente ou trilha..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredPlans.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-center mb-2">
              {searchTerm ? "Nenhuma trilha encontrada" : "Nenhuma trilha encontrada"}
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm ? 
                "Tente ajustar os termos de pesquisa" : 
                "Crie trilhas de tratamento personalizadas para seus pacientes"
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Criar primeira trilha
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      )}

      <AddTreatmentPlanDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
      />
      
      <EditTreatmentPlanDialog
        plan={selectedPlan}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      <ViewTreatmentPlanDialog
        plan={selectedPlan}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
      />

      <CreateExerciseForPlanDialog
        plan={selectedPlan}
        open={isCreateExerciseDialogOpen}
        onOpenChange={setIsCreateExerciseDialogOpen}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a trilha "{planToDelete?.name}"? 
              Esta ação não pode ser desfeita e todos os exercícios associados também serão removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
