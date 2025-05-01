
import React from "react";
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

const leaderboardData: LeaderboardUser[] = [
  {
    id: "1",
    name: "Roberto Almeida",
    avatar: "",
    points: 2840,
    streak: 12,
    rank: 1,
  },
  {
    id: "2",
    name: "Camila Vieira",
    avatar: "",
    points: 2215,
    streak: 8,
    rank: 2,
  },
  {
    id: "3",
    name: "Thiago Moreira",
    avatar: "",
    points: 1998,
    streak: 15,
    rank: 3,
  },
  {
    id: "4",
    name: "Beatriz Costa",
    avatar: "",
    points: 1876,
    streak: 6,
    rank: 4,
  },
  {
    id: "5",
    name: "Eduardo Lima",
    avatar: "",
    points: 1645,
    streak: 9,
    rank: 5,
  },
];

export function LeaderBoard() {
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
