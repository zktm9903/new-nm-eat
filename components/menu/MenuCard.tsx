"use client";

import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MenuWithLike,
  toggleLikeMutationOptions,
} from "@/hooks/query-options/menu-options";
import { Flame, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

import "animate.css";

interface MenuCardProps {
  menu: MenuWithLike;
  date: Date;
}

export function MenuCard({ menu }: MenuCardProps) {
  const [isLiking, setIsLiking] = useState(menu.liked || false);
  const [animationClass, setAnimationClass] = useState<string | null>(null);
  const defaultImageUrl = useMemo(() => {
    const fallbackImages = [
      "/no-image-cat.gif",
      "/no-image-dog.gif",
      "/no-image-guinea-pig.gif",
    ];
    const randomIndex = Math.floor(Math.random() * fallbackImages.length);
    return fallbackImages[randomIndex];
  }, []);
  const imageUrl = menu.imageUrl || defaultImageUrl;

  // menu props가 변경될 때마다 isLiking 업데이트
  // menu prop 동기화를 위해 필요하므로 eslint-disable 사용
  useEffect(() => {
    const menuLiked = menu.liked || false;
    if (isLiking !== menuLiked) {
      setIsLiking(menuLiked);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menu.liked]);

  const mutation = useMutation({
    ...toggleLikeMutationOptions(menu.id!),
    onMutate: async () => {
      const previousIsLiking = isLiking;
      const newIsLiking = !isLiking;

      // 좋아요는 jello, 좋아요 취소는 hinge 후 bounceInUp 애니메이션
      if (newIsLiking) {
        // 좋아요: jello (약 1초)
        setAnimationClass("animate__jello");
        // 낙관적 업데이트: 즉시 UI 업데이트
        setIsLiking(newIsLiking);
        setTimeout(() => {
          setAnimationClass(null);
        }, 1000);
      } else {
        // 좋아요 취소: hinge 후 bounceInUp (hinge 2초 + bounceInUp 약 1초)
        setAnimationClass("animate__hinge");
        setTimeout(() => {
          setAnimationClass("animate__bounceInUp");
          // 낙관적 업데이트: 즉시 UI 업데이트
          setIsLiking(newIsLiking);
          setTimeout(() => {
            setAnimationClass(null);
          }, 1000);
        }, 2000);
      }

      return { previousIsLiking };
    },
    onSuccess: () => {
      // API 성공 시 추가 작업 없음 (낙관적 업데이트로 이미 UI 업데이트됨, 1분마다 재패칭)
    },
    onError: (error, variables, context) => {
      // API 실패 시 이전 상태로 롤백
      if (context) {
        setIsLiking(context.previousIsLiking);
      }
      // 애니메이션 중단
      setAnimationClass(null);
      console.error("Failed to toggle like:", error);
    },
  });

  const handleCardClick = () => {
    if (menu.id && !animationClass) {
      mutation.mutate();
    }
  };

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all hover:shadow-md pt-0 gap-2 pb-1",
        animationClass ? "cursor-not-allowed" : "cursor-pointer",
        animationClass && "animate__animated",
        animationClass
      )}
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
              className={cn("h-4 w-4", isLiking && "fill-red-500 text-red-500")}
            />
            <span>
              {(menu.likeCount || 0) +
                (isLiking && !menu.liked ? 1 : 0) -
                (!isLiking && menu.liked ? 1 : 0)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
