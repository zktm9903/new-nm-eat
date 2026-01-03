import { DatePicker } from "@/components/DatePicker";

interface HeaderProps {
  date: Date;
}

export function Header({ date }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center max-w-[600px] mx-auto px-4">
        <DatePicker currentDate={date} />
      </div>
    </header>
  );
}
