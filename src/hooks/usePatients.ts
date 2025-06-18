
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  updated_at?: string;
}

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPatients = async () => {
    try {
      console.log('Fetching patients from Supabase...');
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching patients:', error);
        toast.error("Erro ao carregar pacientes: " + error.message);
        return;
      }

      console.log('Patients fetched successfully:', data);
      setPatients(data || []);
      
      if (data?.length === 0) {
        console.log('No patients found in database');
      }
    } catch (error) {
      console.error('Error in fetchPatients:', error);
      toast.error("Erro inesperado ao carregar os pacientes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const addPatient = async (patientData: Omit<Patient, 'id' | 'created_at'>) => {
    try {
      console.log('Adding patient:', patientData);
      
      const { data, error } = await supabase
        .from('patients')
        .insert([patientData])
        .select()
        .single();

      if (error) {
        console.error('Error adding patient:', error);
        toast.error("Erro ao adicionar paciente: " + error.message);
        return { success: false, error };
      }

      console.log('Patient added successfully:', data);
      setPatients(prev => [data, ...prev]);
      toast.success("Paciente adicionado com sucesso");
      return { success: true, data };
    } catch (error) {
      console.error('Error in addPatient:', error);
      toast.error("Erro inesperado ao adicionar paciente");
      return { success: false, error };
    }
  };

  const updatePatient = async (id: string, updates: Partial<Patient>) => {
    try {
      console.log('Updating patient:', id, updates);
      
      const { data, error } = await supabase
        .from('patients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating patient:', error);
        toast.error("Erro ao atualizar paciente: " + error.message);
        return { success: false, error };
      }

      console.log('Patient updated successfully:', data);
      setPatients(prev => prev.map(p => p.id === id ? data : p));
      toast.success("Paciente atualizado com sucesso");
      return { success: true, data };
    } catch (error) {
      console.error('Error in updatePatient:', error);
      toast.error("Erro inesperado ao atualizar paciente");
      return { success: false, error };
    }
  };

  const deletePatient = async (id: string) => {
    try {
      console.log('Deleting patient:', id);
      
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting patient:', error);
        toast.error("Erro ao deletar paciente: " + error.message);
        return { success: false, error };
      }

      console.log('Patient deleted successfully');
      setPatients(prev => prev.filter(p => p.id !== id));
      toast.success("Paciente removido com sucesso");
      return { success: true };
    } catch (error) {
      console.error('Error in deletePatient:', error);
      toast.error("Erro inesperado ao deletar paciente");
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
