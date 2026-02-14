import Link from "next/link";
import { BoardInput } from "@/components/board/BoardInput";
import { BoardPostItem } from "@/components/board/BoardPostItem";
import { getBoardPosts } from "@/lib/board/get-posts";
import { getOrCreateUserToken } from "@/lib/auth/token";

export default async function BoardPage() {
  const userToken = await getOrCreateUserToken();
  const posts = await getBoardPosts(userToken);

  return (
    <div className="container max-w-[600px] mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">자유게시판</h1>
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          메뉴로
        </Link>
      </div>
      <BoardInput />
      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post.id}>
            <BoardPostItem post={post} />
          </li>
        ))}
      </ul>
    </div>
  );
}
