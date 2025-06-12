
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, User } from "lucide-react";
import { ScheduleAppointmentForm } from "@/components/calendar/ScheduleAppointmentForm";

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

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);

  const handleScheduleAppointment = (newAppointment: Appointment) => {
    setAppointments([...appointments, newAppointment]);
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
        <ScheduleAppointmentForm onScheduleAppointment={handleScheduleAppointment} />
      </div>

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
                        <p className="font-medium">{appointment.title}</p>
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
                      <Button variant="outline" size="sm">
                        Agendar Sessão
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
