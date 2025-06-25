
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
            Inicializando sistema...
          </p>
        </div>
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

  // Show loading screen while auth is initializing
  if (isLoading) {
    console.log('⏳ ProtectedRoute: Showing loading screen');
    return <LoadingScreen />;
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated || !user) {
    console.log('🚫 ProtectedRoute: User not authenticated, redirecting to /auth', {
      isAuthenticated,
      hasUser: !!user,
      fromPath: location.pathname
    });
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // Check role permissions
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
