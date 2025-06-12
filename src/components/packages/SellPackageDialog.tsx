
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
import { Plus, Download } from "lucide-react";
import { toast } from "sonner";

interface Package {
  id: string;
  name: string;
  price: number;
  services: string[];
  validity: number;
}

interface Patient {
  id: string;
  name: string;
}

interface SoldPackage {
  id: string;
  packageId: string;
  packageName: string;
  patientName: string;
  packagePrice: number;
  transportCost: number;
  otherCosts: number;
  otherCostsNote: string;
  paymentMethod: string;
  installments: number;
  finalPrice: number;
  purchaseDate: string;
  expiryDate: string;
  status: "active" | "expired";
}

interface CreditCardRate {
  id: string;
  name: string;
  rate: number;
}

interface SellPackageDialogProps {
  packages: Package[];
  onSellPackage: (soldPackage: SoldPackage | any) => void;
  isProposal?: boolean;
  creditCardRates?: CreditCardRate[];
}

// Mock data for patients
const mockPatients: Patient[] = [
  { id: "1", name: "Maria Silva" },
  { id: "2", name: "João Santos" },
  { id: "3", name: "Ana Costa" },
  { id: "4", name: "Pedro Oliveira" },
  { id: "5", name: "Carla Souza" },
];

export function SellPackageDialog({ packages, onSellPackage, isProposal = false, creditCardRates = [] }: SellPackageDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    packageId: "",
    patientName: "",
    transportCost: 0,
    otherCosts: 0,
    otherCostsNote: "",
    paymentMethod: "",
    installments: 1,
  });

  const selectedPackage = packages.find(pkg => pkg.id === formData.packageId);
  
  // Calcular taxa de cartão de crédito
  const getCreditCardRate = (installments: number) => {
    const rate = creditCardRates.find(r => r.name === `${installments}x`);
    return rate ? rate.rate : 0;
  };

  const calculateFinalPrice = () => {
    if (!selectedPackage) return 0;
    
    const basePrice = selectedPackage.price + formData.transportCost + formData.otherCosts;
    
    if (formData.paymentMethod === "credit" && formData.installments > 1) {
      const rate = getCreditCardRate(formData.installments);
      const taxAmount = (basePrice * rate) / 100;
      return basePrice + taxAmount;
    }
    
    return basePrice;
  };

  const finalPrice = calculateFinalPrice();
  const showInstallments = formData.paymentMethod === "credit";
  const showOtherCostsNote = formData.otherCosts > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.packageId || !formData.patientName || !formData.paymentMethod) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const packageData = {
      id: Date.now().toString(),
      packageId: formData.packageId,
      packageName: selectedPackage?.name || "",
      patientName: formData.patientName,
      packagePrice: selectedPackage?.price || 0,
      transportCost: formData.transportCost,
      otherCosts: formData.otherCosts,
      otherCostsNote: formData.otherCostsNote,
      paymentMethod: formData.paymentMethod,
      installments: formData.installments,
      finalPrice,
      purchaseDate: new Date().toLocaleDateString("pt-BR"),
      expiryDate: new Date(Date.now() + (selectedPackage?.validity || 1) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR"),
      status: "active",
    };

    onSellPackage(packageData);
    toast.success(isProposal ? "Proposta criada com sucesso!" : "Pacote vendido com sucesso!");
    setOpen(false);
    setFormData({
      packageId: "",
      patientName: "",
      transportCost: 0,
      otherCosts: 0,
      otherCostsNote: "",
      paymentMethod: "",
      installments: 1,
    });
  };

  const handleDownloadPDF = () => {
    // Mock admin data - em produção viria do contexto/API
    const adminData = {
      name: "Dr. João Silva",
      email: "joao.silva@fisioclinica.com.br",
      council: "CREFITO-3 123456-F",
      phone: "(11) 99999-9999",
      address: "Rua das Flores, 123 - São Paulo, SP"
    };

    const content = `
PROPOSTA DE PACOTE - FISIO SMART CARE

Dados do Profissional:
Nome: ${adminData.name}
Email: ${adminData.email}
Conselho: ${adminData.council}
Telefone: ${adminData.phone}
Endereço: ${adminData.address}

Dados da Proposta:
Paciente: ${formData.patientName}
Pacote: ${selectedPackage?.name || ""}
Valor do Pacote: R$ ${selectedPackage?.price.toFixed(2) || "0,00"}
Outros Custos: R$ ${formData.otherCosts.toFixed(2)}
Forma de Pagamento: ${formData.paymentMethod === "pix" ? "PIX" : formData.paymentMethod === "cash" ? "Dinheiro" : "Cartão de Crédito"}
${showInstallments ? `Parcelas: ${formData.installments}x` : ""}
Valor Final: R$ ${finalPrice.toFixed(2)}

Data: ${new Date().toLocaleDateString("pt-BR")}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proposta-${formData.patientName.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("PDF da proposta baixado com sucesso!");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> 
          {isProposal ? "Gerar Proposta" : "Vender Pacote Manualmente"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isProposal ? "Gerar Proposta" : "Vender Pacote"}</DialogTitle>
          <DialogDescription>
            {isProposal ? "Crie uma proposta de pacote para o paciente" : "Registre a venda manual de um pacote"}
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
            <Label htmlFor="patientName">Nome do Paciente *</Label>
            <Select value={formData.patientName} onValueChange={(value) => setFormData(prev => ({ ...prev, patientName: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o paciente" />
              </SelectTrigger>
              <SelectContent>
                {mockPatients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.name}>
                    {patient.name}
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
              {formData.paymentMethod === "credit" && formData.installments > 1 && (
                <div className="flex justify-between text-sm">
                  <span>Taxa do cartão ({getCreditCardRate(formData.installments)}%):</span>
                  <span>R$ {(((selectedPackage.price + formData.otherCosts) * getCreditCardRate(formData.installments)) / 100).toFixed(2)}</span>
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
            {isProposal && selectedPackage && (
              <Button type="button" variant="outline" onClick={handleDownloadPDF}>
                <Download className="mr-2 h-4 w-4" />
                Baixar PDF
              </Button>
            )}
            <Button type="submit">
              {isProposal ? "Gerar Proposta" : "Vender Pacote"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
