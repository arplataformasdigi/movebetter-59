
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CalendarIcon, CheckCircle, Clock, ListChecks } from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  completed: boolean;
  duration: string;
  sets: number;
  reps: number;
}

interface TreatmentPlan {
  id: string;
  title: string;
  description: string;
  professional: string;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "paused";
  progress: number;
  exercises: Exercise[];
}

export default function PatientPlans() {
  // Mock de dados para planos de tratamento
  const treatmentPlans: TreatmentPlan[] = [
    {
      id: "1",
      title: "Reabilitação Lombar",
      description: "Tratamento para recuperação da mobilidade e redução da dor lombar",
      professional: "Dra. Maria",
      startDate: "25/04/2025",
      endDate: "25/06/2025",
      status: "active",
      progress: 65,
      exercises: [
        { 
          id: "1", 
          name: "Alongamento lombar deitado", 
          completed: true,
          duration: "5 minutos",
          sets: 3,
          reps: 10
        },
        { 
          id: "2", 
          name: "Ponte glútea", 
          completed: true,
          duration: "8 minutos",
          sets: 3,
          reps: 15
        },
        { 
          id: "3", 
          name: "Prancha abdominal", 
          completed: true,
          duration: "5 minutos",
          sets: 3,
          reps: 5
        },
        { 
          id: "4", 
          name: "Estabilização com bola", 
          completed: true,
          duration: "10 minutos",
          sets: 2,
          reps: 12
        },
        { 
          id: "5", 
          name: "Alongamento de piriformes", 
          completed: false,
          duration: "5 minutos",
          sets: 3,
          reps: 8
        },
        { 
          id: "6", 
          name: "Exercício de rotação lombar", 
          completed: false,
          duration: "8 minutos",
          sets: 3,
          reps: 10
        },
        { 
          id: "7", 
          name: "Fortalecimento abdominal", 
          completed: false,
          duration: "12 minutos",
          sets: 4,
          reps: 15
        },
        { 
          id: "8", 
          name: "Alongamento final", 
          completed: false,
          duration: "5 minutos",
          sets: 1,
          reps: 5
        }
      ]
    },
    {
      id: "2",
      title: "Fortalecimento Postural",
      description: "Plano para melhoria da postura e fortalecimento do core",
      professional: "Dr. João",
      startDate: "10/05/2025",
      endDate: "10/07/2025",
      status: "active",
      progress: 30,
      exercises: [
        { 
          id: "1", 
          name: "Prancha lateral", 
          completed: true,
          duration: "5 minutos",
          sets: 3,
          reps: 5
        },
        { 
          id: "2", 
          name: "Elevação de tronco", 
          completed: true,
          duration: "8 minutos",
          sets: 3,
          reps: 12
        },
        { 
          id: "3", 
          name: "Elevação de pernas", 
          completed: false,
          duration: "10 minutos",
          sets: 4,
          reps: 10
        },
        { 
          id: "4", 
          name: "Prancha frontal", 
          completed: false,
          duration: "5 minutos",
          sets: 3,
          reps: 5
        },
        { 
          id: "5", 
          name: "Superman", 
          completed: false,
          duration: "8 minutos",
          sets: 3,
          reps: 8
        }
      ]
    }
  ];

  const activePlans = treatmentPlans.filter(plan => plan.status === "active");
  const completedPlans = treatmentPlans.filter(plan => plan.status === "completed");
  const pausedPlans = treatmentPlans.filter(plan => plan.status === "paused");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Meus Planos de Tratamento</h1>
        <p className="text-muted-foreground">
          Visualize seus planos de tratamento e exercícios recomendados.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Planos de Tratamento</CardTitle>
          <CardDescription>
            Acompanhe seu progresso em cada plano
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">Ativos</TabsTrigger>
              <TabsTrigger value="completed">Concluídos</TabsTrigger>
              <TabsTrigger value="paused">Pausados</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="space-y-6 pt-4">
              {activePlans.length > 0 ? (
                activePlans.map((plan) => (
                  <Card key={plan.id}>
                    <CardHeader>
                      <div className="flex justify-between">
                        <CardTitle>{plan.title}</CardTitle>
                        <Button variant="outline" size="sm">
                          <ListChecks className="h-4 w-4 mr-1" /> Ver detalhes
                        </Button>
                      </div>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>Início: {plan.startDate}</span>
                          </div>
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>Fim: {plan.endDate}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="mr-1">Profissional:</span>
                          <span className="font-medium">{plan.professional}</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Progresso</span>
                          <span className="text-sm font-medium">{plan.progress}%</span>
                        </div>
                        <Progress value={plan.progress} />
                      </div>

                      <div className="pt-4">
                        <h4 className="font-medium mb-3">Exercícios ({plan.exercises.filter(e => e.completed).length}/{plan.exercises.length})</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {plan.exercises.map((exercise) => (
                            <div 
                              key={exercise.id} 
                              className={`p-3 border rounded-md flex items-center justify-between ${
                                exercise.completed ? "bg-green-50 border-green-200" : "bg-gray-50"
                              }`}
                            >
                              <div>
                                <div className="flex items-center">
                                  {exercise.completed ? (
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                  ) : (
                                    <Clock className="h-4 w-4 text-amber-500 mr-2" />
                                  )}
                                  <span className="font-medium">{exercise.name}</span>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  <span>{exercise.sets} séries x {exercise.reps} repetições</span>
                                  <span className="mx-1">•</span>
                                  <span>{exercise.duration}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Você não possui planos ativos no momento.
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="pt-4">
              {completedPlans.length > 0 ? (
                <div>Planos concluídos</div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Você ainda não tem nenhum plano concluído.
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="paused" className="pt-4">
              {pausedPlans.length > 0 ? (
                <div>Planos pausados</div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Você não tem nenhum plano pausado.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
