
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Package {
  id: string;
  name: string;
  description: string;
  services: string[];
  price: number;
  validity: number;
  status: "active" | "inactive";
}

interface EditPackageDialogProps {
  package: Package | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditPackage: (pkg: Package) => void;
}

export function EditPackageDialog({ package: pkg, open, onOpenChange, onEditPackage }: EditPackageDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    services: [""],
    price: 0,
    validity: 1,
    status: "active" as "active" | "inactive",
  });

  useEffect(() => {
    if (pkg) {
      setFormData({
        name: pkg.name,
        description: pkg.description,
        services: pkg.services.length > 0 ? pkg.services : [""],
        price: pkg.price,
        validity: pkg.validity,
        status: pkg.status,
      });
    }
  }, [pkg]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkg) return;

    const updatedPackage: Package = {
      ...pkg,
      name: formData.name,
      description: formData.description,
      services: formData.services.filter(s => s.trim() !== ""),
      price: formData.price,
      validity: formData.validity,
      status: formData.status,
    };
    onEditPackage(updatedPackage);
    onOpenChange(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Pacote</DialogTitle>
          <DialogDescription>
            Edite as informações do pacote de fisioterapia.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Pacote</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
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

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: "active" | "inactive") => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar Alterações</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
