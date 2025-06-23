
-- Remove a coluna package_id da tabela patient_packages
ALTER TABLE patient_packages DROP COLUMN IF EXISTS package_id;

-- Remove a tabela patient_packages completamente se não for mais necessária
DROP TABLE IF EXISTS patient_packages;
