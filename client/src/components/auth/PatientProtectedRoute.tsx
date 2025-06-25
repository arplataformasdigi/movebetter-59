
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { usePatientAuth } from "@/contexts/PatientAuthContext";
import { Skeleton } from "@/components/ui/skeleton";

interface PatientProtectedRouteProps {
  children: React.ReactNode;
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-movebetter-primary"></div>
          <div className="absolute inset-0 animate-pulse rounded-full h-16 w-16 border-2 border-movebetter-secondary opacity-20"></div>
        </div>
        <div className="text-center space-y-3">
          <h2 className="text-xl font-semibold text-gray-800">Carregando</h2>
          <div className="space-y-2">
            <Skeleton className="h-3 w-48 mx-auto" />
            <Skeleton className="h-3 w-32 mx-auto" />
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">
            Verificando acesso do paciente...
          </p>
        </div>
      </div>
    </div>
  );
}

export const PatientProtectedRoute: React.FC<PatientProtectedRouteProps> = ({ children }) => {
  const { patientUser, isAuthenticated, isLoading } = usePatientAuth();
  const location = useLocation();

  console.log('🛡️ PATIENT PROTECTED ROUTE CHECK:', {
    currentPath: location.pathname,
    isLoading,
    isAuthenticated,
    patientEmail: patientUser?.email || 'none',
    hasPatientUser: !!patientUser,
    timestamp: new Date().toISOString()
  });

  // Show loading screen while auth is initializing
  if (isLoading) {
    console.log('⏳ PatientProtectedRoute: Showing loading screen');
    return <LoadingScreen />;
  }

  // Redirect to patient auth if not authenticated
  if (!isAuthenticated || !patientUser) {
    console.log('🚫 PatientProtectedRoute: Patient not authenticated, redirecting to /paciente-login', {
      isAuthenticated,
      hasPatientUser: !!patientUser,
      fromPath: location.pathname
    });
    return <Navigate to="/paciente-login" state={{ from: location.pathname }} replace />;
  }

  console.log('✅ PatientProtectedRoute: Access granted to patient', {
    patientEmail: patientUser.email,
    path: location.pathname
  });
  
  return <>{children}</>;
};
