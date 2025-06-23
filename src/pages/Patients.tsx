
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Search, Pencil, Trash, Eye, FileText, Activity } from "lucide-react";
import { AddPatientDialog } from "@/components/patients/AddPatientDialog";
import { EditPatientDialog } from "@/components/patients/EditPatientDialog";
import { DeletePatientDialog } from "@/components/patients/DeletePatientDialog";
import { PatientDetails } from "@/components/patients/PatientDetails";
import { AssignPackageDialog } from "@/components/patients/AssignPackageDialog";
import { PatientAccessDialog } from "@/components/patients/PatientAccessDialog";
import { usePatients } from "@/hooks/usePatients";
import { usePackagesData } from "@/hooks/usePackagesData";

export default function Patients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [editingPatient, setEditingPatient] = useState<any>(null);
  const [deletingPatient, setDeletingPatient] = useState<{ id: string; name: string } | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [assignPackageOpen, setAssignPackageOpen] = useState(false);

  const { patients, isLoading, addPatient, updatePatient, deletePatient } = usePatients();
  const { packages } = usePackagesData();

  const handleAddPatient = async (patientData: any) => {
    return await addPatient(patientData);
  };

  const handleEditPatient = async (updatedPatient: any) => {
    const result = await updatePatient(updatedPatient.id, updatedPatient);
    if (result.success) {
      setEditDialogOpen(false);
      setEditingPatient(null);
    }
  };

  const handleDeletePatient = async (patientId: string) => {
    const result = await deletePatient(patientId);
    if (result.success) {
      setDeletingPatient(null);
    }
  };

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === "all" || patient.status === statusFilter)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "completed": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active": return "Ativo";
      case "inactive": return "Inativo";
      case "completed": return "Concluído";
      default: return status;
    }
  };

  const openEditDialog = (patient: any) => {
    setEditingPatient(patient);
    setEditDialogOpen(true);
  };

  const openDetailsDialog = (patient: any) => {
    setSelectedPatient(patient);
    setDetailsOpen(true);
  };

  const openAssignPackageDialog = (patient: any) => {
    setSelectedPatient(patient);
    setAssignPackageOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando pacientes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Users className="mr-2 h-8 w-8" /> Pacientes
          </h1>
          <p className="text-muted-foreground">
            Gerencie pacientes e suas permissões de acesso ao sistema.
          </p>
        </div>
        <AddPatientDialog onAddPatient={handleAddPatient} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pacientes</CardTitle>
          <CardDescription>
            Gerencie informações dos pacientes e configure permissões de acesso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between space-x-2 mb-6">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar pacientes..." 
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}  
                />
              </div>
              <select 
                className="border rounded px-3 py-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos os Status</option>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
                <option value="completed">Concluído</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <Card key={patient.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{patient.name}</CardTitle>
                      <Badge className={getStatusColor(patient.status)}>
                        {getStatusLabel(patient.status)}
                      </Badge>
                    </div>
                    {patient.email && (
                      <CardDescription>{patient.email}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {patient.phone && (
                        <div className="flex justify-between text-sm">
                          <span>Telefone:</span>
                          <span className="font-medium">{patient.phone}</span>
                        </div>
                      )}
                      {patient.birth_date && (
                        <div className="flex justify-between text-sm">
                          <span>Nascimento:</span>
                          <span className="font-medium">
                            {new Date(patient.birth_date).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span>Cadastrado em:</span>
                        <span className="font-medium">
                          {new Date(patient.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Button variant="outline" size="sm" onClick={() => openDetailsDialog(patient)}>
                        <Eye className="h-4 w-4 mr-1" /> Detalhes
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(patient)}>
                        <Pencil className="h-4 w-4 mr-1" /> Editar
                      </Button>
                      <PatientAccessDialog 
                        patientId={patient.id}
                        patientName={patient.name}
                      />
                    </div>
                    
                    <div className="flex justify-between mt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openAssignPackageDialog(patient)}
                      >
                        <Activity className="h-4 w-4 mr-1" /> Pacote
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => setDeletingPatient({ id: patient.id, name: patient.name })}
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
                  {patients.length === 0 ? "Nenhum paciente cadastrado ainda" : "Nenhum paciente encontrado com os filtros atuais"}
                </div>
                {patients.length === 0 && (
                  <AddPatientDialog onAddPatient={handleAddPatient} />
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <PatientDetails
        patient={selectedPatient}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />

      <EditPatientDialog
        patient={editingPatient}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onEditPatient={handleEditPatient}
      />

      <DeletePatientDialog
        open={!!deletingPatient}
        onOpenChange={() => setDeletingPatient(null)}
        onConfirm={() => deletingPatient && handleDeletePatient(deletingPatient.id)}
        patientName={deletingPatient?.name || ""}
      />

      <AssignPackageDialog
        patient={selectedPatient}
        packages={packages}
        open={assignPackageOpen}
        onOpenChange={setAssignPackageOpen}
      />
    </div>
  );
}
