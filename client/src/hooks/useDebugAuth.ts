
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useDebugAuth = (componentName: string) => {
  const auth = useAuth();
  
  useEffect(() => {
    console.log(`🔍 ${componentName} - Auth State Debug:`, {
      component: componentName,
      isLoading: auth.isLoading,
      isAuthenticated: auth.isAuthenticated,
      hasUser: !!auth.user,
      userRole: auth.user?.role || 'none',
      userName: auth.user?.name || 'none',
      userEmail: auth.user?.email || 'none',
      timestamp: new Date().toISOString()
    });
  }, [auth.isLoading, auth.isAuthenticated, auth.user, componentName]);
  
  return auth;
};
