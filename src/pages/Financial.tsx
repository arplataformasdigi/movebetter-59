
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
import { CategoryManager } from "@/components/financial/CategoryManager";

interface Transaction {
  id: string;
  type: "income" | "expense";
  description: string;
  amount: number;
  date: string;
  category: string;
}

interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
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

const initialCategories: Category[] = [
  { id: "1", name: "Atendimento", type: "income" },
  { id: "2", name: "Pacotes", type: "income" },
  { id: "3", name: "Equipamentos", type: "expense" },
  { id: "4", name: "Marketing", type: "expense" },
];

export default function Financial() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
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

  const handleAddCategory = (category: Category) => {
    setCategories([...categories, category]);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
    toast.success("Categoria removida com sucesso!");
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="add">Adicionar</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-6">
          <TransactionList 
            transactions={filteredTransactions} 
            onDeleteTransaction={handleDeleteTransaction}
          />
        </TabsContent>

        <TabsContent value="add" className="space-y-6">
          <TransactionForm 
            onAddTransaction={handleAddTransaction}
            categories={categories}
          />
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <CategoryManager
            categories={categories}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <FinancialReports 
            transactions={filteredTransactions}
            startDate={startDate}
            endDate={endDate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
