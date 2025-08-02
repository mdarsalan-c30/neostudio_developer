-- Create admin user account with email/password
-- Note: This creates a user in auth.users and assigns admin role

-- First, insert a user directly into auth.users (for development purposes)
-- In production, create users through Supabase Dashboard > Authentication > Users

-- Create admin role for the current user (you'll need to replace this with actual user ID)
-- For now, we'll create a function to easily add admin roles

CREATE OR REPLACE FUNCTION public.make_user_admin(user_email text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Find user by email
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = user_email;
  
  -- Check if user exists
  IF target_user_id IS NULL THEN
    RETURN 'User not found with email: ' || user_email;
  END IF;
  
  -- Insert admin role (or update if exists)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN 'Admin role granted to user: ' || user_email;
END;
$$;

-- Example usage (uncomment and replace with your email):
-- SELECT public.make_user_admin('admin@example.com');