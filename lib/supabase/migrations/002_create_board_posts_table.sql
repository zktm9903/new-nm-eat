-- Create board_posts table (자유게시판)
-- user_id: 작성자(users.id). 005에서 FK 추가 가능.
CREATE TABLE IF NOT EXISTS public.board_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for listing by newest first
CREATE INDEX IF NOT EXISTS idx_board_posts_created_at ON public.board_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_board_posts_user_id ON public.board_posts(user_id);

-- Enable RLS if you use it later (optional)
-- ALTER TABLE public.board_posts ENABLE ROW LEVEL SECURITY;
