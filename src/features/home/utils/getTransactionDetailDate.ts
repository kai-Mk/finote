import { SelectedDate } from '../types/calendar';

const daysOfWeekLabel = ['日', '月', '火', '水', '木', '金', '土'];

/**
 * 指定された日付の取引詳細を取得する関数
 * @param selectedDate - 選択された日付
 * @returns 取引詳細の日付文字列（例: '2023年3月15日(水)'）
 */
export const getTransactionDetailDate = (selectedDate: SelectedDate) => {
  const { year, month, date } = selectedDate;
  const dateObject = new Date(year, month - 1, date);
  const dayOfWeek = dateObject.getDay();
  const dayOfWeekLabel = daysOfWeekLabel[dayOfWeek];

  return `${month}月${date}日(${dayOfWeekLabel})`;
};
