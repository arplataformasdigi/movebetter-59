
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  activePatients: number;
  completedSessions: number;
  progressRate: number;
  gamificationPoints: number;
}

export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats>({
    activePatients: 0,
    completedSessions: 0,
    progressRate: 0,
    gamificationPoints: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Buscar pacientes ativos
      const { data: activePatients, error: patientsError } = await supabase
        .from('patients')
        .select('id')
        .eq('status', 'active');

      if (patientsError) throw patientsError;

      // Buscar sessões completadas
      const { data: completedSessions, error: sessionsError } = await supabase
        .from('appointments')
        .select('id')
        .eq('status', 'completed');

      if (sessionsError) throw sessionsError;

      // Buscar pontos de gamificação totais
      const { data: gamificationData, error: gamificationError } = await supabase
        .from('patient_scores')
        .select('total_points');

      if (gamificationError) throw gamificationError;

      // Calcular taxa de progresso média
      const { data: progressData, error: progressError } = await supabase
        .from('treatment_plans')
        .select('progress_percentage')
        .eq('is_active', true);

      if (progressError) throw progressError;

      const totalPoints = gamificationData?.reduce((sum, score) => sum + (score.total_points || 0), 0) || 0;
      const avgProgress = progressData?.length > 0 
        ? Math.round(progressData.reduce((sum, plan) => sum + (plan.progress_percentage || 0), 0) / progressData.length)
        : 0;

      setStats({
        activePatients: activePatients?.length || 0,
        completedSessions: completedSessions?.length || 0,
        progressRate: avgProgress,
        gamificationPoints: totalPoints,
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as estatísticas do dashboard",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    stats,
    isLoading,
    refreshData: fetchDashboardData,
  };
}
