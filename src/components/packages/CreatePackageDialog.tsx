
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

interface Package {
  id: string;
  name: string;
  description: string;
  services: string[];
  price: number;
  validity: number;
  status: "active" | "inactive";
}

interface CreatePackageDialogProps {
  onCreatePackage: (pkg: Package) => void;
}

export function CreatePackageDialog({ onCreatePackage }: CreatePackageDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    services: [""],
    price: 0,
    validity: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPackage: Package = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      services: formData.services.filter(s => s.trim() !== ""),
      price: formData.price,
      validity: formData.validity,
      status: "active",
    };
    onCreatePackage(newPackage);
    setOpen(false);
    setFormData({
      name: "",
      description: "",
      services: [""],
      price: 0,
      validity: 1,
    });
  };

  const addService = () => {
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, ""]
    }));
  };

  const updateService = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map((service, i) => i === index ? value : service)
    }));
  };

  const removeService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Criar Novo Pacote
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Pacote</DialogTitle>
          <DialogDescription>
            Preencha as informações para criar um novo pacote de atendimento.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Pacote</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Combo Banho & Tosa Mensal"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição do pacote"
              required
            />
          </div>

          <div>
            <Label>Serviços Inclusos</Label>
            {formData.services.map((service, index) => (
              <div key={index} className="flex gap-2 mt-2">
                <Input
                  value={service}
                  onChange={(e) => updateService(index, e.target.value)}
                  placeholder="Ex: 2x Banho M"
                />
                {formData.services.length > 1 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => removeService(index)}
                  >
                    Remover
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addService} className="mt-2">
              Adicionar Serviço
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="validity">Validade (meses)</Label>
              <Input
                id="validity"
                type="number"
                value={formData.validity}
                onChange={(e) => setFormData(prev => ({ ...prev, validity: parseInt(e.target.value) || 1 }))}
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Criar Pacote</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
