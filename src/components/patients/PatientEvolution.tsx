
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowUp, ArrowDown } from "lucide-react";

const evolutionSchema = z.object({
  queixasRelatos: z.string().min(10, { message: "Campo deve ter pelo menos 10 caracteres" }),
  condutaAtendimento: z.string().min(10, { message: "Campo deve ter pelo menos 10 caracteres" }),
  observacoes: z.string().optional(),
  progressScore: z.coerce.number().min(0).max(10),
});

type EvolutionFormValues = z.infer<typeof evolutionSchema>;

interface PatientEvolution {
  id: string;
  date: Date;
  queixasRelatos: string;
  condutaAtendimento: string;
  observacoes?: string;
  progressScore: number;
  previousScore?: number;
}

interface PatientEvolutionProps {
  patientId: string;
  evolutions: PatientEvolution[];
  onAddEvolution: (patientId: string, evolution: PatientEvolution) => void;
}

export function PatientEvolution({
  patientId,
  evolutions = [],
  onAddEvolution,
}: PatientEvolutionProps) {
  const [open, setOpen] = useState(false);
  
  const form = useForm<EvolutionFormValues>({
    resolver: zodResolver(evolutionSchema),
    defaultValues: {
      queixasRelatos: "",
      condutaAtendimento: "",
      observacoes: "",
      progressScore: 5,
    },
  });

  function onSubmit(values: EvolutionFormValues) {
    const lastEvolution = evolutions.length > 0 ? evolutions[evolutions.length - 1] : undefined;
    
    const newEvolution: PatientEvolution = {
      id: `evolution-${Date.now()}`,
      date: new Date(),
      queixasRelatos: values.queixasRelatos,
      condutaAtendimento: values.condutaAtendimento,
      observacoes: values.observacoes,
      progressScore: values.progressScore,
      previousScore: lastEvolution?.progressScore,
    };
    
    onAddEvolution(patientId, newEvolution);
    toast.success("Evolução adicionada com sucesso");
    form.reset();
    setOpen(false);
  }

  const getProgressColor = (score: number) => {
    if (score < 3) return "bg-red-100 text-red-800 border-red-200";
    if (score < 7) return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-green-100 text-green-800 border-green-200";
  };

  // Ordenar os registros do mais recente para o mais antigo
  const sortedEvolutions = [...evolutions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Formatação da diferença de progresso
  const renderProgressDifference = (current: number, previous?: number) => {
    if (previous === undefined) return null;
    
    const difference = current - previous;
    
    return (
      <Badge 
        variant="outline" 
        className={difference > 0 ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}
      >
        {difference > 0 ? (
          <ArrowUp className="h-3 w-3 mr-1" />
        ) : (
          <ArrowDown className="h-3 w-3 mr-1" />
        )}
        {Math.abs(difference)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Evolução do Paciente</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Adicionar Evolução</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Nova Evolução</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="queixasRelatos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Queixas e relatos</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descreva as queixas e relatos do paciente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="condutaAtendimento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conduta no atendimento</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descreva a conduta realizada no atendimento" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="observacoes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Observações adicionais" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="progressScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Score de Progresso (0-10)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Salvar Evolução</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {sortedEvolutions.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            Nenhum registro de evolução encontrado para este paciente.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedEvolutions.map((evolution) => (
            <Card key={evolution.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">
                      Evolução de {format(new Date(evolution.date), "dd 'de' MMMM 'de' yyyy", {locale: ptBR})}
                    </h4>
                    <p className="text-xs text-muted-foreground">{format(new Date(evolution.date), "HH:mm", {locale: ptBR})}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getProgressColor(evolution.progressScore)}>
                      Score: {evolution.progressScore}/10
                    </Badge>
                    {renderProgressDifference(evolution.progressScore, evolution.previousScore)}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700">Queixas e relatos</h5>
                    <p className="text-sm text-muted-foreground">{evolution.queixasRelatos}</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700">Conduta no atendimento</h5>
                    <p className="text-sm text-muted-foreground">{evolution.condutaAtendimento}</p>
                  </div>
                  {evolution.observacoes && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700">Observações</h5>
                      <p className="text-sm text-muted-foreground">{evolution.observacoes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
