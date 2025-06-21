
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

interface ExtendedProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  crefito?: string;
  phone?: string;
  cpf_cnpj?: string;
  created_at: string;
  updated_at: string;
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
  const [initializing, setInitializing] = useState(true);
  
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profile && !error) {
        console.log('Profile loaded successfully:', profile);
        const extendedProfile = profile as ExtendedProfile;
        return {
          id: extendedProfile.id,
          name: extendedProfile.name,
          email: extendedProfile.email,
          role: extendedProfile.role as UserRole,
          crefito: extendedProfile.crefito || undefined,
          phone: extendedProfile.phone || undefined,
          cpf_cnpj: extendedProfile.cpf_cnpj || undefined,
        };
      } else {
        console.error('Error fetching profile:', error);
        return null;
      }
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
      return null;
    }
  };
  
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.email);
            
            if (!mounted) return;

            setSession(session);
            
            if (session?.user) {
              console.log('User authenticated, fetching profile...');
              const profile = await fetchUserProfile(session.user.id);
              if (mounted) {
                setUser(profile || {
                  id: session.user.id,
                  name: session.user.user_metadata?.name || session.user.email || '',
                  email: session.user.email || '',
                  role: 'admin', // Default role
                });
                setIsLoading(false);
              }
            } else {
              console.log('No user session, clearing state');
              if (mounted) {
                setUser(null);
                setIsLoading(false);
              }
            }
          }
        );

        // Check for existing session only if initializing
        if (initializing) {
          const { data: { session: existingSession } } = await supabase.auth.getSession();
          console.log('Existing session check:', existingSession?.user?.email || 'none');
          
          if (existingSession?.user && mounted) {
            const profile = await fetchUserProfile(existingSession.user.id);
            setSession(existingSession);
            setUser(profile || {
              id: existingSession.user.id,
              name: existingSession.user.user_metadata?.name || existingSession.user.email || '',
              email: existingSession.user.email || '',
              role: 'admin',
            });
          }
          
          if (mounted) {
            setIsLoading(false);
            setInitializing(false);
          }
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setIsLoading(false);
          setInitializing(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, [initializing]);

  const login = async (email: string, password: string) => {
    console.log('Login attempt for:', email);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Login error:', error);
    } else {
      console.log('Login successful, auth state will be updated automatically');
    }
    
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
    await supabase.auth.signOut();
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
