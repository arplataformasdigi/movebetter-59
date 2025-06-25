
import { useEffect, useState } from 'react';

import { PatientAccess } from './usePatientAccess';
import { toast } from 'sonner';

export function useRealtimePatientAccess() {
  const [patientAccess, setPatientAccess] = useState<PatientAccess[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPatientAccess = async () => {
    try {
      console.log('🔍 Fetching patient access...');
      const { data, error } = await supabase
        .from('patient_app_access')
        .select(`
          *,
          patients (name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching patient access:', error);
        toast.error("Erro ao carregar acessos de pacientes");
        return;
      }

      console.log('✅ Patient access loaded:', data?.length || 0);
      setPatientAccess(data || []);
    } catch (error) {
      console.error('💥 Exception in fetchPatientAccess:', error);
      toast.error("Erro inesperado ao carregar acessos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Carregar dados iniciais
    fetchPatientAccess();

    // Configurar realtime subscription
    console.log('📡 Setting up realtime subscription for patient access');
    const channel = supabase
      .channel('patient-access-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'patient_app_access'
        },
        (payload) => {
          console.log('🔄 Realtime patient access change:', payload);
          
          switch (payload.eventType) {
            case 'INSERT':
              // Recarregar dados para incluir dados relacionados do paciente
              fetchPatientAccess();
              break;
            case 'UPDATE':
              fetchPatientAccess();
              break;
            case 'DELETE':
              setPatientAccess(prev => 
                prev.filter(access => access.id !== payload.old.id)
              );
              break;
          }
        }
      )
      .subscribe();

    return () => {
      console.log('📡 Cleaning up patient access realtime subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    patientAccess,
    isLoading,
    refetch: fetchPatientAccess
  };
}
