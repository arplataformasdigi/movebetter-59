
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign } from "lucide-react";
import { toast } from "sonner";
import { TransactionForm } from "@/components/financial/TransactionForm";
import { TransactionList } from "@/components/financial/TransactionList";
import { FinancialSummary } from "@/components/financial/FinancialSummary";
import { FinancialReports } from "@/components/financial/FinancialReports";
import { CategoryAnalysis } from "@/components/financial/CategoryAnalysis";

interface Transaction {
  id: string;
  type: "income" | "expense";
  description: string;
  amount: number;
  date: string;
  category: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "income",
    description: "Sessão de Pilates - Maria Silva",
    amount: 80.00,
    date: "2025-06-08",
    category: "Atendimento",
  },
  {
    id: "2",
    type: "expense",
    description: "Material para exercícios",
    amount: 150.00,
    date: "2025-06-07",
    category: "Equipamentos",
  },
  {
    id: "3",
    type: "income",
    description: "Pacote vendido - João Santos",
    amount: 280.00,
    date: "2025-06-06",
    category: "Pacotes",
  },
];

export default function Financial() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [startDate, setStartDate] = useState("2025-06-01");
  const [endDate, setEndDate] = useState("2025-06-30");

  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return transactionDate >= start && transactionDate <= end;
  });

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions([...transactions, transaction]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
    toast.success("Transação removida com sucesso!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <DollarSign className="mr-2 h-8 w-8" /> Financeiro
          </h1>
          <p className="text-muted-foreground">
            Gerencie receitas, despesas e relatórios financeiros.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <Label htmlFor="startDate">Data Inicial</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="endDate">Data Final</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <FinancialSummary transactions={filteredTransactions} />

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="add">Adicionar</TabsTrigger>
          <TabsTrigger value="analysis">Análise</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-6">
          <TransactionList 
            transactions={filteredTransactions} 
            onDeleteTransaction={handleDeleteTransaction}
          />
        </TabsContent>

        <TabsContent value="add" className="space-y-6">
          <TransactionForm onAddTransaction={handleAddTransaction} />
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <CategoryAnalysis transactions={filteredTransactions} />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <FinancialReports 
            transactions={filteredTransactions}
            startDate={startDate}
            endDate={endDate}
          />
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <CategoryAnalysis transactions={filteredTransactions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
