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

      // Fetch all data in parallel with error handling
      const [
        activePatients,
        completedSessions,
        gamificationData,
        progressData
      ] = await Promise.allSettled([
        supabase.from('patients').select('id', { count: 'exact' }).eq('status', 'active'),
        supabase.from('appointments').select('id', { count: 'exact' }).eq('status', 'completed'),
        supabase.from('patient_scores').select('total_points'),
        supabase.from('treatment_plans').select('progress_percentage').eq('is_active', true)
      ]);

      let activeCount = 0;
      let completedCount = 0;
      let totalPoints = 0;
      let avgProgress = 0;

      // Handle active patients
      if (activePatients.status === 'fulfilled' && !activePatients.value.error) {
        activeCount = activePatients.value.count || 0;
      }

      // Handle completed sessions  
      if (completedSessions.status === 'fulfilled' && !completedSessions.value.error) {
        completedCount = completedSessions.value.count || 0;
      }

      // Handle gamification points
      if (gamificationData.status === 'fulfilled' && !gamificationData.value.error) {
        totalPoints = gamificationData.value.data?.reduce((sum, score) => sum + (score.total_points || 0), 0) || 0;
      }

      // Handle progress data
      if (progressData.status === 'fulfilled' && !progressData.value.error && progressData.value.data) {
        const progressList = progressData.value.data;
        if (progressList.length > 0) {
          avgProgress = Math.round(
            progressList.reduce((sum, plan) => sum + (plan.progress_percentage || 0), 0) / progressList.length
          );
        }
      }

      setStats({
        activePatients: activeCount,
        completedSessions: completedCount,
        progressRate: avgProgress,
        gamificationPoints: totalPoints,
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Keep current stats on error
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
