import { SelectedDate } from '../types/calendar';

export const getIsDisplayButton = (selectedDate: SelectedDate) => {
  if (!selectedDate) return false;

  const { year, month, date } = selectedDate;
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentDate = new Date().getDate();

  // 選択した日付が今日よりも未来の場合はfalseを返す
  if (year > currentYear) {
    return false;
  }

  if (year === currentYear && month > currentMonth) {
    return false;
  }

  if (year === currentYear && month === currentMonth && date > currentDate) {
    return false;
  }

  // それ以外（今日以前の日付）はtrueを返す
  return true;
};
