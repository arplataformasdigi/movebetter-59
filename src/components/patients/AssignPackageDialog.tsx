
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
import { usePatientPackages } from "@/hooks/usePatientPackages";

interface Package {
  id: string;
  name: string;
  price: number;
  services: string[];
  validity_days?: number;
}

interface AssignPackageDialogProps {
  patientId: string;
  patientName: string;
  packages: Package[];
  onClose: () => void;
  isLoading?: boolean;
}

export function AssignPackageDialog({ 
  patientId, 
  patientName, 
  packages, 
  onClose,
  isLoading = false 
}: AssignPackageDialogProps) {
  const [packageId, setPackageId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { assignPackage } = usePatientPackages();

  const selectedPackage = packages.find(pkg => pkg.id === packageId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!packageId) {
      toast.error("Selecione um pacote");
      return;
    }

    if (!selectedPackage) {
      toast.error("Pacote selecionado não encontrado");
      return;
    }

    setSubmitting(true);

    try {
      const assignment = {
        patient_id: patientId,
        package_id: packageId,
        final_price: selectedPackage.price,
        status: 'active' as const,
        assigned_date: new Date().toISOString().split('T')[0],
        expiry_date: selectedPackage.validity_days 
          ? new Date(Date.now() + selectedPackage.validity_days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          : null,
        sessions_used: 0
      };

      const result = await assignPackage(assignment);
      
      if (result.success) {
        toast.success(`Pacote "${selectedPackage.name}" atribuído a ${patientName} com sucesso!`);
        onClose();
        setPackageId("");
      }
    } catch (error) {
      console.error('Error assigning package:', error);
      toast.error("Erro inesperado ao atribuir pacote");
    } finally {
      setSubmitting(false);
    }
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

          {selectedPackage && (
            <div className="p-3 bg-gray-50 rounded-md text-sm">
              <p><strong>Pacote:</strong> {selectedPackage.name}</p>
              <p><strong>Preço:</strong> R$ {selectedPackage.price.toFixed(2)}</p>
              {selectedPackage.validity_days && (
                <p><strong>Validade:</strong> {selectedPackage.validity_days} dias</p>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Atribuindo..." : "Atribuir Pacote"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
