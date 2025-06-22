
-- First, let's ensure we have some default financial categories
INSERT INTO public.financial_categories (name, type, color, is_active) VALUES
('Consultas', 'income', '#10B981', true),
('Sessões de Fisioterapia', 'income', '#059669', true),
('Pacotes de Tratamento', 'income', '#047857', true),
('Equipamentos', 'expense', '#EF4444', true),
('Aluguel', 'expense', '#DC2626', true),
('Materiais', 'expense', '#B91C1C', true),
('Marketing', 'expense', '#991B1B', true)
ON CONFLICT DO NOTHING;

-- Update financial_transactions table to ensure proper foreign key relationships
ALTER TABLE public.financial_transactions 
DROP CONSTRAINT IF EXISTS financial_transactions_category_id_fkey;

ALTER TABLE public.financial_transactions 
ADD CONSTRAINT financial_transactions_category_id_fkey 
FOREIGN KEY (category_id) REFERENCES public.financial_categories(id);

-- Ensure we have proper indexes for performance
CREATE INDEX IF NOT EXISTS idx_financial_transactions_category_id ON public.financial_transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_financial_categories_type ON public.financial_categories(type);
