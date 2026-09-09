import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/auth/admin";
import { getBoardPosts } from "@/lib/board/get-posts";

export async function GET() {
  const ok = await isAdminSession();
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    // 관리자 화면은 기존과 동일하게 최신 20개 배열만 반환한다
    const { posts } = await getBoardPosts(null);
    return NextResponse.json(posts);
  } catch (err) {
    console.error("Admin get posts error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
