
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useExercises } from "@/hooks/useExercises";
import { usePlanExercises } from "@/hooks/usePlanExercises";
import { Dumbbell, Plus } from "lucide-react";

const exerciseSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter no mínimo 3 caracteres" }),
  difficulty: z.enum(["iniciante", "intermediário", "avançado"], { 
    required_error: "Nível de dificuldade é obrigatório" 
  }),
  targetArea: z.string().min(1, { message: "Área alvo é obrigatória" }),
  description: z.string().min(10, { message: "Descrição deve ter no mínimo 10 caracteres" }),
  videoUrl: z.string().url({ message: "URL de vídeo inválida" }).optional().or(z.literal("")),
  thumbnailUrl: z.string().url({ message: "URL de thumbnail inválida" }).optional().or(z.literal("")),
  dayNumber: z.string().min(1, { message: "Dia da trilha é obrigatório" }),
  sets: z.string().min(1, { message: "Séries é obrigatório" }),
  repetitions: z.string().optional(),
  durationMinutes: z.string().optional(),
  notes: z.string().optional(),
});

type ExerciseFormValues = z.infer<typeof exerciseSchema>;

interface CreateExerciseForPlanDialogProps {
  plan: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateExerciseForPlanDialog({
  plan,
  open,
  onOpenChange,
}: CreateExerciseForPlanDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { addExercise } = useExercises();
  const { addPlanExercise } = usePlanExercises(plan?.id);

  const form = useForm<ExerciseFormValues>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      name: "",
      difficulty: undefined,
      targetArea: "",
      description: "",
      videoUrl: "",
      thumbnailUrl: "",
      dayNumber: "1",
      sets: "3",
      repetitions: "10",
      durationMinutes: "",
      notes: "",
    },
  });

  const handleSubmit = async (data: ExerciseFormValues) => {
    if (!plan?.id) {
      toast.error("Erro: Trilha não encontrada");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Criar o exercício
      const exerciseData = {
        name: data.name,
        description: data.description,
        instructions: data.description,
        category: null,
        difficulty_level: data.difficulty === "iniciante" ? 1 : 
                         data.difficulty === "intermediário" ? 3 : 5,
        duration_minutes: data.durationMinutes ? parseInt(data.durationMinutes) : null,
        equipment_needed: data.targetArea ? [data.targetArea] : [],
        image_url: data.thumbnailUrl || null,
        video_url: data.videoUrl || null,
        is_active: true,
      };

      const exerciseResult = await addExercise(exerciseData);
      
      if (!exerciseResult.success) {
        toast.error("Erro ao criar exercício");
        setIsSubmitting(false);
        return;
      }

      // 2. Adicionar o exercício à trilha
      const planExerciseData = {
        treatment_plan_id: plan.id,
        exercise_id: exerciseResult.data.id,
        day_number: parseInt(data.dayNumber),
        sets: parseInt(data.sets),
        repetitions: data.repetitions ? parseInt(data.repetitions) : undefined,
        duration_minutes: data.durationMinutes ? parseInt(data.durationMinutes) : undefined,
        notes: data.notes || undefined,
        is_completed: false,
      };

      const planResult = await addPlanExercise(planExerciseData);
      
      if (planResult.success) {
        toast.success("Exercício criado e adicionado à trilha com sucesso!");
        form.reset();
        onOpenChange(false);
      } else {
        toast.error("Exercício criado, mas erro ao adicionar à trilha");
      }
    } catch (error) {
      console.error("Erro ao criar exercício:", error);
      toast.error("Erro inesperado ao criar exercício");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset();
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            Criar Exercício para "{plan?.name}"
          </DialogTitle>
          <DialogDescription>
            Crie um novo exercício que será automaticamente adicionado à trilha
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Exercício</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Alongamento de Quadril" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área Alvo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Quadril, Core, Joelhos" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Campos específicos da trilha */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-3 text-blue-600">Configurações da Trilha</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="dayNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dia da Trilha</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sets"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Séries</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="repetitions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Repetições</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" placeholder="Ex: 10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="durationMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duração (min)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" placeholder="Ex: 5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nível de Dificuldade</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a dificuldade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
                      <SelectItem value="iniciante">Iniciante</SelectItem>
                      <SelectItem value="intermediário">Intermediário</SelectItem>
                      <SelectItem value="avançado">Avançado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição/Instruções</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva como realizar o exercício corretamente..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações da Trilha</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Instruções específicas para este paciente..."
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL do Vídeo (YouTube)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://www.youtube.com/watch?v=..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thumbnailUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da Imagem</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} className="min-w-[150px]">
                {isSubmitting ? "Criando..." : "Criar e Adicionar à Trilha"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
