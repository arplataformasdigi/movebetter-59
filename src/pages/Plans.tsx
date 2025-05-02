
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash } from "lucide-react";

interface Plan {
  id: string;
  title: string;
  patientName: string;
  type: string;
  duration: string;
  exercisesCount: number;
  progress: number;
}

const mockPlans: Plan[] = [
  {
    id: "1",
    title: "Reabilitação pós-lesão",
    patientName: "Carlos Oliveira",
    type: "runner",
    duration: "8 semanas",
    exercisesCount: 12,
    progress: 25,
  },
  {
    id: "2",
    title: "Fortalecimento Core",
    patientName: "Mariana Costa",
    type: "pilates",
    duration: "6 semanas",
    exercisesCount: 8,
    progress: 50,
  },
  {
    id: "3",
    title: "Preparação Maratona",
    patientName: "Pedro Santos",
    type: "runner",
    duration: "12 semanas",
    exercisesCount: 20,
    progress: 75,
  },
  {
    id: "4",
    title: "Postura e Equilíbrio",
    patientName: "Carla Souza",
    type: "pilates",
    duration: "8 semanas",
    exercisesCount: 15,
    progress: 60,
  },
];

const PlanCard: React.FC<{ plan: Plan }> = ({ plan }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{plan.title}</CardTitle>
          <Badge className={plan.type === "runner" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}>
            {plan.type === "runner" ? "Corredor" : "Pilates"}
          </Badge>
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
        <Button variant="outline" size="sm">
          <Pencil className="h-4 w-4 mr-1" /> Editar
        </Button>
        <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
          <Trash className="h-4 w-4 mr-1" /> Excluir
        </Button>
      </CardFooter>
    </Card>
  );
};

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function Plans() {
  const [searchTerm, setSearchTerm] = React.useState("");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Planos de Acompanhamento</h1>
        <Link to="/planos/criar">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Criar Novo Plano
          </Button>
        </Link>
      </div>
      
      <div className="flex items-center space-x-2 mb-6">
        <Input
          placeholder="Buscar planos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPlans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
}
