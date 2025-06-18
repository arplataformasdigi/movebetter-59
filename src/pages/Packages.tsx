import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash, Package, Edit, UserX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { CreatePackageDialog } from "@/components/packages/CreatePackageDialog";
import { EditPackageDialog } from "@/components/packages/EditPackageDialog";
import { SellPackageDialog } from "@/components/packages/SellPackageDialog";
import { DeletePackageDialog } from "@/components/packages/DeletePackageDialog";
import { usePackages } from "@/hooks/usePackages";
import { usePackageProposals } from "@/hooks/usePackageProposals";
import { useCreditCardRates } from "@/hooks/useCreditCardRates";
import { usePatients } from "@/hooks/usePatients";

export default function Packages() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [deletePackage, setDeletePackage] = useState<{ id: string; name: string } | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newRate, setNewRate] = useState({ name: "", rate: 0 });

  const { packages, isLoading: packagesLoading, updatePackage, deletePackage: removePackage, fetchPackages } = usePackages();
  const { proposals, isLoading: proposalsLoading, addProposal, deleteProposal } = usePackageProposals();
  const { rates, isLoading: ratesLoading, addRate, deleteRate } = useCreditCardRates();
  const { patients, isLoading: patientsLoading } = usePatients();

  // Force refresh packages when component mounts
  useEffect(() => {
    console.log('Packages component mounted, refreshing data...');
    fetchPackages();
  }, [fetchPackages]);

  // Log packages for debugging
  useEffect(() => {
    console.log('Current packages state:', packages);
    console.log('Packages loading state:', packagesLoading);
  }, [packages, packagesLoading]);

  const handleEditPackage = async (updatedPackage: any) => {
    await updatePackage(updatedPackage.id, updatedPackage);
  };

  const handleDeletePackage = async (packageId: string) => {
    await removePackage(packageId);
    setDeletePackage(null);
  };

  const handleCreateProposal = async (proposalData: any) => {
    await addProposal(proposalData);
  };

  const handleApproveProposal = async (proposalId: string) => {
    const proposal = proposals.find(p => p.id === proposalId);
    if (proposal) {
      // Create patient package record here if needed
      await deleteProposal(proposalId);
    }
  };

  const handleDeleteProposal = async (proposalId: string) => {
    await deleteProposal(proposalId);
  };

  const handleAddCreditCardRate = async () => {
    if (!newRate.name || newRate.rate <= 0) {
      return;
    }

    await addRate({
      name: newRate.name,
      rate: newRate.rate,
      is_active: true,
    });
    setNewRate({ name: "", rate: 0 });
  };

  const handleDeleteCreditCardRate = async (rateId: string) => {
    await deleteRate(rateId);
  };

  const filteredPackages = packages.filter(pkg => 
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === "all" || (statusFilter === "active" ? pkg.is_active : !pkg.is_active))
  );

  console.log('Filtered packages:', filteredPackages);

  const openEditDialog = (pkg: any) => {
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

  // Transform packages for SellPackageDialog with proper type safety
  const transformedPackages = packages.map(pkg => ({
    id: pkg.id,
    name: pkg.name,
    description: pkg.description || "",
    services: pkg.services || [],
    price: pkg.price,
    validity: pkg.validity_days || 30,
    status: pkg.is_active ? "active" as const : "inactive" as const,
    sessions_included: pkg.sessions_included || 0,
  }));

  if (packagesLoading || proposalsLoading || ratesLoading || patientsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando dados...</div>
      </div>
    );
  }

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

      <Tabs defaultValue="configuration" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="configuration">Configuração de Pacotes</TabsTrigger>
          <TabsTrigger value="rates">Configuração de Taxas</TabsTrigger>
          <TabsTrigger value="proposals">Gerador de Proposta</TabsTrigger>
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
                <CreatePackageDialog />
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

              {/* Debug info */}
              <div className="mb-4 p-2 bg-gray-100 rounded text-sm">
                <p>Total de pacotes: {packages.length}</p>
                <p>Pacotes filtrados: {filteredPackages.length}</p>
                <p>Termo de busca: "{searchTerm}"</p>
                <p>Filtro de status: {statusFilter}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPackages.length > 0 ? (
                  filteredPackages.map((pkg) => (
                    <Card key={pkg.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{pkg.name}</CardTitle>
                          <Badge className={pkg.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {pkg.is_active ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                        <CardDescription>{pkg.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div>
                            <h4 className="font-medium text-sm">Serviços inclusos:</h4>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {pkg.services?.map((service, index) => (
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
                            <span className="font-medium">{pkg.validity_days} dias</span>
                          </div>
                          {pkg.sessions_included && pkg.sessions_included > 0 && (
                            <div className="flex justify-between text-sm">
                              <span>Sessões:</span>
                              <span className="font-medium">{pkg.sessions_included}</span>
                            </div>
                          )}
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
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <div className="text-gray-500 mb-2">
                      {packages.length === 0 ? "Nenhum pacote criado ainda" : "Nenhum pacote encontrado com os filtros atuais"}
                    </div>
                    {packages.length === 0 && (
                      <CreatePackageDialog />
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuração de Taxas de Cartão</CardTitle>
              <CardDescription>Configure as taxas de cartão de crédito por quantidade de parcelas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rateName">Nome da Taxa</Label>
                    <Input
                      id="rateName"
                      value={newRate.name}
                      onChange={(e) => setNewRate(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: 1x, 2x, 3x..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="ratePercentage">Taxa (%)</Label>
                    <Input
                      id="ratePercentage"
                      type="number"
                      step="0.01"
                      value={newRate.rate}
                      onChange={(e) => setNewRate(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
                      placeholder="Ex: 2.99"
                    />
                  </div>
                </div>
                <Button onClick={handleAddCreditCardRate}>
                  <Plus className="mr-2 h-4 w-4" /> Adicionar Taxa
                </Button>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Taxas Cadastradas</h3>
                <div className="space-y-2">
                  {rates.map((rate) => (
                    <div key={rate.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <span className="font-medium">{rate.name}</span>
                        <span className="ml-2 text-muted-foreground">{rate.rate}%</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteCreditCardRate(rate.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
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
                  packages={transformedPackages}
                  onSellPackage={handleCreateProposal}
                  isProposal={true}
                  creditCardRates={rates}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {proposals.map((proposal) => (
                  <Card key={proposal.id}>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                        <div>
                          <p className="font-medium">{proposal.patient_name}</p>
                        </div>
                        <div>
                          <p className="font-medium">{proposal.packages?.name || 'Pacote não encontrado'}</p>
                        </div>
                        <div>
                          <p className="text-sm">Pacote: R$ {proposal.package_price.toFixed(2)}</p>
                          <p className="text-sm">Transporte: R$ {proposal.transport_cost.toFixed(2)}</p>
                          {proposal.other_costs > 0 && (
                            <p className="text-sm">Outros: R$ {proposal.other_costs.toFixed(2)}</p>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">Total: R$ {proposal.final_price.toFixed(2)}</p>
                          <p className="text-sm">{getPaymentMethodLabel(proposal.payment_method)}</p>
                          {proposal.installments > 1 && (
                            <p className="text-sm">{proposal.installments}x de R$ {(proposal.final_price / proposal.installments).toFixed(2)}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm">Criada: {proposal.created_date}</p>
                          <p className="text-sm">Vencimento: {proposal.expiry_date || 'Não definido'}</p>
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
                {proposals.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhuma proposta criada ainda
                  </div>
                )}
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
              <div className="text-center py-8 text-gray-500">
                Relatórios de vendas em desenvolvimento
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
