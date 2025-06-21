
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
  
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        
        // If profile doesn't exist, return null but don't treat as error
        if (error.code === 'PGRST116') {
          console.log('Profile not found, will create default profile');
          return null;
        }
        
        return null;
      }

      if (profile) {
        console.log('Profile loaded successfully:', profile);
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
      
      return null;
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
            console.log('Auth state changed:', event, session?.user?.email || 'no session');
            
            if (!mounted) return;

            setSession(session);
            
            if (session?.user) {
              console.log('User authenticated, fetching profile...');
              
              try {
                const profile = await fetchUserProfile(session.user.id);
                
                if (mounted) {
                  if (profile) {
                    setUser(profile);
                  } else {
                    // Create default user profile if none exists
                    console.log('Creating default profile for user');
                    const defaultProfile: UserProfile = {
                      id: session.user.id,
                      name: session.user.user_metadata?.name || session.user.email || 'Usuário',
                      email: session.user.email || '',
                      role: 'admin', // Default role
                    };
                    setUser(defaultProfile);
                  }
                  setIsLoading(false);
                }
              } catch (profileError) {
                console.error('Error in profile fetch:', profileError);
                if (mounted) {
                  // Even if profile fetch fails, create a basic user object
                  const basicProfile: UserProfile = {
                    id: session.user.id,
                    name: session.user.user_metadata?.name || session.user.email || 'Usuário',
                    email: session.user.email || '',
                    role: 'admin',
                  };
                  setUser(basicProfile);
                  setIsLoading(false);
                }
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

        // Check for existing session
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        console.log('Existing session check:', existingSession?.user?.email || 'none');
        
        if (!existingSession?.user && mounted) {
          // No existing session, stop loading
          setIsLoading(false);
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    console.log('Login attempt for:', email);
    
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
