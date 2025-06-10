
import React, { useState } from "react";
import { Calendar as CalendarIcon, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Appointment {
  id: string;
  date: Date;
  time: string;
  type: string;
  professional: string;
  status: "scheduled" | "completed" | "canceled";
  canceledAt?: Date;
}

export default function PatientAppointments() {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Mock de agendamentos
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      date: new Date(2025, 4, 15),
      time: "14:00",
      type: "Sessão de Fisioterapia",
      professional: "Dra. Maria",
      status: "scheduled"
    },
    {
      id: "2",
      date: new Date(2025, 4, 18),
      time: "15:30",
      type: "Avaliação de Progresso",
      professional: "Dr. João",
      status: "scheduled"
    },
    {
      id: "3",
      date: new Date(2025, 4, 22),
      time: "10:00",
      type: "Sessão de Fisioterapia",
      professional: "Dra. Maria",
      status: "scheduled"
    },
    {
      id: "4",
      date: new Date(2025, 4, 5),
      time: "16:00",
      type: "Sessão de Fisioterapia",
      professional: "Dra. Maria",
      status: "completed"
    },
    {
      id: "5",
      date: new Date(2025, 3, 28),
      time: "11:30",
      type: "Consulta Inicial",
      professional: "Dr. João",
      status: "completed"
    }
  ]);

  // Filtrar agendamentos por status
  const upcomingAppointments = appointments.filter(app => app.status === "scheduled");
  const pastAppointments = appointments.filter(app => app.status === "completed");
  const canceledAppointments = appointments.filter(app => app.status === "canceled");

  // Filtrar agendamentos por data selecionada no calendário
  const appointmentsOnSelectedDate = appointments.filter(
    app => date && app.date.getDate() === date.getDate() && 
          app.date.getMonth() === date.getMonth() && 
          app.date.getFullYear() === date.getFullYear()
  );

  // Função para cancelar agendamento
  const handleCancelAppointment = () => {
    if (!selectedAppointment) return;
    
    setAppointments(appointments.map(app => 
      app.id === selectedAppointment.id ? { 
        ...app, 
        status: "canceled",
        canceledAt: new Date()
      } : app
    ));
    
    toast({
      title: "Agendamento cancelado",
      description: `Seu agendamento para ${format(selectedAppointment.date, 'dd/MM/yyyy')} às ${selectedAppointment.time} foi cancelado.`,
    });
    
    setCancelDialogOpen(false);
    setSelectedAppointment(null);
  };

  // Função para preparar o cancelamento
  const prepareCancel = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setCancelDialogOpen(true);
  };

  // Função para formatar a data
  const formatDate = (date: Date) => {
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Meus Agendamentos</h1>
        <p className="text-muted-foreground">
          Visualize e gerencie seus agendamentos de consultas e sessões.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Agendamentos</CardTitle>
            <CardDescription>
              Visualize seus agendamentos por categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upcoming">Próximos</TabsTrigger>
                <TabsTrigger value="past">Realizados</TabsTrigger>
                <TabsTrigger value="canceled">Cancelados</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="space-y-4 pt-4">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment) => (
                    <div 
                      key={appointment.id} 
                      className="flex justify-between items-center border rounded-md p-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="bg-movebetter-light p-2 rounded-md">
                          <CalendarIcon className="h-5 w-5 text-movebetter-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{appointment.type}</h4>
                          <p className="text-sm text-muted-foreground">
                            Com {appointment.professional}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <CalendarIcon className="h-3.5 w-3.5" />
                            <span>{formatDate(appointment.date)}</span>
                            <Clock className="h-3.5 w-3.5 ml-2" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => prepareCancel(appointment)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <X className="h-4 w-4 mr-1" /> Cancelar
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Você não possui agendamentos futuros.
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="past" className="space-y-4 pt-4">
                {pastAppointments.length > 0 ? (
                  pastAppointments.map((appointment) => (
                    <div 
                      key={appointment.id} 
                      className="flex justify-between items-center border rounded-md p-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="bg-gray-100 p-2 rounded-md">
                          <CalendarIcon className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <h4 className="font-medium">{appointment.type}</h4>
                          <p className="text-sm text-muted-foreground">
                            Com {appointment.professional}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <CalendarIcon className="h-3.5 w-3.5" />
                            <span>{formatDate(appointment.date)}</span>
                            <Clock className="h-3.5 w-3.5 ml-2" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Você não possui agendamentos passados.
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="canceled" className="space-y-4 pt-4">
                {canceledAppointments.length > 0 ? (
                  canceledAppointments.map((appointment) => (
                    <div 
                      key={appointment.id} 
                      className="flex justify-between items-center border rounded-md p-4 bg-gray-50"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div className="bg-red-100 p-2 rounded-md">
                          <X className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium line-through">{appointment.type}</h4>
                            <Badge variant="destructive" className="text-xs">
                              Cancelado
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Com {appointment.professional}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <CalendarIcon className="h-3.5 w-3.5" />
                            <span>{formatDate(appointment.date)}</span>
                            <Clock className="h-3.5 w-3.5 ml-2" />
                            <span>{appointment.time}</span>
                          </div>
                          {appointment.canceledAt && (
                            <div className="text-xs text-red-600 mt-1">
                              Cancelado em: {format(appointment.canceledAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Você não possui agendamentos cancelados.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Calendário</CardTitle>
            <CardDescription>
              Visualize seus agendamentos no calendário
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
            
            <div className="space-y-4">
              <h4 className="font-medium text-sm border-b pb-2">
                {date ? formatDate(date) : "Nenhuma data selecionada"}
              </h4>
              
              {appointmentsOnSelectedDate.length > 0 ? (
                appointmentsOnSelectedDate.map((appointment) => (
                  <div key={appointment.id} className="border-b pb-2 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className={`font-medium ${appointment.status === 'canceled' ? 'line-through' : ''}`}>
                            {appointment.type}
                          </p>
                          {appointment.status === 'canceled' && (
                            <Badge variant="destructive" className="text-xs">
                              Cancelado
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{appointment.time}</p>
                        {appointment.status === 'canceled' && appointment.canceledAt && (
                          <p className="text-xs text-red-600">
                            Cancelado: {format(appointment.canceledAt, "HH:mm", { locale: ptBR })}
                          </p>
                        )}
                      </div>
                      {appointment.status === "scheduled" && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => prepareCancel(appointment)}
                          className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  Nenhum agendamento para esta data.
                </div>
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
                  <span className="font-medium">Tipo:</span>
                  <span>{selectedAppointment.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Profissional:</span>
                  <span>{selectedAppointment.professional}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Data:</span>
                  <span>{formatDate(selectedAppointment.date)}</span>
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
              onClick={handleCancelAppointment}
            >
              Cancelar Agendamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
