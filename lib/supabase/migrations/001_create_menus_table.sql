-- Create enum type for meal_type (if not exists)
DO $$ BEGIN
  CREATE TYPE meal_type_enum AS ENUM ('lunch', 'dinner');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create menus table
CREATE TABLE IF NOT EXISTS public.menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  calories INTEGER NOT NULL,
  meal_type meal_type_enum NOT NULL DEFAULT 'lunch',
  image_url TEXT,
  is_lunch_box BOOLEAN NOT NULL DEFAULT false,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, date)
);

-- Create index on date for faster queries
CREATE INDEX IF NOT EXISTS idx_menus_date ON public.menus(date);

-- Create index on meal_type for faster queries
CREATE INDEX IF NOT EXISTS idx_menus_meal_type ON public.menus(meal_type);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_menus_updated_at ON public.menus;
CREATE TRIGGER update_menus_updated_at
  BEFORE UPDATE ON public.menus
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

