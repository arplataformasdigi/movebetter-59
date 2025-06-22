
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
  const [error, setError] = useState<string | null>(null);

  const fetchRecentActivities = async () => {
    try {
      console.log('🔄 Fetching recent activities...');
      setIsLoading(true);
      setError(null);

      // Create timeout promise
      const timeoutPromise = (ms: number) => new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout')), ms)
      );

      // Fetch data with timeouts
      const queries = [
        Promise.race([
          supabase.from('appointments').select('id, created_at, session_type, patient_id').order('created_at', { ascending: false }).limit(5),
          timeoutPromise(3000)
        ]),
        Promise.race([
          supabase.from('patients').select('id, name, created_at').order('created_at', { ascending: false }).limit(3),
          timeoutPromise(3000)
        ]),
        Promise.race([
          supabase.from('treatment_plans').select('id, name, created_at, patient_id').order('created_at', { ascending: false }).limit(3),
          timeoutPromise(3000)
        ])
      ];

      const results = await Promise.allSettled(queries);

      // Process results safely
      const appointments = results[0].status === 'fulfilled' && results[0].value && !results[0].value.error ? results[0].value.data || [] : [];
      const patients = results[1].status === 'fulfilled' && results[1].value && !results[1].value.error ? results[1].value.data || [] : [];
      const plans = results[2].status === 'fulfilled' && results[2].value && !results[2].value.error ? results[2].value.data || [] : [];

      console.log('📊 Activities data:', { 
        appointmentsCount: appointments.length, 
        patientsCount: patients.length, 
        plansCount: plans.length 
      });

      // Create patient name lookup
      const patientLookup: Record<string, string> = {};
      patients.forEach((patient: any) => {
        patientLookup[patient.id] = patient.name;
      });

      // Combine activities
      const allActivities: Activity[] = [];

      // Add appointment activities
      appointments.forEach((apt: any) => {
        allActivities.push({
          id: apt.id,
          type: 'appointment',
          description: `Agendamento: ${apt.session_type || 'Sessão'}`,
          date: apt.created_at,
          patientName: apt.patient_id ? patientLookup[apt.patient_id] : undefined,
        });
      });

      // Add patient activities
      patients.forEach((patient: any) => {
        allActivities.push({
          id: patient.id,
          type: 'patient',
          description: `Novo paciente cadastrado`,
          date: patient.created_at,
          patientName: patient.name,
        });
      });

      // Add treatment plan activities
      plans.forEach((plan: any) => {
        allActivities.push({
          id: plan.id,
          type: 'treatment_plan',
          description: `Nova trilha: ${plan.name || 'Trilha'}`,
          date: plan.created_at,
          patientName: plan.patient_id ? patientLookup[plan.patient_id] : undefined,
        });
      });

      // Sort by date and get the 8 most recent
      const sortedActivities = allActivities
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 8);

      setActivities(sortedActivities);
      console.log('✅ Recent activities loaded:', sortedActivities.length);

    } catch (error) {
      console.error('💥 Error fetching recent activities:', error);
      setError('Erro ao carregar atividades recentes');
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
    error,
    refreshActivities: fetchRecentActivities,
  };
}
