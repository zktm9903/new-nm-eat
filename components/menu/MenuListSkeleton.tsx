import { Separator } from "@/components/ui/separator";
import { MenuCardSkeleton } from "./MenuCardSkeleton";

export function MenuListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="h-6 bg-muted rounded w-12 animate-pulse" />
        <Separator className="flex-1" />
      </div>
      <div className="grid grid-cols-1 gap-4 [@media(min-width:600px)]:grid-cols-2">
        <MenuCardSkeleton />
      </div>
    </div>
  );
}
