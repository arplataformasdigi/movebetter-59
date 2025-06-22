
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, User, FileText, Stethoscope, Trash2 } from "lucide-react";
import { Appointment, useAppointments } from "@/hooks/useAppointments";
import { formatDateToBrazilian } from "@/utils/dateUtils";

interface AppointmentDetailsDialogProps {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AppointmentDetailsDialog({ appointment, open, onOpenChange }: AppointmentDetailsDialogProps) {
  const { deleteAppointment } = useAppointments();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!appointment) return null;

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

  const handleDeleteAppointment = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteAppointment(appointment.id);
      if (result.success) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              <DialogTitle>Detalhes do Agendamento</DialogTitle>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.
                    <br /><br />
                    <strong>Agendamento:</strong> {appointment.session_type}
                    <br />
                    <strong>Paciente:</strong> {appointment.patients?.name || 'Não informado'}
                    <br />
                    <strong>Data:</strong> {formatDateToBrazilian(appointment.appointment_date)} às {appointment.appointment_time}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteAppointment}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <DialogDescription>
            Informações completas sobre o agendamento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Paciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{appointment.patients?.name || 'Não informado'}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  Tipo de Sessão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{appointment.session_type}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">
                  {formatDateToBrazilian(appointment.appointment_date)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Horário
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{appointment.appointment_time}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className={getStatusColor(appointment.status)}>
                  {getStatusLabel(appointment.status)}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {appointment.duration_minutes && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Duração
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{appointment.duration_minutes} minutos</p>
              </CardContent>
            </Card>
          )}

          {appointment.notes && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Notas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{appointment.notes}</p>
              </CardContent>
            </Card>
          )}

          {appointment.observations && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Observações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{appointment.observations}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Informações do Sistema</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-500">
              <p>Criado em: {formatDateToBrazilian(appointment.created_at)} às {new Date(appointment.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
              <p>Última atualização: {formatDateToBrazilian(appointment.updated_at)} às {new Date(appointment.updated_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
