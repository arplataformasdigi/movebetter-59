
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PlanExercise {
  id: string;
  treatment_plan_id: string;
  exercise_id: string;
  day_number: number;
  repetitions?: number;
  sets?: number;
  duration_minutes?: number;
  notes?: string;
  is_completed: boolean;
  completed_at?: string;
  created_at: string;
  exercises?: {
    name: string;
    description?: string;
    instructions?: string;
  };
}

export function usePlanExercises(planId?: string) {
  const [planExercises, setPlanExercises] = useState<PlanExercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPlanExercises = useCallback(async () => {
    if (!planId) {
      setIsLoading(false);
      return;
    }

    try {
      console.log('Fetching plan exercises from Supabase...');
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('plan_exercises')
        .select(`
          *,
          exercises (name, description, instructions)
        `)
        .eq('treatment_plan_id', planId)
        .order('day_number', { ascending: true });

      if (error) {
        console.error('Error fetching plan exercises:', error);
        toast.error("Erro ao carregar exercícios do plano: " + error.message);
        return;
      }

      console.log('Plan exercises fetched successfully:', data);
      setPlanExercises(data || []);
    } catch (error) {
      console.error('Error in fetchPlanExercises:', error);
      toast.error("Erro inesperado ao carregar os exercícios do plano");
    } finally {
      setIsLoading(false);
    }
  }, [planId]);

  useEffect(() => {
    fetchPlanExercises();

    if (!planId) return;

    // Setup realtime subscription for plan exercises
    const channel = supabase
      .channel(`plan_exercises_${planId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'plan_exercises',
          filter: `treatment_plan_id=eq.${planId}`
        },
        async (payload) => {
          console.log('New plan exercise inserted:', payload);
          
          // Fetch the new exercise with exercise data
          const { data: newExercise } = await supabase
            .from('plan_exercises')
            .select(`
              *,
              exercises (name, description, instructions)
            `)
            .eq('id', payload.new.id)
            .single();

          if (newExercise) {
            setPlanExercises(prev => [...prev, newExercise].sort((a, b) => a.day_number - b.day_number));
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
          console.log('Plan exercise updated:', payload);
          
          // Fetch the updated exercise with exercise data
          const { data: updatedExercise } = await supabase
            .from('plan_exercises')
            .select(`
              *,
              exercises (name, description, instructions)
            `)
            .eq('id', payload.new.id)
            .single();

          if (updatedExercise) {
            setPlanExercises(prev => 
              prev.map(ex => ex.id === updatedExercise.id ? updatedExercise : ex)
                  .sort((a, b) => a.day_number - b.day_number)
            );
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
          console.log('Plan exercise deleted:', payload);
          setPlanExercises(prev => prev.filter(ex => ex.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [planId, fetchPlanExercises]);

  const addPlanExercise = async (exerciseData: Omit<PlanExercise, 'id' | 'created_at' | 'exercises'>) => {
    try {
      console.log('Adding plan exercise:', exerciseData);
      
      const { data, error } = await supabase
        .from('plan_exercises')
        .insert([exerciseData])
        .select(`
          *,
          exercises (name, description, instructions)
        `)
        .single();

      if (error) {
        console.error('Error adding plan exercise:', error);
        toast.error("Erro ao adicionar exercício ao plano: " + error.message);
        return { success: false, error };
      }

      console.log('Plan exercise added successfully:', data);
      toast.success("Exercício adicionado ao plano com sucesso");
      return { success: true, data };
    } catch (error) {
      console.error('Error in addPlanExercise:', error);
      toast.error("Erro inesperado ao adicionar exercício ao plano");
      return { success: false, error };
    }
  };

  const removePlanExercise = async (exerciseId: string) => {
    try {
      console.log('Removing plan exercise:', exerciseId);
      
      const { error } = await supabase
        .from('plan_exercises')
        .delete()
        .eq('id', exerciseId);

      if (error) {
        console.error('Error removing plan exercise:', error);
        toast.error("Erro ao remover exercício: " + error.message);
        return { success: false, error };
      }

      console.log('Plan exercise removed successfully');
      toast.success("Exercício removido com sucesso");
      return { success: true };
    } catch (error) {
      console.error('Error in removePlanExercise:', error);
      toast.error("Erro inesperado ao remover exercício");
      return { success: false, error };
    }
  };

  const toggleExerciseCompletion = async (exerciseId: string, isCompleted: boolean) => {
    try {
      console.log('Toggling exercise completion:', exerciseId, isCompleted);
      
      const updateData = {
        is_completed: isCompleted,
        completed_at: isCompleted ? new Date().toISOString() : null,
      };

      const { data, error } = await supabase
        .from('plan_exercises')
        .update(updateData)
        .eq('id', exerciseId)
        .select(`
          *,
          exercises (name, description, instructions)
        `)
        .single();

      if (error) {
        console.error('Error updating exercise completion:', error);
        toast.error("Erro ao atualizar exercício: " + error.message);
        return { success: false, error };
      }

      console.log('Exercise completion updated successfully');
      
      toast.success(isCompleted ? "Exercício marcado como concluído" : "Exercício marcado como pendente");
      return { success: true, data };
    } catch (error) {
      console.error('Error in toggleExerciseCompletion:', error);
      toast.error("Erro inesperado ao atualizar exercício");
      return { success: false, error };
    }
  };

  const updatePlanExercise = async (exerciseId: string, updates: Partial<PlanExercise>) => {
    try {
      console.log('Updating plan exercise:', exerciseId, updates);
      
      const { data, error } = await supabase
        .from('plan_exercises')
        .update(updates)
        .eq('id', exerciseId)
        .select(`
          *,
          exercises (name, description, instructions)
        `)
        .single();

      if (error) {
        console.error('Error updating plan exercise:', error);
        toast.error("Erro ao atualizar exercício: " + error.message);
        return { success: false, error };
      }

      console.log('Plan exercise updated successfully');
      
      toast.success("Exercício atualizado com sucesso");
      return { success: true, data };
    } catch (error) {
      console.error('Error in updatePlanExercise:', error);
      toast.error("Erro inesperado ao atualizar exercício");
      return { success: false, error };
    }
  };

  return {
    planExercises,
    isLoading,
    fetchPlanExercises,
    addPlanExercise,
    removePlanExercise,
    toggleExerciseCompletion,
    updatePlanExercise,
  };
}
