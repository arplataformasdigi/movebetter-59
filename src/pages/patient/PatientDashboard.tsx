
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, ListChecks, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

export default function PatientDashboard() {
  const { user } = useAuth();

  const patientPlans = [
    {
      id: "1",
      title: "Reabilitação Lombar",
      progress: 65,
      nextSession: "15/05/2025",
      exercises: 8,
      completedExercises: 5
    },
    {
      id: "2",
      title: "Fortalecimento Postural",
      progress: 30,
      nextSession: "18/05/2025",
      exercises: 10,
      completedExercises: 3
    }
  ];

  const latestRecords = [
    {
      id: "1",
      date: "02/05/2025",
      title: "Avaliação de progresso",
      description: "Melhora significativa na flexibilidade lombar."
    },
    {
      id: "2",
      date: "25/04/2025",
      title: "Consulta inicial",
      description: "Diagnóstico de lombalgia crônica."
    }
  ];

  const upcomingAppointments = [
    {
      id: "1",
      date: "15/05/2025",
      time: "14:00",
      type: "Sessão de Fisioterapia",
      professional: "Dra. Maria"
    },
    {
      id: "2",
      date: "18/05/2025",
      time: "15:30",
      type: "Avaliação de Progresso",
      professional: "Dr. João"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bem-vindo, {user?.name}</h1>
        <p className="text-muted-foreground">
          Acompanhe seu progresso e informações de tratamento.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/paciente/planos" className="block">
          <Card className="hover:border-movebetter-primary transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meus Planos</CardTitle>
              <ListChecks className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patientPlans.length}</div>
              <p className="text-xs text-muted-foreground">Planos ativos</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/paciente/agenda" className="block">
          <Card className="hover:border-movebetter-primary transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
              <p className="text-xs text-muted-foreground">Sessões agendadas</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/paciente/prontuario" className="block">
          <Card className="hover:border-movebetter-primary transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prontuário</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestRecords.length}</div>
              <p className="text-xs text-muted-foreground">Registros médicos</p>
            </CardContent>
          </Card>
        </Link>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Meus Planos de Tratamento</CardTitle>
            <CardDescription>
              Acompanhe seu progresso nos planos de tratamento ativos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patientPlans.map(plan => (
                <div key={plan.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{plan.title}</h4>
                    <span className="text-sm text-muted-foreground">
                      {plan.completedExercises}/{plan.exercises} exercícios
                    </span>
                  </div>
                  <Progress value={plan.progress} />
                  <div className="text-sm text-muted-foreground">
                    Próxima sessão: {plan.nextSession}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Próximos Agendamentos</CardTitle>
            <CardDescription>
              Seus compromissos agendados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map(appointment => (
                <div key={appointment.id} className="border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{appointment.type}</h4>
                      <p className="text-sm text-muted-foreground">
                        Com {appointment.professional}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{appointment.date}</div>
                      <div className="text-sm text-muted-foreground">{appointment.time}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Prontuário Recente</CardTitle>
          <CardDescription>
            Últimas atualizações no seu prontuário médico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {latestRecords.map(record => (
              <div key={record.id} className="border-b pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{record.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {record.description}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">{record.date}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
