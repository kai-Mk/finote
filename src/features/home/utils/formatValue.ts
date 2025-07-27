/**
 * 数値を3桁区切りでフォーマットする基本関数
 * @param amount - フォーマットする金額
 * @returns 3桁区切りの文字列
 */
export const formatNumber = (amount: number): string => {
  return amount.toLocaleString('ja-JP');
};

/**
 * 日付をYYYY-MM-DD形式でフォーマットする関数
 * @param year - 年
 * @param month - 月
 * @param day - 日
 * @returns YYYY-MM-DD形式の文字列
 */
export const getFormattedDate = (year: number, month: number, day: number) => {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};
