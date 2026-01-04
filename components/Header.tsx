"use client";

import { useEffect, useState } from "react";
import { DatePicker } from "@/components/DatePicker";
import { AppStoreQRCode } from "@/components/AppStoreQRCode";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  date: Date;
  isIOS: boolean;
}

export function Header({ date, isIOS }: HeaderProps) {
  const [safeAreaTop, setSafeAreaTop] = useState("0px");
  const [hasDinnerMenu, setHasDinnerMenu] = useState(false);

  useEffect(() => {
    if (isIOS) {
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
  }, [isIOS]);

  // 저녁 메뉴 존재 여부 확인
  useEffect(() => {
    const checkDinnerMenu = () => {
      const dinnerSection = document.getElementById("dinner-section");
      setHasDinnerMenu(!!dinnerSection);
    };

    // 초기 확인
    checkDinnerMenu();

    // MutationObserver로 DOM 변경 감지
    const observer = new MutationObserver(checkDinnerMenu);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [date]);

  const scrollToDinner = () => {
    const dinnerSection = document.getElementById("dinner-section");
    if (dinnerSection) {
      const headerHeight = 56; // header 높이 + safe area 고려
      const yOffset =
        dinnerSection.getBoundingClientRect().top +
        window.scrollY -
        headerHeight;
      window.scrollTo({
        top: yOffset,
        behavior: "smooth",
      });
    }
  };

  return (
    <header
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      style={{
        paddingTop: safeAreaTop,
      }}
    >
      <div className="container flex h-14 items-center justify-between max-w-[600px] mx-auto px-4">
        <DatePicker currentDate={date} />
        <div className="flex items-center gap-2">
          {hasDinnerMenu && (
            <Button
              variant="outline"
              size="sm"
              onClick={scrollToDinner}
              className="text-xs"
            >
              저녁
            </Button>
          )}
          <AppStoreQRCode />
        </div>
      </div>
    </header>
  );
}
