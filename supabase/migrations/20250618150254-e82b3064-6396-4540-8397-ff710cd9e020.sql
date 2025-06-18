
-- Adicionar coluna cpf_cnpj na tabela profiles se não existir
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS cpf_cnpj TEXT;

-- Atualizar a função handle_new_user para incluir o CPF
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Inserir o perfil na tabela profiles
  INSERT INTO public.profiles (id, name, email, role, cpf_cnpj)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    'admin',
    NEW.raw_user_meta_data->>'cpf'
  );
  
  -- Retornar NEW para continuar a operação
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Em caso de erro, ainda permitir que o usuário seja criado
    -- mas logar o erro para debug
    RAISE WARNING 'Erro ao criar perfil do usuário: %', SQLERRM;
    RETURN NEW;
END;
$function$;
