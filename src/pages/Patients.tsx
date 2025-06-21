import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Power, PowerOff } from "lucide-react";
import { AddPatientDialog } from "@/components/patients/AddPatientDialog";
import { EditPatientDialog } from "@/components/patients/EditPatientDialog";
import { PatientDetails } from "@/components/patients/PatientDetails";
import { DeletePatientDialog } from "@/components/patients/DeletePatientDialog";
import { AssignPackageDialog } from "@/components/patients/AssignPackageDialog";
import { usePatients, Patient } from "@/hooks/usePatients";
import { usePackagesData } from "@/hooks/usePackagesData";

const getStatusDetails = (status: Patient["status"]) => {
  switch (status) {
    case "active":
      return { 
        label: "Ativo",
        color: "bg-green-100 text-green-800 border-green-200" 
      };
    case "inactive":
      return { 
        label: "Inativo", 
        color: "bg-red-100 text-red-800 border-red-200" 
      };
    default:
      return { 
        label: "Desconhecido", 
        color: "bg-gray-100 text-gray-800 border-gray-200" 
      };
  }
};

export function Patients() {
  const { patients, isLoading, updatePatient, deletePatient, fetchPatients } = usePatients();
  const { packages, isLoading: packagesLoading } = usePackagesData();
  const [searchQuery, setSearchQuery] = useState("");
  const [packageAssignments, setPackageAssignments] = useState<any[]>([]);

  useEffect(() => {
    console.log('Current patients state:', patients);
    console.log('Is loading:', isLoading);
  }, [patients, isLoading]);

  const handleUpdatePatient = (updatedPatient: any) => {
    const patientData = {
      name: updatedPatient.name,
      email: updatedPatient.email || undefined,
      phone: updatedPatient.phone || undefined,
      status: updatedPatient.status,
    };
    updatePatient(updatedPatient.id, patientData);
  };

  const handleToggleStatus = async (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      const newStatus: Patient["status"] = patient.status === "active" ? "inactive" : "active";
      await updatePatient(patientId, { status: newStatus });
    }
  };

  const handleDeletePatient = async (patientId: string) => {
    await deletePatient(patientId);
  };

  const handleAssignPackage = (assignment: any) => {
    setPackageAssignments([...packageAssignments, assignment]);
  };

  // Show all patients regardless of status
  const filteredPatients = patients
    .filter(patient => 
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (patient.email && patient.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (patient.phone && patient.phone.includes(searchQuery))
    );

  const getPatientPackage = (patientId: string) => {
    return packageAssignments.find(assignment => assignment.patientId === patientId);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Users className="mr-2 h-8 w-8" /> Pacientes
          </h1>
          <p className="text-muted-foreground">Carregando pacientes...</p>
        </div>
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
            Gerencie seus pacientes e seus planos de tratamento.
          </p>
        </div>
        <div className="flex gap-2">
          <AddPatientDialog />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Pacientes</CardTitle>
              <CardDescription>
                Gerencie todos os pacientes registrados ({filteredPatients.length} pacientes encontrados)
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Input 
                placeholder="Buscar pacientes..." 
                className="w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}  
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPatients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-2 text-sm font-medium">
                {searchQuery ? "Nenhum paciente encontrado" : "Nenhum paciente cadastrado"}
              </h3>
              <p className="mt-1 text-sm">
                {searchQuery 
                  ? "Tente ajustar sua busca ou cadastre um novo paciente." 
                  : "Comece cadastrando seu primeiro paciente."
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pacote</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => {
                  const status = getStatusDetails(patient.status);
                  const assignedPackage = getPatientPackage(patient.id);
                  
                  return (
                    <TableRow key={patient.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={undefined} alt={patient.name} />
                            <AvatarFallback className="bg-movebetter-primary text-white">
                              {patient.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="font-medium">{patient.name}</span>
                            {patient.cpf && (
                              <div className="text-xs text-muted-foreground">
                                CPF: {patient.cpf}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{patient.email || "Email não informado"}</div>
                          <div className="text-muted-foreground">{patient.phone || "Telefone não informado"}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={status.color}>
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {assignedPackage ? (
                          <div className="text-sm">
                            <div className="font-medium">{assignedPackage.packageName}</div>
                            <div className="text-muted-foreground">
                              R$ {assignedPackage.finalPrice.toFixed(2)}
                            </div>
                          </div>
                        ) : (
                          <AssignPackageDialog
                            patientId={patient.id}
                            patientName={patient.name}
                            packages={packages}
                            onAssignPackage={handleAssignPackage}
                          />
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(patient.id)}
                            className="h-8 w-8 p-0"
                            title={patient.status === "active" ? "Desativar paciente" : "Ativar paciente"}
                          >
                            {patient.status === "active" ? (
                              <PowerOff className="h-4 w-4 text-red-600" />
                            ) : (
                              <Power className="h-4 w-4 text-green-600" />
                            )}
                          </Button>
                          <EditPatientDialog patient={patient} />
                          <DeletePatientDialog 
                            patientName={patient.name}
                            onConfirm={() => handleDeletePatient(patient.id)}
                          />
                          <PatientDetails 
                            patient={patient}
                            onUpdatePatient={handleUpdatePatient}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Patients;
