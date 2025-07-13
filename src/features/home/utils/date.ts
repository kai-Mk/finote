export type DateInfo = {
  year: number;
  month: number;
  day?: number;
};

/**現在の日付を取得 */
export const getCurrentDate = (): DateInfo => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return { year, month, day };
};

/**前の月を取得 */
export const getPreviousMonth = (currentDate: DateInfo): DateInfo => {
  const { year, month } = currentDate;

  if (month === 1) {
    return { year: year - 1, month: 12 };
  }

  return { year, month: month - 1 };
};

/**次の月を取得 */
export const getNextMonth = (currentDate: DateInfo): DateInfo => {
  const { year, month } = currentDate;

  if (month === 12) {
    return { year: year + 1, month: 1 };
  }

  return { year, month: month + 1 };
};

/**
 * 日付が同じかどうかを判定
 */
export const isSameMonth = (date1: DateInfo, date2: DateInfo): boolean => {
  return date1.year === date2.year && date1.month === date2.month;
};

/**
 * 今月かどうかを判定
 */
export const isCurrentMonth = (date: DateInfo): boolean => {
  const current = getCurrentDate();
  return isSameMonth(date, current);
};
