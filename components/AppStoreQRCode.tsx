"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { MoreHorizontal, QrCode, PawPrint, Check } from "lucide-react";
import { ANIMALS, useSelectedAnimals } from "@/hooks/use-selected-animals";
import { cn } from "@/lib/utils";

const APP_STORE_URL = "https://apps.apple.com/kr/app/nm-eat/id6741020395";

export function AppStoreQRCode() {
  const [qrDrawerOpen, setQrDrawerOpen] = useState(false);
  const [animalDrawerOpen, setAnimalDrawerOpen] = useState(false);
  const { selectedAnimals, toggleAnimal, hasChosen, markAsChosen } = useSelectedAnimals();

  useEffect(() => {
    if (!hasChosen) {
      setAnimalDrawerOpen(true);
      markAsChosen();
    }
  }, [hasChosen]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setQrDrawerOpen(true)}>
            <QrCode className="h-4 w-4" />
            앱스토어 QR코드
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setAnimalDrawerOpen(true)}>
            <PawPrint className="h-4 w-4" />
            동물 선택
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 앱스토어 QR 코드 Drawer */}
      <Drawer open={qrDrawerOpen} onOpenChange={setQrDrawerOpen}>
        <DrawerContent>
          <div className="max-w-[600px] mx-auto w-full">
            <DrawerHeader>
              <DrawerTitle>ミ๏ｖ๏彡 아이폰 앱 다운로드</DrawerTitle>
              <DrawerDescription>
                QR 코드를 스캔하여 App Store에서 앱을 다운로드하세요
              </DrawerDescription>
            </DrawerHeader>
            <div className="flex justify-center pb-10 pt-4">
              <div className="bg-white p-4 rounded-xl">
                <QRCodeSVG value={APP_STORE_URL} size={200} />
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* 동물 선택 Drawer */}
      <Drawer open={animalDrawerOpen} onOpenChange={setAnimalDrawerOpen}>
        <DrawerContent>
          <div className="max-w-[600px] mx-auto w-full">
          <DrawerHeader>
            <DrawerTitle>이미지 없을 때 보여줄 동물</DrawerTitle>
            <DrawerDescription>
              선택한 동물들 중에서 랜덤으로 보여줘요 (최소 1마리)
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex gap-3 px-4 pb-10 pt-2 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
            {ANIMALS.map((animal) => {
              const isSelected = selectedAnimals.includes(animal.key);
              const isLast = selectedAnimals.length === 1 && isSelected;
              return (
                <button
                  key={animal.key}
                  onClick={() => toggleAnimal(animal.key)}
                  disabled={isLast}
                  className={cn(
                    "relative overflow-hidden rounded-xl shrink-0 w-36 h-36 transition-all",
                    isLast ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                  )}
                >
                  <Image
                    src={animal.src}
                    alt={animal.label}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {/* 선택 오버레이 */}
                  <div
                    className={cn(
                      "absolute inset-0 transition-all duration-200",
                      isSelected
                        ? "bg-black/50"
                        : "bg-black/0 hover:bg-black/10"
                    )}
                  />
                  {/* 체크 아이콘 */}
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-full bg-white/20 p-2 backdrop-blur-sm">
                        <Check className="h-8 w-8 text-white" strokeWidth={3} />
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
