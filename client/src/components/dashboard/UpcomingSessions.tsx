
import React from "react";
import { Calendar, Clock, User, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface UpcomingSession {
  id: string;
  date: string;
  time: string;
  type: string;
  patientName: string;
  status: string;
}

interface UpcomingSessionsProps {
  sessions: UpcomingSession[];
  isLoading: boolean;
  onRefresh?: () => void;
}

export function UpcomingSessions({ sessions, isLoading, onRefresh }: UpcomingSessionsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Próximas Sessões</h3>
          {onRefresh && (
            <Button variant="ghost" size="sm" onClick={onRefresh} disabled>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Próximas Sessões</h3>
        {onRefresh && (
          <Button variant="ghost" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {sessions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-2 text-sm font-medium">Nenhuma sessão agendada</h3>
          <p className="mt-1 text-sm">
            Agende sessões para seus pacientes para vê-las aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="border-b pb-4 last:border-0 last:pb-0">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{session.type}</h4>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <User className="h-3 w-3 mr-1" />
                    <span>{session.patientName}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{session.date}</span>
                    <Clock className="h-3 w-3 ml-2 mr-1" />
                    <span>{session.time}</span>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  Agendado
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
