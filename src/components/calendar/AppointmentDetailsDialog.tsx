
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, User, FileText, Stethoscope, MapPin } from "lucide-react";
import { Appointment } from "@/hooks/useAppointments";

interface AppointmentDetailsDialogProps {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AppointmentDetailsDialog({ appointment, open, onOpenChange }: AppointmentDetailsDialogProps) {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Detalhes do Agendamento
          </DialogTitle>
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
                  {new Date(appointment.appointment_date).toLocaleDateString('pt-BR')}
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
              <p>Criado em: {new Date(appointment.created_at).toLocaleString('pt-BR')}</p>
              <p>Última atualização: {new Date(appointment.updated_at).toLocaleString('pt-BR')}</p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
