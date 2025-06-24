
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

    const handleUserSession = async (sessionData: Session | null) => {
      if (!mounted) return;
      
      console.log('👤 Processing user session:', !!sessionData);
      
      if (!sessionData) {
        setUser(null);
        setSession(null);
        setIsLoading(false);
        return;
      }

      setSession(sessionData);
      
      try {
        // Tentar buscar perfil do usuário
        console.log('🔍 Fetching user profile...');
        const profile = await fetchUserProfile(sessionData.user.id);
        
        if (!mounted) return;
        
        if (profile) {
          console.log('✅ Profile loaded from database:', profile.name);
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

    const initializeAuth = async () => {
      try {
        console.log('🚀 AUTH INITIALIZATION STARTED');
        
        // Configurar listener de auth primeiro
        authSubscription = supabase.auth.onAuthStateChange(async (event, newSession) => {
          if (!mounted) return;
          
          console.log('🔔 AUTH STATE CHANGE:', event, !!newSession);
          
          if (event === 'SIGNED_OUT') {
            setSession(null);
            setUser(null);
            setIsLoading(false);
            return;
          }
          
          await handleUserSession(newSession);
        });

        // Buscar sessão inicial
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        console.log('📱 Initial session check:', !!initialSession);
        await handleUserSession(initialSession);
        
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

    initializeAuth();

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up auth context');
      mounted = false;
      if (authSubscription?.data?.subscription) {
        authSubscription.data.subscription.unsubscribe();
      }
    };
  }, []);

  // Safety timeout reduzido para 3 segundos
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading && isInitialized) {
        console.warn('⚠️ Force stopping loading state');
        setIsLoading(false);
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [isLoading, isInitialized]);

  const login = async (email: string, password: string) => {
    console.log('🔐 Starting login process for:', email);
    setIsLoading(true);
    
    try {
      const result = await loginUser(email, password);
      
      if (result.error) {
        console.error('❌ Login failed:', result.error);
        setIsLoading(false);
        return result;
      }
      
      console.log('✅ Login successful, waiting for auth state change...');
      // Não definir isLoading como false aqui, deixar o auth state change handle
      return result;
    } catch (error) {
      console.error('💥 Login error:', error);
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

export type { UserRole, UserProfile } from "@/types/auth";
