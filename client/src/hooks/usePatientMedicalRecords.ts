
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface MedicalRecord {
  id: string;
  patient_id: string;
  age: number;
  gender: string;
  weight: number;
  height: number;
  birth_date: string;
  profession: string;
  marital_status: string;
  visit_reason: string;
  current_condition: string;
  medical_history: string;
  treatment_plan: string;
  evaluation?: string;
  status: 'active' | 'discharged';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function usePatientMedicalRecords(patientId?: string) {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const channelRef = useRef<any>(null);

  const fetchMedicalRecords = async () => {
    if (!patientId) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('patient_medical_records')
        .select('*')
        .eq('patient_id', patientId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching medical records:', error);
        toast.error("Erro ao carregar prontuários");
        return;
      }

      // Type casting to ensure status is properly typed
      const typedData = (data || []).map(record => ({
        ...record,
        status: (record.status || 'active') as 'active' | 'discharged'
      }));

      setMedicalRecords(typedData);
    } catch (error) {
      console.error('Error in fetchMedicalRecords:', error);
      toast.error("Erro inesperado ao carregar prontuários");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicalRecords();

    if (patientId) {
      // Cleanup previous channel if it exists
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      // Setup realtime subscription with unique channel name including patientId
      const channelName = `medical_records_changes_${patientId}_${Date.now()}_${Math.random()}`;
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'patient_medical_records'
          },
          () => {
            fetchMedicalRecords();
          }
        )
        .subscribe();

      channelRef.current = channel;

      return () => {
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }
      };
    }
  }, [patientId]);

  const addMedicalRecord = async (recordData: Omit<MedicalRecord, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Check if there's already an active medical record
      const activeRecords = medicalRecords.filter(record => record.status === 'active');
      if (activeRecords.length > 0) {
        toast.error("Já existe um prontuário ativo para este paciente. É necessário dar alta antes de criar um novo.");
        return { success: false, error: "Active record exists" };
      }

      const { data, error } = await supabase
        .from('patient_medical_records')
        .insert([{
          ...recordData,
          status: 'active'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding medical record:', error);
        toast.error("Erro ao adicionar prontuário");
        return { success: false, error };
      }

      toast.success("Prontuário adicionado com sucesso");
      return { success: true, data };
    } catch (error) {
      console.error('Error in addMedicalRecord:', error);
      toast.error("Erro inesperado ao adicionar prontuário");
      return { success: false, error };
    }
  };

  const updateMedicalRecord = async (recordId: string, updates: Partial<MedicalRecord>) => {
    try {
      const { data, error } = await supabase
        .from('patient_medical_records')
        .update(updates)
        .eq('id', recordId)
        .select()
        .single();

      if (error) {
        console.error('Error updating medical record:', error);
        toast.error("Erro ao atualizar prontuário");
        return { success: false, error };
      }

      toast.success("Prontuário atualizado com sucesso");
      return { success: true, data };
    } catch (error) {
      console.error('Error in updateMedicalRecord:', error);
      toast.error("Erro inesperado ao atualizar prontuário");
      return { success: false, error };
    }
  };

  const dischargeMedicalRecord = async (recordId: string) => {
    try {
      const { data, error } = await supabase
        .from('patient_medical_records')
        .update({ status: 'discharged' })
        .eq('id', recordId)
        .select()
        .single();

      if (error) {
        console.error('Error discharging medical record:', error);
        toast.error("Erro ao dar alta do prontuário");
        return { success: false, error };
      }

      toast.success("Alta dada com sucesso");
      return { success: true, data };
    } catch (error) {
      console.error('Error in dischargeMedicalRecord:', error);
      toast.error("Erro inesperado ao dar alta do prontuário");
      return { success: false, error };
    }
  };

  const deleteMedicalRecord = async (recordId: string) => {
    try {
      const { data, error } = await supabase
        .from('patient_medical_records')
        .update({ is_active: false })
        .eq('id', recordId)
        .select()
        .single();

      if (error) {
        console.error('Error deleting medical record:', error);
        toast.error("Erro ao excluir prontuário");
        return { success: false, error };
      }

      toast.success("Prontuário excluído com sucesso");
      return { success: true, data };
    } catch (error) {
      console.error('Error in deleteMedicalRecord:', error);
      toast.error("Erro inesperado ao excluir prontuário");
      return { success: false, error };
    }
  };

  const getActiveRecord = () => {
    return medicalRecords.find(record => record.status === 'active');
  };

  const hasActiveRecord = () => {
    return medicalRecords.some(record => record.status === 'active');
  };

  return {
    medicalRecords,
    isLoading,
    fetchMedicalRecords,
    addMedicalRecord,
    updateMedicalRecord,
    dischargeMedicalRecord,
    deleteMedicalRecord,
    getActiveRecord,
    hasActiveRecord,
  };
}
