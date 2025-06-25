
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Play, Plus } from "lucide-react";

import { ExerciseForm } from "@/components/exercises/ExerciseForm";

interface Exercise {
  id: string;
  name: string;
  category: "corrida" | "pilates" | "reabilitação";
  difficulty: "iniciante" | "intermediário" | "avançado";
  targetArea: string;
  description: string;
  videoUrl?: string;
  thumbnailUrl?: string;
}

const exercises: Exercise[] = [
  {
    id: "1",
    name: "Alongamento Dinâmico de Quadril",
    category: "corrida",
    difficulty: "iniciante",
    targetArea: "Quadril",
    description: "Exercício de mobilidade para preparar o quadril antes da corrida, reduzindo o risco de lesões.",
    videoUrl: "https://www.youtube.com/watch?v=example1",
    thumbnailUrl: "https://via.placeholder.com/320x180.png?text=Alongamento+Quadril",
  },
  {
    id: "2",
    name: "Fortalecimento de Core em Pilates",
    category: "pilates",
    difficulty: "intermediário",
    targetArea: "Abdômen",
    description: "Série de exercícios para fortalecer o core e melhorar a estabilidade do tronco.",
    videoUrl: "https://www.youtube.com/watch?v=example2",
    thumbnailUrl: "https://via.placeholder.com/320x180.png?text=Core+Pilates",
  },
  {
    id: "3",
    name: "Ativação de Glúteo",
    category: "reabilitação",
    difficulty: "iniciante",
    targetArea: "Glúteos",
    description: "Exercícios para ativar os músculos glúteos, frequentemente enfraquecidos em corredores.",
    videoUrl: "https://www.youtube.com/watch?v=example3",
    thumbnailUrl: "https://via.placeholder.com/320x180.png?text=Ativação+Glúteo",
  },
  {
    id: "4",
    name: "Fortalecimento de Tornozelo",
    category: "corrida",
    difficulty: "intermediário",
    targetArea: "Tornozelo",
    description: "Série de exercícios para fortalecer o tornozelo e prevenir entorses comuns em corredores.",
    videoUrl: "https://www.youtube.com/watch?v=example4",
    thumbnailUrl: "https://via.placeholder.com/320x180.png?text=Fortalecimento+Tornozelo",
  },
  {
    id: "5",
    name: "Controle de Respiração em Pilates",
    category: "pilates",
    difficulty: "avançado",
    targetArea: "Respiratório",
    description: "Técnicas avançadas de respiração para maximizar os benefícios dos exercícios de Pilates.",
    videoUrl: "https://www.youtube.com/watch?v=example5",
    thumbnailUrl: "https://via.placeholder.com/320x180.png?text=Respiração+Pilates",
  },
  {
    id: "6",
    name: "Mobilidade de Coluna",
    category: "reabilitação",
    difficulty: "intermediário",
    targetArea: "Coluna",
    description: "Exercícios para melhorar a mobilidade da coluna vertebral e prevenir dores nas costas.",
    videoUrl: "https://www.youtube.com/watch?v=example6",
    thumbnailUrl: "https://via.placeholder.com/320x180.png?text=Mobilidade+Coluna",
  },
];

const getDifficultyColor = (difficulty: Exercise["difficulty"]) => {
  switch (difficulty) {
    case "iniciante":
      return "bg-green-100 text-green-800 border-green-200";
    case "intermediário":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "avançado":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "";
  }
};

const getCategoryColor = (category: Exercise["category"]) => {
  switch (category) {
    case "corrida":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "pilates":
      return "bg-teal-100 text-teal-800 border-teal-200";
    case "reabilitação":
      return "bg-pink-100 text-pink-800 border-pink-200";
    default:
      return "";
  }
};

export default function ExerciseLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredExercises = exercises
    .filter(exercise => 
      (activeTab === "all" || exercise.category === activeTab) &&
      (exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       exercise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
       exercise.targetArea.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Biblioteca de Exercícios</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Adicionar Exercício
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Exercício</DialogTitle>
            </DialogHeader>
            <ExerciseForm />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar exercícios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="grid grid-cols-4 w-full md:w-auto">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="corrida">Corrida</TabsTrigger>
            <TabsTrigger value="pilates">Pilates</TabsTrigger>
            <TabsTrigger value="reabilitação">Reabilitação</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((exercise) => (
          <Card key={exercise.id}>
            <CardHeader className="pb-2">
              <div className="aspect-video bg-gray-100 rounded-md overflow-hidden mb-2">
                {exercise.thumbnailUrl ? (
                  <img 
                    src={exercise.thumbnailUrl} 
                    alt={exercise.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Play className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              <CardTitle className="text-lg">{exercise.name}</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className={getCategoryColor(exercise.category)}>
                  {exercise.category}
                </Badge>
                <Badge className={getDifficultyColor(exercise.difficulty)}>
                  {exercise.difficulty}
                </Badge>
                <Badge variant="outline">
                  {exercise.targetArea}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3">
                {exercise.description}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Play className="h-4 w-4 mr-1" /> Ver Detalhes
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{exercise.name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                      {exercise.thumbnailUrl ? (
                        <img 
                          src={exercise.thumbnailUrl} 
                          alt={exercise.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Play className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge className={getCategoryColor(exercise.category)}>
                        {exercise.category}
                      </Badge>
                      <Badge className={getDifficultyColor(exercise.difficulty)}>
                        {exercise.difficulty}
                      </Badge>
                      <Badge variant="outline">
                        {exercise.targetArea}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Descrição</h3>
                      <p className="text-sm text-gray-600">{exercise.description}</p>
                    </div>
                    {exercise.videoUrl && (
                      <div>
                        <h3 className="font-medium mb-1">Vídeo Demonstrativo</h3>
                        <a 
                          href={exercise.videoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-movebetter-primary hover:underline text-sm"
                        >
                          Assistir no YouTube
                        </a>
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Fechar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredExercises.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <Search className="h-12 w-12 text-gray-300 mb-4" />
          <p className="text-lg font-medium text-gray-500">Nenhum exercício encontrado</p>
          <p className="text-sm text-gray-400">Tente ajustar sua busca ou filtros</p>
        </div>
      )}
    </div>
  );
}
