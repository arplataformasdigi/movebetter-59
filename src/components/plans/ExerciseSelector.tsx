
import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Clock, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Exercise {
  id: string;
  name: string;
  description?: string;
  instructions?: string;
  category?: string;
  difficulty_level?: number;
  duration_minutes?: number;
}

interface ExerciseSelectorProps {
  exercises: Exercise[];
  selectedExerciseId: string;
  onExerciseSelect: (exerciseId: string) => void;
}

export function ExerciseSelector({ exercises, selectedExerciseId, onExerciseSelect }: ExerciseSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  const filteredExercises = useMemo(() => {
    return exercises.filter(exercise => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           exercise.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = difficultyFilter === "all" || 
                               exercise.difficulty_level?.toString() === difficultyFilter;
      
      return matchesSearch && matchesDifficulty;
    });
  }, [exercises, searchTerm, difficultyFilter]);

  const selectedExercise = exercises.find(ex => ex.id === selectedExerciseId);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Label>Buscar Exercício</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Digite o nome do exercício..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div>
        <Label>Dificuldade</Label>
        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Todas as dificuldades" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as dificuldades</SelectItem>
            <SelectItem value="1">Nível 1</SelectItem>
            <SelectItem value="2">Nível 2</SelectItem>
            <SelectItem value="3">Nível 3</SelectItem>
            <SelectItem value="4">Nível 4</SelectItem>
            <SelectItem value="5">Nível 5</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="max-h-60 overflow-y-auto space-y-2">
        <Label>Exercícios Disponíveis ({filteredExercises.length})</Label>
        {filteredExercises.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Dumbbell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Nenhum exercício encontrado</p>
          </div>
        ) : (
          <div className="grid gap-2">
            {filteredExercises.map((exercise) => (
              <Card 
                key={exercise.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedExerciseId === exercise.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => onExerciseSelect(exercise.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{exercise.name}</h4>
                      {exercise.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {exercise.description}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 ml-3">
                      {exercise.difficulty_level && (
                        <Badge variant="secondary" className="text-xs">
                          Nível {exercise.difficulty_level}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {exercise.duration_minutes && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {exercise.duration_minutes} min
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {selectedExercise && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Dumbbell className="h-4 w-4" />
              {selectedExercise.name}
              <Badge className="ml-auto">Selecionado</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {selectedExercise.description && (
              <CardDescription>{selectedExercise.description}</CardDescription>
            )}
            {selectedExercise.instructions && (
              <div className="p-2 bg-white rounded text-sm">
                <strong>Instruções:</strong> {selectedExercise.instructions}
              </div>
            )}
            <div className="flex gap-4 text-sm">
              {selectedExercise.difficulty_level && (
                <span>Nível: {selectedExercise.difficulty_level}/5</span>
              )}
              {selectedExercise.duration_minutes && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {selectedExercise.duration_minutes} min
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
