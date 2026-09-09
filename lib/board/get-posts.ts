import { supabase } from "@/lib/supabase/server";
import type { BoardPost } from "@/types/board";

export const BOARD_PAGE_SIZE = 20;

export interface BoardPostsPage {
  posts: BoardPost[];
  /** 실제 조회된 페이지 (1-based, 범위를 벗어난 요청은 보정됨) */
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface GetBoardPostsOptions {
  page?: number;
  pageSize?: number;
}

interface BoardPostRow {
  id: string;
  nickname: string;
  content: string;
  created_at: string;
  user_id: string | null;
}

async function fetchTotal(): Promise<number> {
  const { count, error } = await supabase
    .from("board_posts")
    .select("id", { count: "exact", head: true });

  if (error) {
    throw new Error(`Failed to count board posts: ${error.message}`);
  }

  return count ?? 0;
}

async function fetchPage(
  page: number,
  pageSize: number,
  currentUserId?: string | null
): Promise<BoardPost[]> {
  const from = (page - 1) * pageSize;

  const { data, error } = await supabase
    .from("board_posts")
    .select("id, nickname, content, created_at, user_id")
    .order("created_at", { ascending: false })
    // created_at 동률일 때 페이지 경계에서 글이 중복/누락되지 않도록 2차 정렬
    .order("id", { ascending: false })
    .range(from, from + pageSize - 1);

  if (error) {
    throw new Error(`Failed to fetch board posts: ${error.message}`);
  }

  return ((data ?? []) as BoardPostRow[]).map((row) => ({
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

export async function getBoardPosts(
  currentUserId?: string | null,
  options?: GetBoardPostsOptions
): Promise<BoardPostsPage> {
  const pageSize = Math.max(1, Math.floor(options?.pageSize ?? BOARD_PAGE_SIZE));
  const requestedPage = Math.max(1, Math.floor(options?.page ?? 1));

  // 범위를 벗어난 range()는 PostgREST가 416으로 거절하므로 개수를 먼저 세고 보정한다
  const total = await fetchTotal();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(requestedPage, totalPages);

  const posts =
    total === 0 ? [] : await fetchPage(page, pageSize, currentUserId);

  return { posts, page, pageSize, total, totalPages };
}
