
import { useState, useEffect } from 'react';

import { useToast } from '@/hooks/use-toast';

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

export function usePackages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchPackages = async () => {
    try {
      console.log('Fetching packages from Supabase...');
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching packages:', error);
        toast({
          title: "Erro ao carregar pacotes",
          description: "Não foi possível carregar a lista de pacotes: " + error.message,
          variant: "destructive",
        });
        return;
      }

      console.log('Packages fetched successfully:', data);
      setPackages(data || []);
    } catch (error) {
      console.error('Error in fetchPackages:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao carregar os pacotes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []); // Dependências vazias para executar apenas uma vez

  const addPackage = async (packageData: Omit<Package, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Adding package:', packageData);
      
      const { data, error } = await supabase
        .from('packages')
        .insert([packageData])
        .select()
        .single();

      if (error) {
        console.error('Error adding package:', error);
        toast({
          title: "Erro ao adicionar pacote",
          description: "Não foi possível adicionar o pacote: " + error.message,
          variant: "destructive",
        });
        return { success: false, error };
      }

      console.log('Package added successfully:', data);
      setPackages(prev => [data, ...prev]);
      toast({
        title: "Pacote adicionado",
        description: "Pacote foi adicionado com sucesso",
      });
      return { success: true, data };
    } catch (error) {
      console.error('Error in addPackage:', error);
      toast({
        title: "Erro inesperado",
        description: "Erro inesperado ao adicionar pacote",
        variant: "destructive",
      });
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
        toast({
          title: "Erro ao atualizar pacote",
          description: "Não foi possível atualizar o pacote",
          variant: "destructive",
        });
        return { success: false, error };
      }

      setPackages(prev => prev.map(p => p.id === id ? data : p));
      toast({
        title: "Pacote atualizado",
        description: "Pacote foi atualizado com sucesso",
      });
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
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting package:', error);
        toast({
          title: "Erro ao deletar pacote",
          description: "Não foi possível deletar o pacote",
          variant: "destructive",
        });
        return { success: false, error };
      }

      setPackages(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Pacote removido",
        description: "Pacote foi removido com sucesso",
      });
      return { success: true };
    } catch (error) {
      console.error('Error in deletePackage:', error);
      return { success: false, error };
    }
  };

  return {
    packages,
    setPackages,
    isLoading,
    fetchPackages,
    addPackage,
    updatePackage,
    deletePackage,
  };
}
