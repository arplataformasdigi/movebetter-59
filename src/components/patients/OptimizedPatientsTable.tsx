
import React, { useMemo, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, FileText, Smartphone } from "lucide-react";
import { Patient } from "@/hooks/usePatients";
import { TableLoadingSkeleton } from "@/components/ui/loading-skeleton";

interface OptimizedPatientsTableProps {
  patients: Patient[];
  isLoading: boolean;
  searchTerm: string;
  statusFilter: string;
  onEditPatient: (patient: Patient) => void;
  onDetailsPatient: (patient: Patient) => void;
  onAccessPatient: (patient: Patient) => void;
  onDeletePatient: (patient: Patient) => void;
}

export const OptimizedPatientsTable = React.memo(({
  patients,
  isLoading,
  searchTerm,
  statusFilter,
  onEditPatient,
  onDetailsPatient,
  onAccessPatient,
  onDeletePatient
}: OptimizedPatientsTableProps) => {
  console.log('🔄 OptimizedPatientsTable render');

  const filteredPatients = useMemo(() => {
    console.log('🔍 Filtering patients...', { searchTerm, statusFilter, totalPatients: patients.length });
    
    return patients.filter(patient => 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "all" || patient.status === statusFilter)
    );
  }, [patients, searchTerm, statusFilter]);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "completed": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  }, []);

  const getStatusLabel = useCallback((status: string) => {
    switch (status) {
      case "active": return "Ativo";
      case "inactive": return "Inativo";
      case "completed": return "Concluído";
      default: return status;
    }
  }, []);

  if (isLoading) {
    return <TableLoadingSkeleton />;
  }

  if (filteredPatients.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-2">
          {patients.length === 0 ? "Nenhum paciente cadastrado ainda" : "Nenhum paciente encontrado com os filtros atuais"}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Cadastrado em</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPatients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell className="font-medium">{patient.name}</TableCell>
              <TableCell>{patient.email || "-"}</TableCell>
              <TableCell>{patient.phone || "-"}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(patient.status)}>
                  {getStatusLabel(patient.status)}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(patient.created_at).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onDetailsPatient(patient)}
                    title="Ver prontuário"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEditPatient(patient)}
                    title="Editar"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onAccessPatient(patient)}
                    title="Gerenciar acesso"
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onDeletePatient(patient)}
                    className="text-red-600 hover:text-red-700"
                    title="Excluir"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
});

OptimizedPatientsTable.displayName = 'OptimizedPatientsTable';
