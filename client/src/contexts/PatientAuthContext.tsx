import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authAPI, type User, type LoginResponse } from "@/lib/api";

interface PatientUser {
  id: string;
  patient_id: string;
  email: string;
  patients?: {
    name: string;
    email: string;
  };
}

interface PatientAuthContextType {
  patientUser: PatientUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const PatientAuthContext = createContext<PatientAuthContextType | undefined>(undefined);

export function PatientAuthProvider({ children }: { children: ReactNode }) {
  const [patientUser, setPatientUser] = useState<PatientUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing patient session
    const storedPatient = localStorage.getItem('patient_user');
    if (storedPatient) {
      try {
        setPatientUser(JSON.parse(storedPatient));
      } catch (error) {
        console.error('Error parsing stored patient data:', error);
        localStorage.removeItem('patient_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const response = await authAPI.patientLogin(email, password);

      if (response.success && response.user) {
        const patientData = response.user as any;
        setPatientUser(patientData);
        localStorage.setItem('patient_user', JSON.stringify(patientData));
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Credenciais inválidas' };
      }
    } catch (error) {
      console.error('Patient login error:', error);
      return { success: false, error: 'Erro de conexão' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setPatientUser(null);
    localStorage.removeItem('patient_user');
  };

  return (
    <PatientAuthContext.Provider
      value={{
        patientUser,
        login,
        logout,
        isLoading,
        isAuthenticated: !!patientUser,
      }}
    >
      {children}
    </PatientAuthContext.Provider>
  );
}

export function usePatientAuth() {
  const context = useContext(PatientAuthContext);
  if (context === undefined) {
    throw new Error('usePatientAuth must be used within a PatientAuthProvider');
  }
  return context;
}