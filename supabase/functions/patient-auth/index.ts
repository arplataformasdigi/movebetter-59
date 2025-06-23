
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AuthRequest {
  email: string;
  password: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { email, password }: AuthRequest = await req.json();

    // Buscar paciente pelo email
    const { data: patientAccess, error } = await supabase
      .from('patient_app_access')
      .select(`
        *,
        patients (name, email)
      `)
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (error || !patientAccess) {
      return new Response(
        JSON.stringify({ success: false, error: 'Credenciais inválidas' }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, patientAccess.password_hash || '');
    
    if (!isValidPassword) {
      return new Response(
        JSON.stringify({ success: false, error: 'Credenciais inválidas' }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Remover senha do retorno por segurança
    const { password_hash, ...safePatientData } = patientAccess;

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: safePatientData 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in patient-auth function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
