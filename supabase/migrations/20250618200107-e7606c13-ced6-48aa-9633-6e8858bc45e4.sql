
-- Verificar e atualizar a tabela package_proposals para garantir que todos os campos necessários existam
ALTER TABLE package_proposals 
ADD COLUMN IF NOT EXISTS package_name TEXT;

-- Adicionar foreign key para packages se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'package_proposals_package_id_fkey'
    ) THEN
        ALTER TABLE package_proposals 
        ADD CONSTRAINT package_proposals_package_id_fkey 
        FOREIGN KEY (package_id) REFERENCES packages(id);
    END IF;
END $$;

-- Habilitar RLS na tabela se não estiver habilitada
ALTER TABLE package_proposals ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para package_proposals
DROP POLICY IF EXISTS "Users can view all proposals" ON package_proposals;
DROP POLICY IF EXISTS "Users can create proposals" ON package_proposals;
DROP POLICY IF EXISTS "Users can update proposals" ON package_proposals;
DROP POLICY IF EXISTS "Users can delete proposals" ON package_proposals;

CREATE POLICY "Users can view all proposals" ON package_proposals
    FOR SELECT USING (true);

CREATE POLICY "Users can create proposals" ON package_proposals
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update proposals" ON package_proposals
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete proposals" ON package_proposals
    FOR DELETE USING (true);
