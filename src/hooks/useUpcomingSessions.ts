
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const fetchUpcomingSessions = async () => {
    try {
      setIsLoading(true);

      const today = new Date().toISOString().split('T')[0];

      const { data: appointments, error } = await supabase
        .from('appointments')
        .select(`
          id,
          appointment_date,
          appointment_time,
          session_type,
          status,
          patients (name)
        `)
        .gte('appointment_date', today)
        .eq('status', 'scheduled')
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true })
        .limit(5);

      if (error) {
        console.error('Error fetching upcoming sessions:', error);
        return;
      }

      const formattedSessions = appointments?.map(apt => ({
        id: apt.id,
        date: new Date(apt.appointment_date).toLocaleDateString('pt-BR'),
        time: apt.appointment_time,
        type: apt.session_type,
        patientName: apt.patients?.name || 'Paciente não identificado',
        status: apt.status,
      })) || [];

      setSessions(formattedSessions);

    } catch (error) {
      console.error('Error fetching upcoming sessions:', error);
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
    refreshSessions: fetchUpcomingSessions,
  };
}
