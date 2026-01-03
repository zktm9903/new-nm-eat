import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

const COOKIE_NAME = process.env.COOKIE_NAME || "nhn-eat-session";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // 쿠키가 없으면 새로 생성
  const existingToken = request.cookies.get(COOKIE_NAME);

  if (!existingToken?.value) {
    const newToken = uuidv4();
    const isProduction = process.env.NODE_ENV === "production";
    response.cookies.set(COOKIE_NAME, newToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? ("none" as const) : ("lax" as const),
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
