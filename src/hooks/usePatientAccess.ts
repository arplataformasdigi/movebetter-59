
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
      console.log('🔍 Fetching patient access...');
      
      const { data, error } = await supabase
        .from('patient_app_access')
        .select(`
          *,
          patients (name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching patient access:', error);
        toast.error("Erro ao carregar acessos de pacientes");
        return;
      }

      console.log('✅ Patient access loaded:', data?.length || 0);
      setPatientAccess(data || []);
    } catch (error) {
      console.error('💥 Exception in fetchPatientAccess:', error);
      toast.error("Erro inesperado ao carregar acessos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientAccess();

    // Configurar subscription realtime
    console.log('📡 Setting up realtime subscription for patient access');
    const channel = supabase
      .channel('patient-access-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'patient_app_access'
        },
        (payload) => {
          console.log('🔄 Realtime patient access change:', payload);
          // Recarregar dados quando houver mudanças
          fetchPatientAccess();
        }
      )
      .subscribe();

    return () => {
      console.log('📡 Cleaning up patient access subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  const createPatientAccess = async (patientId: string, email: string, password: string) => {
    try {
      console.log('🔐 Creating patient access for patient:', patientId);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Usuário não autenticado");
        return { success: false };
      }

      // Verificar se já existe acesso para este paciente
      console.log('🔍 Checking for existing access...');
      const { data: existingAccess } = await supabase
        .from('patient_app_access')
        .select('id')
        .eq('patient_id', patientId)
        .maybeSingle();

      if (existingAccess) {
        console.log('⚠️ Access already exists for patient');
        toast.error("Já existe um acesso configurado para este paciente");
        return { success: false };
      }

      // Hash da senha
      console.log('🔒 Hashing password...');
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);

      console.log('💾 Inserting patient access...');
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
        console.error('❌ Error creating patient access:', error);
        if (error.code === '23505') {
          toast.error("Já existe um acesso configurado para este paciente");
        } else {
          toast.error("Erro ao criar acesso do paciente");
        }
        return { success: false, error };
      }

      console.log('✅ Patient access created successfully');
      toast.success("Acesso criado com sucesso");
      return { success: true, data };
    } catch (error) {
      console.error('💥 Error in createPatientAccess:', error);
      toast.error("Erro inesperado ao criar acesso");
      return { success: false, error };
    }
  };

  const updatePatientAccess = async (id: string, updates: Partial<PatientAccess>) => {
    try {
      console.log('🔄 Updating patient access:', id);
      
      // Se há uma nova senha, fazer hash dela
      if (updates.password_hash) {
        console.log('🔒 Hashing new password...');
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
        console.error('❌ Error updating patient access:', error);
        toast.error("Erro ao atualizar acesso");
        return { success: false, error };
      }

      console.log('✅ Patient access updated successfully');
      toast.success("Acesso atualizado com sucesso");
      return { success: true, data };
    } catch (error) {
      console.error('💥 Error in updatePatientAccess:', error);
      toast.error("Erro inesperado ao atualizar acesso");
      return { success: false, error };
    }
  };

  const deletePatientAccess = async (id: string) => {
    try {
      console.log('🗑️ Deleting patient access:', id);
      
      const { error } = await supabase
        .from('patient_app_access')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Error deleting patient access:', error);
        toast.error("Erro ao deletar acesso");
        return { success: false, error };
      }

      console.log('✅ Patient access deleted successfully');
      toast.success("Acesso removido com sucesso");
      return { success: true };
    } catch (error) {
      console.error('💥 Error in deletePatientAccess:', error);
      toast.error("Erro inesperado ao deletar acesso");
      return { success: false, error };
    }
  };

  const authenticatePatient = async (email: string, password: string) => {
    try {
      console.log('🔐 Authenticating patient:', email);
      
      const { data, error } = await supabase
        .from('patient_app_access')
        .select(`
          *,
          patients (name, email)
        `)
        .eq('email', email)
        .eq('is_active', true)
        .maybeSingle();

      if (error || !data) {
        console.log('❌ Invalid credentials or inactive access');
        return { success: false, error: 'Credenciais inválidas' };
      }

      // Verificar senha
      console.log('🔍 Verifying password...');
      const isValidPassword = await bcrypt.compare(password, data.password_hash || '');
      
      if (!isValidPassword) {
        console.log('❌ Invalid password');
        return { success: false, error: 'Credenciais inválidas' };
      }

      console.log('✅ Patient authenticated successfully');
      return { success: true, data };
    } catch (error) {
      console.error('💥 Error in authenticatePatient:', error);
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
