
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, DollarSign } from "lucide-react";
import { TransactionFormDialog } from "@/components/financial/TransactionFormDialog";
import { TransactionList } from "@/components/financial/TransactionList";
import { FinancialSummary } from "@/components/financial/FinancialSummary";
import { CategoryManager } from "@/components/financial/CategoryManager";
import { FinancialReports } from "@/components/financial/FinancialReports";
import { useFinancialTransactionsRealtime } from "@/hooks/useFinancialTransactionsRealtime";
import { FinancialTransaction } from "@/hooks/useFinancialTransactions";

// Transform FinancialTransaction to match TransactionList expected format
const transformTransactionForList = (transaction: FinancialTransaction) => ({
  id: transaction.id,
  type: transaction.type,
  description: transaction.description,
  amount: transaction.amount,
  date: transaction.transaction_date,
  category: transaction.financial_categories?.name || 'Sem categoria',
  category_id: transaction.category_id,
  financial_categories: transaction.financial_categories,
});

export default function Financial() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  
  const {
    transactions,
    categories,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    deleteCategory,
  } = useFinancialTransactionsRealtime();

  const handleAddTransaction = async (transactionData: any) => {
    const result = await addTransaction(transactionData);
    if (result.success) {
      setIsFormOpen(false);
    }
    return result;
  };

  const handleEditTransaction = async (transactionData: any) => {
    if (!editingTransaction) return { success: false };
    
    const result = await updateTransaction(editingTransaction.id, transactionData);
    if (result.success) {
      setIsFormOpen(false);
      setEditingTransaction(null);
    }
    return result;
  };

  const handleDeleteTransaction = async (id: string) => {
    return await deleteTransaction(id);
  };

  const openEditDialog = (transaction: any) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando dados financeiros...</div>
      </div>
    );
  }

  // Transform transactions for components that expect the Transaction interface
  const transformedTransactions = transactions.map(transformTransactionForList);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <DollarSign className="mr-2 h-8 w-8" /> Financeiro
          </h1>
          <p className="text-muted-foreground">
            Gerencie suas transações financeiras com atualizações em tempo real.
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nova Transação
        </Button>
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="summary">Resumo</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6">
          <FinancialSummary transactions={transformedTransactions} />
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Transações Recentes</h2>
            <TransactionList
              transactions={transformedTransactions}
              onEdit={openEditDialog}
              onDeleteTransaction={handleDeleteTransaction}
            />
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <CategoryManager
            categories={categories}
            onAddCategory={addCategory}
            onDeleteCategory={deleteCategory}
          />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <FinancialReports transactions={transactions} />
        </TabsContent>
      </Tabs>

      <TransactionFormDialog
        isOpen={isFormOpen}
        onClose={closeForm}
        transaction={editingTransaction}
      />
    </div>
  );
}
