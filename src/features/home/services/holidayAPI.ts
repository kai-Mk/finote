export type HolidayData = {
  [date: string]: string;
};

/**
 * 祝日データをキャッシュするためのMap
 */
const holidayCache = new Map<number, HolidayData>();

/**
 * 指定した年の祝日データを取得
 */
export const fetchHolidayData = async (year: number): Promise<HolidayData> => {
  // キャッシュがあれば返す
  if (holidayCache.has(year)) {
    return holidayCache.get(year)!;
  }

  try {
    const response = await fetch(
      `https://holidays-jp.github.io/api/v1/${String(year)}/date.json`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: HolidayData = await response.json();

    // キャッシュに保存
    holidayCache.set(year, data);

    return data;
  } catch (error) {
    console.error('祝日データの取得に失敗:', error);
    // エラー時は空のオブジェクトを返す
    return {};
  }
};

/**
 * 日付文字列をフォーマット (YYYY-MM-DD)
 */
export const formatDateForApi = (
  year: number,
  month: number,
  date: number
): string => {
  return `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
};

/**
 * 祝日かどうかを判定（年を指定して自動で祝日データを取得）
 */
export const isHolidayFromData = async (
  year: number,
  month: number,
  date: number
): Promise<boolean> => {
  const holidayData = await fetchHolidayData(year);
  const dateStr = formatDateForApi(year, month, date);
  return dateStr in holidayData;
};
