import React, { useState, useEffect } from 'react';
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { usePatientMedicalRecords } from '@/hooks/usePatientMedicalRecords';

interface EvolutionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
  onEvolutionAdded: () => void;
  patientStatus: string;
}

export function EvolutionForm({ 
  open, 
  onOpenChange, 
  patientId, 
  onEvolutionAdded, 
  patientStatus 
}: EvolutionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    medical_record_id: '',
    queixas_relatos: '',
    conduta_atendimento: '',
    observacoes: '',
    progress_score: 0,
  });

  const { medicalRecords } = usePatientMedicalRecords(patientId);

  // Filtrar apenas prontuários ativos
  const activeMedicalRecords = medicalRecords.filter(record => record.status === 'active');

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (patientStatus !== 'active') {
      toast.error("Não é possível adicionar evolução para paciente com alta");
      return;
    }

    if (!formData.medical_record_id) {
      toast.error("Selecione um prontuário ativo");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('patient_evolutions')
        .insert([{
          patient_id: patientId,
          ...formData,
          is_active: true
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding evolution:', error);
        toast.error("Erro ao adicionar evolução: " + error.message);
        return;
      }

      console.log('Evolution added successfully:', data);
      toast.success("Evolução adicionada com sucesso");
      
      // Reset form
      setFormData({
        medical_record_id: '',
        queixas_relatos: '',
        conduta_atendimento: '',
        observacoes: '',
        progress_score: 0,
      });
      
      onEvolutionAdded();
      onOpenChange(false);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error("Erro inesperado ao adicionar evolução");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nova Evolução</DialogTitle>
          <DialogDescription>
            Adicionar nova evolução do paciente
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="medical_record_id">Prontuário Ativo *</Label>
            <Select 
              value={formData.medical_record_id} 
              onValueChange={(value) => handleInputChange('medical_record_id', value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um prontuário ativo" />
              </SelectTrigger>
              <SelectContent>
                {activeMedicalRecords.map((record) => (
                  <SelectItem key={record.id} value={record.id}>
                    Prontuário - {new Date(record.created_at).toLocaleDateString('pt-BR')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {activeMedicalRecords.length === 0 && (
              <p className="text-sm text-red-600">
                Nenhum prontuário ativo encontrado. Crie um prontuário ativo primeiro.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="queixas_relatos">Queixas e Relatos *</Label>
            <Textarea
              id="queixas_relatos"
              value={formData.queixas_relatos}
              onChange={(e) => handleInputChange('queixas_relatos', e.target.value)}
              placeholder="Descreva as queixas e relatos do paciente..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="conduta_atendimento">Conduta do Atendimento *</Label>
            <Textarea
              id="conduta_atendimento"
              value={formData.conduta_atendimento}
              onChange={(e) => handleInputChange('conduta_atendimento', e.target.value)}
              placeholder="Descreva a conduta realizada no atendimento..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => handleInputChange('observacoes', e.target.value)}
              placeholder="Observações adicionais..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="progress_score">Pontuação de Progresso (0-100)</Label>
            <Input
              id="progress_score"
              type="number"
              min="0"
              max="100"
              value={formData.progress_score}
              onChange={(e) => handleInputChange('progress_score', parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || activeMedicalRecords.length === 0}
            >
              {isLoading ? "Salvando..." : "Salvar Evolução"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}