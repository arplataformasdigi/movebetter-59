
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const fetchRecentActivities = async () => {
    try {
      setIsLoading(true);

      // Buscar agendamentos recentes
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select(`
          id,
          created_at,
          session_type,
          patients (name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (appointmentsError) {
        console.error('Error fetching appointments:', appointmentsError);
      }

      // Buscar pacientes recém-cadastrados
      const { data: patients, error: patientsError } = await supabase
        .from('patients')
        .select('id, name, created_at')
        .order('created_at', { ascending: false })
        .limit(3);

      if (patientsError) {
        console.error('Error fetching patients:', patientsError);
      }

      // Buscar trilhas criadas recentemente
      const { data: plans, error: plansError } = await supabase
        .from('treatment_plans')
        .select(`
          id,
          name,
          created_at,
          patients (name)
        `)
        .order('created_at', { ascending: false })
        .limit(3);

      if (plansError) {
        console.error('Error fetching treatment plans:', plansError);
      }

      // Combinar e ordenar atividades
      const allActivities: Activity[] = [
        ...(appointments?.map(apt => ({
          id: apt.id,
          type: 'appointment' as const,
          description: `Agendamento: ${apt.session_type}`,
          date: apt.created_at,
          patientName: apt.patients?.name,
        })) || []),
        ...(patients?.map(patient => ({
          id: patient.id,
          type: 'patient' as const,
          description: `Novo paciente cadastrado`,
          date: patient.created_at,
          patientName: patient.name,
        })) || []),
        ...(plans?.map(plan => ({
          id: plan.id,
          type: 'treatment_plan' as const,
          description: `Nova trilha: ${plan.name}`,
          date: plan.created_at,
          patientName: plan.patients?.name,
        })) || []),
      ];

      // Ordenar por data e pegar os 8 mais recentes
      const sortedActivities = allActivities
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 8);

      setActivities(sortedActivities);

    } catch (error) {
      console.error('Error fetching recent activities:', error);
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
