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
import { getCurrentDate, formatDateToInput } from "@/utils/dateUtils";

interface Transaction {
  id: string;
  type: "income" | "expense";
  description: string;
  amount: number;
  transaction_date: string;
  category_id: string;
  notes?: string;
  financial_categories?: {
    name: string;
    color?: string;
  };
}

interface TransactionFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
}

export function TransactionFormDialog({ isOpen, onClose, transaction }: TransactionFormDialogProps) {
  const { addTransaction, updateTransaction, categories } = useFinancialTransactions();
  const [formData, setFormData] = useState({
    type: "expense" as "income" | "expense",
    description: "",
    amount: "",
    transaction_date: getCurrentDate(),
    category_id: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (transaction) {
      console.log('Editing transaction:', transaction);
      setFormData({
        type: transaction.type,
        description: transaction.description,
        amount: transaction.amount.toString(),
        transaction_date: formatDateToInput(transaction.transaction_date),
        category_id: transaction.category_id,
        notes: transaction.notes || "",
      });
    } else {
      console.log('Creating new transaction');
      setFormData({
        type: "expense",
        description: "",
        amount: "",
        transaction_date: getCurrentDate(),
        category_id: "",
        notes: "",
      });
    }
  }, [transaction, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Submitting form data:', formData);
    
    if (!formData.description.trim() || !formData.amount || !formData.category_id) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Digite um valor válido");
      return;
    }

    setIsSubmitting(true);

    const transactionData = {
      type: formData.type,
      description: formData.description.trim(),
      amount: amount,
      transaction_date: formData.transaction_date,
      category_id: formData.category_id,
      payment_status: "paid" as const,
      notes: formData.notes.trim() || undefined, // Convert empty string to undefined
    };

    console.log('Transaction data to save:', transactionData);

    try {
      let result;
      if (transaction) {
        result = await updateTransaction(transaction.id, transactionData);
      } else {
        result = await addTransaction(transactionData);
      }
      
      if (result.success) {
        toast.success(transaction ? "Transação atualizada com sucesso!" : "Transação criada com sucesso!");
        onClose();
      }
    } catch (error) {
      console.error("Error saving transaction:", error);
      toast.error("Erro ao salvar transação");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.type === formData.type && cat.is_active
  );

  console.log('Available categories:', filteredCategories);
  console.log('Selected category_id:', formData.category_id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{transaction ? "Editar Transação" : "Adicionar Transação"}</DialogTitle>
          <DialogDescription>
            {transaction ? "Atualize os dados da transação" : "Preencha os dados para criar uma nova transação"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Tipo *</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => {
                  console.log('Type changed to:', value);
                  setFormData(prev => ({ 
                    ...prev, 
                    type: value as "income" | "expense",
                    category_id: ""
                  }));
                }}
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
              <Label htmlFor="category">Categoria *</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => {
                  console.log('Category changed to:', value);
                  setFormData(prev => ({ ...prev, category_id: value }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: category.color || "#666" }}
                          />
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      Nenhuma categoria disponível para {formData.type === 'income' ? 'receitas' : 'despesas'}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva a transação..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Valor (R$) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0,00"
              />
            </div>

            <div>
              <Label htmlFor="date">Data *</Label>
              <Input
                id="date"
                type="date"
                value={formData.transaction_date}
                onChange={(e) => setFormData(prev => ({ ...prev, transaction_date: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Observações adicionais (opcional)..."
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : (transaction ? "Atualizar" : "Adicionar")} Transação
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
