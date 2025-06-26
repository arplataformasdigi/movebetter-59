
import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Evolution {
  id: string;
  patient_id: string;
  medical_record_id: string;
  queixas_relatos: string;
  conduta_atendimento: string;
  observacoes?: string;
  progress_score: number;
  previous_score?: number;
  is_active?: boolean;
  created_at: string;
  updated_at?: string;
}

export function usePatientEvolutions(patientId: string) {
  const [evolutions, setEvolutions] = useState<Evolution[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvolutions = useCallback(async () => {
    if (!patientId) return;
    
    setIsLoading(true);
    console.log('Fetching evolutions for patient:', patientId);

    try {
      const { data: evolutionsData, error: evolutionsError } = await supabase
        .from('patient_evolutions')
        .select('*')
        .eq('patient_id', patientId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (evolutionsError) {
        console.error('Error fetching evolutions:', evolutionsError);
        toast.error('Erro ao buscar evoluções');
        return;
      }

      console.log('Fetched evolutions:', evolutionsData);
      setEvolutions(evolutionsData || []);
    } catch (error) {
      console.error('Error in fetchEvolutions:', error);
      toast.error('Erro inesperado ao buscar evoluções');
    } finally {
      setIsLoading(false);
    }
  }, [patientId]);

  const addEvolution = async (evolutionData: Omit<Evolution, 'id' | 'created_at' | 'updated_at'>) => {
    console.log('Adding evolution:', evolutionData);
    
    try {
      const { data: insertData, error: insertError } = await supabase
        .from('patient_evolutions')
        .insert(evolutionData)
        .select()
        .single();

      if (insertError) {
        console.error('Error adding evolution:', insertError);
        toast.error('Erro ao adicionar evolução');
        return { success: false, error: insertError };
      }

      console.log('Evolution added successfully:', insertData);
      toast.success('Evolução adicionada com sucesso!');
      
      // Update local state
      setEvolutions(prev => [insertData, ...prev]);
      
      return { success: true, data: insertData };
    } catch (error) {
      console.error('Error in addEvolution:', error);
      toast.error('Erro inesperado ao adicionar evolução');
      return { success: false, error };
    }
  };

  const updateEvolution = async (evolutionId: string, updates: Partial<Evolution>) => {
    console.log('Updating evolution:', evolutionId, updates);
    
    try {
      const { data: updateData, error: updateError } = await supabase
        .from('patient_evolutions')
        .update(updates)
        .eq('id', evolutionId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating evolution:', updateError);
        toast.error('Erro ao atualizar evolução');
        return { success: false, error: updateError };
      }

      console.log('Evolution updated successfully:', updateData);
      toast.success('Evolução atualizada com sucesso!');
      
      // Update local state
      setEvolutions(prev => 
        prev.map(evo => evo.id === evolutionId ? updateData : evo)
      );
      
      return { success: true, data: updateData };
    } catch (error) {
      console.error('Error in updateEvolution:', error);
      toast.error('Erro inesperado ao atualizar evolução');
      return { success: false, error };
    }
  };

  const closeEvolution = async (evolutionId: string) => {
    console.log('Closing evolution:', evolutionId);
    
    try {
      const { error: closeError } = await supabase
        .from('patient_evolutions')
        .update({ is_active: false })
        .eq('id', evolutionId);

      if (closeError) {
        console.error('Error closing evolution:', closeError);
        toast.error('Erro ao fechar evolução');
        return { success: false, error: closeError };
      }

      console.log('Evolution closed successfully');
      toast.success('Evolução fechada com sucesso!');
      
      // Remove from local state
      setEvolutions(prev => prev.filter(evo => evo.id !== evolutionId));
      
      return { success: true };
    } catch (error) {
      console.error('Error in closeEvolution:', error);
      toast.error('Erro inesperado ao fechar evolução');
      return { success: false, error };
    }
  };

  return {
    evolutions,
    setEvolutions,
    isLoading,
    fetchEvolutions,
    addEvolution,
    updateEvolution,
    closeEvolution
  };
}
