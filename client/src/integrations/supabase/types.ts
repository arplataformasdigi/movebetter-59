
// Supabase types - these should match your actual database schema
export interface Exercise {
  id: string;
  name: string;
  description?: string;
  instructions?: string;
  category?: string;
  difficulty_level: number;
  duration_minutes?: number;
  equipment_needed: string[];
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
  created_at: string;
  updated_at: string;
  patients?: any[];
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface PackageProposal {
  id: string;
  patient_id: string;
  total_value: number;
  transport_cost?: number;
  other_costs?: number;
  installments?: number;
  status: 'pending' | 'approved' | 'rejected';
  approved_at?: string;
  created_at: string;
  updated_at: string;
  packages: any[];
}

export interface FinancialCategory {
  id: string;
  name: string;
  color: string;
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
