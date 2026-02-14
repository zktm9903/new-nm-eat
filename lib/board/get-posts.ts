import { supabase } from "@/lib/supabase/server";
import type { BoardPost } from "@/types/board";

export async function getBoardPosts(
  currentUserId?: string | null
): Promise<BoardPost[]> {
  const { data, error } = await supabase
    .from("board_posts")
    .select("id, nickname, content, created_at, user_id")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    throw new Error(`Failed to fetch board posts: ${error.message}`);
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    nickname: row.nickname,
    content: row.content,
    createdAt: new Date(row.created_at),
    isMine:
      currentUserId != null &&
      row.user_id != null &&
      row.user_id === currentUserId,
  }));
}
