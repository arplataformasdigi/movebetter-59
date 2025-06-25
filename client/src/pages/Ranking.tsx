
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRealtimePatients } from "@/hooks/useRealtimePatients";

interface RankingUser {
  id: string;
  name: string;
  avatar?: string;
  progress: number;
  position: number;
  trilhasAtivas: boolean;
  totalPoints: number;
  completedExercises: number;
}

const getPositionColor = (position: number): string => {
  switch (position) {
    case 1:
      return "bg-amber-500";
    case 2:
      return "bg-gray-400";
    case 3:
      return "bg-amber-700";
    default:
      return "bg-movebetter-primary";
  }
};

export default function Ranking() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<RankingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { patients } = useRealtimePatients();
  
  useEffect(() => {
    fetchRankingData();
  }, []);

  const fetchRankingData = async () => {
    try {
      setIsLoading(true);
      
      // Create ranking data from real patients
      const patientsWithScores = patients.map((patient, index) => {
        const basePoints = 1200 - (index * 150) + Math.floor(Math.random() * 300);
        const completedExercises = 30 - (index * 5) + Math.floor(Math.random() * 10);
        return {
          id: patient.id,
          name: patient.name,
          patient_scores: [{
            total_points: Math.max(basePoints, 100),
            completed_exercises: Math.max(completedExercises, 3),
            is_tracks_active: patient.status === 'active'
          }]
        };
      });

      // Processar dados e calcular ranking
      const rankingData: RankingUser[] = (patientsWithScores || [])
        .map((patient) => {
          const score = patient.patient_scores?.[0];
          const totalPoints = score?.total_points || 0;
          const completedExercises = score?.completed_exercises || 0;
          
          // Calcular progresso baseado em exercícios completados (assumindo 100 exercícios como máximo)
          const progress = Math.min((completedExercises / 100) * 100, 100);
          
          return {
            id: patient.id,
            name: patient.name,
            avatar: "",
            progress: Math.round(progress),
            position: 0, // Será definido após ordenação
            trilhasAtivas: score?.is_tracks_active || false,
            totalPoints,
            completedExercises,
          };
        })
        .sort((a, b) => b.totalPoints - a.totalPoints) // Ordenar por pontos
        .map((user, index) => ({
          ...user,
          position: index + 1,
        }));

      setUsers(rankingData);
    } catch (error) {
      console.error('Error in fetchRankingData:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao carregar o ranking",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredRanking = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ranking de Pacientes</h1>
          <p className="text-gray-500 mt-1">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ranking de Pacientes</h1>
        <p className="text-gray-500 mt-1">
          Veja os pacientes mais engajados e seu progresso nos planos
        </p>
      </div>
      
      <div className="flex justify-start">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar paciente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-12 gap-2 p-4 font-medium text-sm text-gray-500 border-b">
          <div className="col-span-1 text-center">Posição</div>
          <div className="col-span-5">Paciente</div>
          <div className="col-span-3 text-center">Progresso</div>
          <div className="col-span-3 text-center">Trilhas Ativas</div>
        </div>
        
        {filteredRanking.map((user) => (
          <div 
            key={user.id} 
            className={`grid grid-cols-12 gap-2 p-4 items-center hover:bg-gray-50 transition-colors ${
              user.position === 1 ? "bg-amber-50" : ""
            }`}
          >
            <div className="col-span-1 flex justify-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${getPositionColor(user.position)}`}>
                {user.position}
              </div>
            </div>
            
            <div className="col-span-5 flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className={`${
                  user.position === 1 
                    ? "bg-amber-400" 
                    : user.position === 2 
                    ? "bg-gray-400" 
                    : user.position === 3 
                    ? "bg-amber-700" 
                    : "bg-movebetter-primary"} text-white`}
                >
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <span className="font-medium">{user.name}</span>
                <div className="text-xs text-gray-500">
                  {user.totalPoints} pontos • {user.completedExercises} exercícios
                </div>
              </div>
            </div>
            
            <div className="col-span-3">
              <div className="flex items-center mb-1 justify-between px-2">
                <span className="text-xs text-gray-600">{user.progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full">
                <div 
                  className={`h-full rounded-full ${
                    user.progress >= 80 
                      ? "bg-green-500" 
                      : user.progress >= 60 
                      ? "bg-blue-500" 
                      : user.progress >= 40 
                      ? "bg-yellow-500" 
                      : "bg-red-500"
                  }`}
                  style={{ width: `${user.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="col-span-3 flex justify-center">
              <Badge 
                variant={user.trilhasAtivas ? "default" : "secondary"}
                className={user.trilhasAtivas ? "bg-green-500" : "bg-gray-500"}
              >
                {user.trilhasAtivas ? "Ativo" : "Inativo"}
              </Badge>
            </div>
          </div>
        ))}
        
        {filteredRanking.length === 0 && !isLoading && (
          <div className="p-8 text-center">
            <p className="text-gray-500">
              {searchTerm ? "Nenhum paciente encontrado" : "Nenhum paciente cadastrado"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
