
import { useState, useEffect } from 'react';

import { useToast } from '@/hooks/use-toast';

export interface FinancialTransaction {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  transaction_date: string;
  due_date?: string;
  payment_date?: string;
  payment_status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  category_id?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  financial_categories?: {
    name: string;
    color?: string;
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
      console.log('Fetching transactions...');
      const { data, error } = await supabase
        .from('financial_transactions')
        .select(`
          *,
          financial_categories (name, color)
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

      console.log('Fetched transactions:', data);
      setTransactions(data || []);
    } catch (error) {
      console.error('Error in fetchTransactions:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao carregar as transações",
        variant: "destructive",
      });
    }
  };

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories...');
      const { data, error } = await supabase
        .from('financial_categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }

      console.log('Fetched categories:', data);
      setCategories(data || []);
    } catch (error) {
      console.error('Error in fetchCategories:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchTransactions(), fetchCategories()]);
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  const addTransaction = async (transactionData: Omit<FinancialTransaction, 'id' | 'created_at' | 'updated_at' | 'financial_categories'>) => {
    try {
      console.log('Adding transaction:', transactionData);
      
      const { data, error } = await supabase
        .from('financial_transactions')
        .insert([{
          type: transactionData.type,
          description: transactionData.description,
          amount: transactionData.amount,
          transaction_date: transactionData.transaction_date,
          payment_status: transactionData.payment_status,
          category_id: transactionData.category_id,
          notes: transactionData.notes
        }])
        .select(`
          *,
          financial_categories (name, color)
        `)
        .single();

      if (error) {
        console.error('Error adding transaction:', error);
        toast({
          title: "Erro ao adicionar transação",
          description: error.message || "Não foi possível adicionar a transação",
          variant: "destructive",
        });
        return { success: false, error };
      }

      console.log('Transaction added successfully:', data);
      
      // Refresh the transactions list
      await fetchTransactions();
      
      toast({
        title: "Sucesso",
        description: "Transação adicionada com sucesso",
      });
      return { success: true, data };
    } catch (error) {
      console.error('Error in addTransaction:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao adicionar a transação",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const updateTransaction = async (id: string, updates: Partial<FinancialTransaction>) => {
    try {
      console.log('Updating transaction:', id, updates);
      
      const { data, error } = await supabase
        .from('financial_transactions')
        .update({
          type: updates.type,
          description: updates.description,
          amount: updates.amount,
          transaction_date: updates.transaction_date,
          payment_status: updates.payment_status,
          category_id: updates.category_id,
          notes: updates.notes
        })
        .eq('id', id)
        .select(`
          *,
          financial_categories (name, color)
        `)
        .single();

      if (error) {
        console.error('Error updating transaction:', error);
        toast({
          title: "Erro ao atualizar transação",
          description: error.message || "Não foi possível atualizar a transação",
          variant: "destructive",
        });
        return { success: false, error };
      }

      console.log('Transaction updated successfully:', data);
      
      // Refresh the transactions list
      await fetchTransactions();
      
      toast({
        title: "Sucesso",
        description: "Transação atualizada com sucesso",
      });
      return { success: true, data };
    } catch (error) {
      console.error('Error in updateTransaction:', error);
      return { success: false, error };
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      console.log('Deleting transaction:', id);
      
      const { error } = await supabase
        .from('financial_transactions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting transaction:', error);
        toast({
          title: "Erro ao deletar transação",
          description: error.message || "Não foi possível deletar a transação",
          variant: "destructive",
        });
        return { success: false, error };
      }

      console.log('Transaction deleted successfully');
      
      // Refresh the transactions list
      await fetchTransactions();
      
      toast({
        title: "Sucesso",
        description: "Transação removida com sucesso",
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
          description: error.message || "Não foi possível adicionar a categoria",
          variant: "destructive",
        });
        return { success: false, error };
      }

      await fetchCategories();
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
      // Check if category is being used in transactions
      const { data: transactions, error: checkError } = await supabase
        .from('financial_transactions')
        .select('id')
        .eq('category_id', id)
        .limit(1);

      if (checkError) {
        console.error('Error checking category usage:', checkError);
        toast({
          title: "Erro ao verificar categoria",
          description: "Não foi possível verificar se a categoria está sendo usada",
          variant: "destructive",
        });
        return { success: false, error: checkError };
      }

      if (transactions && transactions.length > 0) {
        toast({
          title: "Categoria em uso",
          description: "Esta categoria não pode ser removida pois está sendo usada em transações",
          variant: "destructive",
        });
        return { success: false, error: new Error("Category in use") };
      }

      const { error } = await supabase
        .from('financial_categories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting category:', error);
        toast({
          title: "Erro ao deletar categoria",
          description: error.message || "Não foi possível deletar a categoria",
          variant: "destructive",
        });
        return { success: false, error };
      }

      await fetchCategories();
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
