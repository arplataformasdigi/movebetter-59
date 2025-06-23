
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface FinancialTransaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category_id: string;
  transaction_date: string;
  due_date?: string;
  payment_date?: string;
  payment_status: 'pending' | 'paid' | 'overdue';
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface FinancialCategory {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  is_active: boolean;
  created_at: string;
}

export function useFinancialTransactionsRealtime() {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [categories, setCategories] = useState<FinancialCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .order('transaction_date', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        toast.error("Erro ao carregar transações");
        return;
      }

      setTransactions(data || []);
    } catch (error) {
      console.error('Error in fetchTransactions:', error);
      toast.error("Erro inesperado ao carregar transações");
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

  const fetchData = async () => {
    setIsLoading(true);
    await Promise.all([fetchTransactions(), fetchCategories()]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();

    // Setup realtime subscription for transactions
    const transactionChannel = supabase
      .channel('financial-transactions-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'financial_transactions'
        },
        (payload) => {
          console.log('Transaction change:', payload);
          
          if (payload.eventType === 'INSERT') {
            setTransactions(prev => [payload.new as FinancialTransaction, ...prev]);
            toast.success("Nova transação adicionada!");
          } else if (payload.eventType === 'UPDATE') {
            setTransactions(prev => prev.map(t => 
              t.id === payload.new.id ? payload.new as FinancialTransaction : t
            ));
            toast.success("Transação atualizada!");
          } else if (payload.eventType === 'DELETE') {
            setTransactions(prev => prev.filter(t => t.id !== payload.old.id));
            toast.success("Transação removida!");
          }
        }
      )
      .subscribe();

    // Setup realtime subscription for categories
    const categoryChannel = supabase
      .channel('financial-categories-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'financial_categories'
        },
        (payload) => {
          console.log('Category change:', payload);
          fetchCategories(); // Refresh categories on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(transactionChannel);
      supabase.removeChannel(categoryChannel);
    };
  }, []);

  const addTransaction = async (transactionData: Omit<FinancialTransaction, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Usuário não autenticado");
        return { success: false };
      }

      const { data, error } = await supabase
        .from('financial_transactions')
        .insert([{ ...transactionData, created_by: user.id }])
        .select()
        .single();

      if (error) {
        console.error('Error adding transaction:', error);
        toast.error("Erro ao adicionar transação");
        return { success: false, error };
      }

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
        .select()
        .single();

      if (error) {
        console.error('Error updating transaction:', error);
        toast.error("Erro ao atualizar transação");
        return { success: false, error };
      }

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
        toast.error("Erro ao deletar transação");
        return { success: false, error };
      }

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
        toast.error("Erro ao adicionar categoria");
        return { success: false, error };
      }

      toast.success("Categoria adicionada com sucesso");
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
        .update({ is_active: false })
        .eq('id', id);

      if (error) {
        console.error('Error deleting category:', error);
        toast.error("Erro ao deletar categoria");
        return { success: false, error };
      }

      toast.success("Categoria removida com sucesso");
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
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    deleteCategory,
  };
}
