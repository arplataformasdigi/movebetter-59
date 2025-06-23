
-- Enable realtime for treatment_plans table
ALTER TABLE public.treatment_plans REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.treatment_plans;

-- Enable realtime for plan_exercises table  
ALTER TABLE public.plan_exercises REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.plan_exercises;
