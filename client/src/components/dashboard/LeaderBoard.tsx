
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PatientScore {
  id: string;
  patient_id: string;
  total_points: number;
  level_number: number;
  streak_days: number;
  completed_exercises: number;
  achievements: string[];
  patients: {
    name: string;
  };
}

export function LeaderBoard() {
  const [topPatients, setTopPatients] = useState<PatientScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTopPatients();
  }, []);

  const fetchTopPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('patient_scores')
        .select(`
          *,
          patients (name)
        `)
        .order('total_points', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching top patients:', error);
        return;
      }

      setTopPatients(data || []);
    } catch (error) {
      console.error('Error fetching top patients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{index + 1}</span>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ranking dos Pacientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Ranking dos Pacientes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topPatients.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Nenhum dado de pontuação encontrado
            </p>
          ) : (
            topPatients
              .sort((a: PatientScore, b: PatientScore) => b.total_points - a.total_points)
              .map((user: PatientScore, index: number) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-3">
                    {getRankIcon(index)}
                    <div>
                      <p className="font-medium">{user.patients?.name || 'Nome não disponível'}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Nível {user.level_number}</span>
                        <span>•</span>
                        <span>{user.streak_days} dias seguidos</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">
                      {user.total_points} pts
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {user.completed_exercises} exercícios
                    </p>
                  </div>
                </div>
              ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
