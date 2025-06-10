import React, { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ptBR } from "date-fns/locale";
import { format, isSameDay } from "date-fns";
import { CalendarPlus, Users, Clock } from "lucide-react";

import { ScheduleAppointmentForm } from "@/components/calendar/ScheduleAppointmentForm";

interface Appointment {
  id: string;
  title: string;
  patientName: string;
  patientId: string;
  type: "runner" | "pilates" | "assessment";
  date: Date;
  time: string;
  duration: string;
  notes?: string;
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    title: "Avaliação Inicial",
    patientName: "Carlos Oliveira",
    patientId: "1",
    type: "assessment",
    date: new Date(2025, 4, 2), // May 2, 2025
    time: "09:00",
    duration: "1 hora",
    notes: "Primeira avaliação do paciente, foco em análise de corrida.",
  },
  {
    id: "2",
    title: "Sessão de Pilates",
    patientName: "Mariana Costa",
    patientId: "2",
    type: "pilates",
    date: new Date(2025, 4, 2), // May 2, 2025
    time: "11:00",
    duration: "1 hora",
    notes: "Foco em exercícios para fortalecimento de core.",
  },
  {
    id: "3",
    title: "Treino de Corrida",
    patientName: "Pedro Santos",
    patientId: "3",
    type: "runner",
    date: new Date(2025, 4, 3), // May 3, 2025
    time: "10:00",
    duration: "1 hora 30 min",
    notes: "Treino de técnica de corrida no parque.",
  },
  {
    id: "4",
    title: "Sessão de Pilates",
    patientName: "Carla Souza",
    patientId: "4",
    type: "pilates",
    date: new Date(2025, 4, 4), // May 4, 2025
    time: "14:30",
    duration: "1 hora",
    notes: "Trabalho de mobilidade e estabilização.",
  },
  {
    id: "5",
    title: "Avaliação de Progresso",
    patientName: "Ricardo Alves",
    patientId: "5",
    type: "assessment",
    date: new Date(2025, 4, 5), // May 5, 2025
    time: "16:00",
    duration: "45 min",
    notes: "Revisão de progresso após 1 mês de treino.",
  },
];

const getAppointmentTypeColor = (type: Appointment["type"]) => {
  switch (type) {
    case "runner":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "pilates":
      return "bg-green-100 text-green-800 border-green-200";
    case "assessment":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "";
  }
};

