
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TreatmentPlan {
  id: string;
  name: string;
  description?: string;
  patient_id?: string;
  start_date?: string;
  end_date?: string;
  progress_percentage: number;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
  patients?: {
    name: string;
  };
}

export function useTreatmentPlans() {
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTreatmentPlans = async () => {
    try {
      console.log('Fetching treatment plans from Supabase...');
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('treatment_plans')
        .select(`
          *,
          patients (name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching treatment plans:', error);
        toast.error("Erro ao carregar trilhas: " + error.message);
        return;
      }

      console.log('Treatment plans fetched successfully:', data);
      setTreatmentPlans(data || []);
      
      if (data?.length === 0) {
        console.log('No treatment plans found in database');
      }
    } catch (error) {
      console.error('Error in fetchTreatmentPlans:', error);
      toast.error("Erro inesperado ao carregar as trilhas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTreatmentPlans();
  }, []);

  const addTreatmentPlan = async (planData: Omit<TreatmentPlan, 'id' | 'created_at' | 'updated_at' | 'patients'>) => {
    try {
      console.log('Adding treatment plan:', planData);
      
      const { data, error } = await supabase
        .from('treatment_plans')
        .insert([planData])
        .select(`
          *,
          patients (name)
        `)
        .single();

      if (error) {
        console.error('Error adding treatment plan:', error);
        toast.error("Erro ao adicionar trilha: " + error.message);
        return { success: false, error };
      }

      console.log('Treatment plan added successfully:', data);
      setTreatmentPlans(prev => [data, ...prev]);
      toast.success("Trilha adicionada com sucesso");
      return { success: true, data };
    } catch (error) {
      console.error('Error in addTreatmentPlan:', error);
      toast.error("Erro inesperado ao adicionar trilha");
      return { success: false, error };
    }
  };

  const updateTreatmentPlan = async (id: string, updates: Partial<TreatmentPlan>) => {
    try {
      console.log('Updating treatment plan:', id, updates);
      
      const { data, error } = await supabase
        .from('treatment_plans')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          patients (name)
        `)
        .single();

      if (error) {
        console.error('Error updating treatment plan:', error);
        toast.error("Erro ao atualizar trilha: " + error.message);
        return { success: false, error };
      }

      console.log('Treatment plan updated successfully:', data);
      setTreatmentPlans(prev => prev.map(p => p.id === id ? data : p));
      toast.success("Trilha atualizada com sucesso");
      return { success: true, data };
    } catch (error) {
      console.error('Error in updateTreatmentPlan:', error);
      toast.error("Erro inesperado ao atualizar trilha");
      return { success: false, error };
    }
  };

  const deleteTreatmentPlan = async (id: string) => {
    try {
      console.log('Deleting treatment plan:', id);
      
      // First delete related plan exercises
      const { error: exercisesError } = await supabase
        .from('plan_exercises')
        .delete()
        .eq('treatment_plan_id', id);

      if (exercisesError) {
        console.error('Error deleting plan exercises:', exercisesError);
        toast.error("Erro ao deletar exercícios da trilha: " + exercisesError.message);
        return { success: false, error: exercisesError };
      }

      // Then delete the treatment plan
      const { error } = await supabase
        .from('treatment_plans')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting treatment plan:', error);
        toast.error("Erro ao deletar trilha: " + error.message);
        return { success: false, error };
      }

      console.log('Treatment plan deleted successfully');
      setTreatmentPlans(prev => prev.filter(p => p.id !== id));
      toast.success("Trilha removida com sucesso");
      return { success: true };
    } catch (error) {
      console.error('Error in deleteTreatmentPlan:', error);
      toast.error("Erro inesperado ao deletar trilha");
      return { success: false, error };
    }
  };

  return {
    treatmentPlans,
    isLoading,
    fetchTreatmentPlans,
    addTreatmentPlan,
    updateTreatmentPlan,
    deleteTreatmentPlan,
  };
}
