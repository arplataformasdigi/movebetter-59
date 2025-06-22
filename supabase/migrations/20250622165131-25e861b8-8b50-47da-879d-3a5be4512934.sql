
-- Remove the patient_id column from financial_transactions table
ALTER TABLE public.financial_transactions 
DROP COLUMN IF EXISTS patient_id;

-- Ensure the table structure is correct for the financial transactions
-- Verify all necessary columns exist with proper types
ALTER TABLE public.financial_transactions 
ALTER COLUMN transaction_date SET DEFAULT CURRENT_DATE;
