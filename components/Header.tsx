import { DatePicker } from "@/components/DatePicker";
import { AppStoreQRCode } from "@/components/AppStoreQRCode";

interface HeaderProps {
  date: Date;
}

export function Header({ date }: HeaderProps) {
  return (
    <header
      className="sticky z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      style={{ top: "env(safe-area-inset-top)" }}
    >
      <div className="container flex h-14 items-center justify-between max-w-[600px] mx-auto px-4">
        <DatePicker currentDate={date} />
        <AppStoreQRCode />
      </div>
    </header>
  );
}
