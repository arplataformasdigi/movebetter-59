


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
  console.log('🔍 Fetching profile for userId:', userId);
  
  try {
    // Timeout mais rápido para evitar travamentos
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Profile timeout')), 1500)
    );
    
    const profilePromise = supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    const { data: profile, error } = await Promise.race([profilePromise, timeoutPromise]);
    
    console.log('📡 Profile query result:', { 
      hasData: !!profile, 
      error: error?.message || 'none'
    });
    
    if (error) {
      console.error('❌ Profile fetch error:', error);
      return null;
    }

    if (profile) {
      console.log('✅ Profile found:', profile.name);
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
    
    console.log('⚠️ No profile found in database');
    return null;
  } catch (error) {
    console.error('💥 Exception in fetchUserProfile:', error);
    return null;
  }
};
