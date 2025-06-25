import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export interface TreatmentPlan {
  id: string;
  patient_id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date?: string;
  status: 'active' | 'completed' | 'paused';
  total_exercises?: number;
  completed_exercises?: number;
  progress_percentage?: number;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  patients?: {
    name: string;
  };
}

export function useTreatmentPlansRealtime() {
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const channelRef = useRef<any>(null);

  const fetchTreatmentPlans = async () => {
    try {
      console.log('Fetching treatment plans from Supabase...');
      const { data, error } = await supabase
        .from('treatment_plans')
        .select(`
          *,
          patients (name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching treatment plans:', error);
        toast.error("Erro ao carregar trilhas");
        setTreatmentPlans([]);
      } else {
        console.log('Treatment plans fetched successfully:', data);
        setTreatmentPlans(data || []);
      }
    } catch (error) {
      console.error('Error in fetchTreatmentPlans:', error);
      setTreatmentPlans([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTreatmentPlans();

    // Set up realtime subscription
    const channelName = `treatment_plans_realtime_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    console.log('Setting up treatment plans realtime subscription with channel:', channelName);

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'treatment_plans'
        },
        (payload) => {
          console.log('New treatment plan detected:', payload);
          const newPlan = payload.new as TreatmentPlan;
          setTreatmentPlans(prev => [newPlan, ...prev]);
          toast.success("Nova trilha adicionada!");
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'treatment_plans'
        },
        (payload) => {
          console.log('Updated treatment plan detected:', payload);
          const updatedPlan = payload.new as TreatmentPlan;
          setTreatmentPlans(prev => prev.map(plan => 
            plan.id === updatedPlan.id ? updatedPlan : plan
          ));
          toast.success("Trilha atualizada!");
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
          console.log('Deleted treatment plan detected:', payload);
          const deletedPlan = payload.old as TreatmentPlan;
          setTreatmentPlans(prev => prev.filter(plan => plan.id !== deletedPlan.id));
          toast.info("Trilha removida!");
        }
      )
      .subscribe((status) => {
        console.log('Treatment plans channel subscription status:', status);
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        console.log('Cleaning up treatment plans realtime subscription');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, []);

  const createTreatmentPlan = async (planData: Omit<TreatmentPlan, 'id' | 'created_at' | 'updated_at' | 'patients'>) => {
    try {
      console.log('Creating treatment plan with data:', planData);
      
      const { data, error } = await supabase
        .from('treatment_plans')
        .insert([planData])
        .select(`
          *,
          patients (name)
        `)
        .single();

      if (error) {
        console.error('Error creating treatment plan:', error);
        toast.error("Erro ao criar trilha: " + error.message);
        return { success: false, error };
      }

      console.log('Treatment plan created successfully:', data);
      toast.success("Trilha criada com sucesso!");
      return { success: true, data };
    } catch (error) {
      console.error('Error in createTreatmentPlan:', error);
      toast.error("Erro ao criar trilha");
      return { success: false, error };
    }
  };

  const updateTreatmentPlan = async (id: string, updates: Partial<TreatmentPlan>) => {
    try {
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
        toast.error("Erro ao atualizar trilha");
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error in updateTreatmentPlan:', error);
      return { success: false, error };
    }
  };

  const deleteTreatmentPlan = async (id: string) => {
    try {
      const { error } = await supabase
        .from('treatment_plans')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting treatment plan:', error);
        toast.error("Erro ao excluir trilha");
        return { success: false, error };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in deleteTreatmentPlan:', error);
      return { success: false, error };
    }
  };

  return {
    treatmentPlans,
    isLoading,
    fetchTreatmentPlans,
    createTreatmentPlan,
    updateTreatmentPlan,
    deleteTreatmentPlan,
  };
}