import { MenuCardSkeleton } from "./MenuCardSkeleton";

export function MenuListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <MenuCardSkeleton key={i} />
      ))}
    </div>
  );
}
