import { Suspense } from "react";
import { Header } from "@/components/Header";
import { AutoRefresh } from "@/components/AutoRefresh";
import { parseYYYYMMDDToDate, formatDateToYYYYMMDD } from "@/lib/utils/date";
import { MenuListWrapper } from "@/components/menu/MenuListWrapper";
import { MenuListSkeleton } from "@/components/menu/MenuListSkeleton";

interface HomeProps {
  searchParams: Promise<{
    date?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  // Next.js 15+에서는 searchParams가 Promise입니다
  const params = await searchParams;
  const dateParam = params.date;

  // 로컬 시간대 기준으로 날짜 파싱 (시간대 문제 방지)
  const date = dateParam ? parseYYYYMMDDToDate(dateParam) : new Date();

  // 날짜 유효성 검사
  const validDate = isNaN(date.getTime()) ? new Date() : date;

  return (
    <>
      <AutoRefresh />
      <Header date={validDate} />
      <div className="container max-w-[600px] mx-auto px-4 py-6">
        <main>
          <Suspense
            fallback={<MenuListSkeleton />}
            key={formatDateToYYYYMMDD(validDate)}
          >
            <MenuListWrapper date={validDate} />
          </Suspense>
        </main>
      </div>
    </>
  );
}
