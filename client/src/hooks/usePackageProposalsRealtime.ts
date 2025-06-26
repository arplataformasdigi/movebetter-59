
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PackageProposal {
  id: string;
  patient_name: string;
  package_id: string;
  package_name?: string;
  package_price: number;
  transport_cost?: number;
  other_costs?: number;
  other_costs_note?: string;
  installments?: number;
  final_price: number;
  payment_method: string;
  created_date?: string;
  expiry_date?: string;
  created_by?: string;
  created_at: string;
  updated_at?: string;
}

interface CreatePackageProposalData {
  patient_name: string;
  package_id: string;
  package_name?: string;
  package_price: number;
  transport_cost?: number;
  other_costs?: number;
  other_costs_note?: string;
  installments?: number;
  final_price: number;
  payment_method: string;
  created_date?: string;
  expiry_date?: string;
}

export function usePackageProposalsRealtime() {
  const [proposals, setProposals] = useState<PackageProposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProposals = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('package_proposals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching proposals:', error);
        toast.error('Erro ao buscar propostas');
        return;
      }

      console.log('Fetched proposals:', data);
      setProposals(data || []);
    } catch (error) {
      console.error('Error in fetchProposals:', error);
      toast.error('Erro inesperado ao buscar propostas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addProposal = useCallback(async (proposalData: CreatePackageProposalData) => {
    console.log('Creating proposal:', proposalData);
    
    try {
      const { data, error } = await supabase
        .from('package_proposals')
        .insert(proposalData)
        .select()
        .single();

      if (error) {
        console.error('Error creating proposal:', error);
        toast.error('Erro ao criar proposta');
        return { success: false, error };
      }

      console.log('Proposal created successfully:', data);
      toast.success('Proposta criada com sucesso!');
      
      // Update local state
      setProposals(prev => [data, ...prev]);
      
      return { success: true, data };
    } catch (error: unknown) {
      console.error('Error in addProposal:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Erro inesperado ao criar proposta: ${errorMessage}`);
      return { success: false, error };
    }
  }, []);

  const updateProposal = useCallback(async (id: string, updates: Partial<PackageProposal>) => {
    console.log('Updating proposal:', id, updates);
    
    try {
      const { data, error } = await supabase
        .from('package_proposals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating proposal:', error);
        toast.error('Erro ao atualizar proposta');
        return { success: false, error };
      }

      console.log('Proposal updated successfully:', data);
      toast.success('Proposta atualizada com sucesso!');
      
      // Update local state
      setProposals(prev => 
        prev.map(proposal => proposal.id === id ? data : proposal)
      );
      
      return { success: true, data };
    } catch (error) {
      console.error('Error in updateProposal:', error);
      toast.error('Erro inesperado ao atualizar proposta');
      return { success: false, error };
    }
  }, []);

  const deleteProposal = useCallback(async (id: string) => {
    console.log('Deleting proposal:', id);
    
    try {
      const { error } = await supabase
        .from('package_proposals')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting proposal:', error);
        toast.error('Erro ao excluir proposta');
        return { success: false, error };
      }

      console.log('Proposal deleted successfully');
      toast.success('Proposta excluída com sucesso!');
      
      // Update local state
      setProposals(prev => prev.filter(proposal => proposal.id !== id));
      
      return { success: true };
    } catch (error) {
      console.error('Error in deleteProposal:', error);
      toast.error('Erro inesperado ao excluir proposta');
      return { success: false, error };
    }
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    fetchProposals();

    const channel = supabase
      .channel('package_proposals_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'package_proposals'
        },
        (payload) => {
          console.log('New proposal inserted:', payload.new);
          setProposals(prev => [payload.new as PackageProposal, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'package_proposals'
        },
        (payload) => {
          console.log('Proposal updated:', payload.new);
          setProposals(prev => 
            prev.map(proposal => 
              proposal.id === payload.new.id ? payload.new as PackageProposal : proposal
            )
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'package_proposals'
        },
        (payload) => {
          console.log('Proposal deleted:', payload.old);
          setProposals(prev => prev.filter(proposal => proposal.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchProposals]);

  return {
    proposals,
    isLoading,
    fetchProposals,
    addProposal,
    updateProposal,
    deleteProposal
  };
}
