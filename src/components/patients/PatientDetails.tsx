
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
import { Patient } from "@/hooks/usePatients";

interface PatientDetailsProps {
  patient: Patient;
  onUpdatePatient: (patient: Patient) => void;
}

export function PatientDetails({ patient, onUpdatePatient }: PatientDetailsProps) {
  const [open, setOpen] = React.useState(false);

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
              <AvatarImage src={undefined} alt={patient.name} />
              <AvatarFallback className="text-xl bg-movebetter-primary text-white">
                {patient.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{patient.name}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className={status.color}>
                  {status.label}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">E-mail</h4>
              <p>{patient.email || "Email não informado"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Telefone</h4>
              <p>{patient.phone || "Telefone não informado"}</p>
            </div>
          </div>

          <Tabs defaultValue="pre-evaluation">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="pre-evaluation">Pré-avaliação</TabsTrigger>
              <TabsTrigger value="records">Prontuário</TabsTrigger>
              <TabsTrigger value="evolution">Evolução do Paciente</TabsTrigger>
            </TabsList>
            <TabsContent value="pre-evaluation" className="pt-4">
              <PatientPreEvaluation patientId={patient.id} patientName={patient.name} />
            </TabsContent>
            <TabsContent value="records" className="pt-4">
              <PatientMedicalRecord patientId={patient.id} />
            </TabsContent>
            <TabsContent value="evolution" className="pt-4">
              <PatientEvolution patientId={patient.id} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
