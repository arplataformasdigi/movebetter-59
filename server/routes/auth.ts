import type { Request, Response } from "express";
import { supabase } from "../lib/supabase";

export async function registerUser(req: Request, res: Response) {
  try {
    const { name, email, password, cpf } = req.body;

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        name,
        cpf,
        role: 'admin',
      },
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // Create profile in database
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        name,
        email,
        role: 'admin',
        cpf_cnpj: cpf,
      })
      .select()
      .single();

    if (profileError) {
      console.error('Profile creation error:', profileError);
    }

    res.status(201).json({
      success: true,
      user: {
        id: authData.user.id,
        name,
        email,
        role: 'admin',
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    res.json({
      success: true,
      user: {
        id: data.user.id,
        name: profile?.name || data.user.user_metadata?.name || data.user.email,
        email: data.user.email,
        role: profile?.role || data.user.user_metadata?.role || 'admin',
      },
      session: data.session,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function patientAuth(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // Buscar acesso do paciente
    const { data: patientAccess, error } = await supabase
      .from('patient_app_access')
      .select(`
        *,
        patients (
          name,
          email
        )
      `)
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (error || !patientAccess) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    res.json({
      success: true,
      data: patientAccess,
    });
  } catch (error) {
    console.error("Patient auth error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}