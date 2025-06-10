
import React, { useState } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface RankingUser {
  id: string;
  name: string;
  avatar?: string;
  type: "pilates" | "runner";
  progress: number;
  position: number;
}

const rankingData: RankingUser[] = [
  {
    id: "1",
    name: "Carla Souza",
    avatar: "",
    type: "pilates",
    progress: 85,
    position: 1,
  },
  {
    id: "2",
    name: "Pedro Santos",
    avatar: "",
    type: "runner",
    progress: 90,
    position: 2,
  },
  {
    id: "3",
    name: "Ricardo Alves",
    avatar: "",
    type: "runner",
    progress: 78,
    position: 3,
  },
  {
    id: "4",
    name: "Mariana Costa",
    avatar: "",
    type: "pilates",
    progress: 45,
    position: 4,
  },
  {
    id: "5",
    name: "Carlos Oliveira",
    avatar: "",
    type: "runner",
    progress: 75,
    position: 5,
  },
  {
    id: "6",
    name: "Luiza Mendes",
    avatar: "",
    type: "pilates",
    progress: 68,
    position: 6,
  },
  {
    id: "7",
    name: "Bruno Cardoso",
    avatar: "",
    type: "runner",
    progress: 60,
    position: 7,
  },
  {
    id: "8",
    name: "Juliana Lima",
    avatar: "",
    type: "pilates",
    progress: 42,
    position: 8,
  },
];

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
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredRanking = rankingData
    .filter(user => 
      (filterType === "all" || user.type === filterType) &&
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ranking de Pacientes</h1>
        <p className="text-gray-500 mt-1">
          Veja os pacientes mais engajados e seu progresso nos planos
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar paciente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Todos os tipos" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="runner">Corredores</SelectItem>
            <SelectItem value="pilates">Pilates</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-12 gap-2 p-4 font-medium text-sm text-gray-500 border-b">
          <div className="col-span-1 text-center">Posição</div>
          <div className="col-span-5 md:col-span-5">Paciente</div>
          <div className="col-span-2 text-center hidden md:block">Tipo</div>
          <div className="col-span-6 md:col-span-4 text-center">Progresso</div>
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
            
            <div className="col-span-5 md:col-span-5 flex items-center space-x-3">
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
              <span className="font-medium">{user.name}</span>
            </div>
            
            <div className="col-span-2 text-center hidden md:block">
              <Badge className={
                user.type === "runner" 
                  ? "bg-blue-100 text-blue-800 border-blue-200" 
                  : "bg-green-100 text-green-800 border-green-200"
              }>
                {user.type === "runner" ? "corredor" : "pilates"}
              </Badge>
            </div>
            
            <div className="col-span-6 md:col-span-4">
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
          </div>
        ))}
        
        {filteredRanking.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500">Nenhum paciente encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
