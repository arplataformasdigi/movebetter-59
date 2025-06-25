
import { useState, useEffect } from 'react';

import { toast } from 'sonner';

export interface Package {
  id: string;
  name: string;
  description?: string;
  price: number;
  services: string[];
  validity_days: number;
  sessions_included: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Add missing property for compatibility
  validity: number;
}

export function usePackagesData() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPackages = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching packages:', error);
        toast.error("Erro ao carregar pacotes");
        return;
      }

      // Map the data to include the validity property for compatibility
      const mappedPackages = (data || []).map(pkg => ({
        ...pkg,
        validity: pkg.validity_days // Add compatibility mapping
      }));

      setPackages(mappedPackages);
    } catch (error) {
      console.error('Error in fetchPackages:', error);
      toast.error("Erro inesperado ao carregar pacotes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return {
    packages,
    isLoading,
    fetchPackages,
  };
}
