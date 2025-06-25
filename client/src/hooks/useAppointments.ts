
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

  const fetchAppointments = async () => {
    try {
      console.log('Fetching appointments from Supabase...');
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
        toast.error("Erro ao carregar agendamentos: " + error.message);
        return;
      }

      console.log('Appointments fetched successfully:', data);
      setAppointments(data || []);
      
      if (data?.length === 0) {
        console.log('No appointments found in database');
      }
    } catch (error) {
      console.error('Error in fetchAppointments:', error);
      toast.error("Erro inesperado ao carregar os agendamentos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();

    // Setup realtime subscription
    const channel = supabase
      .channel('appointments-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'appointments'
        },
        (payload) => {
          console.log('New appointment:', payload);
          fetchAppointments(); // Refresh to get full data with relations
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'appointments'
        },
        (payload) => {
          console.log('Updated appointment:', payload);
          fetchAppointments(); // Refresh to get full data with relations
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'appointments'
        },
        (payload) => {
          console.log('Deleted appointment:', payload);
          setAppointments(prev => prev.filter(a => a.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addAppointment = async (appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at' | 'patients'>) => {
    try {
      console.log('Adding appointment:', appointmentData);
      
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
        toast.error("Erro ao adicionar agendamento: " + error.message);
        return { success: false, error };
      }

      console.log('Appointment added successfully:', data);
      setAppointments(prev => [...prev, data].sort((a, b) => 
        new Date(a.appointment_date + ' ' + a.appointment_time).getTime() - 
        new Date(b.appointment_date + ' ' + b.appointment_time).getTime()
      ));
      toast.success("Agendamento adicionado com sucesso");
      return { success: true, data };
    } catch (error) {
      console.error('Error in addAppointment:', error);
      toast.error("Erro inesperado ao adicionar agendamento");
      return { success: false, error };
    }
  };

  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    try {
      console.log('Updating appointment:', id, updates);
      
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
        toast.error("Erro ao atualizar agendamento: " + error.message);
        return { success: false, error };
      }

      console.log('Appointment updated successfully:', data);
      setAppointments(prev => prev.map(a => a.id === id ? data : a));
      toast.success("Agendamento atualizado com sucesso");
      return { success: true, data };
    } catch (error) {
      console.error('Error in updateAppointment:', error);
      toast.error("Erro inesperado ao atualizar agendamento");
      return { success: false, error };
    }
  };

  const cancelAppointment = async (id: string) => {
    try {
      console.log('Cancelling appointment:', id);
      
      const { data, error } = await supabase
        .from('appointments')
        .update({ status: 'completed' })
        .eq('id', id)
        .select(`
          *,
          patients (name)
        `)
        .single();

      if (error) {
        console.error('Error cancelling appointment:', error);
        toast.error("Erro ao cancelar agendamento: " + error.message);
        return { success: false, error };
      }

      console.log('Appointment cancelled successfully:', data);
      setAppointments(prev => prev.map(a => a.id === id ? data : a));
      toast.success("Agendamento cancelado com sucesso");
      return { success: true, data };
    } catch (error) {
      console.error('Error in cancelAppointment:', error);
      toast.error("Erro inesperado ao cancelar agendamento");
      return { success: false, error };
    }
  };

  const completeAppointment = async (id: string) => {
    try {
      console.log('Completing appointment:', id);
      
      const { data, error } = await supabase
        .from('appointments')
        .update({ status: 'completed' })
        .eq('id', id)
        .select(`
          *,
          patients (name)
        `)
        .single();

      if (error) {
        console.error('Error completing appointment:', error);
        toast.error("Erro ao marcar agendamento como atendido: " + error.message);
        return { success: false, error };
      }

      console.log('Appointment completed successfully:', data);
      setAppointments(prev => prev.map(a => a.id === id ? data : a));
      toast.success("Agendamento marcado como atendido com sucesso");
      return { success: true, data };
    } catch (error) {
      console.error('Error in completeAppointment:', error);
      toast.error("Erro inesperado ao marcar agendamento como atendido");
      return { success: false, error };
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      console.log('Deleting appointment:', id);
      
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting appointment:', error);
        toast.error("Erro ao deletar agendamento: " + error.message);
        return { success: false, error };
      }

      console.log('Appointment deleted successfully');
      setAppointments(prev => prev.filter(a => a.id !== id));
      toast.success("Agendamento removido com sucesso");
      return { success: true };
    } catch (error) {
      console.error('Error in deleteAppointment:', error);
      toast.error("Erro inesperado ao deletar agendamento");
      return { success: false, error };
    }
  };

  return {
    appointments,
    setAppointments,
    isLoading,
    fetchAppointments,
    addAppointment,
    updateAppointment,
    cancelAppointment,
    completeAppointment,
    deleteAppointment,
  };
}
