import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/server";
import { isAdminSession } from "@/lib/auth/admin";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  const ok = await isAdminSession();
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { postId } = await params;
    if (!postId) {
      return NextResponse.json({ error: "postId required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("board_posts")
      .delete()
      .eq("id", postId);

    if (error) {
      throw new Error(error.message);
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Admin delete post error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to delete post" },
      { status: 500 }
    );
  }
}
