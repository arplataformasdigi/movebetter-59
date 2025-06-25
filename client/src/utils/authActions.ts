


export const loginUser = async (email: string, password: string) => {
  console.log('🔐 LOGIN ATTEMPT:', email);
  console.time('⏱️ Login Process');
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    console.error('❌ LOGIN ERROR:', error);
    console.timeEnd('⏱️ Login Process');
  } else {
    console.log('✅ LOGIN SUCCESS - waiting for auth state change');
    console.timeEnd('⏱️ Login Process');
  }
  
  return { error };
};

export const registerUser = async (email: string, password: string, name: string, cpf?: string) => {
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

export const logoutUser = async () => {
  console.log('🚪 LOGOUT STARTED');
  console.time('⏱️ Logout Process');
  await supabase.auth.signOut();
  console.timeEnd('⏱️ Logout Process');
  console.log('✅ LOGOUT COMPLETED');
};
