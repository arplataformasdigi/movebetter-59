
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
      console.log('Fetching upcoming sessions...');
      setIsLoading(true);
      setError(null);

      const today = new Date().toISOString().split('T')[0];

      // Fetch appointments with patient names in a single query
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select(`
          id,
          appointment_date,
          appointment_time,
          session_type,
          status,
          patient_id,
          patients (name)
        `)
        .gte('appointment_date', today)
        .eq('status', 'scheduled')
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true })
        .limit(5);

      if (appointmentsError) {
        console.error('Error fetching appointments:', appointmentsError);
        setError('Erro ao carregar agendamentos');
        setSessions([]);
        return;
      }

      if (!appointments || appointments.length === 0) {
        console.log('No upcoming sessions found');
        setSessions([]);
        return;
      }

      console.log('Upcoming sessions fetched:', appointments.length);

      const formattedSessions = appointments.map(apt => ({
        id: apt.id,
        date: new Date(apt.appointment_date).toLocaleDateString('pt-BR'),
        time: apt.appointment_time,
        type: apt.session_type || 'Sessão',
        patientName: apt.patients?.name || 'Paciente não identificado',
        status: apt.status,
      }));

      setSessions(formattedSessions);

    } catch (error) {
      console.error('Error fetching upcoming sessions:', error);
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
