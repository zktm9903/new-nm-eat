import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/server";
import { getOrCreateUserToken } from "@/lib/auth/token";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    if (!postId) {
      return NextResponse.json({ error: "postId required" }, { status: 400 });
    }

    const userToken = await getOrCreateUserToken();

    const { data: post, error: fetchError } = await supabase
      .from("board_posts")
      .select("id, user_id")
      .eq("id", postId)
      .single();

    if (fetchError || !post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.user_id !== userToken) {
      return NextResponse.json(
        { error: "본인이 작성한 글만 삭제할 수 있습니다." },
        { status: 403 }
      );
    }

    const { error: deleteError } = await supabase
      .from("board_posts")
      .delete()
      .eq("id", postId);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Board post delete error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to delete post" },
      { status: 500 }
    );
  }
}
