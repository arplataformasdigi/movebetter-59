
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Patient } from './usePatients';
import { toast } from 'sonner';

export function useRealtimePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPatients = async () => {
    try {
      console.log('🔍 Fetching patients...');
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching patients:', error);
        toast.error("Erro ao carregar pacientes");
        return;
      }

      console.log('✅ Patients loaded:', data?.length || 0);
      setPatients(data || []);
    } catch (error) {
      console.error('💥 Exception in fetchPatients:', error);
      toast.error("Erro inesperado ao carregar pacientes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Carregar dados iniciais
    fetchPatients();

    // Configurar realtime subscription
    console.log('📡 Setting up realtime subscription for patients');
    const channel = supabase
      .channel('patients-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'patients'
        },
        (payload) => {
          console.log('🔄 Realtime patients change:', payload);
          
          switch (payload.eventType) {
            case 'INSERT':
              setPatients(prev => [payload.new as Patient, ...prev]);
              toast.success("Novo paciente adicionado");
              break;
            case 'UPDATE':
              setPatients(prev => 
                prev.map(patient => 
                  patient.id === payload.new.id ? payload.new as Patient : patient
                )
              );
              toast.success("Paciente atualizado");
              break;
            case 'DELETE':
              setPatients(prev => 
                prev.filter(patient => patient.id !== payload.old.id)
              );
              toast.success("Paciente removido");
              break;
          }
        }
      )
      .subscribe();

    return () => {
      console.log('📡 Cleaning up patients realtime subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    patients,
    isLoading,
    refetch: fetchPatients
  };
}
