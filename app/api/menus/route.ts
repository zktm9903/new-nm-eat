import { NextRequest, NextResponse } from 'next/server';
import { getMenusWithLikeByDate } from '@/lib/menus/get-menus-with-like';
import { parseYYYYMMDDToDate } from '@/lib/utils/date';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dateParam = searchParams.get('date');
    
    // 로컬 시간대 기준으로 날짜 파싱 (시간대 문제 방지)
    const date = dateParam ? parseYYYYMMDDToDate(dateParam) : new Date();
    const validDate = isNaN(date.getTime()) ? new Date() : date;
    
    // 메뉴 조회 (좋아요 상태 포함)
    const menus = await getMenusWithLikeByDate(validDate);
    
    return NextResponse.json({ menus });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

