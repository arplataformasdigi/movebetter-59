
// Supabase types - these should match your actual database schema
export interface Exercise {
  id: string;
  name: string;
  description?: string;
  instructions?: string;
  category?: string;
  difficulty_level?: number; // Make optional to match hook definition
  duration_minutes?: number;
  equipment_needed?: string[]; // Make optional to fix type compatibility
  image_url?: string;
  video_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface PlanExercise {
  id: string;
  exercise_id: string;
  treatment_plan_id: string;
  day_number: number;
  sets: number;
  repetitions: number;
  duration_minutes: number;
  is_completed: boolean;
  created_at: string;
  exercises?: Exercise;
}

export interface TreatmentPlan {
  id: string;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  patient_id?: string;
  progress_percentage?: number;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
  patients?: any[];
}

export interface Patient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  cpf?: string;
  birth_date?: string;
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  medical_history?: string;
  status?: 'active' | 'inactive' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface PackageProposal {
  id: string;
  patient_id?: string;
  patient_name: string;
  package_id?: string;
  package_name?: string;
  package_price: number;
  transport_cost?: number;
  other_costs?: number;
  other_costs_note?: string;
  installments?: number;
  final_price: number;
  payment_method: string;
  status?: 'pending' | 'approved' | 'rejected';
  approved_at?: string;
  created_date?: string;
  expiry_date?: string;
  created_at: string;
  updated_at?: string;
  packages?: any[];
}

export interface FinancialCategory {
  id: string;
  name: string;
  color: string;
  type: 'income' | 'expense';
  is_active?: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  conselho?: string;
  cpf_cnpj?: string;
  crefito?: string;
  cep?: string;
  street?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  number?: string;
  role: string;
  created_at: string;
  updated_at: string;
}
