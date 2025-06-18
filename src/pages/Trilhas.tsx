
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit, Trash, RefreshCw, Target, User, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddTreatmentPlanDialog } from "@/components/plans/AddTreatmentPlanDialog";
import { EditTreatmentPlanDialog } from "@/components/plans/EditTreatmentPlanDialog";
import { ViewTreatmentPlanDialog } from "@/components/plans/ViewTreatmentPlanDialog";
import { useTreatmentPlans } from "@/hooks/useTreatmentPlans";
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
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planToDelete, setPlanToDelete] = useState(null);

  const { treatmentPlans, isLoading, fetchTreatmentPlans, deleteTreatmentPlan } = useTreatmentPlans();

  console.log('Treatment plans in component:', treatmentPlans);

  const handleView = (plan) => {
    setSelectedPlan(plan);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (plan) => {
    setPlanToDelete(plan);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (planToDelete) {
      await deleteTreatmentPlan(planToDelete.id);
      setIsDeleteDialogOpen(false);
      setPlanToDelete(null);
    }
  };

  const handleRefresh = () => {
    console.log('Refreshing treatment plans...');
    fetchTreatmentPlans();
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
            Gerencie planos de tratamento personalizados ({treatmentPlans.length} trilhas encontradas)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Trilha
          </Button>
        </div>
      </div>

      {treatmentPlans.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-center mb-2">Nenhuma trilha encontrada</h3>
            <p className="text-muted-foreground text-center mb-4">
              Crie trilhas de tratamento personalizadas para seus pacientes
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Criar primeira trilha
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {treatmentPlans.map((plan) => (
            <Card key={plan.id} className="hover:shadow-md transition-shadow">
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
                      {plan.start_date ? new Date(plan.start_date).toLocaleDateString('pt-BR') : 'Data não definida'}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Progresso</span>
                      <span>{plan.progress_percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${plan.progress_percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <div className="flex gap-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleView(plan)}
                      >
                        <Eye className="h-4 w-4 mr-1" /> Ver
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEdit(plan)}
                      >
                        <Edit className="h-4 w-4 mr-1" /> Editar
                      </Button>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleDeleteClick(plan)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
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
