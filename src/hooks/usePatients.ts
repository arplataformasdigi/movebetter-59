
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Patient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  cpf?: string;
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  medical_history?: string;
  status: 'active' | 'inactive' | 'completed';
  created_at: string;
}

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching patients:', error);
        toast({
          title: "Erro ao carregar pacientes",
          description: "Não foi possível carregar a lista de pacientes",
          variant: "destructive",
        });
        return;
      }

      setPatients(data || []);
    } catch (error) {
      console.error('Error in fetchPatients:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao carregar os pacientes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const addPatient = async (patientData: Omit<Patient, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .insert([patientData])
        .select()
        .single();

      if (error) {
        console.error('Error adding patient:', error);
        toast({
          title: "Erro ao adicionar paciente",
          description: "Não foi possível adicionar o paciente",
          variant: "destructive",
        });
        return { success: false, error };
      }

      setPatients(prev => [data, ...prev]);
      toast({
        title: "Paciente adicionado",
        description: "Paciente foi adicionado com sucesso",
      });
      return { success: true, data };
    } catch (error) {
      console.error('Error in addPatient:', error);
      return { success: false, error };
    }
  };

  const updatePatient = async (id: string, updates: Partial<Patient>) => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating patient:', error);
        toast({
          title: "Erro ao atualizar paciente",
          description: "Não foi possível atualizar o paciente",
          variant: "destructive",
        });
        return { success: false, error };
      }

      setPatients(prev => prev.map(p => p.id === id ? data : p));
      toast({
        title: "Paciente atualizado",
        description: "Paciente foi atualizado com sucesso",
      });
      return { success: true, data };
    } catch (error) {
      console.error('Error in updatePatient:', error);
      return { success: false, error };
    }
  };

  const deletePatient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting patient:', error);
        toast({
          title: "Erro ao deletar paciente",
          description: "Não foi possível deletar o paciente",
          variant: "destructive",
        });
        return { success: false, error };
      }

      setPatients(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Paciente removido",
        description: "Paciente foi removido com sucesso",
      });
      return { success: true };
    } catch (error) {
      console.error('Error in deletePatient:', error);
      return { success: false, error };
    }
  };

  return {
    patients,
    isLoading,
    fetchPatients,
    addPatient,
    updatePatient,
    deletePatient,
  };
}
