
-- Drop all existing policies for profiles to start fresh
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create simple policies that don't reference the profiles table itself
CREATE POLICY "Allow authenticated users to read profiles" ON profiles
  FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Also ensure all other tables have simple policies
-- Patient scores
ALTER TABLE patient_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view patient scores" ON patient_scores;
DROP POLICY IF EXISTS "Users can insert patient scores" ON patient_scores;
DROP POLICY IF EXISTS "Users can update patient scores" ON patient_scores;
DROP POLICY IF EXISTS "Users can delete patient scores" ON patient_scores;

CREATE POLICY "Enable all access for authenticated users" ON patient_scores
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Medical records
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view medical records" ON medical_records;
DROP POLICY IF EXISTS "Users can insert medical records" ON medical_records;
DROP POLICY IF EXISTS "Users can update medical records" ON medical_records;
DROP POLICY IF EXISTS "Users can delete medical records" ON medical_records;

CREATE POLICY "Enable all access for authenticated users" ON medical_records
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Plan exercises
ALTER TABLE plan_exercises ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view plan exercises" ON plan_exercises;
DROP POLICY IF EXISTS "Users can insert plan exercises" ON plan_exercises;
DROP POLICY IF EXISTS "Users can update plan exercises" ON plan_exercises;
DROP POLICY IF EXISTS "Users can delete plan exercises" ON plan_exercises;

CREATE POLICY "Enable all access for authenticated users" ON plan_exercises
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Exercises
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view exercises" ON exercises;
DROP POLICY IF EXISTS "Users can insert exercises" ON exercises;
DROP POLICY IF EXISTS "Users can update exercises" ON exercises;
DROP POLICY IF EXISTS "Users can delete exercises" ON exercises;

CREATE POLICY "Enable all access for authenticated users" ON exercises
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Patient packages
ALTER TABLE patient_packages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view patient packages" ON patient_packages;
DROP POLICY IF EXISTS "Users can insert patient packages" ON patient_packages;
DROP POLICY IF EXISTS "Users can update patient packages" ON patient_packages;
DROP POLICY IF EXISTS "Users can delete patient packages" ON patient_packages;

CREATE POLICY "Enable all access for authenticated users" ON patient_packages
  FOR ALL 
  USING (auth.role() = 'authenticated');
