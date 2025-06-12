
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
  const [formData, setFormData] = useState({
    packageId: "",
    otherCosts: 0,
    otherCostsNote: "",
    paymentMethod: "",
    installments: 1,
  });

  const selectedPackage = packages.find(pkg => pkg.id === formData.packageId);

  const calculateFinalPrice = () => {
    if (!selectedPackage) return 0;
    return selectedPackage.price + formData.otherCosts;
  };

  const finalPrice = calculateFinalPrice();
  const showInstallments = formData.paymentMethod === "credit";
  const showOtherCostsNote = formData.otherCosts > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.packageId || !formData.paymentMethod) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const assignment = {
      id: Date.now().toString(),
      patientId,
      patientName,
      packageId: formData.packageId,
      packageName: selectedPackage?.name || "",
      packagePrice: selectedPackage?.price || 0,
      otherCosts: formData.otherCosts,
      otherCostsNote: formData.otherCostsNote,
      paymentMethod: formData.paymentMethod,
      installments: formData.installments,
      finalPrice,
      assignedDate: new Date().toLocaleDateString("pt-BR"),
      expiryDate: new Date(Date.now() + (selectedPackage?.validity || 1) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR"),
      status: "active",
    };

    onAssignPackage(assignment);
    toast.success("Pacote atribuído com sucesso!");
    setOpen(false);
    setFormData({
      packageId: "",
      otherCosts: 0,
      otherCostsNote: "",
      paymentMethod: "",
      installments: 1,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-1 h-3 w-3" />
          Atribuir
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Atribuir Pacote</DialogTitle>
          <DialogDescription>
            Atribua um pacote para {patientName}
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
            <Label htmlFor="otherCosts">Outros Custos (R$)</Label>
            <Input
              id="otherCosts"
              type="number"
              step="0.01"
              value={formData.otherCosts}
              onChange={(e) => setFormData(prev => ({ ...prev, otherCosts: parseFloat(e.target.value) || 0 }))}
              placeholder="0.00"
            />
          </div>

          {showOtherCostsNote && (
            <div>
              <Label htmlFor="otherCostsNote">Observação dos Outros Custos</Label>
              <Textarea
                id="otherCostsNote"
                value={formData.otherCostsNote}
                onChange={(e) => setFormData(prev => ({ ...prev, otherCostsNote: e.target.value }))}
                placeholder="Descreva os outros custos..."
              />
            </div>
          )}

          <div>
            <Label htmlFor="paymentMethod">Forma de Pagamento *</Label>
            <Select value={formData.paymentMethod} onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a forma de pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="cash">Dinheiro</SelectItem>
                <SelectItem value="credit">Cartão de Crédito</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {showInstallments && (
            <div>
              <Label htmlFor="installments">Quantidade de Parcelas</Label>
              <Select 
                value={formData.installments.toString()} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, installments: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}x
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedPackage && (
            <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Valor do pacote:</span>
                <span>R$ {selectedPackage.price.toFixed(2)}</span>
              </div>
              {formData.otherCosts > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Outros custos:</span>
                  <span>R$ {formData.otherCosts.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-medium">
                <span>Valor final:</span>
                <span>R$ {finalPrice.toFixed(2)}</span>
              </div>
              {showInstallments && formData.installments > 1 && (
                <div className="flex justify-between text-sm">
                  <span>Valor por parcela:</span>
                  <span>R$ {(finalPrice / formData.installments).toFixed(2)}</span>
                </div>
              )}
            </div>
          )}

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
