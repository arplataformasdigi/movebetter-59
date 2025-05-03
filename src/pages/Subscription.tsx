
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function Subscription() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"pro" | "premium" | null>(null);

  const handleSelectPlan = (plan: "pro" | "premium") => {
    setSelectedPlan(plan);
  };

  const handleSubscribe = () => {
    if (!selectedPlan) {
      toast({
        title: "Atenção",
        description: "Por favor, selecione um plano para assinar",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulação de processamento de assinatura
    setTimeout(() => {
      toast({
        title: "Assinatura realizada",
        description: `Você assinou o plano ${selectedPlan === "pro" ? "Pro" : "Premium"} com sucesso!`,
      });
      setIsLoading(false);
    }, 1500);
  };

  const featuresPro = [
    "Ficha de pré-avaliação",
    "Prontuário eletrônico",
    "Histórico de Evolução do paciente",
    "Criar contrato",
    "Biblioteca de exercícios",
    "Ranking de progresso do paciente",
    "Agendar pacientes",
    "App para pacientes"
  ];

  const featuresPremium = [
    "Ficha de pré-avaliação",
    "Criar planos de acompanhamento",
    "Prontuário eletrônico",
    "Histórico de Evolução do paciente",
    "Criar contrato",
    "Biblioteca de exercícios",
    "Ranking de progresso do paciente",
    "Agendar pacientes",
    "App para pacientes"
  ];

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-2">Planos de Assinatura</h1>
      <p className="text-gray-600 mb-6">Escolha o plano ideal para sua prática profissional</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Plano Pro */}
        <Card className={`border-2 hover:shadow-lg transition-all ${selectedPlan === "pro" ? "border-movebetter-primary" : "border-gray-200"}`}>
          <CardHeader>
            <CardTitle className="text-2xl">Plano Pro</CardTitle>
            <CardDescription className="text-lg">
              <span className="text-3xl font-bold">R$ 89</span>/mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {featuresPro.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className={`w-full ${selectedPlan === "pro" ? "bg-movebetter-primary" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              onClick={() => handleSelectPlan("pro")}
            >
              {selectedPlan === "pro" ? "Plano Selecionado" : "Selecionar Plano"}
            </Button>
          </CardFooter>
        </Card>

        {/* Plano Premium */}
        <Card className={`border-2 hover:shadow-lg transition-all ${selectedPlan === "premium" ? "border-movebetter-primary" : "border-gray-200"}`}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">Plano Premium</CardTitle>
              <span className="bg-movebetter-primary text-white text-xs uppercase font-bold py-1 px-2 rounded-full">Recomendado</span>
            </div>
            <CardDescription className="text-lg">
              <span className="text-3xl font-bold">R$ 129</span>/mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {featuresPremium.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className={feature.includes("planos de acompanhamento") ? "font-bold text-movebetter-primary" : ""}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className={`w-full ${selectedPlan === "premium" ? "bg-movebetter-primary" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              onClick={() => handleSelectPlan("premium")}
            >
              {selectedPlan === "premium" ? "Plano Selecionado" : "Selecionar Plano"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8 flex justify-center">
        <Button
          className="bg-movebetter-primary hover:bg-movebetter-primary/90 px-8 py-6 text-lg"
          disabled={isLoading || !selectedPlan}
          onClick={handleSubscribe}
        >
          {isLoading ? "Processando..." : "Assinar Plano"}
        </Button>
      </div>

      <div className="mt-6 text-center text-gray-500 text-sm">
        Ao assinar, você concorda com nossos Termos de Serviço e Política de Privacidade.<br />
        Você pode cancelar sua assinatura a qualquer momento.
      </div>
    </div>
  );
}
