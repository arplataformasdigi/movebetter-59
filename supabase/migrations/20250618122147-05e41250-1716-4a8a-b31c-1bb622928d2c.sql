
-- Primeiro, vamos remover o trigger e função existentes e recriar com as permissões corretas
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recriar a função com permissões adequadas e tratamento de erro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Inserir o perfil na tabela profiles
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    'admin'
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recriar o trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Garantir que a tabela profiles tenha as permissões corretas
GRANT INSERT, SELECT, UPDATE ON public.profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
