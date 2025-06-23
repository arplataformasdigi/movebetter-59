
-- Adicionar coluna status na tabela patient_medical_records para controlar alta
ALTER TABLE patient_medical_records 
ADD COLUMN status text DEFAULT 'active' CHECK (status IN ('active', 'discharged'));

-- Habilitar realtime para todas as tabelas relevantes
ALTER TABLE patients REPLICA IDENTITY FULL;
ALTER TABLE patient_packages REPLICA IDENTITY FULL;
ALTER TABLE patient_pre_evaluations REPLICA IDENTITY FULL;
ALTER TABLE patient_medical_records REPLICA IDENTITY FULL;
ALTER TABLE patient_evolutions REPLICA IDENTITY FULL;

-- Adicionar as tabelas ao realtime
ALTER PUBLICATION supabase_realtime ADD TABLE patients;
ALTER PUBLICATION supabase_realtime ADD TABLE patient_packages;
ALTER PUBLICATION supabase_realtime ADD TABLE patient_pre_evaluations;
ALTER PUBLICATION supabase_realtime ADD TABLE patient_medical_records;
ALTER PUBLICATION supabase_realtime ADD TABLE patient_evolutions;
