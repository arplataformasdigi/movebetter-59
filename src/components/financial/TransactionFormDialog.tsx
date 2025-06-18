
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useFinancialTransactions } from "@/hooks/useFinancialTransactions";

interface Transaction {
  id: string;
  type: "income" | "expense";
  description: string;
  amount: number;
  date: string;
  category: string;
}

interface TransactionFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
}

export function TransactionFormDialog({ isOpen, onClose, transaction }: TransactionFormDialogProps) {
  const { addTransaction, updateTransaction } = useFinancialTransactions();
  const [formData, setFormData] = useState({
    type: "income" as "income" | "expense",
    description: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    category: "",
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        description: transaction.description,
        amount: transaction.amount.toString(),
        date: transaction.date,
        category: transaction.category,
      });
    } else {
      setFormData({
        type: "income",
        description: "",
        amount: "",
        date: new Date().toISOString().split('T')[0],
        category: "",
      });
    }
  }, [transaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description || !formData.amount || !formData.category) {
      toast.error("Preencha todos os campos");
      return;
    }

    const transactionData = {
      type: formData.type,
      description: formData.description,
      amount: parseFloat(formData.amount),
      transaction_date: formData.date,
      category_id: null, // Will need to be mapped to actual category
      notes: formData.category, // Temporary mapping
    };

    let result;
    if (transaction) {
      result = await updateTransaction(transaction.id, transactionData);
    } else {
      result = await addTransaction(transactionData);
    }
    
    if (result.success) {
      toast.success(transaction ? "Transação atualizada com sucesso!" : "Transação adicionada com sucesso!");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{transaction ? "Editar Transação" : "Adicionar Transação"}</DialogTitle>
          <DialogDescription>
            {transaction ? "Atualize os dados da transação" : "Preencha os dados para criar uma nova transação"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as "income" | "expense" }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Receita</SelectItem>
                  <SelectItem value="expense">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="Digite a categoria"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva a transação..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {transaction ? "Atualizar" : "Adicionar"} Transação
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
