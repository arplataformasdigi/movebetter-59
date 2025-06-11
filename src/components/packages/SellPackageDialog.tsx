
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface Package {
  id: string;
  name: string;
  price: number;
  services: string[];
  validity: number;
}

interface SoldPackage {
  id: string;
  packageId: string;
  packageName: string;
  clientName: string;
  patientName: string;
  packagePrice: number;
  transportCost: number;
  finalPrice: number;
  purchaseDate: string;
  expiryDate: string;
  usedCredits: number;
  totalCredits: number;
  status: "active" | "expired";
}

interface SellPackageDialogProps {
  packages: Package[];
  onSellPackage: (soldPackage: SoldPackage) => void;
}

export function SellPackageDialog({ packages, onSellPackage }: SellPackageDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    packageId: "",
    clientName: "",
    patientName: "",
    transportCost: 0,
  });

  const selectedPackage = packages.find(pkg => pkg.id === formData.packageId);
  const finalPrice = selectedPackage ? selectedPackage.price + formData.transportCost : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.packageId || !formData.clientName || !formData.patientName) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const soldPackage: SoldPackage = {
      id: Date.now().toString(),
      packageId: formData.packageId,
      packageName: selectedPackage?.name || "",
      clientName: formData.clientName,
      patientName: formData.patientName,
      packagePrice: selectedPackage?.price || 0,
      transportCost: formData.transportCost,
      finalPrice,
      purchaseDate: new Date().toLocaleDateString("pt-BR"),
      expiryDate: new Date(Date.now() + (selectedPackage?.validity || 1) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR"),
      usedCredits: 0,
      totalCredits: selectedPackage?.services.length || 0,
      status: "active",
    };

    onSellPackage(soldPackage);
    toast.success("Pacote vendido com sucesso!");
    setOpen(false);
    setFormData({
      packageId: "",
      clientName: "",
      patientName: "",
      transportCost: 0,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Vender Pacote Manualmente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Vender Pacote</DialogTitle>
          <DialogDescription>
            Registre a venda manual de um pacote
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="package">Selecionar Pacote *</Label>
            <Select value={formData.packageId} onValueChange={(value) => setFormData(prev => ({ ...prev, packageId: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha um pacote" />
              </SelectTrigger>
              <SelectContent>
                {packages.map((pkg) => (
                  <SelectItem key={pkg.id} value={pkg.id}>
                    {pkg.name} - R$ {pkg.price.toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="clientName">Nome do Cliente *</Label>
            <Input
              id="clientName"
              value={formData.clientName}
              onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
              placeholder="Nome do responsável"
              required
            />
          </div>

          <div>
            <Label htmlFor="patientName">Nome do Paciente *</Label>
            <Input
              id="patientName"
              value={formData.patientName}
              onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
              placeholder="Nome do paciente"
              required
            />
          </div>

          <div>
            <Label htmlFor="transportCost">Custo de Deslocamento (R$)</Label>
            <Input
              id="transportCost"
              type="number"
              step="0.01"
              value={formData.transportCost}
              onChange={(e) => setFormData(prev => ({ ...prev, transportCost: parseFloat(e.target.value) || 0 }))}
              placeholder="0.00"
            />
          </div>

          {selectedPackage && (
            <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Valor do pacote:</span>
                <span>R$ {selectedPackage.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Custo de deslocamento:</span>
                <span>R$ {formData.transportCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Valor final:</span>
                <span>R$ {finalPrice.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Vender Pacote</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
