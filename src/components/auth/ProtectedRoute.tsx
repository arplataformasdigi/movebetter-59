
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
  allowedRoles = ["admin"] 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute check:', {
    isLoading,
    isAuthenticated,
    userRole: user?.role,
    allowedRoles,
    currentPath: location.pathname
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-movebetter-primary mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    console.log('User not authenticated, redirecting to auth');
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // Se tem roles definidas, verifica se o usuário tem acesso
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log('User role not allowed, redirecting based on role');
    // Redireciona para a página apropriada com base no papel do usuário
    if (user.role === "patient") {
      return <Navigate to="/paciente" replace />;
    }
    return <Navigate to="/" replace />;
  }

  console.log('Access granted to protected route');
  return <>{children}</>;
};
