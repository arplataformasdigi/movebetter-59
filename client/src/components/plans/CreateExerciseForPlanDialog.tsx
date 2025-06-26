
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useExercises } from "@/hooks/useExercises";
import { usePlanExercises } from "@/hooks/usePlanExercises";

interface CreateExerciseForPlanDialogProps {
  planId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateExerciseForPlanDialog({ planId, open, onOpenChange }: CreateExerciseForPlanDialogProps) {
  const { toast } = useToast();
  const { addExercise } = useExercises();
  const { addPlanExercise } = usePlanExercises(planId);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    instructions: "",
    category: "",
    difficulty_level: 1,
    duration_minutes: 5,
    equipment_needed: [] as string[],
    image_url: "",
    video_url: "",
    sets: 3,
    repetitions: 10,
    dayNumber: 1,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome do exercício é obrigatório",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // First create the exercise
      const exerciseData = {
        name: formData.name,
        description: formData.description || undefined,
        instructions: formData.instructions || undefined,
        category: undefined, // Changed from null to undefined
        difficulty_level: formData.difficulty_level,
        duration_minutes: formData.duration_minutes || undefined,
        equipment_needed: formData.equipment_needed,
        image_url: formData.image_url || undefined,
        video_url: formData.video_url || undefined,
        is_active: true,
      };

      const exerciseResult = await addExercise(exerciseData);
      
      if (!exerciseResult.success) {
        throw new Error("Falha ao criar exercício");
      }

      // Then add it to the plan
      const planExerciseData = {
        exercise_id: exerciseResult.data.id,
        treatment_plan_id: planId,
        day_number: formData.dayNumber,
        sets: formData.sets,
        repetitions: formData.repetitions,
        duration_minutes: formData.duration_minutes,
        is_completed: false, // Add missing property
      };

      const planResult = await addPlanExercise(planExerciseData);
      
      if (!planResult.success) {
        throw new Error("Falha ao adicionar exercício ao plano");
      }

      toast({
        title: "Sucesso",
        description: "Exercício criado e adicionado ao plano com sucesso!",
      });

      // Reset form
      setFormData({
        name: "",
        description: "",
        instructions: "",
        category: "",
        difficulty_level: 1,
        duration_minutes: 5,
        equipment_needed: [],
        image_url: "",
        video_url: "",
        sets: 3,
        repetitions: 10,
        dayNumber: 1,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating exercise for plan:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o exercício para o plano",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Exercício para o Plano</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Basic Exercise Info */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="name">Nome do Exercício *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Digite o nome do exercício"
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Descreva o exercício"
              />
            </div>

            <div>
              <Label htmlFor="instructions">Instruções</Label>
              <Textarea
                id="instructions"
                value={formData.instructions}
                onChange={(e) => handleInputChange("instructions", e.target.value)}
                placeholder="Como executar o exercício"
              />
            </div>
          </div>

          {/* Exercise Configuration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cardio">Cardio</SelectItem>
                  <SelectItem value="strength">Força</SelectItem>
                  <SelectItem value="flexibility">Flexibilidade</SelectItem>
                  <SelectItem value="balance">Equilíbrio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="difficulty">Nível de Dificuldade</Label>
              <Select 
                value={formData.difficulty_level.toString()} 
                onValueChange={(value) => handleInputChange("difficulty_level", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Iniciante</SelectItem>
                  <SelectItem value="2">Intermediário</SelectItem>
                  <SelectItem value="3">Avançado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Plan-specific Configuration */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">Configuração no Plano</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="dayNumber">Dia do Plano</Label>
                <Input
                  id="dayNumber"
                  type="number"
                  value={formData.dayNumber}
                  onChange={(e) => handleInputChange("dayNumber", parseInt(e.target.value))}
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="sets">Séries</Label>
                <Input
                  id="sets"
                  type="number"
                  value={formData.sets}
                  onChange={(e) => handleInputChange("sets", parseInt(e.target.value))}
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="repetitions">Repetições</Label>
                <Input
                  id="repetitions"
                  type="number"
                  value={formData.repetitions}
                  onChange={(e) => handleInputChange("repetitions", parseInt(e.target.value))}
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="duration_minutes">Duração (min)</Label>
                <Input
                  id="duration_minutes"
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => handleInputChange("duration_minutes", parseInt(e.target.value))}
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* Optional Media URLs */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="image_url">URL da Imagem (opcional)</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => handleInputChange("image_url", e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div>
              <Label htmlFor="video_url">URL do Vídeo (opcional)</Label>
              <Input
                id="video_url"
                value={formData.video_url}
                onChange={(e) => handleInputChange("video_url", e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.name.trim()}
            >
              {isSubmitting ? "Criando..." : "Criar e Adicionar ao Plano"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
