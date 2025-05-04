
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PatientMedicalRecord } from "./PatientMedicalRecord";
import { PatientPreEvaluation } from "./PatientPreEvaluation";
import { PatientEvolution } from "./PatientEvolution";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MedicalRecord {
  id: string;
  date: Date;
  visitReason: string;
  currentCondition: string;
  medicalHistory: string;
  treatmentPlan: string;
  evaluation?: string;
  progressScore: number;
}

interface PreEvaluation {
  id: string;
  createdAt: Date;
  formData: any;
}

interface Evolution {
  id: string;
  date: Date;
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
  preEvaluations?: PreEvaluation[];
  evolutions?: Evolution[];
}

interface PatientDetailsProps {
  patient: Patient;
  onUpdatePatient: (patient: Patient) => void;
}

export function PatientDetails({ patient, onUpdatePatient }: PatientDetailsProps) {
  const [open, setOpen] = React.useState(false);

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

  const handleAddMedicalRecord = (patientId: string, record: MedicalRecord) => {
    const updatedPatient = {
      ...patient,
      medicalRecords: [...(patient.medicalRecords || []), record],
      progress: Math.min(patient.progress + 5, 100),
      points: patient.points + 50,
    };
    onUpdatePatient(updatedPatient);
  };

  const handleAddPreEvaluation = (patientId: string, evaluation: PreEvaluation) => {
    const updatedPatient = {
      ...patient,
      preEvaluations: [...(patient.preEvaluations || []), evaluation],
      progress: Math.min(patient.progress + 10, 100),
      points: patient.points + 100,
    };
    onUpdatePatient(updatedPatient);
  };

  const handleAddEvolution = (patientId: string, evolution: Evolution) => {
    const updatedPatient = {
      ...patient,
      evolutions: [...(patient.evolutions || []), evolution],
      progress: Math.min(patient.progress + 5, 100),
      points: patient.points + 50,
    };
    onUpdatePatient(updatedPatient);
  };

  const planType = getPlanTypeDetails(patient.planType);
  const status = getStatusDetails(patient.status);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          Detalhes
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Detalhes do Paciente</DialogTitle>
          <DialogDescription>
            Visualize e gerencie as informações detalhadas do paciente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={patient.avatar} alt={patient.name} />
              <AvatarFallback className="text-xl bg-movebetter-primary text-white">
                {patient.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{patient.name}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className={planType.color}>
                  {planType.label}
                </Badge>
                <Badge variant="outline" className={status.color}>
                  {status.label}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">E-mail</h4>
              <p>{patient.email}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Telefone</h4>
              <p>{patient.phone}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Progresso</h4>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-movebetter-primary rounded-full" 
                    style={{ width: `${patient.progress}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium">{patient.progress}%</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Pontos</h4>
              <p>{patient.points}</p>
            </div>
          </div>

          <Tabs defaultValue="records">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="pre-evaluation">Pré-avaliação</TabsTrigger>
              <TabsTrigger value="records">Prontuário</TabsTrigger>
              <TabsTrigger value="evolution">Evolução do Paciente</TabsTrigger>
            </TabsList>
            <TabsContent value="pre-evaluation" className="pt-4">
              <PatientPreEvaluation 
                patientId={patient.id} 
                preEvaluations={patient.preEvaluations || []} 
                onAddPreEvaluation={handleAddPreEvaluation} 
              />
            </TabsContent>
            <TabsContent value="records" className="pt-4">
              <PatientMedicalRecord 
                patientId={patient.id} 
                medicalRecords={patient.medicalRecords || []} 
                onAddRecord={handleAddMedicalRecord} 
              />
            </TabsContent>
            <TabsContent value="evolution" className="pt-4">
              <PatientEvolution 
                patientId={patient.id} 
                evolutions={patient.evolutions || []} 
                onAddEvolution={handleAddEvolution} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
