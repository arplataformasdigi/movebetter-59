
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const fetchTreatmentPlans = async () => {
    try {
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
        return;
      }

      setTreatmentPlans(data || []);
    } catch (error) {
      console.error('Error in fetchTreatmentPlans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTreatmentPlans();
  }, []);

  const addTreatmentPlan = async (planData: Omit<TreatmentPlan, 'id' | 'created_at' | 'updated_at' | 'patients'>) => {
    try {
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
        toast({
          title: "Erro ao adicionar trilha",
          description: "Não foi possível adicionar a trilha de tratamento",
          variant: "destructive",
        });
        return { success: false, error };
      }

      setTreatmentPlans(prev => [data, ...prev]);
      toast({
        title: "Trilha adicionada",
        description: "Trilha de tratamento foi adicionada com sucesso",
      });
      return { success: true, data };
    } catch (error) {
      console.error('Error in addTreatmentPlan:', error);
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
        toast({
          title: "Erro ao atualizar trilha",
          description: "Não foi possível atualizar a trilha de tratamento",
          variant: "destructive",
        });
        return { success: false, error };
      }

      setTreatmentPlans(prev => prev.map(p => p.id === id ? data : p));
      toast({
        title: "Trilha atualizada",
        description: "Trilha de tratamento foi atualizada com sucesso",
      });
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
        toast({
          title: "Erro ao deletar trilha",
          description: "Não foi possível deletar a trilha de tratamento",
          variant: "destructive",
        });
        return { success: false, error };
      }

      setTreatmentPlans(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Trilha removida",
        description: "Trilha de tratamento foi removida com sucesso",
      });
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
    addTreatmentPlan,
    updateTreatmentPlan,
    deleteTreatmentPlan,
  };
}
