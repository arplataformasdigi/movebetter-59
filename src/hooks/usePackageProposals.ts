
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PackageProposal {
  id: string;
  package_id?: string;
  patient_name: string;
  package_price: number;
  transport_cost: number;
  other_costs: number;
  other_costs_note?: string;
  payment_method: string;
  installments: number;
  final_price: number;
  created_date: string;
  expiry_date?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  packages?: {
    name: string;
  };
}

export function usePackageProposals() {
  const [proposals, setProposals] = useState<PackageProposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchProposals = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('package_proposals')
        .select(`
          *,
          packages (name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching proposals:', error);
        toast({
          title: "Erro ao carregar propostas",
          description: "Não foi possível carregar a lista de propostas",
          variant: "destructive",
        });
        return;
      }

      setProposals(data || []);
    } catch (error) {
      console.error('Error in fetchProposals:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao carregar as propostas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const addProposal = async (proposalData: Omit<PackageProposal, 'id' | 'created_at' | 'updated_at' | 'packages'>) => {
    try {
      const { data, error } = await supabase
        .from('package_proposals')
        .insert([proposalData])
        .select(`
          *,
          packages (name)
        `)
        .single();

      if (error) {
        console.error('Error adding proposal:', error);
        toast({
          title: "Erro ao adicionar proposta",
          description: "Não foi possível adicionar a proposta",
          variant: "destructive",
        });
        return { success: false, error };
      }

      setProposals(prev => [data, ...prev]);
      toast({
        title: "Proposta adicionada",
        description: "Proposta foi adicionada com sucesso",
      });
      return { success: true, data };
    } catch (error) {
      console.error('Error in addProposal:', error);
      return { success: false, error };
    }
  };

  const deleteProposal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('package_proposals')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting proposal:', error);
        toast({
          title: "Erro ao deletar proposta",
          description: "Não foi possível deletar a proposta",
          variant: "destructive",
        });
        return { success: false, error };
      }

      setProposals(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Proposta removida",
        description: "Proposta foi removida com sucesso",
      });
      return { success: true };
    } catch (error) {
      console.error('Error in deleteProposal:', error);
      return { success: false, error };
    }
  };

  return {
    proposals,
    isLoading,
    fetchProposals,
    addProposal,
    deleteProposal,
  };
}
