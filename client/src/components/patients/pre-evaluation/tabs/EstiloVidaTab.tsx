
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PreEvaluationFormValues } from "../types";

interface EstiloVidaTabProps {
  form: UseFormReturn<PreEvaluationFormValues>;
}

export function EstiloVidaTab({ form }: EstiloVidaTabProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="alimentacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alimentação</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Como avalia sua alimentação?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excelente">Excelente</SelectItem>
                    <SelectItem value="boa">Boa</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="ruim">Ruim</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="padrao_sono"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Padrão de Sono</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Como é seu sono?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excelente">Excelente</SelectItem>
                    <SelectItem value="bom">Bom</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="ruim">Ruim</SelectItem>
                    <SelectItem value="insonia">Insônia</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="alcool"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Consumo de Álcool</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nunca">Nunca</SelectItem>
                    <SelectItem value="raramente">Raramente</SelectItem>
                    <SelectItem value="socialmente">Socialmente</SelectItem>
                    <SelectItem value="frequentemente">Frequentemente</SelectItem>
                    <SelectItem value="diariamente">Diariamente</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fumante"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fumante</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nao">Não</SelectItem>
                    <SelectItem value="sim">Sim</SelectItem>
                    <SelectItem value="ex-fumante">Ex-fumante</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ingestao_agua"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ingestão de Água (litros/dia)</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Quantidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="menos-1">Menos de 1L</SelectItem>
                    <SelectItem value="1-2">1-2L</SelectItem>
                    <SelectItem value="2-3">2-3L</SelectItem>
                    <SelectItem value="mais-3">Mais de 3L</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="tempo_sentado"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tempo Sentado por Dia</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Horas por dia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="menos-2">Menos de 2 horas</SelectItem>
                  <SelectItem value="2-4">2-4 horas</SelectItem>
                  <SelectItem value="4-6">4-6 horas</SelectItem>
                  <SelectItem value="6-8">6-8 horas</SelectItem>
                  <SelectItem value="mais-8">Mais de 8 horas</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="nivel_estresse"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nível de Estresse (0-10)</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione de 0 a 10" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(11)].map((_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i} - {i === 0 ? "Nenhum" : i <= 3 ? "Baixo" : i <= 6 ? "Moderado" : i <= 8 ? "Alto" : "Muito Alto"}
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
          name="exercicios_casa"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Disponibilidade para Exercícios em Casa</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sim-muito">Sim, muito interessado</SelectItem>
                    <SelectItem value="sim-moderado">Sim, moderadamente</SelectItem>
                    <SelectItem value="talvez">Talvez</SelectItem>
                    <SelectItem value="nao-tempo">Não tenho tempo</SelectItem>
                    <SelectItem value="nao-interesse">Não tenho interesse</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="questoes_emocionais"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Questões Emocionais</FormLabel>
            <FormControl>
              <Textarea placeholder="Ansiedade, depressão, ou outras questões emocionais" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="impacto_qualidade_vida"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Impacto na Qualidade de Vida</FormLabel>
            <FormControl>
              <Textarea placeholder="Como o problema afeta sua qualidade de vida" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="expectativas_tratamento"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Expectativas do Tratamento</FormLabel>
            <FormControl>
              <Textarea placeholder="O que espera do tratamento fisioterapêutico" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="restricoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Restrições Especiais</FormLabel>
              <FormControl>
                <Textarea placeholder="Restrições médicas ou físicas" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="info_adicional"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Informações Adicionais</FormLabel>
              <FormControl>
                <Textarea placeholder="Outras informações relevantes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="duvidas_fisioterapia"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dúvidas sobre Fisioterapia</FormLabel>
            <FormControl>
              <Textarea placeholder="Dúvidas ou preocupações sobre o tratamento" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
