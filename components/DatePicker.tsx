"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { formatDateToYYYYMMDD, parseYYYYMMDDToDate } from "@/lib/utils/date";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  dateStr: string;
}

export function DatePicker({ dateStr }: DatePickerProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  // YYYY-MM-DD 문자열을 로컬 자정 Date로 파싱 (캘린더/표시가 당일로 맞게)
  const currentDate = React.useMemo(
    () => parseYYYYMMDDToDate(dateStr),
    [dateStr]
  );

  const handleDateChange = React.useCallback(
    (newDate: Date | undefined) => {
      if (!newDate) return;

      const newDateStr = formatDateToYYYYMMDD(newDate);

      if (dateStr === newDateStr) {
        setOpen(false);
        return;
      }

      setOpen(false);
      router.push(`/?date=${newDateStr}`, { scroll: false });
    },
    [dateStr, router]
  );

  // 주말(토요일=6, 일요일=0)을 비활성화하는 함수
  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 일요일 또는 토요일
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
