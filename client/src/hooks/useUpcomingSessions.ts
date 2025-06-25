
import { useState, useEffect } from 'react';


interface UpcomingSession {
  id: string;
  date: string;
  time: string;
  type: string;
  patientName: string;
  status: string;
}

export function useUpcomingSessions() {
  const [sessions, setSessions] = useState<UpcomingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUpcomingSessions = async () => {
    try {
      console.log('📅 Fetching upcoming sessions...');
      setIsLoading(true);
      setError(null);

      const today = new Date().toISOString().split('T')[0];

      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout')), 3000)
      );

      // Fetch appointments with timeout
      const appointmentsQuery = supabase
        .from('appointments')
        .select('id, appointment_date, appointment_time, session_type, status, patient_id')
        .gte('appointment_date', today)
        .eq('status', 'scheduled')
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true })
        .limit(5);

      const { data: appointments, error: appointmentsError } = await Promise.race([
        appointmentsQuery,
        timeoutPromise
      ]);

      if (appointmentsError) {
        console.error('❌ Error fetching appointments:', appointmentsError);
        setError('Erro ao carregar agendamentos');
        setSessions([]);
        return;
      }

      if (!appointments || appointments.length === 0) {
        console.log('📅 No upcoming sessions found');
        setSessions([]);
        return;
      }

      // Get patient names separately
      const patientIds = appointments
        .map(apt => apt.patient_id)
        .filter(id => id !== null);

      let patientNames: Record<string, string> = {};
      
      if (patientIds.length > 0) {
        try {
          const patientsQuery = supabase
            .from('patients')
            .select('id, name')
            .in('id', patientIds);

          const { data: patients, error: patientsError } = await Promise.race([
            patientsQuery,
            timeoutPromise
          ]);

          if (!patientsError && patients) {
            patientNames = patients.reduce((acc, patient) => {
              acc[patient.id] = patient.name;
              return acc;
            }, {} as Record<string, string>);
          }
        } catch (error) {
          console.warn('⚠️ Could not fetch patient names:', error);
        }
      }

      console.log('✅ Upcoming sessions fetched:', appointments.length);

      const formattedSessions = appointments.map(apt => ({
        id: apt.id,
        date: new Date(apt.appointment_date).toLocaleDateString('pt-BR'),
        time: apt.appointment_time,
        type: apt.session_type || 'Sessão',
        patientName: patientNames[apt.patient_id] || 'Paciente não identificado',
        status: apt.status,
      }));

      setSessions(formattedSessions);

    } catch (error) {
      console.error('💥 Error fetching upcoming sessions:', error);
      setError('Erro ao carregar próximas sessões');
      setSessions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingSessions();
  }, []);

  return {
    sessions,
    isLoading,
    error,
    refreshSessions: fetchUpcomingSessions,
  };
}
