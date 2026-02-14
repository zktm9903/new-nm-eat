const CARD_COUNT = 5;

export function BoardListSkeleton() {
  return (
    <ul className="space-y-3">
      {Array.from({ length: CARD_COUNT }).map((_, i) => (
        <li key={i}>
          <div className="rounded-lg border bg-card px-2.5 py-2 grid gap-0.5 grid-cols-[auto_1fr] gap-x-2">
            <div className="size-4 bg-muted rounded shrink-0 animate-pulse translate-y-0.5 row-span-2" />
            <div className="flex items-center justify-between gap-2 min-w-0">
              <div className="h-4 bg-muted rounded w-20 animate-pulse" />
              <div className="h-4 bg-muted rounded w-24 shrink-0 animate-pulse" />
            </div>
            <div className="space-y-1.5 min-w-0">
              <div className="h-3 bg-muted rounded w-full animate-pulse" />
              <div className="h-3 bg-muted rounded w-[80%] animate-pulse" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
