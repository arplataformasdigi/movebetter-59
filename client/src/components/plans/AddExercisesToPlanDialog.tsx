import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Search, Plus } from "lucide-react";
import { useExercises } from "@/hooks/useExercises";
import { usePlanExercises } from "@/hooks/usePlanExercises";
import { toast } from "sonner";

interface Exercise {
  id: string;
  name: string;
  description?: string;
  instructions?: string;
  category?: string;
  difficulty_level?: number;
  duration_minutes?: number;
  equipment_needed?: string[];
  image_url?: string;
  video_url?: string;
  is_active?: boolean;
  created_at?: string;
}

interface AddExercisesToPlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string | null;
  onExercisesAdded?: () => void;
}

interface ExerciseFormData {
  name: string;
  description: string;
  instructions: string;
  category?: string;
  difficulty_level: number;
  duration_minutes?: number;
  equipment_needed: string[];
  image_url?: string;
  video_url?: string;
  is_active: boolean;
}

export function AddExercisesToPlanDialog({
  isOpen,
  onClose,
  planId,
  onExercisesAdded,
}: AddExercisesToPlanDialogProps) {
  const { exercises, isLoading, addExercise } = useExercises();
  const { addExerciseToPlan } = usePlanExercises(planId || "");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for creating new exercise
  const [newExercise, setNewExercise] = useState<ExerciseFormData>({
    name: "",
    description: "",
    instructions: "",
    category: undefined,
    difficulty_level: 1,
    duration_minutes: undefined,
    equipment_needed: [],
    image_url: undefined,
    video_url: undefined,
    is_active: true,
  });

  const handleCreateExercise = async () => {
    if (!newExercise.name.trim()) {
      toast.error("Nome do exercício é obrigatório");
      return;
    }

    setIsSubmitting(true);

    try {
      const exerciseData = {
        name: newExercise.name,
        description: newExercise.description || undefined,
        instructions: newExercise.instructions || undefined,
        category: null,
        difficulty_level: newExercise.difficulty_level,
        duration_minutes: newExercise.duration_minutes || undefined,
        equipment_needed: newExercise.equipment_needed,
        image_url: newExercise.image_url || undefined,
        video_url: newExercise.video_url || undefined,
        is_active: newExercise.is_active,
      };

      const result = await addExercise(exerciseData);
      
      if (result.success) {
        toast.success("Exercício criado com sucesso!");
        setShowCreateForm(false);
        setNewExercise({
          name: "",
          description: "",
          instructions: "",
          category: undefined,
          difficulty_level: 1,
          duration_minutes: undefined,
          equipment_needed: [],
          image_url: undefined,
          video_url: undefined,
          is_active: true,
        });
      }
    } catch (error) {
      console.error("Error creating exercise:", error);
      toast.error("Erro ao criar exercício");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExerciseToggle = (exerciseId: string) => {
    setSelectedExercises(prev => 
      prev.includes(exerciseId) 
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const handleAddToTreatmentPlan = async () => {
    if (!planId || selectedExercises.length === 0) return;

    setIsSubmitting(true);

    try {
      for (const exerciseId of selectedExercises) {
        await addExerciseToPlan({
          exercise_id: exerciseId,
          day_number: 1, // Default day
          sets: 3,
          repetitions: 10,
          duration_minutes: 30,
        });
      }

      toast.success(`${selectedExercises.length} exercício(s) adicionado(s) ao plano!`);
      setSelectedExercises([]);
      onExercisesAdded?.();
      onClose();
    } catch (error) {
      console.error("Error adding exercises to plan:", error);
      toast.error("Erro ao adicionar exercícios ao plano");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEquipmentAdd = (equipment: string) => {
    if (equipment.trim() && !newExercise.equipment_needed.includes(equipment.trim())) {
      setNewExercise(prev => ({
        ...prev,
        equipment_needed: [...prev.equipment_needed, equipment.trim()]
      }));
    }
  };

  const handleEquipmentRemove = (equipment: string) => {
    setNewExercise(prev => ({
      ...prev,
      equipment_needed: prev.equipment_needed.filter(item => item !== equipment)
    }));
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Exercícios ao Plano</DialogTitle>
          <DialogDescription>
            Selecione exercícios existentes ou crie novos para adicionar ao plano de tratamento.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search and Create Button */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar exercícios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Novo
            </Button>
          </div>

          {/* Create Exercise Form */}
          {showCreateForm && (
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-medium">Criar Novo Exercício</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="exercise-name">Nome *</Label>
                    <Input
                      id="exercise-name"
                      value={newExercise.name}
                      onChange={(e) => setNewExercise(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nome do exercício"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="difficulty">Dificuldade (1-5)</Label>
                    <Input
                      id="difficulty"
                      type="number"
                      min="1"
                      max="5"
                      value={newExercise.difficulty_level}
                      onChange={(e) => setNewExercise(prev => ({ ...prev, difficulty_level: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="exercise-description">Descrição</Label>
                  <Textarea
                    id="exercise-description"
                    value={newExercise.description}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descrição do exercício"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="exercise-instructions">Instruções</Label>
                  <Textarea
                    id="exercise-instructions"
                    value={newExercise.instructions}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, instructions: e.target.value }))}
                    placeholder="Como executar o exercício"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleCreateExercise}
                    disabled={isSubmitting || !newExercise.name.trim()}
                  >
                    {isSubmitting ? "Criando..." : "Criar Exercício"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Exercise List */}
          <div className="space-y-2">
            <h3 className="font-medium">
              Exercícios Disponíveis ({filteredExercises.length})
            </h3>
            
            {isLoading ? (
              <p>Carregando exercícios...</p>
            ) : filteredExercises.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Nenhum exercício encontrado
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredExercises.map((exercise) => (
                  <Card key={exercise.id} className="p-3">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedExercises.includes(exercise.id)}
                        onCheckedChange={() => handleExerciseToggle(exercise.id)}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{exercise.name}</h4>
                        {exercise.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {exercise.description}
                          </p>
                        )}
                        <div className="flex gap-2 mt-2">
                          {exercise.difficulty_level && (
                            <Badge variant="outline">
                              Nível {exercise.difficulty_level}
                            </Badge>
                          )}
                          {exercise.duration_minutes && (
                            <Badge variant="outline">
                              {exercise.duration_minutes} min
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleAddToTreatmentPlan}
            disabled={selectedExercises.length === 0 || isSubmitting}
          >
            {isSubmitting ? "Adicionando..." : `Adicionar ${selectedExercises.length} Exercício(s)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
