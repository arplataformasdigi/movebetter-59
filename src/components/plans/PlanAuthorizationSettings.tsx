
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";

interface PlanAuthorizationSettingsProps {
  onSettingsChange: (settings: { allowPatientMarkAsCompleted: boolean }) => void;
}

export function PlanAuthorizationSettings({ onSettingsChange }: PlanAuthorizationSettingsProps) {
  const [allowPatientMarkAsCompleted, setAllowPatientMarkAsCompleted] = useState(true);

  const handleToggle = (checked: boolean) => {
    setAllowPatientMarkAsCompleted(checked);
    onSettingsChange({ allowPatientMarkAsCompleted: checked });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="mr-2 h-5 w-5" />
          Configurações de Autorização
        </CardTitle>
        <CardDescription>
          Configure as permissões dos pacientes para interagir com os planos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Switch
            id="allow-mark-completed"
            checked={allowPatientMarkAsCompleted}
            onCheckedChange={handleToggle}
          />
          <Label htmlFor="allow-mark-completed">
            Permitir que pacientes marquem exercícios como concluídos
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
