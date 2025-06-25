// Types for database tables - keeping compatibility with existing hooks
export interface Patient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  cpf?: string;
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  medical_history?: string;
  status?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  patient_id?: string;
  appointment_date: string;
  appointment_time: string;
  session_type: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  duration_minutes?: number;
  notes?: string;
  observations?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  patients?: {
    name: string;
  };
}

export interface FinancialTransaction {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  transaction_date: string;
  due_date?: string;
  payment_date?: string;
  payment_status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  category_id?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  financial_categories?: {
    name: string;
    color?: string;
  };
}
