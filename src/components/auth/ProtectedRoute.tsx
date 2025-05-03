
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = ["admin", "manager", "professional"] 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (!isAuthenticated) {
    // Redireciona para o login caso não esteja autenticado
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // Se tem roles definidas, verifica se o usuário tem acesso
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // Redireciona para a página apropriada com base no papel do usuário
    if (user.role === "patient") {
      return <Navigate to="/paciente" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
