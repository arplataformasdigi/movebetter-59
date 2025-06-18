
-- Criar tabela para trilhas de tratamento (treatment plans já existe, mas vamos ajustar se necessário)
-- A tabela treatment_plans já existe, então vamos focar nas outras

-- Criar tabela para configuração de pacotes (packages já existe)
-- A tabela packages já existe

-- Criar enum para status de agendamentos se não existir
DO $$ BEGIN
    CREATE TYPE appointment_status AS ENUM ('scheduled', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Criar enum para tipos de transação financeira
DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('income', 'expense');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Criar enum para status de pagamento
DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'overdue', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Criar tabela para propostas de pacotes
CREATE TABLE IF NOT EXISTS public.package_proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  package_id UUID REFERENCES public.packages(id),
  patient_name TEXT NOT NULL,
  package_price NUMERIC NOT NULL,
  transport_cost NUMERIC DEFAULT 0,
  other_costs NUMERIC DEFAULT 0,
  other_costs_note TEXT,
  payment_method TEXT NOT NULL,
  installments INTEGER DEFAULT 1,
  final_price NUMERIC NOT NULL,
  created_date DATE DEFAULT CURRENT_DATE,
  expiry_date DATE,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela para taxas de cartão de crédito
CREATE TABLE IF NOT EXISTS public.credit_card_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  rate NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Atualizar tabela de appointments se necessário
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS observations TEXT;

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.package_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_card_rates ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para package_proposals
CREATE POLICY "Users can view all package proposals" 
  ON public.package_proposals FOR SELECT 
  USING (true);

CREATE POLICY "Users can create package proposals" 
  ON public.package_proposals FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update package proposals" 
  ON public.package_proposals FOR UPDATE 
  USING (true);

CREATE POLICY "Users can delete package proposals" 
  ON public.package_proposals FOR DELETE 
  USING (true);

-- Criar políticas RLS para credit_card_rates
CREATE POLICY "Users can view all credit card rates" 
  ON public.credit_card_rates FOR SELECT 
  USING (true);

CREATE POLICY "Users can create credit card rates" 
  ON public.credit_card_rates FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update credit card rates" 
  ON public.credit_card_rates FOR UPDATE 
  USING (true);

CREATE POLICY "Users can delete credit card rates" 
  ON public.credit_card_rates FOR DELETE 
  USING (true);

-- Adicionar trigger para atualizar updated_at
CREATE OR REPLACE TRIGGER update_package_proposals_updated_at
  BEFORE UPDATE ON public.package_proposals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Adicionar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_package_proposals_package_id ON public.package_proposals(package_id);
CREATE INDEX IF NOT EXISTS idx_package_proposals_created_date ON public.package_proposals(created_date);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_date ON public.financial_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_type ON public.financial_transactions(type);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
