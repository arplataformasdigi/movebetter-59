
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useFinancialTransactions, FinancialTransaction } from './useFinancialTransactions';

export function useFinancialTransactionsRealtime() {
  const transactionHooks = useFinancialTransactions();
  const { transactions, setTransactions } = transactionHooks;

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
          const newTransaction = payload.new as FinancialTransaction;
          // Buscar a transação completa com categoria
          supabase
            .from('financial_transactions')
            .select(`
              *,
              financial_categories (name, color)
            `)
            .eq('id', newTransaction.id)
            .single()
            .then(({ data }) => {
              if (data) {
                setTransactions(prev => [data, ...prev]);
                toast.success("Nova transação adicionada!");
              }
            });
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
          const updatedTransaction = payload.new as FinancialTransaction;
          supabase
            .from('financial_transactions')
            .select(`
              *,
              financial_categories (name, color)
            `)
            .eq('id', updatedTransaction.id)
            .single()
            .then(({ data }) => {
              if (data) {
                setTransactions(prev => prev.map(t => 
                  t.id === updatedTransaction.id ? data : t
                ));
                toast.success("Transação atualizada!");
              }
            });
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
          const deletedTransaction = payload.old as FinancialTransaction;
          setTransactions(prev => prev.filter(t => t.id !== deletedTransaction.id));
          toast.success("Transação removida!");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [setTransactions]);

  return transactionHooks;
}
