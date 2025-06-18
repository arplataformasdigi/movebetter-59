
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
import { useFinancialTransactions } from "@/hooks/useFinancialTransactions";

export default function Financial() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const { transactions, isLoading, deleteTransaction } = useFinancialTransactions();

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando dados financeiros...</div>
      </div>
    );
  }

  // Transform transactions to match expected format
  const transformedTransactions = transactions.map(transaction => ({
    ...transaction,
    date: transaction.transaction_date,
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
          <Card>
            <CardHeader>
              <CardTitle>Transações Recentes</CardTitle>
              <CardDescription>
                Visualize e gerencie todas as transações financeiras
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionList 
                transactions={transformedTransactions}
                onEdit={handleEditTransaction}
                onDeleteTransaction={handleDeleteTransaction}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <FinancialReports 
            transactions={transformedTransactions}
            startDate=""
            endDate=""
          />
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <CategoryManager 
            categories={[]}
            onAddCategory={() => {}}
            onDeleteCategory={() => {}}
          />
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análises Avançadas</CardTitle>
              <CardDescription>
                Análises detalhadas dos dados financeiros
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Funcionalidade de análises avançadas em desenvolvimento
              </div>
            </CardContent>
          </Card>
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
