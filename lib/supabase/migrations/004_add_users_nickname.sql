-- Add nickname column for board (one nickname per user)
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS nickname VARCHAR(255);
