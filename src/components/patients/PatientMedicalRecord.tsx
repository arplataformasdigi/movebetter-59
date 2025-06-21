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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { XCircle } from "lucide-react";
import { usePatientMedicalRecords, MedicalRecord } from "@/hooks/usePatientMedicalRecords";

const formSchema = z.object({
  age: z.coerce.number().min(1, { message: "Idade é obrigatória" }),
  gender: z.string().min(1, { message: "Sexo é obrigatório" }),
  weight: z.coerce.number().min(1, { message: "Peso é obrigatório" }),
  height: z.coerce.number().min(1, { message: "Altura é obrigatória" }),
  birth_date: z.string().min(1, { message: "Data de nascimento é obrigatória" }),
  profession: z.string().min(2, { message: "Profissão deve ter pelo menos 2 caracteres" }),
  marital_status: z.string().min(1, { message: "Situação é obrigatória" }),
  visit_reason: z.string().min(10, { message: "Razão da visita deve ter pelo menos 10 caracteres" }),
  current_condition: z.string().min(10, { message: "Condição atual deve ter pelo menos 10 caracteres" }),
  medical_history: z.string().min(10, { message: "Histórico deve ter pelo menos 10 caracteres" }),
  treatment_plan: z.string().min(10, { message: "Plano de tratamento deve ter pelo menos 10 caracteres" }),
  evaluation: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface PatientMedicalRecordProps {
  patientId: string;
}

export function PatientMedicalRecord({ patientId }: PatientMedicalRecordProps) {
  const [open, setOpen] = React.useState(false);
  const { medicalRecords, isLoading, addMedicalRecord, closeMedicalRecord } = usePatientMedicalRecords(patientId);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 0,
      gender: "",
      weight: 0,
      height: 0,
      birth_date: "",
      profession: "",
      marital_status: "",
      visit_reason: "",
      current_condition: "",
      medical_history: "",
      treatment_plan: "",
      evaluation: "",
    },
  });

  function onSubmit(values: FormValues) {
    const recordData = {
      patient_id: patientId,
      age: values.age,
      gender: values.gender,
      weight: values.weight,
      height: values.height,
      birth_date: values.birth_date,
      profession: values.profession,
      marital_status: values.marital_status,
      visit_reason: values.visit_reason,
      current_condition: values.current_condition,
      medical_history: values.medical_history,
      treatment_plan: values.treatment_plan,
      evaluation: values.evaluation,
      is_active: true,
    };
    
    addMedicalRecord(recordData);
    form.reset();
    setOpen(false);
  }

  const handleCloseRecord = (recordId: string) => {
    if (confirm("Tem certeza que deseja encerrar este prontuário?")) {
      closeMedicalRecord(recordId);
    }
  };

  if (isLoading) {
    return <div>Carregando prontuários...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Prontuário do Paciente</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">Adicionar Registro</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Novo Prontuário</DialogTitle>
              <DialogDescription>
                Registre as informações da consulta e avaliação do paciente.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Idade</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Idade" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sexo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="masculino">Masculino</SelectItem>
                            <SelectItem value="feminino">Feminino</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Peso (kg)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" placeholder="Peso" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Altura (cm)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Altura" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="birth_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Nascimento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="profession"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profissão</FormLabel>
                        <FormControl>
                          <Input placeholder="Profissão" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="marital_status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Situação</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                            <SelectItem value="casado">Casado(a)</SelectItem>
                            <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="visit_reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Motivo da Consulta</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descreva o motivo da consulta" className="h-20" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="current_condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>História da Moléstia Atual</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descreva a condição atual do paciente" className="h-20" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="medical_history"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Histórico Progressivo</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descreva o histórico progressivo do paciente" className="h-20" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="treatment_plan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plano de Tratamento</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descreva o plano de tratamento proposto" className="h-20" {...field} />
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
                        <Textarea placeholder="Observações adicionais sobre a avaliação" className="h-20" {...field} />
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
          <CardContent className="p-4 text-center text-muted-foreground">
            Nenhum registro de prontuário encontrado para este paciente.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {medicalRecords.map((record) => (
            <Card key={record.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-base">
                      Consulta de {format(new Date(record.created_at), "dd 'de' MMMM 'de' yyyy", {locale: ptBR})}
                    </CardTitle>
                    <CardDescription>
                      {format(new Date(record.created_at), "HH:mm", {locale: ptBR})}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCloseRecord(record.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <XCircle className="h-4 w-4" />
                    Encerrar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pb-2 space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Idade:</span> {record.age} anos
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Sexo:</span> {record.gender}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Peso:</span> {record.weight}kg
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Altura:</span> {record.height}cm
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Profissão:</span> {record.profession}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Situação:</span> {record.marital_status}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Motivo da Consulta</h4>
                    <p className="text-sm text-muted-foreground">{record.visit_reason}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">História da Moléstia Atual</h4>
                    <p className="text-sm text-muted-foreground">{record.current_condition}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Histórico Progressivo</h4>
                    <p className="text-sm text-muted-foreground">{record.medical_history}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Plano de Tratamento</h4>
                    <p className="text-sm text-muted-foreground">{record.treatment_plan}</p>
                  </div>
                  {record.evaluation && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Avaliação e Observações</h4>
                      <p className="text-sm text-muted-foreground">{record.evaluation}</p>
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
