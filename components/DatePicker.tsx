"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { formatDateToYYYYMMDD } from "@/lib/utils/date";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  currentDate: Date;
}

export function DatePicker({ currentDate }: DatePickerProps) {
  const router = useRouter();

  const handleDateChange = React.useCallback(
    (newDate: Date | undefined) => {
      if (!newDate) return;

      // 로컬 시간대 기준으로 날짜 문자열 생성 (시간대 문제 방지)
      const dateStr = formatDateToYYYYMMDD(newDate);
      const currentDateStr = formatDateToYYYYMMDD(currentDate);

      // 같은 날짜면 업데이트하지 않음
      if (currentDateStr === dateStr) return;

      // URL 업데이트만 (Next.js가 자동으로 서버 컴포넌트 리렌더링)
      router.push(`/?date=${dateStr}`, { scroll: false });
    },
    [currentDate, router]
  );

  // 주말(토요일=6, 일요일=0)을 비활성화하는 함수
  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 일요일 또는 토요일
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {format(currentDate, "yyyy년 M월 d일 EEEE", { locale: ko })}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={currentDate}
          onSelect={handleDateChange}
          locale={ko}
          initialFocus
          disabled={isWeekend}
        />
      </PopoverContent>
    </Popover>
  );
}
