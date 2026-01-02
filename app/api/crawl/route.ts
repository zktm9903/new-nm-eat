import { NextRequest, NextResponse } from 'next/server';
import { crawlAndSaveMenus } from '@/lib/crawling/menu.service';

export async function POST(request: NextRequest) {
  try {
    // 시크릿 키 확인 (보안)
    const authHeader = request.headers.get('authorization');
    const secretKey = process.env.CRAWL_API_SECRET;

    if (secretKey && authHeader !== `Bearer ${secretKey}`) {
      return NextResponse.json(
        {
          success: false,
          message: '인증에 실패했습니다.',
          error: 'Invalid authorization token',
        },
        { status: 401 },
      );
    }

    // 크롤링 실행
    const result = await crawlAndSaveMenus();

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: '크롤링 중 예상치 못한 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

// GET 요청도 허용 (테스트용, 프로덕션에서는 제거 권장)
export async function GET(request: NextRequest) {
  try {
    // 시크릿 키 확인 (보안)
    const authHeader = request.headers.get('authorization');
    const secretKey = process.env.CRAWL_API_SECRET;

    if (secretKey && authHeader !== `Bearer ${secretKey}`) {
      return NextResponse.json(
        {
          success: false,
          message: '인증에 실패했습니다.',
          error: 'Invalid authorization token',
        },
        { status: 401 },
      );
    }

    // 크롤링 실행
    const result = await crawlAndSaveMenus();

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: '크롤링 중 예상치 못한 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

