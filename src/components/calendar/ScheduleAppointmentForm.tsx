
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface ScheduleAppointmentFormProps {
  onScheduleAppointment: (appointment: any) => void;
}

export function ScheduleAppointmentForm({ onScheduleAppointment }: ScheduleAppointmentFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientName: "",
    title: "",
    date: "",
    time: "",
    duration: 60,
    observations: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patientName || !formData.title || !formData.date || !formData.time) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const newAppointment = {
      id: Date.now().toString(),
      patientId: Date.now().toString(),
      patientName: formData.patientName,
      title: formData.title,
      date: new Date(formData.date),
      time: formData.time,
      duration: formData.duration,
      observations: formData.observations,
      status: "scheduled",
    };

    onScheduleAppointment(newAppointment);
    toast.success("Agendamento criado com sucesso!");
    setOpen(false);
    setFormData({
      patientName: "",
      title: "",
      date: "",
      time: "",
      duration: 60,
      observations: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Agendar Nova Sessão
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agendar Nova Sessão</DialogTitle>
          <DialogDescription>
            Preencha os dados para criar um novo agendamento.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="patientName">Nome do Paciente *</Label>
            <Input
              id="patientName"
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              placeholder="Digite o nome do paciente"
            />
          </div>
          
          <div>
            <Label htmlFor="title">Tipo de Sessão *</Label>
            <Select value={formData.title} onValueChange={(value) => setFormData({ ...formData, title: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Avaliação Inicial">Avaliação Inicial</SelectItem>
                <SelectItem value="Sessão de Fisioterapia">Sessão de Fisioterapia</SelectItem>
                <SelectItem value="Sessão de Reabilitação">Sessão de Reabilitação</SelectItem>
                <SelectItem value="Reavaliação">Reavaliação</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="date">Data *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="time">Horário *</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="duration">Duração (minutos)</Label>
            <Select value={formData.duration.toString()} onValueChange={(value) => setFormData({ ...formData, duration: parseInt(value) })}>
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
              onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
              placeholder="Observações adicionais (opcional)"
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
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
