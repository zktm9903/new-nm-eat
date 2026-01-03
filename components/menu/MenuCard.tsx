"use client";

import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MenuWithLike,
  toggleLikeMutationOptions,
} from "@/hooks/query-options/menu-options";
import { Flame, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuCardProps {
  menu: MenuWithLike;
  date: Date;
}

export function MenuCard({ menu }: MenuCardProps) {
  const router = useRouter();
  const [showPopAnimation, setShowPopAnimation] = useState(false);
  const [isLiking, setIsLiking] = useState(false); // 좋아요인지 취소인지 추적
  const defaultImageUrl = "/no-image-cat.gif";
  const imageUrl = menu.imageUrl || defaultImageUrl;

  // pop-cat.png 이미지 프리패칭
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.as = "image";
    link.href = "/pop-cat.png";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const mutation = useMutation({
    ...toggleLikeMutationOptions(menu.id!),
    onSuccess: () => {
      // API 성공 후 팝 애니메이션 표시
      setShowPopAnimation(true);
      setTimeout(() => {
        setShowPopAnimation(false);
      }, 1550); // 애니메이션 시간보다 약간 길게 설정하여 깜박임 방지

      // 서버 컴포넌트 리렌더링
      router.refresh();
    },
  });

  const handleCardClick = () => {
    if (menu.id) {
      // 클릭 전 상태 저장 (좋아요인지 취소인지)
      setIsLiking(!menu.liked);
      mutation.mutate();
    }
  };

  return (
    <>
      {/* 팝 캣 애니메이션 */}
      {showPopAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div
            className="relative"
            style={{
              animation:
                "popSpring 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards",
            }}
          >
            <Image
              src="/pop-cat.png"
              alt="Pop cat"
              width={120}
              height={120}
              className="drop-shadow-2xl"
              priority
            />
            {/* 좋아요일 때는 하트, 취소일 때는 blur */}
            {isLiking ? (
              <div className="absolute -top-2 -right-2">
                <Image
                  src="/heart.png"
                  alt="Heart"
                  width={40}
                  height={40}
                  className="drop-shadow-lg"
                  priority
                />
              </div>
            ) : (
              <div className="absolute -top-2 -right-2">
                <Image
                  src="/blur.png"
                  alt="Blur"
                  width={40}
                  height={40}
                  className="drop-shadow-lg"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      )}

      <Card
        className="overflow-hidden cursor-pointer transition-all hover:shadow-md pt-0 gap-2 pb-1 hover:scale-105"
        onClick={handleCardClick}
      >
        <div
          className="relative w-full bg-muted overflow-hidden"
          style={{ aspectRatio: "4/3" }}
        >
          <Image
            src={imageUrl}
            alt={menu.name}
            fill
            sizes="(max-width: 640px) 50vw, 384px"
            priority={false}
            loading="lazy"
            className="object-cover"
          />
        </div>
        <CardHeader className="p-3 pb-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold leading-tight line-clamp-2">
              {menu.name}
            </h3>
            {menu.isLunchBox && (
              <Badge variant="outline" className="text-xs">
                도시락
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-3 pt-0 space-y-1.5">
          <p className="text-xs text-muted-foreground line-clamp-2">
            {menu.description || "(=ↀωↀ=)"}
          </p>
          <Separator />
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 text-xs">
              {menu.calories > 0 ? (
                <>
                  <Flame className="h-3 w-3 text-orange-500" />
                  <span className="text-muted-foreground">
                    {menu.calories.toLocaleString()} kcal
                  </span>
                </>
              ) : (
                <span className="text-muted-foreground">
                  맛잇게 먹으면 0칼로리 다용~
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Heart
                className={cn(
                  "h-4 w-4",
                  (menu.liked || false) && "fill-red-500 text-red-500"
                )}
              />
              <span>{menu.likeCount || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
