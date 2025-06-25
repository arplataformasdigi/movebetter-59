
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, User } from "lucide-react";

interface Patient {
  id: string;
  name: string;
}

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

interface AppointmentFilterProps {
  patients: Patient[];
  appointments: Appointment[];
}

export function AppointmentFilter({ patients, appointments }: AppointmentFilterProps) {
  const [filterData, setFilterData] = useState({
    patientName: "",
    startDate: "",
    endDate: "",
  });

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesPatient = !filterData.patientName || 
      appointment.patientName.toLowerCase().includes(filterData.patientName.toLowerCase());
    
    const appointmentDate = appointment.date;
    const startDate = filterData.startDate ? new Date(filterData.startDate) : null;
    const endDate = filterData.endDate ? new Date(filterData.endDate) : null;
    
    const matchesDateRange = (!startDate || appointmentDate >= startDate) && 
      (!endDate || appointmentDate <= endDate);
    
    return matchesPatient && matchesDateRange;
  });

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
    <Card>
      <CardHeader>
        <CardTitle>Filtrar Agendamentos</CardTitle>
        <CardDescription>
          Busque agendamentos por paciente e período
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="patientName">Nome do Paciente</Label>
            <Input
              id="patientName"
              value={filterData.patientName}
              onChange={(e) => setFilterData({ ...filterData, patientName: e.target.value })}
              placeholder="Digite o nome do paciente"
            />
          </div>
          
          <div>
            <Label htmlFor="startDate">Data Inicial</Label>
            <Input
              id="startDate"
              type="date"
              value={filterData.startDate}
              onChange={(e) => setFilterData({ ...filterData, startDate: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="endDate">Data Final</Label>
            <Input
              id="endDate"
              type="date"
              value={filterData.endDate}
              onChange={(e) => setFilterData({ ...filterData, endDate: e.target.value })}
            />
          </div>
        </div>

        {(filterData.patientName || filterData.startDate || filterData.endDate) && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">
              Resultados ({filteredAppointments.length} agendamentos)
            </h3>
            <div className="space-y-3">
              {filteredAppointments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-2 text-sm font-medium">Nenhum agendamento encontrado</h3>
                  <p className="mt-1 text-sm">
                    Não há agendamentos para os filtros aplicados.
                  </p>
                </div>
              ) : (
                filteredAppointments.map((appointment) => (
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
                          <span>{appointment.date.toLocaleDateString("pt-BR")}</span>
                          <span>•</span>
                          <span>{appointment.time}</span>
                          <span>•</span>
                          <span>{appointment.duration} min</span>
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>
                      {getStatusText(appointment.status)}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
