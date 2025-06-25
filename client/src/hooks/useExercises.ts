import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Exercise {
  id: string;
  name: string;
  description?: string;
  category?: string;
  difficulty_level?: number;
  duration_minutes?: number;
  instructions?: string;
  equipment_needed?: string[];
  image_url?: string;
  video_url?: string;
  is_active: boolean;
  created_at: string;
}

export function useExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);
  const isMountedRef = useRef(true);

  const fetchExercises = useCallback(async () => {
    try {
      console.log('Fetching exercises from Supabase...');
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching exercises:', error);
        toast.error("Erro ao carregar exercícios: " + error.message);
        return;
      }

      console.log('Exercises fetched successfully:', data);
      if (isMountedRef.current) {
        setExercises(data || []);
      }
    } catch (error) {
      console.error('Error in fetchExercises:', error);
      if (isMountedRef.current) {
        toast.error("Erro inesperado ao carregar os exercícios");
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    
    fetchExercises();

    // Clean up any existing subscription first
    if (channelRef.current) {
      console.log('Cleaning up existing channel');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
      isSubscribedRef.current = false;
    }

    // Create new subscription with unique channel name
    const channelName = `exercises_realtime_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('Creating new channel:', channelName);
    
    channelRef.current = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'exercises'
        },
        (payload) => {
          console.log('New exercise inserted:', payload);
          if (isMountedRef.current && payload.new.is_active) {
            setExercises(prev => [payload.new as Exercise, ...prev]);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'exercises'
        },
        (payload) => {
          console.log('Exercise updated:', payload);
          if (isMountedRef.current) {
            const updatedExercise = payload.new as Exercise;
            setExercises(prev => {
              if (updatedExercise.is_active) {
                return prev.map(ex => ex.id === updatedExercise.id ? updatedExercise : ex);
              } else {
                return prev.filter(ex => ex.id !== updatedExercise.id);
              }
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'exercises'
        },
        (payload) => {
          console.log('Exercise deleted:', payload);
          if (isMountedRef.current) {
            setExercises(prev => prev.filter(ex => ex.id !== payload.old.id));
          }
        }
      );

    channelRef.current.subscribe((status: string) => {
      console.log('Exercises subscription status:', status);
      if (status === 'SUBSCRIBED') {
        isSubscribedRef.current = true;
        console.log('Successfully subscribed to exercises changes');
      } else if (status === 'CLOSED') {
        isSubscribedRef.current = false;
        console.log('Exercises channel subscription closed');
      }
    });

    return () => {
      isMountedRef.current = false;
      
      if (channelRef.current && isSubscribedRef.current) {
        console.log('Cleaning up exercises subscription');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        isSubscribedRef.current = false;
      }
    };
  }, []); // Remove fetchExercises from dependencies to avoid recreation

  const addExercise = async (exerciseData: Omit<Exercise, 'id' | 'created_at'>) => {
    try {
      console.log('Adding exercise:', exerciseData);
      
      const { data, error } = await supabase
        .from('exercises')
        .insert([exerciseData])
        .select()
        .single();

      if (error) {
        console.error('Error adding exercise:', error);
        toast.error("Erro ao adicionar exercício: " + error.message);
        return { success: false, error };
      }

      console.log('Exercise added successfully:', data);
      toast.success("Exercício adicionado com sucesso");
      return { success: true, data };
    } catch (error) {
      console.error('Error in addExercise:', error);
      toast.error("Erro inesperado ao adicionar exercício");
      return { success: false, error };
    }
  };

  const updateExercise = async (id: string, updates: Partial<Exercise>) => {
    try {
      console.log('Updating exercise:', id, updates);
      
      const { data, error } = await supabase
        .from('exercises')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating exercise:', error);
        toast.error("Erro ao atualizar exercício: " + error.message);
        return { success: false, error };
      }

      console.log('Exercise updated successfully:', data);
      toast.success("Exercício atualizado com sucesso");
      return { success: true, data };
    } catch (error) {
      console.error('Error in updateExercise:', error);
      toast.error("Erro inesperado ao atualizar exercício");
      return { success: false, error };
    }
  };

  const deleteExercise = async (id: string) => {
    try {
      console.log('Deleting exercise:', id);
      
      const { error } = await supabase
        .from('exercises')
        .update({ is_active: false })
        .eq('id', id);

      if (error) {
        console.error('Error deleting exercise:', error);
        toast.error("Erro ao deletar exercício: " + error.message);
        return { success: false, error };
      }

      console.log('Exercise deleted successfully');
      toast.success("Exercício removido com sucesso");
      return { success: true };
    } catch (error) {
      console.error('Error in deleteExercise:', error);
      toast.error("Erro inesperado ao deletar exercício");
      return { success: false, error };
    }
  };

  return {
    exercises,
    isLoading,
    fetchExercises,
    addExercise,
    updateExercise,
    deleteExercise,
  };
}
