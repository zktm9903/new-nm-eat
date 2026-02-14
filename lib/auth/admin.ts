import { cookies } from "next/headers";

const ADMIN_COOKIE = "admin-session";
const ADMIN_PW = process.env.ADMIN_PW ?? "4567";

export function verifyAdminPassword(password: string): boolean {
  return password === ADMIN_PW;
}

export async function setAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}

export async function isAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const v = cookieStore.get(ADMIN_COOKIE);
  return v?.value === "1";
}
