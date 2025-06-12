
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ActivityCard } from "@/components/dashboard/ActivityCard";
import { UpcomingSessions } from "@/components/dashboard/UpcomingSessions";

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao MoveBetter, seu sistema de acompanhamento de pacientes.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pacientes Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">+2.5% desde o mês passado</p>
            <Progress className="mt-2" value={65} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sessões Completadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">149</div>
            <p className="text-xs text-muted-foreground">+12% desde o mês passado</p>
            <Progress className="mt-2" value={78} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Progresso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82%</div>
            <p className="text-xs text-muted-foreground">+5% desde o mês passado</p>
            <Progress className="mt-2" value={82} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pontos de Gamificação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,482</div>
            <p className="text-xs text-muted-foreground">+24% desde o mês passado</p>
            <Progress className="mt-2" value={90} />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>
              Monitoramento das últimas atividades dos pacientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityCard />
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Próximas Sessões</CardTitle>
            <CardDescription>
              Agendamentos para os próximos dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UpcomingSessions />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
