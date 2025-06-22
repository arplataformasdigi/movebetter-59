
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TransactionFormDialog } from "@/components/financial/TransactionFormDialog";
import { TransactionList } from "@/components/financial/TransactionList";
import { FinancialSummary } from "@/components/financial/FinancialSummary";
import { FinancialReports } from "@/components/financial/FinancialReports";
import { CategoryManager } from "@/components/financial/CategoryManager";
import { CategoryAnalysis } from "@/components/financial/CategoryAnalysis";
import { useFinancialTransactions } from "@/hooks/useFinancialTransactions";

export default function Financial() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const { 
    transactions, 
    categories, 
    isLoading, 
    deleteTransaction, 
    addCategory, 
    deleteCategory 
  } = useFinancialTransactions();

  const handleEditTransaction = (transaction: any) => {
    setEditingTransaction(transaction);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = async (id: string) => {
    await deleteTransaction(id);
  };

  const handleAddCategory = async (categoryData: any) => {
    await addCategory(categoryData);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    await deleteCategory(categoryId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando dados financeiros...</div>
      </div>
    );
  }

  // Transform transactions to match expected format for display components
  const transformedTransactions = transactions.map(transaction => ({
    ...transaction,
    date: transaction.transaction_date || new Date().toISOString().split('T')[0],
    category: transaction.financial_categories?.name || 'Não categorizado'
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Gestão Financeira</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nova Transação
        </Button>
      </div>

      <FinancialSummary transactions={transformedTransactions} />

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="analysis">Análises</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <TransactionList 
            transactions={transformedTransactions}
            onEdit={handleEditTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <FinancialReports 
            transactions={transformedTransactions}
          />
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <CategoryManager 
            categories={categories}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <CategoryAnalysis transactions={transformedTransactions} />
        </TabsContent>
      </Tabs>

      <TransactionFormDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        transaction={editingTransaction}
      />
    </div>
  );
}
