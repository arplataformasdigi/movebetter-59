
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
  
  console.log('🔄 AuthProvider: Initial state set', { 
    hasUser: !!user, 
    hasSession: !!session, 
    isLoading 
  });

  useEffect(() => {
    console.log('🚀 AUTH INITIALIZATION STARTED');
    console.time('⏱️ Auth Initialization');
    
    let mounted = true;
    
    // Configure auth state listener
    console.log('📡 Setting up auth state change listener...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('🔔 AUTH STATE CHANGE EVENT:', event);
        console.log('📊 Session data:', {
          hasSession: !!session,
          userId: session?.user?.id || 'none',
          userEmail: session?.user?.email || 'none',
          tokenExpiry: session?.expires_at || 'none'
        });
        
        console.log('🔄 Setting session state...');
        setSession(session);
        
        if (session?.user) {
          console.log('👤 User authenticated, processing profile...');
          
          try {
            console.log('🔍 Fetching user profile from database...');
            
            // Set a timeout for profile fetching to ensure loading state resolves
            const profilePromise = fetchUserProfile(session.user.id);
            const timeoutPromise = new Promise<UserProfile | null>((resolve) => {
              setTimeout(() => {
                console.warn('⚠️ Profile fetch timed out, using default profile');
                resolve(null);
              }, 8000);
            });
            
            const profile = await Promise.race([profilePromise, timeoutPromise]);
            
            if (!mounted) return;
            
            if (profile) {
              console.log('✅ Setting user profile from database:', profile);
              setUser(profile);
            } else {
              console.log('⚠️ No profile found or timeout, creating default profile...');
              const defaultProfile = createDefaultProfile(session.user);
              console.log('🔄 Setting default profile:', defaultProfile);
              setUser(defaultProfile);
            }
          } catch (error) {
            if (!mounted) return;
            
            console.error('💥 Error processing user profile:', error);
            const defaultProfile = createDefaultProfile(session.user);
            console.log('🆘 Setting emergency default profile:', defaultProfile);
            setUser(defaultProfile);
          } finally {
            if (mounted) {
              console.log('🏁 Resolving loading state...');
              setIsLoading(false);
              console.timeEnd('⏱️ Auth Initialization');
              console.log('✅ AUTH INITIALIZATION COMPLETED');
            }
          }
        } else {
          console.log('🚪 No user session, clearing user state');
          setUser(null);
          if (mounted) {
            console.log('🏁 Resolving loading state...');
            setIsLoading(false);
            console.timeEnd('⏱️ Auth Initialization');
            console.log('✅ AUTH INITIALIZATION COMPLETED');
          }
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      console.log('📱 Initial session check:', {
        hasSession: !!session,
        userId: session?.user?.id || 'none'
      });
      
      // The onAuthStateChange will handle the session processing
      if (!session) {
        setIsLoading(false);
        console.log('✅ No initial session, resolving loading state');
      }
    });

    console.log('✅ Auth state listener configured');

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up auth context...');
      mounted = false;
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
