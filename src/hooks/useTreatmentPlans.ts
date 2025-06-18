
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TreatmentPlan {
  id: string;
  name: string;
  description?: string;
  patient_id?: string;
  plan_type_id?: string;
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
  plan_types?: {
    name: string;
  };
}

export interface PlanType {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export function useTreatmentPlans() {
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>([]);
  const [planTypes, setPlanTypes] = useState<PlanType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchTreatmentPlans = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('treatment_plans')
        .select(`
          *,
          patients (name),
          plan_types (name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching treatment plans:', error);
        toast({
          title: "Erro ao carregar trilhas",
          description: "Não foi possível carregar as trilhas de tratamento",
          variant: "destructive",
        });
        return;
      }

      setTreatmentPlans(data || []);
    } catch (error) {
      console.error('Error in fetchTreatmentPlans:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao carregar as trilhas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPlanTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('plan_types')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Error fetching plan types:', error);
        return;
      }

      setPlanTypes(data || []);
    } catch (error) {
      console.error('Error in fetchPlanTypes:', error);
    }
  };

  useEffect(() => {
    fetchTreatmentPlans();
    fetchPlanTypes();
  }, []);

  const addTreatmentPlan = async (planData: Omit<TreatmentPlan, 'id' | 'created_at' | 'updated_at' | 'patients' | 'plan_types'>) => {
    try {
      const { data, error } = await supabase
        .from('treatment_plans')
        .insert([planData])
        .select(`
          *,
          patients (name),
          plan_types (name)
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
          patients (name),
          plan_types (name)
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

  const addPlanType = async (planTypeData: Omit<PlanType, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('plan_types')
        .insert([planTypeData])
        .select()
        .single();

      if (error) {
        console.error('Error adding plan type:', error);
        toast({
          title: "Erro ao adicionar tipo de trilha",
          description: "Não foi possível adicionar o tipo de trilha",
          variant: "destructive",
        });
        return { success: false, error };
      }

      setPlanTypes(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      toast({
        title: "Tipo de trilha adicionado",
        description: "Tipo de trilha foi adicionado com sucesso",
      });
      return { success: true, data };
    } catch (error) {
      console.error('Error in addPlanType:', error);
      return { success: false, error };
    }
  };

  return {
    treatmentPlans,
    planTypes,
    isLoading,
    fetchTreatmentPlans,
    fetchPlanTypes,
    addTreatmentPlan,
    updateTreatmentPlan,
    deleteTreatmentPlan,
    addPlanType,
  };
}
