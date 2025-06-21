
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
      
      console.log('Profile not found');
      return null;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  const handleAuthStateChange = async (event: string, newSession: Session | null) => {
    console.log('Auth state changed:', event, newSession?.user?.email || 'no session');
    
    setSession(newSession);
    
    if (newSession?.user) {
      try {
        console.log('Processing user profile...');
        const profile = await fetchUserProfile(newSession.user.id);
        
        if (profile) {
          setUser(profile);
        } else {
          // Create default profile if none exists
          const defaultProfile = createDefaultProfile(newSession.user);
          setUser(defaultProfile);
          console.log('Using default profile:', defaultProfile);
        }
      } catch (error) {
        console.error('Error processing user profile:', error);
        // Always create a basic profile so user can continue
        const defaultProfile = createDefaultProfile(newSession.user);
        setUser(defaultProfile);
      }
    } else {
      console.log('No user session, clearing state');
      setUser(null);
    }
    
    // Always set loading to false after processing
    setIsLoading(false);
  };
  
  useEffect(() => {
    console.log('Initializing auth...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Check for existing session - this will trigger the auth state change if there's a session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      console.log('Initial session check:', existingSession?.user?.email || 'none');
      
      // If no existing session, immediately stop loading
      if (!existingSession) {
        console.log('No existing session, stopping loading');
        setIsLoading(false);
      }
      // If there is a session, the auth state change handler will be called automatically
    });

    return () => {
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
    } else {
      console.log('Login successful');
      // Don't set loading to false here - let auth state change handle it
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
