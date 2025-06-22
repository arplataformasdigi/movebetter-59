
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
  const [mounted, setMounted] = useState(true);
  
  console.log('🔄 AuthProvider: Initial state set', { 
    hasUser: !!user, 
    hasSession: !!session, 
    isLoading 
  });

  useEffect(() => {
    console.log('🚀 AUTH INITIALIZATION STARTED');
    console.time('⏱️ Auth Initialization');
    
    let authInitialized = false;
    
    const initializeAuth = async () => {
      if (authInitialized) return;
      authInitialized = true;
      
      try {
        // Get initial session first
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        console.log('📱 Initial session check:', {
          hasSession: !!initialSession,
          userId: initialSession?.user?.id || 'none'
        });
        
        if (initialSession?.user) {
          await processUserSession(initialSession);
        } else {
          console.log('🚪 No initial session found');
          setSession(null);
          setUser(null);
          setIsLoading(false);
          console.timeEnd('⏱️ Auth Initialization');
          console.log('✅ AUTH INITIALIZATION COMPLETED');
        }
      } catch (error) {
        console.error('💥 Error during auth initialization:', error);
        setSession(null);
        setUser(null);
        setIsLoading(false);
        console.timeEnd('⏱️ Auth Initialization');
      }
    };
    
    const processUserSession = async (session: Session) => {
      if (!mounted) return;
      
      console.log('👤 Processing user session...');
      setSession(session);
      
      try {
        console.log('🔍 Fetching user profile...');
        const profile = await fetchUserProfile(session.user.id);
        
        if (!mounted) return;
        
        if (profile) {
          console.log('✅ Profile loaded from database:', profile);
          setUser(profile);
        } else {
          console.log('⚠️ No profile found, creating default...');
          const defaultProfile = createDefaultProfile(session.user);
          setUser(defaultProfile);
        }
      } catch (error) {
        console.error('💥 Error loading profile:', error);
        const defaultProfile = createDefaultProfile(session.user);
        setUser(defaultProfile);
      } finally {
        if (mounted) {
          setIsLoading(false);
          console.timeEnd('⏱️ Auth Initialization');
          console.log('✅ AUTH INITIALIZATION COMPLETED');
        }
      }
    };

    // Configure auth state listener
    console.log('📡 Setting up auth state change listener...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('🔔 AUTH STATE CHANGE EVENT:', event);
        
        if (event === 'SIGNED_IN' && session?.user) {
          await processUserSession(session);
        } else if (event === 'SIGNED_OUT') {
          console.log('🚪 User signed out');
          setSession(null);
          setUser(null);
          if (mounted) {
            setIsLoading(false);
          }
        }
      }
    );

    // Initialize auth
    initializeAuth();

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up auth context...');
      setMounted(false);
      subscription.unsubscribe();
      console.log('✅ Auth context cleanup completed');
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const result = await loginUser(email, password);
    if (result.error) {
      setIsLoading(false);
    }
    return result;
  };

  const register = async (email: string, password: string, name: string, cpf?: string) => {
    return await registerUser(email, password, name, cpf);
  };

  const logout = async () => {
    setIsLoading(true);
    setUser(null);
    setSession(null);
    await logoutUser();
    setIsLoading(false);
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
