
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ArrowUp, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MedicalRecord {
  id: string;
  date: Date;
  visitReason: string;
  currentCondition: string;
  medicalHistory: string;
  treatmentPlan: string;
  evaluation?: string;
  progressScore: number;
  previousScore?: number;
}

export default function PatientMedicalRecords() {
  // Mock de dados para o prontuário médico
  const medicalRecords: MedicalRecord[] = [
    {
      id: "1",
      date: new Date(2025, 3, 25),
      visitReason: "Consulta inicial",
      currentCondition: "Paciente relata dor lombar persistente, especialmente ao sentar por períodos prolongados. Desconforto na região do L4-L5.",
      medicalHistory: "Sem histórico de lesões graves. Pratica atividade física ocasional. Trabalho em escritório por 8 horas diárias.",
      treatmentPlan: "Iniciar plano de reabilitação lombar com foco em exercícios de alongamento e fortalecimento do core.",
      evaluation: "Rigidez na região lombar. Movimento flexão lombar limitado. Força muscular abdominal 3/5.",
      progressScore: 30
    },
    {
      id: "2",
      date: new Date(2025, 4, 2),
      visitReason: "Avaliação de progresso",
      currentCondition: "Paciente relata melhora nos sintomas de dor. Ainda apresenta desconforto ao permanecer sentado por mais de 3 horas.",
      medicalHistory: "Paciente está realizando os exercícios prescritos em casa regularmente.",
      treatmentPlan: "Continuar com plano de reabilitação. Adicionar exercícios de fortalecimento específicos.",
      evaluation: "Melhora na amplitude de movimento lombar. Força muscular abdominal 4/5.",
      progressScore: 45,
      previousScore: 30
    },
    {
      id: "3",
      date: new Date(2025, 4, 9),
      visitReason: "Reavaliação",
      currentCondition: "Melhora significativa na movimentação. Dor reduzida para 3/10 na escala visual analógica.",
      medicalHistory: "Seguindo todas as recomendações e realizando exercícios diariamente.",
      treatmentPlan: "Progredir para exercícios mais avançados. Incluir técnicas de autocorreção postural para o ambiente de trabalho.",
      evaluation: "Maior mobilidade lombar, redução da tensão muscular na região. Força muscular abdominal 4+/5.",
      progressScore: 65,
      previousScore: 45
    }
  ];

  // Ordenar os registros do mais recente para o mais antigo
  const sortedRecords = [...medicalRecords].sort((a, b) => b.date.getTime() - a.date.getTime());

  // Formatação da data
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Formatação da diferença de progresso
  const renderProgressDifference = (current: number, previous?: number) => {
    if (!previous) return null;
    
    const difference = current - previous;
    
    return (
      <Badge 
        variant="outline" 
        className={difference > 0 ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}
      >
        {difference > 0 ? (
          <ArrowUp className="h-3 w-3 mr-1" />
        ) : (
          <ArrowDown className="h-3 w-3 mr-1" />
        )}
        {Math.abs(difference)}%
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Meu Prontuário</h1>
        <p className="text-muted-foreground">
          Acompanhe seu histórico médico e evolução do tratamento.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Histórico de Registros</CardTitle>
              <CardDescription>
                Registros ordenados do mais recente ao mais antigo
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {sortedRecords.map((record) => (
              <div key={record.id} className="border rounded-md p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-movebetter-light p-2 rounded-md mr-3">
                      <FileText className="h-5 w-5 text-movebetter-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{record.visitReason}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(record.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-sm font-medium">Progresso</div>
                      <div className="text-xl font-semibold">{record.progressScore}%</div>
                    </div>
                    {renderProgressDifference(record.progressScore, record.previousScore)}
                  </div>
                </div>
                
                <div className="grid gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Condição Atual</h4>
                    <p className="text-sm">{record.currentCondition}</p>
                  </div>
                  
                  {record.evaluation && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Avaliação</h4>
                      <p className="text-sm">{record.evaluation}</p>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Plano de Tratamento</h4>
                    <p className="text-sm">{record.treatmentPlan}</p>
                  </div>
                </div>
              </div>
            ))}

            {sortedRecords.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum registro médico disponível.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
