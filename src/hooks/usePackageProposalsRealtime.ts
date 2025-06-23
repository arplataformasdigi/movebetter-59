
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { usePackageProposals, PackageProposal } from './usePackageProposals';

export function usePackageProposalsRealtime() {
  const proposalHooks = usePackageProposals();
  const { proposals, setProposals } = proposalHooks;

  useEffect(() => {
    const channel = supabase
      .channel('package-proposals-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'package_proposals'
        },
        (payload) => {
          console.log('New proposal:', payload);
          const newProposal = payload.new as PackageProposal;
          // Fetch the complete proposal with package relation
          supabase
            .from('package_proposals')
            .select(`
              *,
              packages (name)
            `)
            .eq('id', newProposal.id)
            .single()
            .then(({ data }) => {
              if (data) {
                setProposals(prev => [data, ...prev]);
                toast.success("Nova proposta gerada!");
              }
            });
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
          console.log('Deleted proposal:', payload);
          const deletedProposal = payload.old as PackageProposal;
          setProposals(prev => prev.filter(p => p.id !== deletedProposal.id));
          toast.info("Proposta removida!");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [setProposals]);

  return proposalHooks;
}
