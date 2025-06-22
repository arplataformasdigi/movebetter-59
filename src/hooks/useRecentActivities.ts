
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Activity {
  id: string;
  type: 'appointment' | 'patient' | 'treatment_plan';
  description: string;
  date: string;
  patientName?: string;
}

export function useRecentActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecentActivities = async () => {
    try {
      setIsLoading(true);

      // Fetch appointments without JOIN
      const { data: appointments } = await supabase
        .from('appointments')
        .select('id, created_at, session_type, patient_id')
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch patients
      const { data: patients } = await supabase
        .from('patients')
        .select('id, name, created_at')
        .order('created_at', { ascending: false })
        .limit(3);

      // Fetch treatment plans without JOIN
      const { data: plans } = await supabase
        .from('treatment_plans')
        .select('id, name, created_at, patient_id')
        .order('created_at', { ascending: false })
        .limit(3);

      // Create patient name lookup
      const patientLookup: Record<string, string> = {};
      if (patients) {
        patients.forEach(patient => {
          patientLookup[patient.id] = patient.name;
        });
      }

      // Combine activities
      const allActivities: Activity[] = [];

      // Add appointment activities
      if (appointments) {
        appointments.forEach(apt => {
          allActivities.push({
            id: apt.id,
            type: 'appointment',
            description: `Agendamento: ${apt.session_type}`,
            date: apt.created_at,
            patientName: apt.patient_id ? patientLookup[apt.patient_id] : undefined,
          });
        });
      }

      // Add patient activities
      if (patients) {
        patients.forEach(patient => {
          allActivities.push({
            id: patient.id,
            type: 'patient',
            description: `Novo paciente cadastrado`,
            date: patient.created_at,
            patientName: patient.name,
          });
        });
      }

      // Add treatment plan activities
      if (plans) {
        plans.forEach(plan => {
          allActivities.push({
            id: plan.id,
            type: 'treatment_plan',
            description: `Nova trilha: ${plan.name}`,
            date: plan.created_at,
            patientName: plan.patient_id ? patientLookup[plan.patient_id] : undefined,
          });
        });
      }

      // Sort by date and get the 8 most recent
      const sortedActivities = allActivities
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 8);

      setActivities(sortedActivities);

    } catch (error) {
      console.error('Error fetching recent activities:', error);
      // Set fallback data instead of showing error
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentActivities();
  }, []);

  return {
    activities,
    isLoading,
    refreshActivities: fetchRecentActivities,
  };
}
