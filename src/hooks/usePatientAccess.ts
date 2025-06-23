
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PatientAccess {
  id: string;
  patient_id: string;
  user_id: string;
  allowed_pages: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  patients?: {
    name: string;
    email?: string;
  };
}

export function usePatientAccess() {
  const [patientAccess, setPatientAccess] = useState<PatientAccess[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPatientAccess = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('patient_app_access')
        .select(`
          *,
          patients (name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching patient access:', error);
        toast.error("Erro ao carregar acessos de pacientes");
        return;
      }

      setPatientAccess(data || []);
    } catch (error) {
      console.error('Error in fetchPatientAccess:', error);
      toast.error("Erro inesperado ao carregar acessos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientAccess();

    // Setup realtime subscription
    const channel = supabase
      .channel('patient-access-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'patient_app_access'
        },
        (payload) => {
          console.log('Patient access change:', payload);
          fetchPatientAccess(); // Refetch to get complete data
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const createPatientAccess = async (patientId: string, allowedPages: string[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Usuário não autenticado");
        return { success: false };
      }

      const { data, error } = await supabase
        .from('patient_app_access')
        .insert([{
          patient_id: patientId,
          user_id: user.id,
          allowed_pages: allowedPages,
          is_active: true
        }])
        .select(`
          *,
          patients (name, email)
        `)
        .single();

      if (error) {
        console.error('Error creating patient access:', error);
        toast.error("Erro ao criar acesso do paciente");
        return { success: false, error };
      }

      toast.success("Acesso criado com sucesso");
      return { success: true, data };
    } catch (error) {
      console.error('Error in createPatientAccess:', error);
      return { success: false, error };
    }
  };

  const updatePatientAccess = async (id: string, updates: Partial<PatientAccess>) => {
    try {
      const { data, error } = await supabase
        .from('patient_app_access')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          patients (name, email)
        `)
        .single();

      if (error) {
        console.error('Error updating patient access:', error);
        toast.error("Erro ao atualizar acesso");
        return { success: false, error };
      }

      toast.success("Acesso atualizado com sucesso");
      return { success: true, data };
    } catch (error) {
      console.error('Error in updatePatientAccess:', error);
      return { success: false, error };
    }
  };

  const deletePatientAccess = async (id: string) => {
    try {
      const { error } = await supabase
        .from('patient_app_access')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting patient access:', error);
        toast.error("Erro ao deletar acesso");
        return { success: false, error };
      }

      toast.success("Acesso removido com sucesso");
      return { success: true };
    } catch (error) {
      console.error('Error in deletePatientAccess:', error);
      return { success: false, error };
    }
  };

  return {
    patientAccess,
    isLoading,
    fetchPatientAccess,
    createPatientAccess,
    updatePatientAccess,
    deletePatientAccess,
  };
}
