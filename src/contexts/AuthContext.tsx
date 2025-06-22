
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
  console.log('🏗️ AuthProvider: Component initialized');
  
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  console.log('🔄 AuthProvider: Initial state set', { 
    hasUser: !!user, 
    hasSession: !!session, 
    isLoading 
  });
  
  const createDefaultProfile = (authUser: User): UserProfile => {
    console.log('👤 Creating default profile for user:', authUser.email);
    const profile = {
      id: authUser.id,
      name: authUser.user_metadata?.name || authUser.email || 'Usuário',
      email: authUser.email || '',
      role: 'admin' as UserRole,
      crefito: authUser.user_metadata?.crefito,
      phone: authUser.user_metadata?.phone,
      cpf_cnpj: authUser.user_metadata?.cpf,
    };
    console.log('✅ Default profile created:', profile);
    return profile;
  };

  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    console.time('⏱️ fetchUserProfile');
    console.log('🔍 Starting profile fetch for userId:', userId);
    
    try {
      console.log('📡 Making Supabase query to profiles table...');
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      console.log('📡 Supabase query completed', { 
        hasData: !!profile, 
        error: error?.message || 'none',
        errorCode: error?.code || 'none'
      });
      
      if (error && error.code !== 'PGRST116') {
        console.error('❌ Profile fetch error:', error);
        console.timeEnd('⏱️ fetchUserProfile');
        return null;
      }

      if (profile) {
        console.log('✅ Profile found in database:', profile);
        const userProfile = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role as UserRole,
          crefito: profile.crefito || undefined,
          phone: profile.phone || undefined,
          cpf_cnpj: profile.cpf_cnpj || undefined,
        };
        console.log('🔄 Transformed profile:', userProfile);
        console.timeEnd('⏱️ fetchUserProfile');
        return userProfile;
      }
      
      console.log('⚠️ No profile found in database');
      console.timeEnd('⏱️ fetchUserProfile');
      return null;
    } catch (error) {
      console.error('💥 Exception in fetchUserProfile:', error);
      console.trace('Stack trace:');
      console.timeEnd('⏱️ fetchUserProfile');
      return null;
    }
  };
  
  useEffect(() => {
    console.log('🚀 AUTH INITIALIZATION STARTED');
    console.time('⏱️ Auth Initialization');
    
    // Verificar configuração do Supabase
    console.log('🔧 Supabase client config check:', {
      url: supabase.supabaseUrl,
      hasKey: !!supabase.supabaseKey,
      authUrl: supabase.auth.url
    });
    
    // Failsafe: garantir que isLoading seja resolvido
    const failsafeTimeout = setTimeout(() => {
      console.warn('⚠️ AUTH TIMEOUT: Forcing loading to false after 10 seconds');
      console.trace('Timeout stack trace:');
      setIsLoading(false);
    }, 10000);

    // Configure auth state listener
    console.log('📡 Setting up auth state change listener...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔔 AUTH STATE CHANGE EVENT:', event);
        console.log('📊 Session data:', {
          hasSession: !!session,
          userId: session?.user?.id || 'none',
          userEmail: session?.user?.email || 'none',
          tokenExpiry: session?.expires_at || 'none'
        });
        
        // Limpar o failsafe timeout
        clearTimeout(failsafeTimeout);
        console.log('✅ Failsafe timeout cleared');
        
        console.log('🔄 Setting session state...');
        setSession(session);
        
        if (session?.user) {
          console.log('👤 User authenticated, processing profile...');
          
          try {
            console.log('🔍 Fetching user profile from database...');
            const profile = await fetchUserProfile(session.user.id);
            
            if (profile) {
              console.log('✅ Setting user profile from database:', profile);
              setUser(profile);
            } else {
              console.log('⚠️ No profile found, creating default profile...');
              const defaultProfile = createDefaultProfile(session.user);
              console.log('🔄 Setting default profile:', defaultProfile);
              setUser(defaultProfile);
            }
          } catch (error) {
            console.error('💥 Error processing user profile:', error);
            console.trace('Profile processing error stack:');
            const defaultProfile = createDefaultProfile(session.user);
            console.log('🆘 Setting emergency default profile:', defaultProfile);
            setUser(defaultProfile);
          }
        } else {
          console.log('🚪 No user session, clearing user state');
          setUser(null);
        }
        
        console.log('🏁 Resolving loading state...');
        setIsLoading(false);
        console.timeEnd('⏱️ Auth Initialization');
        console.log('✅ AUTH INITIALIZATION COMPLETED');
      }
    );

    console.log('✅ Auth state listener configured');

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up auth context...');
      clearTimeout(failsafeTimeout);
      subscription.unsubscribe();
      console.log('✅ Auth context cleanup completed');
    };
  }, []);

  const login = async (email: string, password: string) => {
    console.log('🔐 LOGIN ATTEMPT:', email);
    console.time('⏱️ Login Process');
    setIsLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('❌ LOGIN ERROR:', error);
      console.timeEnd('⏱️ Login Process');
      setIsLoading(false);
    } else {
      console.log('✅ LOGIN SUCCESS - waiting for auth state change');
      console.timeEnd('⏱️ Login Process');
    }
    
    return { error };
  };

  const register = async (email: string, password: string, name: string, cpf?: string) => {
    console.log('📝 REGISTRATION ATTEMPT:', email);
    console.time('⏱️ Registration Process');
    
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
      console.error('❌ REGISTRATION ERROR:', error);
    } else {
      console.log('✅ REGISTRATION SUCCESS');
    }
    
    console.timeEnd('⏱️ Registration Process');
    return { error };
  };

  const logout = async () => {
    console.log('🚪 LOGOUT STARTED');
    console.time('⏱️ Logout Process');
    setIsLoading(true);
    setUser(null);
    setSession(null);
    await supabase.auth.signOut();
    setIsLoading(false);
    console.timeEnd('⏱️ Logout Process');
    console.log('✅ LOGOUT COMPLETED');
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
