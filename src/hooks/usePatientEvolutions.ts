
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Evolution {
  id: string;
  patient_id: string;
  medical_record_id: string;
  queixas_relatos: string;
  conduta_atendimento: string;
  observacoes?: string;
  progress_score: number;
  previous_score?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function usePatientEvolutions(patientId?: string) {
  const [evolutions, setEvolutions] = useState<Evolution[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvolutions = async () => {
    if (!patientId) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('patient_evolutions')
        .select('*')
        .eq('patient_id', patientId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching evolutions:', error);
        toast.error("Erro ao carregar evoluções");
        return;
      }

      setEvolutions(data || []);
    } catch (error) {
      console.error('Error in fetchEvolutions:', error);
      toast.error("Erro inesperado ao carregar evoluções");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvolutions();
  }, [patientId]);

  const addEvolution = async (evolutionData: Omit<Evolution, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('patient_evolutions')
        .insert([evolutionData])
        .select()
        .single();

      if (error) {
        console.error('Error adding evolution:', error);
        toast.error("Erro ao adicionar evolução");
        return { success: false, error };
      }

      setEvolutions(prev => [data, ...prev]);
      toast.success("Evolução adicionada com sucesso");
      return { success: true, data };
    } catch (error) {
      console.error('Error in addEvolution:', error);
      toast.error("Erro inesperado ao adicionar evolução");
      return { success: false, error };
    }
  };

  const updateEvolution = async (evolutionId: string, updates: Partial<Evolution>) => {
    try {
      const { data, error } = await supabase
        .from('patient_evolutions')
        .update(updates)
        .eq('id', evolutionId)
        .select()
        .single();

      if (error) {
        console.error('Error updating evolution:', error);
        toast.error("Erro ao atualizar evolução");
        return { success: false, error };
      }

      setEvolutions(prev => prev.map(e => e.id === evolutionId ? data : e));
      toast.success("Evolução atualizada com sucesso");
      return { success: true, data };
    } catch (error) {
      console.error('Error in updateEvolution:', error);
      toast.error("Erro inesperado ao atualizar evolução");
      return { success: false, error };
    }
  };

  const closeEvolution = async (evolutionId: string) => {
    try {
      const { data, error } = await supabase
        .from('patient_evolutions')
        .update({ is_active: false })
        .eq('id', evolutionId)
        .select()
        .single();

      if (error) {
        console.error('Error closing evolution:', error);
        toast.error("Erro ao encerrar evolução");
        return { success: false, error };
      }

      setEvolutions(prev => prev.filter(e => e.id !== evolutionId));
      toast.success("Evolução encerrada com sucesso");
      return { success: true, data };
    } catch (error) {
      console.error('Error in closeEvolution:', error);
      toast.error("Erro inesperado ao encerrar evolução");
      return { success: false, error };
    }
  };

  return {
    evolutions,
    isLoading,
    fetchEvolutions,
    addEvolution,
    updateEvolution,
    closeEvolution,
  };
}
