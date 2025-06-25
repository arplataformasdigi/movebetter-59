import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export interface Package {
  id: string;
  name: string;
  description?: string;
  price: number;
  services?: string[];
  sessions_included?: number;
  validity_days?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function usePackagesRealtime() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const channelRef = useRef<any>(null);

  const fetchPackages = async () => {
    try {
      console.log('Fetching packages from Supabase...');
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching packages:', error);
        toast.error("Erro ao carregar pacotes");
        setPackages([]);
      } else {
        console.log('Packages fetched successfully:', data);
        setPackages(data || []);
      }
    } catch (error) {
      console.error('Error in fetchPackages:', error);
      setPackages([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();

    // Set up realtime subscription
    const channelName = `packages_realtime_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    console.log('Setting up packages realtime subscription with channel:', channelName);

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'packages'
        },
        (payload) => {
          console.log('New package detected:', payload);
          const newPackage = payload.new as Package;
          setPackages(prev => [newPackage, ...prev]);
          toast.success("Novo pacote adicionado!");
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
          console.log('Updated package detected:', payload);
          const updatedPackage = payload.new as Package;
          setPackages(prev => prev.map(pkg => 
            pkg.id === updatedPackage.id ? updatedPackage : pkg
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
          console.log('Deleted package detected:', payload);
          const deletedPackage = payload.old as Package;
          setPackages(prev => prev.filter(pkg => pkg.id !== deletedPackage.id));
          toast.info("Pacote removido!");
        }
      )
      .subscribe((status) => {
        console.log('Packages channel subscription status:', status);
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        console.log('Cleaning up packages realtime subscription');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, []);

  const createPackage = async (packageData: Omit<Package, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Creating package with data:', packageData);
      
      const { data, error } = await supabase
        .from('packages')
        .insert([packageData])
        .select()
        .single();

      if (error) {
        console.error('Error creating package:', error);
        toast.error("Erro ao criar pacote: " + error.message);
        return { success: false, error };
      }

      console.log('Package created successfully:', data);
      toast.success("Pacote criado com sucesso!");
      return { success: true, data };
    } catch (error) {
      console.error('Error in createPackage:', error);
      toast.error("Erro ao criar pacote");
      return { success: false, error };
    }
  };

  const updatePackage = async (id: string, updates: Partial<Package>) => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating package:', error);
        toast.error("Erro ao atualizar pacote");
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error in updatePackage:', error);
      return { success: false, error };
    }
  };

  const deletePackage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('packages')
        .update({ is_active: false })
        .eq('id', id);

      if (error) {
        console.error('Error deleting package:', error);
        toast.error("Erro ao excluir pacote");
        return { success: false, error };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in deletePackage:', error);
      return { success: false, error };
    }
  };

  return {
    packages,
    isLoading,
    fetchPackages,
    createPackage,
    updatePackage,
    deletePackage,
  };
}