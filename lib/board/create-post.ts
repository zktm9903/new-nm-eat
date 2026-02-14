import { generateKoreanName } from "ko-unique-name-generator";
import { supabase } from "@/lib/supabase/server";
import { getOrCreateUserToken } from "@/lib/auth/token";
import type { BoardPost } from "@/types/board";

export async function createBoardPost(content: string): Promise<BoardPost> {
  const userToken = await getOrCreateUserToken();

  // 사용자 조회 또는 생성
  let { data: user, error: userError } = await supabase
    .from("users")
    .select("id, nickname")
    .eq("id", userToken)
    .single();

  if (userError || !user) {
    const { data: newUser, error: createError } = await supabase
      .from("users")
      .insert({ id: userToken })
      .select("id")
      .single();
    if (createError || !newUser) {
      throw new Error("Failed to get or create user");
    }
    user = { id: newUser.id, nickname: null };
  }

  // 닉네임 없으면 생성 후 고정
  let nickname = user.nickname ?? null;
  if (!nickname) {
    nickname = generateKoreanName({ digits: 4, delimiter: "" });
    await supabase
      .from("users")
      .update({ nickname })
      .eq("id", userToken);
  }

  const { data, error } = await supabase
    .from("board_posts")
    .insert({
      nickname,
      content: content.trim(),
      user_id: userToken,
    })
    .select("id, nickname, content, created_at")
    .single();

  if (error) {
    throw new Error(`Failed to create board post: ${error.message}`);
  }

  return {
    id: data.id,
    nickname: data.nickname,
    content: data.content,
    createdAt: new Date(data.created_at),
  };
}
