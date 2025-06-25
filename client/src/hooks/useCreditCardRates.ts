
import { useState, useEffect } from 'react';

import { toast } from 'sonner';

export interface CreditCardRate {
  id: string;
  name: string;
  rate: number;
  is_active: boolean;
  created_at: string;
}

export function useCreditCardRates() {
  const [rates, setRates] = useState<CreditCardRate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRates = async () => {
    try {
      console.log('Fetching credit card rates from Supabase...');
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('credit_card_rates')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Error fetching rates:', error);
        toast.error("Erro ao carregar taxas: " + error.message);
        return;
      }

      console.log('Rates fetched successfully:', data);
      setRates(data || []);
    } catch (error) {
      console.error('Error in fetchRates:', error);
      toast.error("Erro inesperado ao carregar as taxas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const addRate = async (rateData: Omit<CreditCardRate, 'id' | 'created_at'>) => {
    try {
      console.log('Adding rate:', rateData);
      
      const { data, error } = await supabase
        .from('credit_card_rates')
        .insert([rateData])
        .select()
        .single();

      if (error) {
        console.error('Error adding rate:', error);
        toast.error("Erro ao adicionar taxa: " + error.message);
        return { success: false, error };
      }

      console.log('Rate added successfully:', data);
      setRates(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      toast.success("Taxa adicionada com sucesso");
      return { success: true, data };
    } catch (error) {
      console.error('Error in addRate:', error);
      toast.error("Erro inesperado ao adicionar taxa");
      return { success: false, error };
    }
  };

  const deleteRate = async (id: string) => {
    try {
      console.log('Deleting rate:', id);
      
      const { error } = await supabase
        .from('credit_card_rates')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting rate:', error);
        toast.error("Erro ao deletar taxa: " + error.message);
        return { success: false, error };
      }

      console.log('Rate deleted successfully');
      setRates(prev => prev.filter(r => r.id !== id));
      toast.success("Taxa removida com sucesso");
      return { success: true };
    } catch (error) {
      console.error('Error in deleteRate:', error);
      toast.error("Erro inesperado ao deletar taxa");
      return { success: false, error };
    }
  };

  return {
    rates,
    isLoading,
    fetchRates,
    addRate,
    deleteRate,
  };
}
