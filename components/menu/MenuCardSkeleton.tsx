import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function MenuCardSkeleton() {
  return (
    <Card className="overflow-hidden pt-0 gap-2 pb-1">
      <div
        className="relative w-full bg-muted overflow-hidden animate-pulse"
        style={{ aspectRatio: "4/3" }}
      >
        <div className="w-full h-full bg-muted" />
      </div>
      <CardHeader className="p-3 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-muted rounded w-12 animate-pulse" />
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-1.5">
        <div className="space-y-2">
          <div className="h-3 bg-muted rounded w-full animate-pulse" />
          <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
        </div>
        <Separator />
        <div className="flex items-center justify-between gap-2">
          <div className="h-3 bg-muted rounded w-24 animate-pulse" />
          <div className="h-3 bg-muted rounded w-12 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

