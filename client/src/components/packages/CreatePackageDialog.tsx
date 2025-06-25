
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
import { usePackages } from "@/hooks/usePackages";

export function CreatePackageDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    services: [""],
    price: 0,
    validity_days: 30,
    sessions_included: 0,
  });

  const { addPackage } = usePackages();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const packageData = {
      name: formData.name,
      description: formData.description,
      services: formData.services.filter(s => s.trim() !== ""),
      price: formData.price,
      validity_days: formData.validity_days,
      sessions_included: formData.sessions_included,
      is_active: true,
    };

    const result = await addPackage(packageData);
    
    if (result.success) {
      setOpen(false);
      setFormData({
        name: "",
        description: "",
        services: [""],
        price: 0,
        validity_days: 30,
        sessions_included: 0,
      });
    }
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
            Preencha as informações para criar um novo pacote de fisioterapia.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Pacote</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Pacote Fisioterapia Domiciliar"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Pacote completo de fisioterapia domiciliar com sessões personalizadas"
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
                  placeholder="Ex: 4x Sessão de Fisioterapia Motora"
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

          <div className="grid grid-cols-3 gap-4">
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
              <Label htmlFor="validity_days">Validade (dias)</Label>
              <Input
                id="validity_days"
                type="number"
                value={formData.validity_days}
                onChange={(e) => setFormData(prev => ({ ...prev, validity_days: parseInt(e.target.value) || 30 }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="sessions_included">Sessões Incluídas</Label>
              <Input
                id="sessions_included"
                type="number"
                value={formData.sessions_included}
                onChange={(e) => setFormData(prev => ({ ...prev, sessions_included: parseInt(e.target.value) || 0 }))}
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
