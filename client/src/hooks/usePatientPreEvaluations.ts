
import { useState, useEffect, useRef } from 'react';

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
  const channelRef = useRef<any>(null);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  const fetchPreEvaluations = async () => {
    if (!patientId) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      console.log('Fetching pre-evaluations for patient:', patientId);
      
      const { data, error } = await supabase
        .from('patient_pre_evaluations')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching pre evaluations:', error);
        toast.error("Erro ao carregar pré-avaliações: " + error.message);
        return;
      }

      console.log('Pre-evaluations fetched successfully:', data);
      if (isMountedRef.current) {
        setPreEvaluations(data || []);
      }
    } catch (error) {
      console.error('Error in fetchPreEvaluations:', error);
      if (isMountedRef.current) {
        toast.error("Erro inesperado ao carregar pré-avaliações");
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  const debouncedFetch = () => {
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }
    fetchTimeoutRef.current = setTimeout(() => {
      fetchPreEvaluations();
    }, 500);
  };

  useEffect(() => {
    isMountedRef.current = true;
    fetchPreEvaluations();

    if (patientId) {
      // Cleanup previous channel if it exists
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      // Setup realtime subscription with unique channel name including patientId
      const channelName = `pre_evaluations_${patientId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'patient_pre_evaluations',
            filter: `patient_id=eq.${patientId}`
          },
          (payload) => {
            console.log('Pre-evaluation realtime event:', payload);
            if (isMountedRef.current) {
              debouncedFetch();
            }
          }
        )
        .subscribe();

      channelRef.current = channel;
    }

    return () => {
      isMountedRef.current = false;
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [patientId]);

  const addPreEvaluation = async (evaluationData: Omit<PreEvaluation, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Adding pre-evaluation:', evaluationData);
      
      // Garantir que todos os campos obrigatórios tenham valores válidos
      const cleanedData = {
        ...evaluationData,
        profissao: evaluationData.profissao || '',
        atividade_fisica: evaluationData.atividade_fisica || '',
        hobby: evaluationData.hobby || '',
        queixa_principal: evaluationData.queixa_principal || '',
        tempo_problema: evaluationData.tempo_problema || '',
        inicio_problema: evaluationData.inicio_problema || '',
        tratamento_anterior: evaluationData.tratamento_anterior || '',
        descricao_dor: evaluationData.descricao_dor || '',
        escala_dor: evaluationData.escala_dor || '',
        irradiacao_dor: evaluationData.irradiacao_dor || '',
        piora_dor: evaluationData.piora_dor || '',
        alivio_dor: evaluationData.alivio_dor || '',
        interferencia_dor: evaluationData.interferencia_dor || '',
        diagnostico_medico: evaluationData.diagnostico_medico || '',
        exames_recentes: evaluationData.exames_recentes || '',
        condicoes_saude: evaluationData.condicoes_saude || '',
        cirurgias: evaluationData.cirurgias || '',
        doencas_familiares: evaluationData.doencas_familiares || '',
        condicoes_similares: evaluationData.condicoes_similares || '',
        alimentacao: evaluationData.alimentacao || '',
        padrao_sono: evaluationData.padrao_sono || '',
        alcool: evaluationData.alcool || '',
        fumante: evaluationData.fumante || '',
        ingestao_agua: evaluationData.ingestao_agua || '',
        tempo_sentado: evaluationData.tempo_sentado || '',
        exercicios_casa: evaluationData.exercicios_casa || '',
        dificuldade_dia: evaluationData.dificuldade_dia || '',
        dispositivo_auxilio: evaluationData.dispositivo_auxilio || '',
        dificuldade_equilibrio: evaluationData.dificuldade_equilibrio || '',
        limitacao_movimento: evaluationData.limitacao_movimento || '',
      };

      const { data, error } = await supabase
        .from('patient_pre_evaluations')
        .insert([cleanedData])
        .select()
        .single();

      if (error) {
        console.error('Error adding pre evaluation:', error);
        toast.error("Erro ao adicionar pré-avaliação: " + error.message);
        return { success: false, error };
      }

      console.log('Pre-evaluation added successfully:', data);
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
      console.log('Updating pre-evaluation:', evaluationId, updates);
      const { data, error } = await supabase
        .from('patient_pre_evaluations')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', evaluationId)
        .select()
        .single();

      if (error) {
        console.error('Error updating pre evaluation:', error);
        toast.error("Erro ao atualizar pré-avaliação");
        return { success: false, error };
      }

      console.log('Pre-evaluation updated successfully:', data);
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
      console.log('Deleting pre-evaluation:', evaluationId);
      const { error } = await supabase
        .from('patient_pre_evaluations')
        .delete()
        .eq('id', evaluationId);

      if (error) {
        console.error('Error deleting pre evaluation:', error);
        toast.error("Erro ao excluir pré-avaliação");
        return { success: false, error };
      }

      console.log('Pre-evaluation deleted successfully');
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
