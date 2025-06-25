
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PlanExercise {
  id: string;
  treatment_plan_id: string;
  exercise_id: string;
  day_number: number;
  sets: number;
  repetitions: number;
  duration_minutes?: number;
  notes?: string;
  is_completed: boolean;
  completed_at?: string;
  created_at: string;
  exercises?: {
    name: string;
    description?: string;
    instructions?: string;
    image_url?: string;
  };
}

export function usePlanExercisesRealtime(planId?: string) {
  const [planExercises, setPlanExercises] = useState<PlanExercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const channelRef = useRef<any>(null);

  const fetchPlanExercises = async () => {
    if (!planId) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('plan_exercises')
        .select(`
          *,
          exercises (
            name,
            description,
            instructions,
            image_url
          )
        `)
        .eq('treatment_plan_id', planId)
        .order('day_number', { ascending: true });

      if (error) {
        console.error('Error fetching plan exercises:', error);
        toast.error("Erro ao carregar exercícios da trilha");
        return;
      }

      setPlanExercises(data || []);
    } catch (error) {
      console.error('Error in fetchPlanExercises:', error);
      toast.error("Erro inesperado ao carregar exercícios");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanExercises();

    if (planId) {
      // Cleanup previous channel if it exists
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      // Setup realtime subscription
      const channelName = `plan_exercises_${planId}_${Date.now()}`;
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'plan_exercises',
            filter: `treatment_plan_id=eq.${planId}`
          },
          async (payload) => {
            console.log('New plan exercise:', payload);
            
            // Fetch the complete exercise with relations
            const { data: newExercise } = await supabase
              .from('plan_exercises')
              .select(`
                *,
                exercises (
                  name,
                  description,
                  instructions,
                  image_url
                )
              `)
              .eq('id', payload.new.id)
              .single();

            if (newExercise) {
              setPlanExercises(prev => [...prev, newExercise].sort((a, b) => a.day_number - b.day_number));
              toast.success("Exercício adicionado à trilha!");
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'plan_exercises',
            filter: `treatment_plan_id=eq.${planId}`
          },
          async (payload) => {
            console.log('Updated plan exercise:', payload);
            
            // Fetch the updated exercise with relations
            const { data: updatedExercise } = await supabase
              .from('plan_exercises')
              .select(`
                *,
                exercises (
                  name,
                  description,
                  instructions,
                  image_url
                )
              `)
              .eq('id', payload.new.id)
              .single();

            if (updatedExercise) {
              setPlanExercises(prev => prev.map(ex => 
                ex.id === updatedExercise.id ? updatedExercise : ex
              ));
              
              if (payload.new.is_completed && !payload.old.is_completed) {
                toast.success("Exercício marcado como concluído!");
              }
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'plan_exercises',
            filter: `treatment_plan_id=eq.${planId}`
          },
          (payload) => {
            console.log('Deleted plan exercise:', payload);
            setPlanExercises(prev => prev.filter(ex => ex.id !== payload.old.id));
            toast.info("Exercício removido da trilha!");
          }
        )
        .subscribe();

      channelRef.current = channel;

      return () => {
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }
      };
    }
  }, [planId]);

  const toggleExerciseCompletion = async (exerciseId: string, isCompleted: boolean) => {
    try {
      const { data, error } = await supabase
        .from('plan_exercises')
        .update({ 
          is_completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null
        })
        .eq('id', exerciseId)
        .select()
        .single();

      if (error) {
        console.error('Error updating exercise completion:', error);
        toast.error("Erro ao atualizar exercício");
        return { success: false, error };
      }

      console.log('Exercise completion updated successfully:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Error in toggleExerciseCompletion:', error);
      toast.error("Erro inesperado ao atualizar exercício");
      return { success: false, error };
    }
  };

  return {
    planExercises,
    setPlanExercises,
    isLoading,
    fetchPlanExercises,
    toggleExerciseCompletion,
  };
}
