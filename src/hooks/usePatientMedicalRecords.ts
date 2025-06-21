
import { useState, useEffect } from 'react';
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
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function usePatientMedicalRecords(patientId?: string) {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

      setMedicalRecords(data || []);
    } catch (error) {
      console.error('Error in fetchMedicalRecords:', error);
      toast.error("Erro inesperado ao carregar prontuários");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicalRecords();
  }, [patientId]);

  const addMedicalRecord = async (recordData: Omit<MedicalRecord, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('patient_medical_records')
        .insert([recordData])
        .select()
        .single();

      if (error) {
        console.error('Error adding medical record:', error);
        toast.error("Erro ao adicionar prontuário");
        return { success: false, error };
      }

      setMedicalRecords(prev => [data, ...prev]);
      toast.success("Prontuário adicionado com sucesso");
      return { success: true, data };
    } catch (error) {
      console.error('Error in addMedicalRecord:', error);
      toast.error("Erro inesperado ao adicionar prontuário");
      return { success: false, error };
    }
  };

  const closeMedicalRecord = async (recordId: string) => {
    try {
      const { data, error } = await supabase
        .from('patient_medical_records')
        .update({ is_active: false })
        .eq('id', recordId)
        .select()
        .single();

      if (error) {
        console.error('Error closing medical record:', error);
        toast.error("Erro ao encerrar prontuário");
        return { success: false, error };
      }

      setMedicalRecords(prev => prev.filter(record => record.id !== recordId));
      toast.success("Prontuário encerrado com sucesso");
      return { success: true, data };
    } catch (error) {
      console.error('Error in closeMedicalRecord:', error);
      toast.error("Erro inesperado ao encerrar prontuário");
      return { success: false, error };
    }
  };

  return {
    medicalRecords,
    isLoading,
    fetchMedicalRecords,
    addMedicalRecord,
    closeMedicalRecord,
  };
}
