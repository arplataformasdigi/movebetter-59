import { supabase } from "./lib/supabase";

export class DatabaseService {
  // Profile methods
  async getProfile(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async getProfileByEmail(email: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createProfile(profile: any) {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateProfile(id: string, updates: any) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Patient methods
  async getPatients() {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getPatient(id: string) {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async createPatient(patient: any) {
    const { data, error } = await supabase
      .from('patients')
      .insert(patient)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updatePatient(id: string, updates: any) {
    const { data, error } = await supabase
      .from('patients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deletePatient(id: string) {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Appointment methods
  async getAppointments() {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patients (
          name
        )
      `)
      .order('appointment_date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createAppointment(appointment: any) {
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointment)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateAppointment(id: string, updates: any) {
    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteAppointment(id: string) {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Treatment plan methods
  async getTreatmentPlans() {
    const { data, error } = await supabase
      .from('treatment_plans')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createTreatmentPlan(plan: any) {
    const { data, error } = await supabase
      .from('treatment_plans')
      .insert(plan)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateTreatmentPlan(id: string, updates: any) {
    const { data, error } = await supabase
      .from('treatment_plans')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteTreatmentPlan(id: string) {
    const { error } = await supabase
      .from('treatment_plans')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Financial transaction methods
  async getFinancialTransactions() {
    const { data, error } = await supabase
      .from('financial_transactions')
      .select(`
        *,
        financial_categories (
          name,
          color
        )
      `)
      .order('transaction_date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createFinancialTransaction(transaction: any) {
    const { data, error } = await supabase
      .from('financial_transactions')
      .insert(transaction)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateFinancialTransaction(id: string, updates: any) {
    const { data, error } = await supabase
      .from('financial_transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteFinancialTransaction(id: string) {
    const { error } = await supabase
      .from('financial_transactions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}

export const storage = new DatabaseService();
