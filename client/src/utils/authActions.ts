
import { supabase } from "@/integrations/supabase/client";

interface LoginData {
  email: string;
  password: string;
}

export const loginUser = async ({ email, password }: LoginData) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
};

interface RegisterData {
  email: string;
  password: string;
  name: string;
  cpf?: string;
}

export const registerUser = async ({ email, password, name, cpf }: RegisterData) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        cpf,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getCurrentSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};
