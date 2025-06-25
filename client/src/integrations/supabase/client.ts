import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mdubcdedgtesrypicboc.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kdWJjZGVkZ3Rlc3J5cGljYm9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNDY3NzcsImV4cCI6MjA2NTgyMjc3N30.j7kNTAfr_eeQ70yedzOyrPNSbZFiajdCM-jvYNe_Os0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)