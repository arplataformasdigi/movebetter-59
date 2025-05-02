
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  visitReason: z.string().min(10, { message: "Razão da visita deve ter pelo menos 10 caracteres" }),
  currentCondition: z.string().min(10, { message: "Condição atual deve ter pelo menos 10 caracteres" }),
  medicalHistory: z.string().min(10, { message: "Histórico deve ter pelo menos 10 caracteres" }),
  treatmentPlan: z.string().min(10, { message: "Plano de tratamento deve ter pelo menos 10 caracteres" }),
  evaluation: z.string().optional(),
  progressScore: z.coerce.number().min(0).max(100),
});

type FormValues = z.infer<typeof formSchema>;

interface MedicalRecord {
  id: string;
  date: Date;
  visitReason: string;
  currentCondition: string;
  medicalHistory: string;
  treatmentPlan: string;
  evaluation?: string;
  progressScore: number;
}

interface PatientMedicalRecordProps {
  patientId: string;
  medicalRecords: MedicalRecord[];
  onAddRecord: (patientId: string, record: MedicalRecord) => void;
}

export function PatientMedicalRecord({
  patientId,
  medicalRecords = [],
  onAddRecord,
}: PatientMedicalRecordProps) {
  const [open, setOpen] = React.useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      visitReason: "",
      currentCondition: "",
      medicalHistory: "",
      treatmentPlan: "",
      evaluation: "",
      progressScore: 0,
    },
  });

  function onSubmit(values: FormValues) {
    // Garantindo que todas as propriedades obrigatórias são atribuídas com valores não-opcionais
    const newRecord: MedicalRecord = {
      id: `record-${Date.now()}`,
      date: new Date(),
      visitReason: values.visitReason,
      currentCondition: values.currentCondition,
      medicalHistory: values.medicalHistory,
      treatmentPlan: values.treatmentPlan,
      evaluation: values.evaluation,
      progressScore: values.progressScore,
    };
    
    onAddRecord(patientId, newRecord);
    toast.success("Prontuário adicionado com sucesso");
    form.reset();
    setOpen(false);
  }

  const getProgressColor = (score: number) => {
    if (score < 30) return "bg-red-100 text-red-800 border-red-200";
    if (score < 70) return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-green-100 text-green-800 border-green-200";
  };

  const compareProgress = (records: MedicalRecord[]) => {
    if (records.length < 2) return null;
    
    const latestRecord = records[records.length - 1];
    const previousRecord = records[records.length - 2];
    const difference = latestRecord.progressScore - previousRecord.progressScore;
    
    if (difference === 0) return "Progresso estável";
    return difference > 0 
      ? `Melhorou ${difference}% desde a última avaliação` 
      : `Diminuiu ${Math.abs(difference)}% desde a última avaliação`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Prontuário do Paciente</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Adicionar Registro</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Novo Prontuário</DialogTitle>
              <DialogDescription>
                Registre as informações da consulta e avaliação do paciente.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="visitReason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Motivo da Consulta</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descreva o motivo da consulta" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currentCondition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>História da Moléstia Atual</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descreva a condição atual do paciente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="medicalHistory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Histórico Progressivo</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descreva o histórico progressivo do paciente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="treatmentPlan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plano de Tratamento</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descreva o plano de tratamento proposto" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="evaluation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avaliação e Observações</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Observações adicionais sobre a avaliação" {...field} />
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
                      <FormLabel>Score de Progresso (0-100)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Salvar Prontuário</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {medicalRecords.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            Nenhum registro de prontuário encontrado para este paciente.
          </CardContent>
        </Card>
      ) : (
        <>
          {compareProgress(medicalRecords) && (
            <div className="p-4 bg-movebetter-light rounded-lg mb-4">
              <p className="font-medium text-movebetter-primary">{compareProgress(medicalRecords)}</p>
            </div>
          )}
          
          <div className="space-y-4">
            {medicalRecords.map((record) => (
              <Card key={record.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">
                        Consulta de {format(new Date(record.date), "dd 'de' MMMM 'de' yyyy", {locale: ptBR})}
                      </CardTitle>
                      <CardDescription>
                        {format(new Date(record.date), "HH:mm", {locale: ptBR})}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className={getProgressColor(record.progressScore)}>
                      Progresso: {record.progressScore}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2 space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Motivo da Consulta</h4>
                    <p className="text-sm text-muted-foreground">{record.visitReason}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">História da Moléstia Atual</h4>
                    <p className="text-sm text-muted-foreground">{record.currentCondition}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Histórico Progressivo</h4>
                    <p className="text-sm text-muted-foreground">{record.medicalHistory}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Plano de Tratamento</h4>
                    <p className="text-sm text-muted-foreground">{record.treatmentPlan}</p>
                  </div>
                  {record.evaluation && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Avaliação e Observações</h4>
                      <p className="text-sm text-muted-foreground">{record.evaluation}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
