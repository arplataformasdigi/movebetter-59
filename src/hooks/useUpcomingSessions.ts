
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

  const fetchUpcomingSessions = async () => {
    try {
      console.log('Fetching upcoming sessions from Supabase...');
      setIsLoading(true);

      const today = new Date().toISOString().split('T')[0];

      // First, get appointments
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('id, appointment_date, appointment_time, session_type, status, patient_id')
        .gte('appointment_date', today)
        .eq('status', 'scheduled')
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true })
        .limit(5);

      if (appointmentsError) {
        console.error('Error fetching appointments:', appointmentsError);
        // Set fallback data instead of showing error
        setSessions([]);
        return;
      }

      if (!appointments || appointments.length === 0) {
        console.log('No upcoming sessions found');
        setSessions([]);
        return;
      }

      // Get patient names separately to avoid JOIN issues
      const patientIds = appointments
        .map(apt => apt.patient_id)
        .filter(id => id !== null);

      let patientNames: Record<string, string> = {};
      
      if (patientIds.length > 0) {
        const { data: patients, error: patientsError } = await supabase
          .from('patients')
          .select('id, name')
          .in('id', patientIds);

        if (!patientsError && patients) {
          patientNames = patients.reduce((acc, patient) => {
            acc[patient.id] = patient.name;
            return acc;
          }, {} as Record<string, string>);
        }
      }

      console.log('Upcoming sessions fetched successfully:', appointments);

      const formattedSessions = appointments.map(apt => ({
        id: apt.id,
        date: new Date(apt.appointment_date).toLocaleDateString('pt-BR'),
        time: apt.appointment_time,
        type: apt.session_type,
        patientName: patientNames[apt.patient_id] || 'Paciente não identificado',
        status: apt.status,
      }));

      setSessions(formattedSessions);

    } catch (error) {
      console.error('Error fetching upcoming sessions:', error);
      // Set fallback data instead of showing error toast
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
    refreshSessions: fetchUpcomingSessions,
  };
}
