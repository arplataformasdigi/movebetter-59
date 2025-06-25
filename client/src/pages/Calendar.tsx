
import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScheduleAppointmentForm } from "@/components/calendar/ScheduleAppointmentForm";
import { AppointmentDetailsDialog } from "@/components/calendar/AppointmentDetailsDialog";
import { AppointmentsList } from "@/components/calendar/AppointmentsList";
import { useAppointmentsRealtime } from "@/hooks/useAppointmentsRealtime";
import { useRealtimePatients } from "@/hooks/useRealtimePatients";
import { formatDateToBrazilian } from "@/utils/dateUtils";

const locales = {
  "pt-BR": ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const messages = {
  allDay: "Dia inteiro",
  previous: "Anterior",
  next: "Próximo",
  today: "Hoje",
  month: "Mês",
  week: "Semana",
  day: "Dia",
  agenda: "Agenda",
  date: "Data",
  time: "Hora",
  event: "Evento",
  noEventsInRange: "Não há eventos neste período.",
  showMore: (total: number) => `+ Ver mais (${total})`,
};

export default function CalendarPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const { appointments, isLoading: isLoadingAppointments, createAppointment, cancelAppointment, completeAppointment } = useAppointmentsRealtime();
  const { patients, isLoading: isLoadingPatients } = useRealtimePatients();

  // Debug: Log appointments data
  useEffect(() => {
    console.log('Current appointments state:', appointments);
    console.log('Is loading appointments:', isLoadingAppointments);
  }, [appointments, isLoadingAppointments]);

  const handleSelectSlot = ({ start }: { start: Date }) => {
    setSelectedDate(start);
    setIsDialogOpen(true);
  };

  const handleSelectEvent = (event: any) => {
    console.log("Evento selecionado:", event);
    setSelectedAppointment(event.resource);
    setIsDetailsDialogOpen(true);
  };

  const handleCancelAppointment = async (id: string) => {
    await cancelAppointment(id);
  };

  const handleCompleteAppointment = async (id: string) => {
    await completeAppointment(id);
  };

  // Converter appointments para eventos do calendar
  const events = appointments.map(appointment => {
    // Create a proper date object from the appointment date string
    const appointmentDate = new Date(appointment.appointment_date + 'T00:00:00');
    const [hours, minutes] = appointment.appointment_time.split(':').map(Number);
    
    const start = new Date(appointmentDate);
    start.setHours(hours, minutes, 0, 0);
    
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + (appointment.duration_minutes || 60));

    return {
      id: appointment.id,
      title: `${appointment.session_type} - ${appointment.patients?.name || 'Paciente não encontrado'}`,
      start,
      end,
      resource: appointment,
    };
  });

  const eventStyleGetter = (event: any) => {
    const status = event.resource.status;
    let backgroundColor = "#3174ad";
    
    switch (status) {
      case "completed":
        backgroundColor = "#28a745";
        break;
      case "cancelled":
        backgroundColor = "#dc3545";
        break;
      case "scheduled":
        backgroundColor = "#007bff";
        break;
      default:
        backgroundColor = "#6c757d";
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
      },
    };
  };

  if (isLoadingAppointments || isLoadingPatients) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando calendário...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Calendário</h1>
          <p className="text-muted-foreground">
            Gerencie seus agendamentos ({appointments.length} agendamentos encontrados)
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Agendamento
        </Button>
      </div>

      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calendar">Visualização Calendário</TabsTrigger>
          <TabsTrigger value="list">Lista de Agendamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <div className="bg-white rounded-lg border p-4" style={{ height: "600px" }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: "100%" }}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              selectable
              eventPropGetter={eventStyleGetter}
              messages={messages}
              views={['month', 'week', 'day']}
              defaultView="month"
            />
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <AppointmentsList 
            appointments={appointments}
            onCancelAppointment={handleCancelAppointment}
            onCompleteAppointment={handleCompleteAppointment}
          />
        </TabsContent>
      </Tabs>

      <ScheduleAppointmentForm
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedDate(null);
        }}
        selectedDate={selectedDate}
        patients={patients}
      />

      <AppointmentDetailsDialog
        appointment={selectedAppointment}
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
      />
    </div>
  );
}
