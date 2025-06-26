
import React, { useState } from "react";
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
import { X } from "lucide-react";
import { useExercises } from "@/hooks/useExercises";
import { usePlanExercises } from "@/hooks/usePlanExercises";
import { toast } from "sonner";

interface CreateExerciseForPlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string | null;
  onExerciseCreated?: () => void;
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

export function CreateExerciseForPlanDialog({
  isOpen,
  onClose,
  planId,
  onExerciseCreated,
}: CreateExerciseForPlanDialogProps) {
  const { addExercise } = useExercises();
  const { addExerciseToPlan } = usePlanExercises(planId || "");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newEquipment, setNewEquipment] = useState("");

  const [formData, setFormData] = useState<ExerciseFormData>({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Nome do exercício é obrigatório");
      return;
    }

    if (!planId) {
      toast.error("ID do plano não encontrado");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create exercise
      const exerciseData = {
        name: formData.name,
        description: formData.description || undefined,
        instructions: formData.instructions || undefined,
        category: null,
        difficulty_level: formData.difficulty_level,
        duration_minutes: formData.duration_minutes || undefined,
        equipment_needed: formData.equipment_needed,
        image_url: formData.image_url || undefined,
        video_url: formData.video_url || undefined,
        is_active: formData.is_active,
      };

      const exerciseResult = await addExercise(exerciseData);
      
      if (!exerciseResult.success) {
        toast.error("Erro ao criar exercício");
        return;
      }

      // Add exercise to plan
      await addExerciseToPlan({
        exercise_id: exerciseResult.data.id,
        day_number: 1, // Default day
        sets: 3,
        repetitions: 10,
        duration_minutes: formData.duration_minutes || 30,
      });

      toast.success("Exercício criado e adicionado ao plano com sucesso!");
      
      // Reset form
      setFormData({
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

      onExerciseCreated?.();
      onClose();
    } catch (error) {
      console.error("Error creating exercise:", error);
      toast.error("Erro ao criar exercício");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddEquipment = () => {
    if (newEquipment.trim() && !formData.equipment_needed.includes(newEquipment.trim())) {
      setFormData(prev => ({
        ...prev,
        equipment_needed: [...prev.equipment_needed, newEquipment.trim()]
      }));
      setNewEquipment("");
    }
  };

  const handleRemoveEquipment = (equipment: string) => {
    setFormData(prev => ({
      ...prev,
      equipment_needed: prev.equipment_needed.filter(item => item !== equipment)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEquipment();
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Exercício</DialogTitle>
          <DialogDescription>
            Crie um novo exercício e adicione-o diretamente ao plano de tratamento.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome do Exercício *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Agachamento com apoio"
                required
              />
            </div>

            <div>
              <Label htmlFor="difficulty">Nível de Dificuldade (1-5)</Label>
              <Input
                id="difficulty"
                type="number"
                min="1"
                max="5"
                value={formData.difficulty_level}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  difficulty_level: parseInt(e.target.value) || 1 
                }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Breve descrição do exercício..."
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="instructions">Instruções de Execução</Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
              placeholder="Como executar o exercício passo a passo..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duração (minutos)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={formData.duration_minutes || ""}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  duration_minutes: e.target.value ? parseInt(e.target.value) : undefined
                }))}
                placeholder="30"
              />
            </div>

            <div>
              <Label htmlFor="video_url">URL do Vídeo</Label>
              <Input
                id="video_url"
                type="url"
                value={formData.video_url || ""}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  video_url: e.target.value || undefined
                }))}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </div>

          <div>
            <Label>Equipamentos Necessários</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={newEquipment}
                onChange={(e) => setNewEquipment(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite um equipamento e pressione Enter"
              />
              <Button type="button" onClick={handleAddEquipment}>
                Adicionar
              </Button>
            </div>
            
            {formData.equipment_needed.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.equipment_needed.map((equipment, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {equipment}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveEquipment(equipment)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.name.trim()}>
              {isSubmitting ? "Criando..." : "Criar e Adicionar ao Plano"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
