import { useState, useEffect, useRef } from 'react';
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
  const channelRef = useRef<any>(null);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const subscriptionStateRef = useRef<'idle' | 'subscribing' | 'subscribed' | 'cleaning'>('idle');

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

  const debouncedFetch = () => {
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }
    fetchTimeoutRef.current = setTimeout(() => {
      fetchPatients();
    }, 500);
  };

  const setupRealtimeSubscription = () => {
    // Prevent multiple subscription attempts
    if (subscriptionStateRef.current !== 'idle') {
      console.log('Subscription not idle, current state:', subscriptionStateRef.current);
      return;
    }

    console.log('Setting up realtime subscription...');
    subscriptionStateRef.current = 'subscribing';

    // Create unique channel name
    const channelName = `patients_realtime_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log('Creating new channel:', channelName);
    
    try {
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'patients'
          },
          (payload) => {
            console.log('Realtime event received:', payload);
            debouncedFetch();
          }
        )
        .subscribe((status) => {
          console.log('Channel subscription status:', status);
          if (status === 'SUBSCRIBED') {
            subscriptionStateRef.current = 'subscribed';
          } else if (status === 'CLOSED' && subscriptionStateRef.current !== 'cleaning') {
            // If channel closed unexpectedly, reset state
            subscriptionStateRef.current = 'idle';
          }
        });

      channelRef.current = channel;
    } catch (error) {
      console.error('Error setting up realtime subscription:', error);
      subscriptionStateRef.current = 'idle';
    }
  };

  const cleanupSubscription = () => {
    if (subscriptionStateRef.current === 'cleaning') {
      console.log('Already cleaning up, skipping...');
      return;
    }

    console.log('Cleaning up subscription...');
    subscriptionStateRef.current = 'cleaning';
    
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
      fetchTimeoutRef.current = null;
    }
    
    if (channelRef.current) {
      try {
        supabase.removeChannel(channelRef.current);
        console.log('Channel removed successfully');
      } catch (error) {
        console.error('Error removing channel:', error);
      }
      channelRef.current = null;
    }
    
    // Reset state after a brief delay to prevent race conditions
    setTimeout(() => {
      subscriptionStateRef.current = 'idle';
    }, 100);
  };

  useEffect(() => {
    let isMounted = true;

    const initializeHook = async () => {
      if (!isMounted) return;
      
      // Initial fetch
      await fetchPatients();
      
      if (!isMounted) return;
      
      // Setup realtime subscription only if component is still mounted
      setupRealtimeSubscription();
    };

    initializeHook();

    return () => {
      isMounted = false;
      cleanupSubscription();
    };
  }, []); // Empty dependency array to run only once

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
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating patient:', error);
        toast.error("Erro ao atualizar paciente: " + error.message);
        return { success: false, error };
      }

      console.log('Patient updated successfully:', data);
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
