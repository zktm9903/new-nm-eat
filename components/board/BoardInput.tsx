"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function BoardInput() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || isSubmitting) return;
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/board/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: value.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data?.error === "string" ? data.error : "전송에 실패했습니다.");
        return;
      }
      setValue("");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("전송에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 mb-4"
    >
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <div className="flex gap-2">
      <Input
        type="text"
        placeholder="내용을 입력하세요"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 min-w-0"
      />
<Button type="submit" size="default" disabled={isSubmitting}>
          {isSubmitting ? "전송 중…" : "전송"}
        </Button>
      </div>
    </form>
  );
}
