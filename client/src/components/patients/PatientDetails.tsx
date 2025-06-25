import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  User, 
  Heart, 
  Clock,
  FileText,
  Activity,
  ClipboardList
} from "lucide-react";
import { Patient } from "@/hooks/usePatients";
import { PatientMedicalRecord } from "./PatientMedicalRecord";
import { PatientPreEvaluation } from "./PatientPreEvaluation";
import { PatientEvolutionsList } from "./PatientEvolutionsList";

interface PatientDetailsProps {
  patient: Patient;
  onUpdatePatient: (patient: Patient) => void;
  onClose: () => void;
}

export function PatientDetails({ patient, onUpdatePatient, onClose }: PatientDetailsProps) {
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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {patient.name}
          </DialogTitle>
          <DialogDescription>
            Informações completas e registros médicos
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Informações
            </TabsTrigger>
            <TabsTrigger value="pre-avaliacao" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Pré-avaliação
            </TabsTrigger>
            <TabsTrigger value="prontuario" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Prontuário
            </TabsTrigger>
            <TabsTrigger value="evolucao" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Evolução
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-6 mt-6">
            {/* Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Informações Pessoais
                  </span>
                  <Badge className={getStatusColor(patient.status)}>
                    {getStatusLabel(patient.status)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">Nome Completo</div>
                    <div className="font-medium">{patient.name}</div>
                  </div>
                  
                  {patient.email && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-500 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        E-mail
                      </div>
                      <div className="font-medium">{patient.email}</div>
                    </div>
                  )}
                  
                  {patient.phone && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-500 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        Telefone
                      </div>
                      <div className="font-medium">{patient.phone}</div>
                    </div>
                  )}
                  
                  {patient.cpf && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-500">CPF</div>
                      <div className="font-medium">{patient.cpf}</div>
                    </div>
                  )}
                  
                  {patient.birth_date && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Data de Nascimento
                      </div>
                      <div className="font-medium">
                        {new Date(patient.birth_date).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  )}
                  
                  {patient.address && (
                    <div className="space-y-2 md:col-span-2">
                      <div className="text-sm font-medium text-gray-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Endereço
                      </div>
                      <div className="font-medium">{patient.address}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contatos de Emergência */}
            {(patient.emergency_contact || patient.emergency_phone) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Contato de Emergência
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {patient.emergency_contact && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-500">Nome do Contato</div>
                        <div className="font-medium">{patient.emergency_contact}</div>
                      </div>
                    )}
                    
                    {patient.emergency_phone && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-500 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          Telefone de Emergência
                        </div>
                        <div className="font-medium">{patient.emergency_phone}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Histórico Médico */}
            {patient.medical_history && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Histórico Médico
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm whitespace-pre-wrap">{patient.medical_history}</div>
                </CardContent>
              </Card>
            )}

            {/* Informações do Sistema */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Informações do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">Data de Cadastro</div>
                    <div className="font-medium">
                      {new Date(patient.created_at).toLocaleDateString('pt-BR')} às{' '}
                      {new Date(patient.created_at).toLocaleTimeString('pt-BR')}
                    </div>
                  </div>
                  
                  {patient.updated_at && patient.updated_at !== patient.created_at && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-500">Última Atualização</div>
                      <div className="font-medium">
                        {new Date(patient.updated_at).toLocaleDateString('pt-BR')} às{' '}
                        {new Date(patient.updated_at).toLocaleTimeString('pt-BR')}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pre-avaliacao" className="mt-6">
            <PatientPreEvaluation patientId={patient.id} patientName={patient.name} />
          </TabsContent>

          <TabsContent value="prontuario" className="mt-6">
            <PatientMedicalRecord patientId={patient.id} />
          </TabsContent>

          <TabsContent value="evolucao" className="mt-6">
            <PatientEvolutionsList patientId={patient.id} patientStatus={patient.status || 'active'} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
