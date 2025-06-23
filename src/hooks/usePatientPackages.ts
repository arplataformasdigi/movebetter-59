
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PatientPackage {
  id: string;
  patient_id: string;
  package_id: string;
  final_price: number;
  status: string;
  assigned_date: string;
  expiry_date?: string;
  sessions_used: number;
  created_at: string;
  packages?: {
    name: string;
    description?: string;
    price: number;
    sessions_included: number;
  };
}

export function usePatientPackages() {
  const [patientPackages, setPatientPackages] = useState<PatientPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPatientPackages = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('patient_packages')
        .select(`
          *,
          packages (name, description, price, sessions_included)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching patient packages:', error);
        toast.error("Erro ao carregar pacotes dos pacientes");
        return;
      }

      setPatientPackages(data || []);
    } catch (error) {
      console.error('Error in fetchPatientPackages:', error);
      toast.error("Erro inesperado ao carregar pacotes dos pacientes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientPackages();

    // Setup realtime subscription
    const channel = supabase
      .channel('patient_packages_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'patient_packages'
        },
        () => {
          fetchPatientPackages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const assignPackage = async (assignment: Omit<PatientPackage, 'id' | 'created_at' | 'packages'>) => {
    try {
      const { data, error } = await supabase
        .from('patient_packages')
        .insert([assignment])
        .select(`
          *,
          packages (name, description, price, sessions_included)
        `)
        .single();

      if (error) {
        console.error('Error assigning package:', error);
        toast.error("Erro ao atribuir pacote");
        return { success: false, error };
      }

      toast.success("Pacote atribuído com sucesso");
      return { success: true, data };
    } catch (error) {
      console.error('Error in assignPackage:', error);
      toast.error("Erro inesperado ao atribuir pacote");
      return { success: false, error };
    }
  };

  const getPatientPackage = (patientId: string) => {
    return patientPackages.find(pkg => pkg.patient_id === patientId && pkg.status === 'active');
  };

  return {
    patientPackages,
    isLoading,
    assignPackage,
    getPatientPackage,
    fetchPatientPackages,
  };
}
