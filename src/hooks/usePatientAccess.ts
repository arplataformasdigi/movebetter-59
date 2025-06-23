
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import bcrypt from 'bcryptjs';

export interface PatientAccess {
  id: string;
  patient_id: string;
  user_id: string;
  email: string;
  password_hash?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  patients?: {
    name: string;
    email?: string;
  };
}

export function usePatientAccess() {
  const [patientAccess, setPatientAccess] = useState<PatientAccess[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPatientAccess = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('patient_app_access')
        .select(`
          *,
          patients (name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching patient access:', error);
        toast.error("Erro ao carregar acessos de pacientes");
        return;
      }

      setPatientAccess(data || []);
    } catch (error) {
      console.error('Error in fetchPatientAccess:', error);
      toast.error("Erro inesperado ao carregar acessos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientAccess();
  }, []);

  const createPatientAccess = async (patientId: string, email: string, password: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Usuário não autenticado");
        return { success: false };
      }

      // Hash da senha
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);

      const { data, error } = await supabase
        .from('patient_app_access')
        .insert([{
          patient_id: patientId,
          user_id: user.id,
          email: email,
          password_hash: password_hash,
          is_active: true,
          created_by: user.id
        }])
        .select(`
          *,
          patients (name, email)
        `)
        .single();

      if (error) {
        console.error('Error creating patient access:', error);
        toast.error("Erro ao criar acesso do paciente");
        return { success: false, error };
      }

      toast.success("Acesso criado com sucesso");
      await fetchPatientAccess();
      return { success: true, data };
    } catch (error) {
      console.error('Error in createPatientAccess:', error);
      return { success: false, error };
    }
  };

  const updatePatientAccess = async (id: string, updates: Partial<PatientAccess>) => {
    try {
      // Se há uma nova senha, fazer hash dela
      if (updates.password_hash) {
        const saltRounds = 10;
        updates.password_hash = await bcrypt.hash(updates.password_hash, saltRounds);
      }

      const { data, error } = await supabase
        .from('patient_app_access')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          patients (name, email)
        `)
        .single();

      if (error) {
        console.error('Error updating patient access:', error);
        toast.error("Erro ao atualizar acesso");
        return { success: false, error };
      }

      toast.success("Acesso atualizado com sucesso");
      await fetchPatientAccess();
      return { success: true, data };
    } catch (error) {
      console.error('Error in updatePatientAccess:', error);
      return { success: false, error };
    }
  };

  const deletePatientAccess = async (id: string) => {
    try {
      const { error } = await supabase
        .from('patient_app_access')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting patient access:', error);
        toast.error("Erro ao deletar acesso");
        return { success: false, error };
      }

      toast.success("Acesso removido com sucesso");
      await fetchPatientAccess();
      return { success: true };
    } catch (error) {
      console.error('Error in deletePatientAccess:', error);
      return { success: false, error };
    }
  };

  const authenticatePatient = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase
        .from('patient_app_access')
        .select(`
          *,
          patients (name, email)
        `)
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        return { success: false, error: 'Credenciais inválidas' };
      }

      // Verificar senha
      const isValidPassword = await bcrypt.compare(password, data.password_hash || '');
      
      if (!isValidPassword) {
        return { success: false, error: 'Credenciais inválidas' };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error in authenticatePatient:', error);
      return { success: false, error: 'Erro na autenticação' };
    }
  };

  return {
    patientAccess,
    isLoading,
    fetchPatientAccess,
    createPatientAccess,
    updatePatientAccess,
    deletePatientAccess,
    authenticatePatient,
  };
}
