import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

const COOKIE_NAME = process.env.COOKIE_NAME || "nhn-eat-session";

export async function getOrCreateUserToken(): Promise<string> {
  const cookieStore = await cookies();
  const existingToken = cookieStore.get(COOKIE_NAME);

  if (existingToken?.value) {
    return existingToken.value;
  }

  // 쿠키가 없으면 새로 생성 (미들웨어에서 처리되어야 하지만, 혹시 모를 경우를 대비)
  // 서버 컴포넌트에서는 cookies().set()이 제한될 수 있으므로,
  // 미들웨어에서 처리하는 것이 권장됨
  const newToken = uuidv4();

  // 쿠키 설정 시도 (실패해도 토큰은 반환)
  try {
    const isProduction = process.env.NODE_ENV === "production";
    cookieStore.set(COOKIE_NAME, newToken, {
      httpOnly: true,
      secure: isProduction, // 프로덕션에서만 HTTPS 필수
      sameSite: isProduction ? ("none" as const) : ("lax" as const), // 프로덕션에서만 iframe에서 쿠키 전송을 위해 'none'으로 설정
      maxAge: 60 * 60 * 24 * 365 * 100, // 100년 (평생)
      path: "/",
    });
  } catch (error) {
    // 쿠키 설정 실패 시에도 토큰은 반환
    // 미들웨어에서 처리되거나, 다음 요청에서 처리됨
    console.warn("Failed to set cookie, token will be used:", error);
  }

  return newToken;
}

export async function getUserToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME);
  return token?.value || null;
}
