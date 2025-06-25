
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DadosGeraisTab } from "./tabs/DadosGeraisTab";
import { DorSintomasTab } from "./tabs/DorSintomasTab";
import { SaudeHistoricoTab } from "./tabs/SaudeHistoricoTab";
import { EstiloVidaTab } from "./tabs/EstiloVidaTab";
import { PreEvaluationFormValues } from "./types";

interface PreEvaluationFormTabsProps {
  form: UseFormReturn<PreEvaluationFormValues>;
}

export function PreEvaluationFormTabs({ form }: PreEvaluationFormTabsProps) {
  return (
    <Tabs defaultValue="dados-gerais" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="dados-gerais">Dados Gerais</TabsTrigger>
        <TabsTrigger value="dor-sintomas">Dor e Sintomas</TabsTrigger>
        <TabsTrigger value="saude-historico">Saúde e Histórico</TabsTrigger>
        <TabsTrigger value="estilo-vida">Estilo de Vida</TabsTrigger>
      </TabsList>

      <TabsContent value="dados-gerais" className="space-y-4">
        <DadosGeraisTab form={form} />
      </TabsContent>

      <TabsContent value="dor-sintomas" className="space-y-4">
        <DorSintomasTab form={form} />
      </TabsContent>

      <TabsContent value="saude-historico" className="space-y-4">
        <SaudeHistoricoTab form={form} />
      </TabsContent>

      <TabsContent value="estilo-vida" className="space-y-4">
        <EstiloVidaTab form={form} />
      </TabsContent>
    </Tabs>
  );
}
