
import { useState, useEffect, useCallback, useRef } from 'react';
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
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);

  const fetchTreatmentPlans = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchTreatmentPlans();

    // Only create subscription if not already subscribed
    if (!isSubscribedRef.current) {
      const channelName = `treatment_plans_changes_${Date.now()}`;
      
      channelRef.current = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'treatment_plans'
          },
          async (payload) => {
            console.log('New treatment plan inserted:', payload);
            
            // Fetch the new plan with patient data
            const { data: newPlan } = await supabase
              .from('treatment_plans')
              .select(`
                *,
                patients (name)
              `)
              .eq('id', payload.new.id)
              .single();

            if (newPlan) {
              setTreatmentPlans(prev => [newPlan, ...prev]);
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'treatment_plans'
          },
          async (payload) => {
            console.log('Treatment plan updated:', payload);
            
            // Fetch the updated plan with patient data
            const { data: updatedPlan } = await supabase
              .from('treatment_plans')
              .select(`
                *,
                patients (name)
              `)
              .eq('id', payload.new.id)
              .single();

            if (updatedPlan) {
              setTreatmentPlans(prev => 
                prev.map(plan => plan.id === updatedPlan.id ? updatedPlan : plan)
              );
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'treatment_plans'
          },
          (payload) => {
            console.log('Treatment plan deleted:', payload);
            setTreatmentPlans(prev => prev.filter(plan => plan.id !== payload.old.id));
          }
        );

      channelRef.current.subscribe((status: string) => {
        if (status === 'SUBSCRIBED') {
          isSubscribedRef.current = true;
          console.log('Successfully subscribed to treatment plans changes');
        }
      });
    }

    return () => {
      if (channelRef.current && isSubscribedRef.current) {
        console.log('Cleaning up treatment plans subscription');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        isSubscribedRef.current = false;
      }
    };
  }, [fetchTreatmentPlans]);

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
