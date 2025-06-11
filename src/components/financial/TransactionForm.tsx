
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface Transaction {
  id: string;
  type: "income" | "expense";
  description: string;
  amount: number;
  date: string;
  category: string;
}

interface TransactionFormProps {
  onAddTransaction: (transaction: Transaction) => void;
}

export function TransactionForm({ onAddTransaction }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    type: "income" as "income" | "expense",
    description: "",
    amount: 0,
    category: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description || !formData.category || formData.amount <= 0) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      type: formData.type,
      description: formData.description,
      amount: formData.amount,
      date: new Date().toISOString().split('T')[0],
      category: formData.category,
    };
    
    onAddTransaction(transaction);
    toast.success("Transação adicionada com sucesso!");
    setFormData({
      type: "income",
      description: "",
      amount: 0,
      category: "",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adicionar Transação</CardTitle>
        <CardDescription>Registre uma nova receita ou despesa</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">Tipo</Label>
            <select
              id="type"
              className="w-full border rounded px-3 py-2"
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as "income" | "expense" }))}
            >
              <option value="income">Receita</option>
              <option value="expense">Despesa</option>
            </select>
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição da transação"
              required
            />
          </div>

          <div>
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Categoria</Label>
            <select
              id="category"
              className="w-full border rounded px-3 py-2"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              required
            >
              <option value="">Selecione uma categoria</option>
              {formData.type === "income" ? (
                <>
                  <option value="Atendimento">Atendimento</option>
                  <option value="Pacotes">Pacotes</option>
                  <option value="Consultas">Consultas</option>
                  <option value="Outros">Outros</option>
                </>
              ) : (
                <>
                  <option value="Equipamentos">Equipamentos</option>
                  <option value="Materiais">Materiais</option>
                  <option value="Transporte">Transporte</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Outros">Outros</option>
                </>
              )}
            </select>
          </div>

          <Button type="submit" className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Adicionar Transação
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
