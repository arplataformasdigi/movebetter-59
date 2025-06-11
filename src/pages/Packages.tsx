
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash, Package, Edit, UserX, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CreatePackageDialog } from "@/components/packages/CreatePackageDialog";
import { EditPackageDialog } from "@/components/packages/EditPackageDialog";
import { SellPackageDialog } from "@/components/packages/SellPackageDialog";
import { DeletePackageDialog } from "@/components/packages/DeletePackageDialog";
import { toast } from "sonner";

interface Package {
  id: string;
  name: string;
  description: string;
  services: string[];
  price: number;
  validity: number; // em meses
  status: "active" | "inactive";
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
  usedCredits: number;
  totalCredits: number;
  status: "active" | "expired" | "inactive";
}

interface Proposal {
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
  createdDate: string;
  expiryDate: string;
  totalCredits: number;
}

const mockPackages: Package[] = [
  {
    id: "1",
    name: "Pacote Fisioterapia Respiratória",
    description: "Tratamento completo para reabilitação respiratória",
    services: ["4x Sessão de Fisioterapia Respiratória", "1x Avaliação Inicial", "2x Exercícios Domiciliares"],
    price: 450.00,
    validity: 2,
    status: "active",
  },
  {
    id: "2",
    name: "Pacote Fisioterapia Motora",
    description: "Reabilitação motora especializada",
    services: ["6x Sessão de Fisioterapia Motora", "1x Avaliação Completa", "3x Exercícios de Fortalecimento"],
    price: 680.00,
    validity: 3,
    status: "active",
  },
];

const mockSoldPackages: SoldPackage[] = [
  {
    id: "1",
    packageId: "2",
    packageName: "Pacote Fisioterapia Motora",
    patientName: "Maria Silva",
    packagePrice: 680.00,
    transportCost: 50.00,
    otherCosts: 0,
    otherCostsNote: "",
    paymentMethod: "pix",
    installments: 1,
    finalPrice: 730.00,
    purchaseDate: "14/05/2024",
    expiryDate: "14/08/2024",
    usedCredits: 3,
    totalCredits: 10,
    status: "active",
  },
  {
    id: "2",
    packageId: "1",
    packageName: "Pacote Fisioterapia Respiratória",
    patientName: "João Santos",
    packagePrice: 450.00,
    transportCost: 30.00,
    otherCosts: 25.00,
    otherCostsNote: "Material adicional",
    paymentMethod: "credit",
    installments: 3,
    finalPrice: 505.00,
    purchaseDate: "19/05/2024",
    expiryDate: "19/06/2024",
    usedCredits: 0,
    totalCredits: 7,
    status: "expired",
  },
];

