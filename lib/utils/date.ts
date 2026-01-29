/**
 * 한국 시간(Asia/Seoul) 기준의 "지금" Date 객체를 반환
 * 서버가 UTC 타임존일 때도 한국 기준 "오늘"을 안정적으로 얻기 위함
 */
export function getKoreaNow(): Date {
  const now = new Date();
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const koreaTime = utcTime + 9 * 60 * 60 * 1000; // UTC+9
  return new Date(koreaTime);
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
