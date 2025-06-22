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
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('📊 Fetching dashboard data...');

      // Create timeout for each query
      const timeoutPromise = (ms: number) => new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout')), ms)
      );

      // Fetch all data with individual timeouts
      const queries = [
        Promise.race([
          supabase.from('patients').select('id', { count: 'exact' }).eq('status', 'active'),
          timeoutPromise(3000)
        ]),
        Promise.race([
          supabase.from('appointments').select('id', { count: 'exact' }).eq('status', 'completed'),
          timeoutPromise(3000)
        ]),
        Promise.race([
          supabase.from('patient_scores').select('total_points'),
          timeoutPromise(3000)
        ]),
        Promise.race([
          supabase.from('treatment_plans').select('progress_percentage').eq('is_active', true),
          timeoutPromise(3000)
        ])
      ];

      const results = await Promise.allSettled(queries);

      let activeCount = 0;
      let completedCount = 0;
      let totalPoints = 0;
      let avgProgress = 0;

      // Handle active patients
      if (results[0].status === 'fulfilled' && results[0].value && !results[0].value.error) {
        activeCount = results[0].value.count || 0;
        console.log('✅ Active patients:', activeCount);
      } else {
        console.warn('⚠️ Failed to fetch active patients:', results[0]);
      }

      // Handle completed sessions  
      if (results[1].status === 'fulfilled' && results[1].value && !results[1].value.error) {
        completedCount = results[1].value.count || 0;
        console.log('✅ Completed sessions:', completedCount);
      } else {
        console.warn('⚠️ Failed to fetch completed sessions:', results[1]);
      }

      // Handle gamification points
      if (results[2].status === 'fulfilled' && results[2].value && !results[2].value.error) {
        totalPoints = results[2].value.data?.reduce((sum: number, score: any) => sum + (score.total_points || 0), 0) || 0;
        console.log('✅ Total points:', totalPoints);
      } else {
        console.warn('⚠️ Failed to fetch gamification points:', results[2]);
      }

      // Handle progress data
      if (results[3].status === 'fulfilled' && results[3].value && !results[3].value.error && results[3].value.data) {
        const progressList = results[3].value.data;
        if (progressList.length > 0) {
          avgProgress = Math.round(
            progressList.reduce((sum: number, plan: any) => sum + (plan.progress_percentage || 0), 0) / progressList.length
          );
        }
        console.log('✅ Average progress:', avgProgress);
      } else {
        console.warn('⚠️ Failed to fetch progress data:', results[3]);
      }

      setStats({
        activePatients: activeCount,
        completedSessions: completedCount,
        progressRate: avgProgress,
        gamificationPoints: totalPoints,
      });

      console.log('✅ Dashboard data loaded successfully');

    } catch (error) {
      console.error('💥 Error fetching dashboard data:', error);
      setError('Erro ao carregar dados do dashboard');
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
    error,
    refreshData: fetchDashboardData,
  };
}
