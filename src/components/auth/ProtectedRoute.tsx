
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-movebetter-primary mx-auto"></div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 mx-auto" />
          <Skeleton className="h-3 w-24 mx-auto" />
        </div>
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = ["admin"] 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  console.log('🛡️ PROTECTED ROUTE CHECK:', {
    currentPath: location.pathname,
    isLoading,
    isAuthenticated,
    userRole: user?.role || 'none',
    userName: user?.name || 'none',
    allowedRoles,
    hasUser: !!user,
    timestamp: new Date().toISOString()
  });

  if (isLoading) {
    console.log('⏳ ProtectedRoute: Showing loading screen');
    return <LoadingScreen />;
  }

  if (!isAuthenticated || !user) {
    console.log('🚫 ProtectedRoute: User not authenticated, redirecting to /auth', {
      isAuthenticated,
      hasUser: !!user,
      fromPath: location.pathname
    });
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // Se tem roles definidas, verifica se o usuário tem acesso
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log('🚫 ProtectedRoute: User role not allowed', {
      userRole: user.role,
      allowedRoles,
      redirectingTo: user.role === "patient" ? "/paciente" : "/"
    });
    
    if (user.role === "patient") {
      return <Navigate to="/paciente" replace />;
    }
    return <Navigate to="/" replace />;
  }

  console.log('✅ ProtectedRoute: Access granted', {
    userRole: user.role,
    allowedRoles,
    path: location.pathname
  });
  
  return <>{children}</>;
};
