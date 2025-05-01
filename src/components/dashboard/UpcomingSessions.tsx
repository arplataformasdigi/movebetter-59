
import React from "react";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Session {
  id: string;
  patientName: string;
  type: "pilates" | "running" | "assessment";
  date: string;
  time: string;
}

const sessions: Session[] = [
  {
    id: "1",
    patientName: "Marcos Silva",
    type: "pilates",
    date: "Hoje",
    time: "14:00",
  },
  {
    id: "2",
    patientName: "Paula Ferraz",
    type: "assessment",
    date: "Hoje",
    time: "16:30",
  },
  {
    id: "3",
    patientName: "Rodrigo Alves",
    type: "running",
    date: "Amanhã",
    time: "10:15",
  },
  {
    id: "4",
    patientName: "Sabrina Torres",
    type: "pilates",
    date: "Amanhã",
    time: "15:45",
  },
  {
    id: "5",
    patientName: "Luciana Braga",
    type: "assessment",
    date: "23/05",
    time: "09:30",
  },
];

const getSessionTypeDetails = (type: Session["type"]) => {
  switch (type) {
    case "pilates":
      return { 
        label: "Pilates",
        color: "bg-green-100 text-green-800 border-green-200" 
      };
    case "running":
      return { 
        label: "Corrida", 
        color: "bg-blue-100 text-blue-800 border-blue-200" 
      };
    case "assessment":
      return { 
        label: "Avaliação", 
        color: "bg-purple-100 text-purple-800 border-purple-200" 
      };
    default:
      return { 
        label: "Sessão", 
        color: "bg-gray-100 text-gray-800 border-gray-200" 
      };
  }
};

export function UpcomingSessions() {
  return (
    <div className="space-y-4">
      {sessions.map((session) => {
        const sessionType = getSessionTypeDetails(session.type);
        
        return (
          <div key={session.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="h-10 w-10 rounded-full bg-movebetter-light flex items-center justify-center text-movebetter-primary">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm">{session.patientName}</p>
                <Badge variant="outline" className={sessionType.color}>
                  {sessionType.label}
                </Badge>
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-600">{session.date}</p>
                <p className="text-xs font-medium">{session.time}</p>
              </div>
            </div>
          </div>
        );
      })}
      
      <div className="pt-2">
        <a href="/calendario" className="text-sm text-movebetter-primary font-medium hover:underline">
          Ver agenda completa
        </a>
      </div>
    </div>
  );
}
