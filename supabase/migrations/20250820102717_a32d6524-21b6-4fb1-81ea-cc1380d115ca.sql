-- إنشاء دوال RPC للمصادقة
CREATE OR REPLACE FUNCTION user_login(p_email TEXT, p_password TEXT)
RETURNS TABLE(
  id UUID,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.phone,
    u.created_at
  FROM public.users u
  WHERE u.email = p_email 
  AND u.password_hash = p_password;
END;
$$;

CREATE OR REPLACE FUNCTION user_register(
  p_email TEXT,
  p_password TEXT,
  p_first_name TEXT DEFAULT '',
  p_last_name TEXT DEFAULT '',
  p_phone TEXT DEFAULT ''
)
RETURNS TABLE(
  id UUID,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- التحقق من وجود البريد الإلكتروني
  IF EXISTS (SELECT 1 FROM public.users WHERE email = p_email) THEN
    RAISE EXCEPTION 'User already exists';
  END IF;

  -- إنشاء المستخدم الجديد
  INSERT INTO public.users (email, password_hash, first_name, last_name, phone)
  VALUES (p_email, p_password, p_first_name, p_last_name, p_phone)
  RETURNING public.users.id INTO new_user_id;

  -- إرجاع بيانات المستخدم الجديد
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.phone,
    u.created_at
  FROM public.users u
  WHERE u.id = new_user_id;
END;
$$;