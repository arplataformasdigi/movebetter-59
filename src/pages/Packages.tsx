
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreatePackageDialog } from "@/components/packages/CreatePackageDialog";

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
  packageName: string;
  clientName: string;
  petName: string;
  purchaseDate: string;
  expiryDate: string;
  usedCredits: number;
  totalCredits: number;
  status: "active" | "expired";
}

const mockPackages: Package[] = [
  {
    id: "1",
    name: "Combo Banho & Tosa Mensal",
    description: "Pacote completo com banho e tosa para pets médios",
    services: ["2x Banho M", "1x Tosa M"],
    price: 280.00,
    validity: 1,
    status: "active",
  },
];

const mockSoldPackages: SoldPackage[] = [
  {
    id: "1",
    packageName: "Pacote Fidelidade",
    clientName: "Maria Silva",
    petName: "Thor",
    purchaseDate: "14/05/2024",
    expiryDate: "14/08/2024",
    usedCredits: 3,
    totalCredits: 5,
    status: "active",
  },
  {
    id: "2",
    packageName: "Combo Banho & Tosa Mensal",
    clientName: "João Santos",
    petName: "Luna",
    purchaseDate: "19/05/2024",
    expiryDate: "19/06/2024",
    usedCredits: 0,
    totalCredits: 3,
    status: "expired",
  },
];

export default function Packages() {
  const [packages, setPackages] = useState<Package[]>(mockPackages);
  const [soldPackages, setSoldPackages] = useState<SoldPackage[]>(mockSoldPackages);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleCreatePackage = (newPackage: Package) => {
    setPackages([...packages, newPackage]);
  };

  const handleDeletePackage = (packageId: string) => {
    setPackages(packages.filter(pkg => pkg.id !== packageId));
  };

  const filteredPackages = packages.filter(pkg => 
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === "all" || pkg.status === statusFilter)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Package className="mr-2 h-8 w-8" /> Pacotes
          </h1>
          <p className="text-muted-foreground">
            Gerencie pacotes de atendimento e vendas.
          </p>
        </div>
      </div>

      <Tabs defaultValue="configuration" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="configuration">Configuração de Pacotes</TabsTrigger>
          <TabsTrigger value="sold">Pacotes Vendidos</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="configuration" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Configuração de Pacotes</CardTitle>
                  <CardDescription>Crie e gerencie seus pacotes de atendimento</CardDescription>
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
                          <Button variant="outline" size="sm">
                            <Pencil className="h-4 w-4 mr-1" /> Editar
                          </Button>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleDeletePackage(pkg.id)}
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

        <TabsContent value="sold" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pacotes Vendidos</CardTitle>
                  <CardDescription>Gerencie pacotes vendidos aos clientes</CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Vender Pacote Manualmente
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Input 
                placeholder="Buscar por cliente, pacote ou pet..." 
                className="w-64 mb-6"
              />
              
              <div className="space-y-4">
                {soldPackages.map((soldPkg) => (
                  <Card key={soldPkg.id}>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                        <div>
                          <h4 className="font-medium">{soldPkg.clientName}</h4>
                          <p className="text-sm text-gray-500">Pet: {soldPkg.petName}</p>
                        </div>
                        <div>
                          <p className="font-medium">{soldPkg.packageName}</p>
                        </div>
                        <div>
                          <p className="text-sm">Compra: {soldPkg.purchaseDate}</p>
                        </div>
                        <div>
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
                          <Badge className={soldPkg.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {soldPkg.status === "active" ? "Ativo" : "Expirado"}
                          </Badge>
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
              <CardTitle>Relatórios</CardTitle>
              <CardDescription>Visualize estatísticas de vendas dos pacotes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => {
                  const soldCount = soldPackages.filter(sold => sold.packageName === pkg.name).length;
                  const revenue = soldCount * pkg.price;
                  
                  return (
                    <Card key={pkg.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{pkg.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Vendidos:</span>
                            <span className="font-medium">{soldCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Receita:</span>
                            <span className="font-medium">R$ {revenue.toFixed(2)}</span>
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
    </div>
  );
}
