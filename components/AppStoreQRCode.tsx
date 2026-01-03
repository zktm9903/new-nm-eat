"use client";

import { QRCodeSVG } from "qrcode.react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

const APP_STORE_URL = "https://apps.apple.com/kr/app/nm-eat/id6741020395";

export function AppStoreQRCode() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Share2 className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="end">
        <div className="flex flex-col items-center gap-3">
          <h3 className="text-sm font-semibold">ミ๏ｖ๏彡 아이폰 앱 다운로드</h3>
          <div className="bg-white p-3 rounded-lg">
            <QRCodeSVG value={APP_STORE_URL} size={200} />
          </div>
          <p className="text-xs text-muted-foreground text-center max-w-[200px]">
            QR 코드를 스캔하여 App Store에서 앱을 다운로드하세요
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
