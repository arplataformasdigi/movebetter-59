
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Activity {
  id: string;
  patient: {
    name: string;
    avatar?: string;
  };
  activity: string;
  type: "exercise" | "assessment" | "plan" | "achievement";
  time: string;
}

const activities: Activity[] = [
  {
    id: "1",
    patient: {
      name: "Carolina S.",
      avatar: "",
    },
    activity: "Completou série de exercícios de fortalecimento lombar",
    type: "exercise",
    time: "12min atrás",
  },
  {
    id: "2",
    patient: {
      name: "Roberto M.",
      avatar: "",
    },
    activity: "Alcançou 100 pontos no desafio semanal",
    type: "achievement",
    time: "36min atrás",
  },
  {
    id: "3",
    patient: {
      name: "Fernanda L.",
      avatar: "",
    },
    activity: "Realizou avaliação postural",
    type: "assessment",
    time: "1h atrás",
  },
  {
    id: "4",
    patient: {
      name: "Marcelo A.",
      avatar: "",
    },
    activity: "Iniciou novo plano para corredores",
    type: "plan",
    time: "2h atrás",
  },
  {
    id: "5",
    patient: {
      name: "Juliana P.",
      avatar: "",
    },
    activity: "Completou 5 sessões consecutivas",
    type: "achievement",
    time: "3h atrás",
  },
];

const getActivityColor = (type: Activity["type"]) => {
  switch (type) {
    case "exercise":
      return "bg-green-100 text-green-800";
    case "assessment":
      return "bg-blue-100 text-blue-800";
    case "plan":
      return "bg-purple-100 text-purple-800";
    case "achievement":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getActivityLabel = (type: Activity["type"]) => {
  switch (type) {
    case "exercise":
      return "Exercício";
    case "assessment":
      return "Avaliação";
    case "plan":
      return "Plano";
    case "achievement":
      return "Conquista";
    default:
      return "Atividade";
  }
};

export function ActivityCard() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.patient.avatar} alt={activity.patient.name} />
            <AvatarFallback className="bg-movebetter-primary text-white">
              {activity.patient.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{activity.patient.name}</p>
              <Badge className={getActivityColor(activity.type)} variant="outline">
                {getActivityLabel(activity.type)}
              </Badge>
            </div>
            <p className="text-sm text-gray-700">{activity.activity}</p>
            <p className="text-xs text-gray-500">{activity.time}</p>
          </div>
        </div>
      ))}
      <div className="pt-2">
        <a href="#" className="text-sm text-movebetter-primary font-medium hover:underline">
          Ver todas as atividades
        </a>
      </div>
    </div>
  );
}
