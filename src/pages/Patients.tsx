
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Plus, Search, Pencil, Trash, FileText, Smartphone } from "lucide-react";
import { AddPatientDialog } from "@/components/patients/AddPatientDialog";
import { EditPatientDialog } from "@/components/patients/EditPatientDialog";
import { DeletePatientDialog } from "@/components/patients/DeletePatientDialog";
import { PatientDetails } from "@/components/patients/PatientDetails";
import { PatientAccessDialog } from "@/components/patients/PatientAccessDialog";
import { usePatients } from "@/hooks/usePatients";
import { usePatientAccess } from "@/hooks/usePatientAccess";

export default function Patients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [editingPatient, setEditingPatient] = useState<any>(null);
  const [deletingPatient, setDeletingPatient] = useState<{ id: string; name: string } | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addPatientOpen, setAddPatientOpen] = useState(false);
  const [accessDialogPatient, setAccessDialogPatient] = useState<{ id: string; name: string } | null>(null);

  const { patients, isLoading, addPatient, updatePatient, deletePatient } = usePatients();
  const { patientAccess, createPatientAccess, updatePatientAccess, deletePatientAccess } = usePatientAccess();

  const handleAddPatient = async (patientData: any) => {
    const result = await addPatient(patientData);
    if (result.success) {
      setAddPatientOpen(false);
    }
    return result;
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
    closeAllDialogs();
    setEditingPatient(patient);
    setEditDialogOpen(true);
  };

  const openDetailsDialog = (patient: any) => {
    closeAllDialogs();
    setSelectedPatient(patient);
    setDetailsOpen(true);
  };

  const openAccessDialog = (patient: any) => {
    closeAllDialogs();
    setAccessDialogPatient({ id: patient.id, name: patient.name });
  };

  const openDeleteDialog = (patient: any) => {
    closeAllDialogs();
    setDeletingPatient({ id: patient.id, name: patient.name });
  };

  const closeAllDialogs = () => {
    setDetailsOpen(false);
    setEditDialogOpen(false);
    setAccessDialogPatient(null);
    setDeletingPatient(null);
    setSelectedPatient(null);
    setEditingPatient(null);
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
        <Button onClick={() => setAddPatientOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Paciente
        </Button>
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

          {filteredPatients.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cadastrado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell>{patient.email || "-"}</TableCell>
                      <TableCell>{patient.phone || "-"}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(patient.status)}>
                          {getStatusLabel(patient.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(patient.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => openDetailsDialog(patient)}
                            title="Ver prontuário"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => openEditDialog(patient)}
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => openAccessDialog(patient)}
                            title="Gerenciar acesso"
                          >
                            <Smartphone className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => openDeleteDialog(patient)}
                            className="text-red-600 hover:text-red-700"
                            title="Excluir"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-2">
                {patients.length === 0 ? "Nenhum paciente cadastrado ainda" : "Nenhum paciente encontrado com os filtros atuais"}
              </div>
              {patients.length === 0 && (
                <Button onClick={() => setAddPatientOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Adicionar Primeiro Paciente
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      {detailsOpen && selectedPatient && (
        <PatientDetails
          patient={selectedPatient}
          onUpdatePatient={handleEditPatient}
          onClose={() => setDetailsOpen(false)}
        />
      )}

      {editDialogOpen && editingPatient && (
        <EditPatientDialog
          patient={editingPatient}
          onClose={() => setEditDialogOpen(false)}
        />
      )}

      {deletingPatient && (
        <DeletePatientDialog
          patientName={deletingPatient.name}
          onConfirm={() => handleDeletePatient(deletingPatient.id)}
          onClose={() => setDeletingPatient(null)}
        />
      )}

      {accessDialogPatient && (
        <PatientAccessDialog
          patientId={accessDialogPatient.id}
          patientName={accessDialogPatient.name}
          patientAccess={patientAccess}
          onCreateAccess={createPatientAccess}
          onUpdateAccess={updatePatientAccess}
          onDeleteAccess={deletePatientAccess}
          onClose={() => setAccessDialogPatient(null)}
        />
      )}

      {addPatientOpen && (
        <AddPatientDialog 
          onClose={() => setAddPatientOpen(false)}
        />
      )}
    </div>
  );
}
