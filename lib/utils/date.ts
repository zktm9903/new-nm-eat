const KOREA_OFFSET_MS = 9 * 60 * 60 * 1000;

/**
 * 한국 시간(Asia/Seoul) 기준의 "지금" Date 객체를 반환
 * 서버 타임존에 관계없이, 반환된 Date의 getUTC* 로 읽으면 한국 시각과 맞음
 */
export function getKoreaNow(): Date {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  return new Date(utcMs + KOREA_OFFSET_MS);
}

/**
 * 한국 시간 기준 "오늘"의 YYYY-MM-DD 문자열을 반환
 * 서버 타임존과 무관하게 항상 한국 날짜만 사용 (캘린더/메뉴 조회 일치)
 */
export function getKoreaTodayString(): string {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const koreaMs = utcMs + KOREA_OFFSET_MS;
  const d = new Date(koreaMs);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Date 객체를 YYYY-MM-DD 형식의 문자열로 변환
 * 기본적으로 한국 시간(Asia/Seoul) 기준으로 동작하도록 설계
 */
export function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * YYYY-MM-DD 형식의 문자열을 Date 객체로 변환 (로컬 시간대 기준)
 */
export function parseYYYYMMDDToDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}
