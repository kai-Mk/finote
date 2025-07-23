/**
 * 数値を3桁区切りでフォーマットする基本関数
 * @param amount - フォーマットする金額
 * @returns 3桁区切りの文字列
 */
export const formatNumber = (amount: number): string => {
  return amount.toLocaleString('ja-JP');
};
