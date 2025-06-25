
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { usePackages, Package } from './usePackages';

export function usePackagesRealtime() {
  const packageHooks = usePackages();
  const { packages, setPackages } = packageHooks;

  useEffect(() => {
    const channel = supabase
      .channel('packages-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'packages'
        },
        (payload) => {
          console.log('New package:', payload);
          const newPackage = payload.new as Package;
          setPackages(prev => [newPackage, ...prev]);
          toast.success("Novo pacote criado!");
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'packages'
        },
        (payload) => {
          console.log('Updated package:', payload);
          const updatedPackage = payload.new as Package;
          setPackages(prev => prev.map(p => 
            p.id === updatedPackage.id ? updatedPackage : p
          ));
          toast.success("Pacote atualizado!");
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'packages'
        },
        (payload) => {
          console.log('Deleted package:', payload);
          const deletedPackage = payload.old as Package;
          setPackages(prev => prev.filter(p => p.id !== deletedPackage.id));
          toast.success("Pacote removido!");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [setPackages]);

  return packageHooks;
}
