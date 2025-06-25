
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
      const createTimeoutPromise = (ms: number) => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Query timeout')), ms)
        );

      // Fetch all data with individual timeouts
      const [patientsResult, appointmentsResult, scoresResult, plansResult] = await Promise.allSettled([
        Promise.race([
          supabase.from('patients').select('id', { count: 'exact' }).eq('status', 'active'),
          createTimeoutPromise(3000)
        ]),
        Promise.race([
          supabase.from('appointments').select('id', { count: 'exact' }).eq('status', 'completed'),
          createTimeoutPromise(3000)
        ]),
        Promise.race([
          supabase.from('patient_scores').select('total_points'),
          createTimeoutPromise(3000)
        ]),
        Promise.race([
          supabase.from('treatment_plans').select('progress_percentage').eq('is_active', true),
          createTimeoutPromise(3000)
        ])
      ]);

      let activeCount = 0;
      let completedCount = 0;
      let totalPoints = 0;
      let avgProgress = 0;

      // Handle active patients
      if (patientsResult.status === 'fulfilled') {
        try {
          const result = patientsResult.value as any;
          if (result && !result.error && typeof result.count === 'number') {
            activeCount = result.count;
            console.log('✅ Active patients:', activeCount);
          } else {
            console.warn('⚠️ Failed to fetch active patients:', result?.error);
          }
        } catch (err) {
          console.warn('⚠️ Error processing active patients:', err);
        }
      } else {
        console.warn('⚠️ Active patients query failed:', patientsResult.reason);
      }

      // Handle completed sessions  
      if (appointmentsResult.status === 'fulfilled') {
        try {
          const result = appointmentsResult.value as any;
          if (result && !result.error && typeof result.count === 'number') {
            completedCount = result.count;
            console.log('✅ Completed sessions:', completedCount);
          } else {
            console.warn('⚠️ Failed to fetch completed sessions:', result?.error);
          }
        } catch (err) {
          console.warn('⚠️ Error processing completed sessions:', err);
        }
      } else {
        console.warn('⚠️ Completed sessions query failed:', appointmentsResult.reason);
      }

      // Handle gamification points
      if (scoresResult.status === 'fulfilled') {
        try {
          const result = scoresResult.value as any;
          if (result && !result.error && Array.isArray(result.data)) {
            totalPoints = result.data.reduce((sum: number, score: any) => sum + (score.total_points || 0), 0);
            console.log('✅ Total points:', totalPoints);
          } else {
            console.warn('⚠️ Failed to fetch gamification points:', result?.error);
          }
        } catch (err) {
          console.warn('⚠️ Error processing gamification points:', err);
        }
      } else {
        console.warn('⚠️ Gamification points query failed:', scoresResult.reason);
      }

      // Handle progress data
      if (plansResult.status === 'fulfilled') {
        try {
          const result = plansResult.value as any;
          if (result && !result.error && Array.isArray(result.data) && result.data.length > 0) {
            avgProgress = Math.round(
              result.data.reduce((sum: number, plan: any) => sum + (plan.progress_percentage || 0), 0) / result.data.length
            );
            console.log('✅ Average progress:', avgProgress);
          } else {
            console.warn('⚠️ Failed to fetch progress data:', result?.error);
          }
        } catch (err) {
          console.warn('⚠️ Error processing progress data:', err);
        }
      } else {
        console.warn('⚠️ Progress data query failed:', plansResult.reason);
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
