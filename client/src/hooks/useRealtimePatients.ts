
import { useState, useEffect, useRef } from 'react';

import { toast } from 'sonner';

export interface Patient {
  id: string;
  user_id?: string;
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
  created_by?: string;
  created_at: string;
  updated_at: string;
  password_hash?: string;
}

export function useRealtimePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const channelRef = useRef<any>(null);

  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching patients from Supabase...');
      
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
    } catch (error) {
      console.error('Error in fetchPatients:', error);
      toast.error("Erro inesperado ao carregar pacientes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();

    // Cleanup previous channel if it exists
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Setup realtime subscription
    const channelName = `patients_realtime_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    console.log('Setting up patients realtime subscription with channel:', channelName);
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'patients'
        },
        (payload) => {
          console.log('New patient detected:', payload);
          const newPatient = payload.new as Patient;
          setPatients(prev => {
            // Check if patient already exists to avoid duplicates
            const exists = prev.find(p => p.id === newPatient.id);
            if (exists) return prev;
            
            return [newPatient, ...prev];
          });
          toast.success("Novo paciente adicionado!");
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'patients'
        },
        (payload) => {
          console.log('Updated patient detected:', payload);
          const updatedPatient = payload.new as Patient;
          setPatients(prev => prev.map(p => 
            p.id === updatedPatient.id ? updatedPatient : p
          ));
          toast.success("Paciente atualizado!");
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'patients'
        },
        (payload) => {
          console.log('Deleted patient detected:', payload);
          const deletedPatient = payload.old as Patient;
          setPatients(prev => prev.filter(p => p.id !== deletedPatient.id));
          toast.info("Paciente removido!");
        }
      )
      .subscribe((status) => {
        console.log('Patients channel subscription status:', status);
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        console.log('Cleaning up patients realtime subscription');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, []);

  const addPatient = async (patientData: Omit<Patient, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Adding patient with data:', patientData);
      
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
      return { success: true, data };
    } catch (error) {
      console.error('Error in addPatient:', error);
      toast.error("Erro inesperado ao adicionar paciente");
      return { success: false, error };
    }
  };

  const updatePatient = async (id: string, updates: Partial<Omit<Patient, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      console.log('Updating patient with id:', id, 'updates:', updates);
      
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
      return { success: true, data };
    } catch (error) {
      console.error('Error in updatePatient:', error);
      toast.error("Erro inesperado ao atualizar paciente");
      return { success: false, error };
    }
  };

  const deletePatient = async (id: string) => {
    try {
      console.log('Deleting patient with id:', id);
      
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
      return { success: true };
    } catch (error) {
      console.error('Error in deletePatient:', error);
      toast.error("Erro inesperado ao deletar paciente");
      return { success: false, error };
    }
  };

  return {
    patients,
    setPatients,
    isLoading,
    fetchPatients,
    addPatient,
    updatePatient,
    deletePatient,
  };
}
