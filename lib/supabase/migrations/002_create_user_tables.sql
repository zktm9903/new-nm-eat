-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_banned BOOLEAN NOT NULL DEFAULT false
);

-- Create user_menus table
CREATE TABLE IF NOT EXISTS public.user_menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  menu_id UUID NOT NULL REFERENCES public.menus(id) ON DELETE CASCADE,
  liked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, menu_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_menus_user_id ON public.user_menus(user_id);
CREATE INDEX IF NOT EXISTS idx_user_menus_menu_id ON public.user_menus(menu_id);

-- Create function to update updated_at timestamp for user_menus
CREATE OR REPLACE FUNCTION update_user_menus_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at for user_menus
DROP TRIGGER IF EXISTS update_user_menus_updated_at ON public.user_menus;
CREATE TRIGGER update_user_menus_updated_at
  BEFORE UPDATE ON public.user_menus
  FOR EACH ROW
  EXECUTE FUNCTION update_user_menus_updated_at();

