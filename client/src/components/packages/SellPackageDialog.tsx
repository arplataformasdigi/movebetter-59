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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calculator, Package, CreditCard, MapPin } from "lucide-react";
import { toast } from "sonner";
import { CreditCardRate } from "@/hooks/useCreditCardRates";

interface SellPackageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSellPackage: (proposalData: any) => Promise<{ success: boolean }>;
  isProposal: boolean;
  creditCardRates: CreditCardRate[];
}

export function SellPackageDialog({
  isOpen,
  onClose,
  onSellPackage,
  isProposal,
  creditCardRates,
}: SellPackageDialogProps) {
  const [formData, setFormData] = useState({
    patientName: "",
    packageId: "",
    packageName: "",
    packagePrice: 0,
    transportCost: 0,
    otherCosts: 0,
    otherCostsNote: "",
    paymentMethod: "",
    installments: 1,
    finalPrice: 0,
    expiryDate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Calculate final price whenever transportCost or otherCosts change
    const calculateFinalPrice = () => {
      const basePrice = formData.packagePrice || 0;
      const transport = formData.transportCost || 0;
      const other = formData.otherCosts || 0;
      setFormData(prev => ({ ...prev, finalPrice: basePrice + transport + other }));
    };

    calculateFinalPrice();
  }, [formData.packagePrice, formData.transportCost, formData.otherCosts]);

  const handlePackageChange = (packageDetails: any) => {
    // Update package details when a package is selected
    setFormData(prev => ({
      ...prev,
      packageId: packageDetails.id,
      packageName: packageDetails.name,
      packagePrice: packageDetails.price,
      finalPrice: packageDetails.price + (formData.transportCost || 0) + (formData.otherCosts || 0),
    }));
  };

  const handlePaymentMethodChange = (method: string) => {
    // Update payment method and recalculate installments
    setFormData(prev => ({ ...prev, paymentMethod: method }));
  };

  const handleInstallmentChange = (installments: number) => {
    // Update the number of installments
    setFormData(prev => ({ ...prev, installments: installments }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patientName.trim()) {
      toast.error("Nome do paciente é obrigatório");
      return;
    }

    if (!formData.packageId) {
      toast.error("Selecione um pacote");
      return;
    }

    if (!formData.paymentMethod) {
      toast.error("Selecione um método de pagamento");
      return;
    }

    setIsSubmitting(true);

    try {
      const proposalData = {
        patientName: formData.patientName,
        packageId: formData.packageId,
        packageName: formData.packageName,
        packagePrice: formData.packagePrice,
        transportCost: formData.transportCost,
        otherCosts: formData.otherCosts,
        otherCostsNote: formData.otherCostsNote,
        paymentMethod: formData.paymentMethod,
        installments: formData.installments,
        finalPrice: formData.finalPrice,
        expiryDate: formData.expiryDate,
      };

      const result = await onSellPackage(proposalData);
      
      if (result.success) {
        toast.success(isProposal ? "Proposta criada com sucesso!" : "Venda realizada com sucesso!");
        onClose();
        
        // Reset form
        setFormData({
          patientName: "",
          packageId: "",
          packageName: "",
          packagePrice: 0,
          transportCost: 0,
          otherCosts: 0,
          otherCostsNote: "",
          paymentMethod: "",
          installments: 1,
          finalPrice: 0,
          expiryDate: "",
        });
      }
    } catch (error: unknown) {
      console.error("Error creating proposal:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      toast.error(`Erro ao ${isProposal ? 'criar proposta' : 'realizar venda'}: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {isProposal ? "Criar Proposta de Pacote" : "Vender Pacote"}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados para {isProposal ? "criar uma proposta" : "realizar a venda"} do pacote
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informações do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="patientName">Nome do Paciente *</Label>
                <Input
                  id="patientName"
                  value={formData.patientName}
                  onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                  placeholder="Nome completo do paciente"
                />
              </div>
            </CardContent>
          </Card>

          {/* Package Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-4 w-4" />
                Seleção do Pacote
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="package">Pacote *</Label>
                <Select
                  value={formData.packageId}
                  onValueChange={(value) => {
                    // Handle package selection
                    setFormData(prev => ({ ...prev, packageId: value }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um pacote" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Package options would be rendered here */}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Additional Costs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Custos Adicionais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="transportCost">Custo de Transporte (R$)</Label>
                  <Input
                    id="transportCost"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.transportCost}
                    onChange={(e) => setFormData(prev => ({ ...prev, transportCost: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="otherCosts">Outros Custos (R$)</Label>
                  <Input
                    id="otherCosts"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.otherCosts}
                    onChange={(e) => setFormData(prev => ({ ...prev, otherCosts: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              
              {formData.otherCosts > 0 && (
                <div>
                  <Label htmlFor="otherCostsNote">Observação sobre outros custos</Label>
                  <Textarea
                    id="otherCostsNote"
                    value={formData.otherCostsNote}
                    onChange={(e) => setFormData(prev => ({ ...prev, otherCostsNote: e.target.value }))}
                    placeholder="Descreva os outros custos..."
                    rows={2}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting 
                ? (isProposal ? "Criando Proposta..." : "Processando Venda...") 
                : (isProposal ? "Criar Proposta" : "Finalizar Venda")
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
