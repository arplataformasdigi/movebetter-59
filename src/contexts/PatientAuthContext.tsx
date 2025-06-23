
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { PatientAccess } from "@/hooks/usePatientAccess";

interface PatientAuthContextType {
  patientUser: PatientAccess | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const PatientAuthContext = createContext<PatientAuthContextType | undefined>(undefined);

export function PatientAuthProvider({ children }: { children: ReactNode }) {
  const [patientUser, setPatientUser] = useState<PatientAccess | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há um paciente logado no localStorage
    const storedPatient = localStorage.getItem('patientAuth');
    if (storedPatient) {
      try {
        const parsed = JSON.parse(storedPatient);
        setPatientUser(parsed);
      } catch (error) {
        console.error('Erro ao recuperar dados do paciente:', error);
        localStorage.removeItem('patientAuth');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Aqui vamos fazer a autenticação via uma função edge
      const response = await fetch('/api/patient-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success) {
        setPatientUser(result.data);
        localStorage.setItem('patientAuth', JSON.stringify(result.data));
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Erro no login do paciente:', error);
      return { success: false, error: 'Erro interno do servidor' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setPatientUser(null);
    localStorage.removeItem('patientAuth');
  };

  const contextValue = {
    patientUser,
    login,
    logout,
    isAuthenticated: !!patientUser,
    isLoading,
  };

  return (
    <PatientAuthContext.Provider value={contextValue}>
      {children}
    </PatientAuthContext.Provider>
  );
}

export const usePatientAuth = () => {
  const context = useContext(PatientAuthContext);
  if (context === undefined) {
    throw new Error("usePatientAuth deve ser usado dentro de um PatientAuthProvider");
  }
  return context;
};
