"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Cat, Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BoardPost } from "@/types/board";

interface BoardPostItemProps {
  post: BoardPost;
}

export function BoardPostItem({ post }: BoardPostItemProps) {
  const router = useRouter();
  const [showOverlay, setShowOverlay] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("이 글을 삭제할까요?")) return;
    const res = await fetch(`/api/board/posts/${post.id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data?.error ?? "삭제에 실패했습니다.");
      return;
    }
    router.refresh();
  };

  return (
    <div
      className="relative cursor-pointer"
      onClick={() => setShowOverlay((v) => !v)}
      role="button"
      aria-label={post.isMine ? "삭제 메뉴 열기" : "카드 열기"}
    >
      <Alert className="relative">
        <Cat />
        <AlertTitle className="flex items-center justify-between gap-2">
          <span>{post.nickname}{post.isMine ? " (나)" : ""}</span>
          <span className="text-muted-foreground font-normal shrink-0">
            {format(post.createdAt, "yyyy년 MM월 dd일")}
          </span>
        </AlertTitle>
        <AlertDescription className="flex-1 min-w-0">{post.content}</AlertDescription>
      </Alert>

      <>
        <div
          className={cn(
            "absolute inset-0 rounded-lg bg-black/60 backdrop-blur-[2px] z-10 transition-all duration-200",
            showOverlay ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          aria-hidden
        />
        {post.isMine ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 z-20 gap-1.5 transition-opacity duration-200",
              showOverlay ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
            onClick={handleDelete}
            aria-label="글 삭제"
          >
            <Trash2 className="size-4" />
            삭제
          </Button>
        ) : (
          <p
            className={cn(
              "absolute inset-0 flex items-center justify-center z-20 text-white text-sm font-medium transition-opacity duration-200",
              showOverlay ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          >
            왜 눌렀어요
          </p>
        )}
      </>
    </div>
  );
}
