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
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface EditEvolutionDialogProps {
  evolution: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEvolutionUpdated: () => void;
  patientStatus: string;
}

export function EditEvolutionDialog({ 
  evolution, 
  open, 
  onOpenChange, 
  onEvolutionUpdated,
  patientStatus 
}: EditEvolutionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    queixas_relatos: '',
    conduta_atendimento: '',
    observacoes: '',
    progress_score: 0,
  });

  useEffect(() => {
    if (evolution) {
      setFormData({
        queixas_relatos: evolution.queixas_relatos || '',
        conduta_atendimento: evolution.conduta_atendimento || '',
        observacoes: evolution.observacoes || '',
        progress_score: evolution.progress_score || 0,
      });
    }
  }, [evolution]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (patientStatus !== 'active') {
      toast.error("Não é possível editar evolução de paciente com alta");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('patient_evolutions')
        .update(formData)
        .eq('id', evolution.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating evolution:', error);
        toast.error("Erro ao atualizar evolução: " + error.message);
        return;
      }

      console.log('Evolution updated successfully:', data);
      toast.success("Evolução atualizada com sucesso");
      
      onEvolutionUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error("Erro inesperado ao atualizar evolução");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {patientStatus === 'active' ? 'Editar Evolução' : 'Visualizar Evolução'}
          </DialogTitle>
          <DialogDescription>
            {patientStatus === 'active' 
              ? 'Editar dados da evolução do paciente'
              : 'Visualização da evolução (paciente com alta)'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="queixas_relatos">Queixas e Relatos</Label>
            <Textarea
              id="queixas_relatos"
              value={formData.queixas_relatos}
              onChange={(e) => handleInputChange('queixas_relatos', e.target.value)}
              placeholder="Descreva as queixas e relatos do paciente..."
              disabled={patientStatus !== 'active'}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="conduta_atendimento">Conduta do Atendimento</Label>
            <Textarea
              id="conduta_atendimento"
              value={formData.conduta_atendimento}
              onChange={(e) => handleInputChange('conduta_atendimento', e.target.value)}
              placeholder="Descreva a conduta realizada no atendimento..."
              disabled={patientStatus !== 'active'}
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
              disabled={patientStatus !== 'active'}
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
              disabled={patientStatus !== 'active'}
            />
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              {patientStatus === 'active' ? 'Cancelar' : 'Fechar'}
            </Button>
            {patientStatus === 'active' && (
              <Button 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}