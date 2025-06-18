
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Buscar pacientes ativos
      const { data: activePatients } = await supabase
        .from('patients')
        .select('id')
        .eq('status', 'active');

      // Buscar sessões completadas
      const { data: completedSessions } = await supabase
        .from('appointments')
        .select('id')
        .eq('status', 'completed');

      // Buscar pontos de gamificação totais
      const { data: gamificationData } = await supabase
        .from('patient_scores')
        .select('total_points');

      // Calcular taxa de progresso média
      const { data: progressData } = await supabase
        .from('treatment_plans')
        .select('progress_percentage')
        .eq('is_active', true);

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
