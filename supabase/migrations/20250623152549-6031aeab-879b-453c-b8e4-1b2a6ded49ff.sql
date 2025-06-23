
-- Enable realtime for package_proposals table
ALTER TABLE public.package_proposals REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.package_proposals;

-- Enable realtime for financial_transactions table
ALTER TABLE public.financial_transactions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.financial_transactions;

-- Enable realtime for financial_categories table
ALTER TABLE public.financial_categories REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.financial_categories;

-- Create patient app access table for permissions
CREATE TABLE public.patient_app_access (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  allowed_pages TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(patient_id, user_id)
);

-- Enable RLS on patient_app_access
ALTER TABLE public.patient_app_access ENABLE ROW LEVEL SECURITY;

-- Create policies for patient_app_access
CREATE POLICY "Users can view their own access permissions" 
  ON public.patient_app_access 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage patient access" 
  ON public.patient_app_access 
  FOR ALL 
  USING (true);

-- Enable realtime for patient_app_access
ALTER TABLE public.patient_app_access REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.patient_app_access;

-- Add password field to patients table for login
ALTER TABLE public.patients ADD COLUMN password_hash TEXT;

-- Create trigger to update updated_at for patient_app_access
CREATE TRIGGER update_patient_app_access_updated_at
  BEFORE UPDATE ON public.patient_app_access
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
