
-- Modificar a tabela patient_app_access para remover permissões e melhorar a autenticação
ALTER TABLE patient_app_access 
DROP COLUMN IF EXISTS allowed_pages;

-- Adicionar coluna para email e senha do paciente se não existir
ALTER TABLE patient_app_access 
ADD COLUMN IF NOT EXISTS email text UNIQUE,
ADD COLUMN IF NOT EXISTS password_hash text,
ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id);

-- Adicionar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_patient_app_access_email ON patient_app_access(email);
CREATE INDEX IF NOT EXISTS idx_patient_app_access_created_by ON patient_app_access(created_by);

-- Habilitar RLS na tabela
ALTER TABLE patient_app_access ENABLE ROW LEVEL SECURITY;

-- Política para permitir que administradores vejam apenas os pacientes que cadastraram
CREATE POLICY "Admins can view their own patient app access" 
ON patient_app_access 
FOR SELECT 
TO authenticated 
USING (created_by = auth.uid());

-- Política para permitir que administradores criem acesso para pacientes
CREATE POLICY "Admins can create patient app access" 
ON patient_app_access 
FOR INSERT 
TO authenticated 
WITH CHECK (created_by = auth.uid());

-- Política para permitir que administradores atualizem acesso dos pacientes que cadastraram
CREATE POLICY "Admins can update their own patient app access" 
ON patient_app_access 
FOR UPDATE 
TO authenticated 
USING (created_by = auth.uid());

-- Política para permitir que administradores deletem acesso dos pacientes que cadastraram
CREATE POLICY "Admins can delete their own patient app access" 
ON patient_app_access 
FOR DELETE 
TO authenticated 
USING (created_by = auth.uid());
