
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, User, MapPin } from "lucide-react";

interface Activity {
  id: string;
  type: 'appointment' | 'patient' | 'treatment_plan';
  description: string;
  date: string;
  patientName?: string;
}

interface ActivityCardProps {
  activities: Activity[];
  isLoading: boolean;
}

export function ActivityCard({ activities, isLoading }: ActivityCardProps) {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="h-4 w-4 text-blue-600" />;
      case 'patient':
        return <User className="h-4 w-4 text-green-600" />;
      case 'treatment_plan':
        return <MapPin className="h-4 w-4 text-purple-600" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 animate-pulse">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-2 text-sm font-medium">Nenhuma atividade recente</h3>
        <p className="mt-1 text-sm">
          As atividades aparecerão aqui conforme você usar o sistema.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center space-x-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt="" />
            <AvatarFallback className="bg-movebetter-light">
              {getActivityIcon(activity.type)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {activity.description}
            </p>
            <div className="flex items-center text-sm text-gray-500">
              {activity.patientName && (
                <>
                  <span>{activity.patientName}</span>
                  <span className="mx-1">•</span>
                </>
              )}
              <span>
                {formatDistanceToNow(new Date(activity.date), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
