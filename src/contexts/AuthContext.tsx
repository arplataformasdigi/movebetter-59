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

// Interface local que estende o tipo do profile para incluir cpf_cnpj
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
  
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        
        if (session?.user) {
          // Defer profile fetching to avoid blocking auth state change
          setTimeout(async () => {
            try {
              // Fetch user profile from profiles table
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              if (profile && !error) {
                console.log('Profile loaded:', profile);
                const extendedProfile = profile as ExtendedProfile;
                setUser({
                  id: extendedProfile.id,
                  name: extendedProfile.name,
                  email: extendedProfile.email,
                  role: extendedProfile.role as UserRole,
                  crefito: extendedProfile.crefito || undefined,
                  phone: extendedProfile.phone || undefined,
                  cpf_cnpj: extendedProfile.cpf_cnpj || undefined,
                });
              } else {
                console.error('Error fetching profile:', error);
                // If profile doesn't exist, user email and ID are still available from session
                setUser({
                  id: session.user.id,
                  name: session.user.user_metadata?.name || session.user.email || '',
                  email: session.user.email || '',
                  role: 'admin', // Default role
                });
              }
            } catch (error) {
              console.error('Unexpected error fetching profile:', error);
            }
          }, 0);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        console.log('Existing session found:', session);
      }
      if (!session) {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    console.log('Attempting login for:', email);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Login error:', error);
    } else {
      console.log('Login successful');
    }
    
    return { error };
  };

  const register = async (email: string, password: string, name: string, cpf?: string) => {
    console.log('Attempting registration for:', email, 'with name:', name, 'and CPF:', cpf);
    
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
      console.log('Registration initiated successfully');
    }
    
    return { error };
  };

  const logout = async () => {
    console.log('Logging out user');
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        login,
        register,
        logout,
        isAuthenticated: !!session,
        isLoading,
      }}
    >
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
