import React, { useState } from "react";
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
import { PatientDetails } from "@/components/patients/PatientDetails";
import { DeletePatientDialog } from "@/components/patients/DeletePatientDialog";
import { AssignPackageDialog } from "@/components/patients/AssignPackageDialog";

interface MedicalRecord {
  id: string;
  date: Date;
  age: number;
  gender: string;
  weight: number;
  height: number;
  birthDate: string;
  profession: string;
  maritalStatus: string;
  visitReason: string;
  currentCondition: string;
  medicalHistory: string;
  treatmentPlan: string;
  evaluation?: string;
}

interface Evolution {
  id: string;
  date: Date;
  medicalRecordId: string;
  queixasRelatos: string;
  condutaAtendimento: string;
  observacoes?: string;
  progressScore: number;
  previousScore?: number;
}

interface Patient {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  medicalRecords?: MedicalRecord[];
  evolutions?: Evolution[];
}

const initialPatients: Patient[] = [
  {
    id: "1",
    name: "Marina Oliveira",
    avatar: "",
    email: "marina.o@email.com",
    phone: "(11) 98765-4321",
    status: "active",
    medicalRecords: [],
    evolutions: [],
  },
  {
    id: "2",
    name: "Felipe Martins",
    avatar: "",
    email: "felipe.m@email.com",
    phone: "(11) 97654-3210",
    status: "active",
    medicalRecords: [],
    evolutions: [],
  },
  {
    id: "3",
    name: "Carla Sousa",
    avatar: "",
    email: "carla.s@email.com",
    phone: "(11) 96543-2109",
    status: "active",
    medicalRecords: [],
    evolutions: [],
  },
  {
    id: "4",
    name: "Ricardo Almeida",
    avatar: "",
    email: "ricardo.a@email.com",
    phone: "(11) 95432-1098",
    status: "inactive",
    medicalRecords: [],
    evolutions: [],
  },
  {
    id: "5",
    name: "Patricia Mendes",
    avatar: "",
    email: "patricia.m@email.com",
    phone: "(11) 94321-0987",
    status: "active",
    medicalRecords: [],
    evolutions: [],
  },
  {
    id: "6",
    name: "Gustavo Torres",
    avatar: "",
    email: "gustavo.t@email.com",
    phone: "(11) 93210-9876",
    status: "active",
    medicalRecords: [],
    evolutions: [],
  },
];

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

const mockPackages = [
  {
    id: "1",
    name: "Combo Banho & Tosa Mensal",
    price: 280.00,
    services: ["2x Banho M", "1x Tosa M"],
    validity: 1,
  },
  {
    id: "2",
    name: "Pacote Fisioterapia",
    price: 450.00,
    services: ["4x Sessão de Fisioterapia", "1x Avaliação"],
    validity: 2,
  },
];

export function Patients() {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [searchQuery, setSearchQuery] = useState("");
  const [packageAssignments, setPackageAssignments] = useState<any[]>([]);

  const handleAddPatient = (newPatient: Patient) => {
    setPatients([...patients, newPatient]);
  };

  const handleUpdatePatient = (updatedPatient: Patient) => {
    setPatients(patients.map(patient => 
      patient.id === updatedPatient.id ? updatedPatient : patient
    ));
  };

  const handleToggleStatus = (patientId: string) => {
    setPatients(patients.map(patient => 
      patient.id === patientId 
        ? { ...patient, status: patient.status === "active" ? "inactive" : "active" as Patient["status"] }
        : patient
    ));
  };

  const handleDeletePatient = (patientId: string) => {
    setPatients(patients.filter(patient => patient.id !== patientId));
  };

  const handleAssignPackage = (assignment: any) => {
    setPackageAssignments([...packageAssignments, assignment]);
  };

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.phone.includes(searchQuery)
  );

  const getPatientPackage = (patientId: string) => {
    return packageAssignments.find(assignment => assignment.patientId === patientId);
  };

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
        <AddPatientDialog onAddPatient={handleAddPatient} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Pacientes</CardTitle>
              <CardDescription>Gerencie todos os pacientes registrados</CardDescription>
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
                          <AvatarImage src={patient.avatar} alt={patient.name} />
                          <AvatarFallback className="bg-movebetter-primary text-white">
                            {patient.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{patient.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{patient.email}</div>
                        <div className="text-muted-foreground">{patient.phone}</div>
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
                          packages={mockPackages}
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
                        >
                          {patient.status === "active" ? (
                            <PowerOff className="h-4 w-4 text-red-600" />
                          ) : (
                            <Power className="h-4 w-4 text-green-600" />
                          )}
                        </Button>
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
        </CardContent>
      </Card>
    </div>
  );
}

export default Patients;
