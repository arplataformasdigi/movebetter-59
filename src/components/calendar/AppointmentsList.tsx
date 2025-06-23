
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Clock, User, X, Search } from "lucide-react";
import { Appointment } from "@/hooks/useAppointments";
import { formatDateToBrazilian } from "@/utils/dateUtils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AppointmentsListProps {
  appointments: Appointment[];
  onCancelAppointment: (id: string) => Promise<void>;
}

export function AppointmentsList({ appointments, onCancelAppointment }: AppointmentsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no_show':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Agendado';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      case 'no_show':
        return 'Paciente Faltou';
      default:
        return status;
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patients?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const appointmentDate = appointment.appointment_date;
    const matchesDateRange = (!startDate || appointmentDate >= startDate) && 
                           (!endDate || appointmentDate <= endDate);
    return matchesSearch && matchesDateRange;
  });

  const scheduledAppointments = filteredAppointments.filter(app => app.status === 'scheduled');
  const cancelledAppointments = filteredAppointments.filter(app => app.status === 'cancelled');
  const completedAppointments = filteredAppointments.filter(app => app.status === 'completed');

  const handleCancelClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleConfirmCancel = async () => {
    if (selectedAppointment) {
      await onCancelAppointment(selectedAppointment.id);
      setSelectedAppointment(null);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filtros de Pesquisa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Pesquisar por nome do paciente</Label>
              <Input
                id="search"
                placeholder="Digite o nome do paciente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="startDate">Data inicial</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endDate">Data final</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="scheduled" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scheduled">
            Agendados ({scheduledAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelados ({cancelledAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Concluídos ({completedAppointments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled" className="space-y-4">
          {scheduledAppointments.length > 0 ? (
            scheduledAppointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-2 rounded-md">
                        <CalendarDays className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{appointment.session_type}</h4>
                          <Badge className={getStatusColor(appointment.status)}>
                            {getStatusLabel(appointment.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{appointment.patients?.name || 'Paciente não encontrado'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CalendarDays className="h-4 w-4" />
                            <span>{formatDateToBrazilian(appointment.appointment_date)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{appointment.appointment_time}</span>
                          </div>
                          {appointment.duration_minutes && (
                            <span>({appointment.duration_minutes} min)</span>
                          )}
                        </div>
                        {appointment.notes && (
                          <p className="text-sm text-gray-600 mt-2">{appointment.notes}</p>
                        )}
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleCancelClick(appointment)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancelar
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancelar Agendamento</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja cancelar este agendamento?
                            <br /><br />
                            <strong>Paciente:</strong> {appointment.patients?.name || 'Não informado'}
                            <br />
                            <strong>Data:</strong> {formatDateToBrazilian(appointment.appointment_date)} às {appointment.appointment_time}
                            <br />
                            <strong>Tipo:</strong> {appointment.session_type}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Não cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleConfirmCancel()}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Confirmar Cancelamento
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhum agendamento encontrado.
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {cancelledAppointments.length > 0 ? (
            cancelledAppointments.map((appointment) => (
              <Card key={appointment.id} className="border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-red-100 p-2 rounded-md">
                      <X className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium line-through">{appointment.session_type}</h4>
                        <Badge className={getStatusColor(appointment.status)}>
                          {getStatusLabel(appointment.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{appointment.patients?.name || 'Paciente não encontrado'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarDays className="h-4 w-4" />
                          <span>{formatDateToBrazilian(appointment.appointment_date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{appointment.appointment_time}</span>
                        </div>
                        {appointment.duration_minutes && (
                          <span>({appointment.duration_minutes} min)</span>
                        )}
                      </div>
                      {appointment.notes && (
                        <p className="text-sm text-gray-600 mt-2">{appointment.notes}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhum agendamento cancelado encontrado.
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedAppointments.length > 0 ? (
            completedAppointments.map((appointment) => (
              <Card key={appointment.id} className="border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-md">
                      <CalendarDays className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{appointment.session_type}</h4>
                        <Badge className={getStatusColor(appointment.status)}>
                          {getStatusLabel(appointment.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{appointment.patients?.name || 'Paciente não encontrado'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarDays className="h-4 w-4" />
                          <span>{formatDateToBrazilian(appointment.appointment_date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{appointment.appointment_time}</span>
                        </div>
                        {appointment.duration_minutes && (
                          <span>({appointment.duration_minutes} min)</span>
                        )}
                      </div>
                      {appointment.notes && (
                        <p className="text-sm text-gray-600 mt-2">{appointment.notes}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhum agendamento concluído encontrado.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
