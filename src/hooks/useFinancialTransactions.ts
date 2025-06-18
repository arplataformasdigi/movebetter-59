
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface FinancialTransaction {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  transaction_date?: string;
  due_date?: string;
  payment_date?: string;
  payment_status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  category_id?: string;
  patient_id?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  financial_categories?: {
    name: string;
    color?: string;
  };
  patients?: {
    name: string;
  };
}

export interface FinancialCategory {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color?: string;
  is_active: boolean;
  created_at: string;
}

export function useFinancialTransactions() {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [categories, setCategories] = useState<FinancialCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('financial_transactions')
        .select(`
          *,
          financial_categories (name, color),
          patients (name)
        `)
        .order('transaction_date', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        toast({
          title: "Erro ao carregar transações",
          description: "Não foi possível carregar as transações financeiras",
          variant: "destructive",
        });
        return;
      }

      setTransactions(data || []);
    } catch (error) {
      console.error('Error in fetchTransactions:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao carregar as transações",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('financial_categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }

      setCategories(data || []);
    } catch (error) {
      console.error('Error in fetchCategories:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  const addTransaction = async (transactionData: Omit<FinancialTransaction, 'id' | 'created_at' | 'updated_at' | 'financial_categories' | 'patients'>) => {
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .insert([transactionData])
        .select(`
          *,
          financial_categories (name, color),
          patients (name)
        `)
        .single();

      if (error) {
        console.error('Error adding transaction:', error);
        toast({
          title: "Erro ao adicionar transação",
          description: "Não foi possível adicionar a transação",
          variant: "destructive",
        });
        return { success: false, error };
      }

      setTransactions(prev => [data, ...prev]);
      toast({
        title: "Transação adicionada",
        description: "Transação foi adicionada com sucesso",
      });
      return { success: true, data };
    } catch (error) {
      console.error('Error in addTransaction:', error);
      return { success: false, error };
    }
  };

  const updateTransaction = async (id: string, updates: Partial<FinancialTransaction>) => {
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          financial_categories (name, color),
          patients (name)
        `)
        .single();

      if (error) {
        console.error('Error updating transaction:', error);
        toast({
          title: "Erro ao atualizar transação",
          description: "Não foi possível atualizar a transação",
          variant: "destructive",
        });
        return { success: false, error };
      }

      setTransactions(prev => prev.map(t => t.id === id ? data : t));
      toast({
        title: "Transação atualizada",
        description: "Transação foi atualizada com sucesso",
      });
      return { success: true, data };
    } catch (error) {
      console.error('Error in updateTransaction:', error);
      return { success: false, error };
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('financial_transactions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting transaction:', error);
        toast({
          title: "Erro ao deletar transação",
          description: "Não foi possível deletar a transação",
          variant: "destructive",
        });
        return { success: false, error };
      }

      setTransactions(prev => prev.filter(t => t.id !== id));
      toast({
        title: "Transação removida",
        description: "Transação foi removida com sucesso",
      });
      return { success: true };
    } catch (error) {
      console.error('Error in deleteTransaction:', error);
      return { success: false, error };
    }
  };

  const addCategory = async (categoryData: Omit<FinancialCategory, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('financial_categories')
        .insert([categoryData])
        .select()
        .single();

      if (error) {
        console.error('Error adding category:', error);
        toast({
          title: "Erro ao adicionar categoria",
          description: "Não foi possível adicionar a categoria",
          variant: "destructive",
        });
        return { success: false, error };
      }

      setCategories(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      toast({
        title: "Categoria adicionada",
        description: "Categoria foi adicionada com sucesso",
      });
      return { success: true, data };
    } catch (error) {
      console.error('Error in addCategory:', error);
      return { success: false, error };
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('financial_categories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting category:', error);
        toast({
          title: "Erro ao deletar categoria",
          description: "Não foi possível deletar a categoria",
          variant: "destructive",
        });
        return { success: false, error };
      }

      setCategories(prev => prev.filter(c => c.id !== id));
      toast({
        title: "Categoria removida",
        description: "Categoria foi removida com sucesso",
      });
      return { success: true };
    } catch (error) {
      console.error('Error in deleteCategory:', error);
      return { success: false, error };
    }
  };

  return {
    transactions,
    categories,
    isLoading,
    fetchTransactions,
    fetchCategories,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    deleteCategory,
  };
}