const getTypeLabel = (type: Appointment["type"]) => {
  switch (type) {
    case "runner":
      return "Corrida";
    case "pilates":
      return "Pilates";
    case "assessment":
      return "Avaliação";
    default:
      return "";
  }
};

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [view, setView] = useState<"day" | "list">("day");
  
  // Function to check if a date has appointments
  const hasAppointmentsOn = (date: Date) => {
    return mockAppointments.some(appt => isSameDay(new Date(appt.date), date));
  };

  // Filter appointments for the selected date
  const appointmentsForSelectedDate = mockAppointments.filter(appt => 
    isSameDay(new Date(appt.date), selectedDate)
  ).sort((a, b) => a.time.localeCompare(b.time));

  // Open appointment details
  const openAppointmentDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentDialog(true);
  };

  // All appointments sorted by date
  const sortedAppointments = [...mockAppointments].sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Calendário de Sessões</h1>
        <Dialog open={showAppointmentDialog} onOpenChange={setShowAppointmentDialog}>
          <Button onClick={() => { 
            setSelectedAppointment(null); 
            setShowAppointmentDialog(true); 
          }}>
            <CalendarPlus className="mr-2 h-4 w-4" /> Agendar Sessão
          </Button>
          <DialogContent className="bg-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedAppointment ? "Detalhes da Sessão" : "Agendar Nova Sessão"}
              </DialogTitle>
            </DialogHeader>
            {selectedAppointment ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Paciente</h3>
                    <p className="font-medium">{selectedAppointment.patientName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Tipo</h3>
                    <Badge className={getAppointmentTypeColor(selectedAppointment.type)}>
                      {getTypeLabel(selectedAppointment.type)}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Data</h3>
                    <p>{format(selectedAppointment.date, "dd/MM/yyyy", { locale: ptBR })}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Horário</h3>
                    <p>{selectedAppointment.time} ({selectedAppointment.duration})</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Título</h3>
                  <p>{selectedAppointment.title}</p>
                </div>
                
                {selectedAppointment.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Observações</h3>
                    <p className="text-sm text-gray-600">{selectedAppointment.notes}</p>
                  </div>
                )}
                
                <DialogFooter className="flex justify-end space-x-2">
                  <Button variant="outline">Editar</Button>
                  <Button variant="destructive">Cancelar Sessão</Button>
                  <Button onClick={() => setShowAppointmentDialog(false)}>Fechar</Button>
                </DialogFooter>
              </div>
            ) : (
              <ScheduleAppointmentForm 
                onScheduleAppointment={() => setShowAppointmentDialog(false)} 
              />
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="day" value={view} onValueChange={(v) => setView(v as "day" | "list")} className="w-full">
        <TabsList className="w-full max-w-xs">
          <TabsTrigger value="day" className="w-full">Diário</TabsTrigger>
          <TabsTrigger value="list" className="w-full">Listagem</TabsTrigger>
        </TabsList>
        
        <TabsContent value="day" className="pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Calendário</CardTitle>
              </CardHeader>
              <CardContent>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  locale={ptBR}
                  modifiers={{
                    hasAppointment: (date) => hasAppointmentsOn(date),
                  }}
                  modifiersStyles={{
                    hasAppointment: {
                      backgroundColor: "rgb(243, 244, 255)",
                      fontWeight: "bold",
                      borderBottom: "2px solid #7c3aed",
                    },
                  }}
                  className="pointer-events-auto p-3"
                />
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">
                  Sessões para {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {appointmentsForSelectedDate.length > 0 ? (
                  <div className="space-y-4">
                    {appointmentsForSelectedDate.map((appointment) => (
                      <div 
                        key={appointment.id} 
                        className="flex items-center space-x-4 p-3 rounded-lg cursor-pointer border hover:bg-gray-50 transition-colors"
                        onClick={() => openAppointmentDetails(appointment)}
                      >
                        <div className="h-10 w-10 rounded-full bg-movebetter-light flex items-center justify-center text-movebetter-primary">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">{appointment.title}</p>
                            <Badge className={getAppointmentTypeColor(appointment.type)}>
                              {getTypeLabel(appointment.type)}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-gray-600">
                              <Users className="inline h-3 w-3 mr-1" /> 
                              {appointment.patientName}
                            </p>
                            <p className="text-xs font-medium">{appointment.time} ({appointment.duration})</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Nenhuma sessão agendada para esta data</p>
                    <Button onClick={() => {
                      setSelectedAppointment(null);
                      setShowAppointmentDialog(true);
                    }}>
                      Agendar Sessão
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="list" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Todas as Sessões</CardTitle>
            </CardHeader>
            <CardContent>
              {sortedAppointments.length > 0 ? (
                <div className="space-y-4 divide-y divide-gray-100">
                  {sortedAppointments.map((appointment) => (
                    <div 
                      key={appointment.id}
                      className="pt-4 cursor-pointer"
                      onClick={() => openAppointmentDetails(appointment)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <p className="font-medium">{appointment.title}</p>
                          <span className="mx-2 text-gray-300">•</span>
                          <p className="text-sm text-gray-600">{appointment.patientName}</p>
                        </div>
                        <Badge className={getAppointmentTypeColor(appointment.type)}>
                          {getTypeLabel(appointment.type)}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <p>{format(appointment.date, "dd/MM/yyyy", { locale: ptBR })}</p>
                        <span className="mx-2">•</span>
                        <p>{appointment.time}</p>
                        <span className="mx-2">•</span>
                        <p>{appointment.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhuma sessão agendada</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