export default function Packages() {
  const [packages, setPackages] = useState<Package[]>(mockPackages);
  const [soldPackages, setSoldPackages] = useState<SoldPackage[]>(mockSoldPackages);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [deletePackage, setDeletePackage] = useState<{ id: string; name: string } | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [allowPatientMarkAsCompleted, setAllowPatientMarkAsCompleted] = useState(true);

  const getPackageStats = (packageId: string) => {
    const packageSales = soldPackages.filter(sp => sp.packageId === packageId);
    const soldCount = packageSales.length;
    const revenue = packageSales.reduce((sum, sp) => sum + sp.finalPrice, 0);
    
    return {
      soldCount,
      revenue
    };
  };

  const handleCreatePackage = (newPackage: Package) => {
    setPackages([...packages, newPackage]);
    toast.success("Pacote criado com sucesso!");
  };

  const handleEditPackage = (updatedPackage: Package) => {
    setPackages(packages.map(pkg => pkg.id === updatedPackage.id ? updatedPackage : pkg));
    toast.success("Pacote atualizado com sucesso!");
  };

  const handleDeletePackage = (packageId: string) => {
    setPackages(packages.filter(pkg => pkg.id !== packageId));
    setDeletePackage(null);
    toast.success("Pacote excluído com sucesso!");
  };

  const handleSellPackage = (soldPackage: SoldPackage) => {
    setSoldPackages([...soldPackages, soldPackage]);
  };

  const handleCreateProposal = (proposalData: any) => {
    const newProposal: Proposal = {
      ...proposalData,
      id: Date.now().toString(),
      createdDate: new Date().toLocaleDateString("pt-BR"),
    };
    setProposals([...proposals, newProposal]);
    toast.success("Proposta criada com sucesso!");
  };

  const handleApproveProposal = (proposalId: string) => {
    const proposal = proposals.find(p => p.id === proposalId);
    if (proposal) {
      const soldPackage: SoldPackage = {
        id: Date.now().toString(),
        packageId: proposal.packageId,
        packageName: proposal.packageName,
        patientName: proposal.patientName,
        packagePrice: proposal.packagePrice,
        transportCost: proposal.transportCost,
        otherCosts: proposal.otherCosts,
        otherCostsNote: proposal.otherCostsNote,
        paymentMethod: proposal.paymentMethod,
        installments: proposal.installments,
        finalPrice: proposal.finalPrice,
        purchaseDate: new Date().toLocaleDateString("pt-BR"),
        expiryDate: proposal.expiryDate,
        usedCredits: 0,
        totalCredits: proposal.totalCredits,
        status: "active",
      };
      
      setSoldPackages([...soldPackages, soldPackage]);
      setProposals(proposals.filter(p => p.id !== proposalId));
      toast.success("Proposta aprovada e movida para pacotes vendidos!");
    }
  };

  const handleDeleteProposal = (proposalId: string) => {
    setProposals(proposals.filter(p => p.id !== proposalId));
    toast.success("Proposta excluída com sucesso!");
  };

  const handleDeleteSoldPackage = (soldPackageId: string) => {
    setSoldPackages(soldPackages.filter(sp => sp.id !== soldPackageId));
    toast.success("Pacote vendido excluído com sucesso!");
  };

  const handleToggleSoldPackageStatus = (soldPackageId: string) => {
    setSoldPackages(soldPackages.map(sp => 
      sp.id === soldPackageId 
        ? { ...sp, status: sp.status === "active" ? "inactive" : "active" as "active" | "inactive" }
        : sp
    ));
    toast.success("Status do pacote atualizado!");
  };

  const handleAuthorizationSettings = (checked: boolean) => {
    setAllowPatientMarkAsCompleted(checked);
    toast.success("Configurações de autorização atualizadas!");
  };

  const filteredPackages = packages.filter(pkg => 
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === "all" || pkg.status === statusFilter)
  );

  const openEditDialog = (pkg: Package) => {
    setEditingPackage(pkg);
    setEditDialogOpen(true);
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "pix": return "PIX";
      case "cash": return "Dinheiro";
      case "credit": return "Cartão de Crédito";
      case "debit": return "Cartão de Débito";
      default: return method;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Package className="mr-2 h-8 w-8" /> Pacotes
          </h1>
          <p className="text-muted-foreground">
            Gerencie pacotes de fisioterapia e vendas.
          </p>
        </div>
      </div>

      {/* Configurações de Autorização */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5" />
            Configurações de Autorização
          </CardTitle>
          <CardDescription>
            Configure as permissões dos pacientes para interagir com os planos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              id="allow-mark-completed"
              checked={allowPatientMarkAsCompleted}
              onCheckedChange={handleAuthorizationSettings}
            />
            <Label htmlFor="allow-mark-completed">
              Permitir que pacientes marquem exercícios como concluídos
            </Label>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="configuration" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="configuration">Configuração de Pacotes</TabsTrigger>
          <TabsTrigger value="proposals">Gerador de Proposta</TabsTrigger>
          <TabsTrigger value="sold">Pacotes Vendidos</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="configuration" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Configuração de Pacotes</CardTitle>
                  <CardDescription>Crie e gerencie seus pacotes de fisioterapia</CardDescription>
                </div>
                <CreatePackageDialog onCreatePackage={handleCreatePackage} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between space-x-2 mb-6">
                <Input 
                  placeholder="Buscar pacotes..." 
                  className="w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}  
                />
                <select 
                  className="border rounded px-3 py-2"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Todos os Status</option>
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPackages.map((pkg) => (
                  <Card key={pkg.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{pkg.name}</CardTitle>
                        <Badge className={pkg.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {pkg.status === "active" ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <CardDescription>{pkg.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <h4 className="font-medium text-sm">Serviços inclusos:</h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {pkg.services.map((service, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Preço:</span>
                          <span className="font-medium">R$ {pkg.price.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Validade:</span>
                          <span className="font-medium">{pkg.validity} mês(es)</span>
                        </div>
                      </div>
                      <div className="flex justify-between mt-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(pkg)}>
                            <Pencil className="h-4 w-4 mr-1" /> Editar
                          </Button>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => setDeletePackage({ id: pkg.id, name: pkg.name })}
                        >
                          <Trash className="h-4 w-4 mr-1" /> Excluir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="proposals" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gerador de Proposta</CardTitle>
                  <CardDescription>Crie propostas para pacientes</CardDescription>
                </div>
                <SellPackageDialog 
                  packages={packages} 
                  onSellPackage={handleCreateProposal}
                  isProposal={true}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {proposals.map((proposal) => (
                  <Card key={proposal.id}>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                        <div>
                          <p className="font-medium">{proposal.patientName}</p>
                        </div>
                        <div>
                          <p className="font-medium">{proposal.packageName}</p>
                        </div>
                        <div>
                          <p className="text-sm">Pacote: R$ {proposal.packagePrice.toFixed(2)}</p>
                          <p className="text-sm">Transporte: R$ {proposal.transportCost.toFixed(2)}</p>
                          {proposal.otherCosts > 0 && (
                            <p className="text-sm">Outros: R$ {proposal.otherCosts.toFixed(2)}</p>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">Total: R$ {proposal.finalPrice.toFixed(2)}</p>
                          <p className="text-sm">{getPaymentMethodLabel(proposal.paymentMethod)}</p>
                          {proposal.installments > 1 && (
                            <p className="text-sm">{proposal.installments}x de R$ {(proposal.finalPrice / proposal.installments).toFixed(2)}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm">Criada: {proposal.createdDate}</p>
                          <p className="text-sm">Vencimento: {proposal.expiryDate}</p>
                        </div>
                        <div>
                          <p className="text-sm">Créditos: {proposal.totalCredits}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => handleApproveProposal(proposal.id)}
                          >
                            Aprovar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteProposal(proposal.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sold" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pacotes Vendidos</CardTitle>
                  <CardDescription>Gerencie pacotes vendidos aos pacientes</CardDescription>
                </div>
                <SellPackageDialog packages={packages} onSellPackage={handleSellPackage} />
              </div>
            </CardHeader>
            <CardContent>
              <Input 
                placeholder="Buscar por pacote ou paciente..." 
                className="w-64 mb-6"
              />
              
              <div className="space-y-4">
                {soldPackages.map((soldPkg) => (
                  <Card key={soldPkg.id}>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-8 gap-4 items-center">
                        <div>
                          <p className="font-medium">{soldPkg.patientName}</p>
                        </div>
                        <div>
                          <p className="font-medium">{soldPkg.packageName}</p>
                        </div>
                        <div>
                          <p className="text-sm">Pacote: R$ {soldPkg.packagePrice.toFixed(2)}</p>
                          <p className="text-sm">Transporte: R$ {soldPkg.transportCost.toFixed(2)}</p>
                          {soldPkg.otherCosts > 0 && (
                            <p className="text-sm">Outros: R$ {soldPkg.otherCosts.toFixed(2)}</p>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">Total: R$ {soldPkg.finalPrice.toFixed(2)}</p>
                          <p className="text-sm">{getPaymentMethodLabel(soldPkg.paymentMethod)}</p>
                          {soldPkg.installments > 1 && (
                            <p className="text-sm">{soldPkg.installments}x de R$ {(soldPkg.finalPrice / soldPkg.installments).toFixed(2)}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm">Compra: {soldPkg.purchaseDate}</p>
                          <p className="text-sm">Vencimento: {soldPkg.expiryDate}</p>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <div className="text-sm">{soldPkg.usedCredits}/{soldPkg.totalCredits}</div>
                            <div className="w-16 h-2 bg-gray-200 rounded-full">
                              <div 
                                className="h-full bg-blue-500 rounded-full" 
                                style={{ width: `${(soldPkg.usedCredits / soldPkg.totalCredits) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <Badge className={
                            soldPkg.status === "active" ? "bg-green-100 text-green-800" : 
                            soldPkg.status === "expired" ? "bg-red-100 text-red-800" :
                            "bg-gray-100 text-gray-800"
                          }>
                            {soldPkg.status === "active" ? "Ativo" : 
                             soldPkg.status === "expired" ? "Expirado" : "Inativo"}
                          </Badge>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleSoldPackageStatus(soldPkg.id)}
                            disabled={soldPkg.status === "expired"}
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteSoldPackage(soldPkg.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios de Vendas</CardTitle>
              <CardDescription>Visualize estatísticas de vendas dos pacotes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => {
                  const stats = getPackageStats(pkg.id);
                  
                  return (
                    <Card key={pkg.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{pkg.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Pacotes vendidos:</span>
                            <span className="font-medium">{stats.soldCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Receita total:</span>
                            <span className="font-medium">R$ {stats.revenue.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Receita média:</span>
                            <span className="font-medium">
                              R$ {stats.soldCount > 0 ? (stats.revenue / stats.soldCount).toFixed(2) : "0.00"}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <EditPackageDialog
        package={editingPackage}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onEditPackage={handleEditPackage}
      />

      <DeletePackageDialog
        open={!!deletePackage}
        onOpenChange={() => setDeletePackage(null)}
        onConfirm={() => deletePackage && handleDeletePackage(deletePackage.id)}
        packageName={deletePackage?.name || ""}
      />
    </div>
  );
}
