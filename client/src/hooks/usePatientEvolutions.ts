
import { useState, useEffect, useRef } from 'react';
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
  const channelRef = useRef<any>(null);

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

    if (patientId) {
      // Cleanup previous channel if it exists
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      // Setup realtime subscription with unique channel name including patientId
      const channelName = `evolutions_changes_${patientId}_${Date.now()}_${Math.random()}`;
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'patient_evolutions'
          },
          () => {
            fetchEvolutions();
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
  }, [patientId]);

  const addEvolution = async (evolutionData: Omit<Evolution, 'id' | 'created_at' | 'updated_at'>) => {
    // Verificar se o paciente tem alta e se a evolução está vinculada a um prontuário ativo
    const { data: patient } = await supabase
      .from('patients')
      .select('status')
      .eq('id', evolutionData.patient_id)
      .single();
    
    if (patient?.status !== 'active') {
      toast.error("Não é possível adicionar evolução para paciente com alta");
      return { success: false, error: "Patient not active" };
    }
    
    // Verificar se existe prontuário ativo
    const { data: medicalRecord } = await supabase
      .from('patient_medical_records')
      .select('id, status')
      .eq('id', evolutionData.medical_record_id)
      .eq('status', 'active')
      .single();
    
    if (!medicalRecord) {
      toast.error("Prontuário não encontrado ou inativo");
      return { success: false, error: "Medical record not found or inactive" };
    }
    try {
      // Check if the medical record is still active
      const { data: medicalRecord, error: recordError } = await supabase
        .from('patient_medical_records')
        .select('status')
        .eq('id', evolutionData.medical_record_id)
        .single();

      if (recordError || !medicalRecord) {
        toast.error("Prontuário não encontrado");
        return { success: false, error: recordError };
      }

      if (medicalRecord.status === 'discharged') {
        toast.error("Não é possível criar evolução para um prontuário que recebeu alta");
        return { success: false, error: "Medical record discharged" };
      }

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
