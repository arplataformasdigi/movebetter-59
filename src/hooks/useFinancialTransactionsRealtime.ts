
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useFinancialTransactions, FinancialTransaction } from './useFinancialTransactions';

export function useFinancialTransactionsRealtime() {
  const {
    transactions,
    categories,
    isLoading,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    deleteCategory,
  } = useFinancialTransactions();

  useEffect(() => {
    const channel = supabase
      .channel('financial-transactions-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'financial_transactions'
        },
        (payload) => {
          console.log('New transaction:', payload);
          toast.success("Nova transação adicionada!");
          fetchTransactions(); // Refetch data instead of manually updating state
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'financial_transactions'
        },
        (payload) => {
          console.log('Updated transaction:', payload);
          toast.success("Transação atualizada!");
          fetchTransactions(); // Refetch data instead of manually updating state
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'financial_transactions'
        },
        (payload) => {
          console.log('Deleted transaction:', payload);
          toast.success("Transação removida!");
          fetchTransactions(); // Refetch data instead of manually updating state
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTransactions]);

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
