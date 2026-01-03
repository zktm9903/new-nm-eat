import { Separator } from "@/components/ui/separator";
import { MenuCardSkeleton } from "./MenuCardSkeleton";

export function MenuListSkeleton() {
  return (
    <div className="space-y-6">
      {/* 점심 메뉴 스켈레톤 */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-6 bg-muted rounded w-12 animate-pulse" />
          <Separator className="flex-1" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <MenuCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* 저녁 메뉴 스켈레톤 */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-6 bg-muted rounded w-12 animate-pulse" />
          <Separator className="flex-1" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <MenuCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

