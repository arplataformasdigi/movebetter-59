
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PreEvaluationFormValues } from "../types";

interface DorSintomasTabProps {
  form: UseFormReturn<PreEvaluationFormValues>;
}

export function DorSintomasTab({ form }: DorSintomasTabProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="descricao_dor"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição da Dor</FormLabel>
            <FormControl>
              <Textarea placeholder="Como é a dor? (queimação, pontada, etc.)" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="escala_dor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Escala da Dor (0-10)</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione de 0 a 10" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(11)].map((_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i} - {i === 0 ? "Sem dor" : i <= 3 ? "Leve" : i <= 6 ? "Moderada" : i <= 8 ? "Intensa" : "Insuportável"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="irradiacao_dor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Irradiação da Dor</FormLabel>
              <FormControl>
                <Input placeholder="Para onde a dor se espalha?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="piora_dor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>O que Piora a Dor</FormLabel>
              <FormControl>
                <Textarea placeholder="Atividades ou situações que pioram" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="alivio_dor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>O que Alivia a Dor</FormLabel>
              <FormControl>
                <Textarea placeholder="Atividades ou situações que aliviam" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="interferencia_dor"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Como a Dor Interfere no Dia a Dia</FormLabel>
            <FormControl>
              <Textarea placeholder="Impacto nas atividades diárias" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="dificuldade_dia"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Principais Dificuldades</FormLabel>
              <FormControl>
                <Textarea placeholder="Atividades mais difíceis de realizar" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="limitacao_movimento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Limitações de Movimento</FormLabel>
              <FormControl>
                <Textarea placeholder="Movimentos limitados ou dolorosos" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="dificuldade_equilibrio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dificuldade de Equilíbrio</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nenhuma">Nenhuma</SelectItem>
                    <SelectItem value="leve">Leve</SelectItem>
                    <SelectItem value="moderada">Moderada</SelectItem>
                    <SelectItem value="severa">Severa</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dispositivo_auxilio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usa Dispositivos de Auxílio</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nenhum">Nenhum</SelectItem>
                    <SelectItem value="bengala">Bengala</SelectItem>
                    <SelectItem value="muletas">Muletas</SelectItem>
                    <SelectItem value="andador">Andador</SelectItem>
                    <SelectItem value="cadeira-rodas">Cadeira de rodas</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
