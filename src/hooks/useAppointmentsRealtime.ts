
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAppointments, Appointment } from './useAppointments';

export function useAppointmentsRealtime() {
  const { appointments, setAppointments, ...appointmentHooks } = useAppointments();

  useEffect(() => {
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
          const newAppointment = payload.new as Appointment;
          setAppointments(prev => [...prev, newAppointment].sort((a, b) => 
            new Date(a.appointment_date + ' ' + a.appointment_time).getTime() - 
            new Date(b.appointment_date + ' ' + b.appointment_time).getTime()
          ));
          toast.success("Novo agendamento adicionado!");
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
          const updatedAppointment = payload.new as Appointment;
          setAppointments(prev => prev.map(a => 
            a.id === updatedAppointment.id ? updatedAppointment : a
          ));
          if (updatedAppointment.status === 'cancelled') {
            toast.info("Agendamento cancelado!");
          } else {
            toast.success("Agendamento atualizado!");
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
          console.log('Deleted appointment:', payload);
          const deletedAppointment = payload.old as Appointment;
          setAppointments(prev => prev.filter(a => a.id !== deletedAppointment.id));
          toast.success("Agendamento removido!");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [setAppointments]);

  return {
    appointments,
    ...appointmentHooks
  };
}
