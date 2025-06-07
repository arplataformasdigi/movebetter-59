
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ArrowUp, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Evolution {
  id: string;
  date: Date;
  medicalRecordId: string;
  queixasRelatos: string;
  condutaAtendimento: string;
  observacoes?: string;
  progressScore: number;
  previousScore?: number;
  medicalRecordInfo?: string;
}

export default function PatientMedicalRecords() {
  // Mock de dados para a evolução do paciente
  const evolutions: Evolution[] = [
    {
      id: "1",
      date: new Date(2025, 3, 25),
      medicalRecordId: "prontuario-1",
      queixasRelatos: "Paciente relata melhora significativa na dor lombar. Não sente mais desconforto ao sentar por períodos prolongados.",
      condutaAtendimento: "Realizados exercícios de alongamento e fortalecimento do core. Aplicação de técnicas de mobilização articular.",
      observacoes: "Paciente demonstra boa aderência ao tratamento domiciliar.",
      progressScore: 8,
      previousScore: 6,
      medicalRecordInfo: "Consulta de seguimento - 25/04/2025"
    },
    {
      id: "2", 
      date: new Date(2025, 4, 2),
      medicalRecordId: "prontuario-2",
      queixasRelatos: "Ligeira recidiva da dor após atividade física intensa no final de semana. Dor localizada na região L4-L5.",
      condutaAtendimento: "Orientações sobre modificação da atividade física. Exercícios específicos para estabilização lombar.",
      observacoes: "Importante manter regularidade nos exercícios prescritos.",
      progressScore: 6,
      previousScore: 8,
      medicalRecordInfo: "Reavaliação - 02/05/2025"
    },
    {
      id: "3",
      date: new Date(2025, 4, 9),
      medicalRecordId: "prontuario-3", 
      queixasRelatos: "Paciente relata estabilização do quadro. Consegue realizar atividades diárias sem limitações.",
      condutaAtendimento: "Progressão dos exercícios para fortalecimento avançado. Técnicas de autocorreção postural.",
      observacoes: "Paciente apto para retorno gradual às atividades esportivas.",
      progressScore: 9,
      previousScore: 6,
      medicalRecordInfo: "Consulta de alta - 09/05/2025"
    }
  ];

  // Ordenar os registros do mais recente para o mais antigo
  const sortedEvolutions = [...evolutions].sort((a, b) => b.date.getTime() - a.date.getTime());

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
        {Math.abs(difference)}
      </Badge>
    );
  };

  const getProgressColor = (score: number) => {
    if (score < 3) return "bg-red-100 text-red-800 border-red-200";
    if (score < 7) return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-green-100 text-green-800 border-green-200";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Minha Evolução</h1>
        <p className="text-muted-foreground">
          Acompanhe o histórico da sua evolução durante o tratamento.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Histórico de Evolução</CardTitle>
              <CardDescription>
                Registros de evolução ordenados do mais recente ao mais antigo
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {sortedEvolutions.map((evolution) => (
              <div key={evolution.id} className="border rounded-md p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-movebetter-light p-2 rounded-md mr-3">
                      <FileText className="h-5 w-5 text-movebetter-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        Evolução de {formatDate(evolution.date)}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {evolution.medicalRecordInfo}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-sm font-medium">Progresso</div>
                      <div className="text-xl font-semibold">{evolution.progressScore}/10</div>
                    </div>
                    <Badge variant="outline" className={getProgressColor(evolution.progressScore)}>
                      Score: {evolution.progressScore}/10
                    </Badge>
                    {renderProgressDifference(evolution.progressScore, evolution.previousScore)}
                  </div>
                </div>
                
                <div className="grid gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Queixas e Relatos</h4>
                    <p className="text-sm">{evolution.queixasRelatos}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Conduta no Atendimento</h4>
                    <p className="text-sm">{evolution.condutaAtendimento}</p>
                  </div>
                  
                  {evolution.observacoes && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Observações</h4>
                      <p className="text-sm">{evolution.observacoes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {sortedEvolutions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum registro de evolução disponível.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
