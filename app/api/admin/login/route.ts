import { NextResponse } from "next/server";
import { verifyAdminPassword, setAdminSession } from "@/lib/auth/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password = typeof body?.password === "string" ? body.password : "";

    if (!password) {
      return NextResponse.json(
        { error: "비밀번호를 입력하세요." },
        { status: 400 }
      );
    }

    if (!verifyAdminPassword(password)) {
      return NextResponse.json(
        { error: "비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    await setAdminSession();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json(
      { error: "로그인 처리에 실패했습니다." },
      { status: 500 }
    );
  }
}
