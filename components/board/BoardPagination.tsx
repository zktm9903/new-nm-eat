import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BoardPaginationProps {
  currentPage: number;
  totalPages: number;
}

const itemClass =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2 text-sm transition-colors";

function hrefForPage(page: number) {
  return page <= 1 ? "/board" : `/board?page=${page}`;
}

/** 현재 페이지 좌우 1개 + 처음/마지막을 항상 노출하고 사이는 말줄임 처리 */
function buildPageItems(current: number, total: number): (number | "gap")[] {
  const shown = [1, total, current - 1, current, current + 1]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const items: (number | "gap")[] = [];
  let prev = 0;
  for (const page of shown) {
    if (page === prev) continue;
    if (prev !== 0 && page - prev > 1) items.push("gap");
    items.push(page);
    prev = page;
  }
  return items;
}

export function BoardPagination({
  currentPage,
  totalPages,
}: BoardPaginationProps) {
  if (totalPages <= 1) return null;

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav
      aria-label="게시판 페이지"
      className="flex items-center justify-center gap-1 pt-6"
    >
      {hasPrev ? (
        <Link
          href={hrefForPage(currentPage - 1)}
          aria-label="이전 페이지"
          className={cn(itemClass, "hover:bg-accent hover:text-accent-foreground")}
        >
          <ChevronLeft className="size-4" />
        </Link>
      ) : (
        <span
          aria-hidden
          className={cn(itemClass, "text-muted-foreground/40")}
        >
          <ChevronLeft className="size-4" />
        </span>
      )}

      {buildPageItems(currentPage, totalPages).map((item, i) =>
        item === "gap" ? (
          <span
            key={`gap-${i}`}
            aria-hidden
            className={cn(itemClass, "text-muted-foreground")}
          >
            …
          </span>
        ) : item === currentPage ? (
          <span
            key={item}
            aria-current="page"
            className={cn(
              itemClass,
              "bg-primary text-primary-foreground font-medium"
            )}
          >
            {item}
          </span>
        ) : (
          <Link
            key={item}
            href={hrefForPage(item)}
            aria-label={`${item}페이지`}
            className={cn(itemClass, "hover:bg-accent hover:text-accent-foreground")}
          >
            {item}
          </Link>
        )
      )}

      {hasNext ? (
        <Link
          href={hrefForPage(currentPage + 1)}
          aria-label="다음 페이지"
          className={cn(itemClass, "hover:bg-accent hover:text-accent-foreground")}
        >
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span
          aria-hidden
          className={cn(itemClass, "text-muted-foreground/40")}
        >
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
