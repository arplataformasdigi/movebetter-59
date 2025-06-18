
-- Remove the plan_type_id column from treatment_plans table
ALTER TABLE treatment_plans DROP COLUMN IF EXISTS plan_type_id;

-- Drop the plan_types table since it's no longer needed
DROP TABLE IF EXISTS plan_types CASCADE;

-- Fix RLS policies for profiles table to prevent infinite recursion
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;

-- Create simple, non-recursive RLS policies for profiles
CREATE POLICY "Enable read access for authenticated users" ON profiles
  FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users" ON profiles
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Fix RLS policies for other tables to prevent recursion issues
-- Treatment plans
ALTER TABLE treatment_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view treatment plans" ON treatment_plans;
DROP POLICY IF EXISTS "Users can insert treatment plans" ON treatment_plans;
DROP POLICY IF EXISTS "Users can update treatment plans" ON treatment_plans;
DROP POLICY IF EXISTS "Users can delete treatment plans" ON treatment_plans;

CREATE POLICY "Enable all access for authenticated users" ON treatment_plans
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Patients
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view patients" ON patients;
DROP POLICY IF EXISTS "Users can insert patients" ON patients;
DROP POLICY IF EXISTS "Users can update patients" ON patients;
DROP POLICY IF EXISTS "Users can delete patients" ON patients;

CREATE POLICY "Enable all access for authenticated users" ON patients
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Appointments
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view appointments" ON appointments;
DROP POLICY IF EXISTS "Users can insert appointments" ON appointments;
DROP POLICY IF EXISTS "Users can update appointments" ON appointments;
DROP POLICY IF EXISTS "Users can delete appointments" ON appointments;

CREATE POLICY "Enable all access for authenticated users" ON appointments
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Financial transactions
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view financial transactions" ON financial_transactions;
DROP POLICY IF EXISTS "Users can insert financial transactions" ON financial_transactions;
DROP POLICY IF EXISTS "Users can update financial transactions" ON financial_transactions;
DROP POLICY IF EXISTS "Users can delete financial transactions" ON financial_transactions;

CREATE POLICY "Enable all access for authenticated users" ON financial_transactions
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Financial categories
ALTER TABLE financial_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view financial categories" ON financial_categories;
DROP POLICY IF EXISTS "Users can insert financial categories" ON financial_categories;
DROP POLICY IF EXISTS "Users can update financial categories" ON financial_categories;
DROP POLICY IF EXISTS "Users can delete financial categories" ON financial_categories;

CREATE POLICY "Enable all access for authenticated users" ON financial_categories
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Packages
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view packages" ON packages;
DROP POLICY IF EXISTS "Users can insert packages" ON packages;
DROP POLICY IF EXISTS "Users can update packages" ON packages;
DROP POLICY IF EXISTS "Users can delete packages" ON packages;

CREATE POLICY "Enable all access for authenticated users" ON packages
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Package proposals
ALTER TABLE package_proposals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view package proposals" ON package_proposals;
DROP POLICY IF EXISTS "Users can insert package proposals" ON package_proposals;
DROP POLICY IF EXISTS "Users can update package proposals" ON package_proposals;
DROP POLICY IF EXISTS "Users can delete package proposals" ON package_proposals;

CREATE POLICY "Enable all access for authenticated users" ON package_proposals
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Credit card rates
ALTER TABLE credit_card_rates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view credit card rates" ON credit_card_rates;
DROP POLICY IF EXISTS "Users can insert credit card rates" ON credit_card_rates;
DROP POLICY IF EXISTS "Users can update credit card rates" ON credit_card_rates;
DROP POLICY IF EXISTS "Users can delete credit card rates" ON credit_card_rates;

CREATE POLICY "Enable all access for authenticated users" ON credit_card_rates
  FOR ALL 
  USING (auth.role() = 'authenticated');
