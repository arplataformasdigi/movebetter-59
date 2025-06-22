
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityCard } from "@/components/dashboard/ActivityCard";
import { UpcomingSessions } from "@/components/dashboard/UpcomingSessions";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useRecentActivities } from "@/hooks/useRecentActivities";
import { useUpcomingSessions } from "@/hooks/useUpcomingSessions";
import { AlertCircle } from "lucide-react";

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

function ErrorCard({ title, message }: { title: string; message: string }) {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="flex items-center space-x-2 pt-6">
        <AlertCircle className="h-5 w-5 text-red-500" />
        <div>
          <h4 className="font-medium text-red-800">{title}</h4>
          <p className="text-sm text-red-600">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const { stats, isLoading: statsLoading, error: statsError } = useDashboardData();
  const { activities, isLoading: activitiesLoading, error: activitiesError } = useRecentActivities();
  const { sessions, isLoading: sessionsLoading, error: sessionsError } = useUpcomingSessions();

  console.log('📊 Dashboard render:', {
    statsLoading,
    activitiesLoading,
    sessionsLoading,
    hasStatsError: !!statsError,
    hasActivitiesError: !!activitiesError,
    hasSessionsError: !!sessionsError
  });

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
        ) : statsError ? (
          <div className="col-span-full">
            <ErrorCard 
              title="Erro ao carregar estatísticas" 
              message="Não foi possível carregar os dados do dashboard." 
            />
          </div>
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
            {activitiesError ? (
              <ErrorCard 
                title="Erro ao carregar atividades" 
                message="Não foi possível carregar as atividades recentes." 
              />
            ) : (
              <ActivityCard activities={activities} isLoading={activitiesLoading} />
            )}
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
            {sessionsError ? (
              <ErrorCard 
                title="Erro ao carregar sessões" 
                message="Não foi possível carregar as próximas sessões." 
              />
            ) : (
              <UpcomingSessions sessions={sessions} isLoading={sessionsLoading} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
