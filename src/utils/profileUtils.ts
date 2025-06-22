
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { UserProfile, UserRole } from "@/types/auth";

export const createDefaultProfile = (authUser: User): UserProfile => {
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

export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  console.log('🔍 Starting profile fetch for userId:', userId);
  
  try {
    // Create a timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Profile fetch timeout')), 3000);
    });
    
    // Create the query promise
    const queryPromise = supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    console.log('📡 Making Supabase query to profiles table...');
    
    // Race the query against the timeout
    const { data: profile, error } = await Promise.race([
      queryPromise,
      timeoutPromise
    ]);
    
    console.log('📡 Supabase query completed', { 
      hasData: !!profile, 
      error: error?.message || 'none',
      errorCode: error?.code || 'none'
    });
    
    if (error) {
      console.error('❌ Profile fetch error:', error);
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
      return userProfile;
    }
    
    console.log('⚠️ No profile found in database');
    return null;
  } catch (error) {
    if (error instanceof Error && error.message === 'Profile fetch timeout') {
      console.warn('⏰ Profile fetch timed out');
    } else {
      console.error('💥 Exception in fetchUserProfile:', error);
    }
    return null;
  }
};
