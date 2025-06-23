
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings } from "lucide-react";
import { PatientAccess } from "@/hooks/usePatientAccess";

interface PatientAccessDialogProps {
  patientId: string;
  patientName: string;
  patientAccess: PatientAccess[];
  onCreateAccess: (patientId: string, allowedPages: string[]) => Promise<{ success: boolean; data?: any; error?: any }>;
  onUpdateAccess: (id: string, updates: Partial<PatientAccess>) => Promise<{ success: boolean; data?: any; error?: any }>;
  onDeleteAccess: (id: string) => Promise<{ success: boolean; error?: any }>;
  onClose: () => void;
}

const availablePages = [
  { id: "dashboard", name: "Dashboard", description: "Página inicial do paciente" },
  { id: "appointments", name: "Consultas", description: "Visualizar consultas agendadas" },
  { id: "medical-records", name: "Prontuários", description: "Acessar prontuários médicos" },
  { id: "plans", name: "Planos de Tratamento", description: "Visualizar planos e exercícios" },
  { id: "evolution", name: "Evolução", description: "Acompanhar progresso do tratamento" },
];

export function PatientAccessDialog({ 
  patientId, 
  patientName, 
  patientAccess, 
  onCreateAccess, 
  onUpdateAccess, 
  onDeleteAccess, 
  onClose 
}: PatientAccessDialogProps) {
  const [selectedPages, setSelectedPages] = useState<string[]>([]);

  const existingAccess = patientAccess.find(pa => pa.patient_id === patientId);

  React.useEffect(() => {
    if (existingAccess) {
      setSelectedPages(existingAccess.allowed_pages);
    }
  }, [existingAccess]);

  const handlePageToggle = (pageId: string) => {
    setSelectedPages(prev => 
      prev.includes(pageId) 
        ? prev.filter(id => id !== pageId)
        : [...prev, pageId]
    );
  };

  const handleSave = async () => {
    if (existingAccess) {
      const result = await onUpdateAccess(existingAccess.id, {
        allowed_pages: selectedPages,
        is_active: true
      });
      if (result.success) {
        onClose();
      }
    } else {
      const result = await onCreateAccess(patientId, selectedPages);
      if (result.success) {
        onClose();
      }
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Gerenciar Permissões de Acesso</DialogTitle>
          <DialogDescription>
            Configure quais páginas {patientName} pode acessar no aplicativo.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium">Páginas Disponíveis</Label>
            <p className="text-sm text-muted-foreground mb-4">
              Selecione as páginas que o paciente poderá acessar
            </p>
          </div>
          
          <div className="space-y-3">
            {availablePages.map((page) => (
              <div key={page.id} className="flex items-start space-x-3">
                <Checkbox
                  id={page.id}
                  checked={selectedPages.includes(page.id)}
                  onCheckedChange={() => handlePageToggle(page.id)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor={page.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {page.name}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {page.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar Permissões
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
