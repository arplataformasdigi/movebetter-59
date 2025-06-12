
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash, Eye, Play, Pause } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Plan {
  id: string;
  title: string;
  patientName: string;
  status: "active" | "paused";
  duration: string;
  exercisesCount: number;
  progress: number;
}

const mockPlans: Plan[] = [
  {
    id: "1",
    title: "Reabilitação pós-lesão",
    patientName: "Carlos Oliveira",
    status: "active",
    duration: "8 semanas",
    exercisesCount: 12,
    progress: 25,
  },
  {
    id: "2",
    title: "Fortalecimento Core",
    patientName: "Mariana Costa",
    status: "active",
    duration: "6 semanas",
    exercisesCount: 8,
    progress: 50,
  },
  {
    id: "3",
    title: "Preparação Maratona",
    patientName: "Pedro Santos",
    status: "paused",
    duration: "12 semanas",
    exercisesCount: 20,
    progress: 75,
  },
  {
    id: "4",
    title: "Postura e Equilíbrio",
    patientName: "Carla Souza",
    status: "active",
    duration: "8 semanas",
    exercisesCount: 15,
    progress: 60,
  },
];

const PlanCard: React.FC<{ plan: Plan; onToggleStatus: (id: string) => void; onDelete: (id: string) => void }> = ({ plan, onToggleStatus, onDelete }) => {
  const handleDelete = () => {
    if (plan.progress > 0) {
      alert("Não é possível excluir uma trilha com progresso iniciado.");
      return;
    }
    const confirmed = window.confirm(`Tem certeza que deseja excluir a trilha "${plan.title}"?`);
    if (confirmed) {
      onDelete(plan.id);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{plan.title}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={plan.status === "active" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}>
              {plan.status === "active" ? "Ativo" : "Pausado"}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleStatus(plan.id)}
              className="h-8 w-8 p-0"
            >
              {plan.status === "active" ? (
                <Pause className="h-4 w-4 text-amber-600" />
              ) : (
                <Play className="h-4 w-4 text-green-600" />
              )}
            </Button>
          </div>
        </div>
        <div className="text-sm text-gray-500">Paciente: {plan.patientName}</div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Duração:</span>
            <span className="font-medium">{plan.duration}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Exercícios:</span>
            <span className="font-medium">{plan.exercisesCount}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Progresso:</span>
              <span className="font-medium">{plan.progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full">
              <div 
                className="h-full rounded-full bg-movebetter-primary" 
                style={{ width: `${plan.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Pencil className="h-4 w-4 mr-1" /> Editar
          </Button>
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
  const [plans, setPlans] = React.useState<Plan[]>(mockPlans);

  const handleToggleStatus = (planId: string) => {
    setPlans(plans.map(plan => 
      plan.id === planId 
        ? { ...plan, status: plan.status === "active" ? "paused" : "active" as Plan["status"] }
        : plan
    ));
  };

  const handleDeletePlan = (planId: string) => {
    setPlans(plans.filter(plan => plan.id !== planId));
  };

  const filteredPlans = plans.filter(plan => 
    plan.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Trilhas de Acompanhamento</h1>
        <Link to="/trilhas/criar">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Criar Nova Trilha
          </Button>
        </Link>
      </div>
      
      <div className="flex items-center justify-between space-x-2 mb-6">
        <Input
          placeholder="Buscar por nome do paciente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <PlanCard 
            key={plan.id} 
            plan={plan} 
            onToggleStatus={handleToggleStatus}
            onDelete={handleDeletePlan}
          />
        ))}
      </div>
    </div>
  );
}
