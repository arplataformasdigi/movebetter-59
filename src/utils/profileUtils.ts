
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
  console.time('⏱️ fetchUserProfile');
  console.log('🔍 Starting profile fetch for userId:', userId);
  
  try {
    console.log('📡 Making Supabase query to profiles table...');
    
    // Add a timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Profile fetch timeout')), 5000);
    });
    
    const queryPromise = supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    const { data: profile, error } = await Promise.race([queryPromise, timeoutPromise]) as any;
    
    console.log('📡 Supabase query completed', { 
      hasData: !!profile, 
      error: error?.message || 'none',
      errorCode: error?.code || 'none'
    });
    
    if (error) {
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
    console.timeEnd('⏱️ fetchUserProfile');
    return null;
  }
};
