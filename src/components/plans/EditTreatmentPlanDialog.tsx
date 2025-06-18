
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { toast } from "sonner";
import { useTreatmentPlans, TreatmentPlan } from "@/hooks/useTreatmentPlans";
import { usePatients } from "@/hooks/usePatients";
import { Pencil } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  description: z.string().optional(),
  patient_id: z.string().min(1, { message: "Selecione um paciente" }),
  start_date: z.string().min(1, { message: "Data de início é obrigatória" }),
  end_date: z.string().optional(),
  progress_percentage: z.number().min(0).max(100),
  is_active: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditTreatmentPlanDialogProps {
  plan: TreatmentPlan;
}

export function EditTreatmentPlanDialog({ plan }: EditTreatmentPlanDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { updateTreatmentPlan } = useTreatmentPlans();
  const { patients } = usePatients();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: plan.name,
      description: plan.description || "",
      patient_id: plan.patient_id || "",
      start_date: plan.start_date || "",
      end_date: plan.end_date || "",
      progress_percentage: plan.progress_percentage,
      is_active: plan.is_active,
    },
  });

  async function onSubmit(values: FormValues) {
    const planData = {
      name: values.name,
      description: values.description || undefined,
      patient_id: values.patient_id,
      start_date: values.start_date,
      end_date: values.end_date || undefined,
      progress_percentage: values.progress_percentage,
      is_active: values.is_active,
    };
    
    const result = await updateTreatmentPlan(plan.id, planData);
    
    if (result.success) {
      toast.success("Trilha atualizada com sucesso");
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="h-4 w-4 mr-1" /> Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Editar Trilha</DialogTitle>
          <DialogDescription>
            Atualize as informações da trilha de tratamento.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Trilha</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da trilha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descrição da trilha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="patient_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paciente</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um paciente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Início</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Fim</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="progress_percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Progresso (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      max="100" 
                      {...field} 
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Salvar Alterações</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
