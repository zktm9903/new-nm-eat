import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/auth/admin";

export async function GET() {
  const ok = await isAdminSession();
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
