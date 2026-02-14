import { NextResponse } from "next/server";
import { checkProfanity } from "glin-profanity";
import { createBoardPost } from "@/lib/board/create-post";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const content = typeof body?.content === "string" ? body.content : "";

    if (!content.trim()) {
      return NextResponse.json(
        { error: "content is required" },
        { status: 400 }
      );
    }

    const trimmed = content.trim();
    const profanityResult = checkProfanity(trimmed, {
      detectLeetspeak: true,
      languages: ["english", "korean"],
      replaceWith: "***",
    });
    const contentToSave =
      profanityResult.processedText !== undefined
        ? profanityResult.processedText
        : trimmed;

    const post = await createBoardPost(contentToSave);
    return NextResponse.json(post);
  } catch (err) {
    console.error("Board post create error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create post" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { getBoardPosts } = await import("@/lib/board/get-posts");
    const posts = await getBoardPosts();
    return NextResponse.json(posts);
  } catch (err) {
    console.error("Board posts fetch error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
