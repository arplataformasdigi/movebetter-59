
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package } from "lucide-react";
import { toast } from "sonner";

interface Package {
  id: string;
  name: string;
  price: number;
  services: string[];
  validity: number;
}

interface AssignPackageDialogProps {
  patientId: string;
  patientName: string;
  packages: Package[];
  onAssignPackage: (assignment: any) => void;
}

export function AssignPackageDialog({ 
  patientId, 
  patientName, 
  packages, 
  onAssignPackage 
}: AssignPackageDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [transportCost, setTransportCost] = useState(0);

  const selectedPackage = packages.find(pkg => pkg.id === selectedPackageId);
  const finalPrice = selectedPackage ? selectedPackage.price + transportCost : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPackageId) {
      toast.error("Selecione um pacote");
      return;
    }

    const assignment = {
      id: Date.now().toString(),
      packageId: selectedPackageId,
      packageName: selectedPackage?.name || "",
      patientId,
      patientName,
      transportCost,
      finalPrice,
      purchaseDate: new Date().toLocaleDateString("pt-BR"),
      expiryDate: new Date(Date.now() + (selectedPackage?.validity || 1) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR"),
      usedCredits: 0,
      totalCredits: selectedPackage?.services.length || 0,
      status: "active" as const,
    };

    onAssignPackage(assignment);
    toast.success("Pacote atribuído com sucesso!");
    setOpen(false);
    setSelectedPackageId("");
    setTransportCost(0);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Package className="h-4 w-4 mr-1" /> Atribuir Pacote
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Atribuir Pacote</DialogTitle>
          <DialogDescription>
            Atribuir pacote para {patientName}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="package">Selecionar Pacote</Label>
            <Select value={selectedPackageId} onValueChange={setSelectedPackageId}>
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
            <Label htmlFor="transport">Custo de Deslocamento (R$)</Label>
            <Input
              id="transport"
              type="number"
              step="0.01"
              value={transportCost}
              onChange={(e) => setTransportCost(parseFloat(e.target.value) || 0)}
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
                <span>R$ {transportCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Valor final:</span>
                <span>R$ {finalPrice.toFixed(2)}</span>
              </div>
              <div className="text-xs text-gray-600">
                Validade: {selectedPackage.validity} mês(es)
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Atribuir Pacote</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
