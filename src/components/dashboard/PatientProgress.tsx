
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

interface PatientProgressData {
  id: string;
  name: string;
  avatar?: string;
  planName: string;
  progress: number;
  lastActivity: string;
}

const patientsProgress: PatientProgressData[] = [
  {
    id: "1",
    name: "Maria Santos",
    avatar: "",
    planName: "Recuperação Pós-Cirurgia",
    progress: 82,
    lastActivity: "Hoje",
  },
  {
    id: "2",
    name: "João Pereira",
    avatar: "",
    planName: "Core Training para Corredores",
    progress: 67,
    lastActivity: "Ontem",
  },
  {
    id: "3",
    name: "Ana Oliveira",
    avatar: "",
    planName: "Fortalecimento Lombar",
    progress: 45,
    lastActivity: "Ontem",
  },
  {
    id: "4",
    name: "Carlos Ferreira",
    avatar: "",
    planName: "Reabilitação de Joelho",
    progress: 92,
    lastActivity: "2 dias atrás",
  },
  {
    id: "5",
    name: "Lúcia Melo",
    avatar: "",
    planName: "Postura para Escritório",
    progress: 34,
    lastActivity: "3 dias atrás",
  },
];

export function PatientProgress() {
  return (
    <div className="space-y-4">
      {patientsProgress.map((patient) => (
        <div key={patient.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
          <Avatar className="h-10 w-10">
            <AvatarImage src={patient.avatar} alt={patient.name} />
            <AvatarFallback className="bg-movebetter-secondary text-white">
              {patient.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <p className="font-medium text-sm">{patient.name}</p>
              <p className="text-xs text-gray-500">{patient.lastActivity}</p>
            </div>
            <p className="text-xs text-gray-600 mb-2">{patient.planName}</p>
            <div className="flex items-center space-x-3">
              <Progress value={patient.progress} className="h-2" />
              <span className="text-sm font-medium text-gray-700">{patient.progress}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
