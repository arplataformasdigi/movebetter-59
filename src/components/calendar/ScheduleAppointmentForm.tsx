
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAppointments } from "@/hooks/useAppointments";

interface Patient {
  id: string;
  name: string;
}

interface ScheduleAppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date | null;
  patients: Patient[];
}

export function ScheduleAppointmentForm({ isOpen, onClose, selectedDate, patients }: ScheduleAppointmentFormProps) {
  const { addAppointment } = useAppointments();
  const [formData, setFormData] = useState({
    patientId: "",
    sessionType: "",
    date: selectedDate ? selectedDate.toISOString().split('T')[0] : "",
    time: "",
    duration: 60,
    observations: "",
  });

  React.useEffect(() => {
    if (selectedDate) {
      // Adjust for timezone to prevent date shifting
      const localDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
      setFormData(prev => ({
        ...prev,
        date: localDate.toISOString().split('T')[0]
      }));
    }
  }, [selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patientId || !formData.sessionType || !formData.date || !formData.time) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const appointmentData = {
      patient_id: formData.patientId,
      appointment_date: formData.date,
      appointment_time: formData.time,
      session_type: formData.sessionType,
      duration_minutes: formData.duration,
      observations: formData.observations,
      status: 'scheduled' as const,
    };

    const result = await addAppointment(appointmentData);
    
    if (result.success) {
      toast.success("Agendamento criado com sucesso!");
      onClose();
      setFormData({
        patientId: "",
        sessionType: "",
        date: "",
        time: "",
        duration: 60,
        observations: "",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agendar Nova Sessão</DialogTitle>
          <DialogDescription>
            Preencha os dados para criar um novo agendamento.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="patientId">Nome do Paciente *</Label>
            <Select value={formData.patientId} onValueChange={(value) => setFormData(prev => ({ ...prev, patientId: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o paciente" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="sessionType">Tipo de Sessão *</Label>
            <Input
              id="sessionType"
              value={formData.sessionType}
              onChange={(e) => setFormData(prev => ({ ...prev, sessionType: e.target.value }))}
              placeholder="Ex: Sessão de fisioterapia"
            />
          </div>
          
          <div>
            <Label htmlFor="date">Data *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="time">Horário *</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="duration">Duração (minutos)</Label>
            <Select value={formData.duration.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: parseInt(value) }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutos</SelectItem>
                <SelectItem value="45">45 minutos</SelectItem>
                <SelectItem value="60">60 minutos</SelectItem>
                <SelectItem value="90">90 minutos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="observations">Observações</Label>
            <Textarea
              id="observations"
              value={formData.observations}
              onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
              placeholder="Observações adicionais (opcional)"
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Agendar Sessão
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
