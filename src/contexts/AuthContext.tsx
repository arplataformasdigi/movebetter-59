
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

export type UserRole = "admin" | "patient";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  crefito?: string;
  phone?: string;
  cpf_cnpj?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ error: any }>;
  register: (email: string, password: string, name: string, cpf?: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const createDefaultProfile = (authUser: User): UserProfile => {
    return {
      id: authUser.id,
      name: authUser.user_metadata?.name || authUser.email || 'Usuário',
      email: authUser.email || '',
      role: 'admin' as UserRole,
      crefito: authUser.user_metadata?.crefito,
      phone: authUser.user_metadata?.phone,
      cpf_cnpj: authUser.user_metadata?.cpf,
    };
  };

  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return null;
      }

      if (profile) {
        console.log('Profile found:', profile);
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role as UserRole,
          crefito: profile.crefito || undefined,
          phone: profile.phone || undefined,
          cpf_cnpj: profile.cpf_cnpj || undefined,
        };
      }
      
      console.log('Profile not found, will use default');
      return null;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };
  
  useEffect(() => {
    console.log('Initializing auth...');
    
    // Failsafe: garantir que isLoading seja resolvido em no máximo 10 segundos
    const failsafeTimeout = setTimeout(() => {
      console.warn('Auth initialization timeout - forcing loading to false');
      setIsLoading(false);
    }, 10000);

    // Configure auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email || 'no session');
        
        // Limpar o failsafe timeout
        clearTimeout(failsafeTimeout);
        
        setSession(session);
        
        if (session?.user) {
          try {
            console.log('User authenticated, processing profile...');
            
            // Try to fetch existing profile
            const profile = await fetchUserProfile(session.user.id);
            
            if (profile) {
              setUser(profile);
              console.log('Profile loaded:', profile);
            } else {
              // Create default profile if none exists
              const defaultProfile = createDefaultProfile(session.user);
              setUser(defaultProfile);
              console.log('Using default profile:', defaultProfile);
            }
          } catch (error) {
            console.error('Error processing user profile:', error);
            // Create a basic profile even on error
            const defaultProfile = createDefaultProfile(session.user);
            setUser(defaultProfile);
          }
        } else {
          console.log('No user session, clearing state');
          setUser(null);
        }
        
        // SEMPRE resolver o loading após processar o evento
        setIsLoading(false);
      }
    );

    // Cleanup
    return () => {
      clearTimeout(failsafeTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    console.log('Login attempt for:', email);
    setIsLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Login error:', error);
      setIsLoading(false);
    }
    // Se não houver erro, o onAuthStateChange vai lidar com o loading
    
    return { error };
  };

  const register = async (email: string, password: string, name: string, cpf?: string) => {
    console.log('Registration attempt for:', email);
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          cpf: cpf,
        },
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    
    if (error) {
      console.error('Registration error:', error);
    } else {
      console.log('Registration successful');
    }
    
    return { error };
  };

  const logout = async () => {
    console.log('Logging out user');
    setIsLoading(true);
    setUser(null);
    setSession(null);
    await supabase.auth.signOut();
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

  console.log('Auth context state:', {
    hasUser: !!user,
    hasSession: !!session,
    isAuthenticated: contextValue.isAuthenticated,
    isLoading,
    userRole: user?.role
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
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
