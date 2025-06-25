
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PreEvaluationFormValues } from "../types";

interface DadosGeraisTabProps {
  form: UseFormReturn<PreEvaluationFormValues>;
}

export function DadosGeraisTab({ form }: DadosGeraisTabProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="profissao"
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
          name="atividade_fisica"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Atividade Física</FormLabel>
              <FormControl>
                <Input placeholder="Atividade física praticada" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="hobby"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hobby</FormLabel>
            <FormControl>
              <Input placeholder="Hobbies e interesses" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="queixa_principal"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Queixa Principal</FormLabel>
            <FormControl>
              <Textarea placeholder="Descreva a queixa principal" className="h-20" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="tempo_problema"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tempo do Problema</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 3 meses, 1 ano" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="inicio_problema"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Como Iniciou o Problema</FormLabel>
              <FormControl>
                <Input placeholder="Ex: gradualmente, após acidente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="tratamento_anterior"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tratamento Anterior</FormLabel>
            <FormControl>
              <Textarea placeholder="Descreva tratamentos já realizados" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
