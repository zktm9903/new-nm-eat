import Link from "next/link";
import { headers } from "next/headers";
import { BoardListSkeleton } from "@/components/board/BoardListSkeleton";

export default async function BoardLoading() {
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
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex gap-2">
            <div className="flex-1 min-w-0 h-10 bg-muted rounded-md animate-pulse" />
            <div className="h-10 w-14 bg-muted rounded-md animate-pulse" />
          </div>
        </div>
        <BoardListSkeleton />
      </div>
    </>
  );
}
