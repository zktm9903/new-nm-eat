/**
 * Date 객체를 YYYY-MM-DD 형식의 문자열로 변환 (로컬 시간대 기준)
 * 시간대 문제를 피하기 위해 toISOString() 대신 사용
 */
export function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * YYYY-MM-DD 형식의 문자열을 Date 객체로 변환 (로컬 시간대 기준)
 */
export function parseYYYYMMDDToDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

