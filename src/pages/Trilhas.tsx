
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash, Eye, Play, Pause } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useTreatmentPlans } from "@/hooks/useTreatmentPlans";
import { AddTreatmentPlanDialog } from "@/components/plans/AddTreatmentPlanDialog";
import { EditTreatmentPlanDialog } from "@/components/plans/EditTreatmentPlanDialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PlanCardProps {
  plan: any;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, onToggleStatus, onDelete }) => {
  const handleDelete = () => {
    if (plan.progress_percentage > 0) {
      alert("Não é possível excluir uma trilha com progresso iniciado.");
      return;
    }
    const confirmed = window.confirm(`Tem certeza que deseja excluir a trilha "${plan.name}"?`);
    if (confirmed) {
      onDelete(plan.id);
    }
  };

  const handleToggleStatus = () => {
    onToggleStatus(plan.id);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Não definido";
    return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
  };

  const calculateDuration = () => {
    if (!plan.start_date || !plan.end_date) return "Não definido";
    const start = new Date(plan.start_date);
    const end = new Date(plan.end_date);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.ceil(diffDays / 7);
    return `${weeks} semanas`;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{plan.name}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={plan.is_active ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}>
              {plan.is_active ? "Ativo" : "Pausado"}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleStatus}
              className="h-8 w-8 p-0"
            >
              {plan.is_active ? (
                <Pause className="h-4 w-4 text-amber-600" />
              ) : (
                <Play className="h-4 w-4 text-green-600" />
              )}
            </Button>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Paciente: {plan.patients?.name || "Não atribuído"}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Duração:</span>
            <span className="font-medium">{calculateDuration()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Início:</span>
            <span className="font-medium">{formatDate(plan.start_date)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Fim:</span>
            <span className="font-medium">{formatDate(plan.end_date)}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Progresso:</span>
              <span className="font-medium">{plan.progress_percentage || 0}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full">
              <div 
                className="h-full rounded-full bg-movebetter-primary" 
                style={{ width: `${plan.progress_percentage || 0}%` }}
              ></div>
            </div>
          </div>
          {plan.description && (
            <div className="mt-2">
              <div className="text-sm text-gray-600">{plan.description}</div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <EditTreatmentPlanDialog plan={plan} />
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-1" /> Visualizar
          </Button>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-red-600 border-red-200 hover:bg-red-50"
          onClick={handleDelete}
        >
          <Trash className="h-4 w-4 mr-1" /> Excluir
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function Trilhas() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const { treatmentPlans, isLoading, updateTreatmentPlan, deleteTreatmentPlan } = useTreatmentPlans();

  const handleToggleStatus = async (planId: string) => {
    const plan = treatmentPlans.find(p => p.id === planId);
    if (plan) {
      await updateTreatmentPlan(planId, { is_active: !plan.is_active });
    }
  };

  const handleDeletePlan = async (planId: string) => {
    await deleteTreatmentPlan(planId);
  };

  const filteredPlans = treatmentPlans.filter(plan => 
    plan.patients?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando trilhas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Trilhas de Acompanhamento</h1>
        <AddTreatmentPlanDialog />
      </div>
      
      <div className="flex items-center justify-between space-x-2 mb-6">
        <Input
          placeholder="Buscar por nome do paciente ou trilha..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.length > 0 ? (
          filteredPlans.map((plan) => (
            <PlanCard 
              key={plan.id} 
              plan={plan} 
              onToggleStatus={handleToggleStatus}
              onDelete={handleDeletePlan}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            {searchTerm ? "Nenhuma trilha encontrada com os critérios de busca." : "Nenhuma trilha cadastrada ainda."}
          </div>
        )}
      </div>
    </div>
  );
}
