
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Calendar } from "lucide-react";
import { toast } from "sonner";
import { getCurrentDate, formatDateToBrazilian, isDateInRange } from "@/utils/dateUtils";
import { generateFinancialPDF } from "./PDFReportGenerator";
import { FinancialTransaction } from "@/hooks/useFinancialTransactions";

interface FinancialReportsProps {
  transactions: FinancialTransaction[];
}

export function FinancialReports({ transactions }: FinancialReportsProps) {
  // Set default dates using the utility function
  const [startDate, setStartDate] = useState("2025-06-01");
  const [endDate, setEndDate] = useState(getCurrentDate());

  // Filter transactions by date range using utility function
  const filteredTransactions = transactions.filter(t => {
    return isDateInRange(t.transaction_date, startDate, endDate);
  });

  const totalIncome = filteredTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  // Análise por categoria
  const incomeByCategory = filteredTransactions
    .filter(t => t.type === "income")
    .reduce((acc, t) => {
      const categoryName = t.financial_categories?.name || 'Sem categoria';
      acc[categoryName] = (acc[categoryName] || 0) + Number(t.amount);
      return acc;
    }, {} as Record<string, number>);

  const expensesByCategory = filteredTransactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => {
      const categoryName = t.financial_categories?.name || 'Sem categoria';
      acc[categoryName] = (acc[categoryName] || 0) + Number(t.amount);
      return acc;
    }, {} as Record<string, number>);

  const generatePDF = () => {
    try {
      const reportData = {
        transactions: filteredTransactions,
        startDate,
        endDate,
        totalIncome,
        totalExpenses,
        balance,
        incomeByCategory,
        expensesByCategory,
      };

      generateFinancialPDF(reportData);
      toast.success("Relatório PDF gerado com sucesso!");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Erro ao gerar relatório PDF");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Relatórios Financeiros</CardTitle>
            <CardDescription>Análise detalhada do período selecionado - Atualizado em tempo real</CardDescription>
          </div>
          <Button onClick={generatePDF} variant="outline">
            <Download className="mr-2 h-4 w-4" /> Baixar PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Date Range Filter */}
          <Card className="p-4">
            <div className="flex items-center space-x-4">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
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
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Resumo do Período</h3>
              <p>De: {formatDateToBrazilian(startDate)}</p>
              <p>Até: {formatDateToBrazilian(endDate)}</p>
              <p className="mt-2">Total de transações: {filteredTransactions.length}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Totais</h3>
              <p className="text-green-600">Receitas: R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <p className="text-red-600">Despesas: R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <p className={`font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                Saldo: R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Receitas por Categoria</h3>
              <div className="space-y-1">
                {Object.entries(incomeByCategory).map(([category, amount]) => (
                  <div key={category} className="flex justify-between text-sm">
                    <span>{category}:</span>
                    <span className="text-green-600">R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
                {Object.keys(incomeByCategory).length === 0 && (
                  <p className="text-gray-500 text-sm">Nenhuma receita no período</p>
                )}
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Despesas por Categoria</h3>
              <div className="space-y-1">
                {Object.entries(expensesByCategory).map(([category, amount]) => (
                  <div key={category} className="flex justify-between text-sm">
                    <span>{category}:</span>
                    <span className="text-red-600">R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
                {Object.keys(expensesByCategory).length === 0 && (
                  <p className="text-gray-500 text-sm">Nenhuma despesa no período</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
