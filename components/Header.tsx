"use client";

import { useEffect, useState } from "react";
import { DatePicker } from "@/components/DatePicker";
import { AppStoreQRCode } from "@/components/AppStoreQRCode";

interface HeaderProps {
  date: Date;
}

export function Header({ date }: HeaderProps) {
  const [isIOS] = useState(() => {
    if (typeof window === "undefined") return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  });
  const [safeAreaTop, setSafeAreaTop] = useState("0px");

  useEffect(() => {
    alert("safeAreaTop: " + safeAreaTop);
  }, [safeAreaTop]);

  useEffect(() => {
    alert(navigator.userAgent + " " + isIOS.toString());
    if (isIOS) {
      // safe-area-inset-top 값을 실제로 읽기
      const updateSafeArea = () => {
        const testEl = document.createElement("div");
        testEl.style.position = "fixed";
        testEl.style.top = "0";
        testEl.style.left = "0";
        testEl.style.width = "1px";
        testEl.style.height = "1px";
        testEl.style.paddingTop = "env(safe-area-inset-top)";
        testEl.style.visibility = "hidden";
        document.body.appendChild(testEl);

        const paddingTop = window.getComputedStyle(testEl).paddingTop;
        document.body.removeChild(testEl);

        setSafeAreaTop(paddingTop || "44px"); // 기본값 44px (다이나믹 아일랜드 높이)
      };

      // 다음 틱에서 실행하여 DOM이 준비된 후 실행
      setTimeout(updateSafeArea, 0);
    }
  }, [isIOS]);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      style={{
        paddingTop: safeAreaTop,
      }}
    >
      <div className="container flex h-14 items-center justify-between max-w-[600px] mx-auto px-4">
        <DatePicker currentDate={date} />
        <AppStoreQRCode />
      </div>
    </header>
  );
}
