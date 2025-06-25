
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";


interface LeaderboardUser {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  streak: number;
  rank: number;
}

export function LeaderBoard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      setIsLoading(true);
      
      const { data: patientsWithScores, error } = await supabase
        .from('patients')
        .select(`
          id,
          name,
          patient_scores (
            total_points,
            streak_days
          )
        `)
        .eq('status', 'active')
        .limit(5);

      if (error) {
        console.error('Error fetching leaderboard data:', error);
        return;
      }

      const formattedData: LeaderboardUser[] = (patientsWithScores || [])
        .map((patient) => {
          const score = patient.patient_scores?.[0];
          return {
            id: patient.id,
            name: patient.name,
            avatar: "",
            points: score?.total_points || 0,
            streak: score?.streak_days || 0,
            rank: 0, // Will be set after sorting
          };
        })
        .sort((a, b) => b.points - a.points)
        .slice(0, 5)
        .map((user, index) => ({
          ...user,
          rank: index + 1,
        }));

      setLeaderboardData(formattedData);
    } catch (error) {
      console.error('Error in fetchLeaderboardData:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-3 rounded-lg animate-pulse">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (leaderboardData.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        Nenhum paciente com pontuação encontrado
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {leaderboardData.map((user) => (
        <div 
          key={user.id} 
          className={`flex items-center space-x-4 p-3 rounded-lg transition-colors ${
            user.rank === 1 
              ? "bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200" 
              : "hover:bg-gray-50"
          }`}
        >
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-movebetter-secondary text-white font-bold">
            {user.rank}
          </div>
          
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className={`${
              user.rank === 1 
                ? "bg-amber-400" 
                : user.rank === 2 
                ? "bg-gray-400" 
                : user.rank === 3 
                ? "bg-amber-700" 
                : "bg-movebetter-primary"} text-white`}
            >
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm">{user.name}</p>
              <p className="font-bold text-movebetter-secondary">{user.points} pts</p>
            </div>
            <div className="flex items-center mt-1">
              <Badge variant="outline" className="text-xs bg-movebetter-light text-movebetter-primary border-movebetter-primary">
                {user.streak} dias consecutivos
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
