import { MenuList } from "@/components/menu/MenuList";
import { Header } from "@/components/Header";
import { AutoRefresh } from "@/components/AutoRefresh";
import { getMenusWithLikeByDate } from "@/lib/menus/get-menus-with-like";
import { parseYYYYMMDDToDate } from "@/lib/utils/date";

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
  
  // 서버 컴포넌트에서 직접 메뉴 데이터 가져오기 (좋아요 상태 포함)
  const menus = await getMenusWithLikeByDate(validDate);

  return (
    <>
      <AutoRefresh />
      <Header date={validDate} />
      <div className="container max-w-[600px] mx-auto px-4 py-6">
        <main>
          <MenuList menus={menus} date={validDate} />
        </main>
      </div>
    </>
  );
}
