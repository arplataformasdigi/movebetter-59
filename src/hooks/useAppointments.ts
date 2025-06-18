
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Appointment {
  id: string;
  patient_id?: string;
  appointment_date: string;
  appointment_time: string;
  session_type: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  duration_minutes?: number;
  notes?: string;
  observations?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  patients?: {
    name: string;
  };
}

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patients (name)
        `)
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      if (error) {
        console.error('Error fetching appointments:', error);
        toast({
          title: "Erro ao carregar agendamentos",
          description: "Não foi possível carregar a lista de agendamentos",
          variant: "destructive",
        });
        return;
      }

      setAppointments(data || []);
    } catch (error) {
      console.error('Error in fetchAppointments:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao carregar os agendamentos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const addAppointment = async (appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at' | 'patients'>) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select(`
          *,
          patients (name)
        `)
        .single();

      if (error) {
        console.error('Error adding appointment:', error);
        toast({
          title: "Erro ao adicionar agendamento",
          description: "Não foi possível adicionar o agendamento",
          variant: "destructive",
        });
        return { success: false, error };
      }

      setAppointments(prev => [...prev, data].sort((a, b) => 
        new Date(a.appointment_date + ' ' + a.appointment_time).getTime() - 
        new Date(b.appointment_date + ' ' + b.appointment_time).getTime()
      ));
      toast({
        title: "Agendamento adicionado",
        description: "Agendamento foi adicionado com sucesso",
      });
      return { success: true, data };
    } catch (error) {
      console.error('Error in addAppointment:', error);
      return { success: false, error };
    }
  };

  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          patients (name)
        `)
        .single();

      if (error) {
        console.error('Error updating appointment:', error);
        toast({
          title: "Erro ao atualizar agendamento",
          description: "Não foi possível atualizar o agendamento",
          variant: "destructive",
        });
        return { success: false, error };
      }

      setAppointments(prev => prev.map(a => a.id === id ? data : a));
      toast({
        title: "Agendamento atualizado",
        description: "Agendamento foi atualizado com sucesso",
      });
      return { success: true, data };
    } catch (error) {
      console.error('Error in updateAppointment:', error);
      return { success: false, error };
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting appointment:', error);
        toast({
          title: "Erro ao deletar agendamento",
          description: "Não foi possível deletar o agendamento",
          variant: "destructive",
        });
        return { success: false, error };
      }

      setAppointments(prev => prev.filter(a => a.id !== id));
      toast({
        title: "Agendamento removido",
        description: "Agendamento foi removido com sucesso",
      });
      return { success: true };
    } catch (error) {
      console.error('Error in deleteAppointment:', error);
      return { success: false, error };
    }
  };

  return {
    appointments,
    isLoading,
    fetchAppointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
  };
}
