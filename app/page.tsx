import { Suspense } from "react";
import { headers } from "next/headers";
import { Header } from "@/components/Header";
import { AutoRefresh } from "@/components/AutoRefresh";
import {
  parseYYYYMMDDToDate,
  formatDateToYYYYMMDD,
  getKoreaNow,
} from "@/lib/utils/date";
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

  // 쿼리 파라미터가 있으면 그대로 사용, 없으면 "한국 시간 기준 오늘" 사용
  const date = dateParam ? parseYYYYMMDDToDate(dateParam) : getKoreaNow();

  // 날짜 유효성 검사
  const validDate = isNaN(date.getTime()) ? new Date() : date;

  // 서버에서 User-Agent 확인하여 iOS 여부 판단
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);

  return (
    <>
      <AutoRefresh />
      <Header date={validDate} isIOS={isIOS} />
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
