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

  useEffect(() => {
    alert(navigator.userAgent + " " + isIOS.toString());
  }, [isIOS]);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      style={{
        paddingTop: isIOS ? "env(safe-area-inset-top)" : "0px",
      }}
    >
      <div className="container flex h-14 items-center justify-between max-w-[600px] mx-auto px-4">
        <DatePicker currentDate={date} />
        <AppStoreQRCode />
      </div>
    </header>
  );
}
