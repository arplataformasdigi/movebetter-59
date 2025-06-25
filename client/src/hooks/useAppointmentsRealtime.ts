
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Appointment {
  id: string;
  patient_id?: string;
  appointment_date: string;
  appointment_time: string;
  session_type: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  observations?: string;
  duration_minutes?: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
  patients?: {
    name: string;
  };
}

export function useAppointmentsRealtime() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const channelRef = useRef<any>(null);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching appointments from Supabase...');
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patients (name)
        `)
        .order('appointment_date', { ascending: true });

      if (error) {
        console.error('Error fetching appointments:', error);
        toast.error("Erro ao carregar agendamentos: " + error.message);
        return;
      }

      console.log('Appointments fetched successfully:', data);
      setAppointments(data || []);
    } catch (error) {
      console.error('Error in fetchAppointments:', error);
      toast.error("Erro inesperado ao carregar agendamentos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();

    // Cleanup previous channel if it exists
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Setup realtime subscription
    const channelName = `appointments_realtime_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    console.log('Setting up appointments realtime subscription with channel:', channelName);
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'appointments'
        },
        async (payload) => {
          console.log('New appointment detected:', payload);
          
          // Fetch the complete appointment with patient relation
          const { data: newAppointment } = await supabase
            .from('appointments')
            .select(`
              *,
              patients (name)
            `)
            .eq('id', payload.new.id)
            .single();

          if (newAppointment) {
            setAppointments(prev => {
              // Check if appointment already exists to avoid duplicates
              const exists = prev.find(a => a.id === newAppointment.id);
              if (exists) return prev;
              
              return [...prev, newAppointment].sort((a, b) => 
                new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime()
              );
            });
            toast.success("Novo agendamento criado!");
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'appointments'
        },
        async (payload) => {
          console.log('Updated appointment detected:', payload);
          
          const { data: updatedAppointment } = await supabase
            .from('appointments')
            .select(`
              *,
              patients (name)
            `)
            .eq('id', payload.new.id)
            .single();

          if (updatedAppointment) {
            setAppointments(prev => prev.map(a => 
              a.id === updatedAppointment.id ? updatedAppointment : a
            ));
            
            if (payload.old.status !== payload.new.status) {
              const statusMap = {
                'scheduled': 'agendado',
                'completed': 'concluído',
                'cancelled': 'cancelado',
                'no_show': 'paciente faltou'
              };
              toast.success(`Agendamento ${statusMap[payload.new.status as keyof typeof statusMap] || payload.new.status}!`);
            } else {
              toast.success("Agendamento atualizado!");
            }
          }
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
          console.log('Deleted appointment detected:', payload);
          const deletedAppointment = payload.old as Appointment;
          setAppointments(prev => prev.filter(a => a.id !== deletedAppointment.id));
          toast.info("Agendamento removido!");
        }
      )
      .subscribe((status) => {
        console.log('Appointments channel subscription status:', status);
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        console.log('Cleaning up appointments realtime subscription');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, []);

  const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at' | 'patients'>) => {
    try {
      console.log('Adding appointment with data:', appointmentData);
      
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
      return { success: true, data };
    } catch (error) {
      console.error('Error in addAppointment:', error);
      toast.error("Erro inesperado ao adicionar agendamento");
      return { success: false, error };
    }
  };

  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    try {
      console.log('Updating appointment with id:', id, 'updates:', updates);
      
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
      return { success: true, data };
    } catch (error) {
      console.error('Error in updateAppointment:', error);
      toast.error("Erro inesperado ao atualizar agendamento");
      return { success: false, error };
    }
  };

  const cancelAppointment = async (id: string) => {
    return await updateAppointment(id, { status: 'cancelled' });
  };

  const completeAppointment = async (id: string) => {
    return await updateAppointment(id, { status: 'completed' });
  };

  const deleteAppointment = async (id: string) => {
    try {
      console.log('Deleting appointment with id:', id);
      
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
    createAppointment,
    updateAppointment,
    cancelAppointment,
    completeAppointment,
    deleteAppointment,
  };
}
