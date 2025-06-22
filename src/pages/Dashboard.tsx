
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityCard } from "@/components/dashboard/ActivityCard";
import { UpcomingSessions } from "@/components/dashboard/UpcomingSessions";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useRecentActivities } from "@/hooks/useRecentActivities";
import { useUpcomingSessions } from "@/hooks/useUpcomingSessions";

function StatsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-32 mb-2" />
        <Skeleton className="h-2 w-full" />
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const { stats, isLoading: statsLoading } = useDashboardData();
  const { activities, isLoading: activitiesLoading } = useRecentActivities();
  const { sessions, isLoading: sessionsLoading } = useUpcomingSessions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao MoveBetter, seu sistema de acompanhamento de pacientes.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsLoading ? (
          <>
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="pb-2 bg-green-100">
                <CardTitle className="text-sm font-medium">Pacientes Ativos</CardTitle>
              </CardHeader>
              <CardContent className="bg-green-100">
                <div className="text-2xl font-bold">{stats.activePatients}</div>
                <p className="text-xs text-muted-foreground">Pacientes em acompanhamento</p>
                <Progress className="mt-2" value={Math.min((stats.activePatients / 50) * 100, 100)} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2 bg-orange-100">
                <CardTitle className="text-sm font-medium">Sessões Completadas</CardTitle>
              </CardHeader>
              <CardContent className="bg-orange-100">
                <div className="text-2xl font-bold">{stats.completedSessions}</div>
                <p className="text-xs text-muted-foreground">Sessões realizadas</p>
                <Progress className="mt-2" value={Math.min((stats.completedSessions / 200) * 100, 100)} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2 bg-yellow-100">
                <CardTitle className="text-sm font-medium">Taxa de Progresso</CardTitle>
              </CardHeader>
              <CardContent className="bg-yellow-100">
                <div className="text-2xl font-bold">{stats.progressRate}%</div>
                <p className="text-xs text-muted-foreground">Progresso médio dos pacientes</p>
                <Progress className="mt-2" value={stats.progressRate} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2 bg-blue-100">
                <CardTitle className="text-sm font-medium">Pontos de Gamificação</CardTitle>
              </CardHeader>
              <CardContent className="bg-blue-100">
                <div className="text-2xl font-bold">{stats.gamificationPoints.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Pontos totais acumulados</p>
                <Progress className="mt-2" value={Math.min((stats.gamificationPoints / 5000) * 100, 100)} />
              </CardContent>
            </Card>
          </>
        )}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>
              Monitoramento das últimas atividades do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityCard activities={activities} isLoading={activitiesLoading} />
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
            <UpcomingSessions sessions={sessions} isLoading={sessionsLoading} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
