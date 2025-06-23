
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  onClose: () => void;
  isLoading?: boolean;
}

export function AssignPackageDialog({ 
  patientId, 
  patientName, 
  packages, 
  onAssignPackage, 
  onClose,
  isLoading = false 
}: AssignPackageDialogProps) {
  const [packageId, setPackageId] = useState("");

  const selectedPackage = packages.find(pkg => pkg.id === packageId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!packageId) {
      toast.error("Selecione um pacote");
      return;
    }

    const assignment = {
      id: Date.now().toString(),
      patientId,
      patientName,
      packageId: packageId,
      packageName: selectedPackage?.name || "",
      packagePrice: selectedPackage?.price || 0,
      finalPrice: selectedPackage?.price || 0,
      assignedDate: new Date().toLocaleDateString("pt-BR"),
      expiryDate: new Date(Date.now() + (selectedPackage?.validity || 1) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR"),
      status: "active",
    };

    onAssignPackage(assignment);
    toast.success("Pacote atribuído com sucesso!");
    onClose();
    setPackageId("");
  };

  if (isLoading) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Carregando...</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-6">
            <div className="text-lg">Carregando pacotes...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Atribuir Pacote</DialogTitle>
          <DialogDescription>
            Atribua um pacote para {patientName}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Select value={packageId} onValueChange={setPackageId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar Pacote" />
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

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Atribuir Pacote
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
