
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
  const [initialized, setInitialized] = useState(false);
  
  console.log('🔄 AuthProvider: Initial state set', { 
    hasUser: !!user, 
    hasSession: !!session, 
    isLoading,
    initialized
  });

  useEffect(() => {
    if (initialized) return;
    
    console.log('🚀 AUTH INITIALIZATION STARTED');
    console.time('⏱️ Auth Initialization');
    
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        setInitialized(true);
        
        // Get initial session with timeout
        console.log('📱 Getting initial session...');
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session timeout')), 5000)
        );
        
        const { data: { session: initialSession } } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;
        
        if (!mounted) return;
        
        console.log('📱 Initial session result:', {
          hasSession: !!initialSession,
          userId: initialSession?.user?.id || 'none'
        });
        
        if (initialSession?.user) {
          await handleUserSession(initialSession);
        } else {
          console.log('🚪 No initial session found');
          setSession(null);
          setUser(null);
        }
      } catch (error) {
        console.error('💥 Error during auth initialization:', error);
        if (mounted) {
          setSession(null);
          setUser(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
          console.timeEnd('⏱️ Auth Initialization');
          console.log('✅ AUTH INITIALIZATION COMPLETED');
        }
      }
    };
    
    const handleUserSession = async (session: Session) => {
      if (!mounted) return;
      
      console.log('👤 Processing user session...');
      setSession(session);
      
      try {
        console.log('🔍 Fetching user profile...');
        const profile = await fetchUserProfile(session.user.id);
        
        if (!mounted) return;
        
        if (profile) {
          console.log('✅ Profile loaded:', profile);
          setUser(profile);
        } else {
          console.log('⚠️ Creating default profile...');
          const defaultProfile = createDefaultProfile(session.user);
          setUser(defaultProfile);
        }
      } catch (error) {
        console.error('💥 Error loading profile:', error);
        if (mounted) {
          const defaultProfile = createDefaultProfile(session.user);
          setUser(defaultProfile);
        }
      }
    };

    // Set up auth state listener
    console.log('📡 Setting up auth state change listener...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('🔔 AUTH STATE CHANGE EVENT:', event);
        
        if (event === 'SIGNED_IN' && session?.user) {
          await handleUserSession(session);
        } else if (event === 'SIGNED_OUT') {
          console.log('🚪 User signed out');
          setSession(null);
          setUser(null);
        }
        
        // Always ensure loading is false after auth events
        if (mounted && isLoading) {
          setIsLoading(false);
        }
      }
    );

    // Initialize auth
    initializeAuth();

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up auth context...');
      mounted = false;
      subscription.unsubscribe();
      console.log('✅ Auth context cleanup completed');
    };
  }, [initialized]);

  // Fallback timeout to ensure isLoading never stays true indefinitely
  useEffect(() => {
    const fallbackTimeout = setTimeout(() => {
      if (isLoading) {
        console.warn('⚠️ Fallback timeout triggered - forcing loading to false');
        setIsLoading(false);
      }
    }, 8000);

    return () => clearTimeout(fallbackTimeout);
  }, [isLoading]);

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

  console.log('📊 AUTH CONTEXT STATE UPDATE:', {
    hasUser: !!user,
    hasSession: !!session,
    isAuthenticated: contextValue.isAuthenticated,
    isLoading,
    userRole: user?.role || 'none',
    userName: user?.name || 'none'
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
