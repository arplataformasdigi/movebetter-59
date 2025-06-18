
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface Transaction {
  id: string;
  type: "income" | "expense";
  description: string;
  amount: number;
  date: string;
  category: string;
}

interface FinancialReportsProps {
  transactions: Transaction[];
  startDate?: string;
  endDate?: string;
}

export function FinancialReports({ transactions, startDate, endDate }: FinancialReportsProps) {
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Análise por categoria
  const incomeByCategory = transactions
    .filter(t => t.type === "income")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const expensesByCategory = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const generatePDF = () => {
    // Simular geração de PDF
    toast.success("Relatório PDF gerado com sucesso!");
  };

  const generateExcel = () => {
    // Simular geração de Excel
    toast.success("Relatório Excel gerado com sucesso!");
  };

  const defaultStartDate = new Date();
  defaultStartDate.setMonth(defaultStartDate.getMonth() - 1);
  const defaultEndDate = new Date();

  const displayStartDate = startDate || defaultStartDate.toISOString().split('T')[0];
  const displayEndDate = endDate || defaultEndDate.toISOString().split('T')[0];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Relatórios Financeiros</CardTitle>
            <CardDescription>Análise detalhada do período selecionado</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button onClick={generatePDF} variant="outline">
              <Download className="mr-2 h-4 w-4" /> PDF
            </Button>
            <Button onClick={generateExcel} variant="outline">
              <Download className="mr-2 h-4 w-4" /> Excel
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Resumo do Período</h3>
              <p>De: {new Date(displayStartDate).toLocaleDateString('pt-BR')}</p>
              <p>Até: {new Date(displayEndDate).toLocaleDateString('pt-BR')}</p>
              <p className="mt-2">Total de transações: {transactions.length}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Totais</h3>
              <p className="text-green-600">Receitas: R$ {totalIncome.toFixed(2)}</p>
              <p className="text-red-600">Despesas: R$ {totalExpenses.toFixed(2)}</p>
              <p className={`font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                Saldo: R$ {balance.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Receitas por Categoria</h3>
              {Object.entries(incomeByCategory).map(([category, amount]) => (
                <div key={category} className="flex justify-between text-sm">
                  <span>{category}:</span>
                  <span className="text-green-600">R$ {amount.toFixed(2)}</span>
                </div>
              ))}
              {Object.keys(incomeByCategory).length === 0 && (
                <p className="text-gray-500 text-sm">Nenhuma receita no período</p>
              )}
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Despesas por Categoria</h3>
              {Object.entries(expensesByCategory).map(([category, amount]) => (
                <div key={category} className="flex justify-between text-sm">
                  <span>{category}:</span>
                  <span className="text-red-600">R$ {amount.toFixed(2)}</span>
                </div>
              ))}
              {Object.keys(expensesByCategory).length === 0 && (
                <p className="text-gray-500 text-sm">Nenhuma despesa no período</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
