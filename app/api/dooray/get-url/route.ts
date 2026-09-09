import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    text: "https://nm-eat.sangcheol.site  (ΦωΦ)",
    responseType: "inChannel",
  });
}
