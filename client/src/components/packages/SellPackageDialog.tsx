import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
import { Calculator, Package, User, CreditCard, Calendar, CheckCircle, Download } from "lucide-react";
import { toast } from "sonner";
import { usePackageProposalsRealtime } from "@/hooks/usePackageProposalsRealtime";
import { usePackagesRealtime } from "@/hooks/usePackagesRealtime";
import { useRealtimePatients } from "@/hooks/useRealtimePatients";
import { useCreditCardRates } from "@/hooks/useCreditCardRates";
import { downloadProposalPDF } from "@/utils/proposalPDF";

interface ProposalData {
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

interface SellPackageDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onProposalAdded?: () => void;
}

export function SellPackageDialog({ open, onOpenChange, onProposalAdded }: SellPackageDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [proposalData, setProposalData] = useState<ProposalData | null>(null);
  const [showSuccessState, setShowSuccessState] = useState(false);
  const [createdProposal, setCreatedProposal] = useState<any>(null);
  
  const isControlled = open !== undefined && onOpenChange !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setOpen = isControlled ? onOpenChange : setInternalOpen;

  const { packages, isLoading: packagesLoading } = usePackagesRealtime();
  const { patients, isLoading: patientsLoading } = useRealtimePatients();
  const { addProposal } = usePackageProposalsRealtime();
  const { rates } = useCreditCardRates();

  const [formData, setFormData] = useState({
    packageId: "",
    patientName: "",
    transportCost: 0,
    otherCosts: 0,
    otherCostsNote: "",
    paymentMethod: "pix",
    installments: 1,
    expiryDate: "",
  });

  const resetForm = () => {
    setFormData({
      packageId: "",
      patientName: "",
      transportCost: 0,
      otherCosts: 0,
      otherCostsNote: "",
      paymentMethod: "pix",
      installments: 1,
      expiryDate: "",
    });
    setProposalData(null);
    setShowSuccessState(false);
    setCreatedProposal(null);
  };

  const selectedPackage = packages.find(pkg => pkg.id === formData.packageId);
  
  const getCreditCardRate = (installments: number) => {
    const rate = rates.find(r => r.name === `${installments}x`);
    return rate ? rate.rate : 0;
  };

  const calculateFinalPrice = () => {
    if (!selectedPackage) return 0;
    
    const basePrice = selectedPackage.price + formData.transportCost + formData.otherCosts;
    
    if (formData.paymentMethod === "credit") {
      const rate = getCreditCardRate(formData.installments);
      const taxAmount = (basePrice * rate) / 100;
      return basePrice + taxAmount;
    }
    
    return basePrice;
  };

  const finalPrice = calculateFinalPrice();
  const showInstallments = formData.paymentMethod === "credit";
  const showOtherCostsNote = formData.otherCosts > 0;

  const generateProposal = () => {
    if (!formData.packageId || !formData.patientName || !formData.paymentMethod) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const proposalId = Date.now().toString();
    const today = new Date();
    const expiryDate = formData.expiryDate || new Date(2027, 11, 12).toISOString().split('T')[0];

    const proposal: ProposalData = {
      id: proposalId,
      packageId: formData.packageId,
      packageName: selectedPackage?.name || "",
      patientName: formData.patientName,
      packagePrice: selectedPackage?.price || 0,
      transportCost: formData.transportCost,
      otherCosts: formData.otherCosts,
      otherCostsNote: formData.otherCostsNote,
      paymentMethod: formData.paymentMethod,
      installments: formData.installments,
      finalPrice: finalPrice,
      purchaseDate: today.toLocaleDateString('pt-BR'),
      expiryDate: new Date(expiryDate).toLocaleDateString('pt-BR'),
      status: "active"
    };

    setProposalData(proposal);
  };

  const saveProposal = async () => {
    if (!proposalData) return;

    setIsGenerating(true);

    try {
      console.log("Creating proposal with data:", proposalData);
      
      const result = await addProposal(proposalData);
      
      if (result && result.id) {
        console.log("Proposal created successfully");
        
        // Store the created proposal and show success state
        setCreatedProposal(result);
        setShowSuccessState(true);
        onProposalAdded?.();
        
        // Automatically download PDF
        downloadProposalPDF(result);
        
        toast.success("Proposta criada e aprovada com sucesso!");
        
        // Auto-close after 3 seconds
        setTimeout(() => {
          resetForm();
          setOpen(false);
        }, 3000);
        
      } else {
        throw new Error("Failed to create proposal");
      }
    } catch (error) {
      console.error('Error creating proposal:', error);
      toast.error("Erro ao criar proposta");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = () => {
    if (createdProposal) {
      downloadProposalPDF(createdProposal);
    }
  };

  const DialogComponent = (
    <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Gerador de Proposta
        </DialogTitle>
        <DialogDescription>
          Crie propostas personalizadas para seus pacientes
        </DialogDescription>
      </DialogHeader>
      
      {showSuccessState && createdProposal ? (
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-green-800">
              Proposta Aprovada!
            </h3>
            <p className="text-sm text-gray-600">
              A proposta foi criada com sucesso para {createdProposal.patient_name}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Pacote:</span>
              <span>{createdProposal.package_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Paciente:</span>
              <span>{createdProposal.patient_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Valor Final:</span>
              <span className="font-semibold text-green-600">
                R$ {createdProposal.final_price.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Método de Pagamento:</span>
              <span className="capitalize">{createdProposal.payment_method}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Parcelas:</span>
              <span>{createdProposal.installments}x</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleDownloadPDF}
              className="flex-1"
              variant="default"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar PDF
            </Button>
            <Button
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
              variant="outline"
              className="flex-1"
            >
              Nova Proposta
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="packageId">Pacote *</Label>
              <Select value={formData.packageId} onValueChange={(value) => setFormData(prev => ({ ...prev, packageId: value }))}>
                <SelectTrigger className="h-9">
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
              <Select 
                value={formData.patientName} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, patientName: value }))}
                disabled={patientsLoading}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder={patientsLoading ? "Carregando pacientes..." : "Selecione o paciente"} />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.name}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="transportCost">Custo de Transporte (R$)</Label>
                <Input
                  id="transportCost"
                  type="number"
                  step="0.01"
                  value={formData.transportCost}
                  onChange={(e) => setFormData(prev => ({ ...prev, transportCost: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                  className="h-9"
                />
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
                  className="h-9"
                />
              </div>
            </div>

            {showOtherCostsNote && (
              <div>
                <Label htmlFor="otherCostsNote">Observação dos Outros Custos</Label>
                <Textarea
                  id="otherCostsNote"
                  value={formData.otherCostsNote}
                  onChange={(e) => setFormData(prev => ({ ...prev, otherCostsNote: e.target.value }))}
                  placeholder="Descreva os outros custos..."
                  className="h-16 resize-none"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="paymentMethod">Forma de Pagamento *</Label>
                <Select value={formData.paymentMethod} onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}>
                  <SelectTrigger className="h-9">
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
                    <SelectTrigger className="h-9">
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

              {!showInstallments && (
                <div>
                  <Label htmlFor="expiryDate">Data de Validade</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className="h-9"
                  />
                </div>
              )}
            </div>

            {showInstallments && (
              <div>
                <Label htmlFor="expiryDate">Data de Validade</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                  className="h-9"
                />
              </div>
            )}
          </div>

          {selectedPackage && (
            <div className="space-y-1 p-3 bg-gray-50 rounded-lg text-sm">
              <div className="flex justify-between">
                <span>Valor do pacote:</span>
                <span>R$ {selectedPackage.price.toFixed(2)}</span>
              </div>
              {formData.transportCost > 0 && (
                <div className="flex justify-between">
                  <span>Custo de transporte:</span>
                  <span>R$ {formData.transportCost.toFixed(2)}</span>
                </div>
              )}
              {formData.otherCosts > 0 && (
                <div className="flex justify-between">
                  <span>Outros custos:</span>
                  <span>R$ {formData.otherCosts.toFixed(2)}</span>
                </div>
              )}
              {formData.paymentMethod === "credit" && (
                <div className="flex justify-between">
                  <span>Taxa do cartão ({getCreditCardRate(formData.installments)}%):</span>
                  <span>R$ {(((selectedPackage.price + formData.transportCost + formData.otherCosts) * getCreditCardRate(formData.installments)) / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-medium text-base border-t pt-1 mt-2">
                <span>Valor final:</span>
                <span>R$ {finalPrice.toFixed(2)}</span>
              </div>
              {showInstallments && formData.installments > 1 && (
                <div className="flex justify-between">
                  <span>Valor por parcela:</span>
                  <span>R$ {(finalPrice / formData.installments).toFixed(2)}</span>
                </div>
              )}
            </div>
          )}

          {proposalData && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2 text-sm">
                <Calculator className="h-4 w-4" />
                Resumo da Proposta
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Paciente:</span>
                  <span className="font-medium">{proposalData.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pacote:</span>
                  <span className="font-medium">{proposalData.packageName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Valor Final:</span>
                  <span className="font-semibold text-blue-700">R$ {proposalData.finalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pagamento:</span>
                  <span className="font-medium">{proposalData.paymentMethod.toUpperCase()} - {proposalData.installments}x</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {!showSuccessState && (
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          {!proposalData ? (
            <Button 
              type="button" 
              onClick={generateProposal}
              disabled={!formData.packageId || !formData.patientName || isGenerating}
            >
              {isGenerating ? "Gerando..." : "Gerar Proposta"}
            </Button>
          ) : (
            <Button 
              type="button" 
              onClick={saveProposal}
              disabled={isGenerating}
              className="bg-green-600 hover:bg-green-700"
            >
              {isGenerating ? "Salvando..." : "Confirmar e Salvar"}
            </Button>
          )}
        </DialogFooter>
      )}
    </DialogContent>
  );

  if (isControlled) {
    return (
      <Dialog open={isOpen} onOpenChange={setOpen}>
        {DialogComponent}
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Package className="mr-2 h-4 w-4" />
          Gerar Proposta
        </Button>
      </DialogTrigger>
      {DialogComponent}
    </Dialog>
  );
}