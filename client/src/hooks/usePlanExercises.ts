import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PlanExercise {
  id: string;
  treatment_plan_id: string;
  exercise_id: string;
  day_number: number;
  repetitions?: number;
  sets?: number;
  duration_minutes?: number;
  notes?: string;
  is_completed: boolean;
  completed_at?: string;
  created_at: string;
  exercises?: {
    id: string;
    name: string;
    description?: string;
    instructions?: string;
    difficulty_level?: number;
    duration_minutes?: number;
    image_url?: string;
    video_url?: string;
  };
}

export function usePlanExercises(planId?: string) {
  const [planExercises, setPlanExercises] = useState<PlanExercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);
  const currentPlanIdRef = useRef<string | undefined>(planId);
  const isMountedRef = useRef(true);

  const fetchPlanExercises = useCallback(async () => {
    if (!planId) {
      console.log('No planId provided, skipping fetch');
      setIsLoading(false);
      setPlanExercises([]);
      return;
    }

    try {
      console.log('Fetching plan exercises for planId:', planId);
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('plan_exercises')
        .select(`
          *,
          exercises (
            id,
            name, 
            description, 
            instructions,
            difficulty_level,
            duration_minutes,
            image_url,
            video_url
          )
        `)
        .eq('treatment_plan_id', planId)
        .order('day_number', { ascending: true })
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching plan exercises:', error);
        toast.error("Erro ao carregar exercícios do plano: " + error.message);
        return;
      }

      console.log('Plan exercises fetched successfully:', data);
      
      // Garantir que os dados estão formatados corretamente
      const formattedData = data?.map(item => ({
        ...item,
        exercises: item.exercises ? {
          id: item.exercises.id,
          name: item.exercises.name || 'Exercício sem nome',
          description: item.exercises.description || '',
          instructions: item.exercises.instructions || '',
          difficulty_level: item.exercises.difficulty_level || 1,
          duration_minutes: item.exercises.duration_minutes,
          image_url: item.exercises.image_url,
          video_url: item.exercises.video_url
        } : null
      })) || [];

      if (isMountedRef.current) {
        setPlanExercises(formattedData);
      }
    } catch (error) {
      console.error('Error in fetchPlanExercises:', error);
      if (isMountedRef.current) {
        toast.error("Erro inesperado ao carregar os exercícios do plano");
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [planId]);

  useEffect(() => {
    // Set mounted flag
    isMountedRef.current = true;
    
    // If planId changed, cleanup previous subscription
    if (currentPlanIdRef.current !== planId) {
      if (channelRef.current && isSubscribedRef.current) {
        console.log('Cleaning up previous plan exercises subscription');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        isSubscribedRef.current = false;
      }
      currentPlanIdRef.current = planId;
    }

    fetchPlanExercises();

    if (!planId) return;

    // Only create subscription if not already subscribed for this planId
    if (!isSubscribedRef.current && !channelRef.current) {
      const channelName = `plan_exercises_${planId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log('Creating new channel for plan exercises:', channelName);
      
      channelRef.current = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'plan_exercises',
            filter: `treatment_plan_id=eq.${planId}`
          },
          async (payload) => {
            console.log('New plan exercise inserted:', payload);
            
            if (!isMountedRef.current) return;
            
            // Fetch the new exercise with complete exercise data
            const { data: newExercise } = await supabase
              .from('plan_exercises')
              .select(`
                *,
                exercises (
                  id,
                  name, 
                  description, 
                  instructions,
                  difficulty_level,
                  duration_minutes,
                  image_url,
                  video_url
                )
              `)
              .eq('id', payload.new.id)
              .single();

            if (newExercise && isMountedRef.current) {
              setPlanExercises(prev => [...prev, newExercise].sort((a, b) => a.day_number - b.day_number));
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'plan_exercises',
            filter: `treatment_plan_id=eq.${planId}`
          },
          async (payload) => {
            console.log('Plan exercise updated:', payload);
            
            if (!isMountedRef.current) return;
            
            // Fetch the updated exercise with complete exercise data
            const { data: updatedExercise } = await supabase
              .from('plan_exercises')
              .select(`
                *,
                exercises (
                  id,
                  name, 
                  description, 
                  instructions,
                  difficulty_level,
                  duration_minutes,
                  image_url,
                  video_url
                )
              `)
              .eq('id', payload.new.id)
              .single();

            if (updatedExercise && isMountedRef.current) {
              setPlanExercises(prev => 
                prev.map(ex => ex.id === updatedExercise.id ? updatedExercise : ex)
                    .sort((a, b) => a.day_number - b.day_number)
              );
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'plan_exercises',
            filter: `treatment_plan_id=eq.${planId}`
          },
          (payload) => {
            console.log('Plan exercise deleted:', payload);
            if (isMountedRef.current) {
              setPlanExercises(prev => prev.filter(ex => ex.id !== payload.old.id));
            }
          }
        );

      channelRef.current.subscribe((status: string) => {
        console.log('Plan exercises subscription status:', status);
        if (status === 'SUBSCRIBED') {
          isSubscribedRef.current = true;
          console.log(`Successfully subscribed to plan exercises changes for plan ${planId}`);
        } else if (status === 'CLOSED') {
          isSubscribedRef.current = false;
          console.log('Plan exercises channel subscription closed');
        }
      });
    }

    return () => {
      isMountedRef.current = false;
      
      if (channelRef.current && isSubscribedRef.current) {
        console.log('Cleaning up plan exercises subscription');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        isSubscribedRef.current = false;
      }
    };
  }, [planId, fetchPlanExercises]);

  const addPlanExercise = async (exerciseData: Omit<PlanExercise, 'id' | 'created_at' | 'exercises'>) => {
    try {
      console.log('Adding plan exercise:', exerciseData);
      
      const { data, error } = await supabase
        .from('plan_exercises')
        .insert([exerciseData])
        .select(`
          *,
          exercises (
            id,
            name, 
            description, 
            instructions,
            difficulty_level,
            duration_minutes,
            image_url,
            video_url
          )
        `)
        .single();

      if (error) {
        console.error('Error adding plan exercise:', error);
        toast.error("Erro ao adicionar exercício ao plano: " + error.message);
        return { success: false, error };
      }

      console.log('Plan exercise added successfully:', data);
      toast.success("Exercício adicionado ao plano com sucesso");
      
      // Recarregar os exercícios para garantir dados atualizados
      await fetchPlanExercises();
      
      return { success: true, data };
    } catch (error) {
      console.error('Error in addPlanExercise:', error);
      toast.error("Erro inesperado ao adicionar exercício ao plano");
      return { success: false, error };
    }
  };

  const removePlanExercise = async (exerciseId: string) => {
    try {
      console.log('Removing plan exercise:', exerciseId);
      
      const { error } = await supabase
        .from('plan_exercises')
        .delete()
        .eq('id', exerciseId);

      if (error) {
        console.error('Error removing plan exercise:', error);
        toast.error("Erro ao remover exercício: " + error.message);
        return { success: false, error };
      }

      console.log('Plan exercise removed successfully');
      toast.success("Exercício removido com sucesso");
      return { success: true };
    } catch (error) {
      console.error('Error in removePlanExercise:', error);
      toast.error("Erro inesperado ao remover exercício");
      return { success: false, error };
    }
  };

  const toggleExerciseCompletion = async (exerciseId: string, isCompleted: boolean) => {
    try {
      console.log('Toggling exercise completion:', exerciseId, isCompleted);
      
      const updateData = {
        is_completed: isCompleted,
        completed_at: isCompleted ? new Date().toISOString() : null,
      };

      const { data, error } = await supabase
        .from('plan_exercises')
        .update(updateData)
        .eq('id', exerciseId)
        .select(`
          *,
          exercises (
            id,
            name, 
            description, 
            instructions,
            difficulty_level,
            duration_minutes,
            image_url,
            video_url
          )
        `)
        .single();

      if (error) {
        console.error('Error updating exercise completion:', error);
        toast.error("Erro ao atualizar exercício: " + error.message);
        return { success: false, error };
      }

      console.log('Exercise completion updated successfully');
      
      // Update patient scores if exercise was completed
      if (isCompleted && data) {
        const planExercise = planExercises.find(ex => ex.id === exerciseId);
        if (planExercise?.treatment_plan_id) {
          // Get the treatment plan to find patient_id
          const { data: treatmentPlan } = await supabase
            .from('treatment_plans')
            .select('patient_id')
            .eq('id', planExercise.treatment_plan_id)
            .single();

          if (treatmentPlan?.patient_id) {
            await updatePatientScore(treatmentPlan.patient_id);
          }
        }
      }
      
      toast.success(isCompleted ? "Exercício marcado como concluído" : "Exercício marcado como pendente");
      return { success: true, data };
    } catch (error) {
      console.error('Error in toggleExerciseCompletion:', error);
      toast.error("Erro inesperado ao atualizar exercício");
      return { success: false, error };
    }
  };

  const updatePatientScore = async (patientId: string) => {
    try {
      // Check if patient_scores record exists
      const { data: existingScore } = await supabase
        .from('patient_scores')
        .select('*')
        .eq('patient_id', patientId)
        .single();

      if (existingScore) {
        // Update existing record
        const { error } = await supabase
          .from('patient_scores')
          .update({
            total_points: existingScore.total_points + 10,
            completed_exercises: existingScore.completed_exercises + 1,
            last_activity_date: new Date().toISOString().split('T')[0],
            updated_at: new Date().toISOString()
          })
          .eq('patient_id', patientId);

        if (error) {
          console.error('Error updating patient score:', error);
        }
      } else {
        // Create new record
        const { error } = await supabase
          .from('patient_scores')
          .insert({
            patient_id: patientId,
            total_points: 10,
            completed_exercises: 1,
            last_activity_date: new Date().toISOString().split('T')[0],
            is_tracks_active: true
          });

        if (error) {
          console.error('Error creating patient score:', error);
        }
      }
    } catch (error) {
      console.error('Error in updatePatientScore:', error);
    }
  };

  const updatePlanExercise = async (exerciseId: string, updates: Partial<PlanExercise>) => {
    try {
      console.log('Updating plan exercise:', exerciseId, updates);
      
      const { data, error } = await supabase
        .from('plan_exercises')
        .update(updates)
        .eq('id', exerciseId)
        .select(`
          *,
          exercises (
            id,
            name, 
            description, 
            instructions,
            difficulty_level,
            duration_minutes,
            image_url,
            video_url
          )
        `)
        .single();

      if (error) {
        console.error('Error updating plan exercise:', error);
        toast.error("Erro ao atualizar exercício: " + error.message);
        return { success: false, error };
      }

      console.log('Plan exercise updated successfully');
      
      toast.success("Exercício atualizado com sucesso");
      return { success: true, data };
    } catch (error) {
      console.error('Error in updatePlanExercise:', error);
      toast.error("Erro inesperado ao atualizar exercício");
      return { success: false, error };
    }
  };

  return {
    planExercises,
    isLoading,
    fetchPlanExercises,
    addPlanExercise,
    removePlanExercise,
    toggleExerciseCompletion,
    updatePlanExercise,
  };
}
