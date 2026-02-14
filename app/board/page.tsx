import Link from "next/link";
import { headers } from "next/headers";
import { BoardInput } from "@/components/board/BoardInput";
import { BoardPostItem } from "@/components/board/BoardPostItem";
import { getBoardPosts } from "@/lib/board/get-posts";
import { getOrCreateUserToken } from "@/lib/auth/token";

export default async function BoardPage() {
  const userToken = await getOrCreateUserToken();
  const posts = await getBoardPosts(userToken);

  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        style={{ paddingTop: isIOS ? "44px" : undefined }}
      >
        <div className="container flex h-14 items-center justify-between max-w-[600px] mx-auto px-4">
          <h1 className="text-xl font-semibold">자유게시판</h1>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            메뉴로
          </Link>
        </div>
      </header>
      <div className="container max-w-[600px] mx-auto px-4 py-6">
      <BoardInput />
      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post.id}>
            <BoardPostItem post={post} />
          </li>
        ))}
      </ul>
      </div>
    </>
  );
}
