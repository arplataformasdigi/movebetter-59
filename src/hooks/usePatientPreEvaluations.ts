
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PreEvaluation {
  id: string;
  patient_id: string;
  profissao: string;
  atividade_fisica: string;
  hobby: string;
  queixa_principal: string;
  tempo_problema: string;
  inicio_problema: string;
  tratamento_anterior: string;
  descricao_dor: string;
  escala_dor: string;
  irradiacao_dor: string;
  piora_dor: string;
  alivio_dor: string;
  interferencia_dor: string;
  diagnostico_medico: string;
  exames_recentes: string;
  condicoes_saude: string;
  cirurgias: string;
  medicamentos?: string;
  alergias?: string;
  doencas_familiares: string;
  condicoes_similares: string;
  alimentacao: string;
  padrao_sono: string;
  alcool: string;
  fumante: string;
  ingestao_agua: string;
  tempo_sentado: string;
  nivel_estresse?: string;
  questoes_emocionais?: string;
  impacto_qualidade_vida?: string;
  expectativas_tratamento?: string;
  exercicios_casa: string;
  restricoes?: string;
  dificuldade_dia: string;
  dispositivo_auxilio: string;
  dificuldade_equilibrio: string;
  limitacao_movimento: string;
  info_adicional?: string;
  duvidas_fisioterapia?: string;
  created_at: string;
  updated_at: string;
}

export function usePatientPreEvaluations(patientId?: string) {
  const [preEvaluations, setPreEvaluations] = useState<PreEvaluation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPreEvaluations = async () => {
    if (!patientId) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('patient_pre_evaluations')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching pre evaluations:', error);
        toast.error("Erro ao carregar pré-avaliações");
        return;
      }

      setPreEvaluations(data || []);
    } catch (error) {
      console.error('Error in fetchPreEvaluations:', error);
      toast.error("Erro inesperado ao carregar pré-avaliações");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPreEvaluations();

    if (patientId) {
      // Setup realtime subscription
      const channel = supabase
        .channel('pre_evaluations_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'patient_pre_evaluations'
          },
          () => {
            fetchPreEvaluations();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [patientId]);

  const addPreEvaluation = async (evaluationData: Omit<PreEvaluation, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('patient_pre_evaluations')
        .insert([evaluationData])
        .select()
        .single();

      if (error) {
        console.error('Error adding pre evaluation:', error);
        toast.error("Erro ao adicionar pré-avaliação");
        return { success: false, error };
      }

      toast.success("Pré-avaliação adicionada com sucesso");
      return { success: true, data };
    } catch (error) {
      console.error('Error in addPreEvaluation:', error);
      toast.error("Erro inesperado ao adicionar pré-avaliação");
      return { success: false, error };
    }
  };

  const updatePreEvaluation = async (evaluationId: string, updates: Partial<PreEvaluation>) => {
    try {
      const { data, error } = await supabase
        .from('patient_pre_evaluations')
        .update(updates)
        .eq('id', evaluationId)
        .select()
        .single();

      if (error) {
        console.error('Error updating pre evaluation:', error);
        toast.error("Erro ao atualizar pré-avaliação");
        return { success: false, error };
      }

      toast.success("Pré-avaliação atualizada com sucesso");
      return { success: true, data };
    } catch (error) {
      console.error('Error in updatePreEvaluation:', error);
      toast.error("Erro inesperado ao atualizar pré-avaliação");
      return { success: false, error };
    }
  };

  const deletePreEvaluation = async (evaluationId: string) => {
    try {
      const { error } = await supabase
        .from('patient_pre_evaluations')
        .delete()
        .eq('id', evaluationId);

      if (error) {
        console.error('Error deleting pre evaluation:', error);
        toast.error("Erro ao excluir pré-avaliação");
        return { success: false, error };
      }

      toast.success("Pré-avaliação excluída com sucesso");
      return { success: true };
    } catch (error) {
      console.error('Error in deletePreEvaluation:', error);
      toast.error("Erro inesperado ao excluir pré-avaliação");
      return { success: false, error };
    }
  };

  return {
    preEvaluations,
    isLoading,
    fetchPreEvaluations,
    addPreEvaluation,
    updatePreEvaluation,
    deletePreEvaluation,
  };
}
