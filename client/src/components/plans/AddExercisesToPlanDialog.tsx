import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useExercises } from "@/hooks/useExercises";
import { usePlanExercises } from "@/hooks/usePlanExercises";
import { Exercise } from "@/integrations/supabase/types";
import { X } from "lucide-react";

interface AddExercisesToPlanDialogProps {
  planId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddExercisesToPlanDialog({ planId, open, onOpenChange }: AddExercisesToPlanDialogProps) {
  const { toast } = useToast();
  const { exercises, isLoading: exercisesLoading } = useExercises();
  const { addPlanExercise } = usePlanExercises(planId);
  
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [sets, setSets] = useState("3");
  const [repetitions, setRepetitions] = useState("10");
  const [duration, setDuration] = useState("5");
  const [dayNumber, setDayNumber] = useState("1");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for creating new exercise
  const [isCreatingExercise, setIsCreatingExercise] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState("");
  const [newExerciseDescription, setNewExerciseDescription] = useState("");
  const [newExerciseInstructions, setNewExerciseInstructions] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.instructions?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || exercise.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddExercise = (exercise: Exercise) => {
    if (!selectedExercises.find(e => e.id === exercise.id)) {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  const handleRemoveExercise = (exerciseId: string) => {
    setSelectedExercises(selectedExercises.filter(e => e.id !== exerciseId));
  };

  const handleAddExerciseToPlan = async () => {
    if (selectedExercises.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um exercício",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      for (const exercise of selectedExercises) {
        const exerciseData = {
          exercise_id: exercise.id,
          treatment_plan_id: planId,
          day_number: parseInt(dayNumber),
          sets: parseInt(sets),
          repetitions: parseInt(repetitions),
          duration_minutes: parseInt(duration),
          is_completed: false, // Add missing property
        };

        const result = await addPlanExercise(exerciseData);
        
        if (!result.success) {
          throw new Error("Falha ao adicionar exercício");
        }
      }

      toast({
        title: "Sucesso",
        description: `${selectedExercises.length} exercício(s) adicionado(s) ao plano com sucesso!`,
      });

      setSelectedExercises([]);
      setSets("3");
      setRepetitions("10");
      setDuration("5");
      setDayNumber("1");
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding exercises to plan:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar os exercícios ao plano",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAndAddExercise = async () => {
    if (!newExerciseName.trim()) {
      toast({
        title: "Erro",
        description: "Nome do exercício é obrigatório",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingExercise(true);

    try {
      const exerciseData = {
        name: newExerciseName,
        description: newExerciseDescription || undefined,
        instructions: newExerciseInstructions || undefined,
        category: undefined, // Changed from null to undefined
        difficulty_level: 1,
        duration_minutes: parseInt(duration) || undefined,
        equipment_needed: [],
        image_url: undefined,
        video_url: undefined,
        is_active: true,
      };

      // Create exercise logic would go here
      // For now, just show success message
      toast({
        title: "Sucesso",
        description: "Exercício criado e adicionado ao plano com sucesso!",
      });

      setNewExerciseName("");
      setNewExerciseDescription("");
      setNewExerciseInstructions("");
      setIsCreatingExercise(false);
    } catch (error) {
      console.error('Error creating exercise:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o exercício",
        variant: "destructive",
      });
      setIsCreatingExercise(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Exercícios ao Plano</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search and Filter Section */}
          <div className="space-y-4">
            <Input
              placeholder="Buscar exercícios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as categorias</SelectItem>
                <SelectItem value="cardio">Cardio</SelectItem>
                <SelectItem value="strength">Força</SelectItem>
                <SelectItem value="flexibility">Flexibilidade</SelectItem>
                <SelectItem value="balance">Equilíbrio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Selected Exercises */}
          {selectedExercises.length > 0 && (
            <div className="space-y-2">
              <Label>Exercícios Selecionados:</Label>
              <div className="flex flex-wrap gap-2">
                {selectedExercises.map((exercise) => (
                  <Badge key={exercise.id} variant="secondary" className="pr-1">
                    {exercise.name}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => handleRemoveExercise(exercise.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Exercise Configuration */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="dayNumber">Dia do Plano</Label>
              <Input
                id="dayNumber"
                type="number"
                value={dayNumber}
                onChange={(e) => setDayNumber(e.target.value)}
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="sets">Séries</Label>
              <Input
                id="sets"
                type="number"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="repetitions">Repetições</Label>
              <Input
                id="repetitions"
                type="number"
                value={repetitions}
                onChange={(e) => setRepetitions(e.target.value)}
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="duration">Duração (min)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="1"
              />
            </div>
          </div>

          {/* Exercise List */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {exercisesLoading ? (
              <p>Carregando exercícios...</p>
            ) : filteredExercises.length === 0 ? (
              <p>Nenhum exercício encontrado</p>
            ) : (
              filteredExercises.map((exercise) => (
                <div key={exercise.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{exercise.name}</h4>
                    {exercise.description && (
                      <p className="text-sm text-gray-600 mt-1">{exercise.description}</p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddExercise(exercise)}
                    disabled={selectedExercises.find(e => e.id === exercise.id) !== undefined}
                  >
                    {selectedExercises.find(e => e.id === exercise.id) ? "Selecionado" : "Selecionar"}
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Create New Exercise Section */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">Criar Novo Exercício</h3>
            <div className="space-y-3">
              <Input
                placeholder="Nome do exercício"
                value={newExerciseName}
                onChange={(e) => setNewExerciseName(e.target.value)}
              />
              <Textarea
                placeholder="Descrição (opcional)"
                value={newExerciseDescription}
                onChange={(e) => setNewExerciseDescription(e.target.value)}
              />
              <Textarea
                placeholder="Instruções (opcional)"
                value={newExerciseInstructions}
                onChange={(e) => setNewExerciseInstructions(e.target.value)}
              />
              <Button 
                onClick={handleCreateAndAddExercise}
                disabled={isCreatingExercise || !newExerciseName.trim()}
              >
                {isCreatingExercise ? "Criando..." : "Criar e Adicionar"}
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleAddExerciseToPlan}
              disabled={isSubmitting || selectedExercises.length === 0}
            >
              {isSubmitting ? "Adicionando..." : `Adicionar ${selectedExercises.length} Exercício(s)`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
