"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleLikeMutationOptions } from "@/hooks/query-options/menu-options";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  menuId: string;
  liked: boolean;
  likeCount: number;
}

export function LikeButton({ menuId, liked, likeCount }: LikeButtonProps) {
  const router = useRouter();

  const mutation = useMutation({
    ...toggleLikeMutationOptions(menuId),
    onSuccess: () => {
      // 서버 컴포넌트 리렌더링
      router.refresh();
    },
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    mutation.mutate();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={mutation.isPending}
      className={cn(
        "gap-1.5 h-auto p-1.5",
        liked && "text-red-500 hover:text-red-600"
      )}
    >
      <Heart
        className={cn(
          "h-4 w-4",
          liked && "fill-current"
        )}
      />
      <span className="text-xs">{likeCount}</span>
    </Button>
  );
}

