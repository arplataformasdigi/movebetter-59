
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const fetchRates = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('credit_card_rates')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching rates:', error);
        toast({
          title: "Erro ao carregar taxas",
          description: "Não foi possível carregar as taxas de cartão",
          variant: "destructive",
        });
        return;
      }

      setRates(data || []);
    } catch (error) {
      console.error('Error in fetchRates:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao carregar as taxas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const addRate = async (rateData: Omit<CreditCardRate, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('credit_card_rates')
        .insert([rateData])
        .select()
        .single();

      if (error) {
        console.error('Error adding rate:', error);
        toast({
          title: "Erro ao adicionar taxa",
          description: "Não foi possível adicionar a taxa",
          variant: "destructive",
        });
        return { success: false, error };
      }

      setRates(prev => [data, ...prev]);
      toast({
        title: "Taxa adicionada",
        description: "Taxa foi adicionada com sucesso",
      });
      return { success: true, data };
    } catch (error) {
      console.error('Error in addRate:', error);
      return { success: false, error };
    }
  };

  const deleteRate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('credit_card_rates')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting rate:', error);
        toast({
          title: "Erro ao deletar taxa",
          description: "Não foi possível deletar a taxa",
          variant: "destructive",
        });
        return { success: false, error };
      }

      setRates(prev => prev.filter(r => r.id !== id));
      toast({
        title: "Taxa removida",
        description: "Taxa foi removida com sucesso",
      });
      return { success: true };
    } catch (error) {
      console.error('Error in deleteRate:', error);
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
