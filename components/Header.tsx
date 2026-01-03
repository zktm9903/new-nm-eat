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
    if (isIOS) {
      // 웹뷰/Standalone 앱인지 확인
      const isStandalone =
        "standalone" in window.navigator &&
        (window.navigator as { standalone?: boolean }).standalone === true;
      const isDisplayModeStandalone = window.matchMedia(
        "(display-mode: standalone)"
      ).matches;
      const isInWebView = isStandalone || isDisplayModeStandalone;
      alert("isIOS: " + isIOS.toString());
      alert("isStandalone: " + isStandalone.toString());
      alert("isDisplayModeStandalone: " + isDisplayModeStandalone.toString());
      alert("isInWebView: " + isInWebView.toString());

      if (isInWebView) {
        // CSS 변수에서 safe-area-inset-top 값을 읽기
        const updateSafeArea = () => {
          const root = document.documentElement;
          const computedStyle = getComputedStyle(root);
          const safeAreaValue = computedStyle
            .getPropertyValue("--safe-area-inset-top")
            .trim();

          // 값이 있고 0px이 아니면 사용, 아니면 기본값 사용
          if (safeAreaValue && safeAreaValue !== "0px") {
            setSafeAreaTop(safeAreaValue);
          } else {
            // 다이나믹 아일랜드가 있는 기기를 위한 기본값 (일반적으로 44px~59px)
            setSafeAreaTop("44px");
          }
        };

        // DOM이 준비된 후 실행
        setTimeout(updateSafeArea, 0);
      }
    }
  }, [isIOS]);

  useEffect(() => {
    alert("safeAreaTop: " + safeAreaTop);
  }, [safeAreaTop]);

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
