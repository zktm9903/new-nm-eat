-- Link board posts to users so authors can delete their own posts
-- 1) 컬럼만 추가 (REFERENCES 없이, 순서/테이블 의존 없음)
ALTER TABLE public.board_posts
ADD COLUMN IF NOT EXISTS user_id UUID;

-- 2) 인덱스
CREATE INDEX IF NOT EXISTS idx_board_posts_user_id ON public.board_posts(user_id);
