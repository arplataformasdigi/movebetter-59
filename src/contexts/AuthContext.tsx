
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { AuthContextType, UserProfile } from "@/types/auth";
import { createDefaultProfile, fetchUserProfile } from "@/utils/profileUtils";
import { loginUser, registerUser, logoutUser } from "@/utils/authActions";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  console.log('🏗️ AuthProvider: Component initialized');
  
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  
  console.log('🔄 AuthProvider: State', { 
    hasUser: !!user, 
    hasSession: !!session, 
    isLoading,
    isInitialized
  });

  useEffect(() => {
    let mounted = true;
    let authSubscription: any;

    const initializeAuth = async () => {
      try {
        console.log('🚀 AUTH INITIALIZATION STARTED');
        
        // Set up auth listener first
        authSubscription = supabase.auth.onAuthStateChange(async (event, newSession) => {
          if (!mounted) return;
          
          console.log('🔔 AUTH STATE CHANGE:', event, !!newSession);
          
          if (event === 'SIGNED_OUT') {
            setSession(null);
            setUser(null);
            setIsLoading(false);
            return;
          }
          
          if (newSession) {
            setSession(newSession);
            await handleUserSession(newSession);
          } else {
            setSession(null);
            setUser(null);
            setIsLoading(false);
          }
        });

        // Get initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (initialSession) {
          console.log('📱 Found initial session');
          setSession(initialSession);
          await handleUserSession(initialSession);
        } else {
          console.log('📱 No initial session');
          setIsLoading(false);
        }
        
        setIsInitialized(true);
        console.log('✅ AUTH INITIALIZATION COMPLETED');
        
      } catch (error) {
        console.error('💥 Auth initialization error:', error);
        if (mounted) {
          setIsLoading(false);
          setIsInitialized(true);
        }
      }
    };

    const handleUserSession = async (sessionData: Session) => {
      if (!mounted) return;
      
      console.log('👤 Processing user session');
      
      try {
        // Try to fetch profile with shorter timeout
        const profile = await Promise.race([
          fetchUserProfile(sessionData.user.id),
          new Promise<null>((_, reject) => 
            setTimeout(() => reject(new Error('Profile timeout')), 2000)
          )
        ]);
        
        if (!mounted) return;
        
        if (profile) {
          console.log('✅ Profile loaded from database');
          setUser(profile);
        } else {
          console.log('⚠️ No profile found, creating default');
          const defaultProfile = createDefaultProfile(sessionData.user);
          setUser(defaultProfile);
        }
      } catch (error) {
        console.warn('⚠️ Profile fetch failed, using default:', error);
        if (mounted) {
          const defaultProfile = createDefaultProfile(sessionData.user);
          setUser(defaultProfile);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Only initialize once
    if (!isInitialized) {
      initializeAuth();
    }

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up auth context');
      mounted = false;
      if (authSubscription?.data?.subscription) {
        authSubscription.data.subscription.unsubscribe();
      }
    };
  }, [isInitialized]);

  // Safety timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading && isInitialized) {
        console.warn('⚠️ Force stopping loading state');
        setIsLoading(false);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [isLoading, isInitialized]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await loginUser(email, password);
      if (result.error) {
        setIsLoading(false);
      }
      return result;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return { error };
    }
  };

  const register = async (email: string, password: string, name: string, cpf?: string) => {
    try {
      return await registerUser(email, password, name, cpf);
    } catch (error) {
      console.error('Register error:', error);
      return { error };
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      setUser(null);
      setSession(null);
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue = {
    user,
    session,
    login,
    register,
    logout,
    isAuthenticated: !!session && !!user,
    isLoading,
  };

  console.log('📊 AUTH CONTEXT FINAL STATE:', {
    hasUser: !!user,
    hasSession: !!session,
    isAuthenticated: contextValue.isAuthenticated,
    isLoading,
    userRole: user?.role || 'none'
  });

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error('❌ useAuth called outside of AuthProvider');
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

// Re-export types for backward compatibility
export type { UserRole, UserProfile } from "@/types/auth";
