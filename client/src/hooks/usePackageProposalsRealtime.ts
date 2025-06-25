
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getCurrentDate } from '@/utils/dateUtils';

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
  status: 'pending' | 'approved' | 'rejected';
  approved_at?: string;
  approved_by?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  package_name?: string;
  packages?: {
    name: string;
  };
}

export function usePackageProposalsRealtime() {
  const [proposals, setProposals] = useState<PackageProposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const channelRef = useRef<any>(null);

  const fetchProposals = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching proposals from Supabase...');
      
      const { data, error } = await supabase
        .from('package_proposals')
        .select(`
          *,
          packages (name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching proposals:', error);
        toast.error("Erro ao carregar propostas: " + error.message);
        return;
      }

      console.log('Proposals fetched successfully:', data);
      setProposals(data || []);
    } catch (error) {
      console.error('Error in fetchProposals:', error);
      toast.error("Erro inesperado ao carregar propostas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();

    // Cleanup previous channel if it exists
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Setup realtime subscription
    const channelName = `package_proposals_realtime_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    console.log('Setting up proposals realtime subscription with channel:', channelName);
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'package_proposals'
        },
        async (payload) => {
          console.log('New proposal detected:', payload);
          
          // Fetch the complete proposal with package relation
          const { data: newProposal } = await supabase
            .from('package_proposals')
            .select(`
              *,
              packages (name)
            `)
            .eq('id', payload.new.id)
            .single();

          if (newProposal) {
            setProposals(prev => {
              // Check if proposal already exists to avoid duplicates
              const exists = prev.find(p => p.id === newProposal.id);
              if (exists) return prev;
              
              return [newProposal, ...prev];
            });
            toast.success("Nova proposta criada!");
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'package_proposals'
        },
        async (payload) => {
          console.log('Updated proposal detected:', payload);
          
          const { data: updatedProposal } = await supabase
            .from('package_proposals')
            .select(`
              *,
              packages (name)
            `)
            .eq('id', payload.new.id)
            .single();

          if (updatedProposal) {
            setProposals(prev => prev.map(p => 
              p.id === updatedProposal.id ? updatedProposal : p
            ));
            toast.success("Proposta atualizada!");
          }
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
          console.log('Deleted proposal detected:', payload);
          setProposals(prev => prev.filter(p => p.id !== payload.old.id));
          toast.info("Proposta removida!");
        }
      )
      .subscribe((status) => {
        console.log('Proposals channel subscription status:', status);
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        console.log('Cleaning up proposals realtime subscription');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, []);

  const addProposal = async (proposalData: any) => {
    try {
      console.log('Adding proposal with data:', proposalData);
      
      // Convert dates to ISO format (YYYY-MM-DD)
      const formatDateToISO = (dateString: string) => {
        if (!dateString) return null;
        
        // Check if it's already in ISO format
        if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
          return dateString;
        }
        
        // If it's in Brazilian format (DD/MM/YYYY), convert it
        if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
          const [day, month, year] = dateString.split('/');
          return `${year}-${month}-${day}`;
        }
        
        // If it's a date object or other format, try to parse it
        try {
          const date = new Date(dateString);
          if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0];
          }
        } catch (e) {
          console.error('Error parsing date:', e);
        }
        
        return getCurrentDate(); // fallback to current date
      };

      // Map data to Supabase table format with proper date formatting
      const supabaseProposal = {
        package_id: proposalData.packageId,
        package_name: proposalData.packageName,
        patient_name: proposalData.patientName,
        package_price: proposalData.packagePrice,
        transport_cost: proposalData.transportCost || 0,
        other_costs: proposalData.otherCosts || 0,
        other_costs_note: proposalData.otherCostsNote || null,
        payment_method: proposalData.paymentMethod,
        installments: proposalData.installments || 1,
        final_price: proposalData.finalPrice,
        status: 'pending',
        created_date: formatDateToISO(proposalData.purchaseDate || getCurrentDate()),
        expiry_date: formatDateToISO(proposalData.expiryDate) || null,
      };

      console.log('Formatted proposal data for Supabase:', supabaseProposal);

      const { data, error } = await supabase
        .from('package_proposals')
        .insert([supabaseProposal])
        .select(`
          *,
          packages (name)
        `)
        .single();

      if (error) {
        console.error('Error adding proposal:', error);
        toast.error("Erro ao adicionar proposta: " + error.message);
        return { success: false, error };
      }

      console.log('Proposal added successfully:', data);
      toast.success("Proposta adicionada com sucesso!");
      return { success: true, data };
    } catch (error) {
      console.error('Error in addProposal:', error);
      toast.error("Erro inesperado ao adicionar proposta");
      return { success: false, error };
    }
  };

  const deleteProposal = async (id: string) => {
    try {
      console.log('Deleting proposal with id:', id);
      
      const { error } = await supabase
        .from('package_proposals')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting proposal:', error);
        toast.error("Erro ao deletar proposta: " + error.message);
        return { success: false, error };
      }

      console.log('Proposal deleted successfully');
      toast.success("Proposta removida com sucesso!");
      return { success: true };
    } catch (error) {
      console.error('Error in deleteProposal:', error);
      toast.error("Erro inesperado ao deletar proposta");
      return { success: false, error };
    }
  };

  const approveProposal = async (proposalId: string) => {
    try {
      console.log('Approving proposal with ID:', proposalId);
      
      const { data, error } = await supabase
        .from('package_proposals')
        .update({ 
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: 'current_user'
        })
        .eq('id', proposalId)
        .select(`
          *,
          packages (name)
        `)
        .single();

      if (error) {
        console.error('Error approving proposal:', error);
        toast.error("Erro ao aprovar proposta");
        return { success: false, error: error.message };
      }

      console.log('Proposal approved successfully:', data);
      toast.success("Proposta aprovada com sucesso!");
      return data;
    } catch (error) {
      console.error('Error in approveProposal:', error);
      toast.error("Erro ao aprovar proposta");
      return { success: false, error: error.message };
    }
  };

  return {
    proposals,
    setProposals,
    isLoading,
    fetchProposals,
    addProposal,
    approveProposal,
    deleteProposal,
  };
}
