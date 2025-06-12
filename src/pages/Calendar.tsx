import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarIcon, Clock, User, X } from "lucide-react";
import { ScheduleAppointmentForm } from "@/components/calendar/ScheduleAppointmentForm";
import { AppointmentFilter } from "@/components/calendar/AppointmentFilter";
import { toast } from "sonner";

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  date: Date;
  time: string;
  duration: number;
  observations?: string;
  status: "scheduled" | "completed" | "cancelled";
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientId: "1",
    patientName: "Marina Oliveira",
    title: "Avaliação Inicial",
    date: new Date(),
    time: "09:00",
    duration: 60,
    status: "scheduled",
  },
  {
    id: "2",
    patientId: "2",
    patientName: "Felipe Martins",
    title: "Sessão de Reabilitação",
    date: new Date(),
    time: "10:30",
    duration: 45,
    status: "scheduled",
  },
];

const mockPatients = [
  { id: "1", name: "Marina Oliveira" },
  { id: "2", name: "Felipe Martins" },
  { id: "3", name: "Carla Sousa" },
  { id: "4", name: "Ricardo Almeida" },
  { id: "5", name: "Patricia Mendes" },
  { id: "6", name: "Gustavo Torres" },
];

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const handleScheduleAppointment = (newAppointment: Appointment) => {
    setAppointments([...appointments, newAppointment]);
  };

  const handleCancelAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setCancelDialogOpen(true);
  };

  const confirmCancelAppointment = () => {
    if (!selectedAppointment) return;
    
    setAppointments(appointments.map(app => 
      app.id === selectedAppointment.id 
        ? { ...app, status: "cancelled" as const }
        : app
    ));
    
    toast.success("Agendamento cancelado com sucesso!");
    setCancelDialogOpen(false);
    setSelectedAppointment(null);
  };

  const todayAppointments = appointments.filter(
    (appointment) =>
      appointment.date.toDateString() === (date || new Date()).toDateString()
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled":
        return "Agendado";
      case "completed":
        return "Concluído";
      case "cancelled":
        return "Cancelado";
      default:
        return "Desconhecido";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <CalendarIcon className="mr-2 h-8 w-8" /> Calendário
          </h1>
          <p className="text-muted-foreground">
            Gerencie seus agendamentos e sessões.
          </p>
        </div>
        <ScheduleAppointmentForm 
          onScheduleAppointment={handleScheduleAppointment} 
          patients={mockPatients}
        />
      </div>

      <AppointmentFilter patients={mockPatients} appointments={appointments} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Calendário</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              Agendamentos de {date?.toLocaleDateString("pt-BR")}
            </CardTitle>
            <CardDescription>
              Visualize e gerencie seus agendamentos do dia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayAppointments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-2 text-sm font-medium">Nenhum agendamento</h3>
                  <p className="mt-1 text-sm">
                    Não há agendamentos para esta data.
                  </p>
                </div>
              ) : (
                todayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-movebetter-light rounded-full">
                        <Clock className="h-5 w-5 text-movebetter-primary" />
                      </div>
                      <div>
                        <p className={`font-medium ${appointment.status === 'cancelled' ? 'line-through' : ''}`}>
                          {appointment.title}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>{appointment.patientName}</span>
                          <span>•</span>
                          <span>{appointment.time}</span>
                          <span>•</span>
                          <span>{appointment.duration} min</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(appointment.status)}>
                        {getStatusText(appointment.status)}
                      </Badge>
                      {appointment.status === "scheduled" ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleCancelAppointment(appointment)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <X className="mr-1 h-4 w-4" />
                          Cancelar
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          disabled
                          className="opacity-50"
                        >
                          <X className="mr-1 h-4 w-4" />
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Agendamento</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="py-4 border-y">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Paciente:</span>
                  <span>{selectedAppointment.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Tipo:</span>
                  <span>{selectedAppointment.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Data:</span>
                  <span>{selectedAppointment.date.toLocaleDateString("pt-BR")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Horário:</span>
                  <span>{selectedAppointment.time}</span>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
            >
              Manter Agendamento
            </Button>
            <Button
              variant="destructive"
              onClick={confirmCancelAppointment}
            >
              Cancelar Agendamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
