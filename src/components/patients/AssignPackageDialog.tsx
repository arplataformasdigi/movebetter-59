
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
import { Plus } from "lucide-react";
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

export function AssignPackageDialog({ patientId, patientName, packages, onAssignPackage }: AssignPackageDialogProps) {
  const [open, setOpen] = useState(false);
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
    setOpen(false);
    setPackageId("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-1 h-3 w-3" />
          Atribuir
        </Button>
      </DialogTrigger>
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
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
