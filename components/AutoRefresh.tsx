"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AutoRefresh() {
  const router = useRouter();

  useEffect(() => {
    // 1분마다 페이지 새로고침
    const interval = setInterval(() => {
      router.refresh();
    }, 60 * 1000); // 1분 = 60초 * 1000ms

    return () => {
      clearInterval(interval);
    };
  }, [router]);

  return null; // UI를 렌더링하지 않음
}

