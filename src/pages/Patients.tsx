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
import { Users } from "lucide-react";
import { AddPatientDialog } from "@/components/patients/AddPatientDialog";
import { PatientDetails } from "@/components/patients/PatientDetails";

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
  planType: "running" | "pilates" | "mixed";
  progress: number;
  points: number;
  status: "active" | "inactive" | "onhold";
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
    planType: "pilates",
    progress: 78,
    points: 1280,
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
    planType: "running",
    progress: 45,
    points: 870,
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
    planType: "pilates",
    progress: 92,
    points: 2140,
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
    planType: "mixed",
    progress: 35,
    points: 560,
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
    planType: "running",
    progress: 65,
    points: 1430,
    status: "onhold",
    medicalRecords: [],
    evolutions: [],
  },
  {
    id: "6",
    name: "Gustavo Torres",
    avatar: "",
    email: "gustavo.t@email.com",
    phone: "(11) 93210-9876",
    planType: "mixed",
    progress: 28,
    points: 310,
    status: "active",
    medicalRecords: [],
    evolutions: [],
  },
];

const getPlanTypeDetails = (type: Patient["planType"]) => {
  switch (type) {
    case "pilates":
      return { 
        label: "Pilates",
        color: "bg-green-100 text-green-800 border-green-200" 
      };
    case "running":
      return { 
        label: "Corrida", 
        color: "bg-blue-100 text-blue-800 border-blue-200" 
      };
    case "mixed":
      return { 
        label: "Misto", 
        color: "bg-purple-100 text-purple-800 border-purple-200" 
      };
    default:
      return { 
        label: "Outro", 
        color: "bg-gray-100 text-gray-800 border-gray-200" 
      };
  }
};

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
    case "onhold":
      return { 
        label: "Em espera", 
        color: "bg-amber-100 text-amber-800 border-amber-200" 
      };
    default:
      return { 
        label: "Desconhecido", 
        color: "bg-gray-100 text-gray-800 border-gray-200" 
      };
  }
};

export function Patients() {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddPatient = (newPatient: Patient) => {
    setPatients([...patients, newPatient]);
  };

  const handleUpdatePatient = (updatedPatient: Patient) => {
    setPatients(patients.map(patient => 
      patient.id === updatedPatient.id ? updatedPatient : patient
    ));
  };

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.phone.includes(searchQuery)
  );

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
                <TableHead>Plano</TableHead>
                <TableHead>Progresso</TableHead>
                <TableHead>Pontos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => {
                const planType = getPlanTypeDetails(patient.planType);
                const status = getStatusDetails(patient.status);
                
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
                      <Badge variant="outline" className={planType.color}>
                        {planType.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-movebetter-primary rounded-full" 
                            style={{ width: `${patient.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{patient.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{patient.points}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={status.color}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <PatientDetails 
                        patient={patient}
                        onUpdatePatient={handleUpdatePatient}
                      />
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
