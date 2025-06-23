
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { PreEvaluationFormValues } from "../types";

interface SaudeHistoricoTabProps {
  form: UseFormReturn<PreEvaluationFormValues>;
}

export function SaudeHistoricoTab({ form }: SaudeHistoricoTabProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="diagnostico_medico"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Diagnóstico Médico</FormLabel>
            <FormControl>
              <Textarea placeholder="Diagnóstico fornecido pelo médico" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="exames_recentes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Exames Recentes</FormLabel>
            <FormControl>
              <Textarea placeholder="Exames realizados (raio-x, ressonância, etc.)" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="condicoes_saude"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Outras Condições de Saúde</FormLabel>
            <FormControl>
              <Textarea placeholder="Diabetes, hipertensão, etc." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cirurgias"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cirurgias Anteriores</FormLabel>
            <FormControl>
              <Textarea placeholder="Cirurgias realizadas e quando" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="medicamentos"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medicamentos em Uso</FormLabel>
              <FormControl>
                <Textarea placeholder="Medicamentos atuais" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="alergias"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alergias</FormLabel>
              <FormControl>
                <Textarea placeholder="Alergias conhecidas" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="doencas_familiares"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doenças na Família</FormLabel>
              <FormControl>
                <Textarea placeholder="Histórico familiar de doenças" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="condicoes_similares"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Condições Similares na Família</FormLabel>
              <FormControl>
                <Textarea placeholder="Família com problemas similares" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
