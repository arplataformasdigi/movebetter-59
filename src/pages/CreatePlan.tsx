
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Plus, Trash } from "lucide-react";

const planSchema = z.object({
  title: z.string().min(3, { message: "Título deve ter no mínimo 3 caracteres" }),
  patient: z.string({ required_error: "Paciente é obrigatório" }),
  type: z.string({ required_error: "Tipo é obrigatório" }),
  startDate: z.date({ required_error: "Data de início é obrigatória" }),
  endDate: z.date({ required_error: "Data de término é obrigatória" }),
  description: z.string().optional(),
  exercises: z.array(
    z.object({
      name: z.string().min(1, { message: "Nome do exercício é obrigatório" }),
      duration: z.string().min(1, { message: "Duração é obrigatória" }),
      description: z.string().optional(),
      youtubeLink: z.string().optional(),
    })
  ).min(1, { message: "Adicione pelo menos um exercício" }),
});

type PlanFormValues = z.infer<typeof planSchema>;

const patients = [
  { id: "1", name: "Carlos Oliveira" },
  { id: "2", name: "Mariana Costa" },
  { id: "3", name: "Pedro Santos" },
  { id: "4", name: "Carla Souza" },
  { id: "5", name: "Ricardo Alves" },
];

export default function CreatePlan() {
  const navigate = useNavigate();
  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      title: "",
      description: "",
      exercises: [{ name: "", duration: "", description: "", youtubeLink: "" }],
    },
  });

  function onSubmit(data: PlanFormValues) {
    console.log(data);
    // In a real app, you would save the data to your backend here
    navigate("/planos");
  }

  function addExercise() {
    const currentExercises = form.getValues("exercises") || [];
    form.setValue("exercises", [
      ...currentExercises,
      { name: "", duration: "", description: "", youtubeLink: "" },
    ]);
  }

  function removeExercise(index: number) {
    const currentExercises = form.getValues("exercises") || [];
    if (currentExercises.length > 1) {
      form.setValue(
        "exercises",
        currentExercises.filter((_, i) => i !== index)
      );
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Criar Novo Plano</h1>
        <p className="text-sm text-gray-500">
          Preencha o formulário abaixo para criar um novo plano de acompanhamento.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título do Plano</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Reabilitação pós-lesão" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="patient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paciente</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o paciente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
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

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
                      <SelectItem value="runner">Corredor</SelectItem>
                      <SelectItem value="pilates">Pilates</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Início</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy", { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Término</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy", { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descreva os objetivos e detalhes do plano..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Exercícios</h3>
              <Button type="button" onClick={addExercise} variant="outline">
                <Plus className="h-4 w-4 mr-2" /> Adicionar Exercício
              </Button>
            </div>

            {form.watch("exercises")?.map((_, index) => (
              <div key={index} className="border rounded-md p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Exercício {index + 1}</h4>
                  <Button
                    type="button"
                    onClick={() => removeExercise(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    disabled={form.watch("exercises").length <= 1}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`exercises.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Exercício</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Agachamento" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`exercises.${index}.duration`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duração</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 3 séries de 12 repetições" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`exercises.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descreva como realizar o exercício corretamente..."
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`exercises.${index}.youtubeLink`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link do YouTube</FormLabel>
                      <FormControl>
                        <Input placeholder="https://www.youtube.com/watch?v=..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button type="button" variant="outline" className="mr-2" onClick={() => navigate("/planos")}>
              Cancelar
            </Button>
            <Button type="submit">Salvar Plano</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
