
import { useState, useEffect } from 'react';
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

  const fetchPlanExercises = async () => {
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
  };

  useEffect(() => {
    fetchPlanExercises();
  }, [planId]);

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
      setPlanExercises(prev => [...prev, data]);
      toast.success("Exercício adicionado ao plano com sucesso");
      return { success: true, data };
    } catch (error) {
      console.error('Error in addPlanExercise:', error);
      toast.error("Erro inesperado ao adicionar exercício ao plano");
      return { success: false, error };
    }
  };

  return {
    planExercises,
    isLoading,
    fetchPlanExercises,
    addPlanExercise,
  };
}
