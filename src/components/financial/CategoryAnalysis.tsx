
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Transaction {
  id: string;
  type: "income" | "expense";
  description: string;
  amount: number;
  date: string;
  category: string;
}

interface CategoryAnalysisProps {
  transactions: Transaction[];
}

export function CategoryAnalysis({ transactions }: CategoryAnalysisProps) {
  const expensesByCategory = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const totalExpenses = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0);

  const incomeByCategory = transactions
    .filter(t => t.type === "income")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const totalIncome = Object.values(incomeByCategory).reduce((sum, amount) => sum + amount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Receitas por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(incomeByCategory).map(([category, amount]) => {
              const percentage = totalIncome > 0 ? (amount / totalIncome) * 100 : 0;
              return (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{category}</span>
                    <span>R$ {amount.toFixed(2)} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
            {Object.keys(incomeByCategory).length === 0 && (
              <p className="text-gray-500 text-center py-4">
                Nenhuma receita registrada no período
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Despesas por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(expensesByCategory).map(([category, amount]) => {
              const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
              return (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{category}</span>
                    <span>R$ {amount.toFixed(2)} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
            {Object.keys(expensesByCategory).length === 0 && (
              <p className="text-gray-500 text-center py-4">
                Nenhuma despesa registrada no período
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
