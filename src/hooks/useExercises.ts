
import { useState, useEffect } from 'react';
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

  const fetchExercises = async () => {
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
      setExercises(data || []);
    } catch (error) {
      console.error('Error in fetchExercises:', error);
      toast.error("Erro inesperado ao carregar os exercícios");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

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
      setExercises(prev => [data, ...prev]);
      toast.success("Exercício adicionado com sucesso");
      return { success: true, data };
    } catch (error) {
      console.error('Error in addExercise:', error);
      toast.error("Erro inesperado ao adicionar exercício");
      return { success: false, error };
    }
  };

  return {
    exercises,
    isLoading,
    fetchExercises,
    addExercise,
  };
}
