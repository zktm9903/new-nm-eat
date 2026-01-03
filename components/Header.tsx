"use client";

import { useEffect, useState } from "react";
import { DatePicker } from "@/components/DatePicker";
import { AppStoreQRCode } from "@/components/AppStoreQRCode";

interface HeaderProps {
  date: Date;
}

export function Header({ date }: HeaderProps) {
  const [safeAreaTop, setSafeAreaTop] = useState("0px");

  useEffect(() => {
    // 웹뷰 환경 감지 및 safe-area-inset-top 값 읽기
    const updateSafeArea = () => {
      // iOS 기기인지 확인 (안드로이드는 다이나믹 아일랜드가 없으므로 제외)
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

      // iOS에서 웹뷰/Standalone 앱만 감지 (일반 사파리 브라우저는 제외)
      const isStandalone =
        "standalone" in window.navigator &&
        (window.navigator as { standalone?: boolean }).standalone === true;
      const isDisplayModeStandalone = window.matchMedia(
        "(display-mode: standalone)"
      ).matches;

      // iOS 기기이면서 웹뷰 또는 Standalone 모드일 때만 safe-area 적용
      const isInWebView = isIOS && (isStandalone || isDisplayModeStandalone);

      if (isInWebView) {
        // safe-area-inset-top 값을 읽기 위해 임시 요소 생성
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

        setSafeAreaTop(paddingTop || "0px");
      } else {
        setSafeAreaTop("0px");
      }
    };

    updateSafeArea();
    window.addEventListener("resize", updateSafeArea);
    window.addEventListener("orientationchange", updateSafeArea);

    return () => {
      window.removeEventListener("resize", updateSafeArea);
      window.removeEventListener("orientationchange", updateSafeArea);
    };
  }, []);

  return (
    <div
      className="sticky top-0 z-50 w-full bg-background"
      style={{
        paddingTop: safeAreaTop,
      }}
    >
      <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between max-w-[600px] mx-auto px-4">
          <DatePicker currentDate={date} />
          <AppStoreQRCode />
        </div>
      </header>
    </div>
  );
}
